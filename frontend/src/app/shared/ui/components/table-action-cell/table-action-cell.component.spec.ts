import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActionCellComponent } from './table-action-cell.component';

describe('TableActionCellComponent', () => {
  let component: TableActionCellComponent;
  let fixture: ComponentFixture<TableActionCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableActionCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableActionCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
