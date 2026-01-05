import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types';
import { Task } from '@/types';

interface TeamWorkload extends User {
  totalTasks: number;
  pending: number;
  inProgress: number;
  completed: number;
}

interface WorkloadViewProps {
  workloadData: TeamWorkload[];
  onTaskClick: (task: Task) => void;
}

export default function WorkloadView({ workloadData }: WorkloadViewProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const maxTasks = Math.max(...workloadData.map((m) => m.totalTasks), 1);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {workloadData.map((member, index) => {
            const completionRate = member.totalTasks > 0
              ? Math.round((member.completed / member.totalTasks) * 100)
              : 0;
            const workloadPercent = (member.totalTasks / maxTasks) * 100;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{member.totalTasks} tasks</p>
                    <p className="text-sm text-muted-foreground">
                      {completionRate}% complete
                    </p>
                  </div>
                </div>

                {/* Workload Bar */}
                <div className="space-y-1">
                  <div className="flex gap-1 h-8 rounded-lg overflow-hidden bg-muted">
                    {member.completed > 0 && (
                      <div
                        className="bg-success flex items-center justify-center text-xs text-success-foreground font-medium"
                        style={{ width: `${(member.completed / member.totalTasks) * 100}%` }}
                      >
                        {member.completed > 0 && member.completed}
                      </div>
                    )}
                    {member.inProgress > 0 && (
                      <div
                        className="bg-info flex items-center justify-center text-xs text-info-foreground font-medium"
                        style={{ width: `${(member.inProgress / member.totalTasks) * 100}%` }}
                      >
                        {member.inProgress > 0 && member.inProgress}
                      </div>
                    )}
                    {member.pending > 0 && (
                      <div
                        className="bg-warning flex items-center justify-center text-xs text-warning-foreground font-medium"
                        style={{ width: `${(member.pending / member.totalTasks) * 100}%` }}
                      >
                        {member.pending > 0 && member.pending}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-success" />
                      Completed ({member.completed})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-info" />
                      In Progress ({member.inProgress})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-warning" />
                      Pending ({member.pending})
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
