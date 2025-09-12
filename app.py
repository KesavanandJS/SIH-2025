import streamlit as st
import pandas as pd
import os
import networkx as nx
import matplotlib.pyplot as plt

# Load college dataset
DATASET_PATH = os.path.join('dataset', '200_top_Engineering_Colleges_india.csv')
def load_college_data():
    return pd.read_csv(DATASET_PATH)

# Sidebar navigation
def main():
    st.set_page_config(page_title="Career Path Finder", layout="wide")
    st.title("Career Path Finder & College Explorer")
    menu = [
        "Aptitude Quiz",
        "Course-to-Career Mapping",
        "Nearby Colleges",
        "Scholarship & Cost Estimator",
        "Timeline Tracker"

    def main():
        import streamlit as st
        import pandas as pd
        import os
        import networkx as nx
        import matplotlib.pyplot as plt

        # Load college dataset
        DATASET_PATH = os.path.join('dataset', '200_top_Engineering_Colleges_india.csv')
        def load_college_data():
            return pd.read_csv(DATASET_PATH)

        # Sidebar navigation
        def show_quiz():
            st.header("Aptitude Quiz")
            st.write("Answer the following questions to discover your best-fit stream!")

            questions = [
                ("Do you enjoy solving math and science problems?", ["Yes", "No", "Sometimes"]),
                ("Are you interested in business, finance, or economics?", ["Yes", "No", "Sometimes"]),
                ("Do you like reading literature, history, or philosophy?", ["Yes", "No", "Sometimes"]),
                ("Are you passionate about art, music, or design?", ["Yes", "No", "Sometimes"]),
                ("Do you enjoy working with computers or technology?", ["Yes", "No", "Sometimes"]),
                ("Are you interested in hands-on vocational skills (mechanic, electrician, etc.)?", ["Yes", "No", "Sometimes"]),
                ("Do you like helping people (teaching, healthcare, social work)?", ["Yes", "No", "Sometimes"]),
            ]

            # Stream mapping: Science, Commerce, Arts, Vocational
            stream_scores = {"Science": 0, "Commerce": 0, "Arts": 0, "Vocational": 0}
            stream_map = [
                ("Science", 0),
                ("Commerce", 1),
                ("Arts", 2),
                ("Arts", 3),
                ("Science", 4),
                ("Vocational", 5),
                ("Science", 6),
                ("Arts", 6),
            ]

            responses = []
            with st.form("quiz_form"):
                for idx, (q, opts) in enumerate(questions):
                    resp = st.radio(q, opts, key=f"q{idx}")
                    responses.append(resp)
                submitted = st.form_submit_button("Submit Quiz")

            if submitted:
                # Scoring: Yes=2, Sometimes=1, No=0
                for i, resp in enumerate(responses):
                    score = 2 if resp == "Yes" else 1 if resp == "Sometimes" else 0
                    # Some questions map to multiple streams
                    for stream, qidx in stream_map:
                        if i == qidx:
                            stream_scores[stream] += score
                # Recommend top 2 streams
                sorted_streams = sorted(stream_scores.items(), key=lambda x: -x[1])
                top1, top2 = sorted_streams[0][0], sorted_streams[1][0]

                st.markdown(f"### 🎉 Your Recommended Streams:")
                c1, c2 = st.columns(2)
                with c1:
                    st.markdown(f"<div style='background-color:#e0f7fa;padding:16px;border-radius:10px;text-align:center;font-size:1.3em;'><b>{top1}</b></div>", unsafe_allow_html=True)
                with c2:
                    st.markdown(f"<div style='background-color:#ffe0b2;padding:16px;border-radius:10px;text-align:center;font-size:1.3em;'><b>{top2}</b></div>", unsafe_allow_html=True)

                st.markdown("---")
                st.markdown("#### Stream Scores:")
                for stream, score in sorted_streams:
                    st.progress(score, text=f"{stream}: {score}")

        def show_career_mapping():
            st.header("Course-to-Career Mapping")
            st.write("Select a stream to view possible degree programs and career paths.")

            # Example mapping (should be loaded from dataset in a real app)
            stream_options = ["Science", "Commerce", "Arts", "Vocational"]
            stream = st.selectbox("Choose your stream", stream_options)

            # Example data for demo
            mapping = {
                "Science": [
                    ("Science", "B.Tech/B.Sc"),
                    ("B.Tech/B.Sc", "Engineer/Scientist"),
                    ("Engineer/Scientist", "Avg Salary: ₹6-12LPA")
                ],
                "Commerce": [
                    ("Commerce", "B.Com/BBA"),
                    ("B.Com/BBA", "Accountant/Manager"),
                    ("Accountant/Manager", "Avg Salary: ₹4-8LPA")
                ],
                "Arts": [
                    ("Arts", "BA/Design"),
                    ("BA/Design", "Teacher/Designer"),
                    ("Teacher/Designer", "Avg Salary: ₹3-7LPA")
                ],
                "Vocational": [
                    ("Vocational", "Diploma/ITI"),
                    ("Diploma/ITI", "Technician/Operator"),
                    ("Technician/Operator", "Avg Salary: ₹2-5LPA")
                ]
            }

            # Draw career path graph
            G = nx.DiGraph()
            G.add_edges_from(mapping[stream])
            fig, ax = plt.subplots(figsize=(5,3))
            pos = nx.spring_layout(G, seed=42)
            nx.draw(G, pos, with_labels=True, node_color='#90caf9', node_size=2000, font_size=10, font_weight='bold', ax=ax, arrows=True)
            st.pyplot(fig)

            # Show table of options
            st.markdown("#### Example Career Options")
            if stream == "Science":
                st.table({
                    "Degree": ["B.Tech", "B.Sc"],
                    "Career": ["Engineer", "Scientist"],
                    "Avg Salary": ["₹8LPA", "₹10LPA"]
                })
            elif stream == "Commerce":
                st.table({
                    "Degree": ["B.Com", "BBA"],
                    "Career": ["Accountant", "Manager"],
                    "Avg Salary": ["₹5LPA", "₹7LPA"]
                })
            elif stream == "Arts":
                st.table({
                    "Degree": ["BA", "Design"],
                    "Career": ["Teacher", "Designer"],
                    "Avg Salary": ["₹4LPA", "₹6LPA"]
                })
            else:
                st.table({
                    "Degree": ["Diploma", "ITI"],
                    "Career": ["Technician", "Operator"],
                    "Avg Salary": ["₹3LPA", "₹4LPA"]
                })

        def show_nearby_colleges():
            st.header("Nearby Colleges")
            st.write("Find top engineering colleges near you. Filter by state or search by name.")

            # Load data
            df = load_college_data()

            # Extract state from college name (simple heuristic: last word after comma)
            df["state"] = df["name"].str.split(",").str[-1].str.strip()
            states = sorted(df["state"].unique())
            state = st.selectbox("Select State (optional)", ["All"] + states)
            search = st.text_input("Search by College Name (optional)")

            filtered = df.copy()
            if state != "All":
                filtered = filtered[filtered["state"] == state]
            if search:
                filtered = filtered[filtered["name"].str.contains(search, case=False, na=False)]

            st.markdown(f"#### Showing {len(filtered)} colleges")
            st.dataframe(filtered[["rank", "name", "owner_ship", "grade", "total"]].rename(columns={"name":"College Name", "owner_ship":"Type", "grade":"Grade", "total":"Score"}), use_container_width=True)

        def show_scholarship_estimator():
            st.header("Scholarship & Cost Estimator")
            st.info("(Coming soon) Calculate your net cost after scholarships.")

        def show_timeline_tracker():
            st.header("Timeline Tracker")
            st.info("(Coming soon) Track important admission and exam dates.")

        st.set_page_config(page_title="Career Path Finder", layout="wide")
        st.title("Career Path Finder & College Explorer")
        menu = [
            "Aptitude Quiz",
            "Course-to-Career Mapping",
            "Nearby Colleges",
            "Scholarship & Cost Estimator",
            "Timeline Tracker"
        ]
        choice = st.sidebar.selectbox("Navigate", menu)
    
        if choice == "Aptitude Quiz":
            show_quiz()
        elif choice == "Course-to-Career Mapping":
            show_career_mapping()
        elif choice == "Nearby Colleges":
            show_nearby_colleges()
        elif choice == "Scholarship & Cost Estimator":
            show_scholarship_estimator()
        elif choice == "Timeline Tracker":
            show_timeline_tracker()
