from django.db import models
from .utils import *


class IncomeSource(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'income_sources'

    def __str__(self):
        return self.name


class Income(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    source = models.ForeignKey(IncomeSource, on_delete=models.RESTRICT)
    date = models.DateField(default=get_current_date)
    description = models.TextField(null=True, blank=True)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, null=True, blank=True)  
    
    class Meta:
        db_table = 'incomes'

    def __str__(self):
        return f'{self.amount} from {self.source.name} on {self.date}'


class ExpenseCategory(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'expense_categories'

    def __str__(self):
        return self.name
    

class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.RESTRICT)
    date = models.DateField(default=get_current_date)
    description = models.TextField(null=True, blank=True)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, null=True, blank=True)
    
    class Meta:
        db_table = 'expenses'

    def __str__(self):
        return f'{self.amount} for {self.category.name} on {self.date}'
    

class SavingCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    goal_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        db_table = 'saving_categories'

    def __str__(self):
        return self.name
    

class Saving(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(SavingCategory, on_delete=models.RESTRICT)
    date = models.DateField(default=get_current_date)
    description = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'savings'

    def __str__(self):
        return f'{self.amount} for {self.category.name} on {self.date}'


class Balance(models.Model):
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_savings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'balances'

    def __str__(self):
        return f'{self.balance}'