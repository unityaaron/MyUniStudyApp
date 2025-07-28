from rest_framework import serializers
from .models import BuyAndSellItem, UserProfile

class BuyAndSellItemSerializer(serializers.ModelSerializer):
    seller_username = serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model =BuyAndSellItem
        fields = [
            'id',
            #'seller',
            'seller_username',
            'title',
            'description',
            'price',
            'whatsapp_number',
            'location',
            'image',
            'created_at',
            
        ]

        extra_kwargs = {
            'seller': {'write_only':True}
        }

class UserProfileSerializer(serializers.ModelSerializer):
    # We might want to see the username linked to the profile, but not allow changing it directly
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserProfile
        # Specify the fields you want to include when data is sent to/from React
        fields = ['id', 'username', 'notifications_enabled']
        # 'id' is the profile's ID
        # 'username' is the linked user's username (read-only)
        # 'notifications_enabled' is our new se