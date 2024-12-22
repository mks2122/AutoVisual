from groq import Groq
import base64

# Initialize the client
client = Groq(
    # This is the default and can be omitted
    api_key="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",
)


# Path to your image
image_path = "E:\personalProjects\AutoVisual\public\static\Black Bet Win_histogram.png"

# Open the image in binary mode
with open(image_path, "rb") as image_file:
    # Read the image data
    image_data =  base64.b64encode(image_file.read()).decode("utf-8")

# Prepare the messages
messages = [
    {
        "role": "user",
        "content": [
            {"type": "text", "text": "What's in this image?"},
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image_data}",
                },
            },
        ],
    }
]

# API call for completion
completion = client.chat.completions.create(
    model="llama-3.2-90b-vision-preview",
    messages=messages,
    temperature=1,
    max_tokens=1024,
    top_p=1,
    stream=False,
    stop=None,
)

# Print the response
print(completion.choices[0].message.content)
