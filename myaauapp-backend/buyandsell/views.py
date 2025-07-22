from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import BuyAndSellItem
from .serializers import BuyAndSellItemSerializer
from .pagination import CustomPageNumberPagination


# Create your views here.
class BuyandSellItemListCreateView(generics.ListCreateAPIView):
    queryset = BuyAndSellItem.objects.all()
    serializer_class = BuyAndSellItemSerializer
    permission_class = [IsAuthenticatedOrReadOnly]
    pagination_class = CustomPageNumberPagination 

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


