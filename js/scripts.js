document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const role = document.getElementById('role').value;
      if (role === 'Sinh Viên') {
        window.location.href = 'dashboard.html';
      } else if (role === 'Gia Sư') {
        window.location.href = 'tutor-dashboard.html';
      } else {
        alert('Chức năng đang phát triển!');
      }
    };
  }
}); 