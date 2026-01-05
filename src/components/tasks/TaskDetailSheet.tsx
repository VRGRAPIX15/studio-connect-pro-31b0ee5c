import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { format, isPast } from 'date-fns';
import { teamMembers } from '@/data/demoData';
import {
  Calendar,
  User,
  Flag,
  Link2,
  CheckCircle,
  Clock,
  Trash2,
  Play,
} from 'lucide-react';

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  high: { label: 'High', className: 'bg-warning/10 text-warning border-warning/20' },
  medium: { label: 'Medium', className: 'bg-info/10 text-info border-info/20' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border-muted' },
};

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/20' },
  in_progress: { label: 'In Progress', className: 'bg-info/10 text-info border-info/20' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/20' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground border-muted' },
};

export default function TaskDetailSheet({
  task,
  open,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailSheetProps) {
  if (!task) return null;

  const assignee = teamMembers.find((m) => m.id === task.assignedTo);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'completed';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg pr-8">Task Details</SheetTitle>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-muted-foreground mt-2">{task.description}</p>
            )}
          </div>

          <Separator />

          {/* Details */}
          <div className="space-y-4">
            {/* Assignee */}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Assigned To</p>
                {assignee ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm">Unassigned</span>
                )}
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <Flag className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Priority</p>
                <Badge variant="outline" className={`mt-1 ${priority.className}`}>
                  {priority.label}
                </Badge>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                  {format(new Date(task.dueDate), 'EEEE, dd MMMM yyyy')}
                  {isOverdue && (
                    <span className="ml-2 text-sm text-destructive">(Overdue)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Related To */}
            {task.relatedTo && (
              <div className="flex items-center gap-3">
                <Link2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Related To</p>
                  <p className="font-medium capitalize">{task.relatedTo.type}</p>
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {format(new Date(task.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            {task.status === 'pending' && (
              <Button
                className="w-full gap-2"
                onClick={() => handleStatusChange('in_progress')}
              >
                <Play className="h-4 w-4" />
                Start Task
              </Button>
            )}
            {task.status === 'in_progress' && (
              <Button
                className="w-full gap-2"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle className="h-4 w-4" />
                Mark Complete
              </Button>
            )}
            {task.status === 'completed' && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleStatusChange('pending')}
              >
                <Clock className="h-4 w-4" />
                Reopen Task
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Task
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
