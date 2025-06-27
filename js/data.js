// Dữ liệu mẫu cho tutor
const tutors = [
  { id: 1, name: 'Nguyễn Văn A', status: 'available', subject: 'Lập trình hướng đối tượng', price: 150000, desc: 'Sinh viên năm 3 CNTT, GPA 3.8/4.0, kinh nghiệm 2 năm.', rating: 4.8, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true },
  { id: 2, name: 'Trần Thị B', status: 'busy', subject: 'Triết học Mác-Lênin', price: 120000, desc: 'Sinh viên năm 4 Khoa học xã hội, chuyên ngành Triết học.', rating: 4.6, students: 1, avatar: '👩‍🏫', meetingType: '1-1', onlineSupport: true },
  { id: 3, name: 'Lê Văn C', status: 'available', subject: 'Toán rời rạc', price: 200000, desc: 'Sinh viên năm 3 Toán-Tin, GPA 3.9/4.0, giải thưởng sinh viên xuất sắc.', rating: 4.9, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true },
  { id: 4, name: 'Phạm Thị D', status: 'available', subject: 'Lập trình web nâng cao', price: 130000, desc: 'Sinh viên năm 4 CNTT, chuyên về Frontend và Backend.', rating: 4.7, students: 1, avatar: '👩‍🏫', meetingType: '1-1', onlineSupport: true },
  { id: 5, name: 'Hoàng Văn E', status: 'busy', subject: 'Cơ sở dữ liệu', price: 170000, desc: 'Sinh viên năm 3 CNTT, chuyên về Database và SQL.', rating: 4.5, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true }
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
  { id: 1, date: '2024-01-15', time: '19:00-21:00', subject: 'Lập trình OOP cơ bản', tutor: 'Nguyễn Văn A', status: 'completed', notes: 'Học về kế thừa và đa hình', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example1' },
  { id: 2, date: '2024-01-17', time: '19:00-21:00', subject: 'Toán rời rạc', tutor: 'Lê Văn C', status: 'upcoming', notes: 'Ôn tập về logic và tập hợp', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example2' },
  { id: 3, date: '2024-01-19', time: '19:00-21:00', subject: 'Lập trình web nâng cao', tutor: 'Phạm Thị D', status: 'upcoming', notes: 'Thực hành React và Node.js', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example3' },
  { id: 4, date: '2024-01-22', time: '19:00-21:00', subject: 'Lập trình hướng đối tượng', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Thiết kế giao diện và trừu tượng', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example4' },
  // Buổi meeting mới cho Nguyễn Văn A
  { id: 5, date: '2024-01-24', time: '08:00-10:00', subject: 'Cấu trúc dữ liệu', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Học về danh sách liên kết và cây', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example5' },
  { id: 6, date: '2024-01-26', time: '10:00-12:00', subject: 'Phân tích thiết kế hệ thống', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Học về UML và use case', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example6' },
  { id: 7, date: '2024-01-28', time: '13:00-15:00', subject: 'Mạng máy tính', tutor: 'Nguyễn Văn A', status: 'upcoming', notes: 'Học về TCP/IP và mô hình OSI', meetingType: '1-1', onlineMeeting: true, meetingLink: 'https://teams.microsoft.com/l/meetup-join/example7' }
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