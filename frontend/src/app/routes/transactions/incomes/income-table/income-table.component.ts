import { Component, inject, ViewChild, HostListener } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular'; 
import type { ColDef, GridOptions } from 'ag-grid-community';
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

  // get themeClass() {
  //   return this.darkService.isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
  // }

  // isBrowser: boolean;
  rowData: any[] = [];
  incomeList: any[] = [];
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
    // {
    //   field: 'options',
    //   headerName: 'Options',
    //   sortable: false,
    //   width: 110,
    //   cellStyle: { 'text-align': 'right', display: 'flex' },
    //   // cellRenderer: ActionsRendererComponent,
    //   cellRendererParams: ({ data }: { data: any }) => ({
    //     actions: [
    //       {
    //         type: 'edit',
    //         action: () => this.openModal(data),
    //       },
    //     ],
    //   }),
    // },

    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        const id = params.data.id;
        const div = document.createElement('div');
        
        const editButton = document.createElement('button');
        editButton.className = 'bg-blue-500 text-white px-3 rounded';
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', () => {
          
          console.log('Edit button clicked with ID:', id);
          this.handleEdit(id);
        });
    
        const deleteButton = document.createElement('button');
        deleteButton.className = 'bg-red-500 text-white px-3 rounded ml-2';
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => {
          console.log('Delete button clicked with ID:', id);
          this.handleDelete(id); 
        });
    
        div.appendChild(editButton);
        div.appendChild(deleteButton);
    
        return div;
      },
    }
    
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 20, 30, 50, 100],
    domLayout: 'autoHeight',
    onGridReady: () => {
      this.sizeColumnsToFit();
    },
    defaultColDef: {
      flex: 1,
      editable: false,
      autoHeight: true,
      floatingFilter: false,
      resizable: true,
      suppressMovable: true,
      sortable: true,
      filter: false,
      unSortIcon: true,
    },
    getRowStyle: params => {
      if (params.node && params.node.rowIndex !== null && params.node.rowIndex % 2 === 0) {
        return { background: 'var(--ag-even-row-background-color)' };
      } else {
        return { background: 'var(--ag-odd-row-background-color)' };
      }
    }
  };

  ngOnInit(): void {
    this.fetchIncomes();
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


  sizeColumnsToFit() {
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.sizeColumnsToFit();
    }
  }


  handleEdit(id: number) {
    console.log('Edit button clicked with ID:', id);
  }


  handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this income?')) {
      this.incomeService.deleteIncome(id).subscribe(
        (response: any) => {
          alert('Income deleted successfully!');
          window.location.reload();
        },
        (error) => {
          console.error('Error deleting income:', error);
          alert('Failed to delete income. Please try again.');
        }
      );
    }
  }


  openModal(rowData: any) {
    // const modalRef = this.modalService.open(ModalDtDetailsComponent, {
    //   centered: true,
    // });
    // modalRef.componentInstance.rowData = rowData;
  }


}
