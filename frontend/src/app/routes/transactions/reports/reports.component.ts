import { Component } from '@angular/core';
import { ReportService } from '../../../shared/services/api/report.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  pdfUrl: SafeResourceUrl | null = null;

  constructor(
    private reportService: ReportService,
    private sanitizer: DomSanitizer
  ) { }

  loadPdf() {
    this.reportService.exportPdf().subscribe(blob => {
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const pdfObjectUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfObjectUrl, '_blank');

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfObjectUrl);

    });
  }

}
