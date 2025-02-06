import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAddModalComponent } from './source-add-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Toast, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('SourceAddModalComponent', () => {
  let component: SourceAddModalComponent;
  let fixture: ComponentFixture<SourceAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceAddModalComponent, HttpClientTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
              { provide: MatDialogRef, useValue: {} },
              { provide: MAT_DIALOG_DATA, useValue: {} }
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
