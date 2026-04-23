from rest_framework import serializers 
from .models import Field
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User

class FieldSerializer(serializers.ModelSerializer):
    agent_name = serializers.ReadOnlyField(source='agent.username')
    # Use a SerializerMethodField to provide 'status' without it being in the DB
    status = serializers.ReadOnlyField(source='computed_status')
    
    class Meta:
        model = Field
        fields = ['id', 'name', 'crop_type', 'planting_date', 'current_stage', 'status', 'agent', 'agent_name', 'notes']

    def __init__(self, *args, **kwargs):
        super(FieldSerializer, self).__init__(*args, **kwargs)
        self.fields['agent'] = serializers.PrimaryKeyRelatedField(
            queryset=User.objects.all(), 
            required=False, 
            allow_null=True
        )

    def get_status(self, obj):
        # You can customize this logic! 
        # For now, it returns 'Completed' if harvested, otherwise 'Active'
        if obj.current_stage == 'Harvested':
            return 'Completed'
        # You could add logic here for 'At Risk' based on dates or notes
        return 'Active'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add is_staff to the JSON response body
        data['is_staff'] = self.user.is_staff
        return data