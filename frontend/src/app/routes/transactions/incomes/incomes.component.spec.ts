import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IncomesComponent } from './incomes.component';
import { IncomeService } from '../../../shared/services/api/income.service';
import { ToastrModule } from 'ngx-toastr';

describe('IncomesComponent', () => {
  let component: IncomesComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, IncomesComponent, ToastrModule.forRoot()], 
      providers: [IncomeService], 
    }).compileComponents();

    const fixture = TestBed.createComponent(IncomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
