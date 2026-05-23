from django.urls import path
from .views import AICoachChatView

urlpatterns = [
    path('api/coach/chat/', AICoachChatView.as_view(), name='ai-coach-chat'),
]
