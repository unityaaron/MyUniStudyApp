from django.urls import path
from .views import BuyandSellItemListCreateView, UserProfileView

urlpatterns = [
    path('', BuyandSellItemListCreateView.as_view(), name='item-list-create'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),

]