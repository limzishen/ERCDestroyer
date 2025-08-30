(See section 5 for detailed explanation)
### 1. Introduction
In this model, besides the normal transactions, we have implemented the XGBClassifier model in order to detect unusual transactions, which includes: 
- Structuring
- Cash Withdrawal
- Deposit-Send
- Smurfing
- Gather-Scatter
- Layered Fan Out
- Layered Fan In
- Scatter-Gather
- Cycle
- Bipartite
- Fan In
- Single Large
- Stacked Bipartite
- Fan Out

### 2. Sampling
The program takes in a csv file as input and takes a random sample of 100000 rows for efficiency. 
#### Data 

| Column                   | Description                                |
| ------------------------ | ------------------------------------------ |
| `Date`                   | Transaction date                           |
| `Time`                   | Transaction time                           |
| `Sender_account`         | Sender account ID                          |
| `Receiver_account`       | Receiver account ID                        |
| `Amount`                 | Transaction amount                         |
| `Payment_type`           | Payment method (e.g., Wire, Credit, etc.)  |
| `Payment_currency`       | Currency of transaction                    |
| `Received_currency`      | Currency received                          |
| `Sender_bank_location`   | Sender bank geographic location            |
| `Receiver_bank_location` | Receiver bank geographic location          |
| `Laundering_type`        | Type of suspicious activity                |
| `Is_laundering`          | Target variable (1: suspicious, 0: normal) |

### 3. Usage

1. **Load and preprocess data:**
```
import pandas as pd  df = pd.read_csv('SAML-D.csv')
```

2. **Run Exploratory Data Analysis (EDA)**
```
from ydata_profiling import ProfileReport profile = ProfileReport(df, title="AML Dataset Report") profile.to_notebook_iframe()
```

3. **Train XGBoost model**
```
from xgboost import XGBClassifier from sklearn.model_selection import GridSearchCV  xgb = XGBClassifier(eval_metric='logloss', random_state=42) grid_search.fit(X_train, y_train)
```
4. **Evaluate Model**
```
from sklearn.metrics import roc_auc_score, confusion_matrix  y_pred = best_model.predict_proba(X_test)[:, 1] roc_auc_score(y_test, y_pred)
```

### 4. Test Split 
In order to prevent overfitting, the dataset is split in to 80% training and 20% testing. 
`X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)`
### Results 

#### Sample results
```
Laundering_type
Normal_Small_Fan_Out      36663
Normal_Fan_Out            24172
Normal_Fan_In             22093
Normal_Group               5607
Normal_Cash_Withdrawal     3136
Normal_Cash_Deposits       2370
Normal_Periodical          2251
Normal_Plus_Mutual         1624
Normal_Mutual              1320
Normal_Foward               432
Normal_single_large         232
Structuring                  19
Cash_Withdrawal              12
Deposit-Send                 12
Smurfing                     10
Gather-Scatter                7
Layered_Fan_Out               7
Layered_Fan_In                7
Scatter-Gather                6
Cycle                         5
Bipartite                     4
Fan_In                        3
Single_large                  3
Behavioural_Change_2          2
Stacked Bipartite             1
Fan_Out                       1
Behavioural_Change_1          1
Name: count, dtype: int64
```

#### Identifying suspicious transactions
<img width="1031" height="547" alt="image" src="https://github.com/user-attachments/assets/cadfd027-da1f-415e-8389-215415ba0ff0" />

#### Alerts for internal analysis
<img width="1068" height="585" alt="image" src="https://github.com/user-attachments/assets/63a0e8c4-bf37-4edd-ab36-353005f341e5" />
<img width="1188" height="690" alt="image" src="https://github.com/user-attachments/assets/5aac24ca-d4ee-42cc-8784-64a8ae67a2b7" />

#### Performance evaluation (TPR)
In this sample, the classification threshold is adjusted to detect about 90% of unusual transactions. 

<img width="597" height="470" alt="image" src="https://github.com/user-attachments/assets/d18e5ea5-3ebe-45a8-8259-ab9ef1f05de4" />


### 5. Thinking Process: Design and Modeling Rationale
#### Data

##### Dataset Overview
- Ideally, the model would be trained on TikTok's Singapore transaction data for greater applicability. However, due to privacy constraints, we used an external dataset to simulate and demonstrate the model's potential.
- The data set contains transaction-level information: amounts, dates, sender/receiver banks, currencies, payment types, and labels indicating laundering-related transactions.  
- Exploratory Data Analysis(EDA) was conducted to understand distributions, trends, and anomalies.  

##### Feature Analysis
- **Numerical Features:** Transaction amounts, sender/receiver accounts, etc. Skewness examined; Box-Cox transformations considered for normalization.  
- **Categorical Features:** Payment types, currencies, bank locations, laundering types. Count plots and pie charts used to detect imbalances and outliers.  

##### Time-based Patterns
- Transactions aggregated **daily, weekly, and monthly** to detect unusual spikes or patterns.  
- Analysis for alerts across different payment types and bank locations was deployed to identify high risk segments. 

---
#### Handling Data Imbalance

- AML datasets are highly imbalanced due to rare laundering transactions.  
- Techniques like **SMOTE (Synthetic Minority Oversampling Technique)** is considered to create balanced training data and improve model sensitivity.  

---
#### Model Selection and evaluation

- **XGBoost Classifier** is chosen for:  
  - Handling non-linear relationships in transaction data.  
  - Automatic feature interaction detection.  
  - Ability to handle imbalanced datasets with class weighting or sampling.  
- **Hyperparameter Tuning:** Grid search applied for `max_depth` and `eta`.  
- **Evaluation Metrics:** ROC-AUC, True Positive Rate (TPR), False Positive Rate (FPR), and confusion matrices used to prioritize catching suspicious transactions while minimizing false alarms.  

---
#### Key Insights & Interpretations

- Laundering transaction amounts are significantly higher on average than normal transactions.  
- Certain payment types and sender/receiver locations are high-risk segments.  
- Skewed numerical distributions were normalized using Box-Cox transformations, to improve model stability and overall performance. 
