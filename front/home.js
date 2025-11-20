// ===========================
// GLOBAL VARIABLES
// ===========================

//remove icons from cards and fix UNDEFINED
let allProjects = [
  {
    id: 1,
    title: "App de Salud Mental para Estudiantes",
    description: "Buscamos desarrolladores y diseñadores para crear una aplicación que conecte estudiantes con recursos de apoyo psicológico y bienestar.",
    //icon: "imagen",
    category: "tecnologia",
    author: "María González - Psicología",
    teamSize: 5,
    currentMembers: 3,
    messages: 12,
    tags: ["React Native", "UI/UX", "Psicología"]
  },
  {
    id: 2,
    title: "Startup de Agricultura Urbana",
    description: "Proyecto de emprendimiento para desarrollar soluciones de cultivo urbano sostenible. Necesitamos ingenieros ambientales y marketers.",
    //icon: "imagen",
    category: "startup",
    author: "Carlos Ruiz - Agronomía",
    teamSize: 6,
    currentMembers: 4,
    messages: 8,
    tags: ["Startup", "Sostenibilidad", "Marketing"]
  },
  {
    id: 3,
    title: "Plataforma de Arte Digital Colaborativo",
    description: "Creación de una plataforma web donde artistas pueden colaborar en tiempo real. Buscamos desarrolladores full-stack.",
    //icon: "imagen",
    category: "diseno",
    author: "Ana López - Bellas Artes",
    teamSize: 4,
    currentMembers: 2,
    messages: 15,
    tags: ["Web Dev", "Arte Digital", "WebSocket"]
  },
  {
    id: 4,
    title: "Sistema IoT para Hogares Inteligentes",
    description: "Desarrollo de un sistema de automatización del hogar con enfoque en eficiencia energética. Buscamos programadores e ing. eléctricos.",
    //icon: "imagen",
    category: "ingenieria",
    author: "Roberto Díaz - Ing. Mecatrónica",
    teamSize: 7,
    currentMembers: 5,
    messages: 20,
    tags: ["IoT", "Arduino", "Python"]
  },
  {
    id: 5,
    title: "Plataforma E-Learning Interactiva",
    description: "Desarrollo de una plataforma educativa con gamificación para estudiantes de secundaria.",
    //icon: "imagen",
    category: "tecnologia",
    author: "Laura Martínez - Educación",
    teamSize: 6,
    currentMembers: 3,
    messages: 18,
    tags: ["React", "Node.js", "Educación"]
  },
  {
    id: 6,
    title: "Campaña Marketing Digital Sostenible",
    description: "Estrategia de marketing para productos ecológicos dirigida a millennials y Gen Z.",
    //icon: "imagen",
    category: "marketing",
    author: "Diego Torres - Marketing",
    teamSize: 4,
    currentMembers: 2,
    messages: 9,
    tags: ["Marketing", "Redes Sociales", "Sostenibilidad"]
  },
  {
    id: 7,
    title: "App de Gestión Financiera Personal",
    description: "Aplicación móvil para ayudar a jóvenes a administrar sus finanzas de manera inteligente.",
    //icon: "imagen",
    category: "negocios",
    author: "Patricia Gómez - Finanzas",
    teamSize: 5,
    currentMembers: 4,
    messages: 22,
    tags: ["Flutter", "Finanzas", "UI/UX"]
  },
  {
    id: 8,
    title: "Robot Clasificador de Residuos",
    description: "Proyecto de robótica para clasificación automática de residuos con inteligencia artificial.",
    //icon: "imagen",
    category: "ingenieria",
    author: "Miguel Ángel - Ing. Robótica",
    teamSize: 8,
    currentMembers: 6,
    messages: 25,
    tags: ["IA", "Robótica", "Python"]
  }
];

let filteredProjects = [...allProjects];
let currentProjectId = null;

// ===========================
// INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', function() {
  renderProjects();
  initializeFilters();
  initializeSidebar();
  initializeSearch();
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
// FILTER FUNCTIONS
// ===========================
function initializeFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      // Remove active from all chips
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      // Add active to clicked chip
      this.classList.add('active');
      
      // Filter projects
      const category = this.getAttribute('data-category');
      filterProjectsByCategory(category);
    });
  });
}

function filterProjectsByCategory(category) {
  if (category === 'todos') {
    filteredProjects = [...allProjects];
  } else {
    filteredProjects = allProjects.filter(project => project.category === category);
  }
  renderProjects();
}

// ===========================
// SEARCH FUNCTIONS
// ===========================
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchProjects();
      }
    });
  }
}

function searchProjects() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  if (searchTerm.trim() === '') {
    filteredProjects = [...allProjects];
  } else {
    filteredProjects = allProjects.filter(project => {
      return project.title.toLowerCase().includes(searchTerm) ||
             project.description.toLowerCase().includes(searchTerm) ||
             project.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
             project.author.toLowerCase().includes(searchTerm);
    });
  }
  
  renderProjects();
  
  if (filteredProjects.length === 0) {
    showToast('No se encontraron proyectos con ese criterio', 'warning');
  }
}

// ===========================
// RENDER FUNCTIONS
// ===========================
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
        <p style="font-size: 14px;">Intenta con otros criterios de búsqueda</p>
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
      <button class="project-menu" onclick="event.stopPropagation(); showProjectMenu(${project.id})">⋮</button>
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
        <div class="stat"><img src="https://cdn-icons-png.flaticon.com/512/10691/10691882.png" width="20"> ${project.currentMembers}/${project.teamSize}</div>
        <div class="stat"><img src="https://images.vexels.com/media/users/3/299488/isolated/preview/8c8c1857cbcf222280a12a7f5a122abc-icono-de-tecnologia-de-burbujas-de-chat-de-mensaje.png" width="20"> ${project.messages}</div>
      </div>
    </div>
  `;
  
  return article;
}

// ===========================
// PROJECT DETAILS
// ===========================
function loadProjectDetails(projectId) {
  const project = allProjects.find(p => p.id === projectId);
  if (!project) return;
  
  currentProjectId = projectId;
  
  const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  
  document.getElementById('projectDetailTitle').textContent = project.title;
  document.getElementById('projectDetailBody').innerHTML = `
    <div class="detail-section">
      <h6>Descripción</h6>
      <p>${project.description}</p>
    </div>

    <div class="detail-section">
      <h6>Categoría</h6>
      <p style="text-transform: capitalize;">${project.category}</p>
    </div>

    <div class="detail-section">
      <h6>Tecnologías / Habilidades</h6>
      <div class="project-tags">${tagsHTML}</div>
    </div>

    <div class="detail-section">
      <h6>Equipo</h6>
      <p>${project.currentMembers} de ${project.teamSize} miembros</p>
    </div>

    <div class="detail-section">
      <h6>Líder del Proyecto</h6>
      <p>${project.author}</p>
    </div>

    <div class="detail-section">
      <h6>Actividad</h6>
      <p>${project.messages} mensajes en el chat del proyecto</p>
    </div>
  `;
  
  const modal = new bootstrap.Modal(document.getElementById('projectDetailModal'));
  modal.show();
}

function showProjectMenu(projectId) {
  console.log('Mostrando menú del proyecto', projectId);
  showToast('Menú del proyecto próximamente...', 'info');
}

function showAllProjects() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  document.querySelector('.filter-chip[data-category="todos"]').classList.add('active');
  filteredProjects = [...allProjects];
  renderProjects();
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
  //const icon = document.getElementById('projectIcon').value || 'imagen';
  const teamSize = parseInt(document.getElementById('projectTeamSize').value);

  if (!title || !description || !category) {
    showToast('Por favor completa todos los campos requeridos', 'error');
    return;
  }

  // Get selected skills
  const selectedSkills = Array.from(document.querySelectorAll('.skill-badge.selected'))
    .map(skill => skill.textContent);

  if (selectedSkills.length === 0) {
    showToast('Por favor selecciona al menos una habilidad', 'warning');
    return;
  }

  // Create new project object
  const newProject = {
    id: allProjects.length + 1,
    title: title,
    description: description,
    icon: icon,
    category: category,
    author: "Usuario Actual - Tu Carrera",
    teamSize: teamSize,
    currentMembers: 1,
    messages: 0,
    tags: selectedSkills
  };

  allProjects.push(newProject);
  filteredProjects = [...allProjects];

  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('newProjectModal'));
  modal.hide();

  // Reset form
  document.getElementById('newProjectForm').reset();
  document.querySelectorAll('.skill-badge').forEach(skill => {
    skill.classList.remove('selected');
  });

  // Re-render
  renderProjects();

  showToast('¡Proyecto creado exitosamente!', 'success');
  
  // Scroll to the new project
  setTimeout(() => {
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
      projectCards[projectCards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

// ===========================
// PROJECT ACTIONS
// ===========================
function joinProject() {
  if (!currentProjectId) return;
  
  const project = allProjects.find(p => p.id === currentProjectId);
  if (!project) return;
  
  if (project.currentMembers >= project.teamSize) {
    showToast('Este proyecto ya tiene el equipo completo', 'warning');
    return;
  }
  
  project.currentMembers++;
  
  // Close modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('projectDetailModal'));
  modal.hide();
  
  renderProjects();
  showToast(`¡Te has unido al proyecto "${project.title}"!`, 'success');
}

// ===========================
// UTILITY FUNCTIONS
// ===========================
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