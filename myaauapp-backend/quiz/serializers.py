from rest_framework import serializers
from .models import Question, JobPost, QuizScore, ScholarshipPost

class QuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'correct_answer', 'options']

    def get_options(self, obj):
        return {
            "A": obj.option_a,
            "B": obj.option_b,
            "C": obj.option_c,
            "D": obj.option_d,
        }
    
class JobPostSerializer(serializers.ModelSerializer):
        class Meta:
            model = JobPost
            fields = '__all__'

class QuizScoreSerializer(serializers.ModelSerializer):
     user = serializers.CharField(source='user.username', read_only=True)
     course_code = serializers.CharField(source='course.code', read_only=True)

     class Meta:
          model = QuizScore
          fields = ['id', 'user', 'course_code', 'highest_score']
          read_only_fields = ['user', 'course_code'] 
     





class ScholarshipPostSerializer(serializers.ModelSerializer):
    # What is a ModelSerializer?
    # Think of it like a smart assistant that automatically knows how to
    # convert your Django model (ScholarshipPost) into JSON data.
    # It looks at your model's fields and creates matching fields for the JSON.

    class Meta:
        # What is Meta?
        # This is a special inner class where we tell the ModelSerializer
        # which Django model it should work with and which fields from that
        # model it should include in the JSON output.

        model = ScholarshipPost # We tell it to use our ScholarshipPost model

        # What are fields?
        # These are the specific pieces of information (columns in your database)
        # that you want to include when you send scholarship data to the frontend.
        # '__all__' means include ALL fields from the ScholarshipPost model.
        # You could also list them specifically like:
        # fields = ['id', 'title', 'link', 'summary', 'date_posted', 'image_url', 'source']
        fields = '__all__'

        # What is read_only_fields?
        # These are fields that the frontend can read (see), but cannot change
        # when sending data back to the backend. 'id', 'created_at', and 'updated_at'
        # are usually set automatically by Django, so the frontend shouldn't try to change them.
        read_only_fields = ['id', 'created_at', 'updated_at']



