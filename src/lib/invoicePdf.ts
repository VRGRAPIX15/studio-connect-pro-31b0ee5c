import { Invoice } from '@/types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateInvoiceHTML = (invoice: Invoice): string => {
  const itemsHTML = invoice.items
    .map(
      (item, index) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${index + 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; text-align: right;">${formatCurrency(item.amount)}</td>
    </tr>
  `
    )
    .join('');

  const paymentsHTML = invoice.payments
    .map(
      (payment) => `
    <tr>
      <td style="padding: 8px;">${new Date(payment.createdAt).toLocaleDateString('en-IN')}</td>
      <td style="padding: 8px;">${payment.method.toUpperCase()}</td>
      <td style="padding: 8px;">${payment.reference || '-'}</td>
      <td style="padding: 8px; text-align: right;">${formatCurrency(payment.amount)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 40px; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #b8860b; }
    .invoice-title { font-size: 28px; color: #b8860b; text-align: right; }
    .invoice-number { font-size: 14px; color: #666; text-align: right; }
    .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .info-box { width: 48%; }
    .info-box h3 { margin: 0 0 10px; font-size: 12px; text-transform: uppercase; color: #888; }
    .info-box p { margin: 4px 0; font-size: 14px; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table th { background: #f5f5f5; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; }
    .totals { text-align: right; margin-bottom: 30px; }
    .totals-row { display: flex; justify-content: flex-end; margin: 8px 0; }
    .totals-label { width: 150px; text-align: right; padding-right: 20px; }
    .totals-value { width: 120px; text-align: right; font-weight: 500; }
    .grand-total { font-size: 18px; color: #b8860b; font-weight: bold; }
    .status-paid { background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
    .status-partial { background: #f59e0b; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
    .status-pending { background: #ef4444; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
    .payment-section { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #888; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Varnika Visuals</div>
      <p style="margin: 4px 0; font-size: 12px; color: #666;">SD Event Avenue</p>
      <p style="margin: 4px 0; font-size: 12px; color: #666;">Hyderabad, Telangana</p>
    </div>
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
      <p style="margin: 4px 0; font-size: 14px; text-align: right;">Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}</p>
      <p style="margin: 4px 0; font-size: 14px; text-align: right;">Due: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
    </div>
  </div>

  <div class="info-section">
    <div class="info-box">
      <h3>Bill To</h3>
      <p><strong>${invoice.clientName}</strong></p>
    </div>
    <div class="info-box" style="text-align: right;">
      <h3>Status</h3>
      <span class="status-${invoice.status}">${invoice.status.toUpperCase()}</span>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 45%;">Description</th>
        <th style="width: 15%; text-align: center;">Qty</th>
        <th style="width: 15%; text-align: right;">Rate</th>
        <th style="width: 20%; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <div class="totals-label">Subtotal:</div>
      <div class="totals-value">${formatCurrency(invoice.subtotal)}</div>
    </div>
    ${invoice.taxAmount > 0 ? `
    <div class="totals-row">
      <div class="totals-label">GST (18%):</div>
      <div class="totals-value">${formatCurrency(invoice.taxAmount)}</div>
    </div>
    ` : ''}
    ${invoice.discount > 0 ? `
    <div class="totals-row">
      <div class="totals-label">Discount:</div>
      <div class="totals-value">-${formatCurrency(invoice.discount)}</div>
    </div>
    ` : ''}
    <div class="totals-row grand-total">
      <div class="totals-label">Total:</div>
      <div class="totals-value">${formatCurrency(invoice.totalAmount)}</div>
    </div>
    <div class="totals-row">
      <div class="totals-label">Amount Paid:</div>
      <div class="totals-value">${formatCurrency(invoice.paidAmount)}</div>
    </div>
    <div class="totals-row" style="font-weight: bold; color: ${invoice.balanceDue > 0 ? '#ef4444' : '#10b981'};">
      <div class="totals-label">Balance Due:</div>
      <div class="totals-value">${formatCurrency(invoice.balanceDue)}</div>
    </div>
  </div>

  ${invoice.payments.length > 0 ? `
  <div class="payment-section">
    <h3 style="font-size: 14px; margin-bottom: 15px;">Payment History</h3>
    <table style="width: 100%; font-size: 13px;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="padding: 8px; text-align: left;">Date</th>
          <th style="padding: 8px; text-align: left;">Method</th>
          <th style="padding: 8px; text-align: left;">Reference</th>
          <th style="padding: 8px; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${paymentsHTML}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Varnika Visuals & SD Event Avenue | Contact: +91 98765 43210</p>
  </div>
</body>
</html>
  `;
};

export const downloadInvoicePDF = (invoice: Invoice) => {
  const html = generateInvoiceHTML(invoice);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};
