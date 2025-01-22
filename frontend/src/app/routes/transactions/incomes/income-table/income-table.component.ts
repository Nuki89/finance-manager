import { Component, inject, ViewChild, HostListener } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular'; 
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { IncomeService } from '../../../../shared/services/api/income.service';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [AgGridModule],
  templateUrl: './income-table.component.html',
  styleUrl: './income-table.component.css'
})
export class IncomeTableComponent {
  private incomeService = inject(IncomeService); //replaced this: constructor(private incomeService: IncomeService) {}
  @ViewChild('agGrid') agGrid!: AgGridAngular;

  rowData: any[] = [];
  colDefs: ColDef[] = [
    { field: 'date', headerName: 'Date', valueFormatter: this.dateFormatter },
    {
      field: 'source',
      headerName: 'Source',
      valueGetter: (params) => params.data.source_data?.name || 'N/A', 
    },
    { field: 'amount', headerName: 'Amount', valueFormatter: this.currencyFormatter },
    { field: 'description', headerName: 'Description' },
    { field: 'balance_after', headerName: 'Balance After', valueFormatter: this.currencyFormatter },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
          <button class="bg-blue-500 text-white py-1 px-3 rounded">Edit</button>
          <button class="bg-red-500 text-white py-1 px-3 rounded ml-2">Delete</button>
        `;
      },
    },
  ];

  ngOnInit(): void {
    this.fetchIncomes();
    setTimeout(() => {
      this.sizeColumnsToFit();
    });
  }

  fetchIncomes(): void {
    this.incomeService.getIncome().subscribe({
      next: (data: any) => {
        this.rowData = data.map((income: any) => ({
          ...income,
          date: income.date, 
          amount: +income.amount, 
        }));
      },
      error: (error) => {
        console.error('Error fetching incomes:', error);
      },
    });
  }

  dateFormatter(params: any): string {
    const date = new Date(params.value);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return `${day}.${month}.${year}`; 
  }

  currencyFormatter(params: any): string {
    return `${params.value} €`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.sizeColumnsToFit();
  }

  // override modules: Module[] = [ClientSideRowModelModule];

  // override defaultColDef: ColDef = {
  //   floatingFilter: false,
  //   //suppressSizeToFit: true,
  //   suppressMovable: true,
  //   sortable: true,
  //   filter: false,
  //   unSortIcon: true,
  //   resizable: false,
  //   // cellClass: ['d-flex', 'align-items-center'],
  // };

  


  sizeColumnsToFit() {
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.sizeColumnsToFit();
    }
  }

  gridOptions = {
    pagination: true, 
    paginationPageSize: 20, 
    domLayout: 'autoHeight',
    defaultColDef: {
      floatingFilter: false,
      resizable: false,
      //suppressSizeToFit: true,
      suppressMovable: true,
      sortable: true,
      filter: false,
      unSortIcon: true,
      // cellClass: ['d-flex', 'align-items-center'],
    },
  };


  // openModal(rowData: any) {
  //   const modalRef = this.modalService.open(ModalDtDetailsComponent, {
  //     centered: true,
  //   });
  //   modalRef.componentInstance.rowData = rowData;
  // }


}
