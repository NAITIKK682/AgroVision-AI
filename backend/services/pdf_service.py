"""
AgroVision AI - PDF Generation Service
Enterprise-grade diagnostic reporting with multi-lingual support and premium branding.
"""

import logging
import io
import os
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image, HRFlowable
)

logger = logging.getLogger(__name__)

class PDFGenerator:
    def __init__(self, language='en'):
        self.language = language
        self._register_fonts()
        self.styles = self._create_styles()

    def _register_fonts(self):
        """Register premium fonts for multi-lingual support."""
        try:
            # Note: Ensure these .ttf files exist in your /static/fonts directory
            # Falling back to Helvetica if custom fonts are missing
            font_path = os.path.join(os.getcwd(), 'static', 'fonts')
            if os.path.exists(font_path):
                pdfmetrics.registerFont(TTFont('Poppins-Bold', os.path.join(font_path, 'Poppins-Bold.ttf')))
                pdfmetrics.registerFont(TTFont('FreeSans', os.path.join(font_path, 'FreeSans.ttf'))) # Good for Hindi
        except Exception as e:
            logger.warning(f"Custom fonts not loaded, using system defaults: {e}")

    def _create_styles(self):
        styles = getSampleStyleSheet()
        
        # Premium Brand Title
        styles.add(ParagraphStyle(
            name='ReportTitle',
            fontName='Helvetica-Bold',
            fontSize=24,
            textColor=colors.HexColor("#1B5E20"),
            alignment=1,
            spaceAfter=10
        ))
        
        # Section Sub-Headers
        styles.add(ParagraphStyle(
            name='SubHeader',
            fontName='Helvetica-Bold',
            fontSize=12,
            textColor=colors.white,
            backColor=colors.HexColor("#2E7D32"),
            leftIndent=0,
            rightIndent=0,
            spaceBefore=12,
            spaceAfter=6,
            borderPadding=4,
        ))

        # Specialized Meta Text
        styles.add(ParagraphStyle(
            name='MetaLabel',
            fontName='Helvetica-Bold',
            fontSize=10,
            textColor=colors.HexColor("#555555")
        ))
        
        return styles

    def create_report(self, scan_data, original_image_path=None):
        """
        Generates a professional PDF health report for investors and farmers.
        """
        try:
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(
                buffer, 
                pagesize=A4, 
                rightMargin=40, 
                leftMargin=40, 
                topMargin=40, 
                bottomMargin=40
            )
            story = []

            # --- 1. Brand Header ---
            story.append(Paragraph(self._get_text('report_title'), self.styles['ReportTitle']))
            story.append(Paragraph(f"Digital Diagnosis ID: {datetime.now().strftime('%Y%m%d%H%M')}", self.styles['Italic']))
            story.append(Spacer(1, 15))
            story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#2E7D32"), spaceAfter=20))

            # --- 2. Summary Section Table ---
            summary_data = [
                [Paragraph(f"<b>{self._get_text('crop')}:</b>", self.styles['Normal']), scan_data.get('crop_name', 'Unknown')],
                [Paragraph(f"<b>{self._get_text('disease')}:</b>", self.styles['Normal']), scan_data.get('disease_name', 'Healthy')],
                [Paragraph(f"<b>{self._get_text('severity')}:</b>", self.styles['Normal']), scan_data.get('severity', 'Low')],
                [Paragraph(f"<b>{self._get_text('date')}:</b>", self.styles['Normal']), datetime.now().strftime('%B %d, %Y')]
            ]
            
            summary_table = Table(summary_data, colWidths=[1.8*inch, 2.5*inch])
            summary_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1, -1), colors.HexColor("#F1F8E9")),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#C8E6C9")),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ]))

            # --- 3. Visual Diagnosis Layout ---
            if original_image_path and os.path.exists(original_image_path):
                # Scale image while maintaining aspect ratio
                img = Image(original_image_path, width=2.2*inch, height=2.2*inch, kind='proportional')
                main_layout = Table([[img, summary_table]], colWidths=[2.5*inch, 4.5*inch])
            else:
                main_layout = summary_table

            story.append(main_layout)
            story.append(Spacer(1, 20))

            # --- 4. Content Sections ---
            sections = [
                ('scan_results', 'symptoms', colors.HexColor("#388E3C")),
                ('treatment_recommendations', 'organic_solution', colors.HexColor("#43A047")),
                ('chemical_treatment', 'chemical_solution', colors.HexColor("#2E7D32")),
                ('weather_warning', 'weather_warning', colors.HexColor("#F4511E"))
            ]

            for header_key, data_key, _ in sections:
                content = scan_data.get(data_key)
                if content and content != 'N/A':
                    story.append(Paragraph(self._get_text(header_key), self.styles['SubHeader']))
                    story.append(Spacer(1, 5))
                    story.append(Paragraph(str(content), self.styles['Normal']))
                    story.append(Spacer(1, 10))

            # --- 5. Footer & Trust Section ---
            story.append(Spacer(1, 0.5*inch))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.grey))
            
            footer_text = f"<b>Official Advisory:</b> {self._get_text('footer_note')}"
            story.append(Paragraph(footer_text, self.styles['Italic']))

            doc.build(story)
            buffer.seek(0)
            logger.info("✅ High-fidelity PDF report generated.")
            return buffer

        except Exception as e:
            logger.error(f"Failed to generate enterprise PDF report: {e}")
            raise

    def _get_text(self, key):
        """Localized text dictionary with premium copy."""
        texts = {
            'en': {
                'report_title': 'AGROVISION CROP HEALTH REPORT',
                'crop': 'Target Crop',
                'disease': 'Pathogen Diagnosis',
                'severity': 'Urgency Level',
                'date': 'Analysis Date',
                'scan_results': 'Observed Morphological Symptoms',
                'treatment_recommendations': 'Biological & Organic Recovery Plan',
                'chemical_treatment': 'Regulated Chemical Advisory',
                'weather_warning': 'Predictive Climate Risk Alert',
                'footer_note': 'This report is AI-generated based on visual markers. Consult local KVK experts for mission-critical decisions.'
            },
            'hi': {
                'report_title': 'एग्रोविज़न फसल स्वास्थ्य रिपोर्ट',
                'crop': 'फसल का प्रकार',
                'disease': 'रोग की पहचान',
                'severity': 'गंभीरता का स्तर',
                'date': 'जांच की तारीख',
                'scan_results': 'देखे गए रोग लक्षण',
                'treatment_recommendations': 'जैविक रिकवरी योजना',
                'chemical_treatment': 'रासायनिक उपचार सलाह',
                'weather_warning': 'मौसम जोखिम चेतावनी',
                'footer_note': 'यह रिपोर्ट AI द्वारा तैयार की गई है। सटीक निर्णय लेने के लिए स्थानीय विशेषज्ञों से संपर्क करें।'
            }
        }
        return texts.get(self.language, texts['en']).get(key, key)