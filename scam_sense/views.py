# make sure this view is only accessible on login
import json

from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render, redirect
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView


class ScamSenseIndexView(TemplateView):
    # our hybrid template, shown above
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add the is_logged_in flag to the context
        context['is_logged_in'] = self.request.user.is_authenticated
        return context


class RegistrationView(TemplateView):
    # our hybrid template, shown above
    template_name = 'registration.html'
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add the is_logged_in flag to the context
        context['is_logged_in'] = self.request.user.is_authenticated
        return context


class DashboardView(LoginRequiredMixin, TemplateView):
    # our hybrid template, shown above
    template_name = 'dashboard.html'
    login_url = '/register'
    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add the is_logged_in flag to the context
        context['is_logged_in'] = self.request.user.is_authenticated
        return context



# class LoginView(TemplateView):
#     # our hybrid template, shown above
#     template_name = 'registration.html'
#     def get_context_data(self, **kwargs):
#         # Call the base implementation first to get a context
#         context = super().get_context_data(**kwargs)
#         # Add the is_logged_in flag to the context
#         context['is_logged_in'] = self.request.user.is_authenticated
#         return context
#
#     def post(self, request, *args, **kwargs):
#         params = json.loads(request.body)
#         username = params["email"]
#         password = params["password"]
#
#         user = authenticate(request, username=username, password=password)
#         # breakpoint()
#         if user is not None:
#             login(request, user)
#             # Redirect to a success page.
#             redirect('/dashboard')
#         else:
#             # Return an 'invalid login' error message.
#             redirect('/register')
