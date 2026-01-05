import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { format, isPast, isToday } from 'date-fns';
import { teamMembers } from '@/data/demoData';
import {
  Calendar,
  MoreVertical,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Flag,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: typeof Flag }> = {
  urgent: { label: 'Urgent', color: 'text-destructive', icon: AlertTriangle },
  high: { label: 'High', color: 'text-warning', icon: Flag },
  medium: { label: 'Medium', color: 'text-info', icon: Flag },
  low: { label: 'Low', color: 'text-muted-foreground', icon: Flag },
};

export default function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const assignee = teamMembers.find((m) => m.id === task.assignedTo);
  const priority = priorityConfig[task.priority];
  const isOverdue = isPast(new Date(task.dueDate)) && task.status !== 'completed';
  const isDueToday = isToday(new Date(task.dueDate));

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getNextStatus = (): TaskStatus | null => {
    switch (task.status) {
      case 'pending':
        return 'in_progress';
      case 'in_progress':
        return 'completed';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
      style={{
        borderLeftColor:
          task.priority === 'urgent'
            ? 'hsl(var(--destructive))'
            : task.priority === 'high'
            ? 'hsl(var(--warning))'
            : 'transparent',
      }}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {nextStatus && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, nextStatus);
                  }}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Move to {nextStatus === 'in_progress' ? 'In Progress' : 'Completed'}
                </DropdownMenuItem>
              )}
              {task.status !== 'completed' && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(task.id, 'completed');
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {assignee && (
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {getInitials(assignee.name)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`flex items-center gap-1 ${priority.color}`}>
              <priority.icon className="h-3 w-3" />
            </div>
          </div>

          <div
            className={`flex items-center gap-1 text-xs ${
              isOverdue
                ? 'text-destructive'
                : isDueToday
                ? 'text-warning'
                : 'text-muted-foreground'
            }`}
          >
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.dueDate), 'dd MMM')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
