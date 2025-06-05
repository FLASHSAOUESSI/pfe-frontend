import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageManagementComponent } from './message-management.component';

describe('MessageManagementComponent', () => {
  let component: MessageManagementComponent;
  let fixture: ComponentFixture<MessageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
