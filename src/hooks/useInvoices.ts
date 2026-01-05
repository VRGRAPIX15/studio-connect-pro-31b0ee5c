import { useState, useMemo, useCallback, useEffect } from 'react';
import { Invoice, Payment, PaymentStatus } from '@/types';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getInvoices`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const invoicesWithDates = data.map((inv: any) => ({
          id: inv.Id,
          invoiceNumber: inv.InvoiceNumber,
          bookingId: inv.BookingId || undefined,
          clientId: inv.ClientId,
          clientName: inv.ClientName,
          items: inv.Items ? JSON.parse(inv.Items) : [],
          subtotal: Number(inv.Subtotal) || 0,
          taxAmount: Number(inv.TaxAmount) || 0,
          discount: Number(inv.Discount) || 0,
          totalAmount: Number(inv.TotalAmount) || 0,
          paidAmount: Number(inv.PaidAmount) || 0,
          balanceDue: Number(inv.BalanceDue) || 0,
          status: inv.Status as PaymentStatus,
          dueDate: new Date(inv.DueDate),
          createdAt: new Date(inv.CreatedAt),
          payments: [], // Will fetch separately if needed
        }));
        setInvoices(invoicesWithDates);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const collected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pending = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
    const overdue = invoices.filter(
      (inv) => inv.status !== 'paid' && new Date(inv.dueDate) < new Date()
    ).length;
    
    return { total, collected, pending, overdue };
  }, [invoices]);

  const addInvoice = useCallback(async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'payments'>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addInvoice',
          invoice: {
            BookingId: invoice.bookingId,
            ClientId: invoice.clientId,
            ClientName: invoice.clientName,
            Items: JSON.stringify(invoice.items),
            Subtotal: invoice.subtotal,
            TaxAmount: invoice.taxAmount,
            Discount: invoice.discount,
            TotalAmount: invoice.totalAmount,
            PaidAmount: invoice.paidAmount,
            BalanceDue: invoice.balanceDue,
            Status: invoice.status,
            DueDate: invoice.dueDate.toISOString(),
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Invoice created successfully');
        fetchInvoices();
        return result.invoice;
      } else {
        toast.error(result.error || 'Failed to create invoice');
        return null;
      }
    } catch (error) {
      console.error('Error adding invoice:', error);
      toast.error('Failed to create invoice');
      return null;
    }
  }, [fetchInvoices]);

  const updateInvoice = useCallback(async (id: string, updates: Partial<Invoice>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateInvoice',
          id,
          invoice: updates,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Invoice updated successfully');
        fetchInvoices();
      } else {
        toast.error(result.error || 'Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    }
  }, [fetchInvoices]);

  const recordPayment = useCallback(async (
    invoiceId: string,
    payment: Omit<Payment, 'id' | 'invoiceId' | 'createdAt'>
  ) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'recordPayment',
          invoiceId,
          payment: {
            Amount: payment.amount,
            Method: payment.method,
            Reference: payment.reference,
            Notes: payment.notes,
            ReceivedBy: payment.receivedBy,
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Payment recorded successfully');
        fetchInvoices();
      } else {
        toast.error(result.error || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  }, [fetchInvoices]);

  const getInvoiceById = useCallback((id: string) => {
    return invoices.find((inv) => inv.id === id);
  }, [invoices]);

  const generateInvoiceNumber = useCallback(() => {
    const year = new Date().getFullYear();
    const count = invoices.filter((inv) =>
      inv.invoiceNumber.includes(`VV-${year}`)
    ).length;
    return `VV-${year}-${String(count + 1).padStart(3, '0')}`;
  }, [invoices]);

  return {
    invoices: filteredInvoices,
    allInvoices: invoices,
    isLoading,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addInvoice,
    updateInvoice,
    recordPayment,
    getInvoiceById,
    generateInvoiceNumber,
    refetch: fetchInvoices,
  };
}
