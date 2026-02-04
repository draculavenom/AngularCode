import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingFinalComponent } from './onboarding-final.component';
import { FormsModule } from '@angular/forms'; 
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('OnboardingFinalComponent', () => {
  let component: OnboardingFinalComponent;
  let fixture: ComponentFixture<OnboardingFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        FormsModule, 
        HttpClientTestingModule, 
        RouterTestingModule 
      ],
      declarations: [ OnboardingFinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});