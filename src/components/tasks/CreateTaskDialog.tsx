import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task, TaskPriority } from '@/types';
import { teamMembers, demoLeads, demoBookings, demoClients } from '@/data/demoData';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export default function CreateTaskDialog({
  open,
  onClose,
  onSave,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [relatedType, setRelatedType] = useState<'lead' | 'booking' | 'client' | ''>('');
  const [relatedId, setRelatedId] = useState('');

  const getRelatedOptions = () => {
    switch (relatedType) {
      case 'lead':
        return demoLeads.map((l) => ({ id: l.id, name: l.name }));
      case 'booking':
        return demoBookings.map((b) => ({ id: b.id, name: `${b.clientName} - ${b.eventType}` }));
      case 'client':
        return demoClients.map((c) => ({ id: c.id, name: c.name }));
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !assignedTo || !dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const task: Omit<Task, 'id' | 'createdAt'> = {
      title,
      description: description || undefined,
      assignedTo,
      priority,
      status: 'pending',
      dueDate: new Date(dueDate),
      relatedTo: relatedType && relatedId ? { type: relatedType, id: relatedId } : undefined,
    };

    onSave(task);
    toast.success('Task created successfully');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate('');
    setRelatedType('');
    setRelatedId('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Create New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              placeholder="Task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assign To *</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Related To (Optional)</Label>
              <Select value={relatedType} onValueChange={(v) => { setRelatedType(v as any); setRelatedId(''); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="booking">Booking</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {relatedType && (
              <div className="space-y-2">
                <Label>Select {relatedType}</Label>
                <Select value={relatedId} onValueChange={setRelatedId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${relatedType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getRelatedOptions().map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
