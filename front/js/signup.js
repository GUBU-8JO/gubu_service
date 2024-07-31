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
