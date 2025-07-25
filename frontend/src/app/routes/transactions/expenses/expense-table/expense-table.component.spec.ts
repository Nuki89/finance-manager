import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTableComponent } from './expense-table.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExpenseTableComponent', () => {
  let component: ExpenseTableComponent;
  let fixture: ComponentFixture<ExpenseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseTableComponent, ToastrModule.forRoot(), HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
