import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-policy',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './terms-policy.component.html',
  styleUrls: ['./terms-policy.component.css'],
})
export class TermsPolicyComponent {
  public effective_date = "1.2.2025"
}
