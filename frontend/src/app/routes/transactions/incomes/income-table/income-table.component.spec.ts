import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IncomeTableComponent } from './income-table.component';
import { ToastrService } from 'ngx-toastr';

describe('IncomeTableComponent', () => {
  let component: IncomeTableComponent;
  let fixture: ComponentFixture<IncomeTableComponent>;

  const mockToastrService = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    warning: jasmine.createSpy('warning'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeTableComponent, HttpClientTestingModule],
      providers: [
        { provide: ToastrService, useValue: mockToastrService }, 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IncomeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
