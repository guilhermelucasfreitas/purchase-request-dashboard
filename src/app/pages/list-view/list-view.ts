import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Task, TaskStatus, TaskFilters, PaginationParams, User } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Filter } from '../../components/filter/filter';
import { Table } from '../../components/table/table';
import { StatsCards } from '../../components/stats-cards/stats-cards';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDividerModule,
    Filter,
    Table,
    StatsCards,
  ],
  templateUrl: './list-view.html',
  styleUrl: './list-view.scss',
})
export class ListView implements OnInit {
  // Data and state signals
  tasks = signal<Task[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showOverdueOnly = signal(false);
  users = signal<User[]>([]);

  // Table configuration signals
  displayedColumns = signal<string[]>([
    'uid',
    'title',
    'assignee',
    'status',
    'priority',
    'dueDate',
    'actions',
  ]);
  paginatorOptions = signal<number[]>([5, 10, 25, 50]);
  pageSize = signal<number>(10);
  currentPage = signal<number>(0);

  // Current filters state
  private currentFilters = signal<TaskFilters>({});

  // Computed values for stats
  pendingCount = computed(
    () => this.tasks().filter((task) => task.status === TaskStatus.PENDING).length
  );

  inProgressCount = computed(
    () => this.tasks().filter((task) => task.status === TaskStatus.IN_PROGRESS).length
  );

  doneCount = computed(() => this.tasks().filter((task) => task.status === TaskStatus.DONE).length);

  totalCount = computed(() => this.tasks().length);

  overdueCount = computed(() => this.tasks().filter((task) => this.isOverdue(task)).length);

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadData();
  }

  // Handle filter changes from the Filter component
  onFiltersChanged(filters: TaskFilters) {
    this.currentFilters.set(filters);
    this.loadData(filters);
  }

  // Handle overdue toggle from the Filter component
  onOverdueToggled(showOverdue: boolean) {
    this.showOverdueOnly.set(showOverdue);
  }

  // Handle clear filters from the Filter component
  onFiltersCleared() {
    this.currentFilters.set({});
    this.showOverdueOnly.set(false);
    this.loadData();
  }

  // Handle page changes from the Table component
  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadData();
  }

  loadData(filters?: TaskFilters) {
    const pagination: PaginationParams = {
      page: this.currentPage() + 1,
      size: this.pageSize(),
    };

    this.loading.set(true);
    this.error.set(null);

    // Use provided filters or current filters
    const filtersToApply = filters || this.currentFilters();

    this.taskService.getTasks(filtersToApply, undefined, pagination).subscribe({
      next: (response) => {
        this.tasks.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set('Failed to load tasks');
        this.snackBar.open('Failed to load tasks', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  loadUsers() {
    this.taskService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users.filter((user) => user.active !== false));
      },
      error: (error) => {
        console.error('Failed to load users:', error);
      },
    });
  }

  // Action methods
  openCreateTask() {
    this.router.navigate(['/tasks/new']);
  }

  viewTask(task: Task) {
    this.snackBar.open(`Viewing task: ${task.title}`, 'Close', { duration: 3000 });
  }

  editTask(task: Task) {
    this.snackBar.open(`Editing task: ${task.title}`, 'Close', { duration: 3000 });
  }

  duplicateTask(task: Task) {
    this.snackBar.open(`Duplicating task: ${task.title}`, 'Close', { duration: 3000 });
  }

  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.uid).subscribe({
        next: () => {
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: () => {
          this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
        },
      });
    }
  }

  exportData() {
    this.snackBar.open('Export functionality will be implemented', 'Close', { duration: 3000 });
  }

  // Utility method
  private isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  }
}
