from django.db import models

# Create your models here.
class Course(models.Model):
    code = models.CharField(max_length=20)  # e.g., GST101, GST102
    title = models.CharField(max_length=100)  # e.g., Use of English

    def __str__(self):
        return self.code


class Question(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_answer = models.CharField(max_length=1)  # A, B, C or D

    def __str__(self):
        return f"{self.course.code}: {self.question_text[:50]}"


class JobPost(models.Model):
    title = models.CharField(max_length=255)
    link = models.URLField(unique=True)
    summary = models.TextField(blank=True, null=True)
    date_posted = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    #field to record the website where the job post came from
    source = models.CharField(max_length=100, default='Unknown')

    #This will automatically save the time and date we scraped the job post from the site
    #auto_now_add=True sets it only when the job is first created in our DB
    scraped_at = models.DateTimeField(auto_now_add=True)

    #this helps us see a nice name for the job when we look at in Django's admin
    def __str__(self):
        return self.title
    
    #this tells Django to always show the newest scraped jobs first
    class Meta:
        ordering = ['-scraped_at'] #the '-' means descending order (newest first) 