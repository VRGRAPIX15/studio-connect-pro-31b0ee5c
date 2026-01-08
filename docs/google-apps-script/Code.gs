/**
 * Studio CRM - Google Apps Script Backend
 * ========================================
 * Production-ready backend API for Studio CRM
 * Uses Google Sheets as database and Google Drive for storage.
 * 
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy this entire code
 * 4. Run setupSpreadsheet() to create all sheets
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy the Web App URL to your frontend environment variable
 */

// ==================== CONFIGURATION ====================
// Replace these with your actual IDs after setup
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '';
const DRIVE_FOLDER_ID = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID') || '';

// Sheet names
const SHEETS = {
  CLIENTS: 'Clients',
  LEADS: 'Leads',
  BOOKINGS: 'Bookings',
  CONTRACTS: 'Contracts',
  INVOICES: 'Invoices',
  TASKS: 'Tasks',
  USERS: 'Users',
  ACTIVITY_LOG: 'ActivityLog',
  PAYMENTS: 'Payments',
  SETTINGS: 'Settings',
  // Passport Photo Module
  PASSPORT_CUSTOMERS: 'PassportCustomers',
  PASSPORT_ORDERS: 'PassportOrders',
  PASSPORT_PRICES: 'PassportPrices',
  PASSPORT_SETTINGS: 'PassportSettings'
};

// ==================== INITIAL SETUP ====================

/**
 * Run this function once to set up the spreadsheet structure
 */
function setupSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create all required sheets with headers
  const sheetsConfig = {
    [SHEETS.USERS]: ['Id', 'Email', 'Password', 'Name', 'Phone', 'Role', 'Avatar', 'IsActive', 'CreatedAt', 'LastLogin'],
    [SHEETS.CLIENTS]: ['Id', 'Name', 'Phone', 'Email', 'Address', 'Source', 'TotalBookings', 'TotalSpent', 'Notes', 'CreatedAt', 'UpdatedAt', 'LastEventDate'],
    [SHEETS.LEADS]: ['Id', 'Name', 'Phone', 'Email', 'Source', 'Status', 'EventType', 'EventDate', 'Budget', 'Notes', 'AssignedTo', 'CreatedAt', 'UpdatedAt', 'FollowUpDate'],
    [SHEETS.BOOKINGS]: ['Id', 'ClientId', 'ClientName', 'EventType', 'EventDate', 'EventTime', 'Venue', 'Status', 'Package', 'TotalAmount', 'AdvancePaid', 'BalanceDue', 'AssignedTeam', 'Notes', 'ContractId', 'CreatedAt', 'UpdatedAt'],
    [SHEETS.CONTRACTS]: ['Id', 'ContractNumber', 'BookingId', 'ClientId', 'ClientName', 'ClientEmail', 'TemplateId', 'EventType', 'EventDate', 'Venue', 'PackageName', 'TotalAmount', 'Content', 'Terms', 'Status', 'SentAt', 'SignedAt', 'ExpiresAt', 'SignatureUrl', 'SignerName', 'SignerIp', 'CreatedAt', 'UpdatedAt'],
    [SHEETS.INVOICES]: ['Id', 'InvoiceNumber', 'BookingId', 'ClientId', 'ClientName', 'Items', 'Subtotal', 'TaxAmount', 'Discount', 'TotalAmount', 'PaidAmount', 'BalanceDue', 'Status', 'DueDate', 'CreatedAt', 'UpdatedAt'],
    [SHEETS.PAYMENTS]: ['Id', 'InvoiceId', 'Amount', 'Method', 'Reference', 'Notes', 'ReceivedBy', 'CreatedAt'],
    [SHEETS.TASKS]: ['Id', 'Title', 'Description', 'AssignedTo', 'RelatedType', 'RelatedId', 'Priority', 'Status', 'DueDate', 'CompletedAt', 'CreatedAt'],
    [SHEETS.ACTIVITY_LOG]: ['Id', 'Type', 'UserId', 'EntityId', 'Description', 'Timestamp'],
    [SHEETS.SETTINGS]: ['Key', 'Value', 'UpdatedAt']
  };
  
  for (const [sheetName, headers] of Object.entries(sheetsConfig)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Clear and set headers
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  // Store spreadsheet ID in script properties
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  
  // Create Drive folder for uploads
  const folder = DriveApp.createFolder('Studio_CRM_Files');
  PropertiesService.getScriptProperties().setProperty('DRIVE_FOLDER_ID', folder.getId());
  
  Logger.log('Setup complete!');
  Logger.log('Spreadsheet ID: ' + ss.getId());
  Logger.log('Drive Folder ID: ' + folder.getId());
  
  return {
    spreadsheetId: ss.getId(),
    folderId: folder.getId(),
    message: 'Setup complete! Add your first user to get started.'
  };
}

/**
 * Create the first admin user
 */
function createAdminUser(email, password, name, phone) {
  const sheet = getSheet(SHEETS.USERS);
  const id = generateId('USR');
  
  const user = {
    Id: id,
    Email: email,
    Password: password,
    Name: name,
    Phone: phone || '',
    Role: 'owner',
    Avatar: '',
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    LastLogin: ''
  };
  
  const headers = getHeaders(sheet);
  const row = objectToRow(headers, user);
  sheet.appendRow(row);
  
  return { success: true, id: id, message: 'Admin user created successfully' };
}

// ==================== MAIN HANDLERS ====================

function doGet(e) {
  try {
    const action = e.parameter.action;
    let result;
    
    switch(action) {
      case 'getClients': result = getClients(); break;
      case 'getLeads': result = getLeads(); break;
      case 'getBookings': result = getBookings(); break;
      case 'getContracts': result = getContracts(); break;
      case 'getInvoices': result = getInvoices(); break;
      case 'getTasks': result = getTasks(); break;
      case 'getUsers': result = getUsers(); break;
      case 'getPayments': result = getPayments(e.parameter.invoiceId); break;
      case 'getDashboardStats': result = getDashboardStats(); break;
      case 'getSettings': result = getSettings(); break;
      case 'health': result = { status: 'ok', timestamp: new Date().toISOString() }; break;
      default: result = { error: 'Invalid action' };
    }
    
    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    let result;
    
    switch(action) {
      // Authentication
      case 'login': result = loginUser(data.email, data.password); break;
      
      // Clients
      case 'addClient': result = addClient(data.client); break;
      case 'updateClient': result = updateClient(data.id, data.client); break;
      case 'deleteClient': result = deleteClient(data.id); break;
      
      // Leads
      case 'addLead': result = addLead(data.lead); break;
      case 'updateLead': result = updateLead(data.id, data.lead); break;
      case 'updateLeadStatus': result = updateLeadStatus(data.id, data.status); break;
      case 'convertLead': result = convertLeadToClient(data.id); break;
      case 'deleteLead': result = deleteLead(data.id); break;
      
      // Bookings
      case 'addBooking': result = addBooking(data.booking); break;
      case 'updateBooking': result = updateBooking(data.id, data.booking); break;
      case 'deleteBooking': result = deleteBooking(data.id); break;
      
      // Contracts
      case 'addContract': result = addContract(data.contract); break;
      case 'updateContract': result = updateContract(data.id, data.contract); break;
      case 'signContract': result = signContract(data.id, data.signature, data.signerName, data.signerIp); break;
      
      // Invoices
      case 'addInvoice': result = addInvoice(data.invoice); break;
      case 'updateInvoice': result = updateInvoice(data.id, data.invoice); break;
      case 'recordPayment': result = recordPayment(data.invoiceId, data.payment); break;
      
      // Tasks
      case 'addTask': result = addTask(data.task); break;
      case 'updateTask': result = updateTask(data.id, data.task); break;
      case 'updateTaskStatus': result = updateTaskStatus(data.id, data.status); break;
      case 'deleteTask': result = deleteTask(data.id); break;
      
      // Users
      case 'addUser': result = addUser(data.user); break;
      case 'updateUser': result = updateUser(data.id, data.user); break;
      
      // Settings
      case 'updateSettings': result = updateSettings(data.settings); break;
      
      // File Upload
      case 'uploadFile': result = uploadFileToDrive(data.fileName, data.base64Data, data.mimeType, data.folderId); break;
      
      default: result = { error: 'Invalid action' };
    }
    
    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({ error: error.message });
  }
}

// ==================== HELPER FUNCTIONS ====================

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function generateId(prefix) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`.toUpperCase();
}

function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VV-${year}-${random}`;
}

function generateContractNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CTR-${year}-${random}`;
}

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((header, i) => {
    if (header) obj[header] = row[i];
  });
  return obj;
}

function objectToRow(headers, obj) {
  return headers.map(header => obj[header] !== undefined ? obj[header] : '');
}

function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => rowToObject(headers, row)).filter(obj => obj.Id);
}

function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIdx = headers.indexOf('Id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIdx] === id) {
      return { row: i + 1, data: rowToObject(headers, data[i]), headers };
    }
  }
  return null;
}

function updateSheetRow(sheetName, id, updates) {
  const sheet = getSheet(sheetName);
  const found = findRowById(sheet, id);
  
  if (!found) return { success: false, error: 'Record not found' };
  
  const updatedData = { ...found.data, ...updates, UpdatedAt: new Date().toISOString() };
  const row = objectToRow(found.headers, updatedData);
  sheet.getRange(found.row, 1, 1, row.length).setValues([row]);
  
  return { success: true, data: updatedData };
}

function deleteSheetRow(sheetName, id) {
  const sheet = getSheet(sheetName);
  const found = findRowById(sheet, id);
  
  if (!found) return { success: false, error: 'Record not found' };
  
  sheet.deleteRow(found.row);
  return { success: true };
}

function logActivity(activity) {
  try {
    const sheet = getSheet(SHEETS.ACTIVITY_LOG);
    if (!sheet) return;
    
    const id = generateId('ACT');
    const headers = getHeaders(sheet);
    const row = objectToRow(headers, {
      Id: id,
      Type: activity.type,
      UserId: activity.userId || '',
      EntityId: activity.entityId || '',
      Description: activity.description,
      Timestamp: activity.timestamp || new Date().toISOString()
    });
    sheet.appendRow(row);
  } catch (e) {
    Logger.log('Activity log error: ' + e.message);
  }
}

// ==================== AUTHENTICATION ====================

function loginUser(email, password) {
  const sheet = getSheet(SHEETS.USERS);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const emailIdx = headers.indexOf('Email');
  const passwordIdx = headers.indexOf('Password');
  const activeIdx = headers.indexOf('IsActive');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][emailIdx] === email && data[i][passwordIdx] === password && data[i][activeIdx] === true) {
      const user = rowToObject(headers, data[i]);
      delete user.Password;
      
      // Update last login
      const lastLoginIdx = headers.indexOf('LastLogin');
      sheet.getRange(i + 1, lastLoginIdx + 1).setValue(new Date().toISOString());
      
      logActivity({
        type: 'LOGIN',
        userId: user.Id,
        description: `User ${user.Name} logged in`
      });
      
      return { success: true, user: user };
    }
  }
  
  return { success: false, error: 'Invalid email or password' };
}

// ==================== CLIENTS ====================

function getClients() { return getSheetData(SHEETS.CLIENTS); }

function addClient(client) {
  const sheet = getSheet(SHEETS.CLIENTS);
  const id = generateId('CLT');
  
  const newClient = {
    Id: id,
    Name: client.Name || client.name,
    Phone: client.Phone || client.phone,
    Email: client.Email || client.email || '',
    Address: client.Address || client.address || '',
    Source: client.Source || client.source || 'walkin',
    TotalBookings: 0,
    TotalSpent: 0,
    Notes: client.Notes || client.notes || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    LastEventDate: ''
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newClient));
  
  logActivity({ type: 'CLIENT_ADDED', entityId: id, description: `New client: ${newClient.Name}` });
  
  return { success: true, id: id, client: newClient };
}

function updateClient(id, updates) { return updateSheetRow(SHEETS.CLIENTS, id, updates); }
function deleteClient(id) { return deleteSheetRow(SHEETS.CLIENTS, id); }

// ==================== LEADS ====================

function getLeads() { return getSheetData(SHEETS.LEADS); }

function addLead(lead) {
  const sheet = getSheet(SHEETS.LEADS);
  const id = generateId('LED');
  
  const newLead = {
    Id: id,
    Name: lead.Name || lead.name,
    Phone: lead.Phone || lead.phone,
    Email: lead.Email || lead.email || '',
    Source: lead.Source || lead.source || 'website',
    Status: 'new',
    EventType: lead.EventType || lead.eventType || '',
    EventDate: lead.EventDate || lead.eventDate || '',
    Budget: lead.Budget || lead.budget || '',
    Notes: lead.Notes || lead.notes || '',
    AssignedTo: lead.AssignedTo || lead.assignedTo || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    FollowUpDate: lead.FollowUpDate || lead.followUpDate || ''
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newLead));
  
  logActivity({ type: 'LEAD_ADDED', entityId: id, description: `New lead: ${newLead.Name}` });
  
  return { success: true, id: id, lead: newLead };
}

function updateLead(id, updates) { return updateSheetRow(SHEETS.LEADS, id, updates); }
function updateLeadStatus(id, status) { return updateSheetRow(SHEETS.LEADS, id, { Status: status }); }
function deleteLead(id) { return deleteSheetRow(SHEETS.LEADS, id); }

function convertLeadToClient(leadId) {
  const leads = getLeads();
  const lead = leads.find(l => l.Id === leadId);
  
  if (!lead) return { success: false, error: 'Lead not found' };
  
  const clientResult = addClient({
    Name: lead.Name,
    Email: lead.Email,
    Phone: lead.Phone,
    Address: '',
    Source: lead.Source,
    Notes: `Converted from lead. Event: ${lead.EventType || 'N/A'}`
  });
  
  if (clientResult.success) {
    updateLeadStatus(leadId, 'converted');
    logActivity({ type: 'LEAD_CONVERTED', entityId: leadId, description: `Lead converted: ${lead.Name}` });
    return { success: true, clientId: clientResult.id, leadId: leadId };
  }
  
  return { success: false, error: 'Failed to create client' };
}

// ==================== BOOKINGS ====================

function getBookings() { return getSheetData(SHEETS.BOOKINGS); }

function addBooking(booking) {
  const sheet = getSheet(SHEETS.BOOKINGS);
  const id = generateId('BKG');
  
  const newBooking = {
    Id: id,
    ClientId: booking.ClientId || booking.clientId,
    ClientName: booking.ClientName || booking.clientName,
    EventType: booking.EventType || booking.eventType,
    EventDate: booking.EventDate || booking.eventDate,
    EventTime: booking.EventTime || booking.eventTime || '',
    Venue: booking.Venue || booking.venue || '',
    Status: booking.Status || 'confirmed',
    Package: booking.Package || booking.package || '',
    TotalAmount: booking.TotalAmount || booking.totalAmount || 0,
    AdvancePaid: booking.AdvancePaid || booking.advancePaid || 0,
    BalanceDue: (booking.TotalAmount || booking.totalAmount || 0) - (booking.AdvancePaid || booking.advancePaid || 0),
    AssignedTeam: JSON.stringify(booking.AssignedTeam || booking.assignedTeam || []),
    Notes: booking.Notes || booking.notes || '',
    ContractId: booking.ContractId || booking.contractId || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newBooking));
  
  // Update client stats
  updateClientStats(newBooking.ClientId, newBooking.TotalAmount);
  
  logActivity({ type: 'BOOKING_ADDED', entityId: id, description: `Booking: ${newBooking.EventType} on ${newBooking.EventDate}` });
  
  return { success: true, id: id, booking: newBooking };
}

function updateBooking(id, updates) { return updateSheetRow(SHEETS.BOOKINGS, id, updates); }
function deleteBooking(id) { return deleteSheetRow(SHEETS.BOOKINGS, id); }

function updateClientStats(clientId, amount) {
  const sheet = getSheet(SHEETS.CLIENTS);
  const found = findRowById(sheet, clientId);
  if (found) {
    const currentBookings = parseInt(found.data.TotalBookings) || 0;
    const currentSpent = parseFloat(found.data.TotalSpent) || 0;
    updateSheetRow(SHEETS.CLIENTS, clientId, {
      TotalBookings: currentBookings + 1,
      TotalSpent: currentSpent + amount,
      LastEventDate: new Date().toISOString()
    });
  }
}

// ==================== CONTRACTS ====================

function getContracts() { return getSheetData(SHEETS.CONTRACTS); }

function addContract(contract) {
  const sheet = getSheet(SHEETS.CONTRACTS);
  const id = generateId('CTR');
  const contractNumber = generateContractNumber();
  
  const newContract = {
    Id: id,
    ContractNumber: contractNumber,
    BookingId: contract.BookingId || contract.bookingId || '',
    ClientId: contract.ClientId || contract.clientId,
    ClientName: contract.ClientName || contract.clientName,
    ClientEmail: contract.ClientEmail || contract.clientEmail || '',
    TemplateId: contract.TemplateId || contract.templateId || '',
    EventType: contract.EventType || contract.eventType,
    EventDate: contract.EventDate || contract.eventDate,
    Venue: contract.Venue || contract.venue || '',
    PackageName: contract.PackageName || contract.packageName || '',
    TotalAmount: contract.TotalAmount || contract.totalAmount || 0,
    Content: contract.Content || contract.content || '',
    Terms: contract.Terms || contract.terms || '',
    Status: 'draft',
    SentAt: '',
    SignedAt: '',
    ExpiresAt: '',
    SignatureUrl: '',
    SignerName: '',
    SignerIp: '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newContract));
  
  logActivity({ type: 'CONTRACT_CREATED', entityId: id, description: `Contract for ${newContract.ClientName}` });
  
  return { success: true, id: id, contractNumber: contractNumber, contract: newContract };
}

function updateContract(id, updates) { return updateSheetRow(SHEETS.CONTRACTS, id, updates); }

function signContract(contractId, signatureData, signerName, signerIp) {
  // Save signature to Drive
  const result = uploadFileToDrive(
    `signature_${contractId}_${Date.now()}.png`,
    signatureData.replace('data:image/png;base64,', ''),
    'image/png'
  );
  
  if (result.success) {
    return updateSheetRow(SHEETS.CONTRACTS, contractId, {
      Status: 'signed',
      SignatureUrl: result.fileUrl,
      SignerName: signerName || '',
      SignerIp: signerIp || '',
      SignedAt: new Date().toISOString()
    });
  }
  
  return { success: false, error: 'Failed to save signature' };
}

// ==================== INVOICES ====================

function getInvoices() { return getSheetData(SHEETS.INVOICES); }

function addInvoice(invoice) {
  const sheet = getSheet(SHEETS.INVOICES);
  const id = generateId('INV');
  const invoiceNumber = generateInvoiceNumber();
  
  const newInvoice = {
    Id: id,
    InvoiceNumber: invoiceNumber,
    BookingId: invoice.BookingId || invoice.bookingId || '',
    ClientId: invoice.ClientId || invoice.clientId,
    ClientName: invoice.ClientName || invoice.clientName,
    Items: JSON.stringify(invoice.Items || invoice.items || []),
    Subtotal: invoice.Subtotal || invoice.subtotal || 0,
    TaxAmount: invoice.TaxAmount || invoice.taxAmount || 0,
    Discount: invoice.Discount || invoice.discount || 0,
    TotalAmount: invoice.TotalAmount || invoice.totalAmount || 0,
    PaidAmount: 0,
    BalanceDue: invoice.TotalAmount || invoice.totalAmount || 0,
    Status: 'pending',
    DueDate: invoice.DueDate || invoice.dueDate || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newInvoice));
  
  logActivity({ type: 'INVOICE_CREATED', entityId: id, description: `Invoice ${invoiceNumber} for ₹${newInvoice.TotalAmount}` });
  
  return { success: true, id: id, invoiceNumber: invoiceNumber, invoice: newInvoice };
}

function updateInvoice(id, updates) { return updateSheetRow(SHEETS.INVOICES, id, updates); }

function recordPayment(invoiceId, payment) {
  // Add payment record
  const paymentSheet = getSheet(SHEETS.PAYMENTS);
  const paymentId = generateId('PAY');
  
  const newPayment = {
    Id: paymentId,
    InvoiceId: invoiceId,
    Amount: payment.Amount || payment.amount,
    Method: payment.Method || payment.method,
    Reference: payment.Reference || payment.reference || '',
    Notes: payment.Notes || payment.notes || '',
    ReceivedBy: payment.ReceivedBy || payment.receivedBy || '',
    CreatedAt: new Date().toISOString()
  };
  
  const headers = getHeaders(paymentSheet);
  paymentSheet.appendRow(objectToRow(headers, newPayment));
  
  // Update invoice
  const invoiceSheet = getSheet(SHEETS.INVOICES);
  const found = findRowById(invoiceSheet, invoiceId);
  
  if (found) {
    const currentPaid = parseFloat(found.data.PaidAmount) || 0;
    const total = parseFloat(found.data.TotalAmount) || 0;
    const newPaid = currentPaid + parseFloat(newPayment.Amount);
    const newBalance = total - newPaid;
    const newStatus = newBalance <= 0 ? 'paid' : 'partial';
    
    updateSheetRow(SHEETS.INVOICES, invoiceId, {
      PaidAmount: newPaid,
      BalanceDue: Math.max(0, newBalance),
      Status: newStatus
    });
  }
  
  logActivity({ type: 'PAYMENT_RECEIVED', entityId: invoiceId, description: `Payment ₹${newPayment.Amount} via ${newPayment.Method}` });
  
  return { success: true, paymentId: paymentId, payment: newPayment };
}

function getPayments(invoiceId) {
  const payments = getSheetData(SHEETS.PAYMENTS);
  return invoiceId ? payments.filter(p => p.InvoiceId === invoiceId) : payments;
}

// ==================== TASKS ====================

function getTasks() { return getSheetData(SHEETS.TASKS); }

function addTask(task) {
  const sheet = getSheet(SHEETS.TASKS);
  const id = generateId('TSK');
  
  const newTask = {
    Id: id,
    Title: task.Title || task.title,
    Description: task.Description || task.description || '',
    AssignedTo: task.AssignedTo || task.assignedTo || '',
    RelatedType: task.RelatedType || task.relatedType || '',
    RelatedId: task.RelatedId || task.relatedId || '',
    Priority: task.Priority || task.priority || 'medium',
    Status: 'pending',
    DueDate: task.DueDate || task.dueDate || '',
    CompletedAt: '',
    CreatedAt: new Date().toISOString()
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newTask));
  
  logActivity({ type: 'TASK_CREATED', entityId: id, description: `Task: ${newTask.Title}` });
  
  return { success: true, id: id, task: newTask };
}

function updateTask(id, updates) { return updateSheetRow(SHEETS.TASKS, id, updates); }

function updateTaskStatus(id, status) {
  const updates = { Status: status };
  if (status === 'completed') {
    updates.CompletedAt = new Date().toISOString();
  }
  return updateSheetRow(SHEETS.TASKS, id, updates);
}

function deleteTask(id) { return deleteSheetRow(SHEETS.TASKS, id); }

// ==================== USERS ====================

function getUsers() {
  const users = getSheetData(SHEETS.USERS);
  return users.map(u => {
    const copy = { ...u };
    delete copy.Password;
    return copy;
  });
}

function addUser(user) {
  const sheet = getSheet(SHEETS.USERS);
  const id = generateId('USR');
  
  const newUser = {
    Id: id,
    Email: user.Email || user.email,
    Password: user.Password || user.password,
    Name: user.Name || user.name,
    Phone: user.Phone || user.phone || '',
    Role: user.Role || user.role || 'staff',
    Avatar: '',
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    LastLogin: ''
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newUser));
  
  return { success: true, id: id };
}

function updateUser(id, updates) {
  // Don't allow updating password through this function
  delete updates.password;
  delete updates.Password;
  return updateSheetRow(SHEETS.USERS, id, updates);
}

// ==================== DASHBOARD ====================

function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bookings = getBookings();
  const leads = getLeads();
  const invoices = getInvoices();
  
  // Today's bookings
  const todayBookings = bookings.filter(b => {
    const eventDate = new Date(b.EventDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  });
  
  // This week's leads
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newLeadsThisWeek = leads.filter(l => new Date(l.CreatedAt) >= weekAgo && l.Status === 'new').length;
  
  // Pending payments
  const pendingPayments = invoices.filter(i => i.Status === 'pending' || i.Status === 'partial')
    .reduce((sum, i) => sum + (parseFloat(i.BalanceDue) || 0), 0);
  
  // Monthly revenue
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyRevenue = invoices.filter(i => new Date(i.CreatedAt) >= monthStart)
    .reduce((sum, i) => sum + (parseFloat(i.PaidAmount) || 0), 0);
  
  // Upcoming events (next 7 days)
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingEvents = bookings.filter(b => {
    const eventDate = new Date(b.EventDate);
    return eventDate >= today && eventDate <= nextWeek && b.Status !== 'cancelled';
  }).slice(0, 5);
  
  return {
    todayBookings: todayBookings.length,
    newLeadsThisWeek,
    pendingPayments,
    monthlyRevenue,
    upcomingEvents,
    recentLeads: leads.filter(l => l.Status === 'new').slice(0, 5),
    overdueInvoices: invoices.filter(i => 
      (i.Status === 'pending' || i.Status === 'partial') && 
      new Date(i.DueDate) < today
    ).length
  };
}

// ==================== SETTINGS ====================

function getSettings() {
  const sheet = getSheet(SHEETS.SETTINGS);
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  const settings = {};
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      settings[data[i][0]] = data[i][1];
    }
  }
  
  return settings;
}

function updateSettings(settings) {
  const sheet = getSheet(SHEETS.SETTINGS);
  
  for (const [key, value] of Object.entries(settings)) {
    const data = sheet.getDataRange().getValues();
    let found = false;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        sheet.getRange(i + 1, 3).setValue(new Date().toISOString());
        found = true;
        break;
      }
    }
    
    if (!found) {
      sheet.appendRow([key, value, new Date().toISOString()]);
    }
  }
  
  return { success: true };
}

// ==================== FILE UPLOAD ====================

function uploadFileToDrive(fileName, base64Data, mimeType, folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId || DRIVE_FOLDER_ID);
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return {
      success: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      downloadUrl: `https://drive.google.com/uc?export=download&id=${file.getId()}`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ==================== PASSPORT PHOTO MODULE ====================

// Setup passport sheets (run once)
function setupPassportSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const passportSheets = {
    [SHEETS.PASSPORT_CUSTOMERS]: ['Id', 'Name', 'Phone', 'Email', 'Notes', 'TotalOrders', 'TotalSpent', 'CreatedAt', 'UpdatedAt'],
    [SHEETS.PASSPORT_ORDERS]: ['Id', 'OrderId', 'CustomerId', 'CustomerName', 'Items', 'Subtotal', 'Tax', 'Total', 'Status', 'PaymentStatus', 'PaymentMethod', 'PaymentReference', 'PaidAt', 'Notes', 'CreatedAt', 'UpdatedAt'],
    [SHEETS.PASSPORT_PRICES]: ['Id', 'TemplateId', 'TemplateName', 'Country', 'PhotoType', 'Price', 'PricePerSheet', 'IsActive'],
    [SHEETS.PASSPORT_SETTINGS]: ['Key', 'Value', 'UpdatedAt']
  };
  
  for (const [sheetName, headers] of Object.entries(passportSheets)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  return { success: true, message: 'Passport sheets created!' };
}

// Passport Customers
function getPassportCustomers() { return getSheetData(SHEETS.PASSPORT_CUSTOMERS); }

function addPassportCustomer(customer) {
  const sheet = getSheet(SHEETS.PASSPORT_CUSTOMERS);
  const id = generateId('PPC');
  
  const newCustomer = {
    Id: id,
    Name: customer.name || customer.Name,
    Phone: customer.phone || customer.Phone,
    Email: customer.email || customer.Email || '',
    Notes: customer.notes || customer.Notes || '',
    TotalOrders: 0,
    TotalSpent: 0,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newCustomer));
  
  return { success: true, id: id, customer: newCustomer };
}

function updatePassportCustomer(id, updates) { return updateSheetRow(SHEETS.PASSPORT_CUSTOMERS, id, updates); }

// Passport Orders
function getPassportOrders() { 
  const orders = getSheetData(SHEETS.PASSPORT_ORDERS);
  return orders.map(o => ({
    ...o,
    items: o.Items ? JSON.parse(o.Items) : []
  }));
}

function addPassportOrder(order) {
  const sheet = getSheet(SHEETS.PASSPORT_ORDERS);
  const id = generateId('PPO');
  const orderId = generatePassportOrderId();
  
  const newOrder = {
    Id: id,
    OrderId: orderId,
    CustomerId: order.customerId || order.CustomerId,
    CustomerName: order.customerName || order.CustomerName,
    Items: JSON.stringify(order.items || order.Items || []),
    Subtotal: order.subtotal || order.Subtotal || 0,
    Tax: order.tax || order.Tax || 0,
    Total: order.total || order.Total || 0,
    Status: order.status || 'pending',
    PaymentStatus: order.paymentStatus || 'unpaid',
    PaymentMethod: order.paymentMethod || '',
    PaymentReference: order.paymentReference || '',
    PaidAt: order.paidAt || '',
    Notes: order.notes || '',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newOrder));
  
  // Update customer stats
  updatePassportCustomerStats(newOrder.CustomerId, newOrder.Total);
  
  return { success: true, id: id, orderId: orderId, order: newOrder };
}

function updatePassportOrder(id, updates) { return updateSheetRow(SHEETS.PASSPORT_ORDERS, id, updates); }

function updatePassportCustomerStats(customerId, amount) {
  const sheet = getSheet(SHEETS.PASSPORT_CUSTOMERS);
  const found = findRowById(sheet, customerId);
  if (found) {
    const currentOrders = parseInt(found.data.TotalOrders) || 0;
    const currentSpent = parseFloat(found.data.TotalSpent) || 0;
    updateSheetRow(SHEETS.PASSPORT_CUSTOMERS, customerId, {
      TotalOrders: currentOrders + 1,
      TotalSpent: currentSpent + parseFloat(amount)
    });
  }
}

function generatePassportOrderId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PP${year}${month}${day}-${random}`;
}

// Passport Prices
function getPassportPrices() { return getSheetData(SHEETS.PASSPORT_PRICES); }

function addPassportPrice(price) {
  const sheet = getSheet(SHEETS.PASSPORT_PRICES);
  const id = generateId('PPP');
  
  const newPrice = {
    Id: id,
    TemplateId: price.templateId,
    TemplateName: price.templateName,
    Country: price.country,
    PhotoType: price.photoType,
    Price: price.price || 50,
    PricePerSheet: price.pricePerSheet || 100,
    IsActive: true
  };
  
  const headers = getHeaders(sheet);
  sheet.appendRow(objectToRow(headers, newPrice));
  
  return { success: true, id: id, price: newPrice };
}

function updatePassportPrice(id, updates) { return updateSheetRow(SHEETS.PASSPORT_PRICES, id, updates); }
