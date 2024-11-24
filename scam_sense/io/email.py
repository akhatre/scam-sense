import os
from google.cloud import secretmanager
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def get_secret(secret_name, project_id):
    """
    Retrieves the secret value from Google Cloud Secret Manager.
    """
    try:
        client = secretmanager.SecretManagerServiceClient()
        secret_path = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
        response = client.access_secret_version(request={"name": secret_path})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        print(f"Failed to retrieve secret '{secret_name}': {str(e)}")
        raise

def generate_random_from_email():
    """
    Generates a random sender email address.
    """
    import random
    random_name = ''.join(random.choices('legitimateBusiness', k=8))
    return f"{random_name}@scamsense.com"

def send_email(personalised_message, from_address, mail_address):
    """
    Sends an email using the SendGrid API.
    """
    try:
        # Retrieve the SendGrid API key from Google Cloud Secret Manager
        project_id = os.getenv("GCP_PROJECT_ID")  # Alhat ensure this is set in the environment
        secret_name = "SendGrid_API_Key"
        sendgrid_api_key = get_secret(secret_name, project_id)
        
        message = Mail(
            from_email=from_address,  # Should it be AI generated?
            to_emails=mail_address,
            subject='Important Notification',
            html_content=personalised_message 
        )
        
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        print(f"Email sent from {from_address} to {mail_address} with status code {response.status_code}")

    except Exception as e:
        print(f"Failed to send email to {mail_address}: {str(e)}")
