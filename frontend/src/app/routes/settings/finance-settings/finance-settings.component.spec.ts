import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceSettingsComponent } from './finance-settings.component';

describe('FinanceSettingsComponent', () => {
  let component: FinanceSettingsComponent;
  let fixture: ComponentFixture<FinanceSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
