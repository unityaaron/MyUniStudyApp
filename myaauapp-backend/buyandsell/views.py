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



#THIS PART IS FOR NATIVE LOGIN:

# We need to add a simple view whose only job is to get a token.
# You can add this view to the same file where your login view is.
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

# ... your other imports and views ...

# ✅ This new view will respond to a GET request and return the token.
@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """
    Returns a CSRF token.
    React Native app should call this endpoint first to get the token.
    """
    # This function from Django gets or creates a new token.
    token = get_token(request)
    # We return a simple JSON response with the token.
    return JsonResponse({'csrfToken': token})
