import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead, LeadStatus } from '@/types';
import { Phone, Mail, Calendar, MapPin, DollarSign, User, MessageCircle, Trash2, Save, Edit2, X } from 'lucide-react';
import { format } from 'date-fns';
import { teamMembers } from '@/data/demoData';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface LeadDetailSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  quoted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  converted: 'bg-green-500/10 text-green-500 border-green-500/20',
  lost: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const eventTypeLabels: Record<string, string> = {
  wedding: 'Wedding',
  baby_shower: 'Baby Shower',
  birthday: 'Birthday',
  engagement: 'Engagement',
  corporate: 'Corporate',
  passport_photo: 'Passport Photo',
  portfolio: 'Portfolio',
  product_shoot: 'Product Shoot',
  other: 'Other',
};

export function LeadDetailSheet({ lead, open, onOpenChange, onUpdate, onDelete }: LeadDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [editedStatus, setEditedStatus] = useState<LeadStatus>('new');

  if (!lead) return null;

  const assignedMember = teamMembers.find(m => m.id === lead.assignedTo);

  const formatBudget = (budget?: number) => {
    if (!budget) return 'Not specified';
    if (budget >= 100000) return `₹${(budget / 100000).toFixed(1)} Lakh`;
    return `₹${budget.toLocaleString()}`;
  };

  const handleEdit = () => {
    setEditedNotes(lead.notes || '');
    setEditedStatus(lead.status);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(lead.id, { 
      notes: editedNotes,
      status: editedStatus 
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(lead.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">{lead.name}</SheetTitle>
              <SheetDescription className="capitalize">{lead.source} Lead</SheetDescription>
            </div>
            <Badge className={statusStyles[lead.status]} variant="outline">
              {lead.status}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${lead.phone}`} className="text-foreground hover:text-primary">
                  {lead.phone}
                </a>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${lead.email}`} className="text-foreground hover:text-primary">
                    {lead.email}
                  </a>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" asChild>
                <a href={`tel:${lead.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Event Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {lead.eventType && (
                <div>
                  <p className="text-xs text-muted-foreground">Event Type</p>
                  <p className="font-medium">{eventTypeLabels[lead.eventType]}</p>
                </div>
              )}
              {lead.eventDate && (
                <div>
                  <p className="text-xs text-muted-foreground">Event Date</p>
                  <p className="font-medium">{format(new Date(lead.eventDate), 'PPP')}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-medium text-primary">{formatBudget(lead.budget)}</p>
              </div>
              {lead.followUpDate && (
                <div>
                  <p className="text-xs text-muted-foreground">Follow-up Date</p>
                  <p className="font-medium">{format(new Date(lead.followUpDate), 'PPP')}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Status & Assignment */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Status & Assignment</h3>
            {isEditing ? (
              <Select value={editedStatus} onValueChange={(v) => setEditedStatus(v as LeadStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Status</p>
                  <Badge className={statusStyles[lead.status]} variant="outline">
                    {lead.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned To</p>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {assignedMember?.name || 'Unassigned'}
                  </p>
                </div>
              </div>
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
                placeholder="Add notes..."
                rows={4}
              />
            ) : (
              <p className="text-foreground text-sm bg-muted/50 p-3 rounded-lg">
                {lead.notes || 'No notes added'}
              </p>
            )}
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Created: {format(new Date(lead.createdAt), 'PPP')}</p>
            <p>Last Updated: {format(new Date(lead.updatedAt), 'PPP')}</p>
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
                      <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this lead? This action cannot be undone.
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
