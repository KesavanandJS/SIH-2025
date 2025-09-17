
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.cluster import KMeans
import joblib
import os

# Load the J&K college dataset
DATA_PATH = os.path.join(os.path.dirname(__file__), '../dataset/college_jk.xlsx')
df = pd.read_excel(DATA_PATH)

# Select features for clustering
feature_cols = [
    'District', 'University Type', 'University Name', 'College Name', 'College Type', 'Address'
]

# Encode categorical features
for col in feature_cols:
    df[col] = df[col].astype(str)
    le = LabelEncoder()
    df[col + '_enc'] = le.fit_transform(df[col])

X = df[[col + '_enc' for col in feature_cols]]

# Train KMeans clustering model
n_clusters = 5  # You can adjust this number
kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
kmeans.fit(X)

# Save fitted model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'college_jk_kmeans.pkl')
joblib.dump(kmeans, MODEL_PATH)
print(f"KMeans model trained and saved to {MODEL_PATH}")

# Optionally print cluster counts
import numpy as np
print("Cluster counts:", np.bincount(kmeans.labels_))
