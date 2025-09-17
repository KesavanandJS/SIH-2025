





# Generate a synthetic quiz dataset for realistic stream prediction

import pandas as pd
from sklearn.ensemble import ExtraTreesClassifier
import joblib
import os
import numpy as np

# Quiz questions (7 as in your app)
questions = [
    "Do you enjoy solving math and science problems?",
    "Are you interested in business, finance, or economics?",
    "Do you like reading literature, history, or philosophy?",
    "Are you passionate about art, music, or design?",
    "Do you enjoy working with computers or technology?",
    "Are you interested in hands-on vocational skills (mechanic, electrician, etc.)?",
    "Do you like helping people (teaching, healthcare, social work)?"
]
streams = ["Science", "Commerce", "Arts", "Vocational"]


# Simulate 5000 quiz responses for more variety
np.random.seed(42)
data = []
for _ in range(5000):
    answers = np.random.choice([0, 1, 2], size=len(questions))  # 0=No, 1=Sometimes, 2=Yes
    # Assign stream based on a more nuanced logic
    stream_scores = {
        "Science": answers[0] + answers[4] + 0.5*answers[5],
        "Commerce": answers[1] + 0.5*answers[3],
        "Arts": answers[2] + answers[3] + answers[6],
        "Vocational": answers[5] + 0.5*answers[6]
    }
    # Add some noise for realism
    for k in stream_scores:
        stream_scores[k] += np.random.normal(0, 0.3)
    target_stream = max(stream_scores, key=stream_scores.get)
    data.append(list(answers) + [target_stream])
df = pd.DataFrame(data, columns=[f"Q{i+1}" for i in range(len(questions))] + ["target_stream"])


X = df[[f"Q{i+1}" for i in range(len(questions))]]
y = df["target_stream"]

model = ExtraTreesClassifier(n_estimators=200, random_state=42)
model.fit(X, y)

os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/quiz_stream_model.pkl')
print('Quiz stream model trained and saved with synthetic quiz data!')
