import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model=os.getenv("MODEL_NAME", "gemini-flash-lite-latest"),
    temperature=0,
    max_retries=1,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)
