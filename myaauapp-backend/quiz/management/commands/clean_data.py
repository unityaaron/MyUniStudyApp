# Import the tools we need
from django.core.management.base import BaseCommand
from quiz.models import Question
import re

class Command(BaseCommand):
    # This is what a user will see when they run 'help' on our command.
    help = 'Cleans up non-standard characters in the quiz database.'

    def handle(self, *args, **options):
        # We find all the questions in our database.
        questions = Question.objects.all()
        count = 0
        
        # We define a pattern that we will use to find special characters.
        # This pattern finds any character that is NOT a normal letter, number, or punctuation.
        # It's a very powerful tool that we can reuse.
        non_standard_chars_pattern = re.compile(r'[^\x00-\x7F]+')

        # We go through each question one by one.
        for question in questions:
            is_dirty = False
            
            # This is a list of all the fields we need to check in our question.
            fields_to_check = [
                'question_text', 'option_a', 'option_b', 'option_c', 'option_d'
            ]

            # We loop through each field.
            for field in fields_to_check:
                original_text = getattr(question, field)
                new_text = original_text

                # We use our pattern to find and remove any non-standard characters.
                if non_standard_chars_pattern.search(new_text):
                    # We replace the bad characters with a normal dash.
                    new_text = non_standard_chars_pattern.sub('-', new_text)
                    is_dirty = True
                
                # We save the cleaned text back to the question field.
                setattr(question, field, new_text)

            # Special check for the correct_answer field
            correct_answer = getattr(question, 'correct_answer')
            if len(correct_answer) != 1 or correct_answer.upper() not in ['A', 'B', 'C', 'D']:
                self.stdout.write(self.style.ERROR(f'Invalid correct_answer for question ID {question.pk}: {correct_answer}'))
                self.stdout.write(self.style.NOTICE(f'You must manually fix this in your Django Admin or database.'))
                is_dirty = False  # Do not save to avoid the error
            
            # If we changed anything in this question, we save it in the database.
            if is_dirty:
                question.save()
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Fixed question with ID: {question.pk}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully cleaned {count} questions!'))