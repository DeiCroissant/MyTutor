// js/script-trungtam.js

// DỮ LIỆU CÀI ĐẶT (Phần này nhỏ nên có thể giữ lại ở đây)
const supportCenterSettings = {
    avatar: 'TT',
    name: 'Nguyễn Thiện D',
    phone: '0987654321',
    itemsPerPage: 20,
    supportEmail: 'support.mytutor@vanlanguni.edu.vn'
};

// =================================================================
// ĐỊNH NGHĨA CÁC HÀM
// =================================================================

/**
 * Chuyển đổi giữa các tab (section)
 * @param {string} targetId ID của section cần hiển thị
 */
function switchTab(targetId) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.style.display = 'none';
    });
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// ... (Toàn bộ các hàm xử lý khác như changePassword, renderTutorApprovalList, renderInterviewSchedule, v.v... giữ nguyên như phiên bản trước)
// --- CÁC HÀM XỬ LÝ CHUNG ---
function changePassword() {
  const modal = document.getElementById('passwordModal');
  if (modal) modal.classList.add('show');
}

function closePasswordModal() {
  const modal = document.getElementById('passwordModal');
  if (modal) modal.classList.remove('show');
}

function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    window.location.href = './index.html';
  }
}

/**
 * Format ngày tháng từ YYYY-MM-DD sang DD/MM/YYYY
 * @param {string} dateString Chuỗi ngày tháng dạng YYYY-MM-DD
 * @returns {string} Chuỗi ngày tháng dạng DD/MM/YYYY
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Format ngày tháng đẹp cho hiển thị trong bảng
 * @param {string} dateString Chuỗi ngày tháng dạng YYYY-MM-DD
 * @returns {string} Chuỗi ngày tháng dạng "DD/MM/YYYY"
 */
function formatDateForDisplay(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// --- CÁC HÀM XỬ LÝ CHO TAB "XÉT DUYỆT GIA SƯ" ---
function renderTutorApprovalList() {
    const tbody = document.getElementById('tutor-approval-tbody');
    if (!tbody) return;
    if (typeof pendingTutors === 'undefined' || pendingTutors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">Không có hồ sơ mới nào.</td></tr>`;
        return;
    }
    tbody.innerHTML = pendingTutors.map(tutor => `
        <tr>
            <td>${tutor.id}</td>
            <td>${tutor.name}</td>
            <td>${tutor.subject}</td>
            <td>${formatDateForDisplay(tutor.applyDate)}</td>
            <td>
                <button class="btn-secondary" onclick="viewTutorDetails(${tutor.id})">Xem</button>
                <button class="btn-primary" onclick="approveTutor(${tutor.id})">Duyệt</button>
                <button class="btn-danger" onclick="rejectTutor(${tutor.id})">Từ chối</button>
            </td>
        </tr>
    `).join('');
}

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
            <div class="profile-item"><span class="profile-label">Giới tính:</span><span class="profile-value">${tutor.gender || 'Nam'}</span></div>
            <div class="profile-item"><span class="profile-label">MSSV:</span><span class="profile-value">${tutor.mssv}</span></div>
            <div class="profile-item"><span class="profile-label">GPA:</span><span class="profile-value">${tutor.gpa} / 4.0</span></div>
            <div class="profile-item"><span class="profile-label">Số điện thoại:</span><span class="profile-value">${tutor.phone}</span></div>
            <div class="profile-item"><span class="profile-label">Bio:</span><span class="profile-value">${tutor.bio || 'Giới thiệu về bản thân, kinh nghiệm, phong cách dạy...'}</span></div>
            <div class="profile-item"><span class="profile-label">URL Link:</span><span class="profile-value">${tutor.url || 'https://example.com'}</span></div>
            <div class="profile-item"><span class="profile-label">Chứng chỉ:</span><span class="profile-value">${tutor.certificate || 'IELTS'}</span></div>
            <div class="profile-item"><span class="profile-label">Môn đăng ký:</span><span class="profile-value">${tutor.subject}</span></div>
            <div class="profile-item"><span class="profile-label">Thời gian phỏng vấn:</span><span class="profile-value">${tutor.interviewTime || 'Chưa chọn'}</span></div>
            <div class="profile-item"><span class="profile-label">Ngày nộp hồ sơ:</span><span class="profile-value">${formatDateForDisplay(tutor.applyDate)}</span></div>
        `;
        modal.classList.add('show');
    }
}

function closeDetailModal() {
    document.getElementById('approvalDetailModal').classList.remove('show');
}

function approveTutor(tutorId) {
    if (!confirm('Bạn có chắc chắn muốn DUYỆT hồ sơ này?')) return;
    const index = pendingTutors.findIndex(t => t.id === tutorId);
    if (index > -1) {
        const approvedTutorData = pendingTutors.splice(index, 1)[0];
        tutors.push({
            id: tutors.length + 1, name: approvedTutorData.name, status: 'available',
            subject: approvedTutorData.subject, price: 150000, desc: `Gia sư mới, GPA: ${approvedTutorData.gpa}.`,
            rating: 0, students: 0, avatar: '🧑‍🏫', meetingType: '1-1', onlineSupport: true
        });
        alert('Đã duyệt hồ sơ thành công!');
        renderTutorApprovalList();
    }
    renderUnscheduledTutors(); // THÊM DÒNG NÀY
}

function rejectTutor(tutorId) {
    const reason = prompt('Vui lòng nhập lý do từ chối hồ sơ này:');
    if (reason) {
        const index = pendingTutors.findIndex(t => t.id === tutorId);
        if (index > -1) {
            pendingTutors.splice(index, 1);
            alert(`Đã từ chối hồ sơ. Lý do: ${reason}`);
            renderTutorApprovalList();
        }
    }
    renderUnscheduledTutors(); // THÊM DÒNG NÀY
}

/**
 * Mở modal để lên lịch phỏng vấn cho một ứng viên
 * @param {number} tutorId ID của ứng viên
 */
function openScheduleModal(tutorId) {
    const modal = document.getElementById('scheduleInterviewModal');
    if (modal) {
        // Gán ID của gia sư vào một trường ẩn trong form
        document.getElementById('scheduleTutorId').value = tutorId;
        modal.classList.add('show');
    }
}

/**
 * Đóng modal lên lịch phỏng vấn
 */
function closeScheduleModal() {
    const modal = document.getElementById('scheduleInterviewModal');
    if (modal) {
        modal.classList.remove('show');
        // Xóa các giá trị đã nhập trong form
        document.getElementById('scheduleInterviewForm').reset();
    }
}

/**
 * Hiển thị danh sách các ứng viên chưa được lên lịch phỏng vấn
 */
function renderUnscheduledTutors() {
    const tbody = document.getElementById('unscheduled-tutors-tbody');
    if (!tbody) return;

    // Lấy ID của tất cả các ứng viên đã có lịch phỏng vấn
    const scheduledTutorIds = interviews.map(interview => interview.tutorId);

    // Lọc ra những ứng viên trong danh sách chờ duyệt NHƯNG chưa có trong danh sách đã lên lịch
    const unscheduledTutors = pendingTutors.filter(tutor => !scheduledTutorIds.includes(tutor.id));

    if (unscheduledTutors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Tất cả ứng viên đã được lên lịch.</td></tr>`;
        return;
    }

    tbody.innerHTML = unscheduledTutors.map(tutor => `
        <tr>
            <td>${tutor.name}</td>
            <td>${tutor.subject}</td>
            <td>${formatDateForDisplay(tutor.applyDate)}</td>
            <td>
                <button class="btn-schedule" onclick="openScheduleModal(${tutor.id})">Lên lịch</button>
            </td>
        </tr>
    `).join('');
}

// --- CÁC HÀM XỬ LÝ CHO TAB "LỊCH PHỎNG VẤN" ---
function renderInterviewSchedule() {
    const tbody = document.getElementById('interview-schedule-tbody');
    if (!tbody) return;
    if (typeof interviews === 'undefined' || interviews.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px;">Chưa có lịch phỏng vấn nào.</td></tr>`;
        return;
    }
    const sortedInterviews = [...interviews].sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));
    tbody.innerHTML = sortedInterviews.map(interview => {
        const interviewDate = new Date(interview.interviewDate);
        const formattedDate = interviewDate.toLocaleDateString('vi-VN');
        const formattedTime = interviewDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        let statusClass = interview.status === 'Đã hoàn thành' ? 'status-completed' : 'status-scheduled';
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

// --- CÁC HÀM XỬ LÝ CHO TAB "CÀI ĐẶT" ---
function handleAvatarChange(newAvatar) {
    supportCenterSettings.avatar = newAvatar;
    document.getElementById('currentAvatarDisplay').textContent = newAvatar;
    document.querySelector('.header .avatar').textContent = newAvatar;
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.avatar === newAvatar) {
            option.classList.add('selected');
        }
    });
}

function attachSettingsEvents() {
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => handleAvatarChange(option.dataset.avatar));
    });

    document.getElementById('switchRoleBtn').addEventListener('click', function() {
        const selectedRole = document.getElementById('role-switcher').value;
        const targetPage = selectedRole === 'learner' ? './dashboard.html' : './tutor-dashboard.html';
        if (confirm(`Bạn có muốn chuyển sang giao diện ${selectedRole === 'learner' ? 'Sinh Viên' : 'Gia Sư'}?`)) {
            window.open(targetPage, '_blank');
        }
    });
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

// =================================================================
// SỰ KIỆN CHÍNH KHI TRANG ĐƯỢC TẢI
// =================================================================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            switchTab(targetId);
        });
    });

    const firstTab = document.querySelector('.nav a.active');
    if (firstTab) {
        switchTab(firstTab.getAttribute('href').substring(1));
    }

    attachSettingsEvents();
    renderTutorApprovalList();
    renderInterviewSchedule();
    renderUnscheduledTutors();

    const initialAvatar = document.querySelector(`.avatar-option[data-avatar="${supportCenterSettings.avatar}"]`);
    if (initialAvatar) initialAvatar.classList.add('selected');
    // Xử lý sự kiện submit form lên lịch phỏng vấn
    const scheduleForm = document.getElementById('scheduleInterviewForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Ngăn form tải lại trang

            const tutorId = parseInt(document.getElementById('scheduleTutorId').value);
            const scheduleDate = document.getElementById('scheduleDate').value;
            const scheduleTime = document.getElementById('scheduleTime').value;

            if (!scheduleDate || !scheduleTime) {
                alert('Vui lòng chọn đầy đủ ngày và giờ phỏng vấn.');
                return;
            }

            // Tìm thông tin ứng viên từ danh sách chờ
            const tutorInfo = pendingTutors.find(t => t.id === tutorId);
            if (!tutorInfo) {
                alert('Không tìm thấy thông tin ứng viên!');
                return;
            }

            // Tạo một đối tượng lịch phỏng vấn mới
            const newInterview = {
                tutorId: tutorInfo.id,
                tutorName: tutorInfo.name,
                subject: tutorInfo.subject,
                interviewDate: `${scheduleDate}T${scheduleTime}`, // Ghép ngày và giờ thành định dạng ISO
                status: 'Đã lên lịch'
            };

            // Thêm vào mảng interviews
            interviews.push(newInterview);

            alert(`Đã lên lịch phỏng vấn cho ${tutorInfo.name} thành công!`);
            closeScheduleModal(); // Đóng modal
            renderInterviewSchedule(); // Cập nhật lại bảng lịch phỏng vấn để hiển thị ngay lập tức
        });
    }

    // Gọi hàm renderSupportcenterInbox khi chuyển tab hộp thư
    if (document.getElementById('inbox-supportcenter-menu')) {
      document.getElementById('inbox-supportcenter-menu').addEventListener('click', function() {
        setTimeout(renderSupportcenterInbox, 100);
      });
    }
});