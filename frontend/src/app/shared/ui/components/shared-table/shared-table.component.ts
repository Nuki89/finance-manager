import { Component, ElementRef, HostListener, Input, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { SharedDataService } from '../../../services/shared/shared-data.service';
import { provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { TableActionCellComponent } from '../table-action-cell/table-action-cell.component';

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare })],
})
export class SharedTableComponent {
  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private sharedDataService: SharedDataService,
  ) {}

  @Input() data: any[] = [];
  @Input() type!: 'income' | 'expense' | 'saving'; 

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.rowData = this.data;
      this.setColDefs();
    }
  }

  setColDefs(): void {
    this.colDefs = [
      { field: 'date', headerName: 'Date', valueFormatter: this.dateFormatter, sort: 'desc' },
      { 
        field: this.getFieldName(),  
        headerName: this.getHeaderName(),  
        valueGetter: this.getValueBasedOnType.bind(this),
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

  getFieldName(): string {
    switch (this.type) {
      case 'income':
        return 'source';
      case 'expense':
        return 'category';
      case 'saving':
        return 'saving';
      default:
        return 'category';
    }
  }

  getHeaderName(): string {
    switch (this.type) {
      case 'income':
        return 'Source';
      case 'expense':
        return 'Category';
      case 'saving':
        return 'Saving';
      default:
        return 'Category';
    }
  }

  getValueBasedOnType(params: any): string {
    switch (this.type) {
      case 'income':
        return params.data.source_data ? params.data.source_data.name : 'N/A';
      case 'expense':
        return params.data.category_data ? params.data.category_data.name : 'N/A';
      case 'saving':
        return params.data.saving_data ? params.data.saving_data.name : 'N/A';
      default:
        return 'N/A'; 
    }
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

}
