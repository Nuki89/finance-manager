import { Component } from '@angular/core';
import { SavingService } from '../../../../shared/services/api/saving.service';
import { ToggleViewService } from '../../../../shared/services/shared/toggle-view.service';

@Component({
  selector: 'app-saving-summary',
  standalone: true,
  imports: [],
  templateUrl: './saving-summary.component.html',
  styleUrls: ['./saving-summary.component.css']
})
export class SavingSummaryComponent {
  public totalSaving: number = 0;
  public selectedView: string = 'month';
  private viewSubscription: any;
  private loading: boolean = true;

  constructor(
    private savingService: SavingService,
    private toggleViewService: ToggleViewService
  ) {}

  ngOnInit() {
    this.viewSubscription = this.toggleViewService.viewMode$.subscribe(view => {
      this.selectedView = view;
      this.fetchSavingData();
    });
  }

  public fetchSavingData(): void {
    this.loading = true; 

    const totalSavingFetcher =
      this.selectedView === 'Yearly'
        ? this.savingService.getLastYearSaving()
        : this.savingService.getLastMonthSaving();

    totalSavingFetcher.subscribe(
      (data: any) => {
        this.totalSaving = data.reduce((sum: any, item: { total_amount: any }) => sum + item.total_amount, 0);
        this.checkLoadingComplete();
      },
      (error) => {
        console.error(`Error fetching ${this.selectedView} total saving:`, error);
        this.totalSaving = 0;
        this.checkLoadingComplete();
      }
    );
  }

  private checkLoadingComplete(): void {
    if (this.totalSaving !== 0) {
      this.loading = false;
    }
  }
}
