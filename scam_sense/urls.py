"""
URL configuration for scam_sense project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from scam_sense.api.dashboard import StudentsViewSet
from scam_sense.views import ScamSenseIndexView, RegistrationView, DashboardView

from rest_framework.routers import DefaultRouter
from scam_sense.api.registration import UserViewSet


def custom_logout_view(request):
    logout(request)  # Logs out the user
    return redirect('/')  # Redirect to homepage or another page


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', ScamSenseIndexView.as_view(), name='ScamSenseIndexView'),
    path('register', RegistrationView.as_view(), name='RegistrationView'),
    path('logout', custom_logout_view, name='LogoutView'),
    path('dashboard', DashboardView.as_view(), name='DashboardView'),

    # OpenAPI schema generation endpoint
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional: Swagger UI for easy API browsing
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

router = DefaultRouter()
router.register("api/users", UserViewSet, basename="user")
router.register("api/students", StudentsViewSet, basename="students")

urlpatterns += router.urls
