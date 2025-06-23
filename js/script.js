// Hiển thị hồ sơ learner
function renderLearnerProfile() {
  const profile = document.getElementById('learnerProfile');
  if (!profile || !learner) return;
  profile.innerHTML = `
    <p><strong>Họ tên:</strong> ${learner.name}</p>
    <p><strong>Email:</strong> ${learner.email}</p>
    <p><strong>Số điện thoại:</strong> ${learner.phone}</p>
  `;
}

// Hiển thị danh sách tutor
function renderTutors(list) {
  const tutorList = document.getElementById('tutorList');
  if (!tutorList) return;
  if (!list.length) {
    tutorList.innerHTML = '<p>Không tìm thấy gia sư phù hợp.</p>';
    return;
  }
  tutorList.innerHTML = list.map(t => `
    <div class="tutor-card">
      <div><strong>${t.name}</strong></div>
      <div class="status ${t.status === 'busy' ? 'busy' : ''}">
        ${t.status === 'busy' ? 'Đang bận' : 'Đang rảnh'}
      </div>
      <div class="subject">Môn: ${t.subject}</div>
      <div class="price">${t.price.toLocaleString()}đ/buổi</div>
      <div>${t.desc}</div>
    </div>
  `).join('');
}

// Lọc tutor
function filterTutors() {
  let status = document.getElementById('filterStatus').value;
  let name = document.getElementById('filterName').value.trim().toLowerCase();
  let subject = document.getElementById('filterSubject').value.trim().toLowerCase();
  let price = document.getElementById('filterPrice').value;
  let filtered = tutors.filter(t => {
    let ok = true;
    if (status && t.status !== status) ok = false;
    if (name && !t.name.toLowerCase().includes(name)) ok = false;
    if (subject && !t.subject.toLowerCase().includes(subject)) ok = false;
    if (price && t.price > parseInt(price)) ok = false;
    return ok;
  });
  renderTutors(filtered);
}

// Gắn sự kiện tự động lọc khi nhập
function attachFilterEvents() {
  document.getElementById('filterStatus').onchange = filterTutors;
  document.getElementById('filterName').oninput = filterTutors;
  document.getElementById('filterSubject').oninput = filterTutors;
  document.getElementById('filterPrice').oninput = filterTutors;
}

// Chuyển tab nav
function attachNavEvents() {
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
      const id = this.getAttribute('href').replace('#','');
      document.getElementById(id).style.display = 'block';
    }
  });
  // Mặc định chỉ hiển thị hồ sơ
  document.querySelectorAll('.section').forEach((sec,i) => sec.style.display = i===0?'block':'none');
}

// Khởi tạo
window.onload = function() {
  renderLearnerProfile();
  renderTutors(tutors);
  attachFilterEvents();
  attachNavEvents();
} 