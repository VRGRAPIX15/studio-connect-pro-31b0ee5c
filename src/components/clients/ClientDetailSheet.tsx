import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Client } from '@/types';
import { Phone, Mail, MapPin, Calendar, DollarSign, MessageCircle, Trash2, Save, Edit2, X, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ClientDetailSheetProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Client>) => void;
  onDelete: (id: string) => void;
}

export function ClientDetailSheet({ client, open, onOpenChange, onUpdate, onDelete }: ClientDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedAddress, setEditedAddress] = useState('');

  if (!client) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} Lakh`;
    return `₹${value.toLocaleString()}`;
  };

  const handleEdit = () => {
    setEditedNotes(client.notes || '');
    setEditedAddress(client.address || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(client.id, { 
      notes: editedNotes,
      address: editedAddress,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(client.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{client.name}</SheetTitle>
              <SheetDescription>
                Client since {format(new Date(client.createdAt), 'MMMM yyyy')}
              </SheetDescription>
              <Badge variant="secondary" className="mt-2 capitalize">
                {client.source}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-bold text-foreground">{client.totalBookings}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(client.totalSpent)}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${client.phone}`} className="text-foreground hover:text-primary">
                  {client.phone}
                </a>
              </div>
              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${client.email}`} className="text-foreground hover:text-primary">
                    {client.email}
                  </a>
                </div>
              )}
              {isEditing ? (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-2" />
                  <Input
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    placeholder="Enter address"
                    className="flex-1"
                  />
                </div>
              ) : client.address ? (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{client.address}</span>
                </div>
              ) : null}
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" asChild>
                <a href={`tel:${client.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={`https://wa.me/${client.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Event History */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Event History</h3>
            {client.lastEventDate ? (
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="font-medium">Last Event</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(client.lastEventDate), 'PPPP')}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No events yet</p>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
            {isEditing ? (
              <Textarea
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                placeholder="Add notes about this client..."
                rows={4}
              />
            ) : (
              <p className="text-foreground text-sm bg-muted/50 p-3 rounded-lg">
                {client.notes || 'No notes added'}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleEdit} className="flex-1">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex-1">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Client</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this client? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
