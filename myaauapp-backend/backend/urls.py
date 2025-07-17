# backend/urls.py
from django.contrib import admin
from django.urls import path, include

# No more direct imports for dj_rest_auth views, as we're using `include` for their URL sets.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('quiz.urls')),  
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),

]