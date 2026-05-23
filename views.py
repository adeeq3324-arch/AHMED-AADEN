import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import AICoachChat, DisciplineMetric

class AICoachChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_message = request.data.get('message')

        if not user_message:
            return Response({"error": "Fariintu ma bannaanaan karto saaxiib!"}, status=status.HTTP_400_BAD_REQUEST)

        AICoachChat.objects.create(user=user, sender='USER', message=user_message)

        system_instruction = (
            "You are the ultimate FocusLock AI Coach. Your job is to destroy phone addiction and build unbreakable discipline. "
            "The user is struggling with distractions (like social media, TikTok, gaming) and you must be a tough, psychological mentor. "
            "Do not be overly soft. Be direct, motivational, and hit them with reality checks about their future, time management, and goals. "
            "Keep answers impactful, punchy, and maximum 3-4 sentences. Speak directly to their inner champion."
        )

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_message}
                ]
            )
            ai_response_text = response.choices[0].message.content

            AICoachChat.objects.create(user=user, sender='AI_COACH', message=ai_response_text)

            metric, created = DisciplineMetric.objects.get_or_create(user=user)
            if "urge" in user_message.lower() or "distract" in user_message.lower():
                metric.discipline_score = max(0, metric.discipline_score - 2)
                metric.save()

            return Response({
                "ai_message": ai_response_text,
                "current_discipline_score": metric.discipline_score
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "Xiriirka AI xoogaa waa uu daciifay, dib u day!"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
