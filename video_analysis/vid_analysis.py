from google import genai
from dotenv import load_dotenv
import os
import time
import json

load_dotenv()

# Get API key from environment
API_KEY = os.environ.get("GOOGLE_API_KEY")

client = genai.Client(api_key=API_KEY)


def analyse(filename):
    filepath = f"./assets/videos/{filename}.mp4"
    print(f"Uploading file: {filepath}")
    
    # 1. Upload the file and get the File object.
    my_file = client.files.upload(file=filepath)
    print(f"File uploaded successfully with ID: {my_file.name}")

    # 2. Poll the file status until it is ACTIVE.
    while my_file.state.name != 'ACTIVE':
        print(f"File is not yet active. Current state: {my_file.state.name}. Waiting...")
        time.sleep(10)  # Wait for 10 seconds before polling again.
        print(my_file.name)
        my_file = client.files.get(name=my_file.name)  # Get the updated file status.
    
    print("File is now ACTIVE. Proceeding with analysis.")
    
    # 3. Use the ACTIVE file for content generation.
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            my_file,
            'Analyse the video and provide me the following information in json format,'\
            '[age demographic (provide age range only), target_demographic (create list of keyword), target country, is there explicit content? (yes or no), is there copyrighted content (yes or no), how much does it appeal to advertiser 1 - 10]'
        ]
    )
    raw_response_text = response.text

    try:
        # Clean the text by removing the markdown code block delimiters.
        # This handles cases where the model returns ```json...```
        cleaned_text = raw_response_text.strip().removeprefix('```json').removesuffix('```').strip()
        
        # Parse the cleaned string as JSON.
        json_data = json.loads(cleaned_text)
        return json_data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        # Print the problematic text for debugging purposes.
        print(f"The problematic text was: \n---\n{raw_response_text}\n---")
        return None


data = analyse("sample1")

if data:
    print(data)
    # You can now access the data like a dictionary
    print(f"Age Demographic: {data.get('age_demographic')}")
    print(f"Target Demographics: {', '.join(data.get('target_demographic', []))}")