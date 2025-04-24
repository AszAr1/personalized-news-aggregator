from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import CustomUserListView, CustomUserCreateView, CustomUserDetailView

urlpatterns = [
    path('', CustomUserListView.as_view(), name='users-index'),
    path('create', CustomUserCreateView.as_view(), name='users-create'),
    path('<uuid:id>', CustomUserDetailView.as_view(), name='users-detail'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
