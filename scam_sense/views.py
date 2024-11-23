# make sure this view is only accessible on login
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView


class ScamSenseIndexView(TemplateView):
    # our hybrid template, shown above
    template_name = 'index.html'

class RegistrationView(TemplateView):
    # our hybrid template, shown above
    template_name = 'registration.html'

class DashboardView(TemplateView):
    # our hybrid template, shown above
    template_name = 'dashboard.html'