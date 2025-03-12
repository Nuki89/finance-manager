import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingSummaryComponent } from './saving-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SavingSummaryComponent', () => {
  let component: SavingSummaryComponent;
  let fixture: ComponentFixture<SavingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingSummaryComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
