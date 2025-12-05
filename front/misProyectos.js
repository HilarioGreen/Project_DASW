// URL del backend
const API_URL = 'http://localhost:5001/api';

// Variables globales
let projects = [];
let collaborations = [];
let currentProjectId = null;

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

  await loadMyProjects();
  await loadMyCollaborations();
  updateStats();
  initializeSidebar();
});

// Cargar mis proyectos
async function loadMyProjects() {
  try {
    const result = await apiRequest('/projects/my-projects');

    if (result.success) {
      projects = result.data.map(p => ({
        id: p._id,
        title: p.titulo,
        description: p.descripcion,
        status: p.estado,
        progress: p.progreso,
        tags: p.habilidadesRequeridas || [],
        members: [],
        teamSize: p.tamanoEquipo,
        currentMembers: p.miembrosActuales,
        createdDate: p.fechaPublicacion
      }));
      renderProjects();
    }
  } catch (error) {
    console.error('Error al cargar proyectos:', error);
  }
}

// Cargar mis colaboraciones
async function loadMyCollaborations() {
  try {
    const result = await apiRequest('/projects/my-collaborations');

    if (result.success) {
      collaborations = result.data.map(p => ({
        id: p._id,
        title: p.titulo,
        description: p.descripcion,
        status: p.estado,
        progress: p.progreso,
        tags: p.habilidadesRequeridas || [],
        owner: p.owner ? p.owner.nombre : 'Usuario',
        createdDate: p.fechaPublicacion
      }));
      renderCollaborations();
    }
  } catch (error) {
    console.error('Error al cargar colaboraciones:', error);
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

// Tabs
function switchTab(tabName, event) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.querySelectorAll('.tab-content').forEach(content => {
    content.style.display = 'none';
  });

  document.getElementById(`tab-${tabName}`).style.display = 'block';
  event.target.classList.add('active');
}

// Renderizar proyectos
function renderProjects() {
  const statusGroups = {
    activo: [],
    pausado: [],
    completado: [],
    archivado: []
  };

  projects.forEach(project => {
    if (statusGroups[project.status]) {
      statusGroups[project.status].push(project);
    }
  });

  Object.keys(statusGroups).forEach(status => {
    const grid = document.getElementById(`grid-${status}s`);
    const count = document.getElementById(`count-${status}s`);

    if (grid) {
      grid.innerHTML = '';

      if (statusGroups[status].length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon"><img src="https://cdn-icons-png.flaticon.com/512/5741/5741178.png" width="100" height="120"></div>
            <h3>No hay proyectos ${status}s</h3>
            <p>Tus proyectos ${status}s apareceran aqui</p>
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

// Renderizar colaboraciones
function renderCollaborations() {
  const grid = document.getElementById('grid-colaboraciones');
  if (!grid) return;

  grid.innerHTML = '';

  if (collaborations.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><img src="https://cdn-icons-png.flaticon.com/512/5741/5741178.png" width="100" height="120"></div>
        <h3>No hay colaboraciones</h3>
        <p>Los proyectos en los que colaboras apareceran aqui</p>
      </div>
    `;
  } else {
    collaborations.forEach(project => {
      grid.appendChild(createCollaborationCard(project));
    });
  }
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
        <button class="action-btn" onclick="viewProjectDetails('${project.id}')">Ver detalles</button>
        <button class="action-btn" onclick="editProject('${project.id}')">Editar</button>
        <button class="action-btn btn-danger" onclick="confirmDeleteProject('${project.id}', '${project.title}')">Eliminar</button>
      </div>
    `;
  } else if (project.status === 'pausado') {
    actionsHTML = `
      <div class="project-actions">
        <button class="action-btn" onclick="changeProjectStatus('${project.id}', 'activo')">Reactivar</button>
        <button class="action-btn" onclick="viewProjectDetails('${project.id}')">Ver detalles</button>
        <button class="action-btn btn-danger" onclick="confirmDeleteProject('${project.id}', '${project.title}')">Eliminar</button>
      </div>
    `;
  } else if (project.status === 'completado') {
    actionsHTML = `
      <div class="project-actions">
        <button class="action-btn" onclick="viewProjectDetails('${project.id}')">Ver proyecto</button>
        <button class="action-btn btn-danger" onclick="confirmDeleteProject('${project.id}', '${project.title}')">Eliminar</button>
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
      Completado
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

function createCollaborationCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card';

  const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

  article.innerHTML = `
    <div class="project-header">
      <div class="project-title">${project.title}</div>
      <span class="project-status status-${project.status}">${project.status}</span>
    </div>
    <div>
      <div class="project-description">${project.description}</div>
    </div>
    <div class="project-tags">
      ${tagsHTML}
    </div>
    <div class="project-progress">
      Progreso: ${project.progress}%
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${project.progress}%"></div>
      </div>
    </div>
    <div class="project-footer">
      <small>Lider: ${project.owner}</small>
    </div>
  `;

  return article;
}

// Estadisticas
function updateStats() {
  const activos = projects.filter(p => p.status === 'activo').length;
  const completados = projects.filter(p => p.status === 'completado').length;
  const totalColaboradores = projects.reduce((sum, p) => sum + (p.currentMembers || 1), 0);

  const statActivos = document.getElementById('stat-activos');
  const statCompletados = document.getElementById('stat-completados');
  const statColaboradores = document.getElementById('stat-colaboradores');

  if (statActivos) statActivos.textContent = activos;
  if (statCompletados) statCompletados.textContent = completados;
  if (statColaboradores) statColaboradores.textContent = totalColaboradores;
}

// Toggle skill
function toggleSkill(element) {
  element.classList.toggle('selected');
}

// Crear proyecto
async function createProject() {
  const titulo = document.getElementById('projectTitle').value;
  const descripcion = document.getElementById('projectDescription').value;
  const categoria = document.getElementById('projectCategory').value;

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
      habilidadesRequeridas
    });

    if (result.success) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('newProjectModal'));
      modal.hide();

      document.getElementById('newProjectForm').reset();
      document.querySelectorAll('.skill-badge').forEach(skill => {
        skill.classList.remove('selected');
      });

      await loadMyProjects();
      updateStats();

      showToast('Proyecto creado exitosamente!', 'success');
    } else {
      showToast(result.error || 'Error al crear proyecto', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error de conexion', 'error');
  }
}

// Ver detalles
async function viewProjectDetails(projectId) {
  try {
    const result = await apiRequest(`/projects/${projectId}`);

    if (result.success) {
      const project = result.data;
      currentProjectId = projectId;

      const tagsHTML = (project.habilidadesRequeridas || []).map(tag => `<span class="tag">${tag}</span>`).join('');

      const equipoHTML = project.equipo ? project.equipo.map(m => `
        <div class="member-item">
          <div class="member-avatar">${m.usuario.nombre.charAt(0)}</div>
          <div class="member-info">
            <div class="member-name">${m.usuario.nombre}</div>
            <div class="member-role">${m.rol}</div>
          </div>
        </div>
      `).join('') : '<p>Sin miembros</p>';

      document.getElementById('projectDetailTitle').textContent = project.titulo;
      document.getElementById('projectDetailBody').innerHTML = `
        <div class="detail-section">
          <h6>Descripcion</h6>
          <p>${project.descripcion}</p>
        </div>

        <div class="detail-section">
          <h6>Estado</h6>
          <p><span class="project-status status-${project.estado}">${project.estado}</span></p>
        </div>

        <div class="detail-section">
          <h6>Progreso</h6>
          <div class="project-progress">
            ${project.progreso}%
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width: ${project.progreso}%"></div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h6>Tecnologias</h6>
          <div class="project-tags">${tagsHTML}</div>
        </div>

        <div class="detail-section">
          <h6>Equipo</h6>
          <div class="member-list">
            ${equipoHTML}
          </div>
        </div>

        <div class="detail-section">
          <h6>Fecha de Creacion</h6>
          <p>${formatDate(project.fechaPublicacion)}</p>
        </div>
      `;

      const modal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
      modal.show();
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error al cargar detalles', 'error');
  }
}

// Editar proyecto
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

async function saveProjectEdit() {
  const projectId = document.getElementById('editProjectId').value;

  const titulo = document.getElementById('editProjectTitle').value;
  const descripcion = document.getElementById('editProjectDescription').value;
  const progreso = parseInt(document.getElementById('editProjectProgress').value);
  const estado = document.getElementById('editProjectStatus').value;

  try {
    const result = await apiRequest(`/projects/${projectId}`, 'PUT', {
      titulo,
      descripcion,
      progreso,
      estado
    });

    if (result.success) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('editProjectModal'));
      modal.hide();

      await loadMyProjects();
      updateStats();

      showToast('Proyecto actualizado exitosamente', 'success');
    } else {
      showToast(result.error || 'Error al actualizar', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error de conexion', 'error');
  }
}

function updateProgressLabel(value) {
  document.getElementById('progressLabel').textContent = value + '%';
}

// Cambiar estado del proyecto
async function changeProjectStatus(projectId, nuevoEstado) {
  try {
    const result = await apiRequest(`/projects/${projectId}`, 'PUT', {
      estado: nuevoEstado
    });

    if (result.success) {
      await loadMyProjects();
      updateStats();
      showToast(`Proyecto ${nuevoEstado}`, 'success');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Confirmar eliminacion de proyecto
function confirmDeleteProject(projectId, projectTitle) {
  if (confirm(`¿Estas seguro de eliminar el proyecto "${projectTitle}"?\n\nEsta accion no se puede deshacer.`)) {
    deleteProject(projectId);
  }
}

// Eliminar proyecto
async function deleteProject(projectId) {
  try {
    const result = await apiRequest(`/projects/${projectId}`, 'DELETE');

    if (result.success) {
      await loadMyProjects();
      updateStats();
      showToast('Proyecto eliminado exitosamente', 'success');
    } else {
      showToast(result.error || 'Error al eliminar proyecto', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showToast('Error de conexion', 'error');
  }
}

// Utilidades
function formatDate(dateString) {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

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
