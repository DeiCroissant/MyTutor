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

  // Hiển thị nút đăng ký làm gia sư nếu chưa là gia sư
  const registerTutorBtn = document.getElementById('registerTutorBtn');
  if (registerTutorBtn) {
    // Kiểm tra xem đã đăng ký làm gia sư chưa
    const savedTutors = localStorage.getItem('tutors');
    const isRegisteredAsTutor = savedTutors && JSON.parse(savedTutors).some(tutor => 
      tutor.email === 'khoa.2374802010241@vanlanguni.vn' || 
      tutor.mssv === '2374802010241'
    );
    
    if (!isRegisteredAsTutor) {
      registerTutorBtn.style.display = '';
      registerTutorBtn.onclick = function() {
        // Mở modal đăng ký thay vì chuyển trang
        const modal = document.getElementById('registerTutorModal');
        if (modal) {
          modal.style.display = 'block';
        }
      };
    } else {
      registerTutorBtn.style.display = 'none';
    }
  }
  // Hiển thị khung đăng ký làm gia sư nếu chưa là gia sư
  const registerTutorCard = document.getElementById('register-tutor-card');
  const registerTutorBtn2 = document.getElementById('registerTutorBtn2');
  if (registerTutorCard && registerTutorBtn2) {
    // Kiểm tra xem đã đăng ký làm gia sư chưa
    const savedTutors = localStorage.getItem('tutors');
    const isRegisteredAsTutor = savedTutors && JSON.parse(savedTutors).some(tutor => 
      tutor.email === 'khoa.2374802010241@vanlanguni.vn' || 
      tutor.mssv === '2374802010241'
    );
    
    if (!isRegisteredAsTutor) {
      registerTutorCard.style.display = '';
      registerTutorBtn2.onclick = function() {
        // Mở modal đăng ký thay vì chuyển trang
        const modal = document.getElementById('registerTutorModal');
        if (modal) {
          modal.style.display = 'block';
        }
      };
    } else {
      registerTutorCard.style.display = 'none';
    }
  }
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
  
  tutorList.innerHTML = list.map(t => {
    // Rút gọn bio nếu dài
    let shortBio = t.bio;
    let showSeeMore = false;
    if (t.bio && t.bio.length > 80) {
      shortBio = t.bio.slice(0, 80) + '...';
      showSeeMore = true;
    }
    return `
      <div class="tutor-card">
        <div class="tutor-header">
          <div class="tutor-avatar">${t.avatar}</div>
          <div class="tutor-info">
            <div class="tutor-name">${t.name}</div>
            <div class="tutor-subject">${t.subject}</div>
            <div class="tutor-meeting-type">
              <span class="meeting-badge" data-type="${t.meetingType}">${t.meetingType}</span>
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
            <span class="rating-text">${t.rating}/5 (${t.ratingCount} học sinh đã đánh giá)</span>
          </div>

          <div class="tutor-desc">${t.desc}</div>
          <div class="tutor-bio">${shortBio}${showSeeMore ? ` <span class='see-more' onclick='showFullBio(${t.id})'>Xem thêm</span>` : ''}</div>
          <div class="tutor-achievements">
            ${Array.isArray(t.achievements) ? t.achievements.map(a => `<span class='badge'>${a}</span>`).join(' ') : ''}
          </div>
        </div>
        <div class="tutor-actions">
          <button class="btn-primary" onclick="bookTutor(${t.id})">Đặt lịch</button>
          <button class="btn-secondary" onclick="viewTutorDetail(${t.id})">Chi tiết</button>
        </div>
      </div>
    `;
  }).join('');
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
  
  let filteredTutors = tutors.filter(tutor => {
    const statusMatch = !statusFilter || tutor.status === statusFilter;
    const meetingTypeMatch = !meetingTypeFilter || tutor.meetingType === meetingTypeFilter;
    const nameMatch = !nameFilter || tutor.name.toLowerCase().includes(nameFilter);
    const subjectMatch = !subjectFilter || tutor.subject.toLowerCase().includes(subjectFilter);
    
    return statusMatch && meetingTypeMatch && nameMatch && subjectMatch;
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

// Gắn sự kiện modal đăng ký làm gia sư
function attachRegisterTutorModal() {
  const registerTutorForm = document.getElementById('registerTutorForm');
  if (registerTutorForm) {
    registerTutorForm.addEventListener('submit', handleRegisterTutor);
  }
  
  // Đóng modal khi click bên ngoài
  const modal = document.getElementById('registerTutorModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeRegisterTutorModal();
      }
    });
  }
  
  // Tự động điền thông tin khi mở modal
  const registerTutorBtn = document.getElementById('registerTutorBtn');
  const registerTutorBtn2 = document.getElementById('registerTutorBtn2');
  
  if (registerTutorBtn) {
    registerTutorBtn.onclick = function() {
      fillRegisterTutorForm();
      const modal = document.getElementById('registerTutorModal');
      if (modal) {
        modal.style.display = 'flex';
      }
    };
  }
  
  if (registerTutorBtn2) {
    registerTutorBtn2.onclick = function() {
      fillRegisterTutorForm();
      const modal = document.getElementById('registerTutorModal');
      if (modal) {
        modal.style.display = 'flex';
      }
    };
  }
  
  // Gắn sự kiện upload ảnh gia sư
  const photoInput = document.getElementById('tutorPhotoInput');
  if (photoInput) {
    photoInput.addEventListener('change', handleTutorPhotoUpload);
  }
}

// Điền thông tin vào form đăng ký
function fillRegisterTutorForm() {
  const nameInput = document.getElementById('regTutorName');
  const genderInput = document.getElementById('regTutorGender');
  const mssvInput = document.getElementById('regTutorMSSV');
  const phoneInput = document.getElementById('regTutorPhone');
  
  if (nameInput) {
    nameInput.value = 'Trần Minh Khoa';
    nameInput.readOnly = true;
    nameInput.classList.add('readonly');
  }
  
  if (genderInput) {
    genderInput.value = 'Nam';
    genderInput.disabled = true;
    genderInput.classList.add('readonly');
  }
  
  if (mssvInput) {
    mssvInput.value = '2374802010241';
    mssvInput.readOnly = true;
    mssvInput.classList.add('readonly');
  }
  
  if (phoneInput) {
    phoneInput.value = '0911728117';
    phoneInput.readOnly = true;
    phoneInput.classList.add('readonly');
  }
}

// Hàm chụp ảnh chứng chỉ
function captureCertificate(certName, side) {
  // Kiểm tra xem trình duyệt có hỗ trợ camera không
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Mở camera để chụp ảnh
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        // Tạo modal camera
        const cameraModal = document.createElement('div');
        cameraModal.className = 'camera-modal';
        cameraModal.innerHTML = `
          <div class="camera-container">
            <h3>Chụp ảnh ${side === 'front' ? 'mặt trước' : 'mặt sau'} - ${certName}</h3>
            <video id="camera-video" autoplay></video>
            <div class="camera-controls">
              <button type="button" class="btn-capture" onclick="takePhoto('${certName}', '${side}')">Chụp ảnh</button>
              <button type="button" class="btn-cancel" onclick="closeCamera()">Hủy</button>
            </div>
          </div>
        `;
        
        document.body.appendChild(cameraModal);
        
        const video = document.getElementById('camera-video');
        video.srcObject = stream;
        
        // Lưu stream để đóng camera sau
        window.currentStream = stream;
      })
      .catch(function(err) {
        console.log('Không thể truy cập camera:', err);
        alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera.');
      });
  } else {
    alert('Trình duyệt không hỗ trợ camera. Vui lòng sử dụng trình duyệt khác.');
  }
}

// Hàm chụp ảnh
function takePhoto(certName, side) {
  const video = document.getElementById('camera-video');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);
  
  // Chuyển canvas thành blob
  canvas.toBlob(function(blob) {
    // Hiển thị preview
    showCertificatePreview(certName, side, blob);
    
    // Đóng camera
    closeCamera();
  }, 'image/jpeg');
}

// Hàm đóng camera
function closeCamera() {
  const cameraModal = document.querySelector('.camera-modal');
  if (cameraModal) {
    cameraModal.remove();
  }
  
  if (window.currentStream) {
    window.currentStream.getTracks().forEach(track => track.stop());
    window.currentStream = null;
  }
}

// Hàm hiển thị preview ảnh
function showCertificatePreview(certName, side, blob) {
  const previewId = `${certName}-${side}-preview`;
  const preview = document.getElementById(previewId);
  
  if (preview) {
    const url = URL.createObjectURL(blob);
    preview.innerHTML = `<img src="${url}" alt="Certificate preview">`;
    preview.style.background = 'none';
    
    // Thêm sự kiện click để phóng to ảnh
    const img = preview.querySelector('img');
    if (img) {
      img.addEventListener('click', function() {
        showImageZoom(url);
      });
    }
  }
}



// Xử lý đăng ký làm gia sư
function handleRegisterTutor(e) {
  e.preventDefault();
  
  // Lấy dữ liệu từ form
  const bio = document.getElementById('regTutorBio').value.trim();
  const url = document.getElementById('regTutorURL').value.trim();
  const gpa = document.getElementById('regTutorGPA').value;
  
  if (!bio) {
    alert('Vui lòng nhập thông tin giới thiệu về bản thân!');
    return;
  }
  
  // Thu thập ảnh gia sư
  const tutorPhotos = uploadedTutorPhotos.map(photo => ({
    id: photo.id,
    file: photo.file,
    url: photo.url
  }));
  
  // Thu thập thông tin chứng chỉ
  const certificateData = [];
  const certificateRows = document.querySelectorAll('.certificate-table tbody tr');
  certificateRows.forEach(row => {
    const scoreInput = row.querySelector('input[type="text"], input[type="number"]');
    const dateInput = row.querySelector('input[type="date"]');
    const certName = row.cells[0].textContent;
    
    // Kiểm tra xem có ảnh được chụp không
    const frontPreview = document.getElementById(`${certName}-front-preview`);
    const backPreview = document.getElementById(`${certName}-back-preview`);
    
    const hasFrontImage = frontPreview && frontPreview.querySelector('img');
    const hasBackImage = backPreview && backPreview.querySelector('img');
    
    // Chỉ thêm chứng chỉ nếu có ít nhất một ảnh được chụp
    if (hasFrontImage || hasBackImage) {
      certificateData.push({
        name: certName,
        score: scoreInput ? scoreInput.value : '',
        date: dateInput ? dateInput.value : '',
        frontImage: hasFrontImage ? frontPreview.querySelector('img').src : null,
        backImage: hasBackImage ? backPreview.querySelector('img').src : null
      });
    }
  });
  
  // Tạo dữ liệu gia sư mới
  const newTutor = {
    id: tutors.length + 1,
    name: 'Trần Minh Khoa',
    status: 'available',
    subject: 'Lập trình hướng đối tượng',
    desc: bio,
    rating: 0,
    ratingCount: 0,
    students: 0,
    avatar: '👨‍🏫',
    meetingType: '1-1',
    onlineSupport: true,
    bio: bio,
    achievements: ['Gia sư mới'],
    photos: tutorPhotos,
    certificates: certificateData,
    email: 'khoa.2374802010241@vanlanguni.vn',
    phone: '0911728117',
    mssv: '2374802010241',
    gender: 'Nam',
    gpa: gpa || '3.8',
    url: url
  };
  
  // Thêm vào danh sách gia sư
  tutors.push(newTutor);
  
  // Lưu vào localStorage
  localStorage.setItem('tutors', JSON.stringify(tutors));
  
  // Hiển thị thông báo thành công
  alert('Đăng ký làm gia sư thành công! Bạn đã được chuyển sang giao diện gia sư.');
  
  // Đóng modal
  closeRegisterTutorModal();
  
  // Chuyển sang giao diện gia sư
  window.location.href = 'tutor-dashboard.html';
}

// Đóng modal đăng ký làm gia sư
function closeRegisterTutorModal() {
  const modal = document.getElementById('registerTutorModal');
  if (modal) {
    modal.style.display = 'none';
    // Reset form
    const form = document.getElementById('registerTutorForm');
    if (form) {
      form.reset();
      // Remove readonly styling
      const readonlyInputs = form.querySelectorAll('.readonly');
      readonlyInputs.forEach(input => {
        input.classList.remove('readonly');
        input.readOnly = false;
        input.disabled = false;
      });
    }
    
    // Reset ảnh đã upload
    uploadedTutorPhotos = [];
    renderTutorPhotos();
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

// Hàm showFullBio để hiện modal hoặc alert bio đầy đủ
function showFullBio(id) {
  const tutor = tutors.find(t => t.id === id);
  if (tutor) alert(tutor.bio);
}
window.showFullBio = showFullBio;

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
  attachRegisterTutorModal();
  renderLearnerNotifications();
}

document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra xem người dùng đã đăng ký làm gia sư chưa
  const savedTutors = localStorage.getItem('tutors');
  const isRegisteredAsTutor = savedTutors && JSON.parse(savedTutors).some(tutor => 
    tutor.email === 'khoa.2374802010241@vanlanguni.vn' || 
    tutor.mssv === '2374802010241'
  );
  
  // Hiển thị/ẩn nút đăng ký làm gia sư
  const registerTutorBtn = document.getElementById('registerTutorBtn');
  const registerTutorBtn2 = document.getElementById('registerTutorBtn2');
  
  if (registerTutorBtn) {
    if (isRegisteredAsTutor) {
      registerTutorBtn.textContent = 'Đã đăng ký làm gia sư';
      registerTutorBtn.disabled = true;
      registerTutorBtn.style.background = '#e9ecef';
      registerTutorBtn.style.color = '#6c757d';
      registerTutorBtn.style.cursor = 'not-allowed';
    } else {
      registerTutorBtn.textContent = 'Đăng ký làm gia sư';
      registerTutorBtn.disabled = false;
      registerTutorBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      registerTutorBtn.style.color = '#fff';
      registerTutorBtn.style.cursor = 'pointer';
    }
  }
  
  if (registerTutorBtn2) {
    if (isRegisteredAsTutor) {
      registerTutorBtn2.textContent = 'Đã đăng ký làm gia sư';
      registerTutorBtn2.disabled = true;
      registerTutorBtn2.style.background = '#e9ecef';
      registerTutorBtn2.style.color = '#6c757d';
      registerTutorBtn2.style.cursor = 'not-allowed';
    } else {
      registerTutorBtn2.textContent = 'Đăng ký làm gia sư';
      registerTutorBtn2.disabled = false;
      registerTutorBtn2.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      registerTutorBtn2.style.color = '#fff';
      registerTutorBtn2.style.cursor = 'pointer';
    }
  }
  
  const swapBtn = document.getElementById('swapRoleBtn');
  if (swapBtn) {
    swapBtn.onclick = function() {
      window.location.href = 'tutor-dashboard.html';
    };
  }
}); 

// Hàm hiển thị ảnh phóng to
function showImageZoom(imageUrl) {
  const zoomModal = document.createElement('div');
  zoomModal.className = 'image-zoom-modal';
  zoomModal.innerHTML = `
    <div class="zoom-image-container">
      <div class="zoom-close" onclick="closeImageZoom()">&times;</div>
      <img src="${imageUrl}" alt="Zoomed image" class="zoom-image">
    </div>
  `;
  
  document.body.appendChild(zoomModal);
  
  // Đóng modal khi click bên ngoài ảnh
  zoomModal.addEventListener('click', function(e) {
    if (e.target === zoomModal) {
      closeImageZoom();
    }
  });
}

// Hàm đóng ảnh phóng to
function closeImageZoom() {
  const zoomModal = document.querySelector('.image-zoom-modal');
  if (zoomModal) {
    zoomModal.remove();
  }
}

// Biến lưu trữ ảnh gia sư đã upload
let uploadedTutorPhotos = [];

// Hàm xử lý upload ảnh gia sư
function handleTutorPhotoUpload(event) {
  const files = event.target.files;
  const maxPhotos = 3;
  
  if (uploadedTutorPhotos.length + files.length > maxPhotos) {
    alert(`Bạn chỉ có thể upload tối đa ${maxPhotos} ảnh!`);
    return;
  }
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ chọn file ảnh!');
      continue;
    }
    
    if (uploadedTutorPhotos.length >= maxPhotos) {
      break;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoData = {
        id: Date.now() + i,
        file: file,
        url: e.target.result
      };
      
      uploadedTutorPhotos.push(photoData);
      renderTutorPhotos();
    };
    
    reader.readAsDataURL(file);
  }
  
  // Reset input
  event.target.value = '';
}

// Hàm render ảnh gia sư đã upload
function renderTutorPhotos() {
  const uploadedPhotosContainer = document.getElementById('uploadedPhotos');
  const photoUploadArea = document.getElementById('photoUploadArea');
  
  if (!uploadedPhotosContainer) return;
  
  uploadedPhotosContainer.innerHTML = '';
  
  uploadedTutorPhotos.forEach((photo, index) => {
    const photoElement = document.createElement('div');
    photoElement.className = 'uploaded-photo';
    photoElement.innerHTML = `
      <img src="${photo.url}" alt="Tutor photo ${index + 1}" onclick="showImageZoom('${photo.url}')" style="width: 100%; height: 100%; object-fit: cover;">
      <button type="button" class="photo-remove-btn" onclick="removeTutorPhoto(${photo.id})">&times;</button>
    `;
    uploadedPhotosContainer.appendChild(photoElement);
  });
  
  // Ẩn/hiện upload area dựa trên số lượng ảnh
  if (uploadedTutorPhotos.length >= 3) {
    photoUploadArea.classList.add('hidden');
  } else {
    photoUploadArea.classList.remove('hidden');
  }
}

// Hàm xóa ảnh gia sư
function removeTutorPhoto(photoId) {
  uploadedTutorPhotos = uploadedTutorPhotos.filter(photo => photo.id !== photoId);
  renderTutorPhotos();
} 