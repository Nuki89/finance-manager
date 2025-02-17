import { Component, inject, ViewChild, HostListener } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular'; 
import type { ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { IncomeService } from '../../../../shared/services/api/income.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { IncomeEditModalComponent } from '../income-edit-modal/income-edit-modal.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { TableActionCellComponent } from '../../../../shared/ui/components/table-action-cell/table-action-cell.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [AgGridModule, NgIcon],
  templateUrl: './income-table.component.html',
  styleUrl: './income-table.component.css',
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare })]
})
export class IncomeTableComponent {
  private sharedDataService = inject(SharedDataService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);
  private incomeService = inject(IncomeService); 

  @ViewChild('agGrid') agGrid!: AgGridAngular;

  // get themeClass() {
  //   return this.darkService.isDarkMode ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
  // }

  // isBrowser: boolean;

  rowData: any[] = [];
  incomeList: any[] = [];
  colDefs: ColDef[] = [
    { field: 'date', headerName: 'Date', valueFormatter: this.dateFormatter , sort: 'desc'},
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
      filter: false,
      cellRenderer: TableActionCellComponent,
      cellRendererParams: (params: any) => ({
        actions: [
          {
            type: 'edit',
            icon: 'heroPencilSquare',
            class: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
            tooltip: 'Edit',
            handler: () => params.context.componentParent.handleEdit(params.data.id, params.data),
          },
          {
            type: 'delete',
            icon: 'heroTrash',
            class: 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
            tooltip: 'Delete',
            handler: () => params.context.componentParent.handleDelete(params.data.id),
          }
        ]
      })
    },
    // {
    //   headerName: 'Actions',
    //   filter: false,
    //   cellRenderer: TableActionCellComponent,
    //   cellRendererParams: {
    //     onEdit: (params: any) => this.handleEdit(params.data.id, params.data),
    //     onDelete: (params: any) => this.handleDelete(params.data.id),
    //   }
    // },
    
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 5,
    paginationPageSizeSelector: [5, 10, 20, 30, 50, 100],
    domLayout: 'autoHeight',
    onGridReady: () => {
      this.sizeColumnsToFit();
    },
    context: {
      componentParent: this 
    },
    components: { tableActionCell: TableActionCellComponent },
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
    this.sharedDataService.incomeChanged$.subscribe(() => {
      this.fetchIncomes(); 
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


  sizeColumnsToFit() {
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.sizeColumnsToFit();
    }
  }


  handleEdit(id: number, rowData: any) {
    const dialogRef = this.dialog.open(IncomeEditModalComponent, {
      width: '600px',
      data: {
        id: rowData.id,
        amount: rowData.amount,
        date: rowData.date,
        description: rowData.description,
        source: rowData.source,
        source_data: rowData.source_data 
      }
    });
  }


  handleDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Delete Income',
        message: 'Are you sure you want to delete this income?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.incomeService.deleteIncome(id).subscribe(
          () => {
            this.toastr.success('Income deleted successfully!');
            this.fetchIncomes();
          },
          (error) => {
            this.toastr.error('Failed to delete income. Please try again.');
            console.error('Error deleting income:', error);
          }
        );
      }
    });
  }


  openEditModal(rowData: any) {
    // const modalRef = this.modalService.open(ModalDtDetailsComponent, {
    //   centered: true,
    // });
    // modalRef.componentInstance.rowData = rowData;
  }


}