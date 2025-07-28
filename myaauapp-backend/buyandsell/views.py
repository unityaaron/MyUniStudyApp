from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import BuyAndSellItem, UserProfile
from .serializers import BuyAndSellItemSerializer, UserProfileSerializer 
from .pagination import CustomPageNumberPagination
from rest_framework.permissions import IsAuthenticated


# Create your views here.
class BuyandSellItemListCreateView(generics.ListCreateAPIView):
    queryset = BuyAndSellItem.objects.all()
    serializer_class = BuyAndSellItemSerializer
    permission_class = [IsAuthenticatedOrReadOnly]
    pagination_class = CustomPageNumberPagination 

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API view to retrieve (GET) and update (PUT/PATCH) the authenticated user's profile.
    This view is special because it automatically knows which user's profile to get.
    """
    # This tells Django REST Framework what kind of data this view works with
    queryset = UserProfile.objects.all()
    # This tells it which serializer to use to convert data to/from JSON
    serializer_class = UserProfileSerializer
    # This makes sure only users who are logged in can access this view
    permission_classes = [IsAuthenticated]

    # This is the MOST IMPORTANT part of this view!
    # It customizes *how* the specific profile object is found.
    # Instead of looking for an ID from the URL, it always gets the profile
    # that belongs to the *currently logged-in user*.
    def get_object(self):
        # 'self.request.user' refers to the currently logged-in user object.
        # '.profile' accesses the related UserProfile object because we set
        # related_name='profile' on the OneToOneField in models.py
        return self.request.user.profile



