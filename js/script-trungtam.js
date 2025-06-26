// Script logic (từ script-trungtam.js)
    function switchTab(event) {
      event.preventDefault();
      document.querySelectorAll('.nav a').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
      const clickedTab = event.currentTarget;
      const sectionId = clickedTab.getAttribute('href');
      clickedTab.classList.add('active');
      document.querySelector(sectionId).classList.add('active');
    }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    function openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    function openTutorModal(tutorId) {
        const tutor = tutors.find(t => t.id === tutorId);
        if (!tutor) return;
        document.getElementById('tutorModalTitle').innerText = `Hồ sơ ứng viên: ${tutor.name}`;
        document.getElementById('tutorModalBody').innerHTML = `
            <p><strong>ID:</strong> SV${tutor.id.toString().padStart(3, '0')}</p>
            <p><strong>Môn đăng ký:</strong> ${tutor.subject}</p>
            <p><strong>Mô tả:</strong> ${tutor.desc}</p>
        `;
        openModal('tutorModal');
    }

    function approveTutor() {
        alert('Hồ sơ đã được phê duyệt!');
        closeModal('tutorModal');
    }

    function rejectTutor() {
        if (confirm('Bạn có chắc muốn từ chối hồ sơ này?')) {
            alert('Hồ sơ đã bị từ chối.');
            closeModal('tutorModal');
        }
    }

    function openCourseModal(tutorId) {
        const tutor = tutors.find(t => t.id === tutorId);
        if (!tutor) return;
        document.getElementById('courseModalTitle').innerText = `Xem xét khóa học: ${tutor.subject}`;
        document.getElementById('courseModalBody').innerHTML = `
            <p><strong>Gia sư đề xuất:</strong> ${tutor.name}</p>
            <div class="form-group">
                <label for="adjustedPrice">Học phí đề xuất: ${tutor.price.toLocaleString()}đ. Điều chỉnh nếu cần:</label>
                <input type="number" id="adjustedPrice" value="${tutor.price}">
            </div>
        `;
        openModal('courseModal');
    }

    function approveCourse() {
        if (confirm('Bạn có chắc chắn muốn đăng tải khóa học này không?')) {
            alert('Khóa học đã được phê duyệt và đăng tải!');
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

    function renderTutorApprovalTable() {
        const tbody = document.getElementById('tutor-approval-tbody');
        if (!tbody) return;
        let content = '';
        tutors.slice(0, 3).forEach(tutor => {
            content += `
                <tr>
                    <td>SV${tutor.id.toString().padStart(3, '0')}</td>
                    <td>${tutor.name}</td>
                    <td>${tutor.subject}</td>
                    <td><span class="status pending">Chờ duyệt</span></td>
                    <td><button class="btn-primary" onclick="openTutorModal(${tutor.id})">Xem hồ sơ</button></td>
                </tr>`;
        });
        tbody.innerHTML = content;
    }

    function renderCourseApprovalTable() {
        const tbody = document.getElementById('course-approval-tbody');
        if (!tbody) return;
        let content = '';
        tutors.forEach(tutor => {
            content += `
                <tr>
                    <td>${tutor.subject}</td>
                    <td>${tutor.name}</td>
                    <td>${tutor.price.toLocaleString()}đ</td>
                    <td><span class="status pending">Chờ duyệt</span></td>
                    <td><button class="btn-primary" onclick="openCourseModal(${tutor.id})">Xem xét</button></td>
                </tr>`;
        });
        tbody.innerHTML = content;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const firstTab = document.querySelector('.nav a');
        if (firstTab) firstTab.click();
        renderTutorApprovalTable();
        renderCourseApprovalTable();
    });