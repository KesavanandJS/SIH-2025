// Modern Profile Section for Career Path Finder (beige theme)
// Place this in your main.js or a new JS file and call renderProfileSection() on the profile page or modal

function renderProfileSection() {
  const container = document.getElementById('profile-content');
  if (!container) return;
  container.innerHTML = `
    <div class="profile-card" style="background:#f8f5ed;border-radius:18px;box-shadow:0 2px 12px #e2d8c2;padding:2.5rem 2rem;max-width:420px;margin:2rem auto;">
      <h2 style="color:#2a5ca4;font-weight:700;margin-bottom:1.2rem;">My Profile</h2>
      <form id="profile-form">
        <label style="font-weight:600;color:#a88b4a;">Name</label><br>
        <input type="text" id="profile-name" style="width:100%;padding:0.5rem;margin-bottom:1rem;border-radius:8px;border:1px solid #e2d8c2;background:#fff8e1;" required><br>
        <label style="font-weight:600;color:#a88b4a;">Email</label><br>
        <input type="email" id="profile-email" style="width:100%;padding:0.5rem;margin-bottom:1rem;border-radius:8px;border:1px solid #e2d8c2;background:#fff8e1;" disabled><br>
        <label style="font-weight:600;color:#a88b4a;">Interests</label><br>
        <input type="text" id="profile-interests" placeholder="e.g. AI, Robotics, Design" style="width:100%;padding:0.5rem;margin-bottom:1.5rem;border-radius:8px;border:1px solid #e2d8c2;background:#fff8e1;"><br>
        <button type="submit" style="background:#a88b4a;color:#fff;font-weight:600;padding:0.7rem 1.5rem;border:none;border-radius:8px;cursor:pointer;">Save Changes</button>
        <span id="profile-status" style="margin-left:1rem;color:#2a5ca4;font-weight:600;"></span>
      </form>
    </div>
  `;

  // Fetch and fill profile data
  fetch('/api/profile', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        document.getElementById('profile-name').value = data.user.name || '';
        document.getElementById('profile-email').value = data.user.email || '';
        document.getElementById('profile-interests').value = (data.user.interests || []).join(', ');
      }
    });

  // Save changes
  document.getElementById('profile-form').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const interests = document.getElementById('profile-interests').value.split(',').map(s => s.trim()).filter(Boolean);
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, interests })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById('profile-status').textContent = data.status === 'ok' ? 'Saved!' : 'Error';
      setTimeout(() => { document.getElementById('profile-status').textContent = ''; }, 2000);
    });
  };
}

// SPA integration: render profile section when shown
if (typeof showSection === 'function') {
  const origShowSection = showSection;
  window.showSection = function(id) {
    origShowSection(id);
    if (id === 'profile') renderProfileSection();
  };
}
