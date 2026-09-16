(() => {
  const state = { healthy: false, projects: [], selectedProject: null };
  const $ = (id) => document.getElementById(id);

  async function jsonFetch(url, options = {}) {
    const response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || body.error || `HTTP ${response.status}`);
    return body;
  }

  function status(text, kind = '') {
    const el = $('forgeStatus');
    if (!el) return;
    el.textContent = text;
    el.className = `forge-status ${kind}`;
  }

  function renderProjects() {
    const select = $('forgeProjectSelect');
    if (!select) return;
    select.innerHTML = state.projects.length
      ? state.projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)} · ${escapeHtml(p.slug)}</option>`).join('')
      : '<option value="">No projects yet</option>';
    if (state.selectedProject) select.value = state.selectedProject;
    $('forgeRunBtn').disabled = !state.healthy || !state.projects.length;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  async function health() {
    try {
      const result = await jsonFetch('/api/health', { headers: {} });
      state.healthy = result.ok === true;
      $('forgeHealth').textContent = state.healthy ? 'DATABASE CONNECTED' : (result.status || 'DATABASE NOT READY');
      $('forgeHealth').className = `forge-pill ${state.healthy ? 'ok' : ''}`;
    } catch (error) {
      state.healthy = false;
      $('forgeHealth').textContent = 'DATABASE NOT CONNECTED';
      $('forgeHealth').className = 'forge-pill';
    }
    renderProjects();
  }

  async function loadProjects() {
    try {
      const result = await jsonFetch('/api/projects', { headers: {} });
      state.projects = result.projects || [];
      if (!state.selectedProject && state.projects[0]) state.selectedProject = state.projects[0].id;
      renderProjects();
    } catch (error) {
      state.projects = [];
      renderProjects();
      status(`No se pudieron cargar los proyectos: ${error.message}`, 'error');
    }
  }

  function openNewProject() {
    $('forgeModal').showModal();
    $('forgeName').focus();
  }

  async function createProject(event) {
    event.preventDefault();
    const name = $('forgeName').value.trim();
    const description = $('forgeDescription').value.trim();
    if (!name) return;
    try {
      $('forgeCreateBtn').disabled = true;
      status('CREATE PROJECT · persistiendo en PostgreSQL…');
      const result = await jsonFetch('/api/projects', { method: 'POST', body: JSON.stringify({ name, description }) });
      state.projects.unshift(result.project);
      state.selectedProject = result.project.id;
      $('forgeModal').close();
      $('forgeName').value = '';
      $('forgeDescription').value = '';
      renderProjects();
      status(`Proyecto creado: ${result.project.name}`, 'ok');
    } catch (error) {
      status(`CREATE PROJECT falló: ${error.message}`, 'error');
    } finally {
      $('forgeCreateBtn').disabled = false;
    }
  }

  async function runDiscovery() {
    const projectId = $('forgeProjectSelect').value;
    if (!projectId) return status('Selecciona un proyecto.', 'error');
    try {
      $('forgeRunBtn').disabled = true;
      status('RUN DISCOVERY · creando discovery_run y agent_runs…');
      const result = await jsonFetch('/api/discovery', {
        method: 'POST',
        body: JSON.stringify({
          project_id: projectId,
          objective: $('forgeObjective').value.trim() || 'Initial operational discovery'
        })
      });
      const count = result.agents?.length || 0;
      status(`RUN DISCOVERY completado · ${count} agent_runs + synthesis persistidos.`, 'ok');
      renderRun(result);
    } catch (error) {
      status(`RUN DISCOVERY falló: ${error.message}`, 'error');
    } finally {
      $('forgeRunBtn').disabled = false;
    }
  }

  function renderRun(result) {
    const target = $('forgeResults');
    if (!target) return;
    target.innerHTML = `<div class="forge-panel"><strong>Última ejecución</strong><div class="forge-runs"><div class="forge-run"><div><span class="forge-pill">${escapeHtml(result.run.status)}</span></div><code>${escapeHtml(result.run.id)}</code><p>${escapeHtml(result.synthesis?.summary || 'Synthesis persisted.')}</p></div></div><div class="forge-grid">${(result.agents || []).map(a => `<div class="forge-agent"><strong>${escapeHtml(a.agent_key)}</strong><small>${escapeHtml(a.status)} · confidence ${escapeHtml(a.confidence)}</small></div>`).join('')}</div></div>`;
  }

  function injectUI() {
    const top = document.querySelector('.top-actions');
    if (!top || $('forgeOpenBtn')) return;
    top.insertAdjacentHTML('afterbegin', '<button id="forgeOpenBtn" class="ghost-btn">NEW PROJECT</button>');
    const content = document.querySelector('.content');
    if (content) content.insertAdjacentHTML('afterbegin', `<section class="forge-bar"><strong>PROJECT FORGE · Discovery Command Center</strong><span id="forgeHealth" class="forge-pill">CHECKING DATABASE…</span><select id="forgeProjectSelect" class="forge-btn" aria-label="Project"></select><button id="forgeRunBtn" class="forge-btn primary">RUN DISCOVERY</button></section><section class="forge-panel"><label>Discovery objective <input id="forgeObjective" style="width:100%;margin-top:8px;box-sizing:border-box" value="Initial operational discovery" /></label><div id="forgeStatus" class="forge-status">Waiting for infrastructure health.</div></section><div id="forgeResults" style="margin-top:16px"></div>`);
    document.body.insertAdjacentHTML('beforeend', `<dialog id="forgeModal" class="forge-modal"><h2>NEW PROJECT</h2><form id="forgeForm" class="forge-form"><label>Project name<input id="forgeName" required maxlength="200" placeholder="PROJECT FORGE / Demo Project" /></label><label>Description<textarea id="forgeDescription" placeholder="Operational scope, objectives and context"></textarea></label><div class="forge-actions"><button type="button" id="forgeCancelBtn" class="forge-btn">CANCEL</button><button id="forgeCreateBtn" class="forge-btn primary" type="submit">CREATE PROJECT</button></div></form></dialog>`);
    $('forgeOpenBtn').onclick = openNewProject;
    $('forgeCancelBtn').onclick = () => $('forgeModal').close();
    $('forgeForm').onsubmit = createProject;
    $('forgeRunBtn').onclick = runDiscovery;
    $('forgeProjectSelect').onchange = e => { state.selectedProject = e.target.value; };
  }

  window.addEventListener('DOMContentLoaded', async () => {
    injectUI();
    await health();
    await loadProjects();
    await health();
  });
})();
