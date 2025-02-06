import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAddModalComponent } from './source-add-modal.component';

describe('SourceAddModalComponent', () => {
  let component: SourceAddModalComponent;
  let fixture: ComponentFixture<SourceAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceAddModalComponent]
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
