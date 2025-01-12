from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import *
from .serializers import *


class IncomeSourceViewSet(viewsets.ModelViewSet):
    queryset = IncomeSource.objects.all()
    serializer_class = IncomeSourceSerializer
    permission_classes = [AllowAny]


class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [AllowAny]


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [AllowAny]


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Optionally restricts the returned expenses to a given category,
        by filtering against a `category_name` query parameter in the URL.
        """
        queryset = Expense.objects.all()
        category_name = self.request.query_params.get('category_name', None)
        if category_name is not None:
            try:
                category = ExpenseCategory.objects.get(name=category_name)
                queryset = queryset.filter(category=category)
            except ExpenseCategory.DoesNotExist:
                queryset = Expense.objects.none() 
        return queryset
    