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
      
      // Length
      if (password.length >= 8) strength++;
      if (password.length >= 12) strength++;
      
      // Contains numbers
      if (/\d/.test(password)) strength++;
      
      // Contains lowercase and uppercase
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      
      // Contains special characters
      if (/[^a-zA-Z0-9]/.test(password)) strength++;
      
      // Update strength indicator
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
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Basic validation
  if (!email || !password) {
    showToast('error', 'Error', 'Por favor completa todos los campos');
    return;
  }
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    // Save user if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    // Save user session
    const userData = {
      email: email,
      name: email.split('@')[0],
      loggedIn: true,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showToast('success', '¡Bienvenido!', 'Inicio de sesión exitoso');
    
    // Redirect to home
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  }, 1500);
}

// Handle Signup
function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const career = document.getElementById('signupCareer').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  // Validation
  if (!name || !email || !career || !password || !confirmPassword) {
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
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    // Save user data
    const userData = {
      name: name,
      email: email,
      career: career,
      loggedIn: true,
      signupTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showToast('success', '¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente');
    
    // Redirect to home
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  }, 1500);
}

// Handle Forgot Password
function handleForgotPassword(event) {
  event.preventDefault();
  
  const email = document.getElementById('forgotEmail').value;
  
  if (!email) {
    showToast('error', 'Error', 'Por favor ingresa tu correo electrónico');
    return;
  }
  
  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    
    showToast('success', 'Correo enviado', 'Revisa tu bandeja de entrada para restablecer tu contraseña');
    
    // Switch back to login after 2 seconds
    setTimeout(() => {
      switchToLogin();
      document.getElementById('forgotEmail').value = '';
    }, 2000);
  }, 1500);
}

// Social Login Functions
function loginWithGoogle() {
  showToast('info', 'Autenticando', 'Conectando con Google...');
  
  // Simulate OAuth
  setTimeout(() => {
    const userData = {
      email: 'usuario@gmail.com',
      name: 'Usuario de Google',
      loggedIn: true,
      provider: 'google',
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    showToast('success', '¡Conectado!', 'Inicio de sesión con Google exitoso');
    
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  }, 1500);
}

function loginWithMicrosoft() {
  showToast('info', 'Autenticando', 'Conectando con Microsoft...');
  
  // Simulate OAuth
  setTimeout(() => {
    const userData = {
      email: 'usuario@outlook.com',
      name: 'Usuario de Microsoft',
      loggedIn: true,
      provider: 'microsoft',
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    showToast('success', '¡Conectado!', 'Inicio de sesión con Microsoft exitoso');
    
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1000);
  }, 1500);
}

function signupWithGoogle() {
  loginWithGoogle(); // Same process for simplicity
}

function signupWithMicrosoft() {
  loginWithMicrosoft(); // Same process for simplicity
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
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Check if user is already logged in
window.addEventListener('load', function() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const user = JSON.parse(currentUser);
    if (user.loggedIn) {
      // Optional: redirect to home if already logged in
      // window.location.href = 'home.html';
    }
  }
});