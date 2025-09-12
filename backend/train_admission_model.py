




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

# Use 'total' as score, 'grade_enc' as grade
X = df[['total', 'grade_enc']]
# For target, let's use a proxy: higher total and grade = higher chance (simulate as 70 + 0.2*total + 2*grade_enc)
df['chance'] = 70 + 0.2 * df['total'] + 2 * df['grade_enc']
y = df['chance']

model = LinearRegression()
model.fit(X, y)

os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/admission_chance_model.pkl')
print('Admission chance model trained and saved with real data!')
