// ===========================
// GLOBAL VARIABLES
// ===========================
let projects = [
  {
    id: 1,
    title: "App de Salud Mental",
    description: "Aplicación móvil que conecta estudiantes con recursos de apoyo psicológico y bienestar emocional.",
    icon: "🏥",
    status: "activo",
    progress: 65,
    tags: ["React Native", "UI/UX", "Psicología"],
    members: [
      { name: "María González", role: "Psicología", avatar: "M" },
      { name: "Juan Pérez", role: "Desarrollador", avatar: "J" },
      { name: "Ana López", role: "Diseñadora", avatar: "A" }
    ],
    createdDate: "2025-01-05"
  },
  {
    id: 2,
    title: "Agricultura Urbana Sostenible",
    description: "Startup enfocada en desarrollar soluciones innovadoras para el cultivo urbano sostenible.",
    icon: "🌱",
    status: "activo",
    progress: 40,
    tags: ["Startup", "Sostenibilidad", "Marketing"],
    members: [
      { name: "Carlos Ruiz", role: "Agronomía", avatar: "C" },
      { name: "Laura Martínez", role: "Marketing", avatar: "L" }
    ],
    createdDate: "2025-01-10"
  },
  {
    id: 3,
    title: "Sistema IoT Hogares Inteligentes",
    description: "Desarrollo de automatización del hogar con enfoque en eficiencia energética y sostenibilidad.",
    icon: "💡",
    status: "activo",
    progress: 78,
    tags: ["IoT", "Arduino", "Python"],
    members: [
      { name: "Roberto Díaz", role: "Ing. Mecatrónica", avatar: "R" },
      { name: "Sofia Chen", role: "Programadora", avatar: "S" }
    ],
    createdDate: "2024-12-20"
  },
  {
    id: 4,
    title: "Plataforma Arte Digital",
    description: "Plataforma web colaborativa donde artistas pueden trabajar juntos en tiempo real.",
    icon: "🎨",
    status: "activo",
    progress: 52,
    tags: ["Web Dev", "Arte Digital", "WebSocket"],
    members: [
      { name: "Ana López", role: "Bellas Artes", avatar: "A" },
      { name: "Miguel Torres", role: "Full Stack", avatar: "M" }
    ],
    createdDate: "2025-01-08"
  },
  {
    id: 5,
    title: "App Gestión de Tareas",
    description: "Aplicación móvil para gestión de tareas con metodología ágil y colaboración en equipo.",
    icon: "📱",
    status: "activo",
    progress: 30,
    tags: ["Flutter", "Firebase", "Agile"],
    members: [
      { name: "Pedro Sánchez", role: "Mobile Dev", avatar: "P" }
    ],
    createdDate: "2025-01-15"
  }
];

let currentProjectId = null;

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
  renderProjects();
  updateStats();
  initializeSidebar();
});

// ===========================
// SIDEBAR FUNCTIONS
// ===========================
function initializeSidebar() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleSidebar);
  }

  // Close sidebar when clicking outside (mobile)
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768 &&
        !sidebar.contains(event.target) &&
        !menuBtn.contains(event.target) &&
        sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

// ===========================
// TAB FUNCTIONS
// ===========================
function switchTab(tabName, event) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.style.display = 'none';
  });

  // Show selected tab content
  document.getElementById(`tab-${tabName}`).style.display = 'block';

  // Add active class to clicked tab
  event.target.classList.add('active');
}

// ===========================
// RENDER FUNCTIONS
// ===========================
function renderProjects() {
  const statusGroups = {
    activo: [],
    pausado: [],
    completado: [],
    archivado: []
  };

  // Group projects by status
  projects.forEach(project => {
    statusGroups[project.status].push(project);
  });

  // Render each group
  Object.keys(statusGroups).forEach(status => {
    const grid = document.getElementById(`grid-${status}s`);
    const count = document.getElementById(`count-${status}s`);
    
    if (grid) {
      grid.innerHTML = '';
      
      if (statusGroups[status].length === 0 && status !== 'archivado') {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>No hay proyectos ${status}s</h3>
            <p>Tus proyectos ${status}s aparecerán aquí</p>
          </div>
        `;
      } else {
        statusGroups[status].forEach(project => {
          grid.appendChild(createProjectCard(project));
        });
      }
    }
    
    if (count) {
      count.textContent = `(${statusGroups[status].length})`;
    }
  });
}

function createProjectCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';
  
  const statusClass = `status-${project.status}`;
  const statusText = project.status.charAt(0).toUpperCase() + project.status.slice(1);
  
  const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  
  let actionsHTML = '';
  if (project.status === 'activo') {
    actionsHTML = `
      <div class="project-actions">
        <button class="action-btn" onclick="viewProjectDetails(${project.id})">Ver detalles</button>
        <button class="action-btn" onclick="goToChat(${project.id})">Chat</button>
        <button class="action-btn" onclick="editProject(${project.id})">Editar</button>
      </div>
    `;
  } else if (project.status === 'pausado') {
    actionsHTML = `
      <div class="project-actions">
        <button class="action-btn" onclick="reactivateProject(${project.id})">Reactivar</button>
        <button class="action-btn" onclick="viewProjectDetails(${project.id})">Ver detalles</button>
        <button class="action-btn" onclick="archiveProject(${project.id})">Archivar</button>
      </div>
    `;
  } else if (project.status === 'completado') {
    actionsHTML = `
      <div class="project-actions">
        <button class="action-btn" onclick="viewProjectDetails(${project.id})">Ver proyecto</button>
        <button class="action-btn" onclick="downloadProject(${project.id})">Descargar</button>
        <button class="action-btn" onclick="shareProject(${project.id})">Compartir</button>
      </div>
    `;
  }

  const progressHTML = project.status !== 'completado' ? `
    <div class="project-progress">
      Progreso: ${project.progress}%
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
      </div>
    </div>
  ` : `
    <div class="project-progress">
      Completado el ${formatDate(project.createdDate)}
    </div>
  `;

  article.innerHTML = `
    <div class="project-header">
      <div class="project-title">${project.title}</div>
      <span class="project-status ${statusClass}">${statusText}</span>
    </div>
    <div>
      <div class="project-description">${project.description}</div>
    </div>
    <div class="project-tags">
      ${tagsHTML}
    </div>
    ${progressHTML}
    ${actionsHTML}
  `;

  return article;
}

// ===========================
// STATISTICS FUNCTIONS
// ===========================
function updateStats() {
  const stats = {
    activo: 0,
    completado: 0,
    colaboradores: 0
  };

  projects.forEach(project => {
    if (project.status === 'activo') stats.activo++;
    if (project.status === 'completado') stats.completado++;
    stats.colaboradores += project.members.length;
  });

  document.getElementById('stat-activos').textContent = stats.activo;
  document.getElementById('stat-completados').textContent = stats.completado;
  document.getElementById('stat-colaboradores').textContent = stats.colaboradores;
}

// ===========================
// PROJECT CREATION
// ===========================
function toggleSkill(element) {
  element.classList.toggle('selected');
}

function createProject() {
  const title = document.getElementById('projectTitle').value;
  const description = document.getElementById('projectDescription').value;
  const category = document.getElementById('projectCategory').value;
  const icon = document.getElementById('projectIcon').value || '📁';

  if (!title || !description || !category) {
    showToast('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  // Get selected skills
  const selectedSkills = Array.from(document.querySelectorAll('.skill-badge.selected'))
    .map(skill => skill.textContent);

  // Create new project object
  const newProject = {
    id: projects.length + 1,
    title: title,
    description: description,
    icon: icon,
    status: 'activo',
    progress: 0,
    tags: selectedSkills,
    members: [
      { name: "Usuario", role: "Creador", avatar: "U" }
    ],
    createdDate: new Date().toISOString().split('T')[0]
  };

  projects.push(newProject);

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('newProjectModal'));
  modal.hide();

  // Reset form
  document.getElementById('newProjectForm').reset();
  document.querySelectorAll('.skill-badge').forEach(skill => {
    skill.classList.remove('selected');
  });

  // Re-render and update
  renderProjects();
  updateStats();

  showToast('¡Proyecto creado exitosamente!', 'success');
}

// ===========================
// PROJECT DETAILS
// ===========================
function viewProjectDetails(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentProjectId = projectId;

  const membersHTML = project.members.map(member => `
    <div class="member-item">
      <div class="member-avatar">${member.avatar}</div>
      <div class="member-info">
        <div class="member-name">${member.name}</div>
        <div class="member-role">${member.role}</div>
      </div>
    </div>
  `).join('');

  const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

  document.getElementById('projectDetailTitle').textContent = project.title;
  document.getElementById('projectDetailBody').innerHTML = `
    <div class="detail-section">
      <h6>Descripción</h6>
      <p>${project.description}</p>
    </div>

    <div class="detail-section">
      <h6>Estado</h6>
      <p><span class="project-status status-${project.status}">${project.status}</span></p>
    </div>

    <div class="detail-section">
      <h6>Progreso</h6>
      <div class="project-progress">
        ${project.progress}%
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <h6>Tecnologías</h6>
      <div class="project-tags">${tagsHTML}</div>
    </div>

    <div class="detail-section">
      <h6>Equipo (${project.members.length} miembros)</h6>
      <div class="member-list">
        ${membersHTML}
      </div>
    </div>

    <div class="detail-section">
      <h6>Fecha de Creación</h6>
      <p>${formatDate(project.createdDate)}</p>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
  modal.show();
}

// ===========================
// PROJECT EDITING
// ===========================
function editProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentProjectId = projectId;

  document.getElementById('editProjectId').value = projectId;
  document.getElementById('editProjectTitle').value = project.title;
  document.getElementById('editProjectDescription').value = project.description;
  document.getElementById('editProjectProgress').value = project.progress;
  document.getElementById('editProjectStatus').value = project.status;
  document.getElementById('progressLabel').textContent = project.progress + '%';

  const modal = new bootstrap.Modal(document.getElementById('editProjectModal'));
  modal.show();
}

function editCurrentProject() {
  if (currentProjectId) {
    bootstrap.Modal.getInstance(document.getElementById('projectDetailModal')).hide();
    editProject(currentProjectId);
  }
}

function saveProjectEdit() {
  const projectId = parseInt(document.getElementById('editProjectId').value);
  const project = projects.find(p => p.id === projectId);
  
  if (!project) return;

  project.title = document.getElementById('editProjectTitle').value;
  project.description = document.getElementById('editProjectDescription').value;
  project.progress = parseInt(document.getElementById('editProjectProgress').value);
  project.status = document.getElementById('editProjectStatus').value;

  const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
  modal.hide();

  renderProjects();
  updateStats();

  showToast('Proyecto actualizado exitosamente', 'success');
}

function updateProgressLabel(value) {
  document.getElementById('progressLabel').textContent = value + '%';
}

// ===========================
// PROJECT ACTIONS
// ===========================
function reactivateProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (project) {
    project.status = 'activo';
    renderProjects();
    updateStats();
    showToast(`Proyecto "${project.title}" reactivado`, 'success');
  }
}

function archiveProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (project && confirm(`¿Archivar el proyecto "${project.title}"?`)) {
    project.status = 'archivado';
    renderProjects();
    updateStats();
    showToast(`Proyecto "${project.title}" archivado`, 'warning');
  }
}

function goToChat(projectId) {
  showToast('Abriendo chat del proyecto...', 'success');
  // Redirect to chat page
  // window.location.href = `chat.html?project=${projectId}`;
}

function downloadProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (project) {
    showToast(`Descargando proyecto "${project.title}"...`, 'success');
    // Implement download logic here
  }
}

function shareProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (project) {
    showToast(`Enlace para compartir copiado al portapapeles`, 'success');
    // Implement share logic here
  }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
}