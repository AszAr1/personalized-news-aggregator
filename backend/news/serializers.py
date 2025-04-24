from uuid import UUID
from rest_framework.serializers import (
    ModelSerializer,
    HyperlinkedIdentityField,
    SerializerMethodField,
)

from .models import Source, Category, Article


class SourceSerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)

    class Meta:
        model = Source
        fields = ['id', 'link', ]

    def get_id(self, obj: Meta.model) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id


class CategorySerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', ]

    def get_id(self, obj: Meta.model) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id


class GetUpdateDeleteArticleSerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)
    see_more = HyperlinkedIdentityField(view_name='news-detail', lookup_field='id')
    source = SourceSerializer()
    category = CategorySerializer()

    class Meta:
        model = Article
        fields = [
            'id',
            'title',
            'views_count',
            'url',
            'image',
            'source',
            "users_favorited",
            "users_disliked",
            'users_liked',
            'category',
            'published_at',
            "see_more",
        ]

    def get_id(self, obj: Meta.model) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id

    def update(self, instance: Article, validated_data):
        instance.views_count = validated_data.get('views_count', instance.views_count)
        instance.save()

        return instance


class CreateArticleSerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'url', 'image', 'source', 'category', 'published_at']

    def get_id(self, obj: Meta.model) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id


class UpdateArticleSerializer(ModelSerializer):
    class Meta:
        model = Article
        fields = ['views_count']
