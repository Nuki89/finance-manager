import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAddModalComponent } from './category-add-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('CategoryAddModalComponent', () => {
  let component: CategoryAddModalComponent;
  let fixture: ComponentFixture<CategoryAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAddModalComponent, HttpClientTestingModule, ToastrModule.forRoot(), MatDialogRef, MatDialogModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
