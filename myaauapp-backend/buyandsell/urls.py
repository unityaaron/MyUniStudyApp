from django.urls import path
from .views import BuyandSellItemListCreateView

urlpatterns = [
    path('', BuyandSellItemListCreateView.as_view(), name='item-list-create'),

]