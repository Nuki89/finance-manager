import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseEditModalComponent } from './expense-edit-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExpenseEditModalComponent', () => {
  let component: ExpenseEditModalComponent;
  let fixture: ComponentFixture<ExpenseEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseEditModalComponent, HttpClientTestingModule, ToastrModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
