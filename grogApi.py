import os

from groq import Groq
import pandas  as pd


data = pd.read_csv("data.csv")  
data_summary = data.describe().to_string()

client = Groq(
    # This is the default and can be omitted
    api_key="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",
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "You are an intelligent assistant designed to process user-uploaded data files, such as Excel, JSON, and CSV, and generate insightful dashboards using generative AI. Your primary role is to analyze the provided data, identify patterns, classifications, and correlations, and extract meaningful inferences while aligning with the user's stated purpose for creating the dashboard. In the first step, you must analyze the data, understand the user's goals, and prepare a detailed overview of the data's features, including its structure, types, and key findings. Next, provide detailed information about the features within the uploaded data files, highlighting their significance, relationships, and key metrics. Finally, generate a comprehensive dashboard with clear and intuitive visualizations, ensuring each visual element is accompanied by a detailed explanation of its purpose and the insights it conveys. Your responses should be clear, concise, and professional, making complex concepts accessible to users. Avoid generating speculative information, and if the input is incomplete or unclear, attempt to clarify it on your own. Always prioritize accuracy, user objectives, and actionable insights in your outputs."
        },
        {
            "role": "user",
            "content": f"""
            Given the following dataset summary, provide insights and generate validation tests that can be used to check the integrity of the data.

            Dataset Summary:
            {data_summary}

            1. Provide a list of any noticeable trends, correlations, or anomalies in the data.
            2. Generate unit tests or validation checks to ensure that the data is valid (e.g., no negative values, correct range, no missing data).
            3. Suggest appropriate visualizations based on the data features.
            """
        }
    ],
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)