import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SharedDataService } from '../../../services/shared/shared-data.service';
import { provideIcons } from '@ng-icons/core';
import { heroTrash, heroPlusSmall, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { TableActionCellComponent } from '../table-action-cell/table-action-cell.component';
import { DarkModeService } from '../../../services/shared/dark-mode.service';

@Component({
  selector: 'app-shared-table',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.css'],
  viewProviders : [provideIcons({ heroTrash, heroPlusSmall, heroPencilSquare })],
})
export class SharedTableComponent {
  @Input() data: any[] = [];
  @Input() type!: 'income' | 'expense' | 'saving'; 
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  @Output() dataChange = new EventEmitter<void>();

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  @ViewChild('agGrid', { read: ElementRef }) gridElement!: ElementRef;

  public themeClass: string = 'ag-theme-alpine';
  public isDarkMode: boolean = false;
  public colDefs: ColDef[] = [];
  public rowData: any[] = [];
  public gridOptions!: GridOptions;

  private destroy$ = new Subject<void>();

  constructor(
    private sharedDataService: SharedDataService,
    private darkService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.gridOptions = this.setGridOptions();
    this.subscribeToChanges();
    this.subscribeToDarkMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.rowData = this.data;
      this.setColDefs();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.sizeColumnsToFit();
  }

  public sizeColumnsToFit() {
    if (this.agGrid && this.agGrid.api) {
      setTimeout(() => {
        this.agGrid.api.sizeColumnsToFit();
      }, 50);
    }
  }
  
  public handleEdit(id: number, data: any): void {    
    this.edit.emit(data);
  }

  public handleDelete(id: number): void {    
    this.delete.emit(id);
  }

  private subscribeToChanges(): void {
    const changes$ = {
      income: this.sharedDataService.incomeChanged$,
      expense: this.sharedDataService.expenseChanged$,
      saving: this.sharedDataService.savingChanged$
    } [this.type];

    if (changes$) {
      changes$
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.dataChange.emit();
      });
    }
  } 

  private subscribeToDarkMode(): void {
    this.darkService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark: boolean) => {
        this.themeClass = isDark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine';
        this.setColDefs(); 
        this.refreshGrid();
      }
    );
  }

  private setColDefs(): void {
    this.colDefs = [
      { field: 'date', headerName: 'Date', valueFormatter: this.dateFormatter, sort: 'desc' },
      { 
        field: this.getFieldName(),  
        headerName: this.getHeaderName(),  
        valueGetter: this.getValueBasedOnType.bind(this),
      },
      { field: 'amount', headerName: 'Amount', valueFormatter: this.currencyFormatter },
      ...(this.type !== 'saving'
        ? [{ field: 'description', headerName: 'Description' }]
        : []),
      // { field: 'balance_after', headerName: 'Balance After', valueFormatter: this.currencyFormatter },
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
    this.updateGridTheme();
  }

  private setGridOptions(): GridOptions {
    return {
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
  }

  private getFieldName(): string {
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

  private getHeaderName(): string {
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

  private getValueBasedOnType(params: any): string {
    switch (this.type) {
      case 'income':
        return params.data.source_data ? params.data.source_data.name : 'N/A';
      case 'expense':
        return params.data.category_data ? params.data.category_data.name : 'N/A';
      case 'saving':
        return params.data.saving_data?.name || params.data.category_data.name || 'N/A';
      default:
        return 'N/A'; 
    }
  }

  private refreshGrid(): void {
    if (this.agGrid && this.agGrid.api) {
      this.colDefs = [...this.colDefs]; 
      setTimeout(() => {
        this.agGrid.api.refreshHeader();
        this.agGrid.api.refreshCells({ force: true });
      }, 0);
    }
  }

  private updateGridTheme(): void {
    if (this.gridElement) {
      this.gridElement.nativeElement.classList.remove('ag-theme-alpine', 'ag-theme-alpine-dark');
      this.gridElement.nativeElement.classList.add(this.themeClass);
    }
  }

  private dateFormatter(params: any): string {
    const date = new Date(params.value);
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();
    return `${day}.${month}.${year}`; 
  }

  private currencyFormatter(params: any): string {
    return `${params.value} €`;
  }

  private getButtonClass(type: string): string {
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
