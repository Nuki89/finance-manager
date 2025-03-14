import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSettingsModalComponent } from './color-settings-modal.component';

describe('ColorSettingsModalComponent', () => {
  let component: ColorSettingsModalComponent;
  let fixture: ComponentFixture<ColorSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSettingsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
