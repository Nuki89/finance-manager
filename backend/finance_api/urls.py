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
router.register(r'income-sources', IncomeSourceViewSet)
router.register(r'incomes', IncomeViewSet)
router.register(r'expense-categories', ExpenseCategoryViewSet)
router.register(r'expenses', ExpenseViewSet)
router.register(r'exporting-pdf', views.ExportingViewSet, basename='exporting')
router.register(r'balance', BalanceViewSet, basename='balance')
# router.register(r'dashboard', DashboardView, basename='dashboard')


urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]