from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import *
from django.db import transaction

def get_or_create_balance():
    balance_record, created = Balance.objects.get_or_create(id=1)
    return balance_record

@receiver(post_save, sender=Income)
def update_balance_after_income(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            balance_record = get_or_create_balance()
            balance_record.balance += instance.amount
            balance_record.save()
            instance.balance_after = balance_record.balance
            instance.save(update_fields=['balance_after'])

@receiver(post_save, sender=Expense)
def update_balance_after_expense(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            balance_record = get_or_create_balance()
            balance_record.balance -= instance.amount
            balance_record.save()
            instance.balance_after = balance_record.balance
            instance.save(update_fields=['balance_after'])

@receiver(post_save, sender=Saving)
def update_balance_after_saving(sender, instance, created, **kwargs):
    if created:
        with transaction.atomic():
            balance_record = get_or_create_balance()
            balance_record.balance -= instance.amount
            balance_record.save()

@receiver(post_delete, sender=Income)
def handle_delete_income(sender, instance, **kwargs):
    with transaction.atomic():
        balance_record = get_or_create_balance()
        balance_record.balance -= instance.amount
        balance_record.save()

@receiver(post_delete, sender=Expense)
def handle_delete_expense(sender, instance, **kwargs):
    with transaction.atomic():
        balance_record = get_or_create_balance()
        balance_record.balance += instance.amount
        balance_record.save()

@receiver(post_delete, sender=Saving)
def handle_delete_saving(sender, instance, **kwargs):
    with transaction.atomic():
        balance_record = get_or_create_balance()
        balance_record.balance += instance.amount
        balance_record.save()