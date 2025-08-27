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
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Filter } from './filter';

import { Priority, TaskStatus } from '../../models/task.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockData } from '../../services/mock-data';

// Helper function to wait for a specific time
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

  it('should emit filters when search term is entered', async () => {
    spyOn(component.filtersChanged, 'emit');
    component.searchControl.setValue('new task');
    fixture.detectChanges();
    await delay(300);
    expect(component.filtersChanged.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ search: 'new task' })
    );
  });

  it('should emit filters when status is selected', async () => {
    spyOn(component.filtersChanged, 'emit');
    const statusFormField = await loader.getHarness(
      MatFormFieldHarness.with({ floatingLabelText: 'Status' })
    );
    const statusSelect = (await statusFormField.getControl(MatSelectHarness))!;

    await statusSelect.open();
    await statusSelect.clickOptions({ text: 'In Progress' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ status: [TaskStatus.IN_PROGRESS] })
    );
  });

  it('should emit filters when priority is selected', async () => {
    spyOn(component.filtersChanged, 'emit');
    const priorityFormField = await loader.getHarness(
      MatFormFieldHarness.with({ floatingLabelText: 'Priority' })
    );
    const prioritySelect = (await priorityFormField.getControl(MatSelectHarness))!;

    await prioritySelect.open();
    await prioritySelect.clickOptions({ text: 'High' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ priority: [Priority.HIGH] })
    );
  });

  it('should emit filters when an assignee is selected', async () => {
    spyOn(component.filtersChanged, 'emit');
    const assigneeFormField = await loader.getHarness(
      MatFormFieldHarness.with({ floatingLabelText: 'Assignee' })
    );
    const assigneeSelect = (await assigneeFormField.getControl(MatSelectHarness))!;

    await assigneeSelect.open();
    await assigneeSelect.clickOptions({ text: 'Ariel Rubin' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ assignee: ['U-100'] })
    );
  });

  it('should reset all form controls and emit events onClearFilters', async () => {
    spyOn(component.filtersCleared, 'emit');
    spyOn(component.filtersChanged, 'emit');
    component.searchControl.setValue('some value');
    component.statusControl.setValue([TaskStatus.DONE]);
    await delay(300);
    const clearButton = await loader.getHarness(MatButtonHarness.with({ text: /Clear Filters/ }));
    await clearButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.searchControl.value).toBe('');
    expect(component.statusControl.value).toEqual([]);
    expect(component.filtersCleared.emit).toHaveBeenCalled();
  });

  it('should emit overdueToggled and update filters on onToggleOverdue', async () => {
    spyOn(component.overdueToggled, 'emit');
    spyOn(component.filtersChanged, 'emit');
    const overdueButton = await loader.getHarness(MatButtonHarness.with({ text: /Show Overdue/ }));
    await overdueButton.click();
    fixture.detectChanges();
    expect(component.overdueToggled.emit).toHaveBeenCalledWith(true);
    fixture.componentRef.setInput('showOverdueOnly', true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ overdue: true })
    );
  });

  it('should complete the destroy$ subject on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next').and.callThrough();
    spyOn(component['destroy$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
