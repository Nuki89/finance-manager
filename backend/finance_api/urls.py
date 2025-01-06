from django.urls import path, include
from rest_framework import routers
from rest_framework.permissions import IsAuthenticated
from .views import *
from . import views

class BaseRouterRootView(routers.APIRootView):
    # permission_classes = [IsAuthenticated]
    def get_view_name(self) -> str:
        return "Finance API"

class BaseRouter(routers.DefaultRouter):
    APIRootView = BaseRouterRootView

router = BaseRouter()
router.register(r'income-sources', IncomeSourceViewSet)


urlpatterns = [
    path('', include(router.urls)),
]