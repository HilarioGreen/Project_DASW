// URL del backend
const API_URL = 'https://projectdasw-production.up.railway.app/api';

// Variables globales
let allProjects = [];
let filteredProjects = [];
let currentProjectId = null;

// Notificaciones (por ahora estaticas, luego se conectaran al backend)
let notifications = [];

// Obtener token
function getToken() {
  return localStorage.getItem('token');
}

// Verificar autenticacion
function checkAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Funcion para hacer peticiones al API
async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = getToken();

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  return response.json();
}

// Inicializacion
document.addEventListener('DOMContentLoaded', async function() {
  if (!checkAuth()) return;

  await loadProjects();
  initializeFilters();
  initializeSidebar();
  initializeSearch();
  loadUserInfo();
});

// Cargar info del usuario
function loadUserInfo() {
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    const user = JSON.parse(userData);
    const avatar = document.querySelector('.user-avatar');
    if (avatar) {
      avatar.textContent = user.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'US';
    }
  }
}

// Cargar proyectos desde el backend
async function loadProjects(categoria = null, search = null) {
  try {
    let endpoint = '/projects';
    const params = [];

    if (categoria && categoria !== 'todos') {
      params.push(`categoria=${categoria}`);
    }
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    if (params.length > 0) {
      endpoint += '?' + params.join('&');
    }

    const result = await apiRequest(endpoint);

    if (result.success) {
      allProjects = result.data.map(p => ({
        id: p._id,
        title: p.titulo,
        description: p.descripcion,
        category: p.categoria,
        author: p.owner ? `${p.owner.nombre} - ${p.owner.carrera}` : 'Usuario',
        teamSize: p.tamanoEquipo,
        currentMembers: p.miembrosActuales,
        messages: 0,
        tags: p.habilidadesRequeridas || []
      }));
      filteredProjects = [...allProjects];
      renderProjects();
    } else {
      console.error('Error al cargar proyectos:', result.error);
    }
  } catch (error) {
    console.error('Error de conexion:', error);
  }
}

// Sidebar
function initializeSidebar() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleSidebar);
  }

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

// Filtros
function initializeFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', async function() {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');

      const category = this.getAttribute('data-category');
      await loadProjects(category);
    });
  });
}

// Busqueda
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', async function(e) {
      if (e.key === 'Enter') {
        await searchProjects();
      }
    });
  }
}

async function searchProjects() {
  const searchTerm = document.getElementById('searchInput').value;
  await loadProjects(null, searchTerm);

  if (filteredProjects.length === 0) {
    showToast('No se encontraron proyectos con ese criterio', 'warning');
  }
}

// Renderizar proyectos
function renderProjects() {
  const grid = document.getElementById('projectGrid');
  const count = document.getElementById('projectCount');

  if (!grid) return;

  grid.innerHTML = '';

  if (filteredProjects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #888;">
        <div style="font-size: 64px; margin-bottom: 16px;">🔍</div>
        <h3 style="font-size: 18px; color: #e0e0e0; margin-bottom: 8px;">No se encontraron proyectos</h3>
        <p style="font-size: 14px;">Intenta con otros criterios de busqueda</p>
      </div>
    `;
  } else {
    filteredProjects.forEach(project => {
      grid.appendChild(createProjectCard(project));
    });
  }

  if (count) {
    count.textContent = `(${filteredProjects.length})`;
  }
}

function createProjectCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.onclick = () => loadProjectDetails(project.id);

  const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

  article.innerHTML = `
    <div class="project-header">
      <div class="project-title">${project.title}</div>
    </div>
    <div>
      <div class="project-description">${project.description}</div>
    </div>
    <div class="project-tags">
      ${tagsHTML}
    </div>
    <div class="project-footer">
      <div class="project-author">
        <div class="author-avatar"></div>
        <span>${project.author}</span>
      </div>
      <div class="project-stats">
        <div class="stat"><img src="https://cdn-icons-png.flaticon.com/256/12376/12376407.png" width="20" height="25"> ${project.currentMembers}/${project.teamSize}</div>
      </div>
    </div>
  `;

  return article;
}

// Detalles del proyecto
async function loadProjectDetails(projectId) {
  try {
    const result = await apiRequest(`/projects/${projectId}`);

    if (result.success) {
      const project = result.data;
      currentProjectId = projectId;

      const tagsHTML = (project.habilidadesRequeridas || []).map(tag => `<span class="tag">${tag}</span>`).join('');

      document.getElementById('projectDetailTitle').textContent = project.titulo;
      document.getElementById('projectDetailBody').innerHTML = `
        <div class="detail-section">
          <h6>Descripcion</h6>
          <p>${project.descripcion}</p>
        </div>

        <div class="detail-section">
          <h6>Categoria</h6>
          <p style="text-transform: capitalize;">${project.categoria}</p>
        </div>

        <div class="detail-section">
          <h6>Tecnologias / Habilidades</h6>
          <div class="project-tags">${tagsHTML}</div>
        </div>

        <div class="detail-section">
          <h6>Equipo</h6>
          <p>${project.miembrosActuales} de ${project.tamanoEquipo} miembros</p>
        </div>

        <div class="detail-section">
          <h6>Lider del Proyecto</h6>
          <p>${project.owner ? project.owner.nombre : 'Usuario'}</p>
        </div>
      `;

      const modal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
      modal.show();
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al cargar detalles del proyecto', 'error');
  }
}

// Toggle skill selection
function toggleSkill(element) {
  element.classList.toggle('selected');
}

// Crear proyecto
async function createProject() {
  const titulo = document.getElementById('projectTitle').value;
  const descripcion = document.getElementById('projectDescription').value;
  const categoria = document.getElementById('projectCategory').value;
  const tamanoEquipo = parseInt(document.getElementById('projectTeamSize').value);

  if (!titulo || !descripcion || !categoria) {
    showToast('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  const habilidadesRequeridas = Array.from(document.querySelectorAll('.skill-badge.selected'))
    .map(skill => skill.textContent);

  try {
    const result = await apiRequest('/projects', 'POST', {
      titulo,
      descripcion,
      categoria,
      tamanoEquipo,
      habilidadesRequeridas
    });

    if (result.success) {
      // Cerrar modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('newProjectModal'));
      modal.hide();

      // Limpiar formulario
      document.getElementById('newProjectForm').reset();
      document.querySelectorAll('.skill-badge').forEach(skill => {
        skill.classList.remove('selected');
      });

      // Recargar proyectos
      await loadProjects();

      showToast('Proyecto creado exitosamente!', 'success');
    } else {
      showToast(result.error || 'Error al crear proyecto', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error de conexion con el servidor', 'error');
  }
}

// Unirse a proyecto (postularse)
async function joinProject() {
  if (!currentProjectId) return;

  try {
    const result = await apiRequest('/applications', 'POST', {
      proyectoId: currentProjectId,
      mensaje: 'Me gustaria unirme a este proyecto'
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById('projectDetailModal'));
    modal.hide();

    if (result.success) {
      showToast('Solicitud enviada! El lider del proyecto revisara tu postulacion', 'success');
    } else {
      showToast(result.error || 'Error al postularse', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error de conexion con el servidor', 'error');
  }
}

// Toast
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Cerrar sesion
function confirmLogout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  localStorage.removeItem('rememberedEmail');

  showToast('Sesion cerrada', 'success');

  const logoutModal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
  if (logoutModal) {
    logoutModal.hide();
  }

  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}
