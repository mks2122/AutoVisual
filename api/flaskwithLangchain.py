import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from flask import Flask, request, jsonify
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Initialize Flask app
app = Flask(__name__)

# Load OpenAI API Key for GPT-3.5 (you can switch to another free model if needed)
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"

# Initialize OpenAI model (using a lightweight free model like "gpt-3.5-turbo")
llm = OpenAI(model="gpt-3.5-turbo", temperature=0.5)

# Define the prompt template for data analysis
prompt_template = """
You are a data analyst. Given the following dataset summary, provide insights and generate validation tests that can be used to check the integrity of the data.

Dataset Summary:
{data_summary}

1. Provide a list of any noticeable trends, correlations, or anomalies in the data.
2. Generate unit tests or validation checks to ensure that the data is valid (e.g., no negative values, correct range, no missing data).
3. Suggest appropriate visualizations based on the data features.
"""

# Create LangChain LLMChain with the prompt
prompt = PromptTemplate(input_variables=["data_summary"], template=prompt_template)
chain = LLMChain(llm=llm, prompt=prompt)

# Route to analyze data
# @app.route('/analyze', methods=['POST'])
def analyze_data():
    # Get the uploaded file (CSV format)
    file = request.files['file']
    data = pd.read_csv(file)
    
    # Preprocess the data: Handle missing values, encoding, and scaling
    data = preprocess_data(data)

    # Generate basic summary statistics for the data
    summary = data.describe().to_dict()

    # Convert the summary to a human-readable format for the prompt
    data_summary = "\n".join([f"{key}: {value}" for key, value in summary.items()])

    # Get insights, tests, and plot suggestions from the LLM
    insights_and_tests = chain.run(data_summary)

    # Generate plots based on the data
    plots = generate_plots(data)

    return jsonify({
        'summary': summary,
        'insights_and_tests': insights_and_tests,
        'generated_plots': plots
    })

# Function to preprocess the data (handle missing values, encode categorical features, etc.)
def preprocess_data(data):
    # Handle missing values by filling with the mean or mode based on column type
    for column in data.columns:
        if data[column].dtype == 'object':  # Categorical columns
            data[column] = data[column].fillna(data[column].mode()[0])
        else:  # Numerical columns
            data[column] = data[column].fillna(data[column].mean())
    
    # Optional: Scale numerical features
    numerical_cols = data.select_dtypes(include=['float64', 'int64']).columns
    data[numerical_cols] = (data[numerical_cols] - data[numerical_cols].mean()) / data[numerical_cols].std()
    
    return data

# Function to generate plots based on the data
def generate_plots(data):
    plots = []
    
    # Generate a histogram for each numerical column
    for column in data.select_dtypes(include=['float64', 'int64']).columns:
        plt.figure(figsize=(6, 4))
        sns.histplot(data[column], kde=True)
        plt.title(f"Distribution of {column}")
        plot_path = f"static/{column}_histogram.png"
        plt.savefig(plot_path)
        plots.append(f"/static/{column}_histogram.png")
    
    # Generate a correlation heatmap if there are numerical columns
    if len(data.select_dtypes(include=['float64', 'int64']).columns) > 1:
        plt.figure(figsize=(8, 6))
        correlation_matrix = data.corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
        plt.title("Correlation Heatmap")
        plot_path = "static/correlation_heatmap.png"
        plt.savefig(plot_path)
        plots.append("/static/correlation_heatmap.png")
    
    return plots

if __name__ == '__main__':
    app.run(debug=True)
