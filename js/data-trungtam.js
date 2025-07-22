// DỮ LIỆU MỚI: DANH SÁCH GIA SƯ CHỜ XÉT DUYỆT
const pendingTutors = [
  { id: 101, name: 'Lê Thị Mai', subject: 'Kinh tế vĩ mô', gpa: 3.5, applyDate: '2025-07-20', phone: '0909123456', mssv: '2274802010111' },
  { id: 102, name: 'Trần Anh Tuấn', subject: 'Kiến trúc máy tính', gpa: 3.7, applyDate: '2025-07-19', phone: '0909654321', mssv: '2174802010222' },
  { id: 103, name: 'Phạm Huyền Trang', subject: 'Luật kinh doanh', gpa: 3.8, applyDate: '2025-07-21', phone: '0909789123', mssv: '2374802010333' }
];

// Dữ liệu gia sư
const tutors = [
  { id: 1, name: 'Nguyễn Văn A', status: 'available', subject: 'Lập trình hướng đối tượng', price: 150000, desc: 'Sinh viên năm 3 CNTT, GPA 3.8/4.0, kinh nghiệm 2 năm.', rating: 4.8, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true },
  { id: 2, name: 'Trần Thị B', status: 'busy', subject: 'Triết học Mác-Lênin', price: 120000, desc: 'Sinh viên năm 4 Khoa học xã hội, chuyên ngành Triết học.', rating: 4.6, students: 1, avatar: '👩‍🏫', meetingType: '1-1', onlineSupport: true },
  { id: 3, name: 'Lê Văn C', status: 'available', subject: 'Toán rời rạc', price: 200000, desc: 'Sinh viên năm 3 Toán-Tin, GPA 3.9/4.0, giải thưởng sinh viên xuất sắc.', rating: 4.9, students: 1, avatar: '👨‍🏫', meetingType: '1-1', onlineSupport: true },
  { id: 4, name: 'Phạm Thị D', status: 'available', subject: 'Lập trình web nâng cao', price: 130000, desc: 'Sinh viên năm 4 CNTT, chuyên về Frontend và Backend.', rating: 4.7, students: 1, avatar: '👩‍🏫', meetingType: '1-1', onlineSupport: true },
];

// LỊCH PHỎNG VẤN
const interviews = [
    { tutorId: 1, tutorName: 'Nguyễn Văn A', subject: 'Lập trình hướng đối tượng', interviewDate: '2025-07-01T10:00', status: 'Đã hoàn thành' },
    { tutorId: 2, tutorName: 'Trần Thị B', subject: 'Triết học Mác-Lênin', interviewDate: '2025-07-02T14:30', status: 'Đã lên lịch' }
];