from django.contrib import admin

from .models import Article, Source, Category


class ArticleAdmin(admin.ModelAdmin):
    fields = (
        'title',
        'url',
        "image",
        'source',
        'category',
        'published_at'
        'views_count',
        'created_at',
    )


class SourceAdmin(admin.ModelAdmin):
    fields = ('link',)


class CategoryAdmin(admin.ModelAdmin):
    fields = ('name',)


admin.site.register(Article, ArticleAdmin)
admin.site.register(Source, SourceAdmin)
admin.site.register(Category, CategoryAdmin)
