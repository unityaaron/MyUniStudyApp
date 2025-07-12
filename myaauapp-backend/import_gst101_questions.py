import csv
import os
import django

# Step 1: Tell Django where settings.py is
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # ⬅️ Change if needed

# Step 2: Set up Django
django.setup()

# Step 3: Import models
from quiz.models import Course, Question  # Change 'quiz' to your app name

# Step 4: Pick the course you want to add questions to
course_code = 'GST101'  # 👈🏾 change to GST102 if needed
course = Course.objects.get(code=course_code)

# Step 5: Read the CSV file
with open('gst101_questions.csv', newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    count = 0
    for row in reader:
        Question.objects.create(
            course=course,
            question_text=row['question_text'],         # column name in your CSV
            option_a=row['option_a'],
            option_b=row['option_b'],
            option_c=row['option_c'],
            option_d=row['option_d'],
            correct_answer=row['correct_answer'].strip().upper()
        )
        count += 1

print(f"✅ {count} questions added to {course_code}")
