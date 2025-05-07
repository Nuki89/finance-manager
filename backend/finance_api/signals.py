from django.db.models.signals import post_save, post_delete
from django.db.models import Sum
from django.dispatch import receiver
from .models import *
from django.db import transaction
from decimal import Decimal


def get_or_create_balance(user):
    return Balance.objects.get_or_create(user=user)[0]

@receiver(post_save, sender=Income)
def update_balance_after_income(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            balance_record = get_or_create_balance(instance.user)
            balance_record.balance += instance.amount
            balance_record.save()
            instance.balance_after = balance_record.balance
            instance.save(update_fields=['balance_after'])

@receiver(post_save, sender=Expense)
def update_balance_after_expense(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            balance_record = get_or_create_balance(instance.user)
            balance_record.balance -= instance.amount
            balance_record.save()
            instance.balance_after = balance_record.balance
            instance.save(update_fields=['balance_after'])

@receiver(post_save, sender=Saving)
def update_balance_after_saving(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            balance_record = get_or_create_balance(instance.user)
            balance_record.balance -= instance.amount
            balance_record.total_savings += instance.amount
            balance_record.save()

@receiver(post_delete, sender=Income)
def handle_delete_income(sender, instance, **kwargs):
    with transaction.atomic():
        balance_record = get_or_create_balance(instance.user)
        total_income = Decimal(Income.objects.filter(user=instance.user).aggregate(total=Sum('amount'))['total'] or 0.0)
        total_expense = Decimal(Expense.objects.filter(user=instance.user).aggregate(total=Sum('amount'))['total'] or 0.0)
        balance_record.balance = total_income - total_expense
        balance_record.save()

@receiver(post_delete, sender=Expense)
def handle_delete_expense(sender, instance, **kwargs):
    with transaction.atomic():
        balance_record = get_or_create_balance(instance.user)
        total_income = Decimal(Income.objects.filter(user=instance.user).aggregate(total=Sum('amount'))['total'] or 0.0)
        total_expense = Decimal(Expense.objects.filter(user=instance.user).aggregate(total=Sum('amount'))['total'] or 0.0)
        balance_record.balance = total_income - total_expense
        balance_record.save()

@receiver(post_delete, sender=Saving)
def handle_delete_saving(sender, instance, **kwargs):
    with transaction.atomic():
        balance_record = get_or_create_balance(instance.user)
        total_savings = Decimal(Saving.objects.filter(user=instance.user).aggregate(total=Sum('amount'))['total'] or 0.0)
        balance_record.total_savings = total_savings
        balance_record.balance += instance.amount
        balance_record.save()
