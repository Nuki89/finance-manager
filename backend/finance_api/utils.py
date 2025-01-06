from django.utils import timezone


def get_current_date():
    return timezone.now().date()