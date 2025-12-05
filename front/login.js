// URL del backend
const API_URL = 'https://projectdasw-production.up.railway.app/api';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initPasswordStrength();
  loadRememberedUser();
});

// Switch between forms
function switchToSignup() {
  document.getElementById('loginForm').classList.remove('active');
  document.getElementById('signupForm').classList.add('active');
  document.getElementById('forgotForm').classList.remove('active');
}

function switchToLogin() {
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('signupForm').classList.remove('active');
  document.getElementById('forgotForm').classList.remove('active');
}

function showForgotPassword() {
  document.getElementById('loginForm').classList.remove('active');
  document.getElementById('signupForm').classList.remove('active');
  document.getElementById('forgotForm').classList.add('active');
}

// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.parentElement.querySelector('.toggle-password img');

  if (input.type === 'password') {
    input.type = 'text';
    button.src = 'https://img.icons8.com/m_outlined/512/000000/invisible.png';
  } else {
    input.type = 'password';
    button.src = 'https://img.icons8.com/m_outlined/512/000000/visible.png';
  }
}

// Password strength indicator
function initPasswordStrength() {
  const passwordInput = document.getElementById('signupPassword');
  const strengthBar = document.getElementById('passwordStrength');

  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;

      if (password.length === 0) {
        strengthBar.classList.remove('active', 'weak', 'medium', 'strong');
        return;
      }

      strengthBar.classList.add('active');

      let strength = 0;

      if (password.length >= 8) strength++;
      if (password.length >= 12) strength++;
      if (/\d/.test(password)) strength++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      if (/[^a-zA-Z0-9]/.test(password)) strength++;

      strengthBar.classList.remove('weak', 'medium', 'strong');

      if (strength <= 2) {
        strengthBar.classList.add('weak');
      } else if (strength <= 4) {
        strengthBar.classList.add('medium');
      } else {
        strengthBar.classList.add('strong');
      }
    });
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  if (!email || !password) {
    showToast('error', 'Error', 'Por favor completa todos los campos');
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    if (data.success) {
      // Guardar token y datos del usuario
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.data));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      showToast('success', '¡Bienvenido!', 'Inicio de sesion exitoso');

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1000);
    } else {
      showToast('error', 'Error', data.error || 'Error al iniciar sesion');
    }

  } catch (error) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    console.error('Error:', error);
    showToast('error', 'Error', 'Error de conexion con el servidor');
  }
}

// Handle Signup
async function handleSignup(event) {
  event.preventDefault();

  const nombre = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const carrera = document.getElementById('signupCareer').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if (!nombre || !email || !carrera || !password || !confirmPassword) {
    showToast('error', 'Error', 'Por favor completa todos los campos');
    return;
  }

  if (password !== confirmPassword) {
    showToast('error', 'Error', 'Las contraseñas no coinciden');
    return;
  }

  if (password.length < 8) {
    showToast('error', 'Error', 'La contraseña debe tener al menos 8 caracteres');
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, email, password, carrera })
    });

    const data = await response.json();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    if (data.success) {
      // Guardar token y datos del usuario
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.data));

      showToast('success', '¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente');

      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1000);
    } else {
      showToast('error', 'Error', data.error || 'Error al crear cuenta');
    }

  } catch (error) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    console.error('Error:', error);
    showToast('error', 'Error', 'Error de conexion con el servidor');
  }
}

// Handle Forgot Password
async function handleForgotPassword(event) {
  event.preventDefault();

  const email = document.getElementById('forgotEmail').value;

  if (!email) {
    showToast('error', 'Error', 'Por favor ingresa tu correo electronico');
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    if (data.success) {
      showToast('success', 'Correo enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña');

      setTimeout(() => {
        switchToLogin();
        document.getElementById('forgotEmail').value = '';
      }, 2000);
    } else {
      showToast('error', 'Error', data.error || 'Error al enviar correo');
    }

  } catch (error) {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    console.error('Error:', error);
    showToast('error', 'Error', 'Error de conexion con el servidor');
  }
}

// Social Login Functions (por ahora solo muestra mensaje)
function loginWithGoogle() {
  showToast('info', 'Info', 'Login con Google no disponible aun');
}

function loginWithMicrosoft() {
  showToast('info', 'Info', 'Login con Microsoft no disponible aun');
}

function signupWithGoogle() {
  loginWithGoogle();
}

function signupWithMicrosoft() {
  loginWithMicrosoft();
}

// Load remembered user
function loadRememberedUser() {
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    document.getElementById('loginEmail').value = rememberedEmail;
    document.getElementById('rememberMe').checked = true;
  }
}

// Toast notification
function showToast(type, title, message) {
  const toastContainer = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = '✓';
  if (type === 'error') icon = '✕';
  if (type === 'info') icon = 'ℹ';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Check if user is already logged in
window.addEventListener('load', function() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'home.html';
  }
});
