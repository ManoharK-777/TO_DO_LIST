/* ===================================================
   Smart Todo AI – Premium JS
   Full dynamic SaaS behavior + Flame Cursor
=================================================== */

// ─── STATE ───────────────────────────────────────
let tasks = [];
let activeFilter = 'all';

// ─── FLAME CURSOR ENGINE ──────────────────────────
(function initFlame() {
  const canvas = document.getElementById('flame-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -200, y: -200 };
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  const COLORS = [
    'rgba(255, 255, 255, ',  // white core
    'rgba(253, 224, 71, ',   // yellow
    'rgba(251, 146, 60, ',   // orange
    'rgba(239, 68, 68, ',    // red
    'rgba(167, 139, 250, ',  // violet
  ];

  window.addEventListener('mousemove', e => {
    mouse = { x: e.clientX, y: e.clientY };
    // Spawn 3-5 particles per move
    const count = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 14,
        y: mouse.y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 3.5 + 2),         // Upward drift
        alpha: 1,
        size: Math.random() * 14 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        decay: Math.random() * 0.025 + 0.02,
        gravity: -0.06,
      });
    }
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glowing cursor dot
    const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 10);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(0.4, 'rgba(167,139,250,0.6)');
    grad.addColorStop(1, 'rgba(167,139,250,0)');
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      p.size *= 0.97;

      if (p.alpha <= 0 || p.size <= 0.5) {
        particles.splice(i, 1);
        continue;
      }

      const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      pGrad.addColorStop(0, p.color + Math.min(p.alpha, 1) + ')');
      pGrad.addColorStop(0.5, p.color + (p.alpha * 0.5) + ')');
      pGrad.addColorStop(1, p.color + '0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();
    }

    animFrame = requestAnimationFrame(animate);
  }

  animate();
})();

// ─── API HELPERS ─────────────────────────────────
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return res.json();
}

// ─── RENDER ──────────────────────────────────────
function getFiltered() {
  if (activeFilter === 'pending')   return tasks.filter(t => !t.completed);
  if (activeFilter === 'completed') return tasks.filter(t =>  t.completed);
  return tasks;
}

function updateKPIs() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.completed).length;
  document.getElementById('kpi-total').textContent   = total;
  document.getElementById('kpi-done').textContent    = done;
  document.getElementById('kpi-pending').textContent = total - done;
}

function renderTasks() {
  const list    = document.getElementById('task-list');
  const empty   = document.getElementById('empty-state');
  const filtered = getFiltered();

  updateKPIs();

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  list.innerHTML = filtered.map(task => `
    <div class="task-card ${task.completed ? 'completed' : 'pending'}" id="task-${task.id}">
      <button
        class="task-check ${task.completed ? 'done' : ''}"
        onclick="toggleTask('${task.id}')"
        title="${task.completed ? 'Mark pending' : 'Mark complete'}"
      >
        <svg width="14" height="14" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
      <div class="flex flex-col flex-1 min-w-0 gap-0.5">
        <span class="task-text ${task.completed ? 'done' : ''}">${escapeHTML(task.text)}</span>
        <span class="task-date">${task.created_at || 'Today'}</span>
      </div>
      <button class="task-delete" onclick="deleteTask('${task.id}')" title="Delete">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}

// ─── ACTIONS ─────────────────────────────────────
async function addTask(text) {
  const task = await fetchJSON('/add', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
  tasks.unshift(task);
  renderTasks();
}

async function toggleTask(id) {
  const updated = await fetchJSON(`/toggle/${id}`, { method: 'POST' });
  const idx = tasks.findIndex(t => t.id === id);
  if (idx !== -1) tasks[idx] = updated;
  renderTasks();
}

async function deleteTask(id) {
  const el = document.getElementById(`task-${id}`);
  if (el) {
    el.classList.add('removing');
    await new Promise(r => setTimeout(r, 300));
  }
  await fetchJSON(`/delete/${id}`, { method: 'DELETE' });
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// ─── FILTERS ─────────────────────────────────────
document.querySelectorAll('.filter-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ─── FORM ────────────────────────────────────────
document.getElementById('task-form').addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  await addTask(text);
});

// ─── INIT ────────────────────────────────────────
(async function init() {
  tasks = await fetchJSON('/tasks');
  renderTasks();
})();

// ─── UTILS ───────────────────────────────────────
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
