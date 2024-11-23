from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.serializers import Serializer, CharField, ValidationError


class UserRegistrationSerializer(Serializer):
    first_name = CharField(required=True)
    last_name = CharField(required=True)
    email = CharField(required=True)
    password = CharField(write_only=True, required=True)
    confirm_password = CharField(write_only=True, required=True)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise ValidationError({"confirm_password": "Passwords do not match."})
        if User.objects.filter(username=data["email"]).exists():
            raise ValidationError({"email": "Email is already registered."})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
        )
        return user


class UserViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={
            201: {"type": "object", "properties": {"message": {"type": "string"}}},
            400: {"type": "object", "additionalProperties": {"type": "string"}},
        },
    )
    @action(detail=False, methods=["post"])
    def register(self, request):

        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
