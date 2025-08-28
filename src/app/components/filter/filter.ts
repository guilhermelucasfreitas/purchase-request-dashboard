import { CommonModule } from '@angular/common';
import { Component, input, output, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { TaskStatus, Priority, TaskFilters, User } from '../../models/task.model';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../models/task.constants';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './filter.html',
  styleUrl: './filter.scss',
})
export class Filter implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Input signals
  users = input.required<User[]>();
  showOverdueOnly = input<boolean>(false);

  // Output signals
  filtersChanged = output<TaskFilters>();
  overdueToggled = output<boolean>();
  filtersCleared = output<void>();

  // Form controls
  searchControl = new FormControl<string>('');
  statusControl = new FormControl<TaskStatus[]>([]);
  priorityControl = new FormControl<Priority[]>([]);
  assigneeControl = new FormControl<string[]>([]);

  // Filter options
  statusOptions = STATUS_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;

  ngOnInit() {
    this.setupFilters();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilters() {
    // Combine all filter controls and emit changes when any filter changes
    combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged()
      ),
      this.statusControl.valueChanges.pipe(startWith([])),
      this.priorityControl.valueChanges.pipe(startWith([])),
      this.assigneeControl.valueChanges.pipe(startWith([])),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.emitFilters();
      });
  }

  private emitFilters() {
    const filters: TaskFilters = {
      search: this.searchControl.value || undefined,
      status: this.statusControl.value || undefined,
      priority: this.priorityControl.value || undefined,
      assignee:
        this.assigneeControl.value?.filter((id: string) => id !== 'unassigned') || undefined,
      overdue: this.showOverdueOnly() || undefined,
    };

    this.filtersChanged.emit(filters);
  }

  onToggleOverdue() {
    const newValue = !this.showOverdueOnly();
    this.overdueToggled.emit(newValue);
    // Re-emit filters with new overdue value
    setTimeout(() => this.emitFilters(), 0);
  }

  onClearFilters() {
    this.searchControl.setValue('');
    this.statusControl.setValue([]);
    this.priorityControl.setValue([]);
    this.assigneeControl.setValue([]);
    this.filtersCleared.emit();
  }
}
