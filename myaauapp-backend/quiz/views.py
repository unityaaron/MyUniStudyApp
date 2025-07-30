from django.shortcuts import render, get_object_or_404



# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, Question, JobPost, QuizScore
from .serializers import QuestionSerializer, JobPostSerializer, QuizScoreSerializer
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
        print(f"DEBUG: Received submission - User: {request.user.username}, Course: {course_code}, Score: {score}")


        # 2. Basic checks: Make sure we got the needed data
        if not course_code or score is None:
            print("DEBUG: Missing course_code or score")
            return Response(
                {"detail": "Course code and score are required."},
                status=status.HTTP_400_BAD_REQUEST # Send a "bad request" error
            )

        # 3. Make sure the score is a number
        try:
            score = int(score)
        except ValueError:
            print(f"DEBUG: Invalid score type received: {type(score)} for score: {score}")
            return Response(
                {"detail": "Score must be an integer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Find the Course in our database
        course = get_object_or_404(Course, code=course_code.upper())

        # 5. Get the user who is logged in (Django knows this from the 'IsAuthenticated' check)
        user = request.user
        print(f"DEBUG: Looking for QuizScore for user {user.username} and course {course.code}")


        # 6. Find or Create the QuizScore for this user and course
        #    get_or_create tries to find an existing record.
        #    If it finds one, it gives it to us.
        #    If it doesn't, it creates a new one using the default values.
        quiz_score, created = QuizScore.objects.get_or_create(
            user=user,
            course=course,
            defaults={'highest_score': score} # If new, set highest_score to the current score
        )
        print(f"DEBUG: QuizScore instance found/created. Created: {created}. Current highest_score in DB (before potential update): {quiz_score.highest_score}")

        # 7. If a record already existed (wasn't created new)
        if not created:
            # Compare the new score with the existing highest score
            print(f"DEBUG: Record existed. Comparing new score ({score}) with old highest ({quiz_score.highest_score})")
            if score > quiz_score.highest_score:
                # If the new score is higher, update it!
                quiz_score.highest_score = score
                quiz_score.save() # Save the change to the database
                print(f"DEBUG: Score updated for {user.username} to new highest: {quiz_score.highest_score}")
                return Response(
                    {"detail": "Highest score updated successfully!", "highest_score": quiz_score.highest_score},
                    status=status.HTTP_200_OK # Send an "OK" message
                )
            else:
                # If the new score is NOT higher, just tell React
                print(f"DEBUG: New score ({score}) NOT higher than current highest ({quiz_score.highest_score}). No update.")
                return Response(
                    {"detail": "Score is not higher than current highest.", "highest_score": quiz_score.highest_score},
                    status=status.HTTP_200_OK # Still an "OK" message, just no update happened
                )
        else:
            # If a new record was created, tell React it's saved
            print(f"DEBUG: New record created for {user.username} with score {quiz_score.highest_score} (from defaults).")
            return Response(
                {"detail": "New quiz score saved successfully!", "highest_score": quiz_score.highest_score},
                status=status.HTTP_201_CREATED # Send a "created" message
            )
        


class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]    # We need to get the course_code from the URL, just like CourseQuestionsView
    def get(self, request, course_code):
        # 1. Find the Course in our database
        course = get_object_or_404(Course, code=course_code.upper())

        # 2. Get all QuizScore entries for this specific course
        #    Since we used 'unique_together' and 'highest_score' in our model,
        #    each entry here is already the highest score for a user in this course.
        #    We also sort them from highest score down.
        leaderboard_scores = QuizScore.objects.filter(course=course).order_by('-highest_score')

        # 3. Package the scores using our QuizScoreSerializer
        #    'many=True' because we are sending a list of scores, not just one.
        serializer = QuizScoreSerializer(leaderboard_scores, many=True)

        # 4. Send the packaged data to React
        return Response(serializer.data)