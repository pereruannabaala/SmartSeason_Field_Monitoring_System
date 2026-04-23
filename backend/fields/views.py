from rest_framework import viewsets, permissions  # <--- Make sure 'viewsets' is here!
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Field
from .serializers import FieldSerializer, MyTokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admin (Coordinator) role sees everything
        if user.is_staff:
            return Field.objects.all()
        # Field Agent role sees only their assigned fields
        return Field.objects.filter(agent=user)

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser]) # Only Admins can see the list of agents
def agent_list(request):
    agents = User.objects.filter(is_staff=False).values('id', 'username')
    return Response(list(agents))

def perform_create(self, serializer):
    if not serializer.is_valid():
        print(serializer.errors) # This will show you exactly which field is "Bad"
    serializer.save()
