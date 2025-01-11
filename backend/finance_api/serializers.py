from rest_framework import serializers
from .models import *

class IncomeSourceSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = IncomeSource
        fields = '__all__'


class IncomeSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    source = serializers.PrimaryKeyRelatedField(queryset=IncomeSource.objects.all())
    source_data = IncomeSourceSerializer(source='source', read_only=True)

    class Meta:
        model = Income
        fields = '__all__'


class ExpenseCategorySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = ExpenseCategory
        fields = '__all__'