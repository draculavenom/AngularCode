import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cambiar el valor del checkbox al hacer clic', () => {
    component.wantsNotifications.setValue(true);
    expect(component.wantsNotifications.value).toBeTrue();
  });
});