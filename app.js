/* ===================== Society of Jesus — shared app logic ===================== */
const ADMIN_KEY = "7kX801OPmsIk7256Kmw";
const DB_KEY = "sj_db_v1";
const SESSION_KEY = "sj_current_user";

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function defaultDB(){
  return {
    users: {},
    news: [],
    exams: [],
    polls: [],
    dioceses: [],
    books: [],
    socialLinks: [],
    information: "The Society of Jesus (the Jesuits) is a religious order of the Catholic Church founded by Saint Ignatius of Loyola in 1540. Members are called to find God in all things and to serve through education, faith formation, and mission. Edit this text from the admin panel.",
    roomsLink: ""
  };
}

function loadDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(!raw) { const d = defaultDB(); saveDB(d); return d; }
    const parsed = JSON.parse(raw);
    // backfill any missing keys from default (future-proofing)
    const d = Object.assign(defaultDB(), parsed);
    return d;
  }catch(e){
    console.error("DB load error", e);
    return defaultDB();
  }
}

function saveDB(db){
  try{
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return true;
  }catch(e){
    console.error("DB save error", e);
    alert("Storage is full — try removing an image or two before adding more.");
    return false;
  }
}

function getCurrentUser(){
  return localStorage.getItem(SESSION_KEY) || "";
}
function setCurrentUser(name){
  localStorage.setItem(SESSION_KEY, name);
}
function isAdmin(){
  return getCurrentUser() === ADMIN_KEY;
}
function requireAuth(){
  const u = getCurrentUser();
  if(!u){ window.location.href = "index.html"; return null; }
  return u;
}
function requireAdmin(){
  const u = requireAuth();
  if(u === null) return null;
  if(u !== ADMIN_KEY){ window.location.href = "main.html"; return null; }
  return u;
}

function fmtDate(ts){
  if(!ts) return "";
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
}
function daysFromNow(n){
  const d = new Date();
  d.setDate(d.getDate() + Number(n));
  return d.getTime();
}
function isExpired(ts){
  return ts && Date.now() > Number(ts);
}
function escapeHTML(str){
  const div = document.createElement('div');
  div.textContent = str ?? "";
  return div.innerHTML;
}

/* file -> dataURL helper for admin image uploads */
function fileToDataURL(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* renders the shared site footer */
function renderFooter(){
  const f = document.createElement('footer');
  f.className = "site-footer";
  f.innerHTML = `<span class="script">Ad Majorem Dei Gloriam</span><br>Society of Jesus`;
  document.body.appendChild(f);
}

/* simple modal helper */
function openModal(innerHTML){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal"><span class="close-x">&times;</span>${innerHTML}</div>`;
  bg.addEventListener('click', (e) => { if(e.target === bg) bg.remove(); });
  bg.querySelector('.close-x').addEventListener('click', () => bg.remove());
  document.body.appendChild(bg);
  return bg;
}
