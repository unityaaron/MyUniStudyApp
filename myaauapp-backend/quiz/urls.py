# quiz app urls.py
from django.urls import path
from .views import CourseQuestionsView, JobPostListView, SubmitQuizResultView, LeaderboardView

urlpatterns= [
    path('questions/<str:course_code>/', CourseQuestionsView.as_view()),
    path('jobs/', JobPostListView.as_view()),
    path('submit-quiz-result/', SubmitQuizResultView.as_view(), name='submit-quiz-result'),
    path('leaderboard/<str:course_code>/', LeaderboardView.as_view(), name='leaderboard'),
    
]