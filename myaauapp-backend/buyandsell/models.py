from django.db import models
from django.db.models.signals import post_save # This listens for a "save" signal
from django.dispatch import receiver # This helps connect our function to the signal



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
class UserProfile(models.Model):
    # This creates a special one-to-one link to Django's built-in User model.
    # It means each Django User can have exactly one UserProfile.
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')

    # This is our new field to store the notification preference.
    # BooleanField means it can be True (on) or False (off).
    # default=True means by default, notifications are ON for new users.
    notifications_enabled = models.BooleanField(default=True)

    def __str__(self):
        # This helps us see a clear name in the Django admin
        return f"Profile for {self.user.username}"

# ✨ NEW: Signal to automatically create a UserProfile when a new User is created ✨
# This is like a tiny helper that watches for new users.
# When a new User account is saved, this function automatically creates a matching UserProfile for them.
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created: # 'created' is True if a brand new user was just saved
        UserProfile.objects.create(user=instance) # Create a new UserProfile linked to this new user

# ✨ NEW: Signal to automatically save the UserProfile when the User is saved ✨
# This ensures that if a User is updated (e.g., username changes), their profile also gets saved.
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    # Try to save the linked profile. If a user doesn't have a profile yet (which shouldn't happen
    # if create_user_profile works), it will just skip.
    # This check is important to prevent errors if the profile isn't yet created by the signal.
    if hasattr(instance, 'profile'):
        instance.profile.save()