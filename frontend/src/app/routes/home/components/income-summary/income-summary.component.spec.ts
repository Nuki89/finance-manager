import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeSummaryComponent } from './income-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

describe('IncomeSummaryComponent', () => {
  let component: IncomeSummaryComponent;
  let fixture: ComponentFixture<IncomeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeSummaryComponent, HttpClientTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
