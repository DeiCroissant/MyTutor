// =============================
// Tutor Dashboard Main Functions
// =============================

// 1. Hiển thị thông tin hồ sơ gia sư
function renderTutorProfile() {
    // Thông tin cố định do nhà trường cấp
    const fixedName = 'Trần Minh Khoa';
    const fixedShortName = 'Minh Khoa';
    const fixedEmail = 'khoa.2374802010241@vanlanguni.vn';
    const fixedPhone = '0911728117';
    // Header
    const avatarHeader = document.getElementById('tutor-avatar');
    const greeting = document.getElementById('tutor-greeting');
    if (avatarHeader && tutors && tutors.length > 0) avatarHeader.textContent = tutors[0].avatar;
    if (greeting) greeting.innerHTML = `Chào, <b>${fixedShortName}</b>`;
    // Render vào các thẻ profile-value
    document.getElementById('tutorName').textContent = fixedName;
    document.getElementById('tutorEmail').textContent = fixedEmail;
    document.getElementById('tutorPhone').textContent = fixedPhone;
    // Các thông tin còn lại lấy từ tutor như cũ
    if (tutors && tutors.length > 0) {
        const tutor = tutors[0];
        document.getElementById('tutorSubject').textContent = tutor.subject;
        document.getElementById('tutorPrice').textContent = tutor.price ? tutor.price.toLocaleString() + 'đ' : '—';
        document.getElementById('tutorDesc').textContent = tutor.desc;
        document.getElementById('tutorRating').innerHTML = `${'★'.repeat(Math.round(tutor.rating))}${'☆'.repeat(5-Math.round(tutor.rating))} (${tutor.rating}/5)`;
        document.getElementById('tutorStatus').textContent = tutor.status === 'available' ? 'Đang rảnh' : 'Đang bận';
        document.getElementById('tutorOnline').textContent = tutor.onlineSupport ? 'Có' : 'Không';
    }
}

// 2. Hiển thị lịch dạy của gia sư
function renderTeachingSchedule() {
    const scheduleSection = document.getElementById('section-schedule');
    if (!scheduleSection || !tutors || !schedule) return;

    const tutor = tutors[0];
    if (!tutor) return;

    const tutorLessons = schedule.filter(lesson => lesson.tutor === tutor.name);

    if (tutorLessons.length === 0) {
        scheduleSection.innerHTML = '<p class="no-data">Chưa có lịch dạy nào cho gia sư này.</p>';
        return;
    }

    scheduleSection.innerHTML = tutorLessons.map(lesson => {
        let courseStatus = window['courseStatus_' + lesson.subject] || 'Sắp tới';
        let btnClass = 'btn-status-upcoming';
        let itemClass = '';
        if (courseStatus === 'Đang thực hiện') {
            btnClass = 'btn-status-progress';
            itemClass = 'schedule-item-progress';
        } else if (courseStatus === 'Đã hoàn thành') {
            btnClass = 'btn-status-done';
            itemClass = 'schedule-item-done';
        } else {
            itemClass = 'schedule-item-upcoming';
        }
        return `
        <div class="schedule-item ${lesson.status} ${itemClass}">
            <div class="schedule-date">
                <div class="date">${lesson.date}</div>
                <div class="time">${lesson.time}</div>
            </div>
            <div class="schedule-info">
                <div class="subject">Môn: ${lesson.subject}
                  <button onclick="cycleCourseStatus('${lesson.subject}', this)" class="btn-status ${btnClass}" style="margin-left:12px;">${courseStatus}</button>
                </div>
                <div class="notes">Ghi chú: ${lesson.notes || ''}</div>
                ${lesson.onlineMeeting ? `<div class="online-indicator">🖥️ Online</div>` : ''}
            </div>
            <div class="schedule-status">
                ${courseStatus !== 'Đã hoàn thành' ? `
                  ${lesson.onlineMeeting ? `<a class="btn-join-meeting" href="${lesson.meetingLink}" target="_blank">Tham gia meeting</a>` : ''}
                  <button class="btn-secondary" onclick="openRescheduleModal('reschedule', ${lesson.id})">Đổi lịch</button>
                  <button class="btn-danger" onclick="openRescheduleModal('cancel', ${lesson.id})">Huỷ lịch</button>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');
}

// Hàm chuyển trạng thái khoá học
function setCourseStatus(subject, status) {
    window['courseStatus_' + subject] = status;
    const el = document.getElementById('courseStatus_' + subject);
    if (el) el.textContent = status;
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
                <div class="star-rating" id="starRatings">
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
    const stars = document.querySelectorAll('#starRatings .star');
    let selectedRating = 0;
    stars.forEach(star => {
        star.onclick = function() {
            selectedRating = parseInt(this.dataset.value);
            stars.forEach((s, idx) => {
                s.classList.toggle('active', idx < selectedRating);
            });
        };
    });
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const studentName = document.getElementById('studentName').value.trim();
            const subject = document.getElementById('reviewSubject').value.trim();
            const comment = document.getElementById('reviewComment').value.trim();
            if (!studentName || !subject || !comment || selectedRating === 0) {
                alert('Vui lòng điền đầy đủ thông tin và chọn số sao!');
                return;
            }
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
        };
    }
}

// 4. Xử lý đổi/huỷ lịch dạy
function handleRescheduleRequest() {
    const rescheduleSection = document.getElementById('section-reschedule');
    if (!rescheduleSection || !tutors || !schedule) return;

    const tutor = tutors[0];
    if (!tutor) return;

    const upcomingLessons = schedule.filter(lesson => lesson.tutor === tutor.name && lesson.status === 'upcoming');

    if (upcomingLessons.length === 0) {
        rescheduleSection.innerHTML = '<p class="no-data">Không có buổi dạy sắp tới để đổi/huỷ.</p>';
        return;
    }

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
                        <input type="time" id="makeupTime" />
                    </div>
                    <div class="form-row" id="makeupOptionRow" style="display:none;">
                        <label><input type="checkbox" id="makeupOption"> Lên lịch dạy bù cho sinh viên</label>
                    </div>
                    <div class="form-row" id="makeupInputRow" style="display:none;">
                        <label>Ngày dạy bù:</label>
                        <input type="date" id="makeupDate2" />
                        <input type="time" id="makeupTime2" />
                    </div>
                    <button type="submit" class="btn-primary">Xác nhận</button>
                </form>
            </div>
        </div>
    `;

    document.querySelectorAll('.btn-secondary, .btn-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const lessonId = parseInt(this.dataset.id);
            const lesson = schedule.find(l => l.id === lessonId);
            if (!lesson) return;
            const now = new Date();
            const lessonDate = new Date(lesson.date + 'T' + lesson.time.split('-')[0]);
            const diffHours = (lessonDate - now) / (1000 * 60 * 60);
            if (diffHours < 24) {
                alert('Chỉ được đổi/huỷ lịch trước ít nhất 24 giờ!');
                return;
            }
            const modal = document.getElementById('rescheduleModal');
            const modalTitle = document.getElementById('modalTitle');
            const makeupRow = document.getElementById('makeupRow');
            const makeupOptionRow = document.getElementById('makeupOptionRow');
            const makeupInputRow = document.getElementById('makeupInputRow');
            modal.style.display = 'block';
            modalTitle.textContent = action === 'reschedule' ? 'Đổi lịch' : 'Huỷ lịch';
            makeupRow.style.display = action === 'reschedule' ? 'block' : 'none';
            makeupOptionRow.style.display = action === 'cancel' ? 'block' : 'none';
            makeupInputRow.style.display = 'none';
            if (action === 'cancel') {
                document.getElementById('makeupOption').checked = false;
                document.getElementById('makeupOption').onchange = function() {
                    makeupInputRow.style.display = this.checked ? 'block' : 'none';
                };
            }
            const form = document.getElementById('rescheduleForm');
            form.onsubmit = function(e) {
                e.preventDefault();
                const reason = document.getElementById('reason').value.trim();
                if (!reason) {
                    alert('Vui lòng nhập đầy đủ thông tin!');
                    return;
                }
                if (action === 'reschedule') {
                    const makeupDate = document.getElementById('makeupDate').value;
                    const makeupTime = document.getElementById('makeupTime').value;
                    if (!makeupDate || !makeupTime) {
                        alert('Vui lòng chọn ngày và giờ mới!');
                        return;
                    }
                    if (confirm(`Bạn có chắc muốn đổi lịch sang ngày ${makeupDate}, giờ ${makeupTime}?`)) {
                        lesson.date = makeupDate;
                        lesson.time = makeupTime;
                        lesson.notes = `Đã đổi lịch. Lý do: ${reason}`;
                        modal.style.display = 'none';
                        handleRescheduleRequest();
                        notifyLearner(`Gia sư đã đổi lịch dạy: ${lesson.subject} sang ngày ${makeupDate}, giờ ${makeupTime}`);
                    }
                } else if (action === 'cancel') {
                    lesson.status = 'cancelled';
                    lesson.notes = `Đã huỷ. Lý do: ${reason}`;
                    let hasMakeup = document.getElementById('makeupOption').checked;
                    let makeupDate2 = document.getElementById('makeupDate2').value;
                    let makeupTime2 = document.getElementById('makeupTime2').value;
                    let confirmMsg = `Bạn có chắc muốn huỷ lịch này?`;
                    if (hasMakeup) {
                        if (!makeupDate2 || !makeupTime2) {
                            alert('Vui lòng chọn ngày và giờ dạy bù!');
                            return;
                        }
                        confirmMsg += `\nLên lịch dạy bù vào ngày ${makeupDate2}, giờ ${makeupTime2}`;
                    }
                    if (confirm(confirmMsg)) {
                        if (hasMakeup) {
                            // Tạo lịch mới cho sinh viên
                            const newId = Math.max(...schedule.map(l => l.id)) + 1;
                            schedule.push({
                                id: newId,
                                date: makeupDate2,
                                time: makeupTime2,
                                subject: lesson.subject,
                                tutor: lesson.tutor,
                                status: 'upcoming',
                                notes: `Buổi dạy bù cho lịch đã huỷ ngày ${lesson.date}`,
                                meetingType: lesson.meetingType,
                                onlineMeeting: lesson.onlineMeeting,
                                meetingLink: lesson.meetingLink
                            });
                            notifyLearner(`Gia sư đã huỷ lịch dạy: ${lesson.subject} vào ngày ${lesson.date}, giờ ${lesson.time} và lên lịch dạy bù vào ngày ${makeupDate2}, giờ ${makeupTime2}`);
                        } else {
                            notifyLearner(`Gia sư đã huỷ lịch dạy: ${lesson.subject} vào ngày ${lesson.date}, giờ ${lesson.time}`);
                        }
                        modal.style.display = 'none';
                        handleRescheduleRequest();
                    }
                }
            };
            document.getElementById('closeRescheduleModal').onclick = function() {
                modal.style.display = 'none';
            };
        });
    });
}

// 5. Thông báo cho học viên khi có thay đổi
function notifyLearner(message) {
    let notifications = JSON.parse(localStorage.getItem('learnerNotifications') || '[]');
    notifications.push({
        message,
        time: new Date().toLocaleString()
    });
    localStorage.setItem('learnerNotifications', JSON.stringify(notifications));
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
    const currentAvatarDisplay = document.getElementById('currentAvatarDisplay');
    
    if (!tutors) return;
    const tutor = tutors[0];
    
    avatarOptions.forEach(option => {
        option.onclick = function() {
            const selected = this.dataset.avatar;
            tutor.avatar = selected;
            
            // Cập nhật avatar ở header
            if (avatarHeader) avatarHeader.textContent = selected;
            
            // Cập nhật avatar hiện tại trong settings
            if (currentAvatarDisplay) currentAvatarDisplay.textContent = selected;
            
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
        { tab: 'nav-inbox', section: 'section-inbox', render: null },
        { tab: 'nav-reviews', section: 'section-reviews', render: renderStudentReviewForm },
        { tab: 'nav-settings', section: 'section-settings', render: renderTutorSettings }
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

    // Thêm logic cho nút Thêm buổi học
    const addBtn = document.getElementById('addLessonBtn');
    const addModal = document.getElementById('addLessonModal');
    const closeAddModal = document.getElementById('closeAddLessonModal');
    if (addBtn && addModal && closeAddModal) {
        addBtn.onclick = function() { addModal.style.display = 'block'; };
        closeAddModal.onclick = function() { addModal.style.display = 'none'; };
        window.onclick = function(event) {
            if (event.target === addModal) addModal.style.display = 'none';
        };
    }
    // Logic hiển thị input giá tiền khi chọn Có phí/Miễn phí
    const priceFree = document.getElementById('priceFree');
    const pricePaid = document.getElementById('pricePaid');
    const priceInputRow = document.getElementById('priceInputRow');
    const addPrice = document.getElementById('addPrice');
    if (priceFree && pricePaid && priceInputRow && addPrice) {
        priceFree.onchange = function() {
            if (this.checked) {
                priceInputRow.style.display = 'none';
                addPrice.value = '';
            }
        };
        pricePaid.onchange = function() {
            if (this.checked) {
                priceInputRow.style.display = 'block';
            }
        };
    }
    // Xử lý submit form thêm buổi học
    const addForm = document.getElementById('addLessonForm');
    if (addForm) {
        addForm.onsubmit = function(e) {
            e.preventDefault();
            const subject = document.getElementById('addSubject').value.trim();
            let price = 0;
            if (pricePaid && pricePaid.checked) {
                price = parseInt(addPrice.value);
                if (isNaN(price) || price <= 0) {
                    alert('Vui lòng nhập giá tiền hợp lệ!');
                    return;
                }
            }
            const date = document.getElementById('addDate').value;
            const time = document.getElementById('addTime').value.trim();
            const notes = document.getElementById('addNotes').value.trim();
            const meetingLink = document.getElementById('addMeetingLink').value.trim();
            const onlineMeeting = document.getElementById('addOnlineMeeting').checked;
            if (!subject || !date || !time) {
                alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
                return;
            }
            const newId = Math.max(0, ...schedule.map(l => l.id)) + 1;
            schedule.push({
                id: newId,
                date,
                time,
                subject,
                price,
                tutor: tutors[0].name,
                status: 'upcoming',
                notes,
                meetingType: '1-1',
                onlineMeeting,
                meetingLink
            });
            addModal.style.display = 'none';
            this.reset();
            // Reset lại radio và ẩn input giá tiền
            if (priceFree) priceFree.checked = true;
            if (priceInputRow) priceInputRow.style.display = 'none';
            saveScheduleToStorage();
            renderTeachingSchedule();
        };
    }

    // Đăng ký làm gia sư
    const registerBtn = document.getElementById('registerTutorBtn');
    const registerModal = document.getElementById('registerTutorModal');
    const closeRegisterModal = document.getElementById('closeRegisterTutorModal');
    if (registerBtn && registerModal && closeRegisterModal) {
        registerBtn.onclick = function() {
            registerModal.style.display = 'block';
            // Tự động điền và khóa các trường thông tin cố định
            const fixedName = 'Trần Minh Khoa';
            const fixedGender = 'Nam';
            const fixedMSSV = '2374802010241';
            const fixedPhone = '0911728117';
            const nameInput = document.getElementById('regTutorName');
            const genderInput = document.getElementById('regTutorGender');
            const mssvInput = document.getElementById('regTutorMSSV');
            const phoneInput = document.getElementById('regTutorPhone');
            if (nameInput) {
                nameInput.value = fixedName;
                nameInput.readOnly = true;
                nameInput.classList.add('readonly');
            }
            if (genderInput) {
                genderInput.value = fixedGender;
                genderInput.disabled = true;
                genderInput.classList.add('readonly');
            }
            if (mssvInput) {
                mssvInput.value = fixedMSSV;
                mssvInput.readOnly = true;
                mssvInput.classList.add('readonly');
            }
            if (phoneInput) {
                phoneInput.value = fixedPhone;
                phoneInput.readOnly = true;
                phoneInput.classList.add('readonly');
            }
        };
        closeRegisterModal.onclick = function() { registerModal.style.display = 'none'; };
        window.onclick = function(event) {
            if (event.target === registerModal) registerModal.style.display = 'none';
        };
    }
    // Xử lý submit form đăng ký
    const regForm = document.getElementById('registerTutorForm');
    if (regForm) {
        regForm.onsubmit = function(e) {
            e.preventDefault();
            // Lấy dữ liệu các trường
            const name = document.getElementById('regTutorName').value.trim();
            const gender = document.getElementById('regTutorGender').value;
            const mssv = document.getElementById('regTutorMSSV').value.trim();
            const gpa = document.getElementById('regTutorGPA').value.trim();
            const phone = document.getElementById('regTutorPhone').value.trim();
            const hobby = document.getElementById('regTutorHobby').value.trim();
            const achievement = document.getElementById('regTutorAchievement').value.trim();
            const interviewTime = document.getElementById('regTutorInterviewTime').value;
            if (!name || !gender || !mssv || !gpa || !interviewTime) {
                alert('Vui lòng nhập đầy đủ các trường bắt buộc!');
                return;
            }
            // Tạo modal review
            let reviewModal = document.createElement('div');
            reviewModal.className = 'modal';
            reviewModal.style.display = 'block';
            reviewModal.innerHTML = `
              <div class="modal-content" style="max-width:420px;">
                <span class="close" id="closeReviewModal">&times;</span>
                <h3>Xác nhận thông tin đăng ký</h3>
                <div style="margin:18px 0 24px 0;line-height:1.6;">
                  <b>Tên:</b> ${name}<br/>
                  <b>Giới tính:</b> ${gender}<br/>
                  <b>MSSV:</b> ${mssv}<br/>
                  <b>GPA:</b> ${gpa}<br/>
                  <b>Số điện thoại:</b> ${phone}<br/>
                  <b>Sở thích:</b> ${hobby}<br/>
                  <b>Thành tựu cá nhân:</b> ${achievement}<br/>
                  <b>Thời gian phỏng vấn:</b> ${interviewTime}<br/>
                </div>
                <button id="confirmSendRegister" class="btn-primary" style="width:100%;margin-bottom:8px;">Xác nhận gửi đăng ký</button>
                <button id="cancelSendRegister" class="btn-secondary" style="width:100%;">Quay lại chỉnh sửa</button>
              </div>
            `;
            document.body.appendChild(reviewModal);
            // Đóng modal review
            document.getElementById('closeReviewModal').onclick = function() {
                document.body.removeChild(reviewModal);
            };
            document.getElementById('cancelSendRegister').onclick = function() {
                document.body.removeChild(reviewModal);
            };
            document.getElementById('confirmSendRegister').onclick = function() {
                // Thực hiện gửi đăng ký như cũ
                alert('Đăng ký thành công!\nTên: ' + name + '\nGiới tính: ' + gender + '\nMSSV: ' + mssv + '\nGPA: ' + gpa + '\nThời gian phỏng vấn: ' + interviewTime);
                document.getElementById('registerTutorModal').style.display = 'none';
                regForm.reset();
                document.body.removeChild(reviewModal);
                // Gửi thư xác nhận vào hộp thư
                let inbox = JSON.parse(localStorage.getItem('tutorInbox') || '[]');
                inbox.unshift({
                    sender: 'SUPPORT CENTER',
                    content: 'Trung tâm đã nhận được hồ sơ đăng ký của bạn. Vui lòng đợi kết quả xét duyệt.',
                    date: new Date().toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
                });
                localStorage.setItem('tutorInbox', JSON.stringify(inbox));
                // Gọi hàm render lại hộp thư nếu có
                if (typeof renderTutorInbox === 'function') renderTutorInbox();
            };
        };
    }

    // Hộp thư: mở modal khi bấm vào thư SUPPORT CENTER
    const supportMsg = document.getElementById('supportCenterMsg');
    const inboxModal = document.getElementById('inboxDetailModal');
    const closeInboxModal = document.getElementById('closeInboxDetailModal');
    const confirmInboxBtn = document.getElementById('confirmInboxBtn');
    if (supportMsg && inboxModal && closeInboxModal && confirmInboxBtn) {
        supportMsg.onclick = function() { inboxModal.style.display = 'block'; };
        closeInboxModal.onclick = function() { inboxModal.style.display = 'none'; };
        confirmInboxBtn.onclick = function() { inboxModal.style.display = 'none'; };
        window.onclick = function(event) {
            if (event.target === inboxModal) inboxModal.style.display = 'none';
        };
    }
});

function renderTutorSettings() {
    // Thông tin cố định do nhà trường cấp
    const fixedName = 'Trần Minh Khoa';
    const fixedEmail = 'khoa.2374802010241@vanlanguni.vn';
    const fixedPhone = '0911728117';
    // Cập nhật form thông tin cá nhân
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    if (profileName) {
        profileName.value = fixedName;
        profileName.readOnly = true;
        profileName.classList.add('readonly');
    }
    if (profileEmail) {
        profileEmail.value = fixedEmail;
        profileEmail.readOnly = true;
        profileEmail.classList.add('readonly');
    }
    if (profilePhone) {
        profilePhone.value = fixedPhone;
        profilePhone.readOnly = true;
        profilePhone.classList.add('readonly');
    }
    // Ẩn nút cập nhật của form thông tin cá nhân
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const submitBtn = profileForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.style.display = 'none';
    }
    // Cập nhật form thông tin dạy học
    const profileSubject = document.getElementById('profileSubject');
    const profilePrice = document.getElementById('profilePrice');
    const profileDesc = document.getElementById('profileDesc');
    if (tutors && tutors.length > 0) {
        const tutor = tutors[0];
        if (profileSubject) profileSubject.value = tutor.subject;
        if (profilePrice) profilePrice.value = tutor.price || '';
        if (profileDesc) profileDesc.value = tutor.desc || '';
    }
    // Cập nhật avatar hiện tại
    const currentAvatarDisplay = document.getElementById('currentAvatarDisplay');
    if (tutors && tutors.length > 0 && currentAvatarDisplay) {
        currentAvatarDisplay.textContent = tutors[0].avatar;
    }
    // Gắn sự kiện cho form thông tin dạy học
    const academicForm = document.getElementById('academicForm');
    if (academicForm) {
        academicForm.onsubmit = function(e) {
            e.preventDefault();
            const newSubject = profileSubject.value.trim();
            const newPrice = parseInt(profilePrice.value);
            const newDesc = profileDesc.value.trim();
            if (!newSubject) {
                alert('Vui lòng nhập chuyên môn!');
                return;
            }
            if (newPrice <= 0) {
                alert('Giá/buổi phải lớn hơn 0!');
                return;
            }
            // Cập nhật thông tin tutor
            tutors[0].subject = newSubject;
            tutors[0].price = newPrice;
            tutors[0].desc = newDesc;
            renderTutorProfile();
            alert('Cập nhật thông tin dạy học thành công!');
        };
    }
    // Gắn sự kiện cho thay đổi avatar
    attachAvatarChangeEvents();
    // Load cài đặt thông báo đã lưu
    loadNotificationSettings();
    // Gắn sự kiện cho các nút
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.onclick = function() {
            showPasswordModal();
        };
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                window.location.href = 'index.html';
            }
        };
    }
    const swapBtn = document.getElementById('swapRoleBtn');
    if (swapBtn) {
        swapBtn.onclick = function() {
            window.location.href = 'dashboard.html';
        };
    }
}

// Hàm load cài đặt thông báo
function loadNotificationSettings() {
    const savedSettings = localStorage.getItem('tutorNotifications');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        const reminder = document.getElementById('cb-reminder');
        const message = document.getElementById('cb-message');
        const promo = document.getElementById('cb-promo');
        const report = document.getElementById('cb-report');
        
        if (reminder) reminder.checked = settings.reminder;
        if (message) message.checked = settings.message;
        if (promo) promo.checked = settings.promo;
        if (report) report.checked = settings.report;
    }
}

function showPasswordModal() {
    // Tạo modal đổi mật khẩu
    let modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" id="closePwdModal">&times;</span>
        <h3>Đổi mật khẩu</h3>
        <form id="modalPasswordForm" class="settings-form">
          <div class="form-row">
            <input type="password" id="modalOldPassword" placeholder="Mật khẩu cũ" required />
          </div>
          <div class="form-row">
            <input type="password" id="modalNewPassword" placeholder="Mật khẩu mới" required />
          </div>
          <div class="form-row">
            <input type="password" id="modalConfirmPassword" placeholder="Xác nhận mật khẩu mới" required />
          </div>
          <button type="submit" class="btn-primary">Đổi mật khẩu</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    // Đóng modal
    document.getElementById('closePwdModal').onclick = function() {
        document.body.removeChild(modal);
    };
    // Xử lý submit
    document.getElementById('modalPasswordForm').onsubmit = function(e) {
        e.preventDefault();
        const oldPass = document.getElementById('modalOldPassword').value;
        const newPass = document.getElementById('modalNewPassword').value;
        const confirmPass = document.getElementById('modalConfirmPassword').value;
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
        alert('Đổi mật khẩu thành công!');
        document.body.removeChild(modal);
    };
}

// Modal chỉnh sửa lịch dạy
function openEditScheduleModal(id) {
    const lesson = schedule.find(l => l.id === id);
    if (!lesson) return;
    document.getElementById('editScheduleId').value = lesson.id;
    document.getElementById('editScheduleDate').value = lesson.date;
    document.getElementById('editScheduleTime').value = lesson.time;
    document.getElementById('editScheduleModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editScheduleModal').style.display = 'none';
}

if (document.getElementById('closeEditModal')) {
    document.getElementById('closeEditModal').onclick = closeEditModal;
}

if (document.getElementById('editScheduleForm')) {
    document.getElementById('editScheduleForm').onsubmit = function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editScheduleId').value);
        const date = document.getElementById('editScheduleDate').value;
        const time = document.getElementById('editScheduleTime').value;
        const lesson = schedule.find(l => l.id === id);
        if (lesson) {
            if (confirm(`Bạn có chắc muốn thay đổi lịch dạy sang ngày ${date}, giờ ${time} không?`)) {
                lesson.date = date;
                lesson.time = time;
                renderTeachingSchedule();
                closeEditModal();
                notifyLearner(`Gia sư đã thay đổi lịch dạy: ${lesson.subject} vào ngày ${date}, giờ ${time}`);
            }
        }
    };
}

function deleteSchedule(id) {
    if (confirm("Bạn có chắc muốn xoá lịch này không?")) {
        const idx = schedule.findIndex(l => l.id === id);
        if (idx !== -1) {
            schedule.splice(idx, 1);
            renderTeachingSchedule();
        }
    }
}

// Hàm mở modal đổi/huỷ lịch cho từng lịch dạy
function openRescheduleModal(action, lessonId) {
    const lesson = schedule.find(l => l.id === lessonId);
    if (!lesson) return;
    const modal = document.getElementById('rescheduleModal');
    const modalTitle = document.getElementById('modalTitle');
    const makeupRow = document.getElementById('makeupRow');
    const makeupOptionRow = document.getElementById('makeupOptionRow');
    const makeupInputRow = document.getElementById('makeupInputRow');
    modal.style.display = 'block';
    modalTitle.textContent = action === 'reschedule' ? 'Đổi lịch' : 'Huỷ lịch';
    makeupRow.style.display = action === 'reschedule' ? 'block' : 'none';
    makeupOptionRow.style.display = action === 'cancel' ? 'block' : 'none';
    makeupInputRow.style.display = 'none';
    if (action === 'cancel') {
        document.getElementById('makeupOption').checked = false;
        document.getElementById('makeupOption').onchange = function() {
            makeupInputRow.style.display = this.checked ? 'block' : 'none';
        };
    }
    document.getElementById('reason').value = '';
    document.getElementById('makeupDate').value = '';
    document.getElementById('makeupTime').value = '';
    document.getElementById('makeupDate2').value = '';
    document.getElementById('makeupTime2').value = '';
    // Clear event cũ
    const oldForm = document.getElementById('rescheduleForm');
    const newForm = oldForm.cloneNode(true);
    oldForm.parentNode.replaceChild(newForm, oldForm);
    newForm.onsubmit = function(e) {
        e.preventDefault();
        const reason = document.getElementById('reason').value.trim();
        if (!reason) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        if (action === 'reschedule') {
            const makeupDate = document.getElementById('makeupDate').value;
            const makeupTime = document.getElementById('makeupTime').value;
            if (!makeupDate || !makeupTime) {
                alert('Vui lòng chọn ngày và giờ mới!');
                return;
            }
            if (confirm(`Bạn có chắc muốn đổi lịch sang ngày ${makeupDate}, giờ ${makeupTime}?`)) {
                lesson.date = makeupDate;
                lesson.time = makeupTime;
                lesson.notes = `Đã đổi lịch. Lý do: ${reason}`;
                modal.style.display = 'none';
                saveScheduleToStorage();
                renderTeachingSchedule();
                notifyLearner(`Gia sư đã đổi lịch dạy: ${lesson.subject} sang ngày ${makeupDate}, giờ ${makeupTime}`);
            }
        } else if (action === 'cancel') {
            lesson.status = 'cancelled';
            lesson.notes = `Đã huỷ. Lý do: ${reason}`;
            let hasMakeup = document.getElementById('makeupOption').checked;
            let makeupDate2 = document.getElementById('makeupDate2').value;
            let makeupTime2 = document.getElementById('makeupTime2').value;
            let confirmMsg = `Bạn có chắc muốn huỷ lịch này?`;
            if (hasMakeup) {
                if (!makeupDate2 || !makeupTime2) {
                    alert('Vui lòng chọn ngày và giờ dạy bù!');
                    return;
                }
                confirmMsg += `\nLên lịch dạy bù vào ngày ${makeupDate2}, giờ ${makeupTime2}`;
            }
            if (confirm(confirmMsg)) {
                if (hasMakeup) {
                    const newId = Math.max(...schedule.map(l => l.id)) + 1;
                    schedule.push({
                        id: newId,
                        date: makeupDate2,
                        time: makeupTime2,
                        subject: lesson.subject,
                        tutor: lesson.tutor,
                        status: 'upcoming',
                        notes: `Buổi dạy bù cho lịch đã huỷ ngày ${lesson.date}`,
                        meetingType: lesson.meetingType,
                        onlineMeeting: lesson.onlineMeeting,
                        meetingLink: lesson.meetingLink
                    });
                    notifyLearner(`Gia sư đã huỷ lịch dạy: ${lesson.subject} vào ngày ${lesson.date}, giờ ${lesson.time} và lên lịch dạy bù vào ngày ${makeupDate2}, giờ ${makeupTime2}`);
                } else {
                    notifyLearner(`Gia sư đã huỷ lịch dạy: ${lesson.subject} vào ngày ${lesson.date}, giờ ${lesson.time}`);
                }
                modal.style.display = 'none';
                saveScheduleToStorage();
                renderTeachingSchedule();
            }
        }
    };
    document.getElementById('closeRescheduleModal').onclick = function() {
        modal.style.display = 'none';
    };
}

// Sửa hàm cycleCourseStatus để nhận thêm tham số button và đổi text trực tiếp
function cycleCourseStatus(subject, btn) {
    let statusArr = ['Sắp tới', 'Đang thực hiện', 'Đã hoàn thành'];
    let current = window['courseStatus_' + subject] || 'Sắp tới';
    let idx = statusArr.indexOf(current);
    let next = statusArr[(idx + 1) % statusArr.length];
    window['courseStatus_' + subject] = next;
    // Render lại toàn bộ lịch dạy để cập nhật đúng giao diện cho từng môn
    if (typeof renderTeachingSchedule === 'function') {
        renderTeachingSchedule();
        return;
    }
    // (Không cần thao tác DOM trực tiếp nữa)
}

// =============== LOCAL STORAGE SCHEDULE ===============
function loadScheduleFromStorage() {
    const saved = localStorage.getItem('tutorSchedule');
    if (saved) {
        try {
            const arr = JSON.parse(saved);
            if (Array.isArray(arr)) {
                schedule.length = 0;
                arr.forEach(l => schedule.push(l));
            }
        } catch (e) {}
    }
}
function saveScheduleToStorage() {
    localStorage.setItem('tutorSchedule', JSON.stringify(schedule));
}
// Gọi khi load trang
if (typeof schedule !== 'undefined') loadScheduleFromStorage();

// ================= THÊM/XOÁ/SỬA LỊCH: LƯU VÀO LOCALSTORAGE =================
// Thêm buổi học
if (document.getElementById('addLessonForm')) {
    document.getElementById('addLessonForm').onsubmit = function(e) {
        e.preventDefault();
        const subject = document.getElementById('addSubject').value.trim();
        let price = 0;
        if (pricePaid && pricePaid.checked) {
            price = parseInt(addPrice.value);
            if (isNaN(price) || price <= 0) {
                alert('Vui lòng nhập giá tiền hợp lệ!');
                return;
            }
        }
        const date = document.getElementById('addDate').value;
        const time = document.getElementById('addTime').value.trim();
        const notes = document.getElementById('addNotes').value.trim();
        const meetingLink = document.getElementById('addMeetingLink').value.trim();
        const onlineMeeting = document.getElementById('addOnlineMeeting').checked;
        if (!subject || !date || !time) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
            return;
        }
        const newId = Math.max(0, ...schedule.map(l => l.id)) + 1;
        schedule.push({
            id: newId,
            date,
            time,
            subject,
            price,
            tutor: tutors[0].name,
            status: 'upcoming',
            notes,
            meetingType: '1-1',
            onlineMeeting,
            meetingLink
        });
        document.getElementById('addLessonModal').style.display = 'none';
        this.reset();
        // Reset lại radio và ẩn input giá tiền
        if (priceFree) priceFree.checked = true;
        if (priceInputRow) priceInputRow.style.display = 'none';
        saveScheduleToStorage();
        renderTeachingSchedule();
    };
}
// Xoá lịch
function deleteSchedule(id) {
    if (confirm("Bạn có chắc muốn xoá lịch này không?")) {
        const idx = schedule.findIndex(l => l.id === id);
        if (idx !== -1) {
            schedule.splice(idx, 1);
            saveScheduleToStorage();
            renderTeachingSchedule();
        }
    }
}
// Sửa lịch (modal chỉnh sửa)
if (document.getElementById('editScheduleForm')) {
    document.getElementById('editScheduleForm').onsubmit = function(e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editScheduleId').value);
        const date = document.getElementById('editScheduleDate').value;
        const time = document.getElementById('editScheduleTime').value;
        const lesson = schedule.find(l => l.id === id);
        if (lesson) {
            if (confirm(`Bạn có chắc muốn thay đổi lịch dạy sang ngày ${date}, giờ ${time} không?`)) {
                lesson.date = date;
                lesson.time = time;
                saveScheduleToStorage();
                renderTeachingSchedule();
                closeEditModal();
                notifyLearner(`Gia sư đã thay đổi lịch dạy: ${lesson.subject} vào ngày ${date}, giờ ${time}`);
            }
        }
    };
} 