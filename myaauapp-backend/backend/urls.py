# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


# No more direct imports for dj_rest_auth views, as we're using `include` for their URL sets.

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/quiz/', include('quiz.urls')), 
    path('api/buyandsell/', include('buyandsell.urls')), 
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)