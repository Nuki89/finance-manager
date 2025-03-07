import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingDetailsModalComponent } from './saving-details-modal.component';

describe('SavingDetailsModalComponent', () => {
  let component: SavingDetailsModalComponent;
  let fixture: ComponentFixture<SavingDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
