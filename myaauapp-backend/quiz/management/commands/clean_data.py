# Import the tools we need
from django.core.management.base import BaseCommand
from quiz.models import Question
import unicodedata

class Command(BaseCommand):
    help = 'Cleans up non-standard characters in the quiz database.'

    def handle(self, *args, **options):
        questions = Question.objects.all()
        count = 0
        
        # We go through each question one by one.
        for question in questions:
            is_dirty = False
            
            # This is a list of all the fields we need to check.
            fields_to_check = [
                'question_text', 'option_a', 'option_b', 'option_c', 'option_d'
            ]

            # We loop through each field.
            for field in fields_to_check:
                original_text = getattr(question, field)
                
                # Check if the text is empty or None before trying to clean it
                if not original_text:
                    continue
                
                # This is the new, more powerful cleaning step.
                # We normalize the text to remove all non-standard characters.
                new_text = unicodedata.normalize('NFKD', original_text).encode('ascii', 'ignore').decode('utf-8')
                
                # We also need to get rid of any stray hyphens or newlines that might be left.
                new_text = new_text.replace('\n', ' ').replace('\r', '').replace('\t', '')
                
                # We also clean up any double spaces or hyphens that might have been created.
                new_text = new_text.replace('--', '-').replace('  ', ' ')
                
                # If the text has changed, we mark it as dirty.
                if new_text != original_text:
                    is_dirty = True
                
                # We save the cleaned text back to the question field.
                setattr(question, field, new_text)

            # Special check for the correct_answer field
            correct_answer = getattr(question, 'correct_answer')
            if len(correct_answer) != 1 or correct_answer.upper() not in ['A', 'B', 'C', 'D']:
                self.stdout.write(self.style.ERROR(f'Invalid correct_answer for question ID {question.pk}: {correct_answer}'))
                self.stdout.write(self.style.NOTICE(f'You must manually fix this in your Django Admin or database.'))
                is_dirty = False  # Do not save to avoid the error
            
            # If we changed anything, we save it in the database.
            if is_dirty:
                question.save()
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Fixed question with ID: {question.pk}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully cleaned {count} questions!'))