import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * @file pdfService.js
 * @description Enterprise-grade PDF generation service.
 * Features: High-fidelity layout, futuristic branding, multi-language support (Hindi/English),
 * and dynamic content scaling for professional agricultural reports.
 */

export class PDFService {
  // Theme Configuration
  #colors = {
    primary: [2, 13, 8],      // Forest Black
    accent: [16, 185, 129],   // Emerald Green
    secondary: [100, 100, 100],
    white: [255, 255, 255],
    red: [239, 68, 68]        // Alert Red
  };

  /**
   * Generate PDF from scan data with premium branding
   */
  generateOfflineReport(scanData, lang = 'en') {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPos = 0;

    // --- PREMIUM HEADER BACKGROUND ---
    doc.setFillColor(...this.#colors.primary);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Accent Line
    doc.setDrawColor(...this.#colors.accent);
    doc.setLineWidth(1.5);
    doc.line(0, 45, pageWidth, 45);

    yPos = 20;

    // Logo & Title
    doc.setTextColor(...this.#colors.white);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    const mainTitle = lang === 'hi' ? 'AGROVISION AI रिपोर्ट' : 'AGROVISION AI REPORT';
    doc.text(mainTitle, margin, yPos);

    // Subtitle / Date
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...this.#colors.accent);
    const timestamp = new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      dateStyle: 'full',
      timeStyle: 'short'
    });
    doc.text(`DIAGNOSTIC ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()} | ${timestamp}`, margin, yPos + 8);

    yPos = 60;

    // --- SUMMARY GRID SECTION ---
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(250, 252, 251);
    doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'FD');

    const gridData = [
      { label: lang === 'hi' ? 'फसल' : 'CROP TYPE', value: scanData.crop_name || 'N/A' },
      { label: lang === 'hi' ? 'स्थिति' : 'DIAGNOSIS', value: scanData.disease_name || 'Healthy' },
      { label: lang === 'hi' ? 'शुद्धता' : 'ACCURACY', value: scanData.confidence || 'N/A' },
      { label: lang === 'hi' ? 'गंभीरता' : 'SEVERITY', value: scanData.severity || 'Normal' }
    ];

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    let xOffset = margin + 10;
    gridData.forEach((item, i) => {
      doc.setFont('helvetica', 'bold');
      doc.text(item.label, xOffset, yPos + 12);
      
      doc.setFontSize(11);
      doc.setTextColor(...this.#colors.primary);
      
      // Highlight severity if high
      if (item.label.includes('SEVERITY') && item.value.toLowerCase() === 'high') {
        doc.setTextColor(...this.#colors.red);
      }
      
      doc.text(String(item.value).toUpperCase(), xOffset, yPos + 22);
      xOffset += (contentWidth / 4);
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
    });

    yPos += 55;

    // --- DETAILED ANALYSIS SECTIONS ---
    const treatments = [
      { 
        title: lang === 'hi' ? 'जैविक समाधान' : 'BIOLOGICAL SOLUTION', 
        value: scanData.organic_solution,
        icon: 'ECO' 
      },
      { 
        title: lang === 'hi' ? 'रासायनिक उपचार' : 'CHEMICAL TREATMENT', 
        value: scanData.chemical_solution,
        icon: 'CHEM'
      },
      { 
        title: lang === 'hi' ? 'निवारक उपाय' : 'PREVENTION STRATEGY', 
        value: scanData.prevention,
        icon: 'SHIELD'
      }
    ];

    treatments.forEach((section) => {
      if (section.value) {
        // Section Header
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, contentWidth, 8, 'F');
        doc.setDrawColor(...this.#colors.accent);
        doc.line(margin, yPos, margin, yPos + 8); // Vertical accent line

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...this.#colors.primary);
        doc.text(section.title, margin + 5, yPos + 6);
        
        yPos += 14;

        // Content Body
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        
        const splitText = doc.splitTextToSize(section.value, contentWidth - 10);
        
        // Auto-paging logic
        if (yPos + (splitText.length * 6) > pageHeight - 30) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(splitText, margin + 5, yPos);
        yPos += (splitText.length * 6) + 10;
      }
    });

    // Weather Advisory Highlight
    if (scanData.weather_warning) {
      doc.setFillColor(255, 241, 242); // Soft red
      doc.setDrawColor(...this.#colors.red);
      doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, 'FD');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...this.#colors.red);
      doc.text(lang === 'hi' ? 'मौसम संबंधी चेतावनी' : 'ENVIRONMENTAL ADVISORY', margin + 5, yPos + 8);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(scanData.weather_warning, margin + 5, yPos + 14);
    }

    // --- FOOTER ---
    const footerY = pageHeight - 15;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const disclaimer = lang === 'hi' 
      ? 'अस्वीकरण: यह रिपोर्ट केवल सूचना के उद्देश्यों के लिए एआई द्वारा उत्पन्न की गई है।' 
      : 'DISCLAIMER: AI-Generated report for informational purposes. Consult a specialist for critical decisions.';
    
    doc.text(disclaimer, pageWidth / 2, footerY, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...this.#colors.accent);
    doc.text('AGROVISION AI - THE FUTURE OF PRECISION AGRICULTURE', pageWidth / 2, footerY + 5, { align: 'center' });

    return doc;
  }

  /**
   * High-quality HTML to PDF conversion using canvas scaling
   */
  async generateFromHTML(elementId, filename = 'agroviz-enterprise-report.pdf') {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('DOM Element not found for PDF conversion');

      const canvas = await html2canvas(element, {
        scale: 3, // High DPI for production-grade printing
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      return true;
    } catch (error) {
      console.error('[PDFService] HTML Conversion Failed:', error);
      throw error;
    }
  }

  /**
   * Wrapper for direct download
   */
  downloadPDF(doc, filename = 'agroviz-report.pdf') {
    doc.save(filename);
  }
}

export const pdfService = new PDFService();