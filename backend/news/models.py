from uuid import uuid4
from django.db import models


class Source(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    link = models.TextField()

    class Meta:
        verbose_name = 'Source'
        verbose_name_plural = 'Sources'

    def __str__(self):
        return f"{self.__class__.__name__}({self.link})"


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=32)

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.__class__.__name__}({self.name})"


class Article(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    title = models.TextField()
    body = models.TextField()
    url = models.TextField()
    image = models.ImageField(null=True, blank=True)
    source = models.ForeignKey(Source, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    published_at = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'

    def __str__(self):
        return f"{self.__class__.__name__}({self.title}, {self.published_at}, {self.source})"


# class Bookmark(models.Model):
#     pass

