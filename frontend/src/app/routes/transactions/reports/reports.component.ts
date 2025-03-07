import { Component } from '@angular/core';
import { ReportService } from '../../../shared/services/api/report.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { blob } from 'stream/consumers';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  public pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private reportService: ReportService,
    private sanitizer: DomSanitizer
  ) { }

  public onMouseDown(event: MouseEvent, type: 'vs' | 'income' | 'expense') {
    const openInNewTab = event.button === 1;

    event.preventDefault();

    switch (type) {
      case 'vs':
        this.loadVSsummaryPdf(openInNewTab);
        break;
      case 'income':
        this.loadIncomeSummaryPdf(openInNewTab);
        break;
      case 'expense':
        this.loadExpenseSummaryPdf(openInNewTab);
        break;
    }
  }

  loadVSsummaryPdf(openInNewTab: boolean) {
    this.reportService.exportVsPdf().subscribe(blob => {
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);

      if(openInNewTab) {
        window.open(pdfObjectUrl, '_blank');
      } else {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfObjectUrl);
      }

    });
  }

  loadIncomeSummaryPdf(openInNewTab: boolean) {
    this.reportService.exportIncomePdf().subscribe(blob => {
      const pdfBlob = new Blob([blob], { type: 'application/pdf'});
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);

      if(openInNewTab) {
        window.open(pdfObjectUrl, '_blank');
      } else {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfObjectUrl);
      }

    });
  }

  loadExpenseSummaryPdf(openInNewTab: boolean) {
    this.reportService.exportExpensePdf().subscribe(blob => {
      const pdfBlob = new Blob([blob], { type: 'application/pdf'});
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);
      
      if(openInNewTab) {
        window.open(pdfObjectUrl, '_blank');
      } else {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfObjectUrl);
      }

    });
  }

}
