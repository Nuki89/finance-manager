from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *


class IncomeSourceViewSet(viewsets.ModelViewSet):
    queryset = IncomeSource.objects.all()
    serializer_class = IncomeSourceSerializer
