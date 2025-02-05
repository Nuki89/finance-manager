import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeEditModalComponent } from './income-edit-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('IncomeEditModalComponent', () => {
  let component: IncomeEditModalComponent;
  let fixture: ComponentFixture<IncomeEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeEditModalComponent, HttpClientTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') } 
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {} 
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
