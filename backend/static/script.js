/* Edugenie UI script
   All front-end. Where backend needed we try localhost then fall back to mock responses.
*/

/* ----------------- Utilities ----------------- */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const container = (html) => {
  const div = document.createElement('div'); div.innerHTML = html.trim(); return div.firstElementChild;
};

/* ----------------- Init UI references ----------------- */
const enterBtn = $('#enter-btn');
const openLoginHero = $('#open-login-hero');
const app = $('#app');
const hero = $('#hero');
const modalRoot = $('#modal-root');
const navSections = $('#nav-sections');
const navBtns = () => $$('.nav-btn');
const userWelcome = $('#user-welcome');
const userNameShort = $('#user-name-short');
const logoutBtn = $('#logout');
const userWelcomeText = $('#welcome-sub');
const welcomeDate = $('#welcome-date');

/* Panels */
const panels = {
  dashboard: $('#panel-dashboard'),
  mainCourse: $('#panel-main-course'),
  quiz: $('#panel-quiz'),
  doubt: $('#panel-doubt')
};

/* Profile placeholders */
const profileNameEl = $('#profile-name');
const profileEmailEl = $('#profile-email');
const profilePhoneEl = $('#profile-phone');

/* Course form fields */
const f = {
  stream: $('#field-stream'),
  klass: $('#field-class'),
  branch: $('#field-branch'),
  subject: $('#field-subject'),
  topic: $('#field-topic'),
  subtopic: $('#field-subtopic'),
  lecture: $('#field-lecture'),
  objectives: $('#field-objectives'),
  duration: $('#field-duration'),
  path: $('#field-path'),
  resource: $('#field-resource')
};
const lecturesList = $('#lectures-list');
const saveCourseBtn = $('#save-course-details');
const attachResBtn = $('#attach-resource');
const addLectureBtn = $('#add-lecture');
const exportCourseBtn = $('#export-course');

const askAIText = $('#ask-ai-text');
const askAIResult = $('#ask-ai-result');
const askAISend = $('#ask-ai-send');

/* Quiz area */
const quizArea = $('#quiz-area');

/* Doubt */
const doubtText = $('#doubt-text');
const postDoubtBtn = $('#post-doubt');
const doubtList = $('#doubt-list');

/* Sidebar controls */
const startSetupBtn = $('#start-setup');
const progressTrajectory = $('#trajectory');
const expectedTime = $('#expected-time');
const recentList = $('#recent-list');

/* footer quick links */
$('#quick-help').addEventListener('click', () => openHelp());
$('#quick-contact').addEventListener('click', () => openContact());
$('#quick-ask').addEventListener('click', () => focusAskAI());

/* ----------------- Background Spark Canvas ----------------- */
(function sparkleCanvas(){
  const canvas = document.getElementById('spark-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  window.addEventListener('resize', () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; });

  const sparks = Array.from({length: 160}, () => ({
    x: Math.random()*w, y: Math.random()*h,
    r: Math.random()*2.4 + 0.4,
    vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
    a: Math.random()*Math.PI*2
  }));

  function frame(){
    ctx.clearRect(0,0,w,h);
    for (const s of sparks){
      s.x += s.vx; s.y += s.vy;
      s.x += Math.sin(s.a)*0.1; s.y += Math.cos(s.a)*0.1;
      s.a += 0.002;
      if (s.x<0) s.x = w; if (s.x> w) s.x=0; if (s.y<0) s.y=h; if (s.y>h) s.y=0;
      const g = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*6);
      g.addColorStop(0,'rgba(255,255,255,0.95)');
      g.addColorStop(0.4,'rgba(200,215,255,0.35)');
      g.addColorStop(1,'rgba(200,215,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r*4,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ----------------- Modal Utility ----------------- */
function showModal(html, opts = {}) {
  const back = document.createElement('div');
  back.className = 'modal-backdrop';
  back.innerHTML = `<div class="modal">${html}</div>`;
  if (opts.closeOnBackdrop !== false) back.addEventListener('click', (e) => { if (e.target === back) closeModal(); });
  modalRoot.appendChild(back);
  return back;
}
function closeModal() { modalRoot.innerHTML = ''; }

/* ----------------- Login / Signup ----------------- */
function openLoginModal(prefill = {}) {
  const html = `
    <div class="flex items-start gap-4">
      <div style="flex:1">
        <h3 class="font-orbitron text-xl mb-2">Log in / Sign up</h3>
        <p class="text-sm text-gray-300 mb-4">Enter your details to continue to Edugenie.</p>

        <label class="block mb-2"><span class="text-xs text-gray-400">Full name</span><input id="m-name" class="input" value="${prefill.name||''}" /></label>
        <label class="block mb-2"><span class="text-xs text-gray-400">Email</span><input id="m-email" class="input" value="${prefill.email||''}" /></label>
        <label class="block mb-2"><span class="text-xs text-gray-400">Password</span><input id="m-pass" type="password" class="input" /></label>
        <label class="block mb-2"><span class="text-xs text-gray-400">Phone</span><input id="m-phone" class="input" /></label>

        <div class="mt-4 flex gap-2">
          <button id="m-submit" class="btn-primary">Continue</button>
          <button id="m-cancel" class="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  `;
  const modal = showModal(html);
  $('#m-cancel', modal).addEventListener('click', closeModal);
  $('#m-submit', modal).addEventListener('click', () => {
    const name = $('#m-name', modal).value.trim();
    const email = $('#m-email', modal).value.trim();
    const pass = $('#m-pass', modal).value;
    const phone = $('#m-phone', modal).value.trim();

    if (!name || !email || !pass) return alert('Name, email and password required.');
    // store (simple localStorage)
    const profile = { name, email, phone, created: Date.now() };
    localStorage.setItem('edu_profile', JSON.stringify(profile));
    applyProfile(profile);
    closeModal();
    enterApp();
  });
}

/* ----------------- Apply profile to UI ----------------- */
function applyProfile(profile) {
  profileNameEl.textContent = profile.name || '—';
  profileEmailEl.textContent = profile.email || '—';
  profilePhoneEl.textContent = profile.phone || '—';
  userWelcome.classList.remove('hidden');
  userNameShort.textContent = profile.name.split(' ')[0];
  logoutBtn.classList.remove('hidden');
  $('#user-name-short').textContent = profile.name.split(' ')[0];
}

/* ----------------- Enter App ----------------- */
function enterApp() {
  hero.classList.add('hidden');
  app.classList.remove('hidden');
  navSections.classList.remove('hidden');
  welcomeDate.textContent = new Date().toLocaleString();
  showPanel('dashboard');
}

/* ----------------- Panel Logic ----------------- */
function showPanel(key) {
  // hide all first
  Object.values(panels).forEach(p => p.classList.add('hidden'));
  if (key === 'dashboard') panels.dashboard.classList.remove('hidden');
  if (key === 'main-course') panels.mainCourse.classList.remove('hidden');
  if (key === 'quiz') panels.quiz.classList.remove('hidden');
  if (key === 'doubt') panels.doubt.classList.remove('hidden');

  // update nav highlight
  navBtns().forEach(b => {
    b.classList.toggle('bg-white/3', b.dataset.target === key);
  });
}

/* ----------------- Wire top nav buttons ----------------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-btn');
  if (btn) { e.preventDefault(); showPanel(btn.dataset.target); window.scrollTo({ top: 0, behavior: 'smooth' }); }
});

/* ----------------- Entry / Login handlers ----------------- */
enterBtn.addEventListener('click', () => {
  // if profile exists, enter. else show login
  const p = localStorage.getItem('edu_profile');
  if (p) { applyProfile(JSON.parse(p)); enterApp(); return; }
  openLoginModal();
});
openLoginHero.addEventListener('click', () => openLoginModal());

/* restore profile if present */
const stored = localStorage.getItem('edu_profile');
if (stored) applyProfile(JSON.parse(stored));

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('edu_profile');
  location.reload();
});

/* quick profile edit */
$('#btn-profile-edit').addEventListener('click', () => {
  const p = JSON.parse(localStorage.getItem('edu_profile') || '{}');
  openLoginModal(p);
});
$('#open-profile').addEventListener('click', () => {
  const p = JSON.parse(localStorage.getItem('edu_profile') || '{}');
  openLoginModal(p);
});

/* ----------------- Course Details Save ----------------- */
saveCourseBtn.addEventListener('click', () => {
  const course = {
    stream: f.stream.value.trim(),
    class: f.klass.value,
    branch: f.branch.value.trim(),
    subject: f.subject.value.trim(),
    topic: f.topic.value.trim(),
    subtopic: f.subtopic.value.trim(),
    lecture: f.lecture.value || '1',
    objectives: f.objectives.value.trim(),
    duration: f.duration.value.trim(),
    path: f.path.value.trim(),
    resources: [] // later attached
  };
  localStorage.setItem('edu_course', JSON.stringify(course));
  recentList.innerHTML = `<li>Saved course details for topic: <strong>${course.topic||'—'}</strong></li>`;
  progressTrajectory.textContent = 'Intermediate';
  expectedTime.textContent = course.duration ? `${course.duration} hrs` : '—';
  alert('Course details saved locally.');
  // show course panel
  renderLectures();
});

/* attach resource (reads file input name) */
attachResBtn.addEventListener('click', () => {
  const file = f.resource.files[0];
  if (!file) return alert('Choose a file first.');
  const data = JSON.parse(localStorage.getItem('edu_course') || '{}');
  data.resources = data.resources || [];
  data.resources.push({ name: file.name, type: file.type, size: file.size, added: Date.now() });
  localStorage.setItem('edu_course', JSON.stringify(data));
  alert('Resource attached.');
});

/* add lecture */
addLectureBtn.addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('edu_course') || '{}');
  data.lectures = data.lectures || [];
  const index = (data.lectures.length || 0) + 1;
  const lecture = {
    title: `Lecture ${index}: ${data.topic || 'Untitled'}`,
    number: index,
    media: [],
    tests: [],
    created: Date.now()
  };
  data.lectures.push(lecture);
  localStorage.setItem('edu_course', JSON.stringify(data));
  renderLectures();
});

/* render lectures list */
function renderLectures(){
  const data = JSON.parse(localStorage.getItem('edu_course') || '{}');
  lecturesList.innerHTML = '';
  (data.lectures || []).forEach(l => {
    const el = container(`
      <div class="glass-card p-3 flex items-start justify-between">
        <div>
          <div class="text-sm text-gray-300">#${l.number}</div>
          <div class="font-medium">${l.title}</div>
          <div class="text-xs text-gray-400 mt-1">Created ${new Date(l.created).toLocaleString()}</div>
        </div>
        <div class="flex gap-2">
          <button class="lecture-open btn-outline" data-num="${l.number}">Open</button>
          <button class="lecture-del btn-ghost" data-num="${l.number}">Delete</button>
        </div>
      </div>
    `);
    lecturesList.appendChild(el);
  });

  // attach handlers
  $$('.lecture-open', lecturesList).forEach(b => b.addEventListener('click', (ev) => {
    const n = +b.dataset.num;
    openLecture(n);
  }));
  $$('.lecture-del', lecturesList).forEach(b => b.addEventListener('click', (ev) => {
    const n = +b.dataset.num;
    if (!confirm('Delete lecture?')) return;
    const data = JSON.parse(localStorage.getItem('edu_course') || '{}');
    data.lectures = (data.lectures||[]).filter(x => x.number !== n).map((x,i)=>({...x,number:i+1}));
    localStorage.setItem('edu_course', JSON.stringify(data));
    renderLectures();
  }));
}

/* open lecture detail modal */
function openLecture(number){
  const data = JSON.parse(localStorage.getItem('edu_course') || '{}');
  const lecture = (data.lectures||[]).find(x=>x.number===number);
  if (!lecture) return alert('Lecture not found.');
  const html = `
    <div><h3 class="font-orbitron text-lg mb-2">Lecture ${lecture.number}</h3>
    <label class="block mb-2"><span class="text-xs text-gray-400">Title</span><input id="lec-title" class="input" value="${lecture.title}" /></label>
    <label class="block mb-2"><span class="text-xs text-gray-400">Add media (simulate)</span><input id="lec-media" class="input" placeholder="image.jpg or video.mp4" /></label>
    <div class="mt-3 flex gap-2"><button id="lec-save" class="btn-primary">Save</button><button id="lec-close" class="btn-ghost">Close</button></div>
    </div>
  `;
  const modal = showModal(html);
  $('#lec-close', modal).addEventListener('click', closeModal);
  $('#lec-save', modal).addEventListener('click', () => {
    const t = $('#lec-title', modal).value.trim();
    const m = $('#lec-media', modal).value.trim();
    lecture.title = t || lecture.title;
    if (m) lecture.media.push({ name: m, added: Date.now() });
    // save back
    data.lectures = (data.lectures||[]).map(x => x.number===lecture.number ? lecture : x);
    localStorage.setItem('edu_course', JSON.stringify(data));
    renderLectures();
    closeModal();
  });
}

/* export course as JSON download */
exportCourseBtn.addEventListener('click', () => {
  const data = localStorage.getItem('edu_course') || '{}';
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'course.json'; a.click();
  URL.revokeObjectURL(url);
});

/* ----------------- Quiz basic sample ----------------- */
$('#create-quiz').addEventListener('click', () => {
  showModal(`
    <h3 class="font-orbitron text-lg mb-2">Create Quiz</h3>
    <label class="block mb-2"><span class="text-xs text-gray-400">Quiz Title</span><input id="q-title" class="input" /></label>
    <label class="block mb-2"><span class="text-xs text-gray-400">Enter one MCQ (format: Question|opt1|opt2|opt3|answerIndex)</span><input id="q-item" class="input" /></label>
    <div class="mt-3 flex gap-2"><button id="q-save" class="btn-primary">Save</button><button id="q-cancel" class="btn-ghost">Cancel</button></div>
  `);
  const modal = modalRoot.lastElementChild;
  $('#q-cancel', modal).addEventListener('click', closeModal);
  $('#q-save', modal).addEventListener('click', () => {
    const title = $('#q-title', modal).value.trim() || 'Sample Quiz';
    const item = $('#q-item', modal).value.trim();
    const questions = [];
    if (item) {
      const parts = item.split('|').map(p=>p.trim());
      if (parts.length >= 5) {
        const q = { question: parts[0], options: parts.slice(1,4), answer: +parts[4] };
        questions.push(q);
      }
    }
    // store quiz
    localStorage.setItem('edu_quiz', JSON.stringify({ title, questions }));
    alert('Quiz saved locally.');
    closeModal();
    showPanel('quiz');
    renderQuiz();
  });
});

/* render quiz */
function renderQuiz(){
  const q = JSON.parse(localStorage.getItem('edu_quiz') || '{}');
  quizArea.innerHTML = '';
  if (!q.questions || q.questions.length === 0) {
    quizArea.innerHTML = `<div class="text-gray-400">No quiz present. Create one.</div>`;
    return;
  }
  const html = document.createElement('div');
  html.innerHTML = `<h4 class="font-orbitron text-lg">${q.title}</h4>`;
  q.questions.forEach((qq, idx) => {
    const node = container(`<div class="glass-card p-3 mt-3">
      <div class="font-medium">Q${idx+1}. ${qq.question}</div>
      <div class="mt-2 flex flex-col gap-2"></div>
    </div>`);
    qq.options.forEach((opt, oi) => {
      const btn = document.createElement('button');
      btn.className = 'side-link';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        if (oi === qq.answer) {
          alert('Correct');
        } else alert('Incorrect');
      });
      node.querySelector('div.mt-2').appendChild(btn);
    });
    html.appendChild(node);
  });
  quizArea.appendChild(html);
}

/* take sample quiz */
$('#take-quiz').addEventListener('click', () => {
  const q = JSON.parse(localStorage.getItem('edu_quiz') || '{}');
  if (!q.questions || q.questions.length === 0) return alert('No quiz available.');
  renderQuiz();
  showPanel('quiz');
});

/* ----------------- Doubt handling ----------------- */
postDoubtBtn.addEventListener('click', () => {
  const txt = doubtText.value.trim();
  if (!txt) return alert('Write a doubt first.');
  const doubts = JSON.parse(localStorage.getItem('edu_doubts') || '[]');
  doubts.unshift({ id: Date.now(), text: txt, replies: [], status: 'open' });
  localStorage.setItem('edu_doubts', JSON.stringify(doubts));
  renderDoubts();
  doubtText.value = '';
});

function renderDoubts() {
  const doubts = JSON.parse(localStorage.getItem('edu_doubts') || '[]');
  doubtList.innerHTML = '';
  if (doubts.length === 0) {
    doubtList.innerHTML = `<div class="p-3 glass-card">No doubts yet.</div>`; return;
  }
  doubts.forEach(d => {
    const el = container(`<div class="glass-card p-3">
      <div class="flex justify-between"><div class="font-medium">Doubt</div><div class="text-xs text-gray-400">${d.status}</div></div>
      <div class="mt-2 text-gray-300">${d.text}</div>
      <div class="mt-3 flex gap-2">
        <button class="resolve-btn btn-outline" data-id="${d.id}">Resolve</button>
        <button class="reply-btn btn-primary" data-id="${d.id}">Reply</button>
      </div>
    </div>`);
    doubtList.appendChild(el);
  });

  $$('.resolve-btn', doubtList).forEach(b => b.addEventListener('click', () => {
    const id = +b.dataset.id;
    const doubts = JSON.parse(localStorage.getItem('edu_doubts') || '[]');
    const item = doubts.find(x => x.id === id); if (!item) return;
    item.status = 'resolved';
    localStorage.setItem('edu_doubts', JSON.stringify(doubts));
    renderDoubts();
  }));

  $$('.reply-btn', doubtList).forEach(b => b.addEventListener('click', () => {
    const id = +b.dataset.id;
    const doubts = JSON.parse(localStorage.getItem('edu_doubts') || '[]');
    const item = doubts.find(x => x.id === id); if (!item) return;
    const html = `<h3 class="font-orbitron text-lg mb-2">Reply to Doubt</h3>
      <div class="mb-2 text-gray-300">${item.text}</div>
      <textarea id="reply-txt" class="input h-24"></textarea>
      <div class="mt-3 flex gap-2"><button id="reply-send" class="btn-primary">Send</button><button id="reply-cancel" class="btn-ghost">Cancel</button></div>`;
    const modal = showModal(html);
    $('#reply-cancel', modal).addEventListener('click', closeModal);
    $('#reply-send', modal).addEventListener('click', () => {
      const txt = $('#reply-txt', modal).value.trim(); if (!txt) return alert('Write reply.');
      item.replies = item.replies || []; item.replies.push({ text: txt, at: Date.now() });
      localStorage.setItem('edu_doubts', JSON.stringify(doubts));
      closeModal(); renderDoubts();
    });
  }));
}

/* initial render doubts */
renderDoubts();

/* ----------------- Leaderboard (sample) ----------------- */
function renderLeaderboard(){
  // sample static leaderboard for demonstration
  const board = [
    { name: 'Ayesha', score: 980 },
    { name: 'Rohan', score: 940 },
    { name: 'Sam', score: 900 }
  ];
  // show in dashboard recent list
  recentList.innerHTML = `<li class="text-gray-300">Leaderboard top: ${board[0].name} (${board[0].score})</li>`;
}
renderLeaderboard();

/* ----------------- Ask AI (calls backend or mocks) ----------------- */
askAISend.addEventListener('click', async () => {
  const q = askAIText.value.trim();
  if (!q) return alert('Type your question.');
  askAIResult.textContent = 'Thinking...';
  try {
    const res = await fetch('http://localhost:8000/generate', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ topic: q, difficulty: 'auto', formats: ['text'] })
    });
    if (!res.ok) throw new Error('no backend');
    const data = await res.json();
    askAIResult.innerText = data.text || JSON.stringify(data, null, 2);
  } catch (err) {
    // fallback mock AI answer
    askAIResult.innerText = `Mock answer for: "${q}"\n\n1) Key idea: ...\n2) Example: ...\n\n(Connect to backend to enable real AI responses.)`;
  }
});

/* ----------------- Help / Contact ----------------- */
function openHelp(){
  showModal(`<h3 class="font-orbitron text-lg mb-2">Help</h3><p class="text-gray-300">Use the dashboard to create courses. Click "Add Lecture" to build your content. Use Ask AI to request summaries. Contact support below.</p><div class="mt-3 text-right"><button id="h-close" class="btn-primary">Close</button></div>`);
  modalRoot.lastElementChild.querySelector('#h-close').addEventListener('click', closeModal);
}
function openContact(){
  showModal(`<h3 class="font-orbitron text-lg mb-2">Contact Us</h3>
    <p class="text-gray-300">Email: support@edugenie.example</p>
    <p class="text-gray-300">Phone: +91 90000 00000</p>
    <div class="mt-3 text-right"><button id="c-close" class="btn-primary">Close</button></div>`);
  modalRoot.lastElementChild.querySelector('#c-close').addEventListener('click', closeModal);
}
$('#open-help').addEventListener('click', openHelp);
$('#open-contact').addEventListener('click', openContact);

/* focus Ask AI area quickly */
function focusAskAI(){ askAIText.focus(); }
$('#btn-course-setup').addEventListener('click', () => showPanel('main-course'));

/* start setup from dashboard */
startSetupBtn.addEventListener('click', () => {
  showPanel('main-course');
  window.setTimeout(() => {
    // scroll to course section
    document.getElementById('panel-main-course').scrollIntoView({behavior:'smooth'});
  }, 150);
});

/* ensure nav side-links open target */
$$('.side-link').forEach(b => b.addEventListener('click', () => {
  const t = b.dataset.target || b.getAttribute('data-target');
  if (t) showPanel(t);
}));

/* show panel function for side quick links (buttons with data-target) */
$$('[data-target]').forEach(el => el.addEventListener('click', (e) => {
  const t = el.dataset.target;
  if (t) { showPanel(t); }
}));

/* Start state: if profile exists, open app; else remain hero */
if (localStorage.getItem('edu_profile')) {
  // do not auto-enter; let user click Enter for effect
}

/* expose some functions to console for debugging */
window.edu = {
  showPanel, openLoginModal, renderLectures, renderQuiz, renderDoubts
};
