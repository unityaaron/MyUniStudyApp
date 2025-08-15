from django.urls import path
from .views import BuyandSellItemListCreateView, UserProfileView

#THIS PART IS FOR REACT NATIVE
from . import views # Make sure you import the views file correctly


urlpatterns = [
    path('', BuyandSellItemListCreateView.as_view(), name='item-list-create'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),

    #THIS PART IS FOR REACT NATIVE 
    path('get-csrf/', views.get_csrf_token, name='get_csrf_token'),
   # path('auth/login/', views.login, name='api_login'), # This is your existing URL

]