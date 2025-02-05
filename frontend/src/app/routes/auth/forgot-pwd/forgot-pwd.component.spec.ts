import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPwdComponent } from './forgot-pwd.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPwdComponent', () => {
  let component: ForgotPwdComponent;
  let fixture: ComponentFixture<ForgotPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPwdComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
