// Tệp: script-trungtam.js (PHIÊN BẢN HOÀN CHỈNH)

/**
 * CHỨC NĂNG CHUNG
 */
function switchTab(event) {
  event.preventDefault();
  document.querySelectorAll('.nav a').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  const clickedTab = event.currentTarget;
  const sectionId = clickedTab.getAttribute('href');
  clickedTab.classList.add('active');
  const activeSection = document.querySelector(sectionId);
  if (activeSection) activeSection.classList.add('active');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

/**
 * CHỨC NĂNG XÉT DUYỆT GIA SƯ
 */
function openTutorModal(tutorId) {
    const tutor = tutors.find(t => t.id === tutorId);
    if (!tutor) return;

    document.getElementById('tutorModalTitle').innerText = `Hồ sơ ứng viên: ${tutor.name}`;
    document.getElementById('tutorModalBody').innerHTML = `<p><strong>ID:</strong> SV${tutor.id.toString().padStart(3, '0')}</p><p><strong>Môn đăng ký:</strong> ${tutor.subject}</p><p><strong>Mô tả:</strong> ${tutor.desc}</p>`;
    
    const modalActions = document.getElementById('tutorModalActions');
    modalActions.innerHTML = `<button class="btn-primary" onclick="openScheduleModal(${tutor.id}, '${tutor.name}')">Tạo lịch phỏng vấn</button><button class="btn-danger" onclick="rejectTutor(${tutor.id})">Từ chối hồ sơ</button><button class="btn-secondary" onclick="closeModal('tutorModal')">Đóng</button>`;
    
    openModal('tutorModal');
}

function openScheduleModal(tutorId, tutorName) {
    closeModal('tutorModal');
    document.getElementById('scheduleModalTitle').innerText = `Tạo lịch phỏng vấn cho: ${tutorName}`;
    document.getElementById('send-schedule-btn').dataset.tutorId = tutorId;
    openModal('scheduleModal');
}

function sendInterviewSchedule() {
    const interviewTime = document.getElementById('interview-datetime').value;
    if (!interviewTime) {
        alert('Vui lòng chọn ngày và giờ phỏng vấn!');
        return;
    }
    const tutorId = parseInt(document.getElementById('send-schedule-btn').dataset.tutorId);
    const tutor = tutors.find(t => t.id === tutorId);
    interviews.push({ tutorId: tutor.id, tutorName: tutor.name, subject: tutor.subject, interviewDate: interviewTime, status: 'Đã lên lịch' });
    tutors = tutors.filter(t => t.id !== tutorId);
    alert(`Đã gửi lịch phỏng vấn cho ${tutor.name} vào lúc: ${new Date(interviewTime).toLocaleString('vi-VN')}`);
    closeModal('scheduleModal');
    renderTutorApprovalTable();
    renderInterviewScheduleTable();
}

function rejectTutor(tutorId) {
    if (confirm('Bạn có chắc chắn muốn từ chối hồ sơ này? Thao tác này không thể hoàn tác.')) {
        tutors = tutors.filter(t => t.id !== tutorId);
        renderTutorApprovalTable();
        alert('Hồ sơ đã bị từ chối.');
        closeModal('tutorModal');
    }
}

/**
 * === ĐÃ BỔ SUNG CÁC HÀM CÒN THIẾU CHO XÉT DUYỆT KHÓA HỌC ===
 */
function openCourseModal(tutorId) {
    const tutor = tutors.find(t => t.id === tutorId);
    if (!tutor) return;

    document.getElementById('courseModalTitle').innerText = `Xem xét khóa học: ${tutor.subject}`;
    document.getElementById('courseModalBody').innerHTML = `
        <p><strong>Gia sư đề xuất:</strong> ${tutor.name}</p>
        <div class="form-group">
            <label for="adjustedPrice">Học phí đề xuất: ${tutor.price.toLocaleString()}đ. Điều chỉnh nếu cần:</label>
            <input type="number" id="adjustedPrice" value="${tutor.price}" class="form-control">
        </div>
    `;
    openModal('courseModal');
}

function approveCourse() {
    if (confirm('Bạn có chắc chắn muốn đăng tải khóa học này không?')) {
        alert('Khóa học đã được phê duyệt và đăng tải thành công!');
        closeModal('courseModal');
    }
}

function requestRevision() {
    closeModal('courseModal');
    openModal('revisionModal');
}

function sendFeedback() {
    alert('Phản hồi đã được gửi cho gia sư.');
    closeModal('revisionModal');
}


/**
 * HÀM RENDER
 */
function renderTutorApprovalTable() {
    const tbody = document.getElementById('tutor-approval-tbody');
    if (!tbody) return;
    if(tutors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Không có hồ sơ nào chờ duyệt.</td></tr>';
        return;
    }
    tbody.innerHTML = tutors.map(tutor => `<tr><td>SV${tutor.id.toString().padStart(3, '0')}</td><td>${tutor.name}</td><td>${tutor.subject}</td><td><button class="btn-primary" onclick="openTutorModal(${tutor.id})">Xem hồ sơ</button></td></tr>`).join('');
}

function renderInterviewScheduleTable() {
    const tbody = document.getElementById('interview-schedule-tbody');
    if (!tbody) return;
    if(interviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Chưa có lịch phỏng vấn nào được tạo.</td></tr>';
        return;
    }
    tbody.innerHTML = interviews.map(item => {
        const interviewDate = new Date(item.interviewDate);
        const statusClass = item.status === 'Đã hoàn thành' ? 'approved' : 'pending';
        return `<tr><td>${item.tutorName}</td><td>${item.subject}</td><td>${interviewDate.toLocaleString('vi-VN')}</td><td><span class="status ${statusClass}">${item.status}</span></td></tr>`;
    }).join('');
}

// === HÀM RENDER BỊ THIẾU TRƯỚC ĐÓ ===
function renderCourseApprovalTable() {
    const tbody = document.getElementById('course-approval-tbody');
    if (!tbody || typeof tutors === 'undefined') return;

    tbody.innerHTML = tutors.map(tutor => `
        <tr>
            <td>${tutor.subject}</td>
            <td>${tutor.name}</td>
            <td>${tutor.price.toLocaleString()}đ</td>
            <td><span class="status pending">Chờ duyệt</span></td>
            <td><button class="btn-primary" onclick="openCourseModal(${tutor.id})">Xem xét</button></td>
        </tr>
    `).join('');
}


/**
 * KHỞI TẠO KHI TRANG ĐƯỢC TẢI
 */
document.addEventListener('DOMContentLoaded', () => {
    const firstTab = document.querySelector('.nav a');
    if (firstTab) firstTab.click();
    
    // Gọi tất cả các hàm render
    renderTutorApprovalTable();
    renderInterviewScheduleTable();
    renderCourseApprovalTable(); // Đã thêm lệnh gọi hàm này
});