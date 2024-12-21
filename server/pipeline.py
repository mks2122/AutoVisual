from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from huggingface_hub import login

# Log in to Hugging Face
login("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")

# Load Qwen2.5-Coder-3B-Instruct model for both inference and code generation
llama_model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-Coder-3B-Instruct", device_map="auto")
llama_tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-Coder-3B-Instruct")
llama_pipeline = pipeline("text-generation", model=llama_model, tokenizer=llama_tokenizer, max_new_tokens=200)

# Define a function for inference
def perform_inference(data):
    prompt = f"Perform basic data analysis on the following data:\n{data}\nProvide insights and trends."
    result = llama_pipeline(prompt)
    return result[0]["generated_text"]

# Define a function for code generation
def generate_code(request):
    prompt = f"Write Python code to perform the following task:\n{request}\nEnsure the code is optimized and includes comments."
    result = llama_pipeline(prompt)
    return result[0]["generated_text"]

# Test Inference
test_data = "Sample data: [10, 20, 30, 40, 50]. Identify trends and provide insights."
inference_result = perform_inference(test_data)
print("Inference Result:\n", inference_result)

# Test Code Generation
test_request = "Generate a function to calculate the mean of a list of numbers."
code_result = generate_code(test_request)
print("Generated Code:\n", code_result)
