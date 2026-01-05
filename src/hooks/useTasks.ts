import { useState, useMemo, useCallback, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, User } from '@/types';
import { API_CONFIG } from '@/config/api';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all');

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getTasks`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const tasksWithDates = data.map((t: any) => ({
          id: t.Id,
          title: t.Title,
          description: t.Description || undefined,
          assignedTo: t.AssignedTo || undefined,
          relatedTo: t.RelatedType && t.RelatedId ? {
            type: t.RelatedType,
            id: t.RelatedId,
          } : undefined,
          priority: t.Priority as TaskPriority,
          status: t.Status as TaskStatus,
          dueDate: new Date(t.DueDate),
          completedAt: t.CompletedAt ? new Date(t.CompletedAt) : undefined,
          createdAt: new Date(t.CreatedAt),
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await fetch(`${API_CONFIG.GOOGLE_SCRIPT_URL}?action=getUsers`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const users = data.map((u: any) => ({
          id: u.Id,
          email: u.Email,
          name: u.Name,
          phone: u.Phone || '',
          role: u.Role as 'owner' | 'manager' | 'staff',
          avatar: u.Avatar || '',
          createdAt: new Date(u.CreatedAt),
          isActive: u.IsActive,
        }));
        setTeamMembers(users);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
  }, [fetchTasks, fetchTeamMembers]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || task.assignedTo === assigneeFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, assigneeFilter]);

  const tasksByStatus = useMemo(() => {
    return {
      pending: tasks.filter((t) => t.status === 'pending'),
      in_progress: tasks.filter((t) => t.status === 'in_progress'),
      completed: tasks.filter((t) => t.status === 'completed'),
      cancelled: tasks.filter((t) => t.status === 'cancelled'),
    };
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter(
      (t) =>
        t.status !== 'completed' &&
        t.status !== 'cancelled' &&
        new Date(t.dueDate) < new Date()
    ).length;
    const urgent = tasks.filter(
      (t) => t.priority === 'urgent' && t.status !== 'completed'
    ).length;

    return { total, pending, inProgress, completed, overdue, urgent };
  }, [tasks]);

  const workloadByTeam = useMemo(() => {
    return teamMembers.map((member) => {
      const memberTasks = tasks.filter((t) => t.assignedTo === member.id);
      const pending = memberTasks.filter((t) => t.status === 'pending').length;
      const inProgress = memberTasks.filter((t) => t.status === 'in_progress').length;
      const completed = memberTasks.filter((t) => t.status === 'completed').length;

      return {
        ...member,
        totalTasks: memberTasks.length,
        pending,
        inProgress,
        completed,
      };
    });
  }, [tasks, teamMembers]);

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addTask',
          task: {
            Title: task.title,
            Description: task.description,
            AssignedTo: task.assignedTo,
            RelatedType: task.relatedTo?.type,
            RelatedId: task.relatedTo?.id,
            Priority: task.priority,
            Status: task.status,
            DueDate: task.dueDate.toISOString(),
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Task created successfully');
        fetchTasks();
        return result.task;
      } else {
        toast.error(result.error || 'Failed to create task');
        return null;
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
      return null;
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateTask',
          id,
          task: {
            Title: updates.title,
            Description: updates.description,
            AssignedTo: updates.assignedTo,
            Priority: updates.priority,
            Status: updates.status,
            DueDate: updates.dueDate?.toISOString(),
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Task updated successfully');
        fetchTasks();
      } else {
        toast.error(result.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'updateTaskStatus', id, status }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Task status updated');
        fetchTasks();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(API_CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'deleteTask', id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Task deleted successfully');
        fetchTasks();
      } else {
        toast.error(result.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  }, [fetchTasks]);

  const getTaskById = useCallback((id: string) => {
    return tasks.find((task) => task.id === id);
  }, [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    tasksByStatus,
    stats,
    workloadByTeam,
    teamMembers,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTaskById,
    refetch: fetchTasks,
  };
}
