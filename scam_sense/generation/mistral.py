import os
from google.cloud import secretmanager
import requests

def get_secret(secret_name: str, project_id: str) -> str: #Maybe just make its own class
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

def generate_spam_message():
    try:
        project_id = os.getenv("GCP_PROJECT_ID")
        if not project_id:
            logging.error("GCP_PROJECT_ID not found in environment variables")
            return "Important: Please check your email and click the button below to continue."
            
        secret_name = "Mistral_API_Key"
        mistral_api_key = get_secret(secret_name, project_id)
        
        url = "https://api.mistral.ai/v1/chat/completions"
        
        payload = {
            "model": "mistral-tiny",
            "messages": [
                {"role": "user", "content": "Generate a text asking an elderly user located in United Kingdom to follow the link in the button below. Make it sound important."}
            ],
            "max_tokens": 100
        }
        
        headers = {
            "Authorization": f"Bearer {mistral_api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        json_response = response.json()
        if "choices" not in json_response or not json_response["choices"]:
            logging.error("No choices found in Mistral API response")
            return "Important: Please check your email and click the button below to continue."
            
        return json_response["choices"][0]["message"]["content"]
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Mistral API request failed: {str(e)}")
        return "Important: Please check your email and click the button below to continue."
    except Exception as e:
        logging.error(f"Unexpected error in generate_spam_message: {str(e)}")
        return "Important: Please check your email and click the button below to continue."