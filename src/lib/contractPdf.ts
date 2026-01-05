import { Contract } from '@/types';

export function generateContractHtml(contract: Contract): string {
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${contract.contractNumber} - Contract</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Georgia', serif;
          line-height: 1.6;
          color: #1a1a1a;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #b8860b;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #b8860b;
          letter-spacing: 2px;
        }
        .subtitle {
          color: #666;
          font-size: 14px;
          margin-top: 5px;
        }
        .contract-number {
          margin-top: 15px;
          font-size: 12px;
          color: #888;
        }
        .parties {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 40px;
        }
        .party {
          flex: 1;
        }
        .party-title {
          font-weight: bold;
          color: #b8860b;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .event-details {
          background: #faf8f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .event-details h3 {
          color: #b8860b;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .detail-row {
          display: flex;
          margin-bottom: 8px;
        }
        .detail-label {
          font-weight: bold;
          width: 150px;
        }
        .content {
          margin-bottom: 30px;
          white-space: pre-wrap;
        }
        .terms {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .terms h3 {
          color: #b8860b;
          margin-bottom: 15px;
        }
        .terms-content {
          white-space: pre-wrap;
          font-size: 14px;
        }
        .signature-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        .signature-box {
          text-align: center;
          width: 45%;
        }
        .signature-line {
          border-bottom: 1px solid #333;
          height: 60px;
          margin-bottom: 10px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .signature-line img {
          max-height: 50px;
          max-width: 200px;
        }
        .signature-name {
          font-size: 12px;
          color: #666;
        }
        .signed-info {
          font-size: 11px;
          color: #888;
          margin-top: 5px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #888;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">VARNIKA VISUALS</div>
        <div class="subtitle">SD Event Avenue</div>
        <div class="contract-number">Contract: ${contract.contractNumber}</div>
      </div>

      <div class="parties">
        <div class="party">
          <div class="party-title">Service Provider</div>
          <div>Varnika Visuals & SD Event Avenue</div>
          <div>Hyderabad, Telangana</div>
          <div>contact@varnikavisuals.com</div>
        </div>
        <div class="party">
          <div class="party-title">Client</div>
          <div>${contract.clientName}</div>
          ${contract.clientEmail ? `<div>${contract.clientEmail}</div>` : ''}
        </div>
      </div>

      <div class="event-details">
        <h3>Event Details</h3>
        <div class="detail-row">
          <span class="detail-label">Event Date:</span>
          <span>${formatDate(contract.eventDate)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Venue:</span>
          <span>${contract.venue || 'To be confirmed'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Package:</span>
          <span>${contract.packageName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Total Amount:</span>
          <span>${formatCurrency(contract.totalAmount)}</span>
        </div>
      </div>

      <div class="content">
        ${contract.content}
      </div>

      <div class="terms">
        <h3>Terms & Conditions</h3>
        <div class="terms-content">${contract.terms}</div>
      </div>

      <div class="signature-section">
        <h3>Signatures</h3>
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line">
              <span>Varnika Visuals</span>
            </div>
            <div class="signature-name">Service Provider</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">
              ${contract.signatureUrl ? `<img src="${contract.signatureUrl}" alt="Client Signature" />` : ''}
            </div>
            <div class="signature-name">${contract.signerName || contract.clientName}</div>
            ${contract.signedAt ? `<div class="signed-info">Signed on ${formatDate(contract.signedAt)}</div>` : ''}
          </div>
        </div>
      </div>

      <div class="footer">
        <p>This document was generated by Varnika Visuals Studio CRM</p>
        <p>Generated on ${formatDate(new Date())}</p>
      </div>
    </body>
    </html>
  `;
}

export function printContract(contract: Contract) {
  const html = generateContractHtml(contract);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

export function downloadContractPdf(contract: Contract) {
  printContract(contract);
}
