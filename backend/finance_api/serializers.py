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

    date = serializers.DateField(format='%d-%m-%Y')

    class Meta:
        model = Income
        fields = '__all__'


class ExpenseCategorySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = ExpenseCategory
        fields = '__all__'


class ExpenseSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    category = serializers.PrimaryKeyRelatedField(queryset=ExpenseCategory.objects.all())
    category_data = ExpenseCategorySerializer(source='category', read_only=True)

    date = serializers.DateField(format='%d-%m-%Y')

    class Meta:
        model = Expense
        fields = '__all__'