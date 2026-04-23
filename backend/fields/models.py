from django.db import models
from django.contrib.auth.models import User
from datetime import date,timedelta
from django.utils import timezone


class Field(models.Model):
    STAGE_CHOICES = [
        ('PLANTED', 'Planted'),
        ('GROWING', 'Growing'),
        ('READY', 'Ready'),
        ('HARVESTED', 'Harvested'),
    ]

    name = models.CharField(max_length=100)
    crop_type = models.CharField(max_length=100)
    planting_date = models.DateField()
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='PLANTED')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_fields')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    status = models.CharField(max_length=20, default='Active')
    

    @property
    def computed_status(self):
        # 1. Completed Logic
        if self.current_stage == 'HARVESTED':
            return 'Completed'
        
        # 2. At Risk Logic (Example: No updates in 30 days)
        # Assuming you have an 'updated_at' field
        thirty_days_ago = timezone.now() - timedelta(days=30)
        # If the field hasn't been updated in a month, it's at risk
        if hasattr(self, 'updated_at') and self.updated_at < thirty_days_ago:
            return 'At Risk'
            
        # 3. Alternative At Risk: Specific keywords in notes
        if self.notes and any(word in self.notes.lower() for word in ['pest', 'disease', 'dry', 'wither']):
            return 'At Risk'

        # 4. Default: Active
        return 'Active'
