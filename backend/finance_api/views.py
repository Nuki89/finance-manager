from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *

from django.db.models.functions import TruncMonth


class IncomeSourceViewSet(viewsets.ModelViewSet):
    queryset = IncomeSource.objects.all()
    serializer_class = IncomeSourceSerializer
    permission_classes = [AllowAny]


class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [AllowAny]

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

class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [AllowAny]


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [AllowAny]

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
        from django.db.models.functions import TruncMonth
        monthly_data = Expense.objects.annotate(month=TruncMonth('date')).values('month').annotate(total_amount=models.Sum('amount')).order_by('month')
        return Response(monthly_data)