import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

import { TaskService } from '../../services/task.service';
import {
  Task,
  TaskStatus,
  Priority,
  User,
  CreateTaskData,
  UpdateTaskData,
} from '../../models/task.model';

@Component({
  selector: 'app-form-task-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatAutocompleteModule,
  ],
  templateUrl: './form-task-details.html',
  styleUrl: './form-task-details.scss'
})
export class FormTaskDetails implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private snackBar = inject(MatSnackBar);

  // State
  loading = signal(false);
  submitting = signal(false);
  currentTask = signal<Task | null>(null);
  users: User[] = [];
  availableTags: string[] = [];

  // Form
  taskForm: FormGroup;
  tagControl = new FormControl('');
  currentTags = signal<string[]>([]);
  filteredTags: Observable<string[]>;

  // Computed
  isEditMode = computed(() => !!this.route.snapshot.params['id']);
  taskId = computed(() => this.route.snapshot.params['id']);

  // Options
  statusOptions = [
    { value: TaskStatus.BACKLOG, label: 'Backlog' },
    { value: TaskStatus.PENDING, label: 'Pending' },
    { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
    { value: TaskStatus.IN_REVIEW, label: 'In Review' },
    { value: TaskStatus.DONE, label: 'Done' },
  ];

  priorityOptions = [
    { value: Priority.LOW, label: 'Low' },
    { value: Priority.MEDIUM, label: 'Medium' },
    { value: Priority.HIGH, label: 'High' },
    { value: Priority.CRITICAL, label: 'Critical' },
  ];

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [TaskStatus.PENDING],
      priority: [Priority.MEDIUM, Validators.required],
      assigneeId: [''],
      dueDate: ['', Validators.required],
    });

    // Setup tag autocomplete
    this.filteredTags = this.tagControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTags(value || '')),
    );
  }

  ngOnInit() {
    this.loadUsers();
    this.loadTags();

    if (this.isEditMode()) {
      this.loadTask();
    } else {
      // Set default due date to 1 week from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 7);
      this.taskForm.patchValue({
        dueDate: defaultDueDate,
      });
    }
  }

  private loadTask() {
    if (!this.taskId()) return;

    this.loading.set(true);
    this.taskService.getTaskById(this.taskId()).subscribe({
      next: (task) => {
        this.currentTask.set(task);
        this.populateForm(task);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open('Task not found', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
        this.goBack();
      },
    });
  }

  private populateForm(task: Task) {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assignee?.id || '',
      dueDate: new Date(task.dueDate),
    });

    this.currentTags.set([...task.tags]);
  }

  private loadUsers() {
    this.taskService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
    });
  }

  private loadTags() {
    this.taskService.getTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
      },
    });
  }

  private _filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableTags.filter(
      (tag) =>
        tag.toLowerCase().includes(filterValue) &&
        !this.currentTags().includes(tag),
    );
  }

  addTag(event: KeyboardEvent | Event) {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (value && !this.currentTags().includes(value)) {
      this.currentTags.update((tags) => [...tags, value]);
      this.tagControl.setValue('');
    }
  }

  addTagFromOption(event: any) {
    const value = event.option.value;
    if (value && !this.currentTags().includes(value)) {
      this.currentTags.update((tags) => [...tags, value]);
      this.tagControl.setValue('');
    }
  }

  removeTag(tag: string) {
    this.currentTags.update((tags) => tags.filter((t) => t !== tag));
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      return;
    }

    this.submitting.set(true);
    const formData = this.taskForm.value;

    const taskData = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      dueDate: formData.dueDate.toISOString(),
      tags: this.currentTags(),
      assigneeId: formData.assigneeId || undefined,
    };

    if (this.isEditMode()) {
      const updateData: UpdateTaskData = {
        ...taskData,
        status: formData.status,
      };

      this.taskService.updateTask(this.taskId(), updateData).subscribe({
        next: (task) => {
          this.submitting.set(false);
          this.snackBar.open('Task updated successfully', 'Close', {
            duration: 3000,
          });
          this.goBack();
        },
        error: (error) => {
          this.submitting.set(false);
          this.snackBar.open('Failed to update task', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
        },
      });
    } else {
      const createData: CreateTaskData = taskData;

      this.taskService.createTask(createData).subscribe({
        next: (task) => {
          this.submitting.set(false);
          this.snackBar.open('Task created successfully', 'Close', {
            duration: 3000,
          });
          this.goBack();
        },
        error: (error) => {
          this.submitting.set(false);
          this.snackBar.open('Failed to create task', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
        },
      });
    }
  }

  deleteTask() {
    if (!this.currentTask()) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${this.currentTask()?.title}"? This action cannot be undone.`,
    );

    if (confirmed) {
      this.taskService.deleteTask(this.currentTask()!.uid).subscribe({
        next: () => {
          this.snackBar.open('Task deleted successfully', 'Close', {
            duration: 3000,
          });
          this.goBack();
        },
        error: () => {
          this.snackBar.open('Failed to delete task', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar',
          });
        },
      });
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
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
    const icons = {
      [TaskStatus.BACKLOG]: 'inventory_2',
      [TaskStatus.PENDING]: 'schedule',
      [TaskStatus.IN_PROGRESS]: 'play_circle',
      [TaskStatus.IN_REVIEW]: 'rate_review',
      [TaskStatus.DONE]: 'check_circle',
    };
    return icons[status] || 'help';
  }
}