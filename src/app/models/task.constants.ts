import { TaskStatus, Priority } from './task.model';

export const TASK_STATUS_CONFIG = {
  [TaskStatus.BACKLOG]: {
    label: 'Backlog',
    icon: 'inventory_2',
  },
  [TaskStatus.PENDING]: {
    label: 'Pending',
    icon: 'schedule',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    icon: 'play_circle',
  },
  [TaskStatus.IN_REVIEW]: {
    label: 'In Review',
    icon: 'rate_review',
  },
  [TaskStatus.DONE]: {
    label: 'Done',
    icon: 'check_circle',
  },
} as const;

export const PRIORITY_CONFIG = {
  [Priority.LOW]: {
    label: 'Low',
  },
  [Priority.MEDIUM]: {
    label: 'Medium',
  },
  [Priority.HIGH]: {
    label: 'High',
  },
  [Priority.CRITICAL]: {
    label: 'Critical',
  },
} as const;

export const STATUS_OPTIONS = Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => ({
  value: value as TaskStatus,
  label: config.label,
}));

export const PRIORITY_OPTIONS = Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
  value: value as Priority,
  label: config.label,
}));

export const getStatusIcon = (status: TaskStatus): string => {
  return TASK_STATUS_CONFIG[status]?.icon || 'help';
};
