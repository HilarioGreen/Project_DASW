// ===========================
/*
For back-end:
-Receive messages
-Save them in a database
-Return responses or updated chat info

*/
// ===========================
const conversations = {
  1: {
    id: 1,
    name: 'María González',
    avatar: 'MG',
    status: 'En línea',
    messages: [
      { id: 1, text: 'Hola! Vi tu proyecto de salud mental', sent: false, time: '10:30 AM' },
      { id: 2, text: 'Me parece muy interesante', sent: false, time: '10:31 AM' },
      { id: 3, text: 'Hola María! Gracias por tu interés', sent: true, time: '10:35 AM' },
      { id: 4, text: '¿Cuándo podemos reunirnos para discutir detalles?', sent: false, time: '10:36 AM' }
    ],
    quickReplies: ['Perfecto, el miércoles', '¿A qué hora?', 'Prefiero otro día']
  },
  2: {
    id: 2,
    name: 'Carlos Ruiz',
    avatar: 'CR',
    status: 'Activo hace 30 min',
    messages: [
      { id: 1, text: 'Me interesa tu proyecto de agricultura urbana', sent: false, time: '9:15 AM' },
      { id: 2, text: '¿Puedo unirme al equipo?', sent: false, time: '9:16 AM' },
      { id: 3, text: 'Claro! Bienvenido', sent: true, time: '9:20 AM' }
    ],
    quickReplies: ['¿Qué experiencia tienes?', 'Te envío más info', 'Cuéntame más']
  },
  3: {
    id: 3,
    name: 'Ana López',
    avatar: 'AL',
    status: 'En línea',
    messages: [
      { id: 1, text: 'Gracias por aplicar a mi proyecto!', sent: false, time: '8:00 AM' },
      { id: 2, text: 'Tu perfil me parece muy adecuado', sent: false, time: '8:01 AM' },
      { id: 3, text: 'Muchas gracias!', sent: true, time: '8:05 AM' }
    ],
    quickReplies: ['¿Cuándo empezamos?', 'Gracias', '¿Cuál es el siguiente paso?']
  },
  4: {
    id: 4,
    name: 'Roberto Díaz',
    avatar: 'RD',
    status: 'Desconectado',
    messages: [
      { id: 1, text: 'Recuerda que el deadline es el viernes', sent: false, time: 'Ayer' },
      { id: 2, text: 'Ok, lo tendré listo', sent: true, time: 'Ayer' }
    ],
    quickReplies: ['Entendido', '¿Necesitas ayuda?', 'Vamos bien']
  },
  5: {
    id: 5,
    name: 'Juan Pérez',
    avatar: 'JP',
    status: 'Desconectado',
    messages: [
      { id: 1, text: 'Nos vemos mañana en la reunión', sent: false, time: 'Hace 2 días' },
      { id: 2, text: 'Perfecto, nos vemos mañana', sent: true, time: 'Hace 2 días' }
    ],
    quickReplies: ['👍', 'Confirmado', 'Ahí estaré']
  },
  6: {
    id: 6,
    name: 'Laura Martínez',
    avatar: 'LM',
    status: 'Desconectado',
    messages: [
      { id: 1, text: 'Te envié los archivos del diseño', sent: false, time: 'Hace 3 días' },
      { id: 2, text: 'Los revisaré pronto', sent: true, time: 'Hace 3 días' }
    ],
    quickReplies: ['Gracias', 'Perfecto', 'Los reviso']
  }
};

let currentChatId = 1;

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
  loadChat(1);
  initializeInputListeners();
});

// ===========================
// CHAT LOADING FUNCTIONS
// ===========================
function loadChat(chatId) {
  currentChatId = chatId;
  const chat = conversations[chatId];
  
  if (!chat) {
    console.error('Chat not found:', chatId);
    return;
  }
  
  // Update header
  document.getElementById('chatName').textContent = chat.name;
  document.getElementById('chatAvatar').textContent = chat.avatar;
  document.getElementById('chatStatus').textContent = chat.status;
  
  // Mark conversation as active
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeConversation = document.querySelector(`[data-chat-id="${chatId}"]`);
  if (activeConversation) {
    activeConversation.classList.add('active');
  }
  
  // Load messages
  renderMessages(chat);
  
  // In mobile, hide conversations sidebar
  if (window.innerWidth <= 768) {
    document.getElementById('conversationsSidebar').classList.add('hidden');
  }
}

function renderMessages(chat) {
  const container = document.getElementById('messagesContainer');
  container.innerHTML = '';
  
  // Render all messages
  chat.messages.forEach(message => {
    const messageEl = createMessageElement(message, chat.avatar);
    container.appendChild(messageEl);
  });
  
  // Add quick replies if exists
  if (chat.quickReplies && chat.quickReplies.length > 0) {
    const quickRepliesEl = createQuickRepliesElement(chat.quickReplies);
    container.appendChild(quickRepliesEl);
  }
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function createMessageElement(message, chatAvatar) {
  const div = document.createElement('div');
  div.className = `message ${message.sent ? 'sent' : ''}`;
  
  const avatar = message.sent ? 'Tú' : chatAvatar;
  
  div.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div>
      <div class="message-content">${message.text}</div>
      <div class="message-time">${message.time}</div>
    </div>
  `;
  
  return div;
}

function createQuickRepliesElement(replies) {
  const div = document.createElement('div');
  div.className = 'quick-replies';
  
  replies.forEach(reply => {
    const button = document.createElement('button');
    button.className = 'quick-reply';
    button.textContent = reply;
    button.onclick = () => sendQuickReply(reply);
    div.appendChild(button);
  });
  
  return div;
}

// ===========================
// MESSAGE SENDING FUNCTIONS
// ===========================
function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();
  
  if (message) {
    const chat = conversations[currentChatId];
    
    // Create new message
    const newMessage = {
      id: chat.messages.length + 1,
      text: message,
      sent: true,
      time: 'Ahora'
    };
    
    // Add to conversation
    //create message in front-end which will be replaced when doing back-end
    chat.messages.push(newMessage);
    
    // Remove quick replies
    const quickRepliesEl = document.querySelector('.quick-replies');
    if (quickRepliesEl) {
      quickRepliesEl.remove();
    }
    
    // Add message to UI
    const container = document.getElementById('messagesContainer');
    const messageEl = createMessageElement(newMessage, chat.avatar);
    container.appendChild(messageEl);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    // Clear input
    input.value = '';
    
    // Simulate response (opcional)
    // setTimeout(() => {
    //   simulateResponse(chat);
    // }, 2000);

  }
}

function sendQuickReply(text) {
  const input = document.getElementById('messageInput');
  input.value = text;
  sendMessage();
}

function simulateResponse(chat) {
  const responses = [
    'Entendido!',
    'Perfecto, gracias',
    'Suena bien',
    'De acuerdo',
    'Gracias por responder'
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  const newMessage = {
    id: chat.messages.length + 1,
    text: randomResponse,
    sent: false,
    time: 'Ahora'
  };
  
  chat.messages.push(newMessage);
  
  const container = document.getElementById('messagesContainer');
  const messageEl = createMessageElement(newMessage, chat.avatar);
  container.appendChild(messageEl);
  
  container.scrollTop = container.scrollHeight;
}

function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// 
// INPUT LISTENERS
// 
function initializeInputListeners() {
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  
  input.addEventListener('input', function() {
    sendBtn.disabled = this.value.trim() === '';
  });
  
  // Initialize as disabled
  sendBtn.disabled = true;
}

//
// UI INTERACTION FUNCTIONS
//
function startNewChat() {
  openModal('newChatModal');
}

function attachFile() {
  openModal('attachFileModal');
  // Reset modal state
  document.getElementById('fileUploadArea').style.display = 'none';
  document.getElementById('linkInputArea').style.display = 'none';
  document.querySelectorAll('.file-option').forEach(opt => {
    opt.style.display = 'flex';
  });
}

function showChatInfo() {
  const chat = conversations[currentChatId];
  document.getElementById('infoAvatar').textContent = chat.avatar;
  document.getElementById('infoName').textContent = chat.name;
  document.getElementById('infoStatus').textContent = chat.status;
  openModal('chatInfoModal');
}

//
// MODAL FUNCTIONS
// 
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
  }
});

// 
// NEW CHAT FUNCTIONS
// 
function searchUsers() {
  const searchTerm = document.getElementById('searchUserInput').value.toLowerCase();
  const userItems = document.querySelectorAll('.user-item');
  
  userItems.forEach(item => {
    const userName = item.querySelector('h6').textContent.toLowerCase();
    const userRole = item.querySelector('small').textContent.toLowerCase();
    
    if (userName.includes(searchTerm) || userRole.includes(searchTerm)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function startChatWith(name, avatar) {
  closeModal('newChatModal');
  
  // Create new conversation
  const newId = Object.keys(conversations).length + 1;
  conversations[newId] = {
    id: newId,
    name: name,
    avatar: avatar,
    status: 'En línea',
    messages: [
      { id: 1, text: `Hola! Iniciaste una conversación con ${name}`, sent: false, time: 'Ahora' }
    ],
    quickReplies: ['Hola!', '¿Cómo estás?', 'Hablemos del proyecto']
  };
  
  // Add to conversation list
  const conversationsList = document.getElementById('conversationsList');
  const newConvHTML = `
    <div class="conversation-item" onclick="loadChat(${newId})" data-chat-id="${newId}">
      <div class="avatar">${avatar}</div>
      <div class="conversation-info">
        <h6>${name}</h6>
        <small>Nueva conversación</small>
      </div>
      <div class="conversation-time">Ahora</div>
    </div>
  `;
  conversationsList.insertAdjacentHTML('afterbegin', newConvHTML);
  
  // Load new chat
  loadChat(newId);
}

// 
// ATTACH FILE FUNCTIONS
// 
function selectFileType(type) {
  // Hide file options
  document.querySelectorAll('.file-option').forEach(opt => {
    opt.style.display = 'none';
  });
  
  if (type === 'link') {
    document.getElementById('linkInputArea').style.display = 'flex';
    document.getElementById('fileUploadArea').style.display = 'none';
  } else {
    document.getElementById('fileUploadArea').style.display = 'block';
    document.getElementById('linkInputArea').style.display = 'none';
    
    // Set file input accept attribute based on type
    const fileInput = document.getElementById('fileInput');
    switch(type) {
      case 'image':
        fileInput.accept = 'image/*';
        break;
      case 'document':
        fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx';
        break;
      case 'video':
        fileInput.accept = 'video/*';
        break;
      default:
        fileInput.accept = '*';
    }
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const chat = conversations[currentChatId];
    
    // Create file message
    const newMessage = {
      id: chat.messages.length + 1,
      text: `<img src="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/1024px/1f4ce.png" width="20"> Archivo adjunto: ${file.name}`,
      sent: true,
      time: 'Ahora'
    };
    
    chat.messages.push(newMessage);
    
    // Add to UI
    const container = document.getElementById('messagesContainer');
    const quickRepliesEl = document.querySelector('.quick-replies');
    if (quickRepliesEl) quickRepliesEl.remove();
    
    const messageEl = createMessageElement(newMessage, chat.avatar);
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
    
    closeModal('attachFileModal');
    
    // Reset file input
    event.target.value = '';
    
    // Show confirmation
    showToast('Archivo enviado correctamente');
  }
}

function sendLink() {
  const linkInput = document.getElementById('linkInput');
  const link = linkInput.value.trim();
  
  if (link) {
    const chat = conversations[currentChatId];
    
    // Create link message
    const newMessage = {
      id: chat.messages.length + 1,
      text: `<img src="https://cdn-icons-png.flaticon.com/512/282/282100.png" width="10"> ${link}`,
      sent: true,
      time: 'Ahora'
    };
    
    chat.messages.push(newMessage);
    
    // Add to UI
    const container = document.getElementById('messagesContainer');
    const quickRepliesEl = document.querySelector('.quick-replies');
    if (quickRepliesEl) quickRepliesEl.remove();
    
    const messageEl = createMessageElement(newMessage, chat.avatar);
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
    
    closeModal('attachFileModal');
    
    // Reset input
    linkInput.value = '';
    
    showToast('Enlace enviado correctamente');
  }
}

// 
// CHAT INFO FUNCTIONS



//////////////////////////////////////////////////////////////////////////////
// 
function viewProfile() {
  const chat = conversations[currentChatId];
  closeModal('chatInfoModal');
  alert(`Ver perfil de ${chat.name}\n\nAquí se mostraría el perfil completo del usuario con:\n- Foto de perfil\n- Biografía\n- Proyectos\n- Habilidades\n- Información de contacto`);
}

function viewSharedFiles() {
  closeModal('chatInfoModal');
  alert('Archivos compartidos\n\nAquí se mostrarían todos los archivos que han compartido en esta conversación:\n- Imágenes\n- Documentos\n- Videos\n- Enlaces');
}

function muteConversation() {
  const chat = conversations[currentChatId];
  closeModal('chatInfoModal');
  showToast(`Conversación con ${chat.name} silenciada`);
}

function blockUser() {
  const chat = conversations[currentChatId];
  if (confirm(`¿Estás seguro de que quieres bloquear a ${chat.name}?`)) {
    closeModal('chatInfoModal');
    showToast(`Usuario ${chat.name} bloqueado`);
  }
}

function deleteConversation() {
  const chat = conversations[currentChatId];
  if (confirm(`¿Eliminar conversación con ${chat.name}?\n\nEsta acción no se puede deshacer.`)) {
    // Remove from conversations
    delete conversations[currentChatId];
    
    // Remove from UI
    const conversationItem = document.querySelector(`[data-chat-id="${currentChatId}"]`);
    if (conversationItem) {
      conversationItem.remove();
    }
    
    closeModal('chatInfoModal');
    
    // Load another chat or show empty state
    const remainingChats = Object.keys(conversations);
    if (remainingChats.length > 0) {
      loadChat(parseInt(remainingChats[0]));
    } else {
      showEmptyState();
    }
    
    showToast('Conversación eliminada');
  }
}

function showEmptyState() {
  const container = document.getElementById('messagesContainer');
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon"><img src="https://png.pngtree.com/png-vector/20220719/ourmid/pngtree-outline-icon---chat-bubbles-button-graphic-outline-vector-png-image_37950228.png" width="20"></div>
      <div class="empty-title">No hay conversaciones</div>
      <div class="empty-description">Selecciona una conversación o inicia una nueva</div>
    </div>
  `;
}

// 
// TOAST NOTIFICATIONS
// 
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #2a2a2a;
    color: #e0e0e0;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===========================
// RESPONSIVE FUNCTIONS
// ===========================
function toggleNavSidebar() {
  document.getElementById('navSidebar').classList.toggle('open');
}

function toggleConversationsSidebar() {
  document.getElementById('conversationsSidebar').classList.toggle('hidden');
}

// Close nav sidebar when clicking outside (mobile)
document.addEventListener('click', function(event) {
  const navSidebar = document.getElementById('navSidebar');
  
  if (window.innerWidth <= 1024 &&
      navSidebar.classList.contains('open') &&
      !navSidebar.contains(event.target)) {
    navSidebar.classList.remove('open');
  }
});