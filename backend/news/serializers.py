from uuid import UUID
from rest_framework.serializers import (
    ModelSerializer,
    HyperlinkedIdentityField,
    SerializerMethodField
)

from .models import Source, Category, Article


class SourceSerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)
    # see_more = HyperlinkedIdentityField(view_name='detail', lookup_field='id')

    class Meta:
        model = Source
        fields = ['id', 'link',]

    def get_id(self, obj: Meta.model) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id


class CategorySerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)
    # see_more = HyperlinkedIdentityField(view_name='detail', lookup_field='id')

    class Meta:
        model = Category
        fields = ['id', 'name',]

    def get_id(self, obj: Meta.model) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id


class ArticleSerializer(ModelSerializer):
    id = SerializerMethodField(read_only=True)
    see_more = HyperlinkedIdentityField(view_name='news-detail', lookup_field='id')

    class Meta:
        model = Article
        fields = ['id', 'title', 'body', 'url', 'image', 'source', 'category', 'published_at', "see_more",]

    def get_id(self, obj: Meta.model) -> UUID | None:
        if not hasattr(obj, 'id') or not isinstance(obj, self.Meta.model):
            return None

        return obj.id
