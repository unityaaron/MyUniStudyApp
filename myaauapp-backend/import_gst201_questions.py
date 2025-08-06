import csv
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django.setup()

from quiz.models import Question, Course

course_code='GST201'
course=Course.objects.get(code=course_code)

with open('gst201_questions.csv', newline='', encoding='utf-8') as csvfile:
    reader=csv.DictReader(csvfile)
    count=0
    for row in reader:
        Question.objects.create(
            course=course,
            question_text=row['question_text'],
            option_a=row['option_a'],
            option_b=row['option_b'],
            option_c=row['option_c'],
            option_d=row['option_d'],

            correct_answer=row['correct_answer'].strip().upper()
        )            
        count +=1

print(f'✅ {count} questions added successfully to {course_code}')
        

