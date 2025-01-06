from rest_framework import serializers
from .models import *

class IncomeSourceSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = IncomeSource
        fields = '__all__'