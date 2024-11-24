
def personalise_message(new_spam_message: str, student) -> str:
    greeting = f"Dear {student.name} {student.surname}"
    personalized_message = f"{greeting}\n\n{new_spam_message}"
    return personalized_message