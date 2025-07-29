from django.shortcuts import render, get_object_or_404



# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, Question, JobPost, QuizScore
from .serializers import QuestionSerializer, JobPostSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

  


class CourseQuestionsView(APIView):
    def get(self, request, course_code):
        # Look for the course by code e.g GST101/GST102
        course = get_object_or_404(Course, code=course_code.upper())

        #Get all the questions under the course
        questions = Question.objects.filter(course=course)

        #Serialize them for the frontend
        serializer = QuestionSerializer(questions, many=True)

        #Send the serialized data questions to the frontend
        return Response(serializer.data)
    
    
    
class JobPostListView(APIView):
    def get(self, request):
        jobs = JobPost.objects.all()
        paginator = PageNumberPagination()
        paginated_jobs = paginator.paginate_queryset(jobs, request)
        serializer = JobPostSerializer(paginated_jobs, many=True)
        return paginator.get_paginated_response(serializer.data)

class SubmitQuizResultView(APIView):
    permission_classes=[IsAuthenticated]

    #this view will receive a POST request from React
    def post(self, request):
        # 1. Get the data sent from React
        # We expect 'course_code' (e.g., "GST101") and 'score' (e.g., 8)
        course_code = request.data.get('course_code')
        score = request.data.get('score')

        # 2. Basic checks: Make sure we got the needed data
        if not course_code or score is None:
            return Response(
                {"detail": "Course code and score are required."},
                status=status.HTTP_400_BAD_REQUEST # Send a "bad request" error
            )

        # 3. Make sure the score is a number
        try:
            score = int(score)
        except ValueError:
            return Response(
                {"detail": "Score must be an integer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Find the Course in our database
        course = get_object_or_404(Course, code=course_code.upper())

        # 5. Get the user who is logged in (Django knows this from the 'IsAuthenticated' check)
        user = request.user

        # 6. Find or Create the QuizScore for this user and course
        #    get_or_create tries to find an existing record.
        #    If it finds one, it gives it to us.
        #    If it doesn't, it creates a new one using the default values.
        quiz_score, created = QuizScore.objects.get_or_create(
            user=user,
            course=course,
            defaults={'highest_score': score} # If new, set highest_score to the current score
        )

        # 7. If a record already existed (wasn't created new)
        if not created:
            # Compare the new score with the existing highest score
            if score > quiz_score.highest_score:
                # If the new score is higher, update it!
                quiz_score.highest_score = score
                quiz_score.save() # Save the change to the database
                return Response(
                    {"detail": "Highest score updated successfully!", "highest_score": quiz_score.highest_score},
                    status=status.HTTP_200_OK # Send an "OK" message
                )
            else:
                # If the new score is NOT higher, just tell React
                return Response(
                    {"detail": "Score is not higher than current highest.", "highest_score": quiz_score.highest_score},
                    status=status.HTTP_200_OK # Still an "OK" message, just no update happened
                )
        else:
            # If a new record was created, tell React it's saved
            return Response(
                {"detail": "New quiz score saved successfully!", "highest_score": quiz_score.highest_score},
                status=status.HTTP_201_CREATED # Send a "created" message
            )