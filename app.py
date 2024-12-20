import os
import openai

client = openai.OpenAI(
    api_key="1f1abf74-1689-4422-bbd8-2aa4f05bd43b",
    base_url="https://api.sambanova.ai/v1",
)

response = client.chat.completions.create(
    model='Meta-Llama-3.1-8B-Instruct',
    # messages=[{"role":"system","content":"You are a data Scientist Instructor, You will instruct how to infer from a given data with its features given, you will be given the results so you will have to tell what you can infer"},{"role":"user","content":"Give me initial instructions on how to infer from a given data"}],
    messages=[{"role":"system","content":"You are a inference model who will help a data Scientist, You will instruct step by step how to infer from a given data, You will not write any code, you will just instruct and infer from the results, you will be given the results of the each step so you will have to tell what you can infer"},{"role":"user","content":"Give me initial instructions on how to infer from a given data"}],
    temperature =  0.1,
    top_p = 0.1
)

print(response.choices[0].message.content)