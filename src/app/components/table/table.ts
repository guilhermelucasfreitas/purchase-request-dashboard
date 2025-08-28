import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, input, output, ViewChild, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task, TaskStatus } from '../../models/task.model';
import { getStatusIcon } from '../../models/task.constants';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Input signals
  tasks = input.required<Task[]>();
  loading = input<boolean>(false);
  displayedColumns = input<string[]>([
    'uid',
    'title',
    'assignee',
    'status',
    'priority',
    'dueDate',
    'actions',
  ]);
  paginatorOptions = input<number[]>([5, 10, 25, 50]);
  pageSize = input<number>(10);

  totalTasksCount = input<number>(0);
  currentPage = input<number>(0);

  // Output signals
  taskView = output<Task>();
  taskEdit = output<Task>();
  taskDuplicate = output<Task>();
  taskDelete = output<Task>();
  refresh = output<void>();
  export = output<void>();
  clearFilters = output<void>();
  pageChange = output<PageEvent>();

  // Data source for the table
  dataSource = new MatTableDataSource<Task>([]);

  // Effect to update dataSource when tasks input changes
  private updateDataSourceEffect = effect(() => {
    this.dataSource.data = this.tasks();
  });

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // Event handlers
  onTaskView(task: Task) {
    this.taskView.emit(task);
  }

  onTaskEdit(task: Task) {
    this.taskEdit.emit(task);
  }

  onTaskDuplicate(task: Task) {
    this.taskDuplicate.emit(task);
  }

  onTaskDelete(task: Task) {
    this.taskDelete.emit(task);
  }

  onRefresh() {
    this.refresh.emit();
  }

  onExport() {
    this.export.emit();
  }

  onClearFilters() {
    this.clearFilters.emit();
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  // Utility methods
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getStatusIcon(status: TaskStatus): string {
    return getStatusIcon(status);
  }

  getStatusClass(status: TaskStatus): string {
    return status.toLowerCase().replace(' ', '-');
  }

  isOverdue(task: Task): boolean {
    return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;
  }
}
