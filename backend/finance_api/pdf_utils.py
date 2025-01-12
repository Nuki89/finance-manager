from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from django.http import HttpResponse

def generate_incomes_pdf(incomes):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="incomes-report.pdf"'
    p = canvas.Canvas(response, pagesize=letter)
    p.setTitle("Income Report")
    
    width, height = letter
    p.setFont('Helvetica-Bold', 14)
    p.setFillColor(colors.darkblue)
    p.drawCentredString(width / 2.0, height - 50, "Income Report")

    y = height - 80
    p.setFont('Helvetica-Bold', 12)
    p.drawString(100, y, 'Date')
    p.drawString(200, y, 'Source')
    p.drawString(350, y, 'Amount')
    p.drawString(450, y, 'Description')
    y -= 20
    p.setFont('Helvetica', 10)
    p.setFillColor(colors.black)

    for income in incomes:
        if y < 100:
            p.showPage()
            y = height - 80
            p.setFont('Helvetica-Bold', 12)
            p.drawString(100, y, 'Date')
            p.drawString(200, y, 'Source')
            p.drawString(350, y, 'Amount')
            p.drawString(450, y, 'Description')
            y -= 20
            p.setFont('Helvetica', 10)

        description = income.description if income.description.strip() else "No description"
        formatted_date = income.date.strftime('%d.%m.%Y')  
        p.drawString(100, y, formatted_date)
        p.drawString(200, y, str(income.source.name))
        p.drawString(350, y, "€{:,.2f}".format(income.amount))
        p.drawString(450, y, description)
        y -= 20

    p.showPage()
    p.save()
    return response

    # y = height - 80
    # p.setFont('Helvetica-Bold', 12)
    # p.drawString(100, y, 'VALUTA: EUR')

# CHANGED ORDER OF COLUMNS IN PDF
# from reportlab.lib.pagesizes import letter
# from reportlab.lib import colors
# from reportlab.pdfgen import canvas
# from django.http import HttpResponse

# def generate_incomes_pdf(incomes):
#     response = HttpResponse(content_type='application/pdf')
#     response['Content-Disposition'] = 'attachment; filename="incomes-report.pdf"'
#     p = canvas.Canvas(response, pagesize=letter)
#     p.setTitle("Income Report")
    
#     width, height = letter
#     p.setFont('Helvetica-Bold', 14)
#     p.setFillColor(colors.darkblue)
#     p.drawCentredString(width / 2.0, height - 50, "Income Report")

#     y = height - 80
#     p.setFont('Helvetica-Bold', 12)
#     p.drawString(100, y, 'Source')
#     p.drawString(250, y, 'Amount')
#     p.drawString(350, y, 'Description')
#     p.drawString(500, y, 'Date')
#     y -= 20
#     p.setFont('Helvetica', 10)
#     p.setFillColor(colors.black)

#     for income in incomes:
#         if y < 100:
#             p.showPage()
#             y = height - 80
#             p.setFont('Helvetica-Bold', 12)
#             p.drawString(100, y, 'Source')
#             p.drawString(250, y, 'Amount')
#             p.drawString(350, y, 'Description')
#             p.drawString(500, y, 'Date')
#             y -= 20
#             p.setFont('Helvetica', 10)

#         description = income.description if income.description.strip() else "No description"
#         p.drawString(100, y, str(income.source.name))
#         p.drawString(250, y, "${:,.2f}".format(income.amount))
#         p.drawString(350, y, description)
#         p.drawString(500, y, str(income.date))
#         y -= 20

#     p.showPage()
#     p.save()
#     return response
