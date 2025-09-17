# College Recommender Model Training Script
# This script trains a model to recommend top N colleges based on user profile (score, grade, preferences)

import pandas as pd
from sklearn.neighbors import NearestNeighbors
import joblib
import os

csv_path = os.path.join(os.path.dirname(__file__), '../dataset/200_top_Engineering_Colleges_india.csv')
df = pd.read_csv(csv_path)

# Encode grade as numeric
from sklearn.preprocessing import LabelEncoder
le_grade = LabelEncoder()
df['grade_enc'] = le_grade.fit_transform(df['grade'].astype(str))

# Ensure all numeric columns are numeric
for col in ['total', 'TLR', 'RPC', 'go', 'oi', 'perc']:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

# Features for recommendation
features = ['total', 'grade_enc', 'TLR', 'RPC', 'go', 'oi', 'perc']
features = [col for col in features if col in df.columns]
X = df[features]

# Fit a NearestNeighbors model for content-based recommendation
model = NearestNeighbors(n_neighbors=10, metric='euclidean')
model.fit(X)

os.makedirs('models', exist_ok=True)
joblib.dump({'model': model, 'data': df, 'features': features}, 'models/college_recommender_model.pkl')
print('College recommender model trained and saved!')
