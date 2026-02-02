import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ManagerOptionsComponent } from './manager-options.component';

describe('ManagerOptionsComponent', () => {
  let component: ManagerOptionsComponent;
  let fixture: ComponentFixture<ManagerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerOptionsComponent ],
      imports: [ HttpClientTestingModule, FormsModule ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe existir el componente', () => {
    expect(component).toBeTruthy();
  });
});