import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceEditModalComponent } from './source-edit-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('SourceEditModalComponent', () => {
  let component: SourceEditModalComponent;
  let fixture: ComponentFixture<SourceEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceEditModalComponent, HttpClientTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
