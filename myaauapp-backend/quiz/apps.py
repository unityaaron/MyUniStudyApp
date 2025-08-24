from django.apps import AppConfig


class QuizConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quiz'


 # This method runs when your Django app is ready
    def ready(self):
        # We import the tasks here to avoid circular imports
        from background_task.models import Task
        from .tasks import scrape_all_opportunities

        # Check if the task is already scheduled
        # This prevents scheduling it multiple times if the app restarts
        if not Task.objects.filter(task_name='quiz.tasks.scrape_all_opportunities').exists():
            # Schedule the task to run
            # The 'repeat=Task.DAILY' means it will run every day.
            # 'schedule=35' is the initial delay you set.
            scrape_all_opportunities(repeat=Task.DAILY, schedule=35)
            print("Scheduled scrape_all_opportunities task.")
        else:
            print("scrape_all_opportunities task already scheduled.")