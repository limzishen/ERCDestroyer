# ERCDestroyer
## How to run it
### Frontend 
Enter the tiktok clone directory
create a .env in the tiktok directory 
insert supabase URL and ANON key
```
npm i 
npm start
```

### Video Analyser 
create .env file under video_analysis directory 
insert your google api key 
install necessary library 
run it!! 

## Inspiration

Many creators face low visibility on TikTok and often feel discouraged after posting several videos that receive few views. We noticed that the current value-sharing system relies heavily on simple creator metrics, such as views and likes, which may not fully capture the value a creator generates.

We were inspired to enhance the value-sharing system by using AI to analyse and measure the value of content more holistically, ensuring that creators are rewarded fairly for the value they contribute.

## What it does

-  **Web Application:** A frontend dashboard that displays analytics and insights about a creator’s videos. The dashboard improves transparency in the value-sharing system by providing detailed information on how revenue is distributed and the sources of earnings.

- **AI Content Scoring System:** An AI model to evaluate videos for marketability, monetisability, and audience engagement.

- **Fraud Detection ML Model:** A machine learning system to detect fraudulent transactions in the reward system.
    

## How we built it

1. **Frontend:**    
    - Built with React and TypeScript.
    - Displays analytics, content insights, and engagement metrics in an intuitive dashboard.
    - Improve upon the 
        
2. **AI Content Scoring:**
    - Integrated a LLM for multidimensional content scoring using Google Gemini.
    - 
3. **Fraud Detection:** 
    - Implemented an XGBoost classifier to detect suspicious transactions.
    - Features used include transaction patterns, timestamps, and user behavioral metrics.
        
    
## Challenges we ran into

- Optimising the LLM to process inputs and generate outputs efficiently.
- Designing prompts to make the LLM produce accurate, relevant results. 
- Handling **high false positives** in the ML fraud detection model.
- Dealing with **inconsistent data sources** during model training.
- Optimising the ML model to efficiently process large volumes of transaction data.
## **Accomplishments We’re Proud Of**

- Developed a content scoring system that goes beyond simple engagement metrics to evaluate the true value of a creator’s work.
- Achieved high accuracy with the fraud detection system, effectively identifying suspicious transactions.
- Built a dashboard that allows creators to easily view insights and feel proud of their content and achievements.
## What we learned

- **Technical:** Learned how to integrate LLMs with web applications, use XGBoost for classification, and process high-dimensional video features.

- **Product Insight:** Understood the importance of multidimensional metrics beyond simple likes and views for creator value assessment.

- **Teamwork & Problem-Solving:** Coordinated AI and frontend development and overcame challenges in integrating models with the live dashboard.

## What's next for ERCDestroyer
- Improve the efficiency and speed of the content scoring system.
- Explore alternative ways to incentivize creators beyond monetary rewards.
- Implement a more robust peer-to-peer payment system.
- Develop an algorithm to determine whether a creator should receive a flat revenue rate or a higher revenue split, encouraging smaller creators to continue producing content.
