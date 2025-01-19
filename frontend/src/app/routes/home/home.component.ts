import { Component } from '@angular/core';
import { IncomesComponent } from "../transactions/incomes/incomes.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IncomesComponent, IncomesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
