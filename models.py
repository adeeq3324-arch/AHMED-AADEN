from django.db import models
from django.contrib.auth.models import User

# 1. KHAANADDA APPS-KA LAGA ILAALINAYO (App Shield Control)
class AppShield(models.Model):
    LOCK_CHOICES = [
        ('STRICT', 'Strict Hardcore Lock'),
        ('MEDIUM', 'Medium Reminder'),
        ('SOFT', 'Soft Guard'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shielded_apps')
    app_name = models.CharField(max_length=100)  # Sida: TikTok, Instagram, YouTube
    package_name = models.CharField(max_length=255) # Android Package Name (com.zhiliaoapp.musically)
    lock_level = models.CharField(max_length=10, choices=LOCK_CHOICES, default='STRICT')
    daily_allowed_minutes = models.IntegerField(default=30) # Inta daqiiqo ee loo oggol yahay maalintii
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.app_name} ({self.lock_level}) - {self.user.username}"


# 2. KHAANADDA JADWALLADA QUFULKA (Focus Schedules)
class FocusSchedule(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='schedules')
    title = models.CharField(max_length=150) # Sida: Prayer & Quran Mode, Deep Study
    start_time = models.TimeField() # Saacadda uu bilaabanayo qufulku
    end_time = models.TimeField()   # Saacadda uu ku eg yahay
    is_strict_mode = models.BooleanField(default=True) # Haddii ay run tahay qofku maba furi karo dhimasho iyo nolosha!
    days_of_week = models.CharField(max_length=50, default="Mon,Tue,Wed,Thu,Fri,Sat,Sun")

    def __str__(self):
        return f"{self.title} [{self.start_time} - {self.end_time}]"


# 3. KHAANADDA SHEEKADA AI COACH-KA (AI Coach Chat History)
class AICoachChat(models.Model):
    SENDER_CHOICES = [
        ('USER', 'User'),
        ('AI_COACH', 'FocusLock AI'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_history')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField() # Qoraalka la isku qoray
    timestamp = models.DateTimeField(auto_now_add=True) # Waqtiga saxda ah

    def __str__(self):
        return f"{self.sender}: {self.message[:30]}..."


# 4. KHAANADDA DISCIPLINE METRICS (Xogta Falanqaynta Data Science-ka)
class DisciplineMetric(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='metrics')
    date = models.DateField(auto_now_add=True)
    discipline_score = models.IntegerField(default=100) # Dhibcaha edbinta (0 ilaa 100)
    screen_time_saved_minutes = models.IntegerField(default=0) # Daqiiqadaha uu maanta badbaadiyay
    failed_unlock_attempts = models.IntegerField(default=0) # Imisa jeer uu isku dayay inuu furto apps-ka xiran

    def __str__(self):
        return f"{self.date} - Score: {self.discipline_score} ({self.user.username})"
