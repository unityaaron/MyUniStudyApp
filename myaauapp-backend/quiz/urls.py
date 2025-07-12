# urls.py (inside my app like quiz/urls.py)

from django.urls import path
from .views import CourseQuestionsView, JobPostListView, GoogleLogin


urlpatterns= [
    path('questions/<str:course_code>/', CourseQuestionsView.as_view()),
    path('jobs/', JobPostListView.as_view()),
    path('auth/social/login/google/', GoogleLogin.as_view(), name='google_login'),
]