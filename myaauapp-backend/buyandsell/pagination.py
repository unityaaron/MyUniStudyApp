# buyandsell/pagination.py

from rest_framework.pagination import PageNumberPagination

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10 # This sets the number of items per page
    page_size_query_param = 'page_size' # Allows client to specify page size (e.g., ?page_size=20)
    max_page_size = 100 # Maximum page size allowed if client requests more