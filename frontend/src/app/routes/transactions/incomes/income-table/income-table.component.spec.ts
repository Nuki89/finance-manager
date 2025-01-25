import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IncomeTableComponent } from './income-table.component';

describe('IncomeTableComponent', () => {
  let component: IncomeTableComponent;
  let fixture: ComponentFixture<IncomeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeTableComponent, HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
