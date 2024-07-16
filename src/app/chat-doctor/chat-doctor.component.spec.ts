import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDoctorComponent } from './chat-doctor.component';

describe('ChatDoctorComponent', () => {
  let component: ChatDoctorComponent;
  let fixture: ComponentFixture<ChatDoctorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatDoctorComponent]
    });
    fixture = TestBed.createComponent(ChatDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
