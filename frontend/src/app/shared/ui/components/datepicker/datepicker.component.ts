import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';
import { provideIcons } from '@ng-icons/core';
import { bootstrapCalendar3 } from '@ng-icons/bootstrap-icons';
import { hugeCalendar03 } from '@ng-icons/huge-icons';
import { CommonModule } from '@angular/common';
import { ActionButtonComponent } from '../action-button/action-button.component';

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', 
  },
  display: {
    dateInput: 'DD/MM/YYYY', 
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-datepicker',
  standalone: true,
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },

  ],
  viewProviders : [provideIcons({ bootstrapCalendar3, hugeCalendar03 })],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, CommonModule, ActionButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DatepickerComponent implements OnChanges {
  @Input() showInput: boolean = true;
  @Input() initialDate: Date | null = null;
  @Output() dateChange = new EventEmitter<Date>();

  public date = new FormControl();

  ngOnInit() {
    this.setDateValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialDate'] && changes['initialDate'].currentValue) {
      this.setDateValue();
    }
  }

  public openPicker(picker: any): void {
    picker.open();
  }  

  public onDateSelected(event: any) {
    const selectedDate = event.value;
    this.dateChange.emit(selectedDate);
  }

  private setDateValue() {
    if (this.initialDate) {
      this.date.setValue(moment(this.initialDate).toDate()); 
    }
  }
  
}
