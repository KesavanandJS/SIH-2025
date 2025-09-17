




# Use real college data to train an admission chance regressor
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os


csv_path = os.path.join(os.path.dirname(__file__), '../dataset/200_top_Engineering_Colleges_india.csv')
df = pd.read_csv(csv_path)

# Encode grade as numeric
from sklearn.preprocessing import LabelEncoder
le_grade = LabelEncoder()
df['grade_enc'] = le_grade.fit_transform(df['grade'].astype(str))

# Ensure 'total' is numeric
df['total'] = pd.to_numeric(df['total'], errors='coerce').fillna(0)


# Use all available numeric features for prediction
numeric_cols = ['total', 'grade_enc']
for col in ['TLR', 'RPC', 'go', 'oi', 'perc']:
	if col in df.columns:
		df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
		numeric_cols.append(col)
X = df[numeric_cols]
# For target, use a more complex proxy: weighted sum of all features
df['chance'] = 0.25 * df['total'] + 0.15 * df['grade_enc'] + 0.15 * df.get('TLR', 0) + 0.15 * df.get('RPC', 0) + 0.15 * df.get('go', 0) + 0.075 * df.get('oi', 0) + 0.075 * df.get('perc', 0)
y = df['chance']

model = LinearRegression()
model.fit(X, y)

os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/admission_chance_model.pkl')
print('Admission chance model trained and saved with real data!')
