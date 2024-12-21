from langchain_community.llms import HuggingFacePipeline
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from huggingface_hub import login

login("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")

# Load Qwen2.5-Coder-3B-Instruct model
llama_model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-Coder-3B-Instruct", device_map="auto", max_memory={0: "3GB", "cpu": "30GB"}
)
llama_tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-Coder-3B-Instruct")
llama_pipeline = pipeline("text-generation", model=llama_model, tokenizer=llama_tokenizer, max_new_tokens=200)

# Load Starcoder2-3b model
starcoder_model = AutoModelForCausalLM.from_pretrained(
    "bigcode/starcoderbase", device_map="auto", max_memory={0: "3GB", "cpu": "30GB"}
)
starcoder_tokenizer = AutoTokenizer.from_pretrained("bigcode/starcoderbase")
starcoder_pipeline = pipeline("text-generation", model=starcoder_model, tokenizer=starcoder_tokenizer, max_new_tokens=200)

# Wrap with HuggingFacePipeline
inference_llm = HuggingFacePipeline(pipeline=llama_pipeline)
code_generation_llm = HuggingFacePipeline(pipeline=starcoder_pipeline)

# Prompts
inference_prompt = PromptTemplate(
    input_variables=["data"],
    template="Perform basic data analysis on the following data:\n{data}\nProvide insights and trends."
)
code_generation_prompt = PromptTemplate(
    input_variables=["request"],
    template="Write Python code to perform the following task:\n{request}\nEnsure the code is optimized and includes comments."
)

# Define Chains
inference_chain = LLMChain(llm=inference_llm, prompt=inference_prompt)
code_generation_chain = LLMChain(llm=code_generation_llm, prompt=code_generation_prompt)

# Test Inference Chain
test_data = "Sample data: [10, 20, 30, 40, 50]. Identify trends and provide insights."
inference_result = inference_chain.run(data=test_data)
print("Inference Result:\n", inference_result)

# Test Code Generation Chain
test_request = "Generate a function to calculate the mean of a list of numbers."
code_result = code_generation_chain.run(request=test_request)
print("Generated Code:\n", code_result)
