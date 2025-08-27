import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTaskDetails } from './form-task-details';

describe('FormTaskDetails', () => {
  let component: FormTaskDetails;
  let fixture: ComponentFixture<FormTaskDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTaskDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTaskDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
