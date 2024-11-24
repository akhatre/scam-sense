
def personalise_message(new_spam_message: str, student: Subscriber) -> str:
    #The mistrial ai request where it will generate it
     try:
        greeting = f"Dear {student.name} {student.surname}"
        personalized_message = f"{greeting}\n\n{new_spam_message}"
        return personalized_message
        
    except Exception as e:
        logging.error(f"Error personalizing message for {student.email}: {str(e)}")
        return new_spam_message

