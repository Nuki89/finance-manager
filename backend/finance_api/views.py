from django.shortcuts import render, get_object_or_404
from rest_framework import mixins, viewsets, status
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import *
from .serializers import *
from .pdf_utils import *
from .signals import get_or_create_balance

from decimal import Decimal

from django.db.models.functions import TruncMonth
from django.db.models import Sum

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings


class UserProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class AllUsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    # permission_classes = [IsAdminUser]
    pagination_class = None

    filterset_fields = ['username', 'email', 'name', 'surname']
    search_fields = ['username', 'email', 'name', 'surname']
    ordering_fields = ['username', 'email', 'name', 'surname']
    ordering = ['username']

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.is_superuser:
            return Response(
                {"error": "You cannot delete a superuser."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

    def perform_create(self, serializer):
        serializer.save()

    # def perform_create(self, serializer):
    #     user = serializer.save()

    #     context = {'user': user}
    #     html_content = render_to_string('emails/welcome_email.html', context)
    #     text_content = strip_tags(html_content)

    #     email = EmailMultiAlternatives(
    #         subject='Welcome to Our Site',
    #         body=text_content,
    #         from_email='topshoprpo@gmail.com',
    #         to=[user.email]
    #     )
    #     email.attach_alternative(html_content, "text/html")
    #     email.send()
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You have access to this secure API!"})


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({"message": "Login successful"})
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=access_token,
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
        )
        return response
    else:
        return Response({"error": "Invalid credentials"}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.COOKIES.get("refresh_token")  

        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist() 

        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token") 
        response.delete_cookie("access_token")  
        return response

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    return Response({"isAuthenticated": True})


class IncomeSourceViewSet(viewsets.ModelViewSet):
    serializer_class = IncomeSourceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return IncomeSource.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.income_set.exists():
            raise ValidationError({
                "detail": "Cannot delete this source because it has associated incomes. Please delete all related incomes first."
            })
        return super().destroy(request, *args, **kwargs)


class IncomeViewSet(viewsets.ModelViewSet):
    """
    Income endpoints restricted to the authenticated user's data.
    """
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Income.objects.filter(user=user)

        income_name = self.request.query_params.get('income_name')
        if income_name:
            try:
                source = IncomeSource.objects.get(name=income_name)
                queryset = queryset.filter(source=source)
            except IncomeSource.DoesNotExist:
                return Income.objects.none()
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_view_name(self):
        if hasattr(self, 'action'):
            if self.action == 'list':
                return "List of Incomes"
            elif self.action == 'retrieve':
                return "Detail of Income"
        return super().get_view_name()

    @action(detail=False, methods=['get'])
    def summary_by_source(self, request):
        data = Income.objects.filter(user=request.user).values(
            'source__name').annotate(total_amount=Sum('amount')).order_by('source__name')
        return Response(data)

    @action(detail=False, methods=['get'])
    def monthly_summary(self, request):
        data = Income.objects.filter(user=request.user).annotate(
            month=TruncMonth('date')).values('month').annotate(
            total_amount=Sum('amount')).order_by('month')
        return Response(data)

    @action(detail=False, methods=['get'])
    def monthly_source_summary(self, request):
        data = Income.objects.filter(user=request.user).annotate(
            month=TruncMonth('date')).values('month', 'source__name').annotate(
            total_amount=Sum('amount')).order_by('month', 'source__name')
        return Response(data)

    @action(detail=False, methods=['get'])
    def last_month_summary(self, request):
        now = datetime.now()
        data = Income.objects.filter(
            user=request.user,
            date__year=now.year,
            date__month=now.month
        ).annotate(month=TruncMonth('date')).values('month').annotate(
            total_amount=Sum('amount')).order_by('month')
        return Response(data)

    @action(detail=False, methods=['get'])
    def last_month_source_summary(self, request):
        now = datetime.now()
        data = Income.objects.filter(
            user=request.user,
            date__year=now.year,
            date__month=now.month
        ).annotate(month=TruncMonth('date')).values('month', 'source__name').annotate(
            total_amount=Sum('amount')).order_by('month', 'source__name')
        return Response(data)

    @action(detail=False, methods=['get'])
    def last_year_summary(self, request):
        this_year = datetime.now().year
        data = Income.objects.filter(user=request.user, date__year=this_year).annotate(
            month=TruncMonth('date')).values('month').annotate(
            total_amount=Sum('amount')).order_by('month')
        return Response(data)

    @action(detail=False, methods=['get'])
    def last_year_source_summary(self, request):
        this_year = datetime.now().year
        data = Income.objects.filter(user=request.user, date__year=this_year).values(
            'source__name').annotate(total_amount=Sum('amount')).order_by('source__name')
        return Response(data)

    @action(detail=False, methods=['delete'])
    def delete_by_source(self, request):
        """
        /incomes/delete_by_source?income_name=source_name
        """
        income_name = request.query_params.get('income_name')
        source = get_object_or_404(IncomeSource, name=income_name)
        queryset = Income.objects.filter(user=request.user, source=source)

        if queryset.exists():
            deleted_count, _ = queryset.delete()
            return Response(
                {'message': f'{deleted_count} incomes from {income_name} have been deleted'},
                status=status.HTTP_200_OK
            )
        return Response(
            {'message': f'No incomes found for {income_name}'},
            status=status.HTTP_404_NOT_FOUND
        )


class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ExpenseCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.expense_set.exists():
            raise ValidationError({
                "detail": "Cannot delete this category because it has associated expenses. Please delete all related expenses first."
            })
        return super().destroy(request, *args, **kwargs)


class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_view_name(self):
        if hasattr(self, 'action'):
            if self.action == 'list':
                return "List of Expenses"
            elif self.action == 'retrieve':
                return "Detail of Expense"
        return super().get_view_name()

    def get_queryset(self):
        user = self.request.user
        queryset = Expense.objects.filter(user=user)
        category_name = self.request.query_params.get('category_name')
        if category_name:
            queryset = queryset.filter(category__name=category_name)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary_by_category(self, request):
        user = request.user
        expense_list = (
            Expense.objects.filter(user=user)
            .values('category__name')
            .annotate(total_amount=Sum('amount'))
            .order_by('category__name')
        )
        return Response(expense_list)

    @action(detail=False, methods=['get'])
    def monthly_summary(self, request):
        user = request.user
        monthly_data = (
            Expense.objects.filter(user=user)
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total_amount=Sum('amount'))
            .order_by('month')
        )
        return Response(monthly_data)

    @action(detail=False, methods=['get'])
    def monthly_category_summary(self, request):
        user = request.user
        monthly_category_data = (
            Expense.objects.filter(user=user)
            .annotate(month=TruncMonth('date'))
            .values('month', 'category__name')
            .annotate(total_amount=Sum('amount'))
            .order_by('month', 'category__name')
        )
        return Response(monthly_category_data)

    @action(detail=False, methods=['get'])
    def last_month_summary(self, request):
        user = request.user
        this_month = datetime.now().month
        last_month_data = (
            Expense.objects.filter(user=user, date__month=this_month)
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total_amount=Sum('amount'))
            .order_by('month')
        )
        return Response(last_month_data)

    @action(detail=False, methods=['get'])
    def last_month_category_summary(self, request):
        user = request.user
        this_month = datetime.now().month
        last_month_data = (
            Expense.objects.filter(user=user, date__month=this_month)
            .annotate(month=TruncMonth('date'))
            .values('month', 'category__name')
            .annotate(total_amount=Sum('amount'))
            .order_by('month', 'category__name')
        )
        return Response(last_month_data)

    @action(detail=False, methods=['get'])
    def last_year_summary(self, request):
        user = request.user
        this_year = datetime.now().year
        last_year_data = (
            Expense.objects.filter(user=user, date__year=this_year)
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total_amount=Sum('amount'))
            .order_by('month')
        )
        return Response(last_year_data)

    @action(detail=False, methods=['get'])
    def last_year_category_summary(self, request):
        user = request.user
        this_year = datetime.now().year
        last_year_data = (
            Expense.objects.filter(user=user, date__year=this_year)
            .values('category__name')
            .annotate(total_amount=Sum('amount'))
            .order_by('category__name')
        )
        return Response(last_year_data)

    @action(detail=False, methods=['delete'])
    def delete_by_category(self, request):
        """
        DELETE /expenses/delete_by_category?category_name=...
        Deletes expenses by category, only for the current user.
        """
        category_name = request.query_params.get('category_name')
        user = request.user
        category = get_object_or_404(ExpenseCategory, name=category_name, user=user)

        expenses = Expense.objects.filter(user=user, category=category)
        if expenses.exists():
            deleted_count, _ = expenses.delete()
            return Response(
                {'message': f'{deleted_count} expenses from {category_name} have been deleted'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'message': f'No expenses found for {category_name}'},
                status=status.HTTP_404_NOT_FOUND
            )


class SavingCategoryViewSet(viewsets.ModelViewSet):
    queryset = SavingCategory.objects.all()
    serializer_class = SavingCategorySerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.saving_set.exists():
            raise ValidationError({
                "detail": "Cannot delete this category because it has associated savings. Please delete all related savings first."
            })
        return super().destroy(request, *args, **kwargs)


class SavingViewSet(viewsets.ModelViewSet):
    queryset = Saving.objects.all()
    serializer_class = SavingSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        balance_record = get_or_create_balance()
        amount = Decimal(request.data.get('amount', 0))
        
        if amount > balance_record.balance:
            return Response(
                {"detail": "Insufficient balance"},
                status=status.HTTP_400_BAD_REQUEST
            )
        response = super().create(request, *args, **kwargs)
        balance_record.balance -= amount
        balance_record.total_savings += amount
        balance_record.save()

        return response

    def get_view_name(self):
        if hasattr(self, 'action'):
            if self.action == 'list':
                return "List of Savings"
            elif self.action == 'retrieve':
                return "Detail of Saving"
        return super(SavingViewSet, self).get_view_name()
    
    @action(detail=False, methods=['get'])
    def summary_by_category(self, request):
        categories = SavingCategory.objects.all()
        saving_summary = []

        for category in categories:
            total_saved = Saving.objects.filter(category=category).aggregate(total=Sum('amount'))['total'] or 0
            goal_amount = category.goal_amount or 0
            remaining_amount = goal_amount - total_saved if category.goal_amount else None

            data = {
                'category_name': category.name,
                'goal_amount': goal_amount,
                'total_saved': total_saved,
                'remaining_amount': remaining_amount
            }
            saving_summary.append(data)
        return Response(saving_summary)

    @action(detail=False, methods=['get'])
    def monthly_summary(self, request):
        monthly_data = Saving.objects.annotate(month=TruncMonth('date')).values('month').annotate(total_amount=models.Sum('amount')).order_by('month')
        return Response(monthly_data)
    
    @action(detail=False, methods=['get'])
    def monthly_category_summary(self, request):
        monthly_category_data = Saving.objects.annotate(
            month=TruncMonth('date')).values('month', 'category__name').annotate(
            total_amount=Sum('amount')).order_by('month', 'category__name')
        return Response(monthly_category_data)

    @action(detail=False, methods=['get'])
    def last_month_summary(self, request):
        datemonth = datetime.now().month
        last_month_data = Saving.objects.filter(date__month=datemonth).annotate(
            month=TruncMonth('date')).values('month').annotate(
            total_amount=Sum('amount')).order_by('month')
        return Response(last_month_data)

    @action(detail=False, methods=['get'])
    def last_month_category_summary(self, request):
        datemonth = datetime.now().month
        last_month_data = Saving.objects.filter(date__month=datemonth).annotate(
            month=TruncMonth('date')).values('month', 'category__name').annotate(
            total_amount=Sum('amount')).order_by('month', 'category__name')
        return Response(last_month_data)
    
    @action(detail=False, methods=['get'])
    def last_year_summary(self, request):
        last_year = datetime.now().year
        last_year_data = Saving.objects.filter(date__year=last_year).annotate(
            month=TruncMonth('date')).values('month').annotate(
            total_amount=Sum('amount')).order_by('month')
        return Response(last_year_data)

    @action(detail=False, methods=['get'])
    def last_year_category_summary(self, request):
        last_year = datetime.now().year
        last_year_data = Saving.objects.filter(date__year=last_year).values('category__name').annotate(
            total_amount=Sum('amount')
        ).order_by('category__name')
        return Response(last_year_data)
    
    @action(detail=False, methods=['delete'])
    def delete_by_category(self, request):
        """
        /savings/delete_by_category?category_name=category_name
        """
        category_name = request.query_params.get('category_name')
        category = get_object_or_404(SavingCategory, name=category_name)

        if Saving.objects.filter(category=category).exists():
            deleted_count, _ = Saving.objects.filter(category=category).delete()
            return Response(
                {'message': f'{deleted_count} savings from {category_name} have been deleted'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'message': f'No savings found for {category_name}'},
                status=status.HTTP_404_NOT_FOUND
            )

class ExportingViewSet(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def download_income_summary_pdf(self, request):
        incomes = Income.objects.all()
        return generate_incomes_pdf(incomes)
    
    @action(detail=False, methods=['get'])
    def download_expense_summary_pdf(self, request):
        expenses = Expense.objects.all()
        return generate_expenses_pdf(expenses)

    @action(detail=False, methods=['get'])
    def download_summary_pdf(self, request):
        incomes = Income.objects.all()
        expenses = Expense.objects.all()
        balances = Balance.objects.all()
        entries = [
            {'date': income.date, 'type': 'income', 'source': income.source.name, 'balance_after': income.balance_after, 'amount': income.amount, 'description': income.description}
            for income in incomes
        ] + [
            {'date': expense.date, 'type': 'expense', 'category': expense.category.name, 'balance_after': expense.balance_after, 'amount': expense.amount, 'description': expense.description}
            for expense in expenses
        ] 
        balance_data = [
            {'total_balance': balance.balance, 'total_savings': balance.total_savings, 'last_updated': balance.last_updated} 
            for balance in balances
        ]

        return generate_summary_pdf(entries, balance_data)


    def list(self, request):
        return Response({
            'message': 'Welcome to the Finance API exporting dashboard!',
        })
    

class DashboardView(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def list(self, request):
        return Response({
            'message': 'Welcome to the Finance API dashboard!',
            # 'endpoints': {
            #     'income-sources': '/income-sources/',
            #     'incomes': '/incomes/',
            #     'expense-categories': '/expense-categories/',
            #     'expenses': '/expenses/',
            #     'incomes-summary-by-source': '/incomes/summary_by_source/',
            #     'incomes-monthly-summary': '/incomes/monthly_summary/',
            #     'incomes-monthly-source-summary': '/incomes/monthly_source_summary/',
            #     'expenses-summary-by-category': '/expenses/summary_by_category/',
            #     'expenses-monthly-summary': '/expenses/monthly_summary/',
            #     'expenses-monthly-category-summary': '/expenses/monthly_category_summary/',
            #     'export-incomes-pdf': '/dashboard/export_incomes_pdf/',
            # }
        })


class HistoryViewSet(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def filterLast5(self, request):
        """
        Get the last 5 incomes and expenses
        """
        incomes = Income.objects.all().order_by('-date')[:5]
        expenses = Expense.objects.all().order_by('-date')[:5]
        combined = list(incomes) + list(expenses)

        combined = sorted(combined, key=lambda x: x.date, reverse=True)[:5]
        
        data = [
            {
                'type': 'income' if isinstance(obj, Income) else 'expense',
                'name': obj.source.name if isinstance(obj, Income) else obj.category.name,
                'amount': obj.amount,
                'date': obj.date,
            } for obj in combined
        ]

        return Response(data)
 

    def list(self, request):
        return Response({
            'message': 'Welcome to the Finance API history dashboard!',
        })
    

class BalanceViewSet(viewsets.ViewSet):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def list(self, request):
        balance_record = get_or_create_balance()

        total_income = Decimal(Income.objects.aggregate(total=Sum('amount'))['total'] or 0.0)
        total_expense = Decimal(Expense.objects.aggregate(total=Sum('amount'))['total'] or 0.0)
        total_savings = Decimal(Saving.objects.aggregate(total=Sum('amount'))['total'] or 0.0)

        balance_record.balance = total_income - total_expense
        balance_record.total_savings = total_savings
        balance_record.save()

        available_balance = balance_record.balance - balance_record.total_savings

        return Response({
            'total_balance': balance_record.balance,
            'total_savings': balance_record.total_savings,
            'available_balance': available_balance,
            'last_updated': balance_record.last_updated
        })
