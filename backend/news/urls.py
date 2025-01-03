from django.urls import path
from .views import (
    ArticleCreateAPIView,
    ArticleListAPIView,
    ArticleDetailAPIView,
    ArticleSearchAPIView,
    CategoryListAPIView,
    SourceListAPIView,
)

urlpatterns = [
    path('', ArticleListAPIView.as_view(), name="news-index"),
    path('<uuid:id>', ArticleDetailAPIView.as_view(), name="news-detail"),
    path('create', ArticleCreateAPIView.as_view(), name="news-create"),
    path('search', ArticleSearchAPIView.as_view(), name="news-search"),
    path('categories', CategoryListAPIView.as_view(), name="news-categories"),
    path('sources', SourceListAPIView.as_view(), name="news-sources"),
]