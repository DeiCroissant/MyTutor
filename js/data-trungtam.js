// =================================================================
// DỮ LIỆU CHO TRUNG TÂM HỖ TRỢ VĂN LANG
// =================================================================

// Danh sách ứng viên gia sư chờ duyệt
let tutorApplications = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Lập trình hướng đối tượng",
    submitDate: "2024-01-15",
    status: "pending"
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "Toán rời rạc",
    submitDate: "2024-01-14",
    status: "pending"
  },
  {
    id: 3,
    name: "Lê Văn C",
    subject: "Cơ sở dữ liệu",
    submitDate: "2024-01-13",
    status: "pending"
  },
  {
    id: 4,
    name: "Phạm Thị D",
    subject: "Triết học Mác-Lênin",
    submitDate: "2024-01-12",
    status: "pending"
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    subject: "Kinh tế vi mô",
    submitDate: "2024-01-11",
    status: "pending"
  }
];

// Danh sách ứng viên chờ lên lịch phỏng vấn
let unscheduledTutors = [
  {
    id: 6,
    name: "Vũ Thị F",
    subject: "Lập trình web nâng cao",
    submitDate: "2024-01-10"
  },
  {
    id: 7,
    name: "Đặng Văn G",
    subject: "Kiến trúc máy tính",
    submitDate: "2024-01-09"
  }
];

// Lịch phỏng vấn đã tạo
let interviewSchedule = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    subject: "Lập trình hướng đối tượng",
    interviewTime: "2024-01-20 14:00",
    status: "scheduled"
  },
  {
    id: 2,
    name: "Trần Thị B",
    subject: "Toán rời rạc",
    interviewTime: "2024-01-21 15:00",
    status: "completed"
  }
];

// ========== DỮ LIỆU BÁO CÁO & THỐNG KÊ ==========

// Dữ liệu cho chart môn học theo trạng thái
const courseStatusData = {
  labels: ['Đang hoạt động', 'Tạm ngưng', 'Đã kết thúc', 'Chờ duyệt'],
  datasets: [{
    data: [15, 3, 8, 5],
    backgroundColor: [
      '#4CAF50', // Xanh lá
      '#FF9800', // Cam
      '#9C27B0', // Tím
      '#2196F3'  // Xanh dương
    ],
    borderWidth: 2,
    borderColor: '#fff'
  }]
};

// Dữ liệu phân bố gia sư theo khoa
const tutorDistributionData = {
  labels: ['Công nghệ thông tin', 'Quản trị Kinh doanh', 'Khoa học Xã hội', 'Kỹ thuật', 'Y tế'],
  datasets: [{
    label: 'Số lượng gia sư',
    data: [18, 12, 8, 6, 4],
    backgroundColor: 'rgba(102, 126, 234, 0.8)',
    borderColor: 'rgba(102, 126, 234, 1)',
    borderWidth: 2
  }]
};

// Dữ liệu đánh giá từ sinh viên
const studentFeedbackData = {
  labels: ['5 sao', '4 sao', '3 sao', '2 sao', '1 sao'],
  datasets: [{
    label: 'Số lượng đánh giá',
    data: [45, 32, 15, 8, 2],
    backgroundColor: [
      '#4CAF50',
      '#8BC34A',
      '#FFC107',
      '#FF9800',
      '#F44336'
    ],
    borderWidth: 1,
    borderColor: '#fff'
  }]
};

// Dữ liệu thống kê theo tháng
const monthlyStatsData = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  datasets: [{
    label: 'Sinh viên đăng ký',
    data: [12, 19, 25, 32, 28, 35, 42, 38, 45, 52, 48, 55],
    borderColor: 'rgba(102, 126, 234, 1)',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderWidth: 3,
    fill: true
  }, {
    label: 'Gia sư mới',
    data: [3, 5, 8, 12, 10, 15, 18, 14, 20, 22, 19, 25],
    borderColor: 'rgba(118, 75, 162, 1)',
    backgroundColor: 'rgba(118, 75, 162, 0.1)',
    borderWidth: 3,
    fill: true
  }]
};

// Dữ liệu môn học phổ biến nhất
const popularSubjectsData = {
  labels: ['Lập trình OOP', 'Toán rời rạc', 'Cơ sở dữ liệu', 'Lập trình Web', 'Triết học', 'Kinh tế vi mô', 'Kiến trúc máy tính', 'Mạng máy tính'],
  datasets: [{
    label: 'Số sinh viên đăng ký',
    data: [156, 134, 98, 87, 76, 65, 54, 43],
    backgroundColor: [
      '#4CAF50',
      '#2196F3', 
      '#FF9800',
      '#9C27B0',
      '#F44336',
      '#00BCD4',
      '#795548',
      '#607D8B'
    ],
    borderWidth: 2,
    borderColor: '#fff'
  }]
};

// Dữ liệu chi tiết môn học phổ biến
const popularSubjectsDetail = [
  { rank: 1, subject: 'Lập trình hướng đối tượng', students: 156, lessons: 892, avgRating: 4.7, tutors: 12, completionRate: 94 },
  { rank: 2, subject: 'Toán rời rạc', students: 134, lessons: 745, avgRating: 4.5, tutors: 8, completionRate: 91 },
  { rank: 3, subject: 'Cơ sở dữ liệu', students: 98, lessons: 523, avgRating: 4.6, tutors: 6, completionRate: 89 },
  { rank: 4, subject: 'Lập trình web nâng cao', students: 87, lessons: 456, avgRating: 4.8, tutors: 5, completionRate: 92 },
  { rank: 5, subject: 'Triết học Mác-Lênin', students: 76, lessons: 398, avgRating: 4.3, tutors: 4, completionRate: 87 },
  { rank: 6, subject: 'Kinh tế vi mô', students: 65, lessons: 342, avgRating: 4.4, tutors: 3, completionRate: 85 },
  { rank: 7, subject: 'Kiến trúc máy tính', students: 54, lessons: 289, avgRating: 4.2, tutors: 2, completionRate: 83 },
  { rank: 8, subject: 'Mạng máy tính', students: 43, lessons: 234, avgRating: 4.1, tutors: 2, completionRate: 80 }
];

// Báo cáo từ sinh viên
const studentFeedback = [
  {
    id: 1,
    author: "Nguyễn Thị Anh",
    date: "2024-01-15",
    content: "Gia sư rất nhiệt tình và giảng bài dễ hiểu. Em đã cải thiện rất nhiều trong môn Lập trình hướng đối tượng.",
    rating: 5
  },
  {
    id: 2,
    author: "Trần Văn Bình",
    date: "2024-01-14",
    content: "Buổi học rất hiệu quả, gia sư giải thích rõ ràng các khái niệm khó hiểu.",
    rating: 4
  },
  {
    id: 3,
    author: "Lê Thị Cẩm",
    date: "2024-01-13",
    content: "Gia sư có phương pháp dạy tốt, giúp em hiểu sâu hơn về môn Toán rời rạc.",
    rating: 5
  },
  {
    id: 4,
    author: "Phạm Văn Dũng",
    date: "2024-01-12",
    content: "Thời gian học linh hoạt, gia sư rất kiên nhẫn khi giảng bài.",
    rating: 4
  }
];

// Báo cáo từ gia sư
const tutorFeedback = [
  {
    id: 1,
    author: "Nguyễn Văn Giang",
    date: "2024-01-15",
    content: "Hệ thống rất tiện lợi, dễ dàng quản lý lịch dạy và học sinh. Cần thêm tính năng chat real-time.",
    rating: 4
  },
  {
    id: 2,
    author: "Trần Thị Hương",
    date: "2024-01-14",
    content: "Giao diện thân thiện, dễ sử dụng. Học sinh đều rất chăm chỉ và có tinh thần học tập tốt.",
    rating: 5
  },
  {
    id: 3,
    author: "Lê Văn Khoa",
    date: "2024-01-13",
    content: "Cần cải thiện hệ thống thanh toán và báo cáo chi tiết hơn về tiến độ học tập.",
    rating: 3
  }
];

// Môn học đang được dạy
const activeCourses = [
  {
    name: "Lập trình hướng đối tượng",
    department: "Công nghệ thông tin",
    tutorCount: 8,
    studentCount: 25,
    completionRate: 85
  },
  {
    name: "Toán rời rạc",
    department: "Công nghệ thông tin",
    tutorCount: 5,
    studentCount: 18,
    completionRate: 78
  },
  {
    name: "Cơ sở dữ liệu",
    department: "Công nghệ thông tin",
    tutorCount: 6,
    studentCount: 22,
    completionRate: 82
  },
  {
    name: "Triết học Mác-Lênin",
    department: "Khoa học Xã hội & Nhân văn",
    tutorCount: 3,
    studentCount: 12,
    completionRate: 75
  },
  {
    name: "Kinh tế vi mô",
    department: "Quản trị Kinh doanh",
    tutorCount: 4,
    studentCount: 15,
    completionRate: 80
  }
];

// Môn học đã kết thúc
const completedCourses = [
  {
    name: "Lập trình C++",
    department: "Công nghệ thông tin",
    tutorCount: 3,
    studentCount: 12,
    completionRate: 92,
    endDate: "2023-12-15"
  },
  {
    name: "Đại số tuyến tính",
    department: "Công nghệ thông tin",
    tutorCount: 2,
    studentCount: 8,
    completionRate: 88,
    endDate: "2023-12-10"
  },
  {
    name: "Vật lý đại cương",
    department: "Kỹ thuật",
    tutorCount: 2,
    studentCount: 10,
    completionRate: 85,
    endDate: "2023-12-08"
  },
  {
    name: "Tiếng Anh chuyên ngành",
    department: "Ngoại ngữ",
    tutorCount: 4,
    studentCount: 16,
    completionRate: 90,
    endDate: "2023-12-12"
  }
];
