from django.utils import timezone


def get_current_date():
    return timezone.localtime(timezone.now()).date()