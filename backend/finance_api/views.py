from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *
from .pdf_utils import *

from django.db.models.functions import TruncMonth
from django.db.models import Sum


class IncomeSourceViewSet(viewsets.ModelViewSet):
    queryset = IncomeSource.objects.all()
    serializer_class = IncomeSourceSerializer
    permission_classes = [IsAuthenticated]


class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_view_name(self):
        if hasattr(self, 'action'):
            if self.action == 'list':
                return "List of Incomes"
            elif self.action == 'retrieve':
                return "Detail of Income"
        return super(IncomeViewSet, self).get_view_name()

    def get_queryset(self):
        queryset = Income.objects.all()
        income_name = self.request.query_params.get('income_name', None)
        if income_name is not None:
            try:
                source = IncomeSource.objects.get(name=income_name)
                queryset = queryset.filter(source=source)
            except IncomeSource.DoesNotExist:
                queryset = Income.objects.none() 
        return queryset
    
    @action(detail=False, methods=['get'])
    def summary_by_source(self, request):
        income_list = Income.objects.values('source__name').annotate(total_amount=models.Sum('amount')).order_by('source')
        return Response(income_list)
    
    @action(detail=False, methods=['get'])
    def monthly_summary(self, request):
        monthly_data = Income.objects.annotate(month=TruncMonth('date')).values('month').annotate(total_amount=models.Sum('amount')).order_by('month')
        return Response(monthly_data)
    
    @action(detail=False, methods=['get'])
    def monthly_source_summary(self, request):
        monthly_source_data = Income.objects.annotate(
            month=TruncMonth('date')).values('month', 'source__name').annotate(
            total_amount=Sum('amount')).order_by('month', 'source__name')
        return Response(monthly_source_data)

    # @action(detail=False, methods=['get'])
    # def export_incomes_pdf(self, request):
    #     incomes = Income.objects.all()
    #     return generate_incomes_pdf(incomes)


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_view_name(self):
        if hasattr(self, 'action'):
            if self.action == 'list':
                return "List of Expenses"
            elif self.action == 'retrieve':
                return "Detail of Expense"
        return super(ExpenseViewSet, self).get_view_name()

    def get_queryset(self):
        queryset = Expense.objects.all()
        category_name = self.request.query_params.get('category_name', None)
        if category_name is not None:
            try:
                category = ExpenseCategory.objects.get(name=category_name)
                queryset = queryset.filter(category=category)
            except ExpenseCategory.DoesNotExist:
                queryset = Expense.objects.none() 
        return queryset
    
    @action(detail=False, methods=['get'])
    def summary_by_category(self, request):
        expense_list = Expense.objects.values('category__name').annotate(total_amount=models.Sum('amount')).order_by('category')
        return Response(expense_list)

    @action(detail=False, methods=['get'])
    def monthly_summary(self, request):
        monthly_data = Expense.objects.annotate(month=TruncMonth('date')).values('month').annotate(total_amount=models.Sum('amount')).order_by('month')
        return Response(monthly_data)
    
    @action(detail=False, methods=['get'])
    def monthly_category_summary(self, request):
        monthly_category_data = Expense.objects.annotate(
            month=TruncMonth('date')).values('month', 'category__name').annotate(
            total_amount=Sum('amount')).order_by('month', 'category__name')
        return Response(monthly_category_data)


class ExportingViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def download_income_summary_pdf(self, request):
        incomes = Income.objects.all()
        return generate_incomes_pdf(incomes)
    
    @action(detail=False, methods=['get'])
    def download_expense_summary_pdf(self, request):
        expenses = Expense.objects.all()
        return generate_expenses_pdf(expenses)

    @action(detail=False, methods=['get'])
    def download_summary_pdf(self, request):
        incomes = Income.objects.all()
        expenses = Expense.objects.all()
        entries = [
            {'date': income.date, 'type': 'income', 'source': income.source.name, 'balance_after': income.balance_after, 'amount': income.amount, 'description': income.description}
            for income in incomes
        ] + [
            {'date': expense.date, 'type': 'expense', 'category': expense.category.name, 'balance_after': expense.balance_after, 'amount': expense.amount, 'description': expense.description}
            for expense in expenses
        ]
        return generate_summary_pdf(entries)


    def list(self, request):
        return Response({
            'message': 'Welcome to the Finance API exporting dashboard!',
        })
    

class DashboardView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        return Response({
            'message': 'Welcome to the Finance API dashboard!',
            # 'endpoints': {
            #     'income-sources': '/income-sources/',
            #     'incomes': '/incomes/',
            #     'expense-categories': '/expense-categories/',
            #     'expenses': '/expenses/',
            #     'incomes-summary-by-source': '/incomes/summary_by_source/',
            #     'incomes-monthly-summary': '/incomes/monthly_summary/',
            #     'incomes-monthly-source-summary': '/incomes/monthly_source_summary/',
            #     'expenses-summary-by-category': '/expenses/summary_by_category/',
            #     'expenses-monthly-summary': '/expenses/monthly_summary/',
            #     'expenses-monthly-category-summary': '/expenses/monthly_category_summary/',
            #     'export-incomes-pdf': '/dashboard/export_incomes_pdf/',
            # }
        })
    

class BalanceViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

    def list(self, request):
        balance_record = Balance.objects.first()
        if balance_record:
            return Response({'current_balance': balance_record.balance})
        else:
            balance_record = Balance.objects.create(balance=0.00)
            return Response({'current_balance': balance_record.balance})