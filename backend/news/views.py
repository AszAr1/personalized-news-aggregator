import asyncio as aio
from datetime import datetime, timezone
from typing import List

from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

from .models import Article, Category, Source
from .managers import NewsManager
from .pagination import CustomPagesNumberPagination
from .serializers import (
    GetUpdateDeleteArticleSerializer,
    CreateArticleSerializer,
    CategorySerializer,
    SourceSerializer
)


class ArticleListAPIView(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = GetUpdateDeleteArticleSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagesNumberPagination

    def update_articles_from_parsers(self, categories: list[str] | None) -> Response | None:
        latest_news = aio.run(NewsManager.get_news_by_category(20, categories)) if categories \
            else aio.run(NewsManager.get_news(20))

        latest_article: Article = Article.objects.order_by('created_at').last() if not categories else \
            Article.objects.select_related('category').filter(category__name__in=categories).order_by(
                'created_at').last()

        latest_article_index = -1
        if latest_article:
            for i, n in enumerate(latest_news):
                if str(n['title']).strip() == latest_article.title:
                    latest_article_index = i

        for article in latest_news[latest_article_index + 1:]:
            if Article.objects.filter(title=article['title']).exists():
                continue

            category_obj: Category = Category.objects.filter(name=article['category']).first()
            if not category_obj:
                return Response(
                    data={
                        "error": f"No such category: {article['category']}"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            article['category'] = category_obj.id

            source_obj: Source = Source.objects.filter(link=article['source']).first()
            if not source_obj:
                return Response(
                    data={
                        "error": f"No such source: {article['source']}"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            article['source'] = source_obj.id

            serializer = CreateArticleSerializer(data=article)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return None

    def list(self, request: Request, *args, **kwargs):
        categories_value = request.query_params.get('categories', None)
        categories = [
            category_value.strip() for category_value in categories_value.split(",")
        ] if categories_value else None

        last_update = request.query_params.get('last-update', None)
        last_update_time = datetime.strptime(last_update, '%Y-%m-%dT%H:%M:%S').replace(tzinfo=timezone.utc) \
            if last_update else None

        last_update_expired = (
                last_update_time and
                (datetime.now(timezone.utc) - last_update_time).total_seconds() >= 60 * 20
        )
        if last_update_expired or not last_update_time:
            response = self.update_articles_from_parsers(categories)
            if response:
                return response

        queryset = self.get_queryset(categories=categories)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self, categories: List[str] | None = None):
        if categories:
            return (
                Article.objects
                .prefetch_related('users_favorited', "users_liked", 'users_disliked')
                .select_related('category', 'source')
                .filter(category__name__in=categories)
                .order_by("created_at")
                .all()
            )

        return (
            Article.objects
            .prefetch_related('users_favorited', "users_liked", 'users_disliked')
            .select_related('category', 'source')
            .order_by("created_at")
            .all()
        )


class ArticleDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = GetUpdateDeleteArticleSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

    def get_queryset(self):
        return (
            Article.objects
            .prefetch_related('users_favorited', "users_liked", 'users_disliked')
            .select_related('category', 'source')
            .all()
        )


class ArticleCreateAPIView(CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = CreateArticleSerializer
    permission_classes = [AllowAny]


class ArticleSearchAPIView(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = GetUpdateDeleteArticleSerializer
    permission_classes = [AllowAny]

    def list(self, request: Request, *args, **kwargs):
        search_query = request.query_params.get('query', None)
        if not search_query:
            return Response(
                data={
                    'error': f"No query"
                },
                status=status.HTTP_400_BAD_REQUEST

            )

        search_results = aio.run(NewsManager.search(search_query))

        return Response(data=search_results, status=status.HTTP_200_OK)


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny, ]


class SourceListAPIView(ListAPIView):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    permission_classes = [AllowAny]
