




# Use real college data to train a stream classifier (proxy: grade/ownership to stream)
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

csv_path = os.path.join(os.path.dirname(__file__), '../dataset/200_top_Engineering_Colleges_india.csv')
df = pd.read_csv(csv_path)

# We'll use 'grade', 'owner_ship', and 'total' as features, and assign a stream label based on grade/type
# This is a proxy; for real quiz data, replace this logic with actual quiz answers and stream labels
def assign_stream(row):
    if 'IIT' in row['name'] or 'NIT' in row['name']:
        return 'Science'
    elif 'Technology' in row['name'] or 'Engineering' in row['name']:
        return 'Science'
    elif row['owner_ship'] == 'Private':
        return 'Commerce'
    else:
        return 'Arts'

df['target_stream'] = df.apply(assign_stream, axis=1)

# Encode categorical features
from sklearn.preprocessing import LabelEncoder
le_grade = LabelEncoder()
le_owner = LabelEncoder()
df['grade_enc'] = le_grade.fit_transform(df['grade'].astype(str))
df['owner_enc'] = le_owner.fit_transform(df['owner_ship'].astype(str))

X = df[['grade_enc', 'owner_enc', 'total']]
y = df['target_stream']

model = RandomForestClassifier()
model.fit(X, y)

os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/quiz_stream_model.pkl')
print('Quiz stream model trained and saved with real data!')
