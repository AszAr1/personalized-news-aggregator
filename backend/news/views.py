from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from django.db.models import Q

from users.models import CustomUser
from .models import Article, Category, Source
from .serializers import ArticleSerializer, CategorySerializer, SourceSerializer
from .parsers import BBCParser, ABCParser, NBCParser


class ArticleListAPIView(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def get_news_by_category(self, number_of_articles: int, category: str) -> list[dict]:
        bbc_parser = BBCParser()
        abc_parser = ABCParser()
        nbc_parser = NBCParser()

        bbc_news = bbc_parser.getNewsByCategory(number_of_articles, category)
        abc_news = abc_parser.getNewsByCategory(number_of_articles, category)
        nbc_news = nbc_parser.getNewsByCategory(number_of_articles, category)

        news = bbc_news + abc_news + nbc_news
        news.sort(key=lambda x: x['published_at'])

        return news

    def get_news(self, number_of_articles: int) -> list[dict]:
        bbc_parser = BBCParser()
        abc_parser = ABCParser()
        nbc_parser = NBCParser()

        bbc_news = bbc_parser.getNews(number_of_articles)
        abc_news = abc_parser.getNews(number_of_articles)
        nbc_news = nbc_parser.getNews(number_of_articles)

        news = bbc_news + abc_news + nbc_news
        news.sort(key=lambda x: x['published_at'])

        return news

    def list(self, request: Request, *args, **kwargs):
        category = request.query_params.get('category', None)
        if category and category not in Category.objects.all():
            return Response(
                data={
                    'error': f"No such category: {category}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if category:
            latest_news = self.get_news_by_category(20, category)
        else:
            latest_news = self.get_news(20)

        latest_article: Article = Article.objects.order_by('created_at').last()
        latest_article_index = -1
        if latest_article:
            latest_article_index = latest_news.index([n for n in latest_news if n['title'] == latest_article.title][0])

        for article in latest_news[latest_article_index+1:]:
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

            serializer = ArticleSerializer(data=article)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ArticleDetailAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


class ArticleCreateAPIView(CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]


class ArticleSearchAPIView(ListAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

    def list(self, request: Request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        search_query = request.query_params.get('query', "Elon+Musk")
        parser = BBCParser()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(
            Article.objects
            .filter(Q(source__link__startswith="https://abcnews.go.com") & Q(category__name="Business"))
            .select_related('source', 'category').order_by('updated_at').last(),
            many=False
        )
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny, ]


class SourceListAPIView(ListAPIView):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer
    permission_classes = [AllowAny]
