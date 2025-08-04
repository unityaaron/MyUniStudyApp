from django.db import models
from django.conf import settings

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



class ScholarshipPost(models.Model):
    title = models.CharField(max_length=255)
    link = models.URLField(unique=True)
    summary = models.TextField(blank=True, null=True) # To store summary/excerpt
    date_posted = models.CharField(max_length=100, blank=True, null=True) # To store the date
    image_url = models.URLField(max_length=500, blank=True, null=True) # To store the image URL
    source = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Scholarship Post"
        verbose_name_plural = "Scholarship Posts"

        
class QuizScore(models.Model):
    # 1. Who got this score? Link to the User who took the quiz.
    #    settings.AUTH_USER_MODEL means "use Django's built-in User model."
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_highest_scores')

    # 2. Which course was this score for? Link to our Course model.
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_highest_scores')

    # 3. What was their highest score for this course? We'll store it as a whole number.
    highest_score = models.IntegerField(default=0) # Starts at 0 if no score yet.

    # This special part ensures that for any ONE user and any ONE course,
    # there can only be ONE entry in this table.
    # This is how we make sure we only store the *highest* score per user per course.
    class Meta:
        unique_together = ('user', 'course') # Means the combination of user AND course must be unique.
        ordering = ['-highest_score']        # Default way to sort scores (highest first).

    # This helps us see nice names in the Django Admin.
    def __str__(self):
        return f"{self.user.username}'s highest score for {self.course.code}: {self.highest_score}"
