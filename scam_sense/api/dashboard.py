from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from scam_sense.generation.email_personalisation import personalise_message
from scam_sense.generation.mistral import generate_spam_message

from typing import List

from scam_sense.io.email import send_email


class Subscriber:
    name: str
    surname: str
    email: str


def get_student_emails_from_db(subscriber_email):

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
        list_of_students: List[Subscriber] = get_student_emails_from_db(subscriber_email) # return list of emails ['asd@gmail.com']
        new_spam_message = generate_spam_message()

        for _student in list_of_students:
            personalised_message = personalise_message(new_spam_message, _student)
            send_email(personalised_message, _student)
