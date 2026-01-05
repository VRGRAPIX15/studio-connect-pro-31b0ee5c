# Google Apps Script Backend Setup Guide
## Studio Connect Pro 5 - Google Sheets & Drive Integration

This guide walks you through setting up the Google Apps Script backend for your Studio CRM.

---

## 📋 Prerequisites

1. A Google account
2. Access to Google Sheets and Google Drive
3. Basic understanding of Google Apps Script (optional)

---

## 🚀 Step-by-Step Setup

### Step 1: Create the Google Sheet Database

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Studio Connect Pro - Database"**
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### Step 2: Create Google Drive Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named **"Studio Connect Pro - Files"**
3. Copy the **Folder ID** from the URL:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID]
   ```

### Step 3: Open Apps Script Editor

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `Code.gs` file and paste it

### Step 4: Configure Your IDs

At the top of the script, replace the placeholder values:

```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Paste your Sheet ID
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; // Paste your Drive folder ID
```

### Step 5: Run Initial Setup

1. In the Apps Script editor, select `setupSpreadsheet` from the function dropdown
2. Click **Run**
3. When prompted, click **Review Permissions** and allow access
4. This will:
   - Create all required sheets with headers
   - Add default demo users (owner, manager, staff)

### Step 6: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description**: "Studio Connect Pro API v1"
   - **Execute as**: Me
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Copy the Web App URL** - you'll need this for the frontend

---

## 📊 Sheet Structure (Auto-created)

| Sheet Name | Purpose |
|------------|---------|
| Users | Team member accounts and authentication |
| Clients | Client database with contact info |
| Leads | Lead pipeline with status tracking |
| Bookings | Event bookings and calendar |
| Contracts | Digital contracts with e-signature |
| Invoices | Invoice generation and tracking |
| Payments | Payment records for invoices |
| Tasks | Task management and assignments |
| ActivityLog | Audit log for all actions |
| Settings | Business configuration |

---

## 🔗 Connecting to Frontend

### Add the API URL to your environment

Create a file `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  GOOGLE_SCRIPT_URL: 'YOUR_WEB_APP_URL_HERE',
};
```

### Example API Call

```typescript
const fetchClients = async () => {
  const response = await fetch(
    `${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getClients`
  );
  const data = await response.json();
  return data;
};

const addClient = async (client: Client) => {
  const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'addClient',
      client: client
    })
  });
  return response.json();
};
```

---

## 🔌 Available API Endpoints

### GET Actions (via URL parameter)

| Action | Description |
|--------|-------------|
| `getClients` | Fetch all clients |
| `getLeads` | Fetch all leads |
| `getBookings` | Fetch all bookings |
| `getContracts` | Fetch all contracts |
| `getInvoices` | Fetch all invoices |
| `getTasks` | Fetch all tasks |
| `getUsers` | Fetch all team members |
| `getDashboardStats` | Fetch dashboard statistics |
| `getSettings` | Fetch business settings |

### POST Actions (via request body)

| Action | Parameters | Description |
|--------|------------|-------------|
| `login` | email, password | Authenticate user |
| `addClient` | client object | Add new client |
| `updateClient` | id, client | Update client |
| `deleteClient` | id | Delete client |
| `addLead` | lead object | Add new lead |
| `updateLeadStatus` | id, status | Update lead status |
| `convertLead` | id | Convert lead to client |
| `addBooking` | booking object | Create booking |
| `addContract` | contract object | Create contract |
| `signContract` | id, signature (base64) | Sign contract |
| `addInvoice` | invoice object | Create invoice |
| `recordPayment` | invoiceId, payment | Record payment |
| `addTask` | task object | Create task |
| `updateTaskStatus` | id, status | Update task status |
| `uploadFile` | fileName, base64Data, mimeType | Upload to Drive |

---

## 🔐 Default Users

After running setup, these demo accounts are available:

| Email | Password | Role |
|-------|----------|------|
| owner@varnika.studio | CRM@123 | Owner |
| manager@varnika.studio | CRM@123 | Manager |
| staff@varnika.studio | CRM@123 | Staff |

---

## 🔄 Updating the Deployment

When you make changes to the script:

1. Go to **Deploy → Manage deployments**
2. Click the edit icon ✏️
3. Under "Version", select **New version**
4. Click **Deploy**

> **Note**: The Web App URL stays the same, only the version updates.

---

## 🛠️ Troubleshooting

### "Script function not found"
Make sure you saved the script before running.

### "Authorization required"
Click **Review Permissions** and grant access to Sheets and Drive.

### CORS errors in frontend
The script handles CORS automatically. Make sure you're using the correct Web App URL.

### "Spreadsheet not found"
Verify the SPREADSHEET_ID is correct (no spaces or extra characters).

---

## 📱 PWA Integration Notes

Since this is a PWA, remember:
- API calls should handle offline scenarios gracefully
- Consider caching recent data for offline viewing
- Queue write operations when offline and sync when online

---

## 🔒 Security Recommendations

1. **Change default passwords** after first login
2. **Limit Web App access** to specific users in production
3. **Enable 2FA** on the Google account
4. **Regularly backup** the spreadsheet
5. **Review ActivityLog** sheet for suspicious activity

---

## 📞 Support

For issues with the backend script, check:
1. Apps Script execution logs (View → Logs)
2. Stackdriver logging for detailed errors
3. Verify all sheet names match exactly (case-sensitive)
