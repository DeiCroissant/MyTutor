// =================================================================
// SCRIPT CHO TRUNG TÂM HỖ TRỢ VĂN LANG
// =================================================================

// DỮ LIỆU CÀI ĐẶT
const supportCenterSettings = {
    avatar: 'TT',
    name: 'Nguyễn Thiện D',
    phone: '0987654321',
    itemsPerPage: 20,
    supportEmail: 'support.mytutor@vanlanguni.edu.vn'
};

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // Đảm bảo tab đầu tiên được active
  const firstTab = document.querySelector('.nav a.active');
  if (firstTab) {
    const targetId = firstTab.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
      console.log('Activated section:', targetId);
    }
  }
  
  renderTutorApprovalTable();
  renderUnscheduledTutorsTable();
  renderInterviewScheduleTable();
  renderSupportcenterInbox();
  
  // Khởi tạo charts nếu đang ở tab báo cáo
  if (document.getElementById('bao-cao-thong-ke').classList.contains('active')) {
    initializeCharts();
    renderReports();
  }
});

// ========== XÉT DUYỆT GIA SƯ ==========

function renderTutorApprovalTable() {
    const tbody = document.getElementById('tutor-approval-tbody');
    if (!tbody) return;
  
  tbody.innerHTML = tutorApplications.map(tutor => `
        <tr>
            <td>${tutor.id}</td>
            <td>${tutor.name}</td>
            <td>${tutor.subject}</td>
      <td>${tutor.submitDate}</td>
            <td>
        <button class="btn-primary" onclick="viewTutorDetail(${tutor.id})">Xem chi tiết</button>
        <button class="btn-secondary" onclick="scheduleInterview(${tutor.id})">Lên lịch PV</button>
                <button class="btn-danger" onclick="rejectTutor(${tutor.id})">Từ chối</button>
            </td>
        </tr>
    `).join('');
}

function viewTutorDetail(id) {
  const tutor = tutorApplications.find(t => t.id === id);
    if (!tutor) return;
  
    const modal = document.getElementById('approvalDetailModal');
  const content = document.getElementById('modalDetailContent');
  
  content.innerHTML = `
    <h3>Chi tiết hồ sơ gia sư</h3>
    <div class="profile-item">
      <span class="profile-label">Tên:</span>
      <span class="profile-value">${tutor.name}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Môn đăng ký:</span>
      <span class="profile-value">${tutor.subject}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Ngày nộp hồ sơ:</span>
      <span class="profile-value">${tutor.submitDate}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Trạng thái:</span>
      <span class="profile-value">Chờ duyệt</span>
    </div>
  `;
  
  modal.style.display = 'flex';
}

function scheduleInterview(id) {
  const tutor = tutorApplications.find(t => t.id === id);
  if (!tutor) return;
  
  document.getElementById('scheduleTutorId').value = id;
  document.getElementById('scheduleInterviewModal').style.display = 'flex';
}

function rejectTutor(id) {
  if (confirm('Bạn có chắc chắn muốn từ chối hồ sơ này?')) {
    tutorApplications = tutorApplications.filter(t => t.id !== id);
    renderTutorApprovalTable();
    alert('Đã từ chối hồ sơ!');
  }
}

// ========== LỊCH PHỎNG VẤN ==========

function renderUnscheduledTutorsTable() {
    const tbody = document.getElementById('unscheduled-tutors-tbody');
    if (!tbody) return;

    tbody.innerHTML = unscheduledTutors.map(tutor => `
        <tr>
            <td>${tutor.name}</td>
            <td>${tutor.subject}</td>
      <td>${tutor.submitDate}</td>
            <td>
        <button class="btn-schedule" onclick="scheduleInterview(${tutor.id})">Lên lịch phỏng vấn</button>
            </td>
        </tr>
    `).join('');
}

function renderInterviewScheduleTable() {
    const tbody = document.getElementById('interview-schedule-tbody');
    if (!tbody) return;
  
  tbody.innerHTML = interviewSchedule.map(interview => `
    <tr>
      <td>${interview.name}</td>
                <td>${interview.subject}</td>
      <td>${interview.interviewTime}</td>
      <td>
        <span class="status status-${interview.status}">
          ${interview.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hoàn thành'}
        </span>
      </td>
            </tr>
  `).join('');
}

// ========== HỘP THƯ TRUNG TÂM HỖ TRỢ VĂN LANG =============

// Danh sách thông báo từ tutor (giả lập, thực tế sẽ lấy từ server hoặc localStorage)
let supportcenterInbox = JSON.parse(localStorage.getItem('supportcenterInbox') || '[]');

function renderSupportcenterInbox() {
  const inboxDiv = document.getElementById('supportcenterInboxList');
  if (!inboxDiv) return;
  if (!supportcenterInbox.length) {
    inboxDiv.innerHTML = '<p style="text-align:center; color:#888;">Chưa có thông báo mới.</p>';
    return;
  }
  inboxDiv.innerHTML = supportcenterInbox.map((msg, idx) => `
    <div class="inbox-item" style="border-bottom:1px solid #eee; padding:16px 0;">
      <div><b>Loại yêu cầu:</b> ${msg.type === 'edit' ? 'Sửa môn học' : 'Xóa môn học'}</div>
      <div><b>Nội dung:</b> ${msg.content}</div>
      <div><b>Thời gian:</b> ${msg.time}</div>
      <div style="margin-top:10px;">
        <button class="btn-primary" onclick="replyToTutor(${idx}, true)">Xác nhận</button>
        <button class="btn-danger" onclick="replyToTutor(${idx}, false)">Từ chối</button>
      </div>
    </div>
  `).join('');
}

window.renderSupportcenterInbox = renderSupportcenterInbox;

function replyToTutor(idx, isAccept) {
  const msg = supportcenterInbox[idx];
  if (!msg) return;
  // Gửi thư phản hồi cho tutor (giả lập: lưu vào localStorage)
  let tutorInbox = JSON.parse(localStorage.getItem('tutorInbox') || '[]');
  tutorInbox.unshift({
    sender: 'SUPPORT CENTER',
    content: isAccept ? `Yêu cầu ${msg.type === 'edit' ? 'sửa' : 'xóa'} môn học của bạn đã được xác nhận.` : `Yêu cầu ${msg.type === 'edit' ? 'sửa' : 'xóa'} môn học của bạn đã bị từ chối.`,
    date: new Date().toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
  });
  localStorage.setItem('tutorInbox', JSON.stringify(tutorInbox));
  // Xóa thông báo khỏi hộp thư trung tâm
  supportcenterInbox.splice(idx, 1);
  localStorage.setItem('supportcenterInbox', JSON.stringify(supportcenterInbox));
  renderSupportcenterInbox();
  alert('Đã gửi phản hồi cho tutor!');
}

// ========== BÁO CÁO & THỐNG KÊ ==========

// Khởi tạo các chart
function initializeCharts() {
  // Chart môn học theo trạng thái
  const courseStatusCtx = document.getElementById('courseStatusChart');
  if (courseStatusCtx) {
    new Chart(courseStatusCtx, {
      type: 'doughnut',
      data: courseStatusData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // Chart phân bố gia sư theo khoa
  const tutorDistributionCtx = document.getElementById('tutorDistributionChart');
  if (tutorDistributionCtx) {
    new Chart(tutorDistributionCtx, {
      type: 'bar',
      data: tutorDistributionData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Chart đánh giá từ sinh viên
  const studentFeedbackCtx = document.getElementById('studentFeedbackChart');
  if (studentFeedbackCtx) {
    new Chart(studentFeedbackCtx, {
      type: 'bar',
      data: studentFeedbackData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Chart thống kê theo tháng
  const monthlyStatsCtx = document.getElementById('monthlyStatsChart');
  if (monthlyStatsCtx) {
    new Chart(monthlyStatsCtx, {
      type: 'line',
      data: monthlyStatsData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Khởi tạo chart môn học phổ biến
  const popularSubjectsCtx = document.getElementById('popularSubjectsChart');
  if (popularSubjectsCtx) {
    new Chart(popularSubjectsCtx, {
      type: 'bar',
      data: popularSubjectsData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top môn học được đăng ký nhiều nhất'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Số sinh viên đăng ký'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Môn học'
            }
          }
        }
      }
    });
  }
}

// Render báo cáo feedback
function renderReports() {
  renderStudentFeedback();
  renderTutorFeedback();
  renderActiveCourses();
  renderCompletedCourses();
  renderPopularSubjectsTable();
}

function renderStudentFeedback() {
  const container = document.getElementById('studentFeedbackList');
  if (!container) return;
  
  container.innerHTML = studentFeedback.map(feedback => `
    <div class="feedback-item">
      <div class="feedback-header">
        <span class="feedback-author">${feedback.author}</span>
        <span class="feedback-date">${feedback.date}</span>
      </div>
      <div class="feedback-content">${feedback.content}</div>
      <div class="feedback-rating">
        ${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}
      </div>
    </div>
  `).join('');
}

function renderTutorFeedback() {
  const container = document.getElementById('tutorFeedbackList');
  if (!container) return;
  
  container.innerHTML = tutorFeedback.map(feedback => `
    <div class="feedback-item">
      <div class="feedback-header">
        <span class="feedback-author">${feedback.author}</span>
        <span class="feedback-date">${feedback.date}</span>
      </div>
      <div class="feedback-content">${feedback.content}</div>
      <div class="feedback-rating">
        ${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}
      </div>
    </div>
  `).join('');
}

function renderActiveCourses() {
  const container = document.getElementById('activeCoursesList');
  if (!container) return;
  
  container.innerHTML = activeCourses.map(course => `
    <div class="course-item">
      <div class="course-info">
        <div class="course-name">${course.name}</div>
        <div class="course-details">${course.department} • ${course.tutorCount} gia sư</div>
      </div>
      <div class="course-stats">
        <div class="course-count">${course.studentCount}</div>
        <div class="course-label">sinh viên</div>
      </div>
    </div>
  `).join('');
}

// Render bảng thống kê môn học phổ biến
function renderPopularSubjectsTable() {
  const popularSubjectsTable = document.getElementById('popularSubjectsTable');
  if (!popularSubjectsTable) return;
  
  popularSubjectsTable.innerHTML = `
    <table class="stats-table">
      <thead>
        <tr>
          <th>Xếp hạng</th>
          <th>Môn học</th>
          <th>Số sinh viên</th>
          <th>Số buổi học</th>
          <th>Đánh giá TB</th>
          <th>Số gia sư</th>
          <th>Tỷ lệ hoàn thành</th>
        </tr>
      </thead>
      <tbody>
        ${popularSubjectsDetail.map(subject => `
          <tr>
            <td class="rank-cell">
              <span class="rank-badge rank-${subject.rank <= 3 ? 'top' : 'normal'}">${subject.rank}</span>
            </td>
            <td class="subject-name">${subject.subject}</td>
            <td class="students-count">${subject.students}</td>
            <td class="lessons-count">${subject.lessons}</td>
            <td class="rating-cell">
              <span class="rating-stars">${'★'.repeat(Math.floor(subject.avgRating))}${'☆'.repeat(5-Math.floor(subject.avgRating))}</span>
              <span class="rating-text">${subject.avgRating}</span>
            </td>
            <td class="tutors-count">${subject.tutors}</td>
            <td class="completion-rate">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${subject.completionRate}%"></div>
              </div>
              <span class="rate-text">${subject.completionRate}%</span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderCompletedCourses() {
  const container = document.getElementById('completedCoursesList');
  if (!container) return;
  
  container.innerHTML = completedCourses.map(course => `
    <div class="course-item">
      <div class="course-info">
        <div class="course-name">${course.name}</div>
        <div class="course-details">${course.department} • Kết thúc: ${course.endDate}</div>
      </div>
      <div class="course-stats">
        <div class="course-count">${course.completionRate}%</div>
        <div class="course-label">hoàn thành</div>
      </div>
    </div>
  `).join('');
}

// ========== NAVIGATION ==========

// Xử lý chuyển đổi tab
document.addEventListener('click', function(e) {
  if (e.target.matches('.nav a')) {
    e.preventDefault();
    console.log('Tab clicked:', e.target.getAttribute('href'));
    
    // Xóa active class từ tất cả tab và section
    document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    
    // Thêm active class cho tab được click
    e.target.classList.add('active');
    
    // Hiển thị section tương ứng
    const targetId = e.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
      console.log('Activated section:', targetId);
      
      // Khởi tạo charts nếu đang ở tab báo cáo
      if (targetId === 'bao-cao-thong-ke') {
        setTimeout(() => {
          initializeCharts();
          renderReports();
        }, 100);
      }
    }
  }
});

// Khởi tạo tab đầu tiên khi trang load
document.addEventListener('DOMContentLoaded', function() {
  // Đảm bảo tab "Tổng quan" được active mặc định
    const firstTab = document.querySelector('.nav a.active');
    if (firstTab) {
    const targetId = firstTab.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }
});

// ========== MODAL FUNCTIONS ==========

function closeDetailModal() {
  document.getElementById('approvalDetailModal').style.display = 'none';
}

function closeScheduleModal() {
  document.getElementById('scheduleInterviewModal').style.display = 'none';
}

// Xử lý form lên lịch phỏng vấn
document.addEventListener('DOMContentLoaded', function() {
    const scheduleForm = document.getElementById('scheduleInterviewForm');
    if (scheduleForm) {
    scheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const tutorId = document.getElementById('scheduleTutorId').value;
      const date = document.getElementById('scheduleDate').value;
      const time = document.getElementById('scheduleTime').value;
      
      if (!date || !time) {
        alert('Vui lòng chọn đầy đủ ngày và giờ phỏng vấn!');
                return;
            }

      // Thêm vào lịch phỏng vấn
      const tutor = tutorApplications.find(t => t.id == tutorId) || 
                   unscheduledTutors.find(t => t.id == tutorId);
      
      if (tutor) {
        interviewSchedule.push({
          id: interviewSchedule.length + 1,
          name: tutor.name,
          subject: tutor.subject,
          interviewTime: `${date} ${time}`,
          status: 'scheduled'
        });
        
        // Xóa khỏi danh sách chờ
        tutorApplications = tutorApplications.filter(t => t.id != tutorId);
        unscheduledTutors = unscheduledTutors.filter(t => t.id != tutorId);
        
        // Cập nhật UI
        renderTutorApprovalTable();
        renderUnscheduledTutorsTable();
        renderInterviewScheduleTable();
        closeScheduleModal();
        
        alert('Đã lên lịch phỏng vấn thành công!');
      }
    });
  }
});

// ========== UTILITY FUNCTIONS ==========

function changePassword() {
  const newPassword = prompt('Nhập mật khẩu mới:');
  if (newPassword) {
    alert('Đã đổi mật khẩu thành công!');
  }
}

function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    window.location.href = 'index.html';
  }
}

// Xử lý chuyển đổi vai trò
document.addEventListener('DOMContentLoaded', function() {
  const switchRoleBtn = document.getElementById('switchRoleBtn');
  const roleSwitcher = document.getElementById('role-switcher');
  
  if (switchRoleBtn && roleSwitcher) {
    switchRoleBtn.addEventListener('click', function() {
      const selectedRole = roleSwitcher.value;
      let targetPage = '';
      
      switch(selectedRole) {
        case 'learner':
          targetPage = 'dashboard.html';
          break;
        case 'tutor':
          targetPage = 'tutor-dashboard.html';
          break;
        default:
          targetPage = 'dashboard.html';
      }
      
      if (targetPage) {
        window.open(targetPage, '_blank');
      }
      });
    }
});