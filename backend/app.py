



from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
import pandas as pd
import os
from pymongo import MongoClient
import certifi
import joblib

app = Flask(__name__)
CORS(app)


# --- Utility: Preview J&K College Dataset Columns ---
@app.route('/api/colleges-jk/columns', methods=['GET'])
def colleges_jk_columns():
    jk_path = os.path.join(os.path.dirname(__file__), '../dataset/college_jk.xlsx')
    try:
        df = pd.read_excel(jk_path)
        columns = list(df.columns)
        sample = df.iloc[0].to_dict() if not df.empty else {}
        return jsonify({"columns": columns, "sample": sample})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# --- Jammu & Kashmir Colleges API ---
@app.route('/api/colleges-jk', methods=['GET'])
def colleges_jk():
    jk_path = os.path.join(os.path.dirname(__file__), '../dataset/college_jk.xlsx')
    try:
        df = pd.read_excel(jk_path)
        # Load KMeans model
        import joblib
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'college_jk_kmeans.pkl')
        if os.path.exists(model_path):
            from sklearn.preprocessing import LabelEncoder
            feature_cols = [
                'District', 'University Type', 'University Name', 'College Name', 'College Type', 'Address'
            ]
            # Encode features as in training
            for col in feature_cols:
                df[col] = df[col].astype(str)
                le = LabelEncoder()
                df[col + '_enc'] = le.fit_transform(df[col])
            X = df[[col + '_enc' for col in feature_cols]]
            kmeans = joblib.load(model_path)
            clusters = kmeans.predict(X)
            df['Cluster'] = clusters
            # Sort by cluster
            df = df.sort_values('Cluster')
        colleges = df.fillna('').to_dict(orient='records')
        return jsonify({"colleges": colleges, "count": len(colleges)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# MongoDB connection (update URI as needed)
MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017')
client = MongoClient(MONGO_URI)
db = client['career_app']
timeline_collection = db['timeline']
users_collection = db['users']

# --- Career Mapping API ---
@app.route('/api/career-mapping', methods=['GET'])
def api_career_mapping():
    stream = request.args.get('stream', 'Science')
    mapping = {
        "Science": [
            ["Science", "B.Tech/B.Sc"],
            ["B.Tech/B.Sc", "Engineer/Scientist"],
            ["Engineer/Scientist", "Avg Salary: ₹6-12LPA"]
        ],
        "Commerce": [
            ["Commerce", "B.Com/BBA"],
            ["B.Com/BBA", "Accountant/Manager"],
            ["Accountant/Manager", "Avg Salary: ₹4-8LPA"]
        ],
        "Arts": [
            ["Arts", "BA/Design"],
            ["BA/Design", "Teacher/Designer"],
            ["Teacher/Designer", "Avg Salary: ₹3-7LPA"]
        ],
        "Vocational": [
            ["Vocational", "Diploma/ITI"],
            ["Diploma/ITI", "Technician/Operator"],
            ["Technician/Operator", "Avg Salary: ₹2-5LPA"]
        ]
    }
    return jsonify({"stream": stream, "mapping": mapping.get(stream, [])})

# --- Study Materials API ---
@app.route('/api/study_materials', methods=['GET'])
def get_study_materials():
    # Example static resources; expand as needed
    materials = [
        {"title": "JEE Main Syllabus PDF", "type": "PDF", "url": "https://jeemain.nta.ac.in/images/syllabus.pdf"},
        {"title": "NPTEL Engineering Lectures", "type": "Video", "url": "https://nptel.ac.in/courses"},
        {"title": "NCERT Science Textbooks", "type": "Book", "url": "https://ncert.nic.in/textbook.php"},
        {"title": "Khan Academy Math", "type": "Online", "url": "https://www.khanacademy.org/math"}
    ]
    return jsonify(materials)

# --- Improved Scholarships API ---
@app.route('/api/scholarships', methods=['GET'])
def get_scholarships():
    # Example static scholarships; expand as needed
    scholarships = [
        {"name": "AICTE Pragati Scholarship", "amount": 50000, "eligibility": "Girls in technical education", "url": "https://www.aicte-india.org/schemes/students-development-schemes/Pragati"},
        {"name": "INSPIRE Scholarship", "amount": 80000, "eligibility": "Top 1% in 12th Science", "url": "https://online-inspire.gov.in/"},
        {"name": "Central Sector Scholarship", "amount": 20000, "eligibility": "Meritorious students from low-income families", "url": "https://scholarships.gov.in/"},
        {"name": "State Govt Scholarships", "amount": 30000, "eligibility": "State-specific, see portal", "url": "https://scholarships.gov.in/"}
    ]
    return jsonify(scholarships)

# Load college dataset
def load_college_data():
    DATASET_PATH = os.path.join(os.path.dirname(__file__), '../dataset/200_top_Engineering_Colleges_india.csv')
    return pd.read_csv(DATASET_PATH)

# --- AI/ML Model Loading (scaffold) ---
QUIZ_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'quiz_stream_model.pkl')
COLLEGE_REC_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'college_recommender.pkl')
ADMISSION_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'admission_chance_model.pkl')
quiz_model = joblib.load(QUIZ_MODEL_PATH) if os.path.exists(QUIZ_MODEL_PATH) else None
college_rec_model = joblib.load(COLLEGE_REC_MODEL_PATH) if os.path.exists(COLLEGE_REC_MODEL_PATH) else None
admission_model = joblib.load(ADMISSION_MODEL_PATH) if os.path.exists(ADMISSION_MODEL_PATH) else None

# --- Quiz Stream Prediction (AI/ML) ---
@app.route('/api/quiz', methods=['POST'])
def aptitude_quiz():
    data = request.json
    responses = data.get('responses', [])
    mapping = {'Yes': 2, 'Sometimes': 1, 'No': 0}
    features = [mapping.get(r, 0) for r in responses]
    print(f"[DEBUG] /api/quiz received features: {features} (len={len(features)})")
    if quiz_model:
        try:
            pred = quiz_model.predict([features])[0]
            # Optionally, get probabilities for all streams
            if hasattr(quiz_model, 'predict_proba'):
                proba = quiz_model.predict_proba([features])[0]
                stream_scores = {s: float(p) for s, p in zip(quiz_model.classes_, proba)}
            else:
                stream_scores = {pred: 1.0}
            return jsonify({"recommended": [pred], "scores": stream_scores})
        except Exception as e:
            print(f"[ERROR] Quiz model prediction failed: {e}")
            return jsonify({"error": str(e)}), 500
    # fallback: rule-based
    stream_scores = {"Science": 0, "Commerce": 0, "Arts": 0, "Vocational": 0}
    stream_map = [
        ("Science", 0), ("Commerce", 1), ("Arts", 2), ("Arts", 3), ("Science", 4), ("Vocational", 5), ("Science", 6), ("Arts", 6)
    ]
    for i, resp in enumerate(responses):
        score = 2 if resp == "Yes" else 1 if resp == "Sometimes" else 0
        for stream, qidx in stream_map:
            if i == qidx:
                stream_scores[stream] += score
    sorted_streams = sorted(stream_scores.items(), key=lambda x: -x[1])
    return jsonify({"recommended": [sorted_streams[0][0], sorted_streams[1][0]], "scores": stream_scores})

# --- College Recommendation (AI/ML placeholder) ---
@app.route('/api/recommend_colleges', methods=['POST'])
def recommend_colleges():
    data = request.json
    state = data.get('state')
    grade = data.get('grade')
    owner_type = data.get('type')
    stream = data.get('stream')
    df = load_college_data()
    df["state"] = df["name"].str.split(",").str[-1].str.strip()
    filtered = df.copy()
    if state and state != "All":
        filtered = filtered[filtered["state"].str.contains(state, case=False, na=False)]
    if grade and grade != "All":
        filtered = filtered[filtered["grade"].str.contains(grade, case=False, na=False)]
    if owner_type and owner_type != "All":
        filtered = filtered[filtered["owner_ship"].str.contains(owner_type, case=False, na=False)]
    # ML-based recommendation (content-based, placeholder)
    if college_rec_model and stream:
        # Example: recommend based on stream and features (customize as you train your model)
        # features = ...
        # rec_indices = college_rec_model.recommend(features)
        # result = df.iloc[rec_indices][...]
        pass  # TODO: implement real ML logic
    recommended = filtered.sort_values("total", ascending=False).head(5)
    result = recommended[["rank", "name", "owner_ship", "grade", "total"]].rename(columns={"name":"College Name", "owner_ship":"Type", "grade":"Grade", "total":"Score"}).to_dict(orient="records")
    return jsonify(result)

# --- Admission Chance Estimator (AI/ML) ---
@app.route('/api/admission_chance', methods=['POST'])
def admission_chance():
    data = request.json
    grade = data.get('grade', 'AAAAA')
    score = float(data.get('score', 90))
    if admission_model:
        grade_map = {'AAAAA': 5, 'AAAA': 4, 'AAA': 3, 'AA': 2, 'A': 1}
        features = [score, grade_map.get(grade, 3)]
        chance = float(admission_model.predict([features])[0])
        return jsonify({"chance_percent": round(chance, 2)})
    # fallback: heuristic
    chance = min(99, max(30, (score/100)*100 if grade == 'AAAAA' else (score/100)*80))
    return jsonify({"chance_percent": round(chance, 2)})

# --- Timeline Tracker API (MongoDB) ---
@app.route('/api/timeline', methods=['GET', 'POST'])
def timeline_tracker():
    if request.method == 'POST':
        data = request.get_json()
        event = data.get('event')
        date = data.get('date')
        if event and date:
            timeline_collection.insert_one({"event": event, "date": date})
            return jsonify({"status": "ok"})
        else:
            return jsonify({"error": "Missing event or date"}), 400
    # On GET, return all timeline events (default + user-added)
    default_events = [
        {"event": "JEE Main Registration", "date": "2025-11-01"},
        {"event": "JEE Main Exam", "date": "2026-01-15"},
        {"event": "Counseling Starts", "date": "2026-03-01"}
    ]
    db_events = list(timeline_collection.find({}, {'_id': 0}))
    return jsonify(default_events + db_events)


# Serve static HTML pages for each feature
@app.route("/colleges")
def colleges_page():
    return render_template_string("""
    <html><head><title>Nearby Colleges</title></head>
    <body>
    <h1>Nearby Colleges</h1>
    <div id='colleges-content'></div>
    <script src="/static/main.js"></script>
    </body></html>
    """)

@app.route("/quiz")
def quiz_page():
    return render_template_string("""
    <html><head><title>Aptitude Quiz</title></head>
    <body>
    <h1>Aptitude Quiz</h1>
    <div id='quiz-content'></div>
    <script src="/static/main.js"></script>
    </body></html>
    """)

@app.route("/career")
def career_page():
    return render_template_string("""
    <html><head><title>Career Mapping</title></head>
    <body>
    <h1>Career Mapping</h1>
    <div id='career-content'></div>
    <script src="/static/main.js"></script>
    </body></html>
    """)

@app.route("/scholarship")
def scholarship_page():
    return render_template_string("""
    <html><head><title>Scholarship Estimator</title></head>
    <body>
    <h1>Scholarship Estimator</h1>
    <div id='scholarship-content'></div>
    <script src="/static/main.js"></script>
    </body></html>
    """)

@app.route("/timeline")
def timeline_page():
    return render_template_string("""
    <html><head><title>Timeline Tracker</title></head>
    <body>
    <h1>Timeline Tracker</h1>
    <div id='timeline-content'></div>
    <script src="/static/main.js"></script>
    </body></html>
    """)

# Serve static files (JS, CSS) from frontend folder
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('../frontend', filename)

if __name__ == "__main__":
    app.run(debug=True)
