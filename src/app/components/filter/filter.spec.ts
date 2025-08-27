// src/app/components/filter/filter.spec.ts

import { provideZonelessChangeDetection } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Filter } from './filter';
import { Priority, TaskStatus } from '../../models/task.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockData } from '../../services/mock-data';

describe('Filter', () => {
  let component: Filter;
  let fixture: ComponentFixture<Filter>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Filter,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
      ],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Filter);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.componentRef.setInput('users', mockData.users);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Search Input', () => {
    it('should emit filters when search input changes', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      const searchField = await loader.getHarness(
        MatFormFieldHarness.with({ floatingLabelText: /Search tasks/ })
      );
      const searchInput = await searchField.getControl(MatInputHarness);

      await searchInput!.setValue('test search');

      // Wait for debounce time (300ms)
      await new Promise((resolve) => setTimeout(resolve, 350));

      expect(filtersChangedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({ search: 'test search' })
      );
    });

    it('should debounce search input', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      const searchField = await loader.getHarness(
        MatFormFieldHarness.with({ floatingLabelText: /Search tasks/ })
      );
      const searchInput = await searchField.getControl(MatInputHarness);

      // Type multiple times quickly
      await searchInput!.setValue('t');
      await searchInput!.setValue('te');
      await searchInput!.setValue('tes');
      await searchInput!.setValue('test');

      // Should not emit immediately
      expect(filtersChangedSpy).not.toHaveBeenCalled();

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 350));

      // Should only emit once with final value
      expect(filtersChangedSpy).toHaveBeenCalledTimes(1);
      expect(filtersChangedSpy).toHaveBeenCalledWith(jasmine.objectContaining({ search: 'test' }));
    });
  });

  describe('Status Select', () => {
    it('should emit filters when status is selected using harness', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      const statusFormField = await loader.getHarness(
        MatFormFieldHarness.with({ floatingLabelText: 'Status' })
      );
      const statusSelect = await statusFormField.getControl(MatSelectHarness);

      await statusSelect!.open();
      await statusSelect!.clickOptions({ text: 'In Progress' });

      // Em zoneless mode, precisamos aguardar o próximo tick
      await fixture.whenStable();

      expect(filtersChangedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({ status: [TaskStatus.IN_PROGRESS] })
      );
    });

    it('should emit filters when status control value changes directly', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      component.statusControl.setValue([TaskStatus.IN_PROGRESS]);

      await fixture.whenStable();

      expect(filtersChangedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({ status: [TaskStatus.IN_PROGRESS] })
      );
    });

    it('should allow multiple status selection', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      const statusFormField = await loader.getHarness(
        MatFormFieldHarness.with({ floatingLabelText: 'Status' })
      );
      const statusSelect = await statusFormField.getControl(MatSelectHarness);

      await statusSelect!.open();
      await statusSelect!.clickOptions({ text: 'In Progress' });
      await statusSelect!.clickOptions({ text: 'Done' });

      await fixture.whenStable();

      expect(filtersChangedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          status: [TaskStatus.IN_PROGRESS, TaskStatus.DONE],
        })
      );
    });
  });

  describe('Priority Select', () => {
    it('should emit filters when priority is selected', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      const priorityFormField = await loader.getHarness(
        MatFormFieldHarness.with({ floatingLabelText: 'Priority' })
      );
      const prioritySelect = await priorityFormField.getControl(MatSelectHarness);

      await prioritySelect!.open();
      await prioritySelect!.clickOptions({ text: 'High' });

      await fixture.whenStable();

      expect(filtersChangedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({ priority: [Priority.HIGH] })
      );
    });

    it('should emit filters when priority control value changes directly', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      component.priorityControl.setValue([Priority.HIGH, Priority.CRITICAL]);

      await fixture.whenStable();

      expect(filtersChangedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({ priority: [Priority.HIGH, Priority.CRITICAL] })
      );
    });
  });

  describe('Assignee Select', () => {
    it('should emit filters when assignee is selected', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      const assigneeFormField = await loader.getHarness(
        MatFormFieldHarness.with({ floatingLabelText: 'Assignee' })
      );
      const assigneeSelect = await assigneeFormField.getControl(MatSelectHarness);

      await assigneeSelect!.open();

      // Assumindo que o primeiro usuário tem id 'U-100'
      const options = await assigneeSelect!.getOptions();
      if (options.length > 1) {
        // Skip 'Unassigned' option
        await options[1].click();
      }

      await fixture.whenStable();

      expect(filtersChangedSpy).toHaveBeenCalled();
      const call = filtersChangedSpy.calls.mostRecent();
      expect(call.args[0].assignee).toContain('U-100');
    });

    it('should filter out "unassigned" from assignee filter', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      component.assigneeControl.setValue(['unassigned', 'U-100']);

      await fixture.whenStable();

      expect(filtersChangedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({ assignee: ['U-100'] })
      );
    });
  });

  describe('Clear Filters', () => {
    describe('Clear Filters', () => {
      it('should reset all form controls and emit filtersCleared', () => {
        // Teste apenas o essencial de forma síncrona
        spyOn(component.filtersCleared, 'emit');

        // Set valores
        component.searchControl.setValue('test');
        component.statusControl.setValue([TaskStatus.DONE]);

        // Clear
        component.onClearFilters();

        // Verificar apenas o que é síncrono
        expect(component.searchControl.value).toBe('');
        expect(component.statusControl.value).toEqual([]);
        expect(component.filtersCleared.emit).toHaveBeenCalled();
      });

      it('should emit filtersChanged after clearing', (done) => {
        // Teste separado para o assíncrono
        component.filtersChanged.subscribe(() => {
          done();
        });

        component.searchControl.setValue('test');
        setTimeout(() => {
          component.onClearFilters();
        }, 10);
      });
    });
  });

  describe('Overdue Toggle', () => {
    it('should toggle overdue status and emit events', async () => {
      const overdueToggledSpy = jasmine.createSpy('overdueToggled');
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');

      component.overdueToggled.subscribe(overdueToggledSpy);
      component.filtersChanged.subscribe(filtersChangedSpy);

      expect(component.showOverdueOnly()).toBe(false);

      const overdueButton = await loader.getHarness(
        MatButtonHarness.with({ text: /Show Overdue/ })
      );
      await overdueButton.click();

      expect(overdueToggledSpy).toHaveBeenCalledWith(true);

      // Simulate parent updating the input
      fixture.componentRef.setInput('showOverdueOnly', true);
      fixture.detectChanges();

      // Wait for setTimeout in onToggleOverdue
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(filtersChangedSpy).toHaveBeenCalledWith(jasmine.objectContaining({ overdue: true }));
    });

    it('should update button text when overdue is active', async () => {
      fixture.componentRef.setInput('showOverdueOnly', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const overdueButton = await loader.getHarness(
        MatButtonHarness.with({ text: /Showing Overdue/ })
      );

      expect(overdueButton).toBeTruthy();
    });
  });

  describe('Combined Filters', () => {
    it('should emit all active filters together', async () => {
      const filtersChangedSpy = jasmine.createSpy('filtersChanged');
      component.filtersChanged.subscribe(filtersChangedSpy);

      component.searchControl.setValue('test');
      component.statusControl.setValue([TaskStatus.IN_PROGRESS]);
      component.priorityControl.setValue([Priority.HIGH]);
      component.assigneeControl.setValue(['U-100']);

      await new Promise((resolve) => setTimeout(resolve, 350)); // Wait for debounce

      const lastCall = filtersChangedSpy.calls.mostRecent();
      expect(lastCall.args[0]).toEqual(
        jasmine.objectContaining({
          search: 'test',
          status: [TaskStatus.IN_PROGRESS],
          priority: [Priority.HIGH],
          assignee: ['U-100'],
        })
      );
    });
  });

  describe('Component Lifecycle', () => {
    it('should complete destroy$ subject on ngOnDestroy', () => {
      const destroySubject = component['destroy$'];
      spyOn(destroySubject, 'next');
      spyOn(destroySubject, 'complete');

      component.ngOnDestroy();

      expect(destroySubject.next).toHaveBeenCalled();
      expect(destroySubject.complete).toHaveBeenCalled();
    });

    it('should setup filters on ngOnInit', () => {
      spyOn<any>(component, 'setupFilters');

      component.ngOnInit();

      expect(component['setupFilters']).toHaveBeenCalled();
    });
  });

  describe('Filter Options', () => {
    it('should have correct status options', () => {
      expect(component.statusOptions).toEqual([
        { value: TaskStatus.BACKLOG, label: 'Backlog' },
        { value: TaskStatus.PENDING, label: 'Pending' },
        { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
        { value: TaskStatus.IN_REVIEW, label: 'In Review' },
        { value: TaskStatus.DONE, label: 'Done' },
      ]);
    });

    it('should have correct priority options', () => {
      expect(component.priorityOptions).toEqual([
        { value: Priority.LOW, label: 'Low' },
        { value: Priority.MEDIUM, label: 'Medium' },
        { value: Priority.HIGH, label: 'High' },
        { value: Priority.CRITICAL, label: 'Critical' },
      ]);
    });
  });
});
