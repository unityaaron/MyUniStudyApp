from django.shortcuts import render, get_object_or_404



# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Course, Question, JobPost
from .serializers import QuestionSerializer, JobPostSerializer
from rest_framework.pagination import PageNumberPagination

  


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

