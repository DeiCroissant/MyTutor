// Hiển thị hồ sơ learner chi tiết
function renderLearnerProfile() {
  const profile = document.getElementById('learnerProfile');
  if (!profile || !learner) return;
  
  profile.innerHTML = `
    <div class="profile-item">
      <span class="profile-label">Họ tên:</span>
      <span class="profile-value">${learner.name}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Email:</span>
      <span class="profile-value">${learner.email}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Số điện thoại:</span>
      <span class="profile-value">${learner.phone}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Địa chỉ:</span>
      <span class="profile-value">${learner.address}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Ngày tham gia:</span>
      <span class="profile-value">${formatDate(learner.joinDate)}</span>
    </div>
  `;
}

// Cập nhật thông tin header
function updateHeaderInfo() {
  if (!learner) return;
  
  const userAvatar = document.getElementById('userAvatar');
  const userGreeting = document.getElementById('userGreeting');
  const userRole = document.getElementById('userRole');
  
  if (userAvatar) userAvatar.textContent = learner.avatar;
  if (userGreeting) userGreeting.textContent = `Xin chào, ${learner.name}!`;
  if (userRole) userRole.textContent = `Sinh viên Văn Lang - ${learner.grade}`;
}

// Cập nhật thống kê lịch học
function updateScheduleStats() {
  if (!learner || !statistics) return;
  
  const totalHours = document.getElementById('totalHours');
  const completedLessons = document.getElementById('completedLessons');
  const totalSubjects = document.getElementById('totalSubjects');
  const onlineMeetings = document.getElementById('onlineMeetings');
  
  if (totalHours) totalHours.textContent = statistics.totalHours;
  if (completedLessons) completedLessons.textContent = learner.completedLessons;
  if (totalSubjects) totalSubjects.textContent = learner.currentSubjects.length;
  
  // Đếm số buổi online
  const onlineCount = schedule ? schedule.filter(lesson => lesson.onlineMeeting).length : 0;
  if (onlineMeetings) onlineMeetings.textContent = onlineCount;
}

// Cập nhật thống kê điểm số
function updateScoreStats() {
  if (!statistics) return;
  
  const averageGPA = document.getElementById('averageGPA');
  const improvementRate = document.getElementById('improvementRate');
  
  if (averageGPA) averageGPA.textContent = statistics.averageGPA;
  if (improvementRate) improvementRate.textContent = `+${statistics.improvementRate}% so với tháng trước`;
}

// Cập nhật form cài đặt
function updateSettingsForms() {
  if (!learner) return;
  
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profilePhone = document.getElementById('profilePhone');
  const profileGrade = document.getElementById('profileGrade');
  const profileSchool = document.getElementById('profileSchool');
  const profileAddress = document.getElementById('profileAddress');
  const currentAvatarDisplay = document.getElementById('currentAvatarDisplay');
  
  if (profileName) profileName.value = learner.name;
  if (profileEmail) profileEmail.value = learner.email;
  if (profilePhone) profilePhone.value = learner.phone;
  if (profileGrade) profileGrade.value = learner.grade;
  if (profileSchool) profileSchool.value = learner.school;
  if (profileAddress) profileAddress.value = learner.address;
  if (currentAvatarDisplay) currentAvatarDisplay.textContent = learner.avatar;
}

// Hiển thị thông tin học tập
function renderAcademicInfo() {
  const academicInfo = document.getElementById('academicInfo');
  if (!academicInfo || !learner) return;
  
  academicInfo.innerHTML = `
    <div class="profile-item">
      <span class="profile-label">Lớp:</span>
      <span class="profile-value">${learner.grade}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Trường:</span>
      <span class="profile-value">${learner.school}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Môn học hiện tại:</span>
      <span class="profile-value">${learner.currentSubjects.join(', ')}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Lịch học ưa thích:</span>
      <span class="profile-value">${learner.preferredSchedule.join(' | ')}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Tổng buổi học:</span>
      <span class="profile-value">${learner.totalLessons} buổi</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Buổi đã hoàn thành:</span>
      <span class="profile-value">${learner.completedLessons} buổi</span>
    </div>
  `;
}

// Hiển thị thông tin liên hệ khẩn cấp
function renderEmergencyContact() {
  const emergencyContact = document.getElementById('emergencyContact');
  if (!emergencyContact || !learner.emergencyContact) return;
  
  emergencyContact.innerHTML = `
    <div class="profile-item">
      <span class="profile-label">Tên:</span>
      <span class="profile-value">${learner.emergencyContact.name}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Quan hệ:</span>
      <span class="profile-value">${learner.emergencyContact.relationship}</span>
    </div>
    <div class="profile-item">
      <span class="profile-label">Số điện thoại:</span>
      <span class="profile-value">${learner.emergencyContact.phone}</span>
    </div>
  `;
}

// Hiển thị lịch học
function renderSchedule() {
  const scheduleList = document.getElementById('scheduleList');
  if (!scheduleList || !schedule) return;
  
  if (!schedule.length) {
    scheduleList.innerHTML = '<p class="no-data">Chưa có lịch học nào.</p>';
    return;
  }
  
  scheduleList.innerHTML = schedule.map(lesson => `
    <div class="schedule-item ${lesson.status}">
      <div class="schedule-date">
        <div class="date">${formatDate(lesson.date)}</div>
        <div class="time">${lesson.time}</div>
        <div class="meeting-type">${lesson.meetingType}</div>
      </div>
      <div class="schedule-info">
        <div class="subject">${lesson.subject}</div>
        <div class="tutor">Gia sư: ${lesson.tutor}</div>
        <div class="notes">${lesson.notes}</div>
        ${lesson.onlineMeeting ? '<div class="online-indicator">🖥️ Buổi học online</div>' : ''}
      </div>
      <div class="schedule-status">
        <span class="status-badge ${lesson.status}">
          ${lesson.status === 'completed' ? 'Đã hoàn thành' : 'Sắp tới'}
        </span>
        ${lesson.onlineMeeting && lesson.status === 'upcoming' ? 
          `<button class="btn-join-meeting" onclick="checkDeviceAndJoinMeeting('${lesson.meetingLink}')">Tham gia meeting</button>` : ''}
      </div>
    </div>
  `).join('');
}

// Hiển thị danh sách tutor với thông tin chi tiết
function renderTutors(list) {
  const tutorList = document.getElementById('tutorList');
  if (!tutorList) return;
  
  if (!list.length) {
    tutorList.innerHTML = '<p class="no-data">Không tìm thấy gia sư phù hợp.</p>';
    return;
  }
  
  tutorList.innerHTML = list.map(t => `
    <div class="tutor-card">
      <div class="tutor-header">
        <div class="tutor-avatar">${t.avatar}</div>
        <div class="tutor-info">
          <div class="tutor-name">${t.name}</div>
          <div class="tutor-subject">${t.subject}</div>
          <div class="tutor-meeting-type">
            <span class="meeting-badge ${t.meetingType}">${t.meetingType}</span>
            ${t.onlineSupport ? '<span class="online-badge">🖥️ Online</span>' : ''}
          </div>
        </div>
        <div class="tutor-status ${t.status}">
          ${t.status === 'busy' ? 'Đang bận' : 'Đang rảnh'}
        </div>
      </div>
      <div class="tutor-details">
        <div class="tutor-rating">
          <span class="stars">${'★'.repeat(Math.floor(t.rating))}${'☆'.repeat(5-Math.floor(t.rating))}</span>
          <span class="rating-text">${t.rating}/5 (${t.students} học sinh)</span>
        </div>
        <div class="tutor-price">${t.price.toLocaleString()}đ/buổi</div>
        <div class="tutor-desc">${t.desc}</div>
      </div>
      <div class="tutor-actions">
        <button class="btn-primary" onclick="bookTutor(${t.id})">Đặt lịch</button>
        <button class="btn-secondary" onclick="viewTutorDetail(${t.id})">Chi tiết</button>
        ${t.onlineSupport ? `<button class="btn-online" onclick="checkDeviceAndJoinMeeting(${t.id})">Tham gia meeting</button>` : ''}
      </div>
    </div>
  `).join('');
}

// Hiển thị tiến độ theo môn học
function renderSubjectProgress() {
  const subjectProgress = document.getElementById('subjectProgress');
  if (!subjectProgress || !statistics.subjects) return;
  
  subjectProgress.innerHTML = statistics.subjects.map(subject => `
    <div class="subject-progress-item">
      <div class="subject-name">${subject.name}</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(subject.gpa / 4.0) * 100}%"></div>
      </div>
      <div class="subject-score">
        <span class="score">${subject.gpa}</span>
        <span class="grade">(${subject.grade})</span>
        <span class="improvement">+${subject.improvement}%</span>
      </div>
    </div>
  `).join('');
}

// Hiển thị biểu đồ tiến độ
function renderProgressChart() {
  const progressChart = document.getElementById('progressChart');
  if (!progressChart || !statistics.monthlyProgress) return;
  
  const maxGPA = Math.max(...statistics.monthlyProgress.map(item => item.gpa));
  const maxHours = Math.max(...statistics.monthlyProgress.map(item => item.hours));
  
  progressChart.innerHTML = `
    <div class="chart-container">
      <div class="chart-bars">
        ${statistics.monthlyProgress.map(item => `
          <div class="chart-bar">
            <div class="bar-score" style="height: ${(item.gpa / maxGPA) * 100}%"></div>
            <div class="bar-hours" style="height: ${(item.hours / maxHours) * 100}%"></div>
            <div class="bar-label">${item.month}</div>
          </div>
        `).join('')}
      </div>
      <div class="chart-legend">
        <div class="legend-item">
          <div class="legend-color score-color"></div>
          <span>GPA (${statistics.monthlyProgress[statistics.monthlyProgress.length - 1]?.gpa || 0})</span>
        </div>
        <div class="legend-item">
          <div class="legend-color hours-color"></div>
          <span>Giờ học (${statistics.monthlyProgress[statistics.monthlyProgress.length - 1]?.hours || 0})</span>
        </div>
      </div>
    </div>
  `;
}

// Hiển thị danh sách đánh giá
function renderReviews() {
  const reviewsList = document.getElementById('reviewsList');
  if (!reviewsList || !reviews) return;
  
  if (!reviews.length) {
    reviewsList.innerHTML = '<p class="no-data">Chưa có đánh giá nào.</p>';
    return;
  }
  
  reviewsList.innerHTML = reviews.map(review => `
    <div class="review-item">
      <div class="review-header">
        <div class="review-tutor">${review.tutorName} - ${review.subject}</div>
        <div class="review-date">${formatDate(review.date)}</div>
      </div>
      <div class="review-rating">
        ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
      </div>
      <div class="review-comment">${review.comment}</div>
    </div>
  `).join('');
}

// Kiểm tra thiết bị và tham gia meeting
function checkDeviceAndJoinMeeting(meetingLink) {
  // Kiểm tra camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      stream.getTracks().forEach(track => track.stop());
      // Kiểm tra microphone
      return navigator.mediaDevices.getUserMedia({ audio: true });
    })
    .then(function(stream) {
      stream.getTracks().forEach(track => track.stop());
      // Nếu cả camera và mic đều hoạt động
      joinMeeting(meetingLink);
    })
    .catch(function(err) {
      alert('Vui lòng cho phép truy cập camera và microphone để tham gia meeting!');
      console.log('Lỗi thiết bị:', err);
    });
}

// Tham gia meeting
function joinMeeting(meetingLink) {
  if (confirm('Bạn có muốn tham gia meeting không?')) {
    window.open(meetingLink, '_blank');
  }
}

// Hiển thị biểu đồ phân bố GPA
function renderGPADistribution() {
  const gpaDistribution = document.getElementById('gpaDistribution');
  if (!gpaDistribution || !statistics.gpaDistribution) return;
  
  const maxCount = Math.max(...statistics.gpaDistribution.map(item => item.count));
  
  gpaDistribution.innerHTML = `
    <div class="gpa-chart">
      ${statistics.gpaDistribution.map(item => `
        <div class="gpa-bar-item">
          <div class="gpa-grade">${item.grade}</div>
          <div class="gpa-bar">
            <div class="gpa-bar-fill" style="height: ${(item.count / maxCount) * 100}%"></div>
          </div>
          <div class="gpa-count">${item.count}</div>
          <div class="gpa-percentage">${item.percentage}%</div>
        </div>
      `).join('')}
    </div>
  `;
}

// Cập nhật hàm filterTutors để hỗ trợ lọc theo hình thức học
function filterTutors() {
  const statusFilter = document.getElementById('filterStatus').value;
  const meetingTypeFilter = document.getElementById('filterMeetingType').value;
  const nameFilter = document.getElementById('filterName').value.toLowerCase();
  const subjectFilter = document.getElementById('filterSubject').value.toLowerCase();
  const priceFilter = parseFloat(document.getElementById('filterPrice').value) || 0;
  
  let filteredTutors = tutors.filter(tutor => {
    const statusMatch = !statusFilter || tutor.status === statusFilter;
    const meetingTypeMatch = !meetingTypeFilter || tutor.meetingType === meetingTypeFilter;
    const nameMatch = !nameFilter || tutor.name.toLowerCase().includes(nameFilter);
    const subjectMatch = !subjectFilter || tutor.subject.toLowerCase().includes(subjectFilter);
    const priceMatch = !priceFilter || tutor.price <= priceFilter;
    
    return statusMatch && meetingTypeMatch && nameMatch && subjectMatch && priceMatch;
  });
  
  renderTutors(filteredTutors);
}

// Gắn sự kiện đánh giá sao
function attachStarRating() {
  const stars = document.querySelectorAll('.star');
  let selectedRating = 0;
  
  stars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.dataset.rating);
      selectedRating = rating;
      
      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });
}

// Gắn sự kiện form đánh giá
function attachReviewForm() {
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const tutor = document.getElementById('reviewTutor').value;
      const comment = document.getElementById('reviewComment').value;
      const rating = document.querySelectorAll('.star.active').length;
      
      if (!tutor || !comment || rating === 0) {
        alert('Vui lòng điền đầy đủ thông tin đánh giá!');
        return;
      }
      
      // Thêm đánh giá mới
      const newReview = {
        id: reviews.length + 1,
        tutorName: tutor,
        subject: tutor.split(' - ')[1] || '',
        rating: rating,
        comment: comment,
        date: new Date().toISOString().split('T')[0]
      };
      
      reviews.push(newReview);
      renderReviews();
      
      // Reset form
      reviewForm.reset();
      document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
      
      alert('Đánh giá đã được gửi thành công!');
    });
  }
}

// Gắn sự kiện form cài đặt
function attachSettingsForms() {
  const profileForm = document.getElementById('profileForm');
  const academicForm = document.getElementById('academicForm');
  
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thông tin cá nhân đã được cập nhật!');
    });
  }
  
  if (academicForm) {
    academicForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thông tin học tập đã được cập nhật!');
    });
  }
}

// Gắn sự kiện tự động lọc khi nhập
function attachFilterEvents() {
  document.getElementById('filterStatus').onchange = filterTutors;
  document.getElementById('filterMeetingType').onchange = filterTutors;
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

// Các hàm tiện ích
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}

function bookTutor(tutorId) {
  alert('Chức năng đặt lịch sẽ được phát triển!');
}

function viewTutorDetail(tutorId) {
  alert('Chức năng xem chi tiết sẽ được phát triển!');
}

// Thay đổi ảnh đại diện
function changeAvatar(newAvatar) {
  if (!learner) return;
  
  // Cập nhật avatar trong dữ liệu
  learner.avatar = newAvatar;
  
  // Cập nhật hiển thị
  const currentAvatarDisplay = document.getElementById('currentAvatarDisplay');
  const userAvatar = document.getElementById('userAvatar');
  
  if (currentAvatarDisplay) currentAvatarDisplay.textContent = newAvatar;
  if (userAvatar) userAvatar.textContent = newAvatar;
  
  // Cập nhật trạng thái selected
  document.querySelectorAll('.avatar-option').forEach(option => {
    option.classList.remove('selected');
    if (option.dataset.avatar === newAvatar) {
      option.classList.add('selected');
    }
  });
  
  // Lưu vào localStorage
  localStorage.setItem('userAvatar', newAvatar);
  
  alert('Ảnh đại diện đã được cập nhật!');
}

// Hiển thị modal đổi mật khẩu
function changePassword() {
  const modal = document.getElementById('passwordModal');
  if (modal) {
    modal.classList.add('show');
  }
}

// Đóng modal đổi mật khẩu
function closePasswordModal() {
  const modal = document.getElementById('passwordModal');
  if (modal) {
    modal.classList.remove('show');
    // Reset form
    document.getElementById('passwordForm').reset();
  }
}

// Xử lý đổi mật khẩu
function handlePasswordChange(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Kiểm tra mật khẩu hiện tại (trong thực tế sẽ kiểm tra với server)
  if (currentPassword !== 'password123') {
    alert('Mật khẩu hiện tại không đúng!');
    return;
  }
  
  // Kiểm tra mật khẩu mới
  if (newPassword.length < 6) {
    alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }
  
  // Lưu mật khẩu mới (trong thực tế sẽ gửi lên server)
  localStorage.setItem('userPassword', newPassword);
  
  alert('Mật khẩu đã được thay đổi thành công!');
  closePasswordModal();
}

// Đăng xuất
function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    // Xóa dữ liệu người dùng khỏi localStorage
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userPassword');
    
    // Chuyển về trang đăng nhập
    window.location.href = './index.html';
  }
}

// Gắn sự kiện cho avatar options
function attachAvatarEvents() {
  const avatarOptions = document.querySelectorAll('.avatar-option');
  avatarOptions.forEach(option => {
    option.addEventListener('click', function() {
      const selectedAvatar = this.dataset.avatar;
      changeAvatar(selectedAvatar);
    });
  });
  
  // Đánh dấu avatar hiện tại
  if (learner) {
    avatarOptions.forEach(option => {
      if (option.dataset.avatar === learner.avatar) {
        option.classList.add('selected');
      }
    });
  }
}

// Gắn sự kiện form đổi mật khẩu
function attachPasswordForm() {
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', handlePasswordChange);
  }
  
  // Đóng modal khi click bên ngoài
  const modal = document.getElementById('passwordModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closePasswordModal();
      }
    });
  }
}

// Hiển thị thông báo từ localStorage
function renderLearnerNotifications() {
  const notiList = document.getElementById('learnerNotifications');
  if (!notiList) return;
  let notifications = JSON.parse(localStorage.getItem('learnerNotifications') || '[]');
  if (notifications.length === 0) {
    notiList.innerHTML = '<p>Không có thông báo mới.</p>';
    return;
  }
  notiList.innerHTML = notifications.map(n => `<div class="notification-item">${n.time}: ${n.message}</div>`).join('');
}

// Khởi tạo
window.onload = function() {
  // Khôi phục avatar từ localStorage nếu có
  const savedAvatar = localStorage.getItem('userAvatar');
  if (savedAvatar && learner) {
    learner.avatar = savedAvatar;
  }
  
  updateHeaderInfo();
  updateScheduleStats();
  updateScoreStats();
  updateSettingsForms();
  
  renderLearnerProfile();
  renderAcademicInfo();
  renderEmergencyContact();
  renderSchedule();
  renderTutors(tutors);
  renderSubjectProgress();
  renderProgressChart();
  renderGPADistribution();
  renderReviews();
  
  attachFilterEvents();
  attachNavEvents();
  attachStarRating();
  attachReviewForm();
  attachSettingsForms();
  attachAvatarEvents();
  attachPasswordForm();
  renderLearnerNotifications();
}

document.addEventListener('DOMContentLoaded', function() {
  const swapBtn = document.getElementById('swapRoleBtn');
  if (swapBtn) {
    swapBtn.onclick = function() {
      window.location.href = 'tutor-dashboard.html';
    };
  }
}); 