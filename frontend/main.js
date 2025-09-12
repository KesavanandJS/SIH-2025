// --- College Recommendation ---
function renderCollegeRecommendationUI() {
    const container = document.getElementById('colleges-content');
    container.innerHTML = `
        <h3>Find Best Government Colleges for You</h3>
        <form id="recommend-form" style="display:flex;flex-wrap:wrap;gap:0.7rem;align-items:flex-end;">
            <input id="rec-state" placeholder="State (optional)" />
            <input id="rec-grade" placeholder="Grade (e.g. AAAAA, AAAA, etc.) (optional)" />
            <input id="rec-type" placeholder="Type (Public/Government or Private) (optional)" />
            <input id="rec-stream" placeholder="Stream (optional)" />
            <input id="rec-pincode" placeholder="Pin Code (optional)" style="width:120px;" />
            <button type="button" id="geo-btn" style="background:#b89b5e;color:#fff;">Use My Location</button>
            <button type="submit">Recommend Colleges</button>
        </form>
        <div id="recommend-result"></div>
        <hr>
        <h3>Search All Colleges</h3>
        <input id="colleges-search" placeholder="Search by college name..." />
        <input id="colleges-state" placeholder="State (optional)" />
        <button id="colleges-search-btn">Search</button>
        <div id="colleges-table"></div>
        <div id="colleges-map-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(33,33,33,0.25);z-index:1000;align-items:center;justify-content:center;">
            <div style='background:#fff;padding:2rem 2.5rem;border-radius:14px;max-width:700px;box-shadow:0 4px 24px rgba(33,150,243,0.13);position:relative;'>
                <span id='colleges-map-close' style='position:absolute;top:10px;right:18px;cursor:pointer;font-size:1.5rem;'>&times;</span>
                <div id='colleges-map-body'>Map loading...</div>
            </div>
        </div>
    `;
    document.getElementById('recommend-form').onsubmit = function(e) {
        e.preventDefault();
        const state = document.getElementById('rec-state').value;
        const grade = document.getElementById('rec-grade').value;
        const type = document.getElementById('rec-type').value;
        const stream = document.getElementById('rec-stream').value;
        const pincode = document.getElementById('rec-pincode').value;
        // For now, pincode/geolocation is not used in backend, but UI is ready
        fetch('http://localhost:5000/api/recommend_colleges', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state, grade, type, stream, pincode })
        })
        .then(res => res.json())
        .then(data => {
            let html = '<div style="display:flex;flex-wrap:wrap;gap:1.2rem;">';
            data.forEach(row => {
                html += `<div class='card' style='min-width:270px;max-width:320px;background:#fff8ee;border:1px solid #e9dec7;'>
                    <div style='font-weight:700;font-size:1.1rem;margin-bottom:0.3rem;'>${row['College Name']}</div>
                    <div style='margin-bottom:0.2rem;'><b>Rank:</b> ${row.rank} | <b>Type:</b> ${row.Type}</div>
                    <div style='margin-bottom:0.2rem;'><b>Grade:</b> ${row.Grade} | <b>Score:</b> ${row.Score}</div>
                    <div style='margin-bottom:0.2rem;'><b>Degree Programs:</b> <span style='color:#b89b5e;'>[Coming Soon]</span></div>
                    <div style='margin-bottom:0.2rem;'><b>Facilities:</b> <span style='color:#b89b5e;'>[Hostel, Lab, Library, Internet]</span></div>
                    <div style='margin-bottom:0.2rem;'><b>Cut-offs/Eligibility:</b> <span style='color:#b89b5e;'>[Coming Soon]</span></div>
                    <button class='map-btn' data-name='${row['College Name']}' style='background:#b89b5e;color:#fff;margin-top:0.5rem;'>View on Map</button>
                </div>`;
            });
            html += '</div>';
            document.getElementById('recommend-result').innerHTML = html;

            // Map button event
            document.querySelectorAll('.map-btn').forEach(btn => {
                btn.onclick = function() {
                    document.getElementById('colleges-map-modal').style.display = 'flex';
                    const name = btn.getAttribute('data-name');
                    // For demo, use Google Maps search
                    document.getElementById('colleges-map-body').innerHTML = `<iframe width='600' height='400' style='border:0' loading='lazy' allowfullscreen src='https://www.google.com/maps?q=${encodeURIComponent(name)}&output=embed'></iframe>`;
                };
            });
            document.getElementById('colleges-map-close').onclick = function() {
                document.getElementById('colleges-map-modal').style.display = 'none';
            };
            // Close modal on click outside
            document.getElementById('colleges-map-modal').onclick = function(e) {
                if (e.target === this) this.style.display = 'none';
            };
        })
        .catch(() => { document.getElementById('recommend-result').innerHTML = '<div style="color:#d32f2f;">Failed to load recommendations.</div>'; });
    };
    // Geolocation button
    document.getElementById('geo-btn').onclick = function(e) {
        e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(pos) {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                alert('Your location: ' + lat + ', ' + lng + '\n(This will be used for nearby college search in a future update.)');
            }, function() {
                alert('Could not get your location.');
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };
    // Search button
    document.getElementById('colleges-search-btn').onclick = function(e) {
        e.preventDefault();
        fetchColleges();
    };
}


function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'colleges') {
        renderCollegesUI();
    } else if (sectionId === 'quiz') {
        renderQuizUI();
    } else if (sectionId === 'career') {
        renderCareerUI();
    } else if (sectionId === 'scholarship') {
        renderScholarshipUI();
    } else if (sectionId === 'timeline') {
        renderTimelineUI();
    } else if (sectionId === 'study-materials') {
        renderStudyMaterials();
    } else if (sectionId === 'scholarships') {
        renderScholarships();
    } else if (sectionId === 'profile') {
        renderProfileSection();
    }
}

// --- Colleges ---
function fetchColleges() {
    const state = document.getElementById('colleges-state')?.value || '';
    const search = document.getElementById('colleges-search')?.value || '';
    let url = `http://localhost:5000/api/colleges?state=${encodeURIComponent(state)}&search=${encodeURIComponent(search)}`;
    const container = document.getElementById('colleges-table');
    container.innerHTML = '<div class="loading">Loading colleges...</div>';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.length) {
                container.innerHTML = '<div>No colleges found.</div>';
                return;
            }
            const table = document.createElement('table');
            table.innerHTML = `<tr><th>Rank</th><th>College Name</th><th>Type</th><th>Grade</th><th>Score</th></tr>`;
            data.forEach(row => {
                table.innerHTML += `<tr><td>${row.rank}</td><td>${row['College Name']}</td><td>${row.Type}</td><td>${row.Grade}</td><td>${row.Score}</td></tr>`;
            });
            container.innerHTML = '';
            container.appendChild(table);
        })
        .catch(() => { container.innerHTML = '<div style="color:#d32f2f;">Failed to load colleges.</div>'; });
}

function renderCollegesUI() {
    renderCollegeRecommendationUI();
    // Show default list of colleges (top 10) on section load
    const container = document.getElementById('colleges-table');
    container.innerHTML = '<div class="loading">Loading colleges...</div>';
    fetch('http://localhost:5000/api/colleges?state=&search=')
        .then(res => res.json())
        .then(data => {
            if (!data.length) {
                container.innerHTML = '<div>No colleges found.</div>';
                return;
            }
            const table = document.createElement('table');
            table.innerHTML = `<tr><th>Rank</th><th>College Name</th><th>Type</th><th>Grade</th><th>Score</th></tr>`;
            data.slice(0, 10).forEach(row => {
                table.innerHTML += `<tr><td>${row.rank}</td><td>${row['College Name']}</td><td>${row.Type}</td><td>${row.Grade}</td><td>${row.Score}</td></tr>`;
            });
            container.innerHTML = '';
            container.appendChild(table);
        })
        .catch(() => { container.innerHTML = '<div style="color:#d32f2f;">Failed to load colleges.</div>'; });
}
// --- Admission Chance Estimator ---
function renderAdmissionChanceUI() {
    const container = document.getElementById('scholarship-content');
    container.innerHTML = `
        <form id="chance-form">
            <label>College Grade: <input id="chance-grade" value="AAAAA" required></label><br><br>
            <label>College Score: <input id="chance-score" type="number" value="90" required></label><br><br>
            <button type="submit">Estimate Admission Chance</button>
        </form>
        <div id="chance-result"></div>
        <hr>
        <div id="scholarship-form-container"></div>
    `;
    document.getElementById('chance-form').onsubmit = function(e) {
        e.preventDefault();
        const grade = document.getElementById('chance-grade').value;
        const score = document.getElementById('chance-score').value;
        const resultDiv = document.getElementById('chance-result');
        resultDiv.innerHTML = '<span class="loading">Calculating...</span>';
        fetch('http://localhost:5000/api/admission_chance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grade, score })
        })
        .then(res => res.json())
        .then(data => {
            if (data.chance_percent !== undefined) {
                resultDiv.innerHTML = `<b>Estimated Admission Chance:</b> ${data.chance_percent}%`;
            } else {
                resultDiv.innerHTML = '<span style="color:#d32f2f;">Could not estimate chance. Please check your input.</span>';
            }
        })
        .catch(() => {
            resultDiv.innerHTML = '<span style="color:#d32f2f;">Failed to estimate admission chance.</span>';
        });
    };
    // Render scholarship estimator below
    renderScholarshipForm();
}

function renderScholarshipForm() {
    const container = document.getElementById('scholarship-form-container');
    container.innerHTML = `
        <form id="scholarship-form">
            <label>Tuition Fee: <input type="number" id="fee" value="100000" required></label><br><br>
            <label>Scholarship Amount: <input type="number" id="scholarship" value="20000" required></label><br><br>
            <button type="submit">Calculate Net Cost</button>
        </form>
        <div id="scholarship-result"></div>
    `;
    document.getElementById('scholarship-form').onsubmit = function(e) {
        e.preventDefault();
        const fee = document.getElementById('fee').value;
        const scholarship = document.getElementById('scholarship').value;
        fetch('http://localhost:5000/api/scholarship', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fee, scholarship })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById('scholarship-result').innerHTML =
                `<b>Net Cost:</b> ₹${data.net_cost} <br>(Fee: ₹${data.fee}, Scholarship: ₹${data.scholarship})`;
        });
    };
}


// --- Aptitude Quiz (Enhanced) ---
function renderQuizUI() {
    const container = document.getElementById('quiz-content');
    const questions = [
        "Do you enjoy solving math and science problems?",
        "Are you interested in business, finance, or economics?",
        "Do you like reading literature, history, or philosophy?",
        "Are you passionate about art, music, or design?",
        "Do you enjoy working with computers or technology?",
        "Are you interested in hands-on vocational skills (mechanic, electrician, etc.)?",
        "Do you like helping people (teaching, healthcare, social work)?",
        "Do you prefer practical work over theory?",
        "Are you interested in law, politics, or social sciences?",
        "Do you enjoy organizing events or leading teams?",
        "Are you interested in learning new languages?",
        "Do you want to start your own business someday?",
        "Do you like working outdoors or with nature?",
        "Are you interested in healthcare or medicine?",
        "Do you enjoy creative writing, journalism, or media?",
        "Are you interested in computers, coding, or IT?",
        "Do you want a job in government service?",
        "Do you want to work in the private sector?",
        "Are you interested in research or higher studies?"
    ];
    const options = ["Yes", "No", "Sometimes"];

    let current = 0;
    let responses = Array(questions.length).fill(null);

    function renderQuestion(idx) {
        let html = `<div style="margin-bottom:1.5rem;">
            <div style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem;">Question ${idx+1} of ${questions.length}</div>
            <div class='quiz-progress'><div class='quiz-bar' style='width:${((idx+1)/questions.length)*100}%;'></div></div>
            <div style="margin:1.2rem 0 0.7rem 0;font-size:1.15rem;">${questions[idx]}</div>`;
        options.forEach(opt => {
            html += `<label style='margin-right:1.5rem;'><input type="radio" name="quizopt" value="${opt}" ${responses[idx]===opt?'checked':''}> ${opt}</label>`;
        });
        html += '</div>';
        html += `<div style='display:flex;gap:1rem;'>`;
        if(idx>0) html += `<button id='quiz-prev' type='button'>Previous</button>`;
        if(idx<questions.length-1) html += `<button id='quiz-next' type='button'>Next</button>`;
        else html += `<button id='quiz-submit' type='button'>Submit Quiz</button>`;
        html += `</div>`;
        html += `<div id='quiz-error' style='color:#d32f2f;margin-top:0.7rem;'></div>`;
        container.innerHTML = html;

        if(document.getElementById('quiz-prev'))
            document.getElementById('quiz-prev').onclick = () => { current--; renderQuestion(current); };
        if(document.getElementById('quiz-next'))
            document.getElementById('quiz-next').onclick = () => {
                const val = document.querySelector('input[name="quizopt"]:checked');
                if(!val) {
                    document.getElementById('quiz-error').textContent = 'Please select an option.'; return;
                }
                responses[idx] = val.value;
                current++;
                renderQuestion(current);
            };
        if(document.getElementById('quiz-submit'))
            document.getElementById('quiz-submit').onclick = () => {
                const val = document.querySelector('input[name="quizopt"]:checked');
                if(!val) {
                    document.getElementById('quiz-error').textContent = 'Please select an option.'; return;
                }
                responses[idx] = val.value;
                submitQuiz();
            };
    }


    function submitQuiz() {
        container.innerHTML = `<div style='text-align:center;font-size:1.1rem;'>Submitting...</div>`;
        fetch('http://localhost:5000/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responses })
        })
        .then(res => res.json())
        .then(data => {
            let html = `<div class='card' style='max-width:700px;margin:2rem auto 0 auto;text-align:center;'>`;
            html += `<h3 style='color:#b89b5e;'>🎉 Your Recommended Streams</h3>`;
            html += `<div style='display:flex;justify-content:center;gap:1.5rem;margin:1.2rem 0;'>`;
            data.recommended.forEach((s,i) => {
                html += `<div style='background:${i===0?'#f5ecd7':'#fff8ee'};color:#6d4c1b;padding:1.1rem 2.2rem;border-radius:12px;font-size:1.2rem;font-weight:600;'>${s}</div>`;
            });
            html += `</div>`;
            html += `<div style='margin:1.2rem 0 0.5rem 0;font-weight:500;'>Stream Scores</div>`;
            html += `<div style='display:flex;justify-content:center;gap:1.2rem;'>`;
            Object.entries(data.scores).forEach(([stream,score]) => {
                html += `<div style='background:#f5ecd7;padding:0.7rem 1.2rem;border-radius:8px;font-size:1rem;color:#6d4c1b;'>${stream}: <b>${score}</b></div>`;
            });
            html += `</div>`;
            // Stream comparison table
            html += `<div style='margin:2rem 0 0.5rem 0;font-weight:600;'>Compare Streams & Careers</div>`;
            html += `<div style='overflow-x:auto;'><table style='margin:0 auto;min-width:600px;background:#fff8ee;'>`;
            html += `<tr style='background:#e9dec7;color:#6d4c1b;'><th>Stream</th><th>Popular Degrees</th><th>Example Careers</th><th>Govt. Exams/Jobs</th><th>Private Sector</th></tr>`;
            const streamData = {
                'Science': {
                    degrees: 'B.Sc., B.Tech, MBBS, BDS, B.Pharm',
                    careers: 'Engineer, Doctor, Scientist, Pharmacist, Researcher',
                    govt: 'NEET, JEE, UPSC, SSC, State PSC, DRDO',
                    private: 'IT, Healthcare, R&D, Pharma, EdTech'
                },
                'Commerce': {
                    degrees: 'B.Com, BBA, CA, CS, BMS',
                    careers: 'Accountant, Banker, CA, Business Analyst, Manager',
                    govt: 'Bank PO, SSC, UPSC, State PSC, RBI',
                    private: 'Finance, Banking, Business, Retail, Startups'
                },
                'Arts': {
                    degrees: 'B.A., BFA, BSW, LLB, BJMC',
                    careers: 'Teacher, Lawyer, Journalist, Designer, Social Worker',
                    govt: 'UPSC, SSC, State PSC, Teaching, Law',
                    private: 'Media, Design, NGOs, Content, HR'
                },
                'Vocational': {
                    degrees: 'Diploma, ITI, B.Voc, Skill Cert.',
                    careers: 'Technician, Electrician, Chef, Paramedic, Entrepreneur',
                    govt: 'Skill India, SSC, Railways, State PSC',
                    private: 'Hospitality, Healthcare, Trades, Startups'
                }
            };
            Object.entries(streamData).forEach(([stream,info]) => {
                html += `<tr><td><b>${stream}</b></td><td>${info.degrees}</td><td>${info.careers}</td><td>${info.govt}</td><td>${info.private}</td></tr>`;
            });
            html += `</table></div>`;

            // --- Predictive Suggestions ---
            const topStream = data.recommended[0];
            html += `<hr style='margin:2rem 0;'>`;
            html += `<div style='text-align:left;'>
                <h4 style='color:#1976d2;margin-bottom:0.7rem;'>🎯 Top College Recommendations</h4>
                <div id='quiz-college-recs'>Loading...</div>
                <h4 style='color:#1976d2;margin-bottom:0.7rem;margin-top:2rem;'>🎓 Suggested Degree Programs</h4>
                <div id='quiz-degree-recs'></div>
                <h4 style='color:#1976d2;margin-bottom:0.7rem;margin-top:2rem;'>💼 Career Suggestions</h4>
                <div id='quiz-career-recs'></div>
            </div>`;
            html += `<div style='margin-top:2.5rem;text-align:center;'>
                <h4 style='color:#388e3c;'>Next Steps</h4>
                <a href='#' onclick="showSection('colleges')" style='margin:0 1.2rem;color:#1976d2;font-weight:600;'>Explore Colleges</a>
                <a href='#' onclick="showSection('career')" style='margin:0 1.2rem;color:#1976d2;font-weight:600;'>See Career Mapping</a>
                <a href='#' onclick="showSection('scholarship')" style='margin:0 1.2rem;color:#1976d2;font-weight:600;'>Estimate Costs</a>
            </div>`;
            html += `<button style='margin-top:2rem;' onclick='renderQuizUI()'>Retake Quiz</button>`;
            html += `</div>`;
            container.innerHTML = html;

            // Fetch college recommendations from backend
            fetch('http://localhost:5000/api/recommend_colleges', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stream: topStream })
            })
            .then(res => res.json())
            .then(colleges => {
                let cHtml = '<table><tr><th>Rank</th><th>College Name</th><th>Type</th><th>Grade</th><th>Score</th></tr>';
                colleges.forEach(row => {
                    cHtml += `<tr><td>${row.rank}</td><td>${row['College Name']}</td><td>${row.Type}</td><td>${row.Grade}</td><td>${row.Score}</td></tr>`;
                });
                cHtml += '</table>';
                document.getElementById('quiz-college-recs').innerHTML = cHtml;
            });

            // Degree and career suggestions (static for demo, can be dynamic)
            const degreeMap = {
                'Science': ['B.Tech', 'B.Sc', 'BCA'],
                'Commerce': ['B.Com', 'BBA', 'CA'],
                'Arts': ['BA', 'BFA', 'Design'],
                'Vocational': ['Diploma', 'ITI', 'Polytechnic']
            };
            const careerMap = {
                'Science': ['Engineer', 'Scientist', 'Software Developer'],
                'Commerce': ['Accountant', 'Manager', 'Banker'],
                'Arts': ['Teacher', 'Designer', 'Journalist'],
                'Vocational': ['Technician', 'Operator', 'Supervisor']
            };
            document.getElementById('quiz-degree-recs').innerHTML = degreeMap[topStream] ? degreeMap[topStream].map(d=>`<span style='background:#e3f2fd;color:#1976d2;padding:0.5rem 1rem;border-radius:8px;margin-right:0.7rem;display:inline-block;margin-bottom:0.5rem;'>${d}</span>`).join('') : '';
            document.getElementById('quiz-career-recs').innerHTML = careerMap[topStream] ? careerMap[topStream].map(c=>`<span style='background:#fce4ec;color:#d81b60;padding:0.5rem 1rem;border-radius:8px;margin-right:0.7rem;display:inline-block;margin-bottom:0.5rem;'>${c}</span>`).join('') : '';
        });
    }

    // Add progress bar CSS if not present
    if(!document.getElementById('quiz-progress-style')) {
        const style = document.createElement('style');
        style.id = 'quiz-progress-style';
        style.innerHTML = `.quiz-progress{background:#e3f2fd;height:10px;border-radius:6px;overflow:hidden;margin-bottom:1.2rem;}
        .quiz-bar{background:#1976d2;height:100%;transition:width 0.3s;}`;
        document.head.appendChild(style);
    }

    renderQuestion(current);
}



// --- Career Mapping (Enhanced) ---
function renderCareerUI() {
    const container = document.getElementById('career-content');
    const streams = ["Science", "Commerce", "Arts", "Vocational"];
    const degreeMap = {
        'Science': ['B.Tech', 'B.Sc', 'BCA'],
        'Commerce': ['B.Com', 'BBA', 'CA'],
        'Arts': ['BA', 'BFA', 'Design'],
        'Vocational': ['Diploma', 'ITI', 'Polytechnic']
    };
    let html = `<form id='career-form' style='margin-bottom:1.5rem;'>
        <label style='margin-right:1.2rem;'>Stream:
            <select id="career-stream">${streams.map(s=>`<option value="${s}">${s}</option>`).join('')}</select>
        </label>
        <label>Degree:
            <select id="career-degree"></select>
        </label>
        <button type='submit'>Show Career Map</button>
    </form>`;
    html += `<div id='career-path'></div>`;
    html += `<div id='career-colleges'></div>`;
    html += `<div id='career-modal' style='display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(33,33,33,0.25);z-index:1000;align-items:center;justify-content:center;'>
        <div id='career-modal-content' style='background:#fff;padding:2rem 2.5rem;border-radius:14px;max-width:400px;box-shadow:0 4px 24px rgba(33,150,243,0.13);position:relative;'>
            <span id='career-modal-close' style='position:absolute;top:10px;right:18px;cursor:pointer;font-size:1.5rem;'>&times;</span>
            <div id='career-modal-body'></div>
        </div>
    </div>`;
    container.innerHTML = html;

    // Degree dropdown update
    function updateDegreeDropdown() {
        const stream = document.getElementById('career-stream').value;
        const degreeSel = document.getElementById('career-degree');
        degreeSel.innerHTML = degreeMap[stream].map(d=>`<option value="${d}">${d}</option>`).join('');
    }
    document.getElementById('career-stream').onchange = updateDegreeDropdown;
    updateDegreeDropdown();

    document.getElementById('career-form').onsubmit = function(e) {
        e.preventDefault();
        const stream = document.getElementById('career-stream').value;
        const degree = document.getElementById('career-degree').value;
        fetchCareerPath(stream, degree);
        fetchTopColleges(stream, degree);
    };

    // Modal close
    document.getElementById('career-modal-close').onclick = function() {
        document.getElementById('career-modal').style.display = 'none';
    };
}

function fetchCareerPath(stream, degree) {
    fetch(`http://localhost:5000/api/career?stream=${encodeURIComponent(stream)}`)
        .then(res => res.json())
        .then(data => {
            let html = `<div style='margin:1.5rem 0;'>
                <div style='font-size:1.1rem;font-weight:600;margin-bottom:0.7rem;'>Career Path (Visual Map)</div>`;
            html += `<div id='career-flowchart' style='display:flex;flex-direction:column;align-items:center;gap:1.2rem;margin-bottom:1.5rem;'>`;
            data.filter(row=>row.degree===degree).forEach((row, idx) => {
                html += `<div style='display:flex;align-items:center;gap:1.2rem;'>
                    <div style='background:#f5ecd7;color:#6d4c1b;padding:0.7rem 1.2rem;border-radius:8px;font-weight:600;'>${stream}</div>
                    <span style='font-size:1.3rem;'>→</span>
                    <div style='background:#fff8ee;color:#b89b5e;padding:0.7rem 1.2rem;border-radius:8px;font-weight:600;'>${degree}</div>
                    <span style='font-size:1.3rem;'>→</span>
                    <div class='career-click' data-career='${row.career}' data-salary='${row.avg_salary}' data-govt='${row.govt_exams||''}' data-private='${row.private_jobs||''}' data-entre='${row.entrepreneurship||''}' data-higher='${row.higher_studies||''}' style='background:#f7f9fb;color:#1976d2;padding:0.7rem 1.2rem;border-radius:8px;font-weight:600;cursor:pointer;'>${row.career}</div>
                    <span style='font-size:1.3rem;'>→</span>
                    <div style='background:#e9dec7;color:#388e3c;padding:0.7rem 1.2rem;border-radius:8px;font-weight:600;'>${row.avg_salary}</div>
                </div>`;
                if(idx < data.filter(row=>row.degree===degree).length-1) {
                    html += `<div style='height:18px;width:2px;background:#b89b5e;margin:0.2rem 0;'></div>`;
                }
            });
            html += `</div>`;
            html += `<button id='download-career-map' style='margin-bottom:1.2rem;background:#b89b5e;color:#fff;'>Download/Print Career Map</button>`;
            html += `<div style='font-size:0.95rem;color:#888;margin-top:0.7rem;'>Click a career for more info (govt exams, private jobs, entrepreneurship, higher studies).</div>`;
            html += `</div>`;
            document.getElementById('career-path').innerHTML = html;

            // Add click event for career details
            document.querySelectorAll('.career-click').forEach(el => {
                el.onclick = function() {
                    const career = el.getAttribute('data-career');
                    const salary = el.getAttribute('data-salary');
                    const govt = el.getAttribute('data-govt');
                    const priv = el.getAttribute('data-private');
                    const entre = el.getAttribute('data-entre');
                    const higher = el.getAttribute('data-higher');
                    showCareerModalFull(career, salary, govt, priv, entre, higher);
                };
            });
            // Download/print button
            document.getElementById('download-career-map').onclick = function() {
                const printContents = document.getElementById('career-flowchart').outerHTML;
                const win = window.open('', '', 'height=700,width=900');
                win.document.write('<html><head><title>Career Map</title>');
                win.document.write('<style>body{font-family:sans-serif;background:#f5ecd7;}div{margin:0.5rem;} .career-click{background:#f7f9fb;color:#1976d2;padding:0.7rem 1.2rem;border-radius:8px;font-weight:600;}</style>');
                win.document.write('</head><body >');
                win.document.write(printContents);
                win.document.write('</body></html>');
                win.document.close();
                win.print();
            };
        });
// Show modal with all career details
function showCareerModalFull(career, salary, govt, priv, entre, higher) {
    const modal = document.getElementById('career-modal');
    const body = document.getElementById('career-modal-body');
    let html = `<h3 style='color:#b89b5e;margin-bottom:0.7rem;'>${career}</h3>`;
    html += `<div style='margin-bottom:0.5rem;'><b>Average Salary:</b> ${salary}</div>`;
    if(govt) html += `<div style='margin-bottom:0.5rem;'><b>Govt. Exams/Jobs:</b> ${govt}</div>`;
    if(priv) html += `<div style='margin-bottom:0.5rem;'><b>Private Sector:</b> ${priv}</div>`;
    if(entre) html += `<div style='margin-bottom:0.5rem;'><b>Entrepreneurship:</b> ${entre}</div>`;
    if(higher) html += `<div style='margin-bottom:0.5rem;'><b>Higher Studies:</b> ${higher}</div>`;
    html += `<div style='margin-top:1rem;font-size:0.95rem;color:#888;'>Explore more about this career online or with your teachers/counselors.</div>`;
    body.innerHTML = html;
    modal.style.display = 'flex';
}
}

function fetchTopColleges(stream, degree) {
    // For demo, just filter by stream (degree info not in dataset)
    fetch('http://localhost:5000/api/recommend_colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream })
    })
    .then(res => res.json())
    .then(colleges => {
        let html = `<div style='margin:2rem 0 0.5rem 0;font-weight:600;color:#1976d2;'>Top Colleges for ${stream}</div>`;
        html += '<table><tr><th>Rank</th><th>College Name</th><th>Type</th><th>Grade</th><th>Score</th></tr>';
        colleges.forEach(row => {
            html += `<tr><td>${row.rank}</td><td>${row['College Name']}</td><td>${row.Type}</td><td>${row.Grade}</td><td>${row.Score}</td></tr>`;
        });
        html += '</table>';
        document.getElementById('career-colleges').innerHTML = html;
    });
}


function showCareerModal(career, salary) {
    // Example static details; in real app, fetch from backend or DB
    const details = {
        'Engineer': {
            desc: 'Engineers design, build, and maintain systems and structures.',
            skills: ['Problem-solving', 'Technical knowledge', 'Teamwork'],
            courses: [
                {name:'Coursera: Engineering Project Management', url:'https://www.coursera.org/specializations/engineering-project-management'},
                {name:'Udemy: Complete Engineering Mechanics', url:'https://www.udemy.com/course/engineering-mechanics/'},
            ],
            trend: 'High demand, especially in tech and infrastructure.',
            related: ['Software Developer', 'Technician']
        },
        'Scientist': {
            desc: 'Scientists conduct research and experiments to advance knowledge.',
            skills: ['Analytical thinking', 'Research', 'Communication'],
            courses: [
                {name:'Coursera: Data Science', url:'https://www.coursera.org/specializations/jhu-data-science'},
                {name:'edX: Scientific Research', url:'https://www.edx.org/learn/scientific-research'}
            ],
            trend: 'Growing in biotech, pharma, and data science.',
            related: ['Engineer', 'Teacher']
        },
        'Software Developer': {
            desc: 'Develops software applications and systems.',
            skills: ['Coding', 'Logic', 'Creativity'],
            courses: [
                {name:'Coursera: Python for Everybody', url:'https://www.coursera.org/specializations/python'},
                {name:'Udemy: The Complete JavaScript Course', url:'https://www.udemy.com/course/the-complete-javascript-course/'}
            ],
            trend: 'Very high demand globally.',
            related: ['Engineer', 'Designer']
        },
        'Accountant': {
            desc: 'Manages financial records and audits.',
            skills: ['Math', 'Attention to detail', 'Business sense'],
            courses: [
                {name:'Coursera: Financial Accounting', url:'https://www.coursera.org/learn/wharton-accounting'},
                {name:'Udemy: Accounting & Bookkeeping', url:'https://www.udemy.com/course/accounting-bookkeeping/'},
            ],
            trend: 'Stable demand in all sectors.',
            related: ['Manager', 'Banker']
        },
        'Manager': {
            desc: 'Leads teams and projects.',
            skills: ['Leadership', 'Organization', 'Communication'],
            courses: [
                {name:'Coursera: Strategic Leadership', url:'https://www.coursera.org/specializations/strategic-leadership'},
                {name:'Udemy: Management Skills', url:'https://www.udemy.com/course/management-skills/'},
            ],
            trend: 'Consistent demand in all industries.',
            related: ['Accountant', 'Supervisor']
        },
        'Banker': {
            desc: 'Works in financial institutions.',
            skills: ['Finance', 'Customer service', 'Analysis'],
            courses: [
                {name:'Coursera: Financial Markets', url:'https://www.coursera.org/learn/financial-markets-global'},
                {name:'Udemy: Banking Credit Analysis', url:'https://www.udemy.com/course/banking-credit-analysis/'},
            ],
            trend: 'Good demand in urban areas.',
            related: ['Accountant', 'Manager']
        },
        'Teacher': {
            desc: 'Educates students in various subjects.',
            skills: ['Communication', 'Patience', 'Subject expertise'],
            courses: [
                {name:'Coursera: Teaching Skills', url:'https://www.coursera.org/specializations/teaching-skills'},
                {name:'Udemy: Teaching Online', url:'https://www.udemy.com/course/teaching-online/'},
            ],
            trend: 'Steady demand, especially in STEM.',
            related: ['Scientist', 'Journalist']
        },
        'Designer': {
            desc: 'Creates visual concepts and designs.',
            skills: ['Creativity', 'Design tools', 'Attention to detail'],
            courses: [
                {name:'Coursera: Graphic Design', url:'https://www.coursera.org/specializations/graphic-design'},
                {name:'Udemy: UI/UX Design', url:'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/'},
            ],
            trend: 'High demand in digital and media.',
            related: ['Software Developer', 'Journalist']
        },
        'Journalist': {
            desc: 'Reports news and stories.',
            skills: ['Writing', 'Research', 'Curiosity'],
            courses: [
                {name:'Coursera: Journalism', url:'https://www.coursera.org/specializations/journalism-modern-age'},
                {name:'Udemy: Journalism Skills', url:'https://www.udemy.com/course/journalism-skills/'},
            ],
            trend: 'Competitive, but digital journalism is growing.',
            related: ['Teacher', 'Designer']
        },
        'Technician': {
            desc: 'Operates and repairs equipment.',
            skills: ['Technical skills', 'Troubleshooting'],
            courses: [
                {name:'Coursera: Industrial Automation', url:'https://www.coursera.org/learn/industrial-automation'},
                {name:'Udemy: Electrical Technician', url:'https://www.udemy.com/course/electrical-technician/'},
            ],
            trend: 'Good demand in manufacturing.',
            related: ['Engineer', 'Operator']
        },
        'Operator': {
            desc: 'Runs machinery or processes.',
            skills: ['Attention to detail', 'Safety awareness'],
            courses: [
                {name:'Coursera: Manufacturing Process', url:'https://www.coursera.org/learn/manufacturing-processes'}
            ],
            trend: 'Stable demand in industry.',
            related: ['Technician', 'Supervisor']
        },
        'Supervisor': {
            desc: 'Oversees teams and operations.',
            skills: ['Leadership', 'Organization'],
            courses: [
                {name:'Coursera: Team Management', url:'https://www.coursera.org/learn/team-management'},
            ],
            trend: 'Needed in all sectors.',
            related: ['Manager', 'Operator']
        }
    };
    const d = details[career];
    let html = `<div style='display:flex;flex-direction:column;gap:1.1rem;'>`;
    html += `<div style='border-bottom:1px solid #e0e0e0;padding-bottom:0.7rem;'>
        <h3 style='color:#1976d2;margin:0 0 0.3rem 0;'>${career}</h3>
        <div style='color:#444;font-size:1.05rem;'>${d ? d.desc : 'No details available.'}</div>
        <div style='color:#388e3c;font-weight:600;margin-top:0.5rem;'>Avg. Salary: <span style="font-weight:700;">${salary}</span></div>
    </div>`;
    if(d) {
        html += `<div style='display:flex;flex-direction:column;gap:0.5rem;'>
            <div><b>Key Skills:</b><div style='margin-top:0.3rem;display:flex;flex-wrap:wrap;gap:0.5rem;'>${d.skills.map(s=>`<span style='background:#e3f2fd;color:#1976d2;padding:0.3rem 0.7rem;border-radius:6px;'>${s}</span>`).join('')}</div></div>
            <div><b>Online Courses:</b><div style='margin-top:0.3rem;display:flex;flex-direction:column;gap:0.2rem;'>${d.courses.map(c=>`<a href='${c.url}' target='_blank' style='color:#1976d2;text-decoration:underline;'>${c.name}</a>`).join('')}</div></div>
            <div><b>Job Market:</b> <span style='color:#d81b60;'>${d.trend}</span></div>
            <div><b>Related Careers:</b><div style='margin-top:0.3rem;display:flex;flex-wrap:wrap;gap:0.5rem;'>${d.related.map(r=>`<span style='background:#fce4ec;color:#d81b60;padding:0.3rem 0.7rem;border-radius:6px;'>${r}</span>`).join('')}</div></div>
        </div>`;
    }
    html += `<div id='career-jobs' style='margin:0.7rem 0;'></div>`;
    html += `<div style='border-top:1px solid #e0e0e0;padding-top:0.7rem;display:flex;flex-direction:column;gap:0.7rem;'>
        <div><b>Your Notes:</b><textarea id='career-note' rows='3' style='width:100%;border-radius:6px;border:1px solid #bdbdbd;padding:0.5rem;margin-top:0.3rem;'></textarea></div>
        <div style='display:flex;align-items:center;gap:1rem;'><button id='save-note' style='margin-top:0.1rem;'>Save Note</button><span id='note-status' style='color:#388e3c;'></span></div>
        <button id='download-career-map' style='background:#388e3c;margin-top:0.2rem;'>Download Career Map (PDF)</button>
    </div>`;
    html += `</div>`;
    document.getElementById('career-modal-body').innerHTML = html;
    document.getElementById('career-modal').style.display = 'flex';

    // Fetch real-time job data
    fetch(`http://localhost:5000/api/job_data?career=${encodeURIComponent(career)}`)
        .then(res => res.json())
        .then(data => {
            let jobsHtml = `<b>Real-time Jobs:</b><ul style='padding-left:1.2rem;'>`;
            data.jobs.forEach(job => {
                jobsHtml += `<li><a href='${job.url}' target='_blank' style='color:#1976d2;'>${job.title}</a> <span style='color:#888;'>(${job.location}, ${job.salary})</span></li>`;
            });
            jobsHtml += '</ul>';
            document.getElementById('career-jobs').innerHTML = jobsHtml;
        });

    // Load user note
    fetch(`http://localhost:5000/api/notes?career=${encodeURIComponent(career)}&user=default`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('career-note').value = data.note || '';
        });
    // Save note
    document.getElementById('save-note').onclick = function() {
        const note = document.getElementById('career-note').value;
        fetch(`http://localhost:5000/api/notes?career=${encodeURIComponent(career)}&user=default`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note })
        })
        .then(res => res.json())
        .then(() => {
            document.getElementById('note-status').textContent = 'Saved!';
            setTimeout(()=>{document.getElementById('note-status').textContent='';}, 1500);
        });
    };
    // Download career map
    document.getElementById('download-career-map').onclick = function() {
        const details = {
            Description: d ? d.desc : '',
            'Avg. Salary': salary,
            'Key Skills': d ? d.skills.join(', ') : '',
            'Online Courses': d ? d.courses.map(c=>c.name+': '+c.url).join('; ') : '',
            'Job Market': d ? d.trend : '',
            'Related Careers': d ? d.related.join(', ') : '',
            'Your Notes': document.getElementById('career-note').value
        };
        fetch('http://localhost:5000/api/download_career_map', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ career, details })
        })
        .then(res => res.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${career}_map.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    };
}


// --- Scholarship Estimator + Admission Chance ---
function renderScholarshipUI() {
    renderAdmissionChanceUI();
}


// --- Timeline Tracker ---
function renderTimelineUI() {
    const container = document.getElementById('timeline-content');
    container.innerHTML = `<div style='margin-bottom:1.2rem;'>
        <h3 style='color:#b89b5e;'>Upcoming Important Dates & Reminders</h3>
        <form id='reminder-form' style='display:flex;gap:0.7rem;flex-wrap:wrap;align-items:flex-end;margin-bottom:1.2rem;'>
            <input id='reminder-event' placeholder='Event (e.g. Scholarship Deadline)' required style='min-width:180px;'>
            <input id='reminder-date' type='date' required>
            <button type='submit' style='background:#b89b5e;color:#fff;'>Add Reminder</button>
        </form>
        <div id='timeline-table'></div>
        <div id='timeline-notify' style='margin-top:1.2rem;color:#388e3c;font-weight:600;'></div>
    </div>`;
    function loadTimeline() {
        fetch('http://localhost:5000/api/timeline')
            .then(res => res.json())
            .then(data => {
                let html = '<table><tr><th>Event</th><th>Date</th></tr>';
                data.forEach(row => {
                    html += `<tr><td>${row.event}</td><td>${row.date}</td></tr>`;
                });
                html += '</table>';
                document.getElementById('timeline-table').innerHTML = html;
            });
    }
    loadTimeline();
    document.getElementById('reminder-form').onsubmit = function(e) {
        e.preventDefault();
        const event = document.getElementById('reminder-event').value;
        const date = document.getElementById('reminder-date').value;
        fetch('http://localhost:5000/api/timeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, date })
        })
        .then(res => res.json())
        .then(() => {
            document.getElementById('timeline-notify').textContent = 'Reminder added!';
            loadTimeline();
            setTimeout(()=>{document.getElementById('timeline-notify').textContent='';}, 1500);
        });
    };
}

// --- Study Materials UI ---
function renderStudyMaterials() {
  const container = document.getElementById('study-materials-content');
  if (!container) return;
  container.innerHTML = '<div class="loading">Loading study materials...</div>';
  fetch('/api/study_materials')
    .then(res => res.json())
    .then(materials => {
      if (!materials.length) {
        container.innerHTML = '<div>No study materials found.</div>';
        return;
      }
      container.innerHTML = `<ul class="materials-list">
        ${materials.map(m => `
          <li class="material-item">
            <span class="material-type">${m.type}</span>
            <a href="${m.url}" target="_blank" class="material-title">${m.title}</a>
          </li>
        `).join('')}
      </ul>`;
    })
    .catch(() => { container.innerHTML = '<div style="color:#d32f2f;">Failed to load study materials.</div>'; });
}

// --- Scholarships UI ---
function renderScholarships() {
  const container = document.getElementById('scholarships-content');
  if (!container) return;
  container.innerHTML = '<div class="loading">Loading scholarships...</div>';
  fetch('/api/scholarships')
    .then(res => res.json())
    .then(scholarships => {
      if (!scholarships.length) {
        container.innerHTML = '<div>No scholarships found.</div>';
        return;
      }
      container.innerHTML = `<table class="scholarship-table">
        <thead><tr><th>Name</th><th>Amount</th><th>Eligibility</th><th>Link</th></tr></thead>
        <tbody>
        ${scholarships.map(s => `
          <tr>
            <td>${s.name}</td>
            <td>₹${s.amount.toLocaleString()}</td>
            <td>${s.eligibility}</td>
            <td><a href="${s.url}" target="_blank">View</a></td>
          </tr>
        `).join('')}
        </tbody>
      </table>`;
    })
    .catch(() => { container.innerHTML = '<div style="color:#d32f2f;">Failed to load scholarships.</div>'; });
}

// --- Profile UI (if not already present in profile.js) ---
if (typeof renderProfileSection !== 'function') {
  function renderProfileSection() {
    const container = document.getElementById('profile-content') || document.getElementById('profile');
    if (!container) return;
    container.innerHTML = `<div style='color:#888;'>Profile loading...</div>`;
    fetch('/api/profile', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          container.innerHTML = `<div><b>Name:</b> ${data.user.name || ''}</div><div><b>Email:</b> ${data.user.email || ''}</div><div><b>Interests:</b> ${(data.user.interests || []).join(', ')}</div>`;
        } else {
          container.innerHTML = `<div>No profile data found.</div>`;
        }
      })
      .catch(() => { container.innerHTML = '<div style="color:#d32f2f;">Failed to load profile.</div>'; });
  }
}

// --- Section Renderers Map ---
const sectionRenderers = {
  'quiz': renderQuizUI,
  'career': renderCareerUI,
  'colleges': renderCollegesUI,
  'scholarship': renderScholarshipUI,
  'timeline': renderTimelineUI,
  'profile': renderProfileSection,
  'study-materials': renderStudyMaterials,
  'scholarships': renderScholarships
};

function showSection(id) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
    if (sectionRenderers[id]) sectionRenderers[id]();
  }
}

// Show the first section by default
showSection('quiz');
