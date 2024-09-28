import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorServiceComponent } from './doctor-service.component';

describe('DoctorServiceComponent', () => {
  let component: DoctorServiceComponent;
  let fixture: ComponentFixture<DoctorServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorServiceComponent]
    });
    fixture = TestBed.createComponent(DoctorServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
