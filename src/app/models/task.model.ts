export enum TaskStatus {
  BACKLOG = 'Backlog',
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  IN_REVIEW = 'In Review',
  DONE = 'Done'
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  active?: boolean;
}

export interface Task {
  uid: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  assignee: User | null;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus[];
  priority?: Priority[];
  tags?: string[];
  assignee?: string[];
  overdue?: boolean;
}

export interface TaskSorting {
  field: keyof Task;
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  tags: string[];
  assigneeId?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: TaskStatus;
}

export interface MockData {
  users: User[];
  tasks: Task[];
}
