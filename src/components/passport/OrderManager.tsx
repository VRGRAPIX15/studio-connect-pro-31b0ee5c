import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Receipt, CreditCard, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PassportCustomer, PassportOrder, PassportOrderItem, PassportPhotoPrice } from '@/types/passportBusiness';
import { CountryTemplate } from '@/data/countryTemplates';

interface OrderManagerProps {
  customer: PassportCustomer | null;
  currentTemplate: CountryTemplate | null;
  prices: PassportPhotoPrice[];
  onCreateOrder: (order: Omit<PassportOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  processedImageUrl?: string;
}

export function OrderManager({
  customer,
  currentTemplate,
  prices,
  onCreateOrder,
  processedImageUrl
}: OrderManagerProps) {
  const [orderItems, setOrderItems] = useState<PassportOrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const addItem = () => {
    if (!currentTemplate) {
      toast.error('Please select a photo template first');
      return;
    }

    // Find price for this template
    const price = prices.find(p => 
      p.country === currentTemplate.country && 
      p.photoType === currentTemplate.documentType
    );
    const unitPrice = price?.price || 50; // Default price

    const newItem: PassportOrderItem = {
      templateId: currentTemplate.id,
      templateName: `${currentTemplate.country} - ${currentTemplate.documentType}`,
      quantity: 1,
      pricePerUnit: unitPrice,
      total: unitPrice,
      photoUrl: processedImageUrl
    };

    // Check if item already exists
    const existingIndex = orderItems.findIndex(i => i.templateId === currentTemplate.id);
    if (existingIndex >= 0) {
      updateQuantity(existingIndex, orderItems[existingIndex].quantity + 1);
    } else {
      setOrderItems([...orderItems, newItem]);
    }
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }

    setOrderItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity,
          total: quantity * item.pricePerUnit
        };
      }
      return item;
    }));
  };

  const removeItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
  const tax = 0; // No tax for now
  const total = subtotal + tax;

  const handleCreateOrder = async () => {
    if (!customer) {
      toast.error('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setIsCreating(true);
    try {
      await onCreateOrder({
        customerId: customer.id,
        customerName: customer.name,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentMethod,
        paymentReference,
        notes: ''
      });

      // Reset form
      setOrderItems([]);
      setPaymentReference('');
      toast.success('Order created successfully!');
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setIsCreating(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!customer) {
      toast.error('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setIsCreating(true);
    try {
      await onCreateOrder({
        customerId: customer.id,
        customerName: customer.name,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: 'printed',
        paymentStatus: 'paid',
        paymentMethod,
        paymentReference,
        paidAt: new Date().toISOString(),
        notes: ''
      });

      // Reset form
      setOrderItems([]);
      setPaymentReference('');
      toast.success('Order created and marked as paid!');
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Order
          {orderItems.length > 0 && (
            <Badge variant="secondary">{orderItems.length}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          {customer ? `Customer: ${customer.name}` : 'Select a customer first'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Current Photo Button */}
        <Button 
          onClick={addItem} 
          variant="outline" 
          className="w-full"
          disabled={!currentTemplate}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Current Photo to Order
        </Button>

        {/* Order Items */}
        {orderItems.length > 0 && (
          <div className="space-y-2">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.templateName}</div>
                  <div className="text-xs text-muted-foreground">₹{item.pricePerUnit} each</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-sm font-medium w-16 text-right">
                  ₹{item.total}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {orderItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{tax}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-1">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-2">
              <Label className="text-sm">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(v: 'cash' | 'upi' | 'card') => setPaymentMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <span className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      Cash
                    </span>
                  </SelectItem>
                  <SelectItem value="upi">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      UPI
                    </span>
                  </SelectItem>
                  <SelectItem value="card">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod !== 'cash' && (
              <div className="space-y-2">
                <Label className="text-sm">Reference / Transaction ID</Label>
                <Input
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Transaction ID"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleCreateOrder}
                disabled={isCreating || !customer}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Create Order
              </Button>
              <Button 
                onClick={handleMarkAsPaid}
                disabled={isCreating || !customer}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Paid & Print
              </Button>
            </div>
          </>
        )}

        {orderItems.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No items in order</p>
            <p className="text-xs">Add photos to create an order</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
