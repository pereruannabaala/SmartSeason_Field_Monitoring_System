from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter
from fields.views import FieldViewSet, MyTokenObtainPairView, agent_list
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

router = DefaultRouter()
router.register(r'fields', FieldViewSet, basename='field')

def welcome(request):
    return JsonResponse({"message": "SmartSeason API is running!"})

urlpatterns = [
    path('', welcome),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/', agent_list),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)