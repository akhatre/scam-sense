from django.http import JsonResponse
from rest_framework import serializers
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from scam_sense.generation.email_personalisation import personalise_message
from scam_sense.generation.mistral import generate_spam_message

from typing import List

from scam_sense.io.email import send_email
from scam_sense.models import Student
from rest_framework.permissions import IsAuthenticated
from rest_framework.serializers import Serializer, CharField, ValidationError,IntegerField


class Subscriber:
    name: str
    surname: str
    email: str


def get_student_emails_from_db(subscriber_email):
    pass

def generate_random_email():
    pass


class SendMessage(viewsets.ModelViewSet):
    @extend_schema(
        parameters=[
            OpenApiParameter(name='subscriber_email',
                             required=True,
                             type=str),
        ],
        responses={200: None}
    )
    @action(detail=False, methods=['get'])
    def send(self, request):
        subscriber_email = request.query_params.get('subscriber_email')
        list_of_students: List[Subscriber] = get_student_emails_from_db(
            subscriber_email)  # return list of emails ['asd@gmail.com']
        new_spam_message = generate_spam_message()

        for _student in list_of_students:
            personalised_message = personalise_message(new_spam_message, _student)
            from_email = generate_random_email()
            send_email(personalised_message, from_email, _student)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'age',
            'first_name',
            'second_name',
            'language',
            'email',
        ]
        read_only_fields = fields


class GetStudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    @extend_schema(
        parameters=[
            OpenApiParameter(name='user_email',
                             required=True,
                             type=str),
        ],
        responses={200: StudentSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def get_students(self, request):
        user_email = request.query_params.get('user_email')
        results = self.queryset.filter(
            user__user_username=user_email
        ).order_by('first_name')

        serializer = self.get_serializer(results, many=True)

        return Response(serializer.data)


class AddStudentSerializer(Serializer):
    age = IntegerField(required=True)
    first_name = CharField(required=True)
    second_name = CharField(required=True)
    language = CharField(write_only=True, required=True)
    email = CharField(write_only=True, required=True)


class StudentsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=AddStudentSerializer,
        responses={
            200: {"type": "object", "properties": {"message": {"type": "string"}}},
            401: {"type": "object", "properties": {"message": {"type": "string"}}},
            400: {"type": "object", "additionalProperties": {"type": "string"}},
        },
    )
    @action(detail=False, methods=["post"])
    def add_student(self, request):

        serializer = AddStudentSerializer(data=request.data)

        current_user = request.user

        Student.object.create(
            user=current_user,
            first_name=request.data['first_name'],
            second_name=request.data['second_name'],
            age=request.data['age'],
            email=request.data['email'],
            native_language=request.data['native_language'],
        )

        return JsonResponse({'message': 'Login successful'})

    @extend_schema(
        parameters=[
            OpenApiParameter(name='user_email',
                             required=True,
                             type=str),
        ],
        responses={200: StudentSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def get_students(self, request):
        user_email = request.query_params.get('user_email')
        results = self.queryset.filter(
            user__user_username=user_email
        ).order_by('first_name')

        serializer = StudentSerializer(results, many=True)

        return Response(serializer.data)
