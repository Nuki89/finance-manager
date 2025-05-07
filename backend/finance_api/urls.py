from django.urls import path, include
from rest_framework import routers
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
from . import views

class BaseRouterRootView(routers.APIRootView):
    permission_classes = [IsAuthenticated]
    def get_view_name(self) -> str:
        return "Finance API"

class BaseRouter(routers.DefaultRouter):
    APIRootView = BaseRouterRootView

router = BaseRouter()
router.register(r'users', AllUsersViewSet, basename='user')
router.register(r'income-sources', IncomeSourceViewSet, basename='incomesource')
router.register(r'incomes', IncomeViewSet, basename='income')
router.register(r'expense-categories', ExpenseCategoryViewSet, basename='expensecategory')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'saving-categories', SavingCategoryViewSet, basename='savingcategory')
router.register(r'savings', SavingViewSet, basename='saving')
router.register(r'exporting-pdf', views.ExportingViewSet, basename='exporting')
router.register(r'balance', BalanceViewSet, basename='balance')
router.register(r'history', HistoryViewSet, basename='history')
# router.register(r'dashboard', DashboardView, basename='dashboard')


urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterViewSet.as_view({'post': 'create'}), name='register'),
    path('profile/', UserProfileViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='profile'),
    # path('api/login/', login_view, name='login'),
    # path('api/logout/', logout_view, name='logout'),
    # path('api/protected/', protected_view, name='protected'),
    # path('api/is_logged_in/', is_logged_in, name='is_logged_in'),
]