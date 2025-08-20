from django.core.management.base import BaseCommand
from django.core.management import call_command
from quiz.models import Question, Course

class Command(BaseCommand):
    help = 'Deletes all questions and then loads initial data fixtures.'

    def handle(self, *args, **options):
        # This is the line that deletes all the old questions.
        self.stdout.write("Deleting all existing questions...")
        Question.objects.all().delete()
        self.stdout.write(self.style.SUCCESS("All old questions deleted."))

        # This is the line that loads your new, clean data.
        self.stdout.write("Loading initial data...")
        call_command('loaddata', 'initial_data.json')
        self.stdout.write(self.style.SUCCESS("Data loaded successfully!"))