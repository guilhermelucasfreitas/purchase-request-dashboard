import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import {
  Task,
  TaskStatus,
  Priority,
  User,
  TaskFilters,
  TaskSorting,
  PaginationParams,
  PaginatedResponse,
  CreateTaskData,
  UpdateTaskData,
  MockData,
} from '../models/task.model';
import { mockData } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private mockData: MockData = mockData;

  // State management with signals
  private _tasks = signal<Task[]>(this.mockData.tasks);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  //signal to save filtered tasks
  private _filteredTasks = signal<Task[]>(this.mockData.tasks);

  // Public readonly signals
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly totalTasks = computed(() => this._filteredTasks().length);
  readonly pendingTasks = computed(
    () => this._filteredTasks().filter((task) => task.status === TaskStatus.PENDING).length
  );

  readonly inProgressTasks = computed(
    () => this._filteredTasks().filter((task) => task.status === TaskStatus.IN_PROGRESS).length
  );

  readonly inReviewTasks = computed(
    () => this._filteredTasks().filter((task) => task.status === TaskStatus.IN_REVIEW).length
  );

  readonly doneTasks = computed(
    () => this._filteredTasks().filter((task) => task.status === TaskStatus.DONE).length
  );
  readonly overdueTasks = computed(
    () =>
      this._filteredTasks().filter(
        (task) => new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE
      ).length
  );

  constructor() {}

  // Get paginated and filtered tasks
  getTasks(
    filters?: TaskFilters,
    sorting?: TaskSorting,
    pagination?: PaginationParams
  ): Observable<PaginatedResponse<Task>> {
    this._loading.set(true);
    this._error.set(null);

    return new Observable((observer) => {
      setTimeout(() => {
        try {
          let filteredTasks = [...this.mockData.tasks];

          // Apply filters
          if (filters) {
            filteredTasks = this.applyFilters(filteredTasks, filters);
          }

          //update the signal with the filtered list BEFORE paging
          this._filteredTasks.set(filteredTasks);

          if (sorting) {
            filteredTasks = this.applySorting(filteredTasks, sorting);
          }

          // Apply pagination
          const page = pagination?.page || 1;
          const size = pagination?.size || 10;
          const startIndex = (page - 1) * size;
          const endIndex = startIndex + size;
          const paginatedData = filteredTasks.slice(startIndex, endIndex);

          const response: PaginatedResponse<Task> = {
            data: paginatedData,
            total: filteredTasks.length,
            page,
            size,
            totalPages: Math.ceil(filteredTasks.length / size),
          };

          this._loading.set(false);
          observer.next(response);
          observer.complete();
        } catch (error) {
          this._loading.set(false);
          this._error.set('Failed to load tasks');
          this._filteredTasks.set([]);
          observer.error(error);
        }
      }, 800); // Simulate network delay
    });
  }

  // Get single task by ID
  getTaskById(uid: string): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    const task = this.mockData.tasks.find((t) => t.uid === uid);

    if (task) {
      return of(task).pipe(delay(300));
    } else {
      return throwError(() => new Error('Task not found'));
    }
  }

  // Create new task
  createTask(data: CreateTaskData): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return new Observable((observer) => {
      setTimeout(() => {
        try {
          const assignee = data.assigneeId
            ? this.mockData.users.find((u) => u.id === data.assigneeId) || null
            : null;

          const newTask: Task = {
            uid: `T-${Date.now()}`,
            title: data.title,
            description: data.description,
            status: TaskStatus.BACKLOG,
            priority: data.priority,
            dueDate: data.dueDate,
            tags: data.tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assignee,
          };

          this.mockData.tasks.push(newTask);
          this._tasks.set([...this.mockData.tasks]);
          this._loading.set(false);

          observer.next(newTask);
          observer.complete();
        } catch (error) {
          this._loading.set(false);
          this._error.set('Failed to create task');
          observer.error(error);
        }
      }, 1000);
    });
  }

  // Update task
  updateTask(uid: string, data: UpdateTaskData): Observable<Task> {
    this._loading.set(true);
    this._error.set(null);

    return new Observable((observer) => {
      setTimeout(() => {
        try {
          const index = this.mockData.tasks.findIndex((task) => task.uid === uid);

          if (index === -1) {
            throw new Error('Task not found');
          }

          const assignee = data.assigneeId
            ? this.mockData.users.find((u) => u.id === data.assigneeId) || null
            : this.mockData.tasks[index].assignee;

          const updatedTask: Task = {
            ...this.mockData.tasks[index],
            ...data,
            assignee,
            updatedAt: new Date().toISOString(),
          };

          this.mockData.tasks[index] = updatedTask;
          this._tasks.set([...this.mockData.tasks]);
          this._loading.set(false);

          observer.next(updatedTask);
          observer.complete();
        } catch (error) {
          this._loading.set(false);
          this._error.set('Failed to update task');
          observer.error(error);
        }
      }, 1000);
    });
  }

  // Delete task
  deleteTask(uid: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return new Observable((observer) => {
      setTimeout(() => {
        try {
          const index = this.mockData.tasks.findIndex((task) => task.uid === uid);

          if (index === -1) {
            throw new Error('Task not found');
          }

          this.mockData.tasks.splice(index, 1);
          this._tasks.set([...this.mockData.tasks]);
          this._loading.set(false);

          observer.next();
          observer.complete();
        } catch (error) {
          this._loading.set(false);
          this._error.set('Failed to delete task');
          observer.error(error);
        }
      }, 500);
    });
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return of(this.mockData.users).pipe(delay(300));
  }

  // Get all unique tags
  getTags(): Observable<string[]> {
    const allTags = this.mockData.tasks.flatMap((task) => task.tags);
    const uniqueTags = [...new Set(allTags)].sort();
    return of(uniqueTags).pipe(delay(200));
  }

  private applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter((task) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm) ||
          task.assignee?.name.toLowerCase().includes(searchTerm) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some((tag) => task.tags.includes(tag))) return false;
      }

      // Assignee filter
      if (filters.assignee && filters.assignee.length > 0) {
        if (!task.assignee || !filters.assignee.includes(task.assignee.id)) return false;
      }

      // Overdue filter
      if (filters.overdue) {
        const isOverdue = new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
        if (!isOverdue) return false;
      }

      return true;
    });
  }

  private applySorting(tasks: Task[], sorting: TaskSorting): Task[] {
    return tasks.sort((a, b) => {
      const aValue = a[sorting.field];
      const bValue = b[sorting.field];

      let result = 0;

      if (aValue != null && bValue != null) {
        if (aValue < bValue) result = -1;
        else if (aValue > bValue) result = 1;
      }

      return sorting.direction === 'desc' ? -result : result;
    });
  }
}
