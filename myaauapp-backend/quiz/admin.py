from django.contrib import admin

# Register your models here.
from .models import Course, Question, JobPost, QuizScore, ScholarshipPost 

admin.site.register(Course)
admin.site.register(Question)
admin.site.register(JobPost)
admin.site.register(QuizScore)
admin.site.register(ScholarshipPost)