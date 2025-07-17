# quiz app urls.py
from django.urls import path
from .views import CourseQuestionsView, JobPostListView # Removed GoogleLogin import

urlpatterns= [
    path('questions/<str:course_code>/', CourseQuestionsView.as_view()),
    path('jobs/', JobPostListView.as_view()),
    # The social login endpoint is now handled by dj_rest_auth in backend/urls.py
]