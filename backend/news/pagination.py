from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagesNumberPagination(PageNumberPagination):
    page_size = 16

    def get_paginated_response(self, data):
        return Response({
            'pagesCount': self.page.paginator.num_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data,
        })
