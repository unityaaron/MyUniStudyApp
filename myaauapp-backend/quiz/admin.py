from django.contrib import admin

# Register your models here.
from .models import Course, Question, JobPost

admin.site.register(Course)
admin.site.register(Question)
admin.site.register(JobPost)
