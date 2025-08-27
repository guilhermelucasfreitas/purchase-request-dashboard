import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  ],
  templateUrl: './form-task-details.html',
  styleUrl: './form-task-details.scss',
})
export class FormTaskDetails implements OnInit {
  taskForm: FormGroup;
  taskId = signal<string | null>(null);
  isEditMode = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['PENDING', Validators.required],
      priority: ['MEDIUM', Validators.required],
      assigneeId: [''],
      dueDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskId.set(id);
      this.isEditMode.set(true);
      this.loadTask(id);
    }
  }

  loadTask(id: string) {
    // TODO: Implement task loading from service
    console.log('Loading task:', id);
    // Simulate loading task data
    // this.taskService.getTask(id).subscribe(task => {
    //   this.taskForm.patchValue(task);
    // });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;

      if (this.isEditMode()) {
        // TODO: Implement task update
        this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
      } else {
        // TODO: Implement task creation
        this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
      }

      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['/tasks']);
  }
}
