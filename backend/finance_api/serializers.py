from rest_framework import serializers
from .models import *
from django.db.models import Sum
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'password', 'password2', 'name', 'surname', 'is_superuser', 'is_staff')
        extra_kwargs = {
            'url': {'view_name': 'user-detail', 'lookup_field': 'pk'},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class IncomeSourceSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = IncomeSource
        fields = '__all__'


class IncomeSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())  

    source = serializers.PrimaryKeyRelatedField(queryset=IncomeSource.objects.all())
    source_data = IncomeSourceSerializer(source='source', read_only=True)

    # date = serializers.DateField(format='%d-%m-%Y')

    class Meta:
        model = Income
        fields = '__all__'


class ExpenseCategorySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ExpenseCategory
        fields = '__all__'


class ExpenseSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    category = serializers.PrimaryKeyRelatedField(queryset=ExpenseCategory.objects.all())
    category_data = ExpenseCategorySerializer(source='category', read_only=True)

    # date = serializers.DateField(format='%d-%m-%Y')

    class Meta:
        model = Expense
        fields = '__all__'


class SavingCategorySerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = SavingCategory
        fields = '__all__'


class SavingSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    category = serializers.PrimaryKeyRelatedField(queryset=SavingCategory.objects.all())
    category_data = SavingCategorySerializer(source='category', read_only=True)

    class Meta:
        model = Saving
        fields = '__all__'

    def validate(self, data):
        amount = data.get('amount')
        category = data.get('category')

        existing_savings = Saving.objects.filter(category=category)

        if self.instance:
            existing_savings = existing_savings.exclude(pk=self.instance.pk)

        existing_total = existing_savings.aggregate(total=Sum('amount'))['total'] or 0

        if category.goal_amount is not None:
            if existing_total + amount > category.goal_amount:
                available_amount = category.goal_amount - existing_total
                raise serializers.ValidationError({
                    'amount': (
                        f"This saving exceeds the goal amount for {category.name}. "
                        f"You can only add up to {available_amount:.2f} more."
                    )
                })

        return data


class BalanceSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Balance
        fields = '__all__'