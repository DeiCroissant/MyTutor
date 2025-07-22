// Quản lý môn học cho System Administrator

function renderCourseTable() {
  const tbody = document.getElementById('courseTableBody');
  tbody.innerHTML = courses.map(course => `
    <tr>
      <td>${course.id}</td>
      <td>${course.name}</td>
      <td>${course.code}</td>
      <td>${course.description}</td>
      <td class="admin-actions">
        <button onclick="editCourse(${course.id})">Sửa</button>
        <button onclick="deleteCourse(${course.id})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function resetForm() {
  document.getElementById('courseForm').reset();
  document.getElementById('formTitle').textContent = 'Thêm môn học mới';
  document.getElementById('submitBtn').textContent = 'Thêm môn học';
  document.getElementById('cancelEditBtn').style.display = 'none';
  document.getElementById('courseForm').dataset.editing = '';
}

function addOrUpdateCourse(e) {
  e.preventDefault();
  const name = document.getElementById('courseName').value.trim();
  const code = document.getElementById('courseCode').value.trim();
  const desc = document.getElementById('courseDesc').value.trim();
  const editingId = document.getElementById('courseForm').dataset.editing;
  if (!name || !code) return alert('Vui lòng nhập đầy đủ tên và mã môn học!');
  if (editingId) {
    // Update
    const idx = courses.findIndex(c => c.id == editingId);
    if (idx !== -1) {
      courses[idx].name = name;
      courses[idx].code = code;
      courses[idx].description = desc;
    }
  } else {
    // Add
    const newId = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    courses.push({ id: newId, name, code, description: desc });
  }
  renderCourseTable();
  resetForm();
}

function editCourse(id) {
  const course = courses.find(c => c.id === id);
  if (!course) return;
  document.getElementById('courseName').value = course.name;
  document.getElementById('courseCode').value = course.code;
  document.getElementById('courseDesc').value = course.description;
  document.getElementById('formTitle').textContent = 'Chỉnh sửa môn học';
  document.getElementById('submitBtn').textContent = 'Cập nhật';
  document.getElementById('cancelEditBtn').style.display = '';
  document.getElementById('courseForm').dataset.editing = id;
}

function deleteCourse(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa môn học này?')) return;
  courses = courses.filter(c => c.id !== id);
  renderCourseTable();
  resetForm();
}

document.getElementById('courseForm').onsubmit = addOrUpdateCourse;
document.getElementById('cancelEditBtn').onclick = resetForm;

// Khởi tạo
renderCourseTable();
resetForm();

// Đảm bảo các hàm editCourse, deleteCourse có thể gọi từ HTML
toastr = window.toastr || {};
window.editCourse = editCourse;
window.deleteCourse = deleteCourse; 