// script.js

// document.getElementById('signinBtn').addEventListener('click', function () {
//   alert('Sign In 기능이 구현되어야 합니다!');
//   // 실제 Sign In 로직 추가
// });

document.addEventListener('DOMContentLoaded', () => {
  const signupbtn = document.getElementById('signupbtn');
  const signinbtn = document.getElementById('signinbtn');

  if (signupbtn) {
    signupbtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/front/html/signup.html';
    });
  }

  if (signinbtn) {
    signinbtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/front/html/signin.html';
    });
  }
});
