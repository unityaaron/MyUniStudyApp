from django.db import models

# Create your models here.
# buyandsell/models.py
from django.conf import settings # To link to Django's User model

class BuyAndSellItem(models.Model):
    # The 'seller' is the user who posted the item
    # models.ForeignKey creates a link to Django's built-in User model
    # on_delete=models.CASCADE means if the user is deleted, their items are also deleted
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='buy_sell_items')

    # Basic details for the item/service/hostel
    title = models.CharField(max_length=200) # Short name
    description = models.TextField() # Long description

    # Price of the item/service/hostel
    # max_digits is total number of digits, decimal_places is digits after decimal point
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Contact information for WhatsApp
    # It's a CharField because numbers can have leading zeros or + signs
    whatsapp_number = models.CharField(max_length=20) # e.g., +2348012345678

    # Location of the item/service/hostel (optional)
    location = models.CharField(max_length=100, blank=True, null=True) # blank=True allows empty in forms, null=True allows empty in DB

    # Optional image for the item
    # Requires Pillow to be installed (pip install Pillow)
    # Images will be stored in a 'media' folder (we'll configure this soon)
    image = models.ImageField(upload_to='buy_sell_images/', blank=True, null=True)

    # Automatically sets the date and time when the item is first created
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Orders posts by creation date, newest first (the minus sign means descending)
        ordering = ['-created_at']

    def __str__(self):
        # This is what will be displayed in the Django admin site for each item
        return f"{self.title} by {self.seller.username}"