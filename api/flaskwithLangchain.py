from groq import Groq

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
    image_data = image_file.read()

# Prepare the messages
messages = [
    {
        "role": "system",
        "content": "You are an assistant that analyzes plots in images and provides insights."
    },
    {
        "role": "user",
        "content": "Analyze this plot and provide a summary of its key features.",
        "image": image_data  # Assuming the API accepts raw image data directly in the messages field
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
print(completion.choices[0].message["content"])
