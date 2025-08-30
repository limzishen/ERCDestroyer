# Fraud Detection

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

### Test Split 
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

#### Performance evaluation (TPR)
In this sample, the classification threshold is adjusted to detect about 90% of unusual transactions. 

![[Pasted image 20250830191118.png]]

