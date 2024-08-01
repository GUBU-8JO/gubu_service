// script.js
import axios from 'axios';

// document.getElementById('signupBtn').addEventListener('click', function () {
//   alert('Sign Up 기능이 구현되어야 합니다!');
//   // 실제 Sign Up 로직 추가
// });

// document.getElementById('signinBtn').addEventListener('click', function () {
//   alert('Sign In 기능이 구현되어야 합니다!');
//   // 실제 Sign In 로직 추가
// });
function signin() {
  axios
    .post(`http://localhost:3000/api/auth/sign-in`, {
      email: email,
      password: password,
    })
    .then(function (error) {
      console.log(error);
    })
    .finally(function () {});
}
document.getElementById('showAlert').onclick = function () {
  document.getElementById('popup').style.display = 'block';
};

document.getElementById('closePopup').onclick = function () {
  document.getElementById('popup').style.display = 'none';
};

window.onclick = function (event) {
  if (event.target === document.getElementById('popup')) {
    document.getElementById('popup').style.display = 'none';
  }
};
