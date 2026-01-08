import { useState } from 'react';
import { History, Search, Eye, Printer, Check, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { PassportOrder } from '@/types/passportBusiness';
import { format } from 'date-fns';

interface OrderHistoryProps {
  orders: PassportOrder[];
  onUpdateStatus: (orderId: string, status: PassportOrder['status']) => void;
  onPrintOrder: (order: PassportOrder) => void;
}

export function OrderHistory({ orders, onUpdateStatus, onPrintOrder }: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PassportOrder | null>(null);

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: PassportOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'printed':
        return <Badge variant="secondary" className="text-blue-600"><Printer className="h-3 w-3 mr-1" />Printed</Badge>;
      case 'delivered':
        return <Badge variant="default" className="text-green-600"><Check className="h-3 w-3 mr-1" />Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: PassportOrder['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500"><Check className="h-3 w-3 mr-1" />Paid</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="text-red-600">Unpaid</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="text-orange-600">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Orders List */}
      <ScrollArea className="h-[400px] pr-2">
        {filteredOrders.length > 0 ? (
          <div className="space-y-2">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-medium text-sm">{order.customerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{order.total}</div>
                    {getPaymentBadge(order.paymentStatus)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Order Details</SheetTitle>
                        </SheetHeader>
                        {selectedOrder && (
                          <div className="mt-6 space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Order ID</span>
                                <span className="font-mono text-sm">{selectedOrder.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Customer</span>
                                <span>{selectedOrder.customerName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date</span>
                                <span>{format(new Date(selectedOrder.createdAt), 'dd MMM yyyy')}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Status</span>
                                {getStatusBadge(selectedOrder.status)}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Payment</span>
                                {getPaymentBadge(selectedOrder.paymentStatus)}
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h4 className="font-medium mb-2">Items</h4>
                              <div className="space-y-2">
                                {selectedOrder.items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.templateName} × {item.quantity}</span>
                                    <span>₹{item.total}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{selectedOrder.subtotal}</span>
                              </div>
                              {selectedOrder.tax > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tax</span>
                                  <span>₹{selectedOrder.tax}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹{selectedOrder.total}</span>
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <h4 className="font-medium">Update Status</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateStatus(selectedOrder.id, 'printed')}
                                  disabled={selectedOrder.status === 'printed'}
                                >
                                  <Printer className="h-4 w-4 mr-1" />
                                  Printed
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUpdateStatus(selectedOrder.id, 'delivered')}
                                  disabled={selectedOrder.status === 'delivered'}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Delivered
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </SheetContent>
                    </Sheet>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onPrintOrder(order)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No orders found</p>
            <p className="text-xs">Orders will appear here</p>
          </div>
        )}
      </ScrollArea>

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">{orders.length}</div>
            <div className="text-xs text-muted-foreground">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              ₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>
      )}
    </div>
  );
}
