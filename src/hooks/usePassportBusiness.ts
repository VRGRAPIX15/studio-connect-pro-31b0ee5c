// Passport Photo Business Hook - Customer, Order, Pricing Management
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_CONFIG } from '@/config/api';
import { 
  PassportCustomer, 
  PassportOrder, 
  PassportPhotoPrice, 
  PassportSettings,
  PassportOrderItem,
  defaultPassportSettings,
  generateOrderId
} from '@/types/passportBusiness';

const API_URL = API_CONFIG.GOOGLE_SCRIPT_URL;

// API helper
async function apiCall(action: string, data?: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action, ...data }),
  });
  return response.json();
}

async function apiGet(action: string) {
  const response = await fetch(`${API_URL}?action=${action}`);
  return response.json();
}

export function usePassportBusiness() {
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState<PassportCustomer | null>(null);

  // ============== CUSTOMERS ==============
  
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['passport-customers'],
    queryFn: () => apiGet('getPassportCustomers'),
    staleTime: 1000 * 60 * 5,
  });

  const addCustomerMutation = useMutation({
    mutationFn: (customer: Omit<PassportCustomer, 'id' | 'createdAt'>) =>
      apiCall('addPassportCustomer', { customer }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passport-customers'] });
      toast.success('Customer added');
    },
    onError: () => toast.error('Failed to add customer'),
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PassportCustomer> }) =>
      apiCall('updatePassportCustomer', { id, customer: updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passport-customers'] });
      toast.success('Customer updated');
    },
  });

  const searchCustomers = useCallback((query: string) => {
    const q = query.toLowerCase();
    return customers.filter((c: PassportCustomer) => 
      c.name.toLowerCase().includes(q) || 
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers]);

  // ============== ORDERS ==============

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['passport-orders'],
    queryFn: () => apiGet('getPassportOrders'),
    staleTime: 1000 * 60 * 2,
  });

  const createOrderMutation = useMutation({
    mutationFn: (order: Omit<PassportOrder, 'id' | 'orderId' | 'createdAt'>) =>
      apiCall('addPassportOrder', { 
        order: {
          ...order,
          orderId: generateOrderId(),
        }
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['passport-orders'] });
      toast.success(`Order ${data.orderId} created`);
    },
    onError: () => toast.error('Failed to create order'),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<PassportOrder> }) =>
      apiCall('updatePassportOrder', { id, order: updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passport-orders'] });
      toast.success('Order updated');
    },
  });

  const updateOrderStatus = useCallback((id: string, status: PassportOrder['status']) => {
    const updates: Partial<PassportOrder> = { status };
    if (status === 'delivered') {
      updates.deliveredAt = new Date().toISOString();
    }
    return updateOrderMutation.mutateAsync({ id, updates });
  }, [updateOrderMutation]);

  const recordPayment = useCallback((
    orderId: string, 
    amount: number, 
    method: PassportOrder['paymentMethod']
  ) => {
    const order = orders.find((o: PassportOrder) => o.id === orderId);
    if (!order) return;

    const newPaidAmount = (order.paidAmount || 0) + amount;
    const newBalance = order.totalAmount - newPaidAmount;
    const paymentStatus = newBalance <= 0 ? 'paid' : newPaidAmount > 0 ? 'partial' : 'unpaid';

    return updateOrderMutation.mutateAsync({
      id: orderId,
      updates: {
        paidAmount: newPaidAmount,
        balanceDue: Math.max(0, newBalance),
        paymentStatus,
        paymentMethod: method,
      }
    });
  }, [orders, updateOrderMutation]);

  // Get orders for a specific customer
  const getCustomerOrders = useCallback((customerId: string) => {
    return orders.filter((o: PassportOrder) => o.customerId === customerId);
  }, [orders]);

  // Today's orders
  const todaysOrders = orders.filter((o: PassportOrder) => {
    const orderDate = new Date(o.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  // ============== PRICING ==============

  const { data: pricing = [], isLoading: pricingLoading } = useQuery({
    queryKey: ['passport-pricing'],
    queryFn: () => apiGet('getPassportPricing'),
    staleTime: 1000 * 60 * 10,
  });

  const updatePricingMutation = useMutation({
    mutationFn: ({ templateId, pricePerPhoto, pricePerSheet }: { 
      templateId: string; 
      pricePerPhoto: number;
      pricePerSheet: number;
    }) => apiCall('updatePassportPricing', { templateId, pricePerPhoto, pricePerSheet }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passport-pricing'] });
      toast.success('Pricing updated');
    },
  });

  const getPrice = useCallback((templateId: string): { perPhoto: number; perSheet: number } => {
    const price = pricing.find((p: PassportPhotoPrice) => p.templateId === templateId);
    if (price) {
      return { perPhoto: price.pricePerPhoto, perSheet: price.pricePerSheet };
    }
    return { perPhoto: defaultPassportSettings.defaultPricePerPhoto, perSheet: defaultPassportSettings.defaultPricePerSheet };
  }, [pricing]);

  // ============== SETTINGS ==============

  const { data: settings = defaultPassportSettings } = useQuery({
    queryKey: ['passport-settings'],
    queryFn: async () => {
      const result = await apiGet('getPassportSettings');
      return { ...defaultPassportSettings, ...result };
    },
    staleTime: 1000 * 60 * 30,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<PassportSettings>) =>
      apiCall('updatePassportSettings', { settings: newSettings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passport-settings'] });
      toast.success('Settings saved');
    },
  });

  // ============== STATS ==============

  const stats = {
    todayOrders: todaysOrders.length,
    todayRevenue: todaysOrders.reduce((sum: number, o: PassportOrder) => sum + (o.paidAmount || 0), 0),
    pendingOrders: orders.filter((o: PassportOrder) => o.status === 'pending').length,
    totalCustomers: customers.length,
  };

  return {
    // Customers
    customers,
    customersLoading,
    selectedCustomer,
    setSelectedCustomer,
    addCustomer: addCustomerMutation.mutateAsync,
    updateCustomer: updateCustomerMutation.mutateAsync,
    searchCustomers,
    
    // Orders
    orders,
    ordersLoading,
    todaysOrders,
    createOrder: createOrderMutation.mutateAsync,
    updateOrder: updateOrderMutation.mutateAsync,
    updateOrderStatus,
    recordPayment,
    getCustomerOrders,
    
    // Pricing
    pricing,
    pricingLoading,
    getPrice,
    updatePricing: updatePricingMutation.mutateAsync,
    
    // Settings
    settings,
    updateSettings: updateSettingsMutation.mutateAsync,
    
    // Stats
    stats,
  };
}
