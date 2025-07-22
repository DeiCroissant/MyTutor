// --- Dữ liệu mẫu cho cài đặt ---
const supportCenterSettings = {
    avatar: 'TT',
    name: 'Nguyễn Thiện D',
    phone: '0987654321',
    itemsPerPage: 20,
    supportEmail: 'support.mytutor@vanlanguni.edu.vn'
};

// --- CÁC HÀM XỬ LÝ CHÍNH ---

// Hàm chuyển tab
function switchTab(event) {
  event.preventDefault();
  
  // Bỏ active ở tất cả các link
  document.querySelectorAll('.nav a').forEach(link => link.classList.remove('active'));
  // Thêm active cho link được click
  event.currentTarget.classList.add('active');
  
  // Ẩn tất cả các section
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
  
  // Hiển thị section tương ứng
  const targetId = event.currentTarget.getAttribute('href').substring(1);
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
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
    const form = document.getElementById('passwordForm');
    if(form) form.reset();
  }
}

// Đăng xuất
function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    window.location.href = './index.html'; // Chuyển về trang đăng nhập
  }
}

// --- CÁC HÀM MỚI CHO TAB CÀI ĐẶT ---

// Hàm thay đổi avatar
function handleAvatarChange(newAvatar) {
    supportCenterSettings.avatar = newAvatar;
    
    // Cập nhật hiển thị
    const currentAvatarDisplay = document.getElementById('currentAvatarDisplay');
    if (currentAvatarDisplay) currentAvatarDisplay.textContent = newAvatar;
    
    // Cập nhật avatar ở header
    const headerAvatar = document.querySelector('.header .avatar');
    if (headerAvatar) headerAvatar.textContent = newAvatar;
    
    // Cập nhật trạng thái selected
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.avatar === newAvatar) {
            option.classList.add('selected');
        }
    });
    
    alert('Ảnh đại diện đã được cập nhật!');
}

// Gắn các sự kiện cho tab Cài đặt
function attachSettingsEvents() {
    // Sự kiện cho form thông tin cá nhân
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            supportCenterSettings.name = document.getElementById('profileName').value;
            supportCenterSettings.phone = document.getElementById('profilePhone').value;
            alert('Cập nhật thông tin cá nhân thành công!');
        });
    }

    // Sự kiện cho form cài đặt hệ thống
    const systemSettingsForm = document.getElementById('systemSettingsForm');
    if(systemSettingsForm) {
        systemSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            supportCenterSettings.itemsPerPage = document.getElementById('itemsPerPage').value;
            supportCenterSettings.supportEmail = document.getElementById('supportEmail').value;
            alert('Cập nhật cài đặt hệ thống thành công!');
        });
    }

    // Sự kiện cho các lựa chọn avatar
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleAvatarChange(this.dataset.avatar);
        });
    });

    // Sự kiện cho nút chuyển đổi vai trò
    const switchRoleBtn = document.getElementById('switchRoleBtn');
    if (switchRoleBtn) {
        switchRoleBtn.addEventListener('click', function() {
            const roleSwitcher = document.getElementById('role-switcher');
            const selectedRole = roleSwitcher.value;
            let targetPage = '';

            if (selectedRole === 'learner') {
                targetPage = './dashboard.html';
            } else if (selectedRole === 'tutor') {
                targetPage = './tutor-dashboard.html';
            }

            if (targetPage) {
                if (confirm(`Bạn có muốn chuyển sang giao diện ${selectedRole === 'learner' ? 'Sinh Viên' : 'Gia Sư'}?`)) {
                    window.open(targetPage, '_blank');
                }
            }
        });
    }
}

// --- KHỞI TẠO KHI TẢI TRANG ---
document.addEventListener('DOMContentLoaded', function() {
    // --- Gắn các sự kiện cho các thành phần chính ---

    // Xử lý đổi mật khẩu
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            alert('Mật khẩu đã được thay đổi thành công!');
            closePasswordModal();
        });
    }
    
    // Đóng modal khi click ra ngoài
    const passwordModal = document.getElementById('passwordModal');
    if (passwordModal) {
        passwordModal.addEventListener('click', function(e) {
            if (e.target === passwordModal) {
                closePasswordModal();
            }
        });
    }

    // Gắn các sự kiện cho tab cài đặt
    attachSettingsEvents();
    
    // --- Hiển thị dữ liệu ban đầu cho các bảng ---

    // Hiển thị danh sách chờ duyệt
    renderTutorApprovalList();
    
    // Hiển thị lịch phỏng vấn
    renderInterviewSchedule();

    // Thiết lập trạng thái ban đầu cho avatar được chọn trong Cài đặt
    const initialAvatar = document.querySelector(`.avatar-option[data-avatar="${supportCenterSettings.avatar}"]`);
    if (initialAvatar) {
        initialAvatar.classList.add('selected');
    }
});
// --- LOGIC MỚI CHO CHỨC NĂNG XÉT DUYỆT GIA SƯ ---

/**
 * Hiển thị danh sách các gia sư đang chờ duyệt ra bảng
 */
function renderTutorApprovalList() {
    const tbody = document.getElementById('tutor-approval-tbody');
    if (!tbody) return;

    // Kiểm tra xem có hồ sơ chờ duyệt không
    if (pendingTutors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Không có hồ sơ mới nào.</td></tr>`;
        return;
    }

    // Tạo các hàng của bảng từ dữ liệu
    tbody.innerHTML = pendingTutors.map(tutor => `
        <tr>
            <td>${tutor.id}</td>
            <td>${tutor.name}</td>
            <td>${tutor.subject}</td>
            <td>
                <button class="btn-secondary" onclick="viewTutorDetails(${tutor.id})">Xem</button>
                <button class="btn-primary" onclick="approveTutor(${tutor.id})">Duyệt</button>
                <button class="btn-danger" onclick="rejectTutor(${tutor.id})">Từ chối</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Hiển thị thông tin chi tiết của một ứng viên trong modal
 * @param {number} tutorId ID của gia sư cần xem
 */
function viewTutorDetails(tutorId) {
    const tutor = pendingTutors.find(t => t.id === tutorId);
    if (!tutor) return;

    const modal = document.getElementById('approvalDetailModal');
    const modalContent = document.getElementById('modalDetailContent');

    if (modal && modalContent) {
        modalContent.innerHTML = `
            <h3>Chi tiết hồ sơ ứng viên</h3>
            <div class="profile-item"><span class="profile-label">ID:</span><span class="profile-value">${tutor.id}</span></div>
            <div class="profile-item"><span class="profile-label">Họ tên:</span><span class="profile-value">${tutor.name}</span></div>
            <div class="profile-item"><span class="profile-label">MSSV:</span><span class="profile-value">${tutor.mssv}</span></div>
            <div class="profile-item"><span class="profile-label">Môn đăng ký:</span><span class="profile-value">${tutor.subject}</span></div>
            <div class="profile-item"><span class="profile-label">GPA:</span><span class="profile-value">${tutor.gpa} / 4.0</span></div>
            <div class="profile-item"><span class="profile-label">Số điện thoại:</span><span class="profile-value">${tutor.phone}</span></div>
            <div class="profile-item"><span class="profile-label">Ngày nộp:</span><span class="profile-value">${tutor.applyDate}</span></div>
        `;
        modal.classList.add('show');
    }
}

/**
 * Đóng modal chi tiết
 */
function closeDetailModal() {
    const modal = document.getElementById('approvalDetailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * Xử lý khi duyệt một hồ sơ
 * @param {number} tutorId ID của gia sư được duyệt
 */
function approveTutor(tutorId) {
    if (confirm('Bạn có chắc chắn muốn DUYỆT hồ sơ này? \nHồ sơ sẽ được chuyển sang danh sách gia sư chính thức.')) {
        const index = pendingTutors.findIndex(t => t.id === tutorId);
        if (index > -1) {
            // Lấy thông tin gia sư được duyệt
            const approvedTutorData = pendingTutors[index];
            
            // Xóa khỏi danh sách chờ duyệt
            pendingTutors.splice(index, 1);
            
            // Thêm vào danh sách gia sư chính thức (biến `tutors` từ file data.js)
            tutors.push({
                id: tutors.length + 1, // Tạo ID mới
                name: approvedTutorData.name,
                status: 'available',
                subject: approvedTutorData.subject,
                price: 150000, // Giá mặc định, có thể thay đổi sau
                desc: `Gia sư mới, GPA: ${approvedTutorData.gpa}.`,
                rating: 0,
                students: 0,
                avatar: '🧑‍🏫',
                meetingType: '1-1',
                onlineSupport: true
            });

            alert('Đã duyệt hồ sơ thành công!');
            renderTutorApprovalList(); // Cập nhật lại bảng
        }
    }
}

/**
 * Xử lý khi từ chối một hồ sơ
 * @param {number} tutorId ID của gia sư bị từ chối
 */
function rejectTutor(tutorId) {
    const reason = prompt('Vui lòng nhập lý do từ chối hồ sơ này:');
    if (reason) {
        const index = pendingTutors.findIndex(t => t.id === tutorId);
        if (index > -1) {
            // Xóa hồ sơ khỏi danh sách chờ duyệt
            pendingTutors.splice(index, 1);
            alert(`Đã từ chối hồ sơ. Lý do: ${reason}`);
            renderTutorApprovalList(); // Cập nhật lại bảng
        }
    }
}

// --- LOGIC MỚI CHO CHỨC NĂNG LỊCH PHỎNG VẤN ---

/**
 * Hiển thị danh sách các lịch phỏng vấn đã lên lịch ra bảng
 */
function renderInterviewSchedule() {
    const tbody = document.getElementById('interview-schedule-tbody');
    if (!tbody) return;

    // Kiểm tra xem có dữ liệu phỏng vấn không
    if (!window.interviews || interviews.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Chưa có lịch phỏng vấn nào.</td></tr>`;
        return;
    }

    // Sắp xếp các cuộc phỏng vấn theo ngày gần nhất trước
    const sortedInterviews = interviews.sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

    // Tạo các hàng của bảng từ dữ liệu
    tbody.innerHTML = sortedInterviews.map(interview => {
        const interviewDate = new Date(interview.interviewDate);
        // Định dạng ngày và giờ theo kiểu Việt Nam
        const formattedDate = interviewDate.toLocaleDateString('vi-VN');
        const formattedTime = interviewDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        // Xác định class cho trạng thái để tạo màu sắc khác nhau
        let statusClass = '';
        if (interview.status === 'Đã hoàn thành') {
            statusClass = 'status-completed';
        } else if (interview.status === 'Đã lên lịch') {
            statusClass = 'status-scheduled';
        }

        return `
            <tr>
                <td>${interview.tutorName}</td>
                <td>${interview.subject}</td>
                <td>${formattedTime} - ${formattedDate}</td>
                <td><span class="status ${statusClass}">${interview.status}</span></td>
            </tr>
        `;
    }).join('');
}