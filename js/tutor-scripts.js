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
        
        // Hiển thị tất cả chuyên môn trong mục "Chuyên môn"
        if (tutor.specialties && tutor.specialties.length > 0) {
            document.getElementById('tutorSubject').textContent = tutor.specialties.join(', ');
        } else {
            document.getElementById('tutorSubject').textContent = tutor.subject;
        }
      
        document.getElementById('tutorDesc').textContent = tutor.desc;
        document.getElementById('tutorRating').innerHTML = `<span class="rating-stars"><span class="star-filled">${'★'.repeat(Math.round(tutor.rating))}</span><span class="star-empty">${'☆'.repeat(5-Math.round(tutor.rating))}</span></span> (${tutor.rating}/5)`;
        document.getElementById('tutorStatus').textContent = tutor.status === 'available' ? 'Đang rảnh' : 'Đang bận';
        document.getElementById('tutorOnline').textContent = tutor.onlineSupport ? 'Có' : 'Không';
    }
}

// 2. Hiển thị lịch dạy của gia sư với Calendar
function renderTeachingSchedule() {
    const accordion = document.getElementById('schedule-accordion');
    if (!accordion || !tutors || !schedule) return;

    const tutor = tutors[0];
    if (!tutor) return;

    const tutorLessons = schedule.filter(lesson => lesson.tutor === tutor.name);

    // Tạo calendar view
    accordion.innerHTML = `
        <div class="calendar-container">
            <div class="calendar-controls">
                <button onclick="showCalendarView()" class="active">Calendar View</button>
                <button onclick="showListView()">List View</button>
                <button onclick="showQuickAddForm()" class="primary">Thêm lịch nhanh</button>
            </div>
            
            <div class="calendar-legend">
                <div class="legend-item">
                    <div class="legend-color not-started"></div>
                    <span>Chưa bắt đầu</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color upcoming"></div>
                    <span>Sắp tới</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color in-progress"></div>
                    <span>Đang thực hiện</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color finished"></div>
                    <span>Kết thúc</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color open-register"></div>
                    <span>Mở đăng ký</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color registered"></div>
                    <span>Đã đăng ký</span>
                </div>
            </div>
            
            <div id="calendar-view">
                ${renderCalendar()}
            </div>
            
            <div id="list-view" style="display: none;">
                ${renderListView(tutorLessons)}
            </div>
            
            <div id="quick-add-form" style="display: none;">
                ${renderQuickAddForm()}
            </div>
        </div>
    `;

    // Thêm modal cho chi tiết lesson
    if (!document.getElementById('lesson-detail-modal')) {
        const modal = document.createElement('div');
        modal.id = 'lesson-detail-modal';
        modal.className = 'lesson-detail-modal';
        modal.innerHTML = `
            <div class="lesson-detail-content">
                <div class="lesson-detail-header">
                    <div class="lesson-detail-title">Chi tiết buổi học</div>
                    <button class="lesson-detail-close">&times;</button>
                </div>
                <div class="lesson-detail-info" id="lesson-detail-info">
                    <!-- Lesson details will be populated here -->
                </div>
                <div class="lesson-detail-actions" id="lesson-detail-actions">
                    <!-- Action buttons will be populated here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelector('.lesson-detail-close').onclick = () => {
            modal.style.display = 'none';
        };
        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }
}

// Render calendar view
function renderCalendar() {
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const tutor = tutors[0];
    const tutorLessons = schedule.filter(lesson => lesson.tutor === tutor.name);
    
    let calendarHTML = `
        <div class="calendar-header">
            <div class="calendar-nav">
                <button onclick="changeMonth(-1)">&lt;</button>
                <span class="calendar-title">${getMonthName(currentCalendarMonth)} ${currentCalendarYear}</span>
                <button onclick="changeMonth(1)">&gt;</button>
            </div>
        </div>
        <div class="calendar-grid">
    `;
    
    // Add day headers
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    dayNames.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Add calendar days
    const today = new Date();
    let calendarDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
        const isToday = calendarDate.toDateString() === today.toDateString();
        const isOtherMonth = calendarDate.getMonth() !== currentCalendarMonth;
        const dayLessons = tutorLessons.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            return lessonDate.toDateString() === calendarDate.toDateString();
        });
        
        const hasLessons = dayLessons.length > 0;
        
        calendarHTML += `
            <div class="calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${hasLessons ? 'has-lessons' : ''}" 
                 onclick="showDayLessons('${calendarDate.toISOString().split('T')[0]}')">
                <div class="calendar-day-number">${calendarDate.getDate()}</div>
                <div class="calendar-lessons">
                    ${dayLessons.map(lesson => `
                        <div class="calendar-lesson-item ${lesson.onlineMeeting ? 'online' : ''} ${lesson.status === 'cancelled' ? 'cancelled' : ''} ${lesson.status === 'completed' ? 'completed' : ''}"
                             onclick="showLessonDetail(${lesson.id}); event.stopPropagation();">
                            ${lesson.subject.substring(0, 8)}...
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        calendarDate.setDate(calendarDate.getDate() + 1);
    }
    
    calendarHTML += '</div>';
    return calendarHTML;
}

// Render list view
function renderListView(tutorLessons) {
    if (tutorLessons.length === 0) {
        return '<p class="no-data">Chưa có lịch dạy nào.</p>';
    }

    // Group lessons by subject
    const lessonsBySubject = tutorLessons.reduce((acc, lesson) => {
        if (!acc[lesson.subject]) {
            acc[lesson.subject] = [];
        }
        acc[lesson.subject].push(lesson);
        return acc;
    }, {});

    return Object.keys(lessonsBySubject).map(subject => {
        const lessons = lessonsBySubject[subject];
        const firstLesson = lessons[0];
        let courseStatus = firstLesson.courseStatus || 'Chưa bắt đầu';

        // Override statuses for specific courses
        if (subject === 'Lập trình OOP cơ bản') {
            courseStatus = 'Sắp tới';
        } else if (subject === 'Lập trình hướng đối tượng') {
            courseStatus = 'Đang thực hiện';
        } else if (subject === 'Cấu trúc dữ liệu') {
            courseStatus = 'Kết thúc';
        } else if (subject === 'Phân tích thiết kế hệ thống') {
            courseStatus = 'Mở đăng ký';
        } else if (subject === 'Mạng máy tính') {
            courseStatus = 'Đã đăng ký (bởi Ngô Minh Học)';
        } else if (subject === 'A') {
            courseStatus = 'Chưa bắt đầu';
        }

        let statusClass = '';
        switch (courseStatus) {
            case 'Sắp tới':
                statusClass = 'status-upcoming';
                break;
            case 'Đang thực hiện':
                statusClass = 'status-in-progress';
                break;
            case 'Kết thúc':
                statusClass = 'status-finished';
                break;
            case 'Mở đăng ký':
                statusClass = 'status-open-register';
                break;
            case 'Đã đăng ký (bởi Ngô Minh Học)':
                statusClass = 'status-registered';
                break;
            default:
                statusClass = 'status-not-started';
        }

        return `
            <div class="accordion-item">
                <button class="accordion-header">
                    <span class="accordion-title">${subject}</span>
                    <span class="status-badge ${statusClass}">${courseStatus}</span>
                </button>
                <div class="accordion-content">
                    ${lessons.map(lesson => `
                        <div class="schedule-item">
                            <div class="schedule-date">
                                <div class="date">${lesson.date}</div>
                                <div class="time">${lesson.time.includes('-') ? lesson.time.split('-')[0] : lesson.time}</div>
                            </div>
                            <div class="schedule-info">
                                ${lesson.onlineMeeting ? `<div class="online-indicator">🖥️ Online</div>` : ''}
                                <div class="notes">(The meeting time maximum is one hour)</div>
                            </div>
                            <div class="schedule-status">
                                ${lesson.courseStatus === 'Sắp tới' || lesson.courseStatus === 'Đang thực hiện' ? `
                                    <a class="btn-join-meeting" href="${lesson.meetingLink || '#'}" target="_blank">Tham gia meeting</a>
                                ` : ''}
                                ${lesson.courseStatus !== 'Kết thúc' ? `
                                    <button class="btn-secondary" onclick="openRescheduleModal('reschedule', ${lesson.id})">Đổi lịch</button>
                                    <button class="btn-danger" onclick="openRescheduleModal('cancel', ${lesson.id})">Huỷ lịch</button>
                                ` : '<span class="status-text">Đã kết thúc</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Render quick add form
function renderQuickAddForm() {
    // Lấy danh sách môn học từ schedule hiện tại
    const tutor = tutors[0];
    const tutorLessons = schedule.filter(lesson => lesson.tutor === tutor.name);
    const existingSubjects = [...new Set(tutorLessons.map(lesson => lesson.subject))];
    
    // Thêm các môn học từ specialties của tutor
    const allSubjects = [...new Set([...existingSubjects, ...tutor.specialties])];
    
    // Đếm số lượng lịch dạy cho mỗi môn học
    const subjectCounts = {};
    tutorLessons.forEach(lesson => {
        subjectCounts[lesson.subject] = (subjectCounts[lesson.subject] || 0) + 1;
    });
    
    return `
        <div class="quick-add-form">
            <h4>Thêm lịch dạy nhanh</h4>
            <form id="quick-add-lesson-form">
                <div class="quick-add-grid">
                    <div>
                        <label>Môn học:</label>
                        <select id="quick-subject" required>
                            <option value="">-- Chọn môn học --</option>
                            ${allSubjects.map(subject => {
                                const count = subjectCounts[subject] || 0;
                                const countText = count > 0 ? ` (${count} lịch)` : '';
                                return `<option value="${subject}">${subject}${countText}</option>`;
                            }).join('')}
                            <option value="other">+ Thêm môn học mới</option>
                        </select>
                    </div>
                    <div>
                        <label>Ngày:</label>
                        <input type="date" id="quick-date" required>
                    </div>
                </div>
                <div class="quick-add-grid">
                    <div>
                        <label>Giờ bắt đầu:</label>
                        <input type="time" id="quick-time-start" required>
                    </div>
                    <div>
                        <label>Giờ kết thúc:</label>
                        <input type="time" id="quick-time-end" required>
                    </div>
                </div>
                <div class="quick-add-grid">
                    <div>
                        <label>Thời gian meeting:</label>
                        <span id="meeting-duration" style="color: #666; font-size: 12px;">--</span>
                    </div>
                    <div>
                        <label>Ghi chú:</label>
                        <textarea id="quick-notes" placeholder="Nhập ghi chú cho buổi học..."></textarea>
                    </div>
                </div>
                <div class="quick-add-grid full-width" id="new-subject-row" style="display: none;">
                    <div>
                        <label>Tên môn học mới:</label>
                        <input type="text" id="new-subject-name" placeholder="Nhập tên môn học mới">
                    </div>
                </div>
                <button type="submit">Thêm lịch</button>
            </form>
        </div>
    `;
}

// Calendar helper functions
function getMonthName(month) {
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    return months[month];
}

// Global variables for calendar navigation
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

function changeMonth(direction) {
    currentCalendarMonth += direction;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    } else if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    renderTeachingSchedule();
}

function showCalendarView() {
    document.getElementById('calendar-view').style.display = 'block';
    document.getElementById('list-view').style.display = 'none';
    document.getElementById('quick-add-form').style.display = 'none';
    
    // Update button states
    document.querySelectorAll('.calendar-controls button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="showCalendarView()"]').classList.add('active');
}

function showListView() {
    document.getElementById('calendar-view').style.display = 'none';
    document.getElementById('list-view').style.display = 'block';
    document.getElementById('quick-add-form').style.display = 'none';
    
    // Update button states
    document.querySelectorAll('.calendar-controls button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="showListView()"]').classList.add('active');
    
    // Add accordion functionality
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });
}

function showQuickAddForm() {
    document.getElementById('calendar-view').style.display = 'none';
    document.getElementById('list-view').style.display = 'none';
    document.getElementById('quick-add-form').style.display = 'block';
    
    // Update button states
    document.querySelectorAll('.calendar-controls button').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[onclick="showQuickAddForm()"]').classList.add('active');
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('quick-date');
    if (dateInput) dateInput.value = today;
    
    // Add event listener for subject dropdown
    const subjectSelect = document.getElementById('quick-subject');
    const newSubjectRow = document.getElementById('new-subject-row');
    const newSubjectInput = document.getElementById('new-subject-name');
    
    if (subjectSelect) {
        subjectSelect.onchange = function() {
            if (this.value === 'other') {
                newSubjectRow.style.display = 'block';
                newSubjectRow.classList.add('show');
                newSubjectInput.required = true;
                newSubjectInput.focus();
            } else {
                newSubjectRow.classList.remove('show');
                setTimeout(() => {
                    newSubjectRow.style.display = 'none';
                }, 300);
                newSubjectInput.required = false;
                newSubjectInput.value = '';
            }
        };
    }
    
    // Add event listeners for time inputs
    const timeStartInput = document.getElementById('quick-time-start');
    const timeEndInput = document.getElementById('quick-time-end');
    const durationSpan = document.getElementById('meeting-duration');
    
    function calculateDuration() {
        const startTime = timeStartInput.value;
        const endTime = timeEndInput.value;
        
        if (startTime && endTime) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            
            if (end <= start) {
                durationSpan.textContent = 'Giờ kết thúc phải sau giờ bắt đầu!';
                durationSpan.className = 'invalid';
                return false;
            }
            
            const diffMs = end - start;
            const diffMinutes = Math.round(diffMs / (1000 * 60));
            
            if (diffMinutes > 60) {
                durationSpan.textContent = `Quá 60 phút (${diffMinutes} phút)`;
                durationSpan.className = 'invalid';
                return false;
            }
            
            durationSpan.textContent = `${diffMinutes} phút`;
            durationSpan.className = 'valid';
            return true;
        } else {
            durationSpan.textContent = '--';
            durationSpan.className = '';
            return false;
        }
    }
    
    if (timeStartInput && timeEndInput) {
        timeStartInput.onchange = calculateDuration;
        timeEndInput.onchange = calculateDuration;
        
        // Set default end time to 1 hour after start time
        timeStartInput.onchange = function() {
            if (this.value) {
                const startTime = new Date(`2000-01-01T${this.value}`);
                const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour
                timeEndInput.value = endTime.toTimeString().slice(0, 5);
            }
            calculateDuration();
        };
    }
    
    // Add form submit handler
    const form = document.getElementById('quick-add-lesson-form');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const subjectSelect = document.getElementById('quick-subject');
            const newSubjectInput = document.getElementById('new-subject-name');
            const date = document.getElementById('quick-date').value;
            const timeStart = document.getElementById('quick-time-start').value;
            const timeEnd = document.getElementById('quick-time-end').value;
            const notes = document.getElementById('quick-notes').value.trim();
            
            let subject = '';
            if (subjectSelect.value === 'other') {
                subject = newSubjectInput.value.trim();
                if (!subject) {
                    alert('Vui lòng nhập tên môn học mới!');
                    return;
                }
            } else {
                subject = subjectSelect.value.trim();
            }
            
            if (!subject || !date || !timeStart || !timeEnd) {
                alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
                return;
            }
            
            // Validate time duration
            const start = new Date(`2000-01-01T${timeStart}`);
            const end = new Date(`2000-01-01T${timeEnd}`);
            
            if (end <= start) {
                alert('Giờ kết thúc phải sau giờ bắt đầu!');
                return;
            }
            
            const diffMs = end - start;
            const diffMinutes = Math.round(diffMs / (1000 * 60));
            
            if (diffMinutes > 60) {
                alert(`Thời gian meeting không được quá 60 phút! (Hiện tại: ${diffMinutes} phút)`);
                return;
            }
            
            const timeRange = `${timeStart}-${timeEnd}`;
            const newId = Math.max(0, ...schedule.map(l => l.id)) + 1;
            const tutor = tutors[0];
            
            schedule.push({
                id: newId,
                date,
                time: timeRange,
                subject,
                tutor: tutor.name,
                status: 'upcoming',
                notes,
                meetingType: '1-1',
                onlineMeeting: true, // Mặc định là online MS Teams
                meetingLink: 'https://teams.microsoft.com/l/meetup-join/example'
            });
            
            saveScheduleToStorage();
            renderTeachingSchedule();
            showCalendarView();
            alert('Đã thêm lịch dạy thành công!');
        };
    }
}

function showDayLessons(date) {
    const tutor = tutors[0];
    const dayLessons = schedule.filter(lesson => 
        lesson.tutor === tutor.name && lesson.date === date
    );
    
    if (dayLessons.length === 0) {
        alert(`Không có lịch dạy nào vào ngày ${date}`);
        return;
    }
    
    let message = `Lịch dạy ngày ${date}:\n\n`;
    dayLessons.forEach(lesson => {
        message += `• ${lesson.time} - ${lesson.subject}\n`;
        if (lesson.onlineMeeting) message += '  (Online)\n';
        if (lesson.notes) message += `  Ghi chú: ${lesson.notes}\n`;
        message += '\n';
    });
    
    alert(message);
}

function showLessonDetail(lessonId) {
    const lesson = schedule.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const modal = document.getElementById('lesson-detail-modal');
    const infoDiv = document.getElementById('lesson-detail-info');
    const actionsDiv = document.getElementById('lesson-detail-actions');
    
    infoDiv.innerHTML = `
        <div class="lesson-info-item">
            <span class="lesson-info-label">Môn học:</span>
            <span class="lesson-info-value">${lesson.subject}</span>
        </div>
        <div class="lesson-info-item">
            <span class="lesson-info-label">Ngày:</span>
            <span class="lesson-info-value">${lesson.date}</span>
        </div>
        <div class="lesson-info-item">
            <span class="lesson-info-label">Thời gian:</span>
            <span class="lesson-info-value">${lesson.time.includes('-') ? lesson.time : lesson.time + ' (1 giờ)'}</span>
        </div>
        <div class="lesson-info-item">
            <span class="lesson-info-label">Loại meeting:</span>
            <span class="lesson-info-value">${lesson.onlineMeeting ? 'Online' : 'Offline'}</span>
        </div>
        <div class="lesson-info-item">
            <span class="lesson-info-label">Trạng thái:</span>
            <span class="lesson-info-value">${lesson.status === 'cancelled' ? 'Đã hủy' : lesson.status === 'completed' ? 'Hoàn thành' : 'Sắp tới'}</span>
        </div>
        ${lesson.notes ? `
        <div class="lesson-info-item">
            <span class="lesson-info-label">Ghi chú:</span>
            <span class="lesson-info-value">${lesson.notes}</span>
        </div>
        ` : ''}
    `;
    
    actionsDiv.innerHTML = `
        ${lesson.status !== 'cancelled' && lesson.status !== 'completed' ? `
            <button class="primary" onclick="editLesson(${lesson.id})">Sửa lịch</button>
            <button class="danger" onclick="cancelLesson(${lesson.id})">Hủy lịch</button>
        ` : ''}
        ${lesson.onlineMeeting && lesson.status !== 'cancelled' ? `
            <button class="secondary" onclick="joinMeeting(${lesson.id})">Tham gia meeting</button>
        ` : ''}
        <button class="secondary" onclick="closeLessonDetail()">Đóng</button>
    `;
    
    modal.style.display = 'block';
}

function editLesson(lessonId) {
    const lesson = schedule.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const newDate = prompt('Nhập ngày mới (YYYY-MM-DD):', lesson.date);
    if (!newDate) return;
    
    const newTime = prompt('Nhập giờ mới (HH:MM):', lesson.time);
    if (!newTime) return;
    
    if (confirm(`Bạn có chắc muốn thay đổi lịch dạy sang ngày ${newDate}, giờ ${newTime}?`)) {
        lesson.date = newDate;
        lesson.time = newTime;
        saveScheduleToStorage();
        renderTeachingSchedule();
        closeLessonDetail();
        notifyLearner(`Gia sư đã thay đổi lịch dạy: ${lesson.subject} vào ngày ${newDate}, giờ ${newTime}`);
    }
}

function cancelLesson(lessonId) {
    const lesson = schedule.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const reason = prompt('Nhập lý do hủy lịch:');
    if (!reason) return;
    
    if (confirm(`Bạn có chắc muốn hủy lịch dạy này?`)) {
        lesson.status = 'cancelled';
        lesson.notes = `Đã hủy. Lý do: ${reason}`;
        saveScheduleToStorage();
        renderTeachingSchedule();
        closeLessonDetail();
        notifyLearner(`Gia sư đã hủy lịch dạy: ${lesson.subject} vào ngày ${lesson.date}, giờ ${lesson.time}`);
    }
}

function joinMeeting(lessonId) {
    const lesson = schedule.find(l => l.id === lessonId);
    if (!lesson) return;
    
    const meetingLink = lesson.meetingLink || 'https://meet.google.com/xxx-yyyy-zzz';
    window.open(meetingLink, '_blank');
}

function closeLessonDetail() {
    document.getElementById('lesson-detail-modal').style.display = 'none';
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

// Hiển thị modal đăng ký làm gia sư nếu có query ?register=1
function openRegisterTutorModal() {
  const modal = document.getElementById('registerTutorModal');
  if (modal) {
    modal.style.display = 'block';
    // Tự động điền và khóa các trường thông tin cố định
    const fixedName = 'Trần Minh Khoa';
    const fixedGender = 'Nam';
    const fixedMSSV = '2374802010241';
    const fixedPhone = '0911728117';
    const nameInput = document.getElementById('regTutorName');
    const genderInput = document.getElementById('regTutorGender');
    const mssvInput = document.getElementById('regTutorMSSV');
    const phoneInput = document.getElementById('regTutorPhone');
    
    // Apply readonly styling and add container for note
    if (nameInput) {
        nameInput.value = fixedName;
        nameInput.readOnly = true;
        nameInput.classList.add('readonly');
        nameInput.parentElement.classList.add('readonly-field-container');
    }
    if (genderInput) {
        genderInput.value = fixedGender;
        genderInput.disabled = true;
        genderInput.classList.add('readonly');
        genderInput.parentElement.classList.add('readonly-field-container');
    }
    if (mssvInput) {
        mssvInput.value = fixedMSSV;
        mssvInput.readOnly = true;
        mssvInput.classList.add('readonly');
        mssvInput.parentElement.classList.add('readonly-field-container');
    }
    if (phoneInput) {
        phoneInput.value = fixedPhone;
        phoneInput.readOnly = true;
        phoneInput.classList.add('readonly');
        phoneInput.parentElement.classList.add('readonly-field-container');
    }
    // GPA field is not readonly - remove any existing readonly styling
    const gpaInput = document.getElementById('regTutorGPA');
    if (gpaInput) {
        gpaInput.classList.remove('readonly');
        gpaInput.readOnly = false;
        gpaInput.disabled = false;
        gpaInput.parentElement.classList.remove('readonly-field-container');
    }
  }
}
function closeRegisterTutorModal() {
  const modal = document.getElementById('registerTutorModal');
  if (modal) {
    modal.style.display = 'none';
    // Reset form and remove readonly styling when closing modal
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
      // Remove readonly container styling
      const readonlyContainers = form.querySelectorAll('.readonly-field-container');
      readonlyContainers.forEach(container => {
        container.classList.remove('readonly-field-container');
      });
      // Reset suggestion buttons highlighting
      const suggestionBtns = document.querySelectorAll('.suggestion-btn');
      suggestionBtns.forEach(btn => {
        btn.style.background = '#fff';
        btn.style.borderColor = '#ddd';
        btn.style.color = '#555';
      });
    }
  }
}
// Gắn sự kiện đóng modal
window.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('register') === '1') openRegisterTutorModal();
  const closeBtn = document.getElementById('closeRegisterTutorModal');
  if (closeBtn) closeBtn.onclick = closeRegisterTutorModal;
  window.onclick = function(event) {
    const modal = document.getElementById('registerTutorModal');
    if (event.target === modal) closeRegisterTutorModal();
  };
  // Xử lý submit form đăng ký
  const form = document.getElementById('registerTutorForm');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      
      // Lấy dữ liệu từ form
      const bio = document.getElementById('regTutorBio').value.trim();
      const url = document.getElementById('regTutorURL').value.trim();
      
      if (!bio) {
        alert('Vui lòng nhập thông tin giới thiệu về bản thân!');
        return;
      }
      
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
        email: 'khoa.2374802010241@vanlanguni.vn',
        phone: '0911728117',
        mssv: '2374802010241',
        gender: 'Nam',
        gpa: document.getElementById('regTutorGPA').value || '3.8',
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
    };
  }
});

document.addEventListener('DOMContentLoaded', function() {
    // Load dữ liệu gia sư từ localStorage nếu có
    const savedTutors = localStorage.getItem('tutors');
    if (savedTutors) {
        try {
            const parsedTutors = JSON.parse(savedTutors);
            if (Array.isArray(parsedTutors) && parsedTutors.length > 0) {
                // Cập nhật dữ liệu tutors với dữ liệu từ localStorage
                tutors.length = 0;
                parsedTutors.forEach(tutor => tutors.push(tutor));
                console.log('Loaded tutors from localStorage:', tutors);
            }
        } catch (e) {
            console.error('Error loading tutors from localStorage:', e);
        }
    }
    
    // Thêm thư xác nhận vào hộp thư nếu chưa có
    let inbox = JSON.parse(localStorage.getItem('tutorInbox') || '[]');
    const confirmMsg = 'Xác nhận đã nhận được đơn đăng kí làm gia sư.';
    const alreadyExists = inbox.some(msg => msg.content === confirmMsg);
    if (!alreadyExists) {
        inbox.unshift({
            sender: 'SUPPORT CENTER',
            content: confirmMsg,
            date: new Date().toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
        });
        localStorage.setItem('tutorInbox', JSON.stringify(inbox));
    }
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
            
            // Apply readonly styling and add container for note
            if (nameInput) {
                nameInput.value = fixedName;
                nameInput.readOnly = true;
                nameInput.classList.add('readonly');
                nameInput.parentElement.classList.add('readonly-field-container');
            }
            if (genderInput) {
                genderInput.value = fixedGender;
                genderInput.disabled = true;
                genderInput.classList.add('readonly');
                genderInput.parentElement.classList.add('readonly-field-container');
            }
            if (mssvInput) {
                mssvInput.value = fixedMSSV;
                mssvInput.readOnly = true;
                mssvInput.classList.add('readonly');
                mssvInput.parentElement.classList.add('readonly-field-container');
            }
            if (phoneInput) {
                phoneInput.value = fixedPhone;
                phoneInput.readOnly = true;
                phoneInput.classList.add('readonly');
                phoneInput.parentElement.classList.add('readonly-field-container');
            }
            // GPA field is not readonly - remove any existing readonly styling
            const gpaInput = document.getElementById('regTutorGPA');
            if (gpaInput) {
                gpaInput.classList.remove('readonly');
                gpaInput.readOnly = false;
                gpaInput.disabled = false;
                gpaInput.parentElement.classList.remove('readonly-field-container');
            }
        };
        closeRegisterModal.onclick = function() { 
            registerModal.style.display = 'none';
            // Reset form and remove readonly styling when closing modal
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
                // Remove readonly container styling
                const readonlyContainers = form.querySelectorAll('.readonly-field-container');
                readonlyContainers.forEach(container => {
                    container.classList.remove('readonly-field-container');
                });
                // Reset suggestion buttons highlighting
                const suggestionBtns = document.querySelectorAll('.suggestion-btn');
                suggestionBtns.forEach(btn => {
                    btn.style.background = '#fff';
                    btn.style.borderColor = '#ddd';
                    btn.style.color = '#555';
                });
            }
        };
        window.onclick = function(event) {
            if (event.target === registerModal) {
                registerModal.style.display = 'none';
                // Reset form and remove readonly styling when closing modal
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
                    // Remove readonly container styling
                    const readonlyContainers = form.querySelectorAll('.readonly-field-container');
                    readonlyContainers.forEach(container => {
                        container.classList.remove('readonly-field-container');
                    });
                    // Reset suggestion buttons highlighting
                    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
                    suggestionBtns.forEach(btn => {
                        btn.style.background = '#fff';
                        btn.style.borderColor = '#ddd';
                        btn.style.color = '#555';
                    });
                }
            }
        };
    }
    
    // Xử lý các nút đề xuất thời gian phỏng vấn
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const suggestedTime = this.getAttribute('data-time');
            const interviewTimeInput = document.getElementById('regTutorInterviewTime');
            if (interviewTimeInput) {
                interviewTimeInput.value = suggestedTime;
                // Highlight the selected button
                suggestionBtns.forEach(b => b.style.background = '#fff');
                suggestionBtns.forEach(b => b.style.borderColor = '#ddd');
                suggestionBtns.forEach(b => b.style.color = '#555');
                this.style.background = '#e3f2fd';
                this.style.borderColor = '#1976d2';
                this.style.color = '#1976d2';
            }
        });
    });
    
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
            const bio = document.getElementById('regTutorBio').value.trim();
            const url = document.getElementById('regTutorUrl').value.trim();
            const achievement = document.getElementById('regTutorAchievement').value;
            const interviewTime = document.getElementById('regTutorInterviewTime').value;
            if (!name || !gender || !mssv || !gpa) {
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
                  <b>Bio:</b> ${bio || 'Chưa nhập'}<br/>
                  <b>URL Link:</b> ${url || 'Chưa nhập'}<br/>
                  <b>Chứng chỉ:</b> ${achievement || 'Chưa chọn'}<br/>
                  <b>Thời gian phỏng vấn:</b> ${interviewTime || 'Chưa chọn'}<br/>
                </div>
                <button id="confirmSendRegister" class="btn-primary" style="width:100%;margin-bottom:8px;">Xác nhận gửi đăng ký</button>
                <button id="cancelSendRegister" class="btn-secondary" style="width:100%;">Quay lại chỉnh sửa</button>
              </div>
            `;
            document.body.appendChild(reviewModal);
            // Đóng modal review khi click bên ngoài
            const originalWindowClick = window.onclick;
            window.onclick = function(event) {
                if (event.target === reviewModal) {
                    document.body.removeChild(reviewModal);
                    // Restore original window click handler
                    window.onclick = originalWindowClick;
                    // Don't reset form when closing review modal, just close it
                } else if (originalWindowClick) {
                    originalWindowClick(event);
                }
            };
            // Đóng modal review
            document.getElementById('closeReviewModal').onclick = function() {
                document.body.removeChild(reviewModal);
                // Restore original window click handler
                window.onclick = originalWindowClick;
                // Don't reset form when closing review modal, just close it
            };
            document.getElementById('cancelSendRegister').onclick = function() {
                document.body.removeChild(reviewModal);
                // Restore original window click handler
                window.onclick = originalWindowClick;
                // Don't reset form when canceling, just close the review modal
            };
            document.getElementById('confirmSendRegister').onclick = function() {
                // Thực hiện gửi đăng ký như cũ
                alert('Đăng ký thành công!\nTên: ' + name + '\nGiới tính: ' + gender + '\nMSSV: ' + mssv + '\nGPA: ' + gpa + '\nBio: ' + (bio || 'Chưa nhập') + '\nURL: ' + (url || 'Chưa nhập') + '\nChứng chỉ: ' + (achievement || 'Chưa chọn') + '\nThời gian phỏng vấn: ' + (interviewTime || 'Chưa chọn'));
                document.getElementById('registerTutorModal').style.display = 'none';
                regForm.reset();
                // Remove readonly styling after successful submission
                const readonlyInputs = regForm.querySelectorAll('.readonly');
                readonlyInputs.forEach(input => {
                    input.classList.remove('readonly');
                    input.readOnly = false;
                    input.disabled = false;
                });
                // Remove readonly container styling
                const readonlyContainers = regForm.querySelectorAll('.readonly-field-container');
                readonlyContainers.forEach(container => {
                    container.classList.remove('readonly-field-container');
                });
                document.body.removeChild(reviewModal);
                // Restore original window click handler
                window.onclick = originalWindowClick;
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
    // Logic cho 2 button Sửa/Xóa môn học
    const editBtn = document.getElementById('editCourseBtn');
    const deleteBtn = document.getElementById('deleteCourseBtn');
    const editModal = document.getElementById('editCourseModal');
    const deleteModal = document.getElementById('deleteCourseModal');
    const closeEditModal = document.getElementById('closeEditCourseModal');
    const closeDeleteModal = document.getElementById('closeDeleteCourseModal');
    const editForm = document.getElementById('editCourseForm');
    const deleteForm = document.getElementById('deleteCourseForm');
    const deleteSelect = document.getElementById('deleteCourseSelect');

    if (editBtn && editModal) {
        editBtn.onclick = function() {
            // Populate select options cho sửa môn học
            const editSelect = document.getElementById('editCourseName');
            if (editSelect) {
                editSelect.innerHTML = '';
                const subjects = [...new Set(schedule.map(l => l.subject))];
                subjects.forEach(sub => {
                    const opt = document.createElement('option');
                    opt.value = sub;
                    opt.textContent = sub;
                    editSelect.appendChild(opt);
                });
            }
            editModal.style.display = 'block';
        };
    }
    if (closeEditModal && editModal) {
        closeEditModal.onclick = function() { editModal.style.display = 'none'; };
    }
    if (deleteBtn && deleteModal) {
        deleteBtn.onclick = function() {
            // Populate select options
            if (deleteSelect) {
                deleteSelect.innerHTML = '';
                const subjects = [...new Set(schedule.map(l => l.subject))];
                subjects.forEach(sub => {
                    const opt = document.createElement('option');
                    opt.value = sub;
                    opt.textContent = sub;
                    deleteSelect.appendChild(opt);
                });
            }
            deleteModal.style.display = 'block';
        };
    }
    if (closeDeleteModal && deleteModal) {
        closeDeleteModal.onclick = function() { deleteModal.style.display = 'none'; };
    }
    // Gửi thông báo sửa môn học
    if (editForm) {
        editForm.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('editCourseName').value;
            const newName = document.getElementById('editCourseNewName').value.trim();
            const time = document.getElementById('editCourseTime').value;
            const reason = document.getElementById('editCourseReason').value.trim();
            if (!name || !time || !reason) return alert('Vui lòng nhập đủ thông tin!');
            let inbox = JSON.parse(localStorage.getItem('supportcenterInbox') || '[]');
            inbox.unshift({
                type: 'edit',
                content: `Yêu cầu sửa môn học: ${name}${newName ? `, đổi tên thành: ${newName}` : ''}, thời gian: ${time}, lý do: ${reason}`,
                time: new Date().toLocaleString('vi-VN')
            });
            localStorage.setItem('supportcenterInbox', JSON.stringify(inbox));
            editModal.style.display = 'none';
            alert('Đã gửi yêu cầu sửa môn học đến Trung tâm Hỗ trợ Văn Lang!');
            editForm.reset();
        };
    }
    // Gửi thông báo xóa môn học
    if (deleteForm) {
        deleteForm.onsubmit = function(e) {
            e.preventDefault();
            const subject = deleteSelect.value;
            if (!subject) return alert('Vui lòng chọn môn học!');
            let inbox = JSON.parse(localStorage.getItem('supportcenterInbox') || '[]');
            inbox.unshift({
                type: 'delete',
                content: `Yêu cầu xóa môn học: ${subject}`,
                time: new Date().toLocaleString('vi-VN')
            });
            localStorage.setItem('supportcenterInbox', JSON.stringify(inbox));
            deleteModal.style.display = 'none';
            alert('Đã gửi yêu cầu xóa môn học đến Trung tâm Hỗ trợ Văn Lang!');
            deleteForm.reset();
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
    const profileDesc = document.getElementById('profileDesc');
    if (tutors && tutors.length > 0) {
        const tutor = tutors[0];
        if (profileSubject) profileSubject.value = tutor.subject;
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
            const newDesc = profileDesc.value.trim();
            if (!newSubject) {
                alert('Vui lòng nhập chuyên môn!');
                return;
            }
            // Cập nhật thông tin tutor
            tutors[0].subject = newSubject;
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
            tutor: tutors[0].name,
            status: 'upcoming',
            notes,
            meetingType: '1-1',
            onlineMeeting,
            meetingLink
        });
        document.getElementById('addLessonModal').style.display = 'none';
        this.reset();
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