from django.contrib import admin
# Register your models here.
from .models import BuyAndSellItem, UserProfile

admin.site.register(BuyAndSellItem)
admin.site.register(UserProfile)