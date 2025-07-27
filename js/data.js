// Dữ liệu mẫu cho tutor
const tutors = [
  { id: 1, name: 'Trần Minh Khoa', status: 'available', subject: 'Lập trình hướng đối tượng', desc: 'Sinh viên năm 3 CNTT, GPA 3.8/4.0, kinh nghiệm 2 năm.', rating: 4.8, ratingCount: 12, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true, bio: 'Đam mê lập trình, từng đạt giải Olympic Tin học. Thích chia sẻ kiến thức và giúp đỡ các bạn học sinh tiến bộ.', achievements: ['🏆 1000+ giờ dạy', '📜 Chứng chỉ TOEIC 900+', '🏅 Certified Teacher'] },
  { id: 2, name: 'Trần Thị B', status: 'busy', subject: 'Triết học Mác-Lênin', desc: 'Sinh viên năm 4 Khoa học xã hội, chuyên ngành Triết học.', rating: 4.6, ratingCount: 8, students: 1, avatar: '👩‍🏫', meetingType: '1-1', onlineSupport: true, bio: 'Có kinh nghiệm giảng dạy và tham gia nhiều hoạt động ngoại khóa, yêu thích triết học ứng dụng.', achievements: ['🏆 500+ giờ dạy', '👩‍🎓 Thành viên CLB Triết học', '🏅 Top 10 Olympic Triết học'] },
  { id: 3, name: 'Lê Văn C', status: 'available', subject: 'Toán rời rạc', desc: 'Sinh viên năm 3 Toán-Tin, GPA 3.9/4.0, giải thưởng sinh viên xuất sắc.', rating: 4.9, ratingCount: 15, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true, bio: 'Đam mê Toán học, từng đạt giải Nhất Olympic Toán sinh viên toàn quốc.', achievements: ['🏆 Giải Nhất Olympic Toán', '⏰ 800+ giờ dạy', '💻 Chứng chỉ Tin học quốc tế'] },
  { id: 4, name: 'Phạm Thị D', status: 'available', subject: 'Lập trình web nâng cao', desc: 'Sinh viên năm 4 CNTT, chuyên về Frontend và Backend.', rating: 4.7, ratingCount: 10, students: 1, avatar: '👩‍🏫', meetingType: '1-1', onlineSupport: true, bio: 'Chuyên về lập trình web, từng thực tập tại các công ty lớn, thích chia sẻ kinh nghiệm thực tế.', achievements: ['🏆 700+ giờ dạy', '⚛️ Chứng chỉ ReactJS', '🥇 Top 5 Hackathon VLU'] },
  { id: 5, name: 'Hoàng Văn E', status: 'busy', subject: 'Cơ sở dữ liệu', desc: 'Sinh viên năm 3 CNTT, chuyên về Database và SQL.', rating: 4.5, ratingCount: 6, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true, bio: 'Yêu thích dữ liệu, từng đạt học bổng xuất sắc, luôn cập nhật công nghệ mới.', achievements: ['🏆 600+ giờ dạy', '🗄️ Chứng chỉ SQL Server', '🎓 Học bổng xuất sắc VLU'] }
];

// Dữ liệu mẫu cho learner
const learner = {
  id: 1,
  name: 'Ngô Minh Học',
  email: 'hoc.ngo@vanlanguni.edu.vn',
  phone: '0912345678',
  avatar: '👨‍🎓',
  grade: 'Khóa 2023',
  school: 'Khoa Công nghệ thông tin - Đại học Văn Lang',
  address: 'Cơ sở 3 - 69/68 Đặng Thùy Trâm, P.13, Q.Bình Thạnh, TP.HCM',
  joinDate: '2023-09-15',
  totalLessons: 45,
  completedLessons: 38,
  currentSubjects: ['Lập trình hướng đối tượng', 'Toán rời rạc', 'Lập trình web nâng cao'],
  preferredSchedule: ['Thứ 2, 4, 6', '19:00 - 21:00'],
  emergencyContact: {
    name: 'Ngô Văn Bố',
    phone: '0901234567',
    relationship: 'Bố'
  }
};

// Dữ liệu lịch học
const schedule = [
  { id: 1, date: '2025-01-17', time: '10:30-11:30', subject: 'Lập trình hướng đối tượng', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Đã đổi lịch. Lý do: ngủ', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example1', courseStatus: 'Sắp tới' },
  { id: 2, date: '2024-01-22', time: '19:00-20:00', subject: 'Lập trình hướng đối tượng', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Thiết kế giao diện và trừu tượng', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example4', courseStatus: 'Đang thực hiện' },
  { id: 3, date: '2024-01-24', time: '08:00-09:00', subject: 'Cấu trúc dữ liệu', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Học về danh sách liên kết và cây', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example5', courseStatus: 'Kết thúc' },
  { id: 4, date: '2024-01-26', time: '10:00-11:00', subject: 'Phân tích thiết kế hệ thống', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Học về UML và use case', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example6', courseStatus: 'Mở đăng ký' },
  { id: 5, date: '2024-01-28', time: '13:00-14:00', subject: 'Mạng máy tính', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Học về TCP/IP và mô hình OSI', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/mangmaytinh', courseStatus: 'Đã đăng ký (bởi Ngô Minh Học)' },
  { id: 6, date: '2024-02-02', time: '09:00-10:00', subject: 'Triết học Mác-Lênin', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: '', meetingType: '1-1', onlineMeeting: true, meetingLink: '', courseStatus: 'Chưa bắt đầu' },
  { id: 7, date: '2024-02-05', time: '15:00-16:00', subject: 'Kinh tế vĩ mô', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: '', meetingType: '1-1', onlineMeeting: true, meetingLink: '', courseStatus: 'Chưa bắt đầu' }
];

// Dữ liệu thống kê học tập với GPA
const statistics = {
  totalHours: 76,
  averageGPA: 3.2,
  improvementRate: 15,
  subjects: [
    { name: 'Lập trình hướng đối tượng', gpa: 3.5, grade: 'A-', improvement: 12 },
    { name: 'Toán rời rạc', gpa: 2.8, grade: 'B+', improvement: 18 },
    { name: 'Lập trình web nâng cao', gpa: 3.8, grade: 'A', improvement: 20 }
  ],
  monthlyProgress: [
    { month: 'T9', hours: 12, gpa: 2.5, grade: 'C+' },
    { month: 'T10', hours: 16, gpa: 2.8, grade: 'B-' },
    { month: 'T11', hours: 18, gpa: 3.0, grade: 'B' },
    { month: 'T12', hours: 20, gpa: 3.1, grade: 'B+' },
    { month: 'T1', hours: 10, gpa: 3.2, grade: 'B+' }
  ],
  gpaDistribution: [
    { grade: 'A+', count: 2, percentage: 10 },
    { grade: 'A', count: 5, percentage: 25 },
    { grade: 'A-', count: 4, percentage: 20 },
    { grade: 'B+', count: 3, percentage: 15 },
    { grade: 'B', count: 2, percentage: 10 },
    { grade: 'B-', count: 2, percentage: 10 },
    { grade: 'C+', count: 1, percentage: 5 },
    { grade: 'C', count: 1, percentage: 5 }
  ]
};

// Dữ liệu đánh giá
const reviews = [
  { id: 1, tutorName: 'Nguyễn Văn A', subject: 'Lập trình hướng đối tượng', rating: 5, comment: 'Anh dạy rất dễ hiểu, phương pháp tốt', date: '2024-01-10' },
  { id: 2, tutorName: 'Lê Văn C', subject: 'Toán rời rạc', rating: 4, comment: 'Anh nhiệt tình, giúp em tiến bộ nhiều', date: '2024-01-08' },
  { id: 3, tutorName: 'Phạm Thị D', subject: 'Lập trình web nâng cao', rating: 5, comment: 'Chị phát âm chuẩn, dạy rất hay', date: '2024-01-05' }
];

// Danh sách môn học (dành cho System Administrator)
let courses = [
  { id: 1, name: 'Lập trình hướng đối tượng', code: 'OOP', description: 'Học về các khái niệm OOP, kế thừa, đa hình, đóng gói.' },
  { id: 2, name: 'Toán rời rạc', code: 'DISMATH', description: 'Logic, tập hợp, quan hệ, đồ thị, tổ hợp.' },
  { id: 3, name: 'Lập trình web nâng cao', code: 'WEB2', description: 'React, Node.js, RESTful API, bảo mật web.' },
  { id: 4, name: 'Cơ sở dữ liệu', code: 'DB', description: 'SQL, thiết kế CSDL, truy vấn, tối ưu.' }
]; 