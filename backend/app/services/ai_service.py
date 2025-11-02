def generate_ai_response(topic: str, difficulty: str = "auto") -> str:
    """
    Mock AI service. Replace body with calls to real LLM provider later.
    This returns a structured explanation string expected by the frontend.
    """
    return (
        f"Mock AI response for topic: '{topic}'.\n\n"
        "1) Key idea: Summarize the central concept.\n"
        "2) Steps: Break down into teachable sub-steps.\n"
        "3) Example: Show a simple worked example.\n\n"
        "(To enable real AI, integrate OpenAI or other LLM in this function.)"
    )
