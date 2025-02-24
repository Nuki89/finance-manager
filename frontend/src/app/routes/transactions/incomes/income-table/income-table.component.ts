import { Component, inject, ViewChild, HostListener, ElementRef } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular'; 
import type { ColDef, GridOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { IncomeService } from '../../../../shared/services/api/income.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModuleComponent } from '../../../../shared/ui/components/confirmation-module/confirmation-module.component';
import { SharedDataService } from '../../../../shared/services/shared/shared-data.service';
import { IncomeEditModalComponent } from '../income-edit-modal/income-edit-modal.component';
import { provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { TableActionCellComponent } from '../../../../shared/ui/components/table-action-cell/table-action-cell.component';
import { CommonModule } from '@angular/common';
import { DarkModeService } from '../../../../shared/services/shared/dark-mode.service';
import { Subject, takeUntil } from 'rxjs';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-income-table',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './income-table.component.html',
  styleUrls: ['./income-table.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare })],
})
export class IncomeTableComponent {
  constructor(
    private sharedDataService: SharedDataService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private incomeService: IncomeService,
    private darkService: DarkModeService
  ) {}

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('agGrid', { read: ElementRef }) gridElement!: ElementRef;
  
  themeClass: string = 'ag-theme-alpine';
  isDarkMode: boolean = false;
  private destroy$ = new Subject<void>();
  rowData: any[] = [];
  incomeList: any[] = [];
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
    this.fetchIncomes();
    this.subscribeToDarkMode();
    this.subscribeToIncomeChages();
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

  subscribeToIncomeChages(): void {
    this.sharedDataService.incomeChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchIncomes();
    });
  }

  updateColDefs(): void {
    this.colDefs = [
      { field: 'date', headerName: 'Date', valueFormatter: this.dateFormatter, sort: 'desc' },
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

  fetchIncomes(): void {
    this.incomeService.getIncome()
    .pipe(takeUntil(this.destroy$))
      .subscribe({
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
      }
    );
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
        this.incomeService.deleteIncome(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
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

}