import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEditModalComponent } from './category-edit-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('CategoryEditModalComponent', () => {
  let component: CategoryEditModalComponent;
  let fixture: ComponentFixture<CategoryEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryEditModalComponent, HttpClientTestingModule, ToastrModule.forRoot(), MatDialogRef, MatDialogModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
