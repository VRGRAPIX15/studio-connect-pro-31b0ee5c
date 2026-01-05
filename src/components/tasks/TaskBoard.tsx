import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { format } from 'date-fns';
import { teamMembers } from '@/data/demoData';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasksByStatus: Record<TaskStatus, Task[]>;
  onTaskClick: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'pending', title: 'Pending', color: 'bg-warning' },
  { status: 'in_progress', title: 'In Progress', color: 'bg-info' },
  { status: 'completed', title: 'Completed', color: 'bg-success' },
];

export default function TaskBoard({
  tasksByStatus,
  onTaskClick,
  onStatusChange,
}: TaskBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column, columnIndex) => (
        <motion.div
          key={column.status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: columnIndex * 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <CardTitle className="text-base font-medium">{column.title}</CardTitle>
                </div>
                <Badge variant="secondary" className="font-normal">
                  {tasksByStatus[column.status].length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus[column.status].length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No tasks
                </p>
              ) : (
                tasksByStatus[column.status].map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: taskIndex * 0.05 }}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      onStatusChange={onStatusChange}
                    />
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
