import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IncomeService } from '../../../shared/services/api/income.service';
import { IncomeTableComponent } from "./income-table/income-table.component";
import { IncomeFormComponent } from './income-form/income-form.component';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, RouterModule, IncomeTableComponent, IncomeFormComponent],
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.css']
})
export class IncomesComponent {
  incomes: any = []

  constructor(private incomeService: IncomeService) { }

  ngOnInit() {
    this.incomeService.getIncome().subscribe((data: any) => {
      this.incomes = data
      console.log("Incomes: ", this.incomes)
    })
  }
}
