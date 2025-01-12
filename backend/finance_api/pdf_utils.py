from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from django.http import HttpResponse
from datetime import datetime
import random
import string


def random_filename(suffix=".pdf", length=20):
    characters = string.ascii_letters + string.digits  
    random_string = ''.join(random.choice(characters) for i in range(length))
    return f"{random_string}{suffix}"


def draw_income_headers(p, y, width):
    p.setFont('Helvetica-Bold', 10)
    p.drawString(50, y, 'Date')
    p.drawString(170, y, 'Source')
    p.drawString(280, y, 'Amount')
    p.drawString(390, y, 'Description')
    p.drawString(500, y, 'Comment')

    p.line(50, y - 4, width - 50, y - 4)
    y -= 22
    return y


def generate_incomes_pdf(incomes):
    filename = random_filename()
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    p = canvas.Canvas(response, pagesize=letter)
    p.setTitle("Income Summary")
    
    width, height = letter
    p.setFont('Helvetica-Bold', 14)
    p.setFillColor(colors.darkblue)
    p.drawCentredString(width / 2.0, height - 50, "Income Summary")

    current_date = datetime.now().strftime('%d.%m.%Y')
    p.setFont('Helvetica', 10)
    p.setFillColor(colors.grey)
    p.drawString(440, height - 80, f"Date of extract: {current_date}")

    p.setFillColor(colors.black)
    y = height - 80
    
    p.setFont('Helvetica-Bold', 10)
    p.drawString(50, y, 'CURRENCY: EUR')
    p.line(50, y - 4, width - 50, y - 4)

    y = height - 100
    y = draw_income_headers(p, y, width)

    p.setFont('Helvetica', 8)

    for income in incomes:
        if y < 100:
            p.showPage()
            y = height - 80
            y = draw_income_headers(p, y, width)

        description = income.description if income.description.strip() else "No description"
        formatted_date = income.date.strftime('%d.%m.%Y')  
        p.drawString(50, y, formatted_date)
        p.drawString(170, y, str(income.source.name))
        p.drawString(280, y, "{:,.2f} €".format(income.amount))
        p.drawString(390, y, description)

        p.line(50, y - 4, width - 50, y - 4)

        y -= 22

    p.showPage()
    p.save()
    return response


"""
Expenses Summary PDF
"""
def draw_expense_headers(p, y, width):
    p.setFont('Helvetica-Bold', 10)
    p.drawString(50, y, 'Date')
    p.drawString(170, y, 'Category')
    p.drawString(280, y, 'Amount')
    p.drawString(390, y, 'Description')
    p.drawString(500, y, 'Comment')

    p.line(50, y - 4, width - 50, y - 4)
    y -= 22
    return y


def generate_expenses_pdf(expenses):
    filename = random_filename()
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    p = canvas.Canvas(response, pagesize=letter)
    p.setTitle("Expenses Summary")
    
    width, height = letter
    p.setFont('Helvetica-Bold', 14)
    p.setFillColor(colors.darkblue)
    p.drawCentredString(width / 2.0, height - 50, "Expenses Summary")

    current_date = datetime.now().strftime('%d.%m.%Y')
    p.setFont('Helvetica', 10)
    p.setFillColor(colors.grey)
    p.drawString(440, height - 80, f"Date of extract: {current_date}")

    p.setFillColor(colors.black)
    y = height - 80
    
    p.setFont('Helvetica-Bold', 10)
    p.drawString(50, y, 'CURRENCY: EUR')
    p.line(50, y - 4, width - 50, y - 4)

    y = height - 100
    y = draw_expense_headers(p, y, width)

    p.setFont('Helvetica', 8)

    for expense in expenses:
        if y < 100:
            p.showPage()
            y = height - 80
            y = draw_expense_headers(p, y, width)

        description = expense.description if expense.description.strip() else "No description"
        formatted_date = expense.date.strftime('%d.%m.%Y')  
        p.drawString(50, y, formatted_date)
        p.drawString(170, y, str(expense.category.name))
        p.drawString(280, y, "{:,.2f} €".format(expense.amount))
        p.drawString(390, y, description)

        p.line(50, y - 4, width - 50, y - 4)

        y -= 22

    p.showPage()
    p.save()
    return response

# PIE
    # # Prepare data for the pie chart
    # data = [float(holding.amount) for holding in incomes]
    # labels = [holding.source.name for holding in incomes]

    # # Create a drawing object
    # d = Drawing(400, 200)
    # pie = Pie()
    # pie.x = 150
    # pie.y = 50
    # pie.data = data
    # pie.labels = labels
    # pie.slices.strokeWidth=0.5
    # pie.slices.strokeColor=colors.black

    # d.add(pie)

    # # Draw the pie chart at specified location
    # d.drawOn(p, 50, height - 300)
