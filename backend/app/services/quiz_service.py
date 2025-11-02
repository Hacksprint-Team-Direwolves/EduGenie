def generate_quiz(topic: str):
    # demo generator
    return {
        "topic": topic,
        "questions": [
            {"q": f"What is the key idea of {topic}?", "options": ["A","B","C"], "answer": 0}
        ]
    }
