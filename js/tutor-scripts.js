// =============================
// Tutor Dashboard Main Functions
// =============================

// 1. Hiển thị thông tin hồ sơ gia sư
function renderTutorProfile() {
    // Lấy tutor đầu tiên (sau này có thể lấy theo id đăng nhập)
    const tutor = tutors && tutors.length > 0 ? tutors[0] : null;
    if (!tutor) return;
    // Header
    const avatarHeader = document.getElementById('tutor-avatar');
    const greeting = document.getElementById('tutor-greeting');
    if (avatarHeader) avatarHeader.textContent = tutor.avatar;
    if (greeting) greeting.innerHTML = `Chào, <b>${tutor.name}</b>`;
    // Render vào các thẻ profile-value
    document.getElementById('tutorName').textContent = tutor.name;
    document.getElementById('tutorEmail').textContent = tutor.email || '—';
    document.getElementById('tutorPhone').textContent = tutor.phone || '—';
    document.getElementById('tutorSubject').textContent = tutor.subject;
    document.getElementById('tutorPrice').textContent = tutor.price ? tutor.price.toLocaleString() + 'đ' : '—';
    document.getElementById('tutorDesc').textContent = tutor.desc;
    document.getElementById('tutorRating').innerHTML = `${'★'.repeat(Math.round(tutor.rating))}${'☆'.repeat(5-Math.round(tutor.rating))} (${tutor.rating}/5)`;
    document.getElementById('tutorStatus').textContent = tutor.status === 'available' ? 'Đang rảnh' : 'Đang bận';
    document.getElementById('tutorOnline').textContent = tutor.onlineSupport ? 'Có' : 'Không';
}

// 2. Hiển thị lịch dạy của gia sư
function renderTeachingSchedule() {
    const scheduleSection = document.getElementById('section-schedule');
    if (!scheduleSection || !tutors || !schedule) return;

    // Lấy tutor hiện tại (tạm thời là tutors[0])
    const tutor = tutors[0];
    if (!tutor) return;

    // Lọc các buổi dạy của tutor này
    const tutorLessons = schedule.filter(lesson => lesson.tutor === tutor.name);

    if (tutorLessons.length === 0) {
        scheduleSection.innerHTML = '<p class="no-data">Chưa có lịch dạy nào cho gia sư này.</p>';
        return;
    }

    // Tạo HTML danh sách lịch dạy
    scheduleSection.innerHTML = tutorLessons.map(lesson => `
        <div class="schedule-item ${lesson.status}">
            <div class="schedule-date">
                <div class="date">${lesson.date}</div>
                <div class="time">${lesson.time}</div>
            </div>
            <div class="schedule-info">
                <div class="subject">Môn: ${lesson.subject}</div>
                <div class="notes">Ghi chú: ${lesson.notes || ''}</div>
                ${lesson.onlineMeeting ? `<div class="online-indicator">🖥️ Online</div>` : ''}
            </div>
            <div class="schedule-status">
                <span class="status-badge ${lesson.status}">
                    ${lesson.status === 'completed' ? 'Đã hoàn thành' : 'Sắp tới'}
                </span>
                ${lesson.onlineMeeting && lesson.status === 'upcoming' ? 
                  `<a class="btn-join-meeting" href="${lesson.meetingLink}" target="_blank">Tham gia meeting</a>` : ''}
            </div>
        </div>
    `).join('');
}

// 3. Hiển thị form đánh giá học viên
function renderStudentReviewForm() {
    const reviewsSection = document.getElementById('section-reviews');
    if (!reviewsSection || !tutors || !reviews) return;

    // Lấy tutor hiện tại (tạm thời là tutors[0])
    const tutor = tutors[0];
    if (!tutor) return;

    // Lọc các đánh giá của tutor này
    const tutorReviews = reviews.filter(r => r.tutorName === tutor.name);

    // Hiển thị danh sách đánh giá
    let reviewsHTML = '<h3>Đánh giá từ học viên</h3>';
    if (tutorReviews.length === 0) {
        reviewsHTML += '<p class="no-data">Chưa có đánh giá nào cho gia sư này.</p>';
    } else {
        reviewsHTML += tutorReviews.map(r => `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-student">${r.studentName ? r.studentName : 'Học viên'}</span>
                    <span class="review-date">${r.date}</span>
                </div>
                <div class="review-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                <div class="review-subject">Môn: ${r.subject}</div>
                <div class="review-comment">${r.comment}</div>
            </div>
        `).join('');
    }

    // Thêm form đánh giá mới
    reviewsHTML += `
        <h3>Thêm đánh giá học viên</h3>
        <form id="studentReviewForm" class="review-form">
            <div class="form-row">
                <input type="text" id="studentName" placeholder="Tên học viên" required />
            </div>
            <div class="form-row">
                <input type="text" id="reviewSubject" placeholder="Môn học" required />
            </div>
            <div class="form-row">
                <div class="star-rating" id="starRating">
                    ${[1,2,3,4,5].map(i => `<span class="star" data-value="${i}">★</span>`).join('')}
                </div>
            </div>
            <div class="form-row">
                <textarea id="reviewComment" placeholder="Nhận xét..." required></textarea>
            </div>
            <button type="submit" class="btn-primary">Gửi đánh giá</button>
        </form>
    `;

    reviewsSection.innerHTML = reviewsHTML;

    // Gắn sự kiện cho form và rating
    const form = document.getElementById('studentReviewForm');
    const stars = document.querySelectorAll('#starRating .star');
    let selectedRating = 0;
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.value);
            stars.forEach((s, idx) => {
                s.classList.toggle('active', idx < selectedRating);
            });
        });
    });
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const studentName = document.getElementById('studentName').value.trim();
            const subject = document.getElementById('reviewSubject').value.trim();
            const comment = document.getElementById('reviewComment').value.trim();
            if (!studentName || !subject || !comment || selectedRating === 0) {
                alert('Vui lòng điền đầy đủ thông tin và chọn số sao!');
                return;
            }
            // Thêm đánh giá mới vào mảng reviews
            reviews.push({
                id: reviews.length + 1,
                tutorName: tutor.name,
                studentName,
                subject,
                rating: selectedRating,
                comment,
                date: new Date().toISOString().split('T')[0]
            });
            renderStudentReviewForm();
            alert('Đánh giá đã được gửi!');
        });
    }
}

// 4. Xử lý đổi/huỷ lịch dạy
function handleRescheduleRequest() {
    const rescheduleSection = document.getElementById('section-reschedule');
    if (!rescheduleSection || !tutors || !schedule) return;

    // Lấy tutor hiện tại (tạm thời là tutors[0])
    const tutor = tutors[0];
    if (!tutor) return;

    // Lọc các buổi dạy sắp tới
    const upcomingLessons = schedule.filter(lesson => lesson.tutor === tutor.name && lesson.status === 'upcoming');

    if (upcomingLessons.length === 0) {
        rescheduleSection.innerHTML = '<p class="no-data">Không có buổi dạy sắp tới để đổi/huỷ.</p>';
        return;
    }

    // Tạo HTML danh sách buổi dạy với nút Đổi/Huỷ
    rescheduleSection.innerHTML = `
        <h3>Đổi/Huỷ lịch dạy</h3>
        <div class="reschedule-list">
            ${upcomingLessons.map(lesson => `
                <div class="reschedule-item">
                    <div><b>${lesson.date} ${lesson.time}</b> - ${lesson.subject}</div>
                    <button class="btn-secondary" data-action="reschedule" data-id="${lesson.id}">Đổi lịch</button>
                    <button class="btn-danger" data-action="cancel" data-id="${lesson.id}">Huỷ lịch</button>
                </div>
            `).join('')}
        </div>
        <div id="rescheduleModal" class="modal" style="display:none;">
            <div class="modal-content">
                <span class="close" id="closeRescheduleModal">&times;</span>
                <h4 id="modalTitle">Đổi/Huỷ lịch</h4>
                <form id="rescheduleForm">
                    <div class="form-row">
                        <label>Lý do:</label>
                        <input type="text" id="reason" required />
                    </div>
                    <div class="form-row" id="makeupRow" style="display:none;">
                        <label>Chọn ngày bù:</label>
                        <input type="date" id="makeupDate" />
                    </div>
                    <button type="submit" class="btn-primary">Xác nhận</button>
                </form>
            </div>
        </div>
    `;

    // Gắn sự kiện cho nút Đổi/Huỷ
    document.querySelectorAll('.btn-secondary, .btn-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const lessonId = parseInt(this.dataset.id);
            const lesson = schedule.find(l => l.id === lessonId);
            if (!lesson) return;
            // Kiểm tra >=24h
            const now = new Date();
            const lessonDate = new Date(lesson.date + 'T' + lesson.time.split('-')[0]);
            const diffHours = (lessonDate - now) / (1000 * 60 * 60);
            if (diffHours < 24) {
                alert('Chỉ được đổi/huỷ lịch trước ít nhất 24 giờ!');
                return;
            }
            // Mở modal
            const modal = document.getElementById('rescheduleModal');
            const modalTitle = document.getElementById('modalTitle');
            const makeupRow = document.getElementById('makeupRow');
            modal.style.display = 'block';
            modalTitle.textContent = action === 'reschedule' ? 'Đổi lịch' : 'Huỷ lịch';
            makeupRow.style.display = action === 'reschedule' ? 'block' : 'none';
            // Xử lý submit form
            const form = document.getElementById('rescheduleForm');
            form.onsubmit = function(e) {
                e.preventDefault();
                const reason = document.getElementById('reason').value.trim();
                const makeupDate = document.getElementById('makeupDate').value;
                if (!reason || (action === 'reschedule' && !makeupDate)) {
                    alert('Vui lòng nhập đầy đủ thông tin!');
                    return;
                }
                // Cập nhật trạng thái buổi học
                if (action === 'reschedule') {
                    lesson.date = makeupDate;
                    lesson.notes = `Đã đổi lịch. Lý do: ${reason}`;
                } else {
                    lesson.status = 'cancelled';
                    lesson.notes = `Đã huỷ. Lý do: ${reason}`;
                }
                modal.style.display = 'none';
                handleRescheduleRequest();
                notifyLearner('Lịch học đã được cập nhật!');
            };
            // Đóng modal
            document.getElementById('closeRescheduleModal').onclick = function() {
                modal.style.display = 'none';
            };
        });
    });
}

// 5. Thông báo cho học viên khi có thay đổi
function notifyLearner(message) {
    // TODO: Hiển thị alert/thông báo
}

// 6. Xử lý đổi mật khẩu
function attachPasswordModalEvents() {
    const settingsSection = document.getElementById('section-settings');
    if (!settingsSection || !tutors) return;

    // Lấy tutor hiện tại (tạm thời là tutors[0])
    const tutor = tutors[0];
    if (!tutor) return;

    // Giao diện đổi mật khẩu
    let html = `
        <h3>Đổi mật khẩu</h3>
        <form id="passwordForm" class="settings-form">
            <div class="form-row">
                <input type="password" id="oldPassword" placeholder="Mật khẩu cũ" required />
            </div>
            <div class="form-row">
                <input type="password" id="newPassword" placeholder="Mật khẩu mới" required />
            </div>
            <div class="form-row">
                <input type="password" id="confirmPassword" placeholder="Xác nhận mật khẩu mới" required />
            </div>
            <button type="submit" class="btn-primary">Đổi mật khẩu</button>
        </form>
        <hr />
        <h3>Đổi avatar</h3>
        <div id="avatarOptions" class="avatar-options">
            ${['👨‍🏫','👩‍🏫','🧑‍🏫','🧑‍🎓','👨‍🎓','👩‍🎓','🦸‍♂️','🦸‍♀️'].map(emoji => `
                <span class="avatar-option" data-avatar="${emoji}">${emoji}</span>
            `).join('')}
        </div>
    `;
    settingsSection.innerHTML = html;

    // Đổi mật khẩu (giả lập, chỉ kiểm tra hợp lệ)
    const form = document.getElementById('passwordForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        const oldPass = document.getElementById('oldPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        if (!oldPass || !newPass || !confirmPass) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        if (newPass !== confirmPass) {
            alert('Mật khẩu mới không khớp!');
            return;
        }
        if (newPass.length < 6) {
            alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }
        // Giả lập thành công
        alert('Đổi mật khẩu thành công!');
        form.reset();
    };

    // Đổi avatar
    attachAvatarChangeEvents();
}

function attachAvatarChangeEvents() {
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const avatarHeader = document.getElementById('tutor-avatar');
    const profileAvatar = document.querySelector('.profile-avatar-large');
    if (!tutors) return;
    const tutor = tutors[0];
    avatarOptions.forEach(option => {
        option.onclick = function() {
            const selected = this.dataset.avatar;
            tutor.avatar = selected;
            // Cập nhật avatar ở header
            if (avatarHeader) avatarHeader.textContent = selected;
            // Cập nhật avatar ở profile nếu đang ở tab hồ sơ
            if (profileAvatar) profileAvatar.textContent = selected;
            // Highlight avatar đang chọn
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            alert('Đổi avatar thành công!');
        };
        // Đánh dấu avatar hiện tại
        if (option.dataset.avatar === tutor.avatar) {
            option.classList.add('selected');
        }
    });
}

// =============================
// Navbar Tab Switching Logic
// =============================

document.addEventListener('DOMContentLoaded', function() {
    // Danh sách các tab và section tương ứng
    const tabs = [
        { tab: 'nav-profile', section: 'section-profile', render: renderTutorProfile },
        { tab: 'nav-schedule', section: 'section-schedule', render: renderTeachingSchedule },
        { tab: 'nav-reviews', section: 'section-reviews', render: renderStudentReviewForm },
        { tab: 'nav-reschedule', section: 'section-reschedule', render: handleRescheduleRequest },
        { tab: 'nav-settings', section: 'section-settings', render: attachPasswordModalEvents }
    ];

    tabs.forEach(({ tab, section, render }) => {
        document.getElementById(tab).addEventListener('click', function(e) {
            e.preventDefault();
            // Đổi active tab
            tabs.forEach(({ tab: t, section: s }) => {
                document.getElementById(t).classList.remove('active');
                document.getElementById(s).style.display = 'none';
            });
            this.classList.add('active');
            document.getElementById(section).style.display = 'block';
            // Gọi hàm render tương ứng
            if (typeof render === 'function') render();
        });
    });

    // Mặc định render hồ sơ khi load trang
    renderTutorProfile();
}); 