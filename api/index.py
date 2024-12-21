import os
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Initialize Groq client
client = Groq(
    api_key="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",
)

# Function to generate insights and tests using the Groq API
def generate_insights_and_tests(data_summary):
    messages = [
        {
            "role": "system",
            "content": """You are a data analyst assistant designed to process user-uploaded files. the user will upload the data and they will describe there purpose of the creating the visualization of what they want and it is optional. With the goal of extracting insights and generating visualization . Your role is to analyze the data, identify patterns, classifications, and correlations, and extract meaningful insights.now i will give u the workflow of the process

                    1.Give a detailed discription of the data and what the data is used for

                    2.Provide a list of any noticeable trends, correlations, or anomalies in the data.

                    3.Provide real-world applications for the provided data, with which model to use. Do not give me the code

                    4.give the visualization for the data and a clear discription of each visualization that is what you can infer from each of the visualization

                    5. Give me the analysis of each variables in the data and what you can infer from each of the variables
                    
                    Give as much Insights as you can, your work is to make the user understand the data faster and easier and clearer
                    
                    """
        },
        {
            "role": "user",
            "content": f"""
            Given the following dataset summary, provide insights of the data.

            Dataset Summary:
            {data_summary}

            Purpose:
            {purpose}

            1. Provide a list of any noticeable trends, correlations, or anomalies in the data.
            2. Generate unit tests or validation checks to ensure that the data is valid (e.g., no negative values, correct range, no missing data).
            3. Suggest appropriate visualizations based on the data features.
            """
        }
    ]

    chat_completion = client.chat.completions.create(
        messages=messages,
        model="llama-3.1-70b-versatile",
    )
    print(chat_completion.choices)
    return chat_completion.choices[0].message.content if chat_completion.choices else "No response generated"
    return messages[1]["content"]


def process_summary(summary):
    processed_summary = {}
    for key, value_dict in summary.items():
        processed_summary[key] = {
            k: int(v)
            for k, v in value_dict.items()
            if pd.api.types.is_number(v) and not pd.isna(v)
        }
    return processed_summary

# Route to analyze data
@app.route('/api/analyze', methods=['POST','GET'])
def analyze_data():
    
    try:
        # Get the uploaded file (CSV format)
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Get the 'purpose' field from the form
        purpose = request.form.get('purpose')

        if not purpose:
            return jsonify({"error": "Purpose is required"}), 400
        print("doneee : ", file,purpose)
        # if not file or not file.filename.endswith('.csv'):
        #     return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400

        # Read the CSV data
        data = pd.read_csv(file)

        # Preprocess the data: Handle missing values, encoding, and scaling
        data = preprocess_data(data)

        # Generate basic summary statistics for the data
        summary = process_summary(data.describe(include='all').to_dict())

        # Convert the summary to a human-readable format for the prompt
        # data_summary = "\n".join([f"{key}: {value}" for key, value in summary.items()])

        # Get insights, tests, and plot suggestions from the Groq API
        insights_and_tests = generate_insights_and_tests(data_summary)
        # print("doneee")

        # insights_and_tests="ahdfasd"

        # Generate plots based on the data
        plots = generate_plots(data)

        return jsonify({
            'summary': summary,
            'insights_and_tests': insights_and_tests,
            'generated_plots': plots
        })
    except Exception as e:
        print("error : ", e)
        return jsonify({"error": str(e)}), 500

# Function to preprocess the data (handle missing values, encode categorical features, etc.)
def preprocess_data(data):
    # Handle missing values by filling with the mean or mode based on column type
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
