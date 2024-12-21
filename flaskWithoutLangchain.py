import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt

import seaborn as sns
from flask import Flask, request, jsonify
from transformers import pipeline, AutoTokenizer

# Initialize Flask app
app = Flask(__name__)

# Load Hugging Face model and tokenizer
llm = pipeline("text-generation", model="distilgpt2")
tokenizer = AutoTokenizer.from_pretrained("distilgpt2")
tokenizer.pad_token = tokenizer.eos_token

# Function to count tokens in the input
def count_tokens(text):
    tokens = tokenizer(text, return_tensors="pt", truncation=False).input_ids
    return tokens.shape[-1]


# Function to generate insights and tests using the LLM
def generate_insights_and_tests(data_summary):
    prompt = f"""
    You are a data analyst.

    Dataset Summary:
    {data_summary[:1000]}...

    1. Provide a list of any noticeable trends, correlations, or anomalies in the data.
    2. Generate unit tests or validation checks to ensure that the data is valid (e.g., no negative values, correct range, no missing data).
    3. Suggest appropriate visualizations based on the data features.
    """



    token_count = count_tokens(prompt)
    print(f"Token count for the prompt: {token_count}")
    
    # Generate response
    response = llm(prompt, max_new_tokens=150, num_return_sequences=1)
    return response if response else "No response generated"

# Route to analyze data
@app.route('/analyze', methods=['POST','GET'])
def analyze_data():
    try:
        # Get the uploaded file (CSV format)
        # file = request.files['file']
        # if not file or not file.filename.endswith('.csv'):
        #     return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400
        
        # Read the CSV data
        data = pd.read_csv('Air_Traffic_Landings_Statistics.csv')
        
        # Preprocess the data: Handle missing values, encoding, and scaling
        data = preprocess_data(data)
        
        # Generate basic summary statistics for the data
        summary = data.describe(include='all').to_dict()
        
        # Convert the summary to a human-readable format for the prompt
        data_summary = "\n".join([f"{key}: {value}" for key, value in summary.items()])
        
        # Get insights, tests, and plot suggestions from the LLM
        insights_and_tests = generate_insights_and_tests(data_summary)
        
        # Generate plots based on the data
        plots = generate_plots(data)
        
        return {
            'summary': summary,
            'insights_and_tests': insights_and_tests,
            'generated_plots': plots
        }
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to preprocess the data (handle missing values, encode categorical features, etc.)
def preprocess_data(data):
    # Handle missing values
    for column in data.columns:
        if data[column].dtype == 'object':  # Categorical columns
            data[column] = data[column].fillna(data[column].mode()[0] if not data[column].mode().empty else '')
        else:  # Numerical columns
            # Ensure non-numeric strings are converted to NaN
            data[column] = pd.to_numeric(data[column], errors='coerce')
            data[column] = data[column].fillna(data[column].mean())

    # Optional: Scale numerical features
    numerical_cols = data.select_dtypes(include=['float64', 'int64']).columns
    if not numerical_cols.empty:
        data[numerical_cols] = (data[numerical_cols] - data[numerical_cols].mean()) / data[numerical_cols].std()

    return data


# Function to generate plots based on the data
def generate_plots(data):
    plots = []
    os.makedirs('static', exist_ok=True)  # Ensure the static directory exists

    # Filter only valid numerical columns
    numeric_data = data.select_dtypes(include=['float64', 'int64'])
    for column in numeric_data.columns:
        plt.figure(figsize=(6, 4))
        sns.histplot(numeric_data[column], kde=True)
        plt.title(f"Distribution of {column}")
        plot_path = f"static/{column}_histogram.png"
        plt.savefig(plot_path)
        plt.close()
        plots.append(f"/{plot_path}")

    # Generate a correlation heatmap if there are multiple numerical columns
    if len(numeric_data.columns) > 1:
        plt.figure(figsize=(8, 6))
        correlation_matrix = numeric_data.corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
        plt.title("Correlation Heatmap")
        plot_path = "static/correlation_heatmap.png"
        plt.savefig(plot_path)
        plt.close()
        plots.append(f"/{plot_path}")

    return plots

if __name__ == '__main__':
    app.run(debug=True)
    # with app.app_context():
    #     # Call analyze_data directly (for testing without running the server)
    #     print(analyze_data())
