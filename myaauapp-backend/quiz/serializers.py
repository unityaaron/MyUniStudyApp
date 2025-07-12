from rest_framework import serializers
from .models import Question, JobPost

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

