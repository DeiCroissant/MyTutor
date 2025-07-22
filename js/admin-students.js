// Hiển thị danh sách học sinh đã đăng ký lịch học/meeting cho quản trị viên hệ thống

function renderStudentMeetingTable() {
  const tbody = document.getElementById('studentMeetingTableBody');
  if (!tbody || !schedule) return;
  tbody.innerHTML = schedule.map(item => `
    <tr>
      <td>${learner.name}</td>
      <td>${learner.email}</td>
      <td>${item.subject}</td>
      <td>${item.tutor}</td>
      <td>${item.date} ${item.time}</td>
      <td>${item.status === 'upcoming' ? 'Sắp tới' : item.status}</td>
      <td>${item.onlineMeeting ? `<a href='${item.meetingLink}' target='_blank'>Link</a>` : 'Offline'}</td>
    </tr>
  `).join('');
}

// Tab switching logic
function showTab(tab) {
  document.getElementById('section-courses').style.display = tab === 'courses' ? '' : 'none';
  document.getElementById('section-students').style.display = tab === 'students' ? '' : 'none';
  document.getElementById('tab-courses').classList.toggle('active', tab === 'courses');
  document.getElementById('tab-students').classList.toggle('active', tab === 'students');
  if (tab === 'students') renderStudentMeetingTable();
}

// Khởi tạo: luôn hiển thị tab quản lý môn học khi vào trang
showTab('courses');

// Đảm bảo có thể gọi showTab từ HTML
window.showTab = showTab; 