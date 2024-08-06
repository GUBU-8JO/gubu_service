<<<<<<< HEAD
// script.js
import axios from 'axios';
/////////////////
document.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.getElementById('signupBtn');
  signupBtn.addEventListener('click', async () => {
    const email = document.getElementById('emailTextBox').value;
    const nickname = document.getElementById('nicknameTextBox').value;
    const password = document.getElementById('passwordTextBox').value;
    const rePassword = document.getElementById('repasswordTextBox').value;

    if (!email || !nickname || !password || !rePassword) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    if (password !== rePassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5500/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nickname, password, rePassword }),
      });

      if (!response.ok) {
        throw new Error('회원가입 실패');
      }
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      window.location.href = 'http://127.0.0.1:5500/front/html/signin.html'; // 회원가입 후 로그인 페이지로 리디렉션
    } catch (error) {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error('Error:', error);
    }
  });
});

//////////////////////////
// document
//   .getElementById('signupBtn')
//   .addEventListener('click', function (event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value;
//     const nickname = document.getElementById('nickname').value;
//     const password = document.getElementById('password').value;
//     const rePassword = document.getElementById('repassword').value;
//     signup(email, nickname, password, rePassword);
//     // 실제 Sign Up 로직 추가
//   });

// document.getElementById('signinBtn').addEventListener('click', function () {
//   alert('Sign In 기능이 구현되어야 합니다!');
//   // 실제 Sign In 로직 추가
// });

function signup(email, nickname, password, rePassword) {
  axios
    .post(`http://localhost:5500/api/auth/sign-up`, {
      email: email,
      nickname: nickname,
      password: password,
      rePassword: rePassword,
    })
    //비동기 통신 성공했을 경우 처리
    .then(function (response) {
      console.log('success', response.data);
    })
    //통신 오류 발생시 처리
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {});
}

// const email = {
// nickname,
// password,
// repassword,
// }
=======
document.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.getElementById('signupBtn');

  signupBtn.addEventListener('click', async () => {
    const email = document.getElementById('emailTextBox').value;
    const nickname = document.getElementById('nicknameTextBox').value;
    const password = document.getElementById('passwordTextBox').value;
    const rePassword = document.getElementById('repasswordTextBox').value;

    if (!email || !nickname || !password || !rePassword) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    if (password !== rePassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, nickname, password, rePassword }),
      });

      if (!response.ok) {
        throw new Error('회원가입 실패');
      }

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      window.location.href = 'http://127.0.0.1:5500/front/html/signin.html'; // 회원가입 후 로그인 페이지로 리디렉션
    } catch (error) {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error('Error:', error);
    }
  });
});
>>>>>>> dev
