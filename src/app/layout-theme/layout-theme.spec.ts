import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutTheme } from './layout-theme';

describe('LayoutTheme', () => {
  let component: LayoutTheme;
  let fixture: ComponentFixture<LayoutTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutTheme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutTheme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
