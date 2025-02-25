import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from '../../../../shared/services/api/expense.service';
import { DarkModeService } from '../../../../shared/services/shared/dark-mode.service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular'; 
import { AllCommunityModule, ModuleRegistry, type ColDef, type GridOptions } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import { TableActionCellComponent } from '../../../../shared/ui/components/table-action-cell/table-action-cell.component';
import { provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';


ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-expense-table',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare })],
})
export class ExpenseTableComponent {
  constructor(
    private sharedDataService: SharedDataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private expenseService: ExpenseService,
    private darkService: DarkModeService
  ) {}

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('agGrid', { read: ElementRef }) gridElement!: ElementRef;

  themeClass: string = 'ag-theme-alpine';
  isDarkMode: boolean = false;
  private destroy$ = new Subject<void>();
  rowData: any[] = [];
  expenseList: any[] = [];
  colDefs: ColDef[] = [];

  gridOptions: GridOptions = {
    domLayout: 'normal',
    onGridReady: () => {
      setTimeout(() => {
        this.sizeColumnsToFit();
        this.updateGridTheme();
      }, 0);
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
    }
  };

  ngOnInit(): void {
    this.fetchExpenses();
    this.subscribeToDarkMode();
    this.subscribeToExpenseChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToDarkMode(): void {
    this.darkService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark: boolean) => {
        this.themeClass = isDark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
        this.updateColDefs(); 
        this.updateGridTheme();
        this.refreshGrid();
      }
    );
  }

  subscribeToExpenseChanges(): void {
    this.sharedDataService.expenseChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchExpenses();
    });
  }

  updateColDefs(): void {
    this.colDefs = [
      { field: 'date', headerName: 'Date', valueFormatter: this.dateFormatter, sort: 'desc' },
      {
        field: 'category',
        headerName: 'Category',
        valueGetter: (params) => params.data.category_data?.name || 'N/A',
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
              class: this.getButtonClass('edit'),
              tooltip: 'Edit',
              handler: () => params.context.componentParent.handleEdit(params.data.id, params.data),
            },
            {
              type: 'delete',
              icon: 'heroTrash',
              class: this.getButtonClass('delete'),
              tooltip: 'Delete',
              handler: () => params.context.componentParent.handleDelete(params.data.id),
            }
          ]
        })
      }
    ];
    this.refreshGrid();
  }

  fetchExpenses(): void {
    this.expenseService.getExpense()
    .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.rowData = data.map((expense: any) => ({
            ...expense,
            date: expense.date, 
            amount: +expense.amount, 
          }));
        },
        error: (error) => {
          console.error('Error fetching expenses:', error);
        },
      }
    );
  }

  refreshGrid(): void {
    if (this.agGrid && this.agGrid.api) {
      this.colDefs = [...this.colDefs]; 
      setTimeout(() => {
        this.agGrid.api.refreshHeader();
        this.agGrid.api.refreshCells({ force: true });
      }, 0);
    }
  }

  updateGridTheme(): void {
    if (this.gridElement) {
      this.gridElement.nativeElement.classList.remove('ag-theme-alpine', 'ag-theme-alpine-dark');
      this.gridElement.nativeElement.classList.add(this.themeClass);
    }
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

  getButtonClass(type: string): string {
    const isDark = this.themeClass === 'ag-theme-alpine-dark';
    if (type === 'edit') {
      return isDark
        ? 'text-violet-400 border border-gray-500 bg-black hover:bg-gray-700 hover:text-white shadow-lg shadow-gray-500/50'
        : 'text-blue-500 border border-blue-500 bg-white hover:bg-blue-500 hover:text-white shadow-lg shadow-blue-500/50';
    } 
    if (type === 'delete') {
      return isDark
        ? 'text-violet-400 border border-gray-500 bg-black hover:bg-gray-700 hover:text-white shadow-lg shadow-gray-500/50'
        : 'text-red-500 border border-red-500 bg-white hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/50';
    }
    return '';
  } 

  handleEdit(id: number, rowData: any) {
    // const dialogRef = this.dialog.open(ExpenseEditModalComponent, {
    //   width: '600px',
    //   data: {
    //     id: rowData.id,
    //     amount: rowData.amount,
    //     date: rowData.date,
    //     description: rowData.description,
    //     source: rowData.source,
    //     source_data: rowData.source_data 
    //   }
    // });
  }

  handleDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmationModuleComponent, {
      width: '400px',
      data: {
        title: 'Delete Expense',
        message: 'Are you sure you want to delete this expense?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.expenseService.deleteExpense(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.toastr.success('Expense deleted successfully!');
            this.fetchExpenses();
          },
          (error) => {
            this.toastr.error('Failed to delete expense. Please try again.');
            console.error('Error deleting expense:', error);
          }
        );
      }
    });
  }

}
