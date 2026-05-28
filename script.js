// Thanh 97 — Windows 97 portfolio interactions

const $ = (id) => document.getElementById(id);

// ─── Section switching ───
const paths = {
  about:      'C:\\Thanh\\Portfolio\\About.txt',
  experience: 'C:\\Thanh\\Portfolio\\Resume.doc',
  projects:   'C:\\Thanh\\Portfolio\\Projects\\',
  skills:     'C:\\Thanh\\Portfolio\\Skills.ini',
  contact:    'C:\\Thanh\\Portfolio\\Contact.txt',
};
const statusInfo = {
  about:      { cell: '1 object selected', size: '1.0 KB' },
  experience: { cell: '1 object selected', size: '32 KB' },
  projects:   { cell: '5 object(s)',       size: '5.0 MB' },
  skills:     { cell: '1 object selected', size: '512 B' },
  contact:    { cell: '1 object selected', size: '256 B' },
};

function showSection(id) {
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tree-row[data-section]').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.mobile-section-app[data-mobile-section]').forEach(el => el.classList.remove('active'));

  const sec = $(`section-${id}`);
  if (sec) sec.classList.add('active');

  const tr = document.querySelector(`.tree-row[data-section="${id}"]`);
  if (tr) tr.classList.add('active');

  const mobileTask = document.querySelector(`.mobile-section-app[data-mobile-section="${id}"]`);
  if (mobileTask) mobileTask.classList.add('active');

  if (paths[id]) $('addrPath').textContent = paths[id];
  if (statusInfo[id]) {
    $('statusCell').textContent = statusInfo[id].cell;
    $('statusSize').textContent = statusInfo[id].size;
  }

  const pd = $('projDetail');
  if (pd && id !== 'projects') pd.classList.remove('open');

  closeStartMenu();
}

document.querySelectorAll('.tree-row[data-section]').forEach(el => {
  el.addEventListener('click', () => showSection(el.dataset.section));
});

document.querySelectorAll('.mobile-section-app[data-mobile-section]').forEach(el => {
  el.addEventListener('click', () => {
    openWindow('mainWindow');
    showSection(el.dataset.mobileSection);
  });
});

document.querySelectorAll('.desk-icon[data-target]').forEach(el => {
  let lastClick = 0;
  el.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 720px)').matches) {
      showSection(el.dataset.target);
      e.preventDefault();
      return;
    }

    const now = Date.now();
    if (now - lastClick < 400) {
      showSection(el.dataset.target);
      e.preventDefault();
    }
    lastClick = now;
  });
});

// ─── Project detail ───
const projects = {
  lms: {
    name: 'LMS Database System',
    bullets: [
      'Built LMS backend with MariaDB/MySQL supporting course management, enrollment, and student progress tracking.',
      'Developed RESTful APIs using .NET 10 and C#; designed normalized schemas and stored procedures for concurrent operations.',
    ],
  },
  snake: {
    name: 'Full-Stack Snake Game',
    bullets: [
      'Built a multiplayer Snake game with client-server architecture in C# — 25 concurrent players with authoritative server state.',
      'Implemented SQL Server leaderboard + session tracking with parameterized CRUD queries and indexing — reduced query latency by 40%.',
      'Engineered real-time sync with event-driven updates and disconnect/reconnect resilience.',
    ],
  },
  otg: {
    name: 'On the Go — AI Travel Planner',
    bullets: [
      'Engineered an AI-driven travel planner with personalized itineraries using OpenAI for natural-language recommendations.',
      'Integrated Azure Maps for live routing/geolocation and Azure Cosmos DB for scalable trip storage.',
      'Built a React frontend with a Flask backend.',
    ],
  },
  sparky: {
    name: 'Sparky — Wildfire Prediction',
    bullets: [
      'Developed wildfire prediction app combining real-time climate and geospatial data.',
      'Trained and deployed ML risk models on AWS SageMaker exposed via REST endpoints.',
      'Built an interactive React map UI with layered risk visualization; Node.js backend for data processing.',
    ],
  },
  music: {
    name: 'Music Studio App',
    bullets: [
      'Built a desktop music app in Java using OOP; designed AWT GUI supporting tempo adjustment, note configuration, and playback.',
      'Integrated 200+ virtual instruments with modular design patterns for audio playback and dynamic UI updates.',
    ],
  },
};

function selectProject(id) {
  document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
  const item = document.querySelector(`.file-item[data-proj="${id}"]`);
  if (item) item.classList.add('selected');

  const proj = projects[id];
  if (!proj) return;
  const pd = $('projDetail');
  $('pdName').textContent = proj.name;
  $('pdList').innerHTML = proj.bullets.map(b => `<li>${b}</li>`).join('');
  pd.classList.add('open');
}

document.querySelectorAll('.file-item[data-proj]').forEach(el => {
  el.addEventListener('click', () => selectProject(el.dataset.proj));
});
$('pdClose').addEventListener('click', () => $('projDetail').classList.remove('open'));

// ─── Live clock ───
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  $('clock').textContent = `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}
updateClock();
setInterval(updateClock, 15 * 1000);

// ─── Start menu ───
function openStartMenu()  { $('startMenu').classList.add('open');    $('startBtn').classList.add('active'); }
function closeStartMenu() { $('startMenu').classList.remove('open'); $('startBtn').classList.remove('active'); }
function toggleStartMenu(){ $('startMenu').classList.contains('open') ? closeStartMenu() : openStartMenu(); }

$('startBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  toggleStartMenu();
});

function taskButtonFor(windowId) {
  return document.querySelector(`.task-app[data-window="${windowId}"]`);
}

function showTaskButton(windowId) {
  const tApp = taskButtonFor(windowId);
  if (tApp) tApp.classList.remove('closed');
}

function hideTaskButton(windowId) {
  const tApp = taskButtonFor(windowId);
  if (tApp) {
    tApp.classList.add('closed');
    tApp.classList.remove('active');
  }
}

function openWindow(windowId) {
  const w = $(windowId);
  if (!w) return;
  w.style.display = 'block';
  showTaskButton(windowId);
  focusWindow(w);
  closeStartMenu();
}

function minimizeWindow(windowId) {
  if (windowId === 'mainWindow') return;
  const w = $(windowId);
  if (!w) return;
  w.style.display = 'none';
  showTaskButton(windowId);
  const tApp = taskButtonFor(windowId);
  if (tApp) tApp.classList.remove('active');
  focusWindow($('mainWindow'));
}

function closeWindow(windowId) {
  if (windowId === 'mainWindow') return;
  const w = $(windowId);
  if (!w) return;
  w.style.display = 'none';
  hideTaskButton(windowId);
  focusWindow($('mainWindow'));
}

document.querySelectorAll('.start-item[data-open-window]').forEach(el => {
  el.addEventListener('click', () => openWindow(el.dataset.openWindow));
});
document.addEventListener('click', (e) => {
  if (!$('startMenu').contains(e.target) && !$('startBtn').contains(e.target)) {
    closeStartMenu();
  }
});

// ─── Window controls ───
document.querySelectorAll('[data-minimize]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    minimizeWindow(el.dataset.minimize);
  });
});

document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow(el.dataset.close);
  });
});

// ─── Focus / z-index ───
let topZ = 10;
function focusWindow(w) {
  topZ++;
  w.style.zIndex = topZ;
  document.querySelectorAll('.task-app').forEach(t => t.classList.remove('active'));
  const tApp = document.querySelector(`.task-app[data-window="${w.id}"]`);
  if (tApp) tApp.classList.add('active');
  document.querySelectorAll('.window .title-bar').forEach(t => t.classList.add('inactive'));
  const tb = w.querySelector('.title-bar');
  if (tb) tb.classList.remove('inactive');
}
document.querySelectorAll('.window').forEach(w => {
  w.addEventListener('mousedown', () => focusWindow(w));
});

document.querySelectorAll('.task-app[data-window]').forEach(el => {
  el.addEventListener('click', () => {
    const w = $(el.dataset.window);
    if (!w) return;

    if (el.classList.contains('closed')) return;

    const isVisible = w.style.display !== 'none';
    const isActive = el.classList.contains('active');
    if (w.id !== 'mainWindow' && isVisible && isActive) {
      minimizeWindow(w.id);
      return;
    }

    w.style.display = 'block';
    showTaskButton(w.id);
    focusWindow(w);
  });
});

// ─── Draggable windows ───
// Simple model: at mousedown, record the cursor's offset from the window's
// top-left. While dragging, set window position = cursor − offset. No drift.
function makeDraggable(win, handle) {
  let dragging = false;
  let offX = 0, offY = 0;
  let initialized = false;

  function initPosition() {
    // Convert any CSS positioning (right, bottom, transform, margin) into
    // a pure left/top setup so we can move the window freely.
    const rect = win.getBoundingClientRect();
    win.style.transform = 'none';
    win.style.margin    = '0';
    win.style.right     = 'auto';
    win.style.bottom    = 'auto';
    win.style.width     = rect.width + 'px';
    win.style.left      = rect.left  + 'px';
    win.style.top       = rect.top   + 'px';
    initialized = true;
  }

  function getXY(e) {
    if (e.touches && e.touches[0]) return [e.touches[0].clientX, e.touches[0].clientY];
    return [e.clientX, e.clientY];
  }

  function onDown(e) {
    if (e.target.closest('.title-btn, .title-controls, button')) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (window.matchMedia('(max-width: 720px)').matches) return;

    if (!initialized) initPosition();

    const [cx, cy] = getXY(e);
    const rect = win.getBoundingClientRect();
    offX = cx - rect.left;
    offY = cy - rect.top;

    dragging = true;
    win.classList.add('dragging');
    handle.classList.add('dragging');
    focusWindow(win);

    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const [cx, cy] = getXY(e);

    let left = cx - offX;
    let top  = cy - offY;

    // Keep at least 100px of title bar visible on every edge
    const minVisible = 100;
    left = Math.max(-(win.offsetWidth - minVisible), Math.min(window.innerWidth - minVisible, left));
    top  = Math.max(0, Math.min(window.innerHeight - 50, top));

    win.style.left = left + 'px';
    win.style.top  = top  + 'px';

    if (e.cancelable) e.preventDefault();
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    win.classList.remove('dragging');
    handle.classList.remove('dragging');
  }

  handle.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);

  handle.addEventListener('touchstart', onDown, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend',  onUp);
}

// Apply to every window
document.querySelectorAll('.window').forEach(w => {
  const titleBar = w.querySelector('.title-bar');
  if (titleBar) makeDraggable(w, titleBar);
});

// ─── Music player ───
// Playback is handled by the embedded Spotify iframe (real playlist,
// real progress bar / skip / track list). The EQ strip above it is a
// decorative spectrum analyzer with classic Winamp peak-hold caps.
(function buildVisualizer() {
  const viz = document.getElementById('musicViz');
  if (!viz) return;

  const BARS = 24;
  const cols = [];
  const peaks = new Array(BARS).fill(0);

  for (let i = 0; i < BARS; i++) {
    const col = document.createElement('div');
    col.className = 'viz-col';
    const bar = document.createElement('span');
    bar.className = 'viz-bar';
    const cap = document.createElement('span');
    cap.className = 'viz-cap';
    col.appendChild(bar);
    col.appendChild(cap);
    viz.appendChild(col);
    cols.push({ bar, cap });
  }

  setInterval(() => {
    for (let i = 0; i < BARS; i++) {
      const x = i / (BARS - 1);
      // bell curve — mid frequencies more energetic than the edges
      const weight = 0.30 + 0.70 * Math.sin(Math.PI * x);
      // multiplying two randoms biases toward low values (occasional peaks)
      let h = Math.random() * Math.random() * weight;
      h = Math.max(0.06, Math.min(1, h));
      cols[i].bar.style.height = (h * 100) + '%';

      // peak-hold cap: jump up instantly, fall slowly
      if (h >= peaks[i]) peaks[i] = h;
      else peaks[i] = Math.max(h, peaks[i] - 0.05);
      cols[i].cap.style.bottom = (peaks[i] * 100) + '%';
    }
  }, 105);
})();

// Cache-bust the Spotify embed so playlist edits show up without the
// browser serving a stale cached copy of the iframe.
(function refreshSpotify() {
  const f = document.querySelector('.spotify-embed');
  if (!f) return;
  const base = f.getAttribute('src').split('&cb=')[0];
  f.setAttribute('src', base + '&cb=' + Date.now());
})();

// ─── Mobile: Pocket-PC home screen + fullscreen app launcher ───
(function phoneShell() {
  const apps = {
    about:      { win: 'mainWindow',  section: 'about',      name: 'About.txt' },
    experience: { win: 'mainWindow',  section: 'experience', name: 'Resume.doc' },
    projects:   { win: 'mainWindow',  section: 'projects',   name: 'Projects' },
    skills:     { win: 'mainWindow',  section: 'skills',     name: 'Skills.ini' },
    contact:    { win: 'mainWindow',  section: 'contact',    name: 'Contact.txt' },
    music:      { win: 'musicWindow', name: 'Winamp' },
  };

  function openApp(id) {
    const cfg = apps[id];
    if (!cfg) return;
    document.querySelectorAll('.app-active').forEach(w => w.classList.remove('app-active'));
    if (cfg.section && typeof showSection === 'function') showSection(cfg.section);
    const win = document.getElementById(cfg.win);
    if (win) win.classList.add('app-active');
    document.body.classList.add('phone-app-open');
    const toast = document.getElementById('phoneToast');
    if (toast) toast.classList.add('dismissed');
    const nm = document.getElementById('phAppName');
    if (nm) nm.textContent = cfg.name;
    const scroller = win && win.querySelector('.content-pane, .notepad-body');
    if (scroller) scroller.scrollTop = 0;
  }

  function goHome() {
    document.body.classList.remove('phone-app-open');
    document.querySelectorAll('.app-active').forEach(w => w.classList.remove('app-active'));
  }

  document.querySelectorAll('.ph-app[data-app]').forEach(b => {
    b.addEventListener('click', () => openApp(b.dataset.app));
  });
  const home = document.getElementById('phHome');
  if (home) home.addEventListener('click', goHome);

  // welcome notification auto-dismisses after a few seconds (slide-out, then hide)
  const toastEl = document.getElementById('phoneToast');
  if (toastEl) {
    setTimeout(() => {
      toastEl.classList.add('out');
      setTimeout(() => toastEl.classList.add('dismissed'), 420);
    }, 5500);
  }

  // status-bar clock
  function tick() {
    const el = document.getElementById('phClock');
    if (!el) return;
    const d = new Date();
    let h = d.getHours(); const m = d.getMinutes();
    const ap = h >= 12 ? 'p' : 'a';
    h = h % 12 || 12;
    el.textContent = `${h}:${String(m).padStart(2, '0')}${ap}`;
  }
  tick();
  setInterval(tick, 15000);
})();

// ─── Boot ───
window.addEventListener('DOMContentLoaded', () => {
  showSection('about');
  focusWindow($('mainWindow'));
});
