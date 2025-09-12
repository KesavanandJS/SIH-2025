import customtkinter as ctk
import pandas as pd
import os

# Load college dataset
def load_college_data():
    DATASET_PATH = os.path.join('dataset', '200_top_Engineering_Colleges_india.csv')
    return pd.read_csv(DATASET_PATH)

class CareerApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Career Path Finder & College Explorer")
        self.geometry("900x600")
        self.resizable(False, False)
        self.create_widgets()

    def create_widgets(self):
        self.sidebar = ctk.CTkFrame(self, width=200)
        self.sidebar.pack(side="left", fill="y")
        self.main_frame = ctk.CTkFrame(self)
        self.main_frame.pack(side="right", fill="both", expand=True)

        # Sidebar buttons
        self.btn_quiz = ctk.CTkButton(self.sidebar, text="Aptitude Quiz", command=self.show_quiz)
        self.btn_quiz.pack(pady=20, padx=20, fill="x")
        self.btn_career = ctk.CTkButton(self.sidebar, text="Course-to-Career Mapping", command=self.show_career_mapping)
        self.btn_career.pack(pady=20, padx=20, fill="x")
        self.btn_colleges = ctk.CTkButton(self.sidebar, text="Nearby Colleges", command=self.show_nearby_colleges)
        self.btn_colleges.pack(pady=20, padx=20, fill="x")
        self.btn_scholarship = ctk.CTkButton(self.sidebar, text="Scholarship & Cost Estimator", command=self.show_scholarship)
        self.btn_scholarship.pack(pady=20, padx=20, fill="x")
        self.btn_timeline = ctk.CTkButton(self.sidebar, text="Timeline Tracker", command=self.show_timeline)
        self.btn_timeline.pack(pady=20, padx=20, fill="x")

        self.show_welcome()

    def clear_main(self):
        for widget in self.main_frame.winfo_children():
            widget.destroy()

    def show_welcome(self):
        self.clear_main()
        label = ctk.CTkLabel(self.main_frame, text="Welcome to Career Path Finder!\nSelect a feature from the left.", font=("Arial", 22))
        label.pack(pady=100)

    def show_quiz(self):
        self.clear_main()
        label = ctk.CTkLabel(self.main_frame, text="Aptitude Quiz (Coming Soon)", font=("Arial", 18))
        label.pack(pady=50)

    def show_career_mapping(self):
        self.clear_main()
        label = ctk.CTkLabel(self.main_frame, text="Course-to-Career Mapping (Coming Soon)", font=("Arial", 18))
        label.pack(pady=50)

    def show_nearby_colleges(self):
        self.clear_main()
        label = ctk.CTkLabel(self.main_frame, text="Nearby Colleges (Coming Soon)", font=("Arial", 18))
        label.pack(pady=50)

    def show_scholarship(self):
        self.clear_main()
        label = ctk.CTkLabel(self.main_frame, text="Scholarship & Cost Estimator (Coming Soon)", font=("Arial", 18))
        label.pack(pady=50)

    def show_timeline(self):
        self.clear_main()
        label = ctk.CTkLabel(self.main_frame, text="Timeline Tracker (Coming Soon)", font=("Arial", 18))
        label.pack(pady=50)

if __name__ == "__main__":
    ctk.set_appearance_mode("light")
    app = CareerApp()
    app.mainloop()
