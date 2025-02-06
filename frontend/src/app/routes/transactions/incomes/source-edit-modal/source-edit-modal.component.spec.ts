import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceEditModalComponent } from './source-edit-modal.component';

describe('SourceEditModalComponent', () => {
  let component: SourceEditModalComponent;
  let fixture: ComponentFixture<SourceEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceEditModalComponent]
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
