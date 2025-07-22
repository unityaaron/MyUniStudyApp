from rest_framework import serializers
from .models import BuyAndSellItem

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