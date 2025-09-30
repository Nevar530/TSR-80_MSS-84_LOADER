/* ========= 0) App URLs ========= */
const REMOTE = {
  trs80:    "https://nevar530.github.io/TRS80/",
  skirmish: "https://nevar530.github.io/Battletech-Mobile-Skirmish/"
};

/* ========= 1) DOM refs ========= */
const menu        = document.getElementById('menu');
const hamburger   = document.getElementById('hamburger');

/* Boot overlay refs */
const boot        = document.getElementById('boot');
const bootLog     = document.getElementById('boot-log');
const bootBar     = document.getElementById('boot-bar');
const bootHint    = document.getElementById('boot-hint');
const bootSkip    = document.getElementById('boot-skip');

const home        = document.getElementById('home');
const logoCards   = document.getElementById('logo-cards');

const viewer      = document.getElementById('viewer');
const frame       = document.getElementById('frame');
const frameTitle  = document.getElementById('frame-title');
const openNew     = document.getElementById('open-new');
const btnClose    = document.getElementById('btn-close');

/* HUD LEDs */
const hudNet = document.getElementById('hud-net');
const hudErr = document.getElementById('hud-err');

/* ========= 2) Menu wiring ========= */
function openMenu(){ menu.classList.add('open'); }
function closeMenu(){ menu.classList.remove('open'); }
hamburger?.addEventListener('click', ()=> menu.classList.toggle('open'));

menu?.addEventListener('click', (e)=>{
  const a = e.target.closest('a');
  if (!a) return;
  if (a.dataset.open) openApp(a.dataset.open);
  if (a.dataset.action === 'close') closeApp();
  closeMenu();
});

btnClose?.addEventListener('click', ()=> closeApp());

/* ========= 3) View switches ========= */
function showBoot(){ boot.hidden=false; home.hidden=true; viewer.hidden=true; }
function showHome(){
  boot.hidden=true; viewer.hidden=true; home.hidden=false;
  renderHomeOnce(); window.scrollTo(0,0);
}
function showViewer(){ boot.hidden=true; home.hidden=true; viewer.hidden=false; }

/* ========= 4) App open/close ========= */
function openApp(slug){
  const url   = REMOTE[slug];
  const title = slug === 'trs80' ? 'TRS:80' : 'MSS:84';
  if (!url) return;

  showViewer();
  frameTitle.textContent = `${title} • loading…`;
  openNew.href = url;

  netBlink(true); errNone();

  frame.src = url;
  frame.onload = ()=>{
    frameTitle.textContent = title;
    netBlink(false); netOn();
  };
}
function closeApp(){
  frame.src = 'about:blank';
  viewer.hidden = true;
  netOff(); errNone();
}

/* ========= 5) HUD LED helpers ========= */
let netTimer;
function netOn(){ [hudNet].filter(Boolean).forEach(el=>el.classList.add('on')); }
function netOff(){ [hudNet].filter(Boolean).forEach(el=>el.classList.remove('on')); }
function netBlink(start){
  clearInterval(netTimer);
  if (!start) { netOn(); return; }
  [hudNet].filter(Boolean).forEach(el=>el.classList.add('on'));
  netTimer = setInterval(()=> [hudNet].filter(Boolean).forEach(el=>el.classList.toggle('on')), 220);
}
function errNone(){ [hudErr].filter(Boolean).forEach(el=>el.classList.remove('on','warn')); }
function errWarn(){ [hudErr].filter(Boolean).forEach(el=>{ el.classList.remove('on'); el.classList.add('warn'); }); }
function errOn(){   [hudErr].filter(Boolean).forEach(el=>{ el.classList.remove('warn'); el.classList.add('on'); }); }

/* ========= 6) Clean Boot (no ASCII) ========= */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Optional speed: window.bootSpeed = 'fast'|'standard'|'cinematic'
const speed = (window.bootSpeed || 'standard');
const pace  = speed === 'fast' ? [60,120] : speed === 'cinematic' ? [180,320] : [120,220];

const BOOT_LINES = [
  '[PWR]  Loader Kernel • Bootstrap OK',
  '[FS]   App Catalog • found TRS:80, MSS:84',
  '[NET]  Network • online (cache warm)',
  '[RES]  Fonts & Theme • applied',
  '[UI ]  Topbar & Menu • ready',
  '[ROUT] Navigation • route guards set',
  '[IFR]  Viewer Frame • sandbox stable',
  '[HUD]  Status LEDs • bound',
  '[MEM]  Local State • present',
  '[SYS]  All systems nominal • commit → UI'
];

function setBootProgress(p){ if (bootBar) bootBar.style.width = Math.max(0, Math.min(100, p)) + '%'; }
function appendBootLine(line){
  if (!bootLog) return;
  bootLog.textContent += line + '\n';
  bootLog.scrollTop = bootLog.scrollHeight;
}

function enableBootDismiss(){
  const onKey = (e)=>{
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cleanup();
      hideBoot();
    }
  };
  const onClick = ()=>{ cleanup(); hideBoot(); };
  function cleanup(){
    window.removeEventListener('keydown', onKey);
    boot.removeEventListener('click', onClick);
  }
  window.addEventListener('keydown', onKey, { passive:false });
  boot.addEventListener('click', onClick, { once:true });
}

function hideBoot(){
  if (!boot) return;
  // remember skip
  if (bootSkip?.checked) localStorage.setItem('btSuiteSkipBoot','1');

  boot.classList.add('boot--hidden');
  const onEnd = ()=>{
    boot.removeEventListener('transitionend', onEnd);
    boot.hidden = true; // fully remove from flow after fade
    showHome();
  };
  boot.addEventListener('transitionend', onEnd, { once:true });
  // Fallback timeout
  setTimeout(onEnd, 700);
}

function startBoot(){
  // Skip logic
  if (localStorage.getItem('btSuiteSkipBoot') === '1'){
    showHome();
    return;
  }

  // Reset UI
  showBoot();
  if (bootLog) bootLog.textContent = '';
  if (bootBar) bootBar.style.width = '0%';
  if (bootHint) bootHint.textContent = 'PRESS ENTER TO CONTINUE ▌ • AUTO WHEN READY';
  if (bootSkip) bootSkip.checked = false;

  if (prefersReduced){
    // Instant print for accessibility
    BOOT_LINES.forEach(appendBootLine);
    setBootProgress(100);
    setTimeout(hideBoot, 600);
    return;
  }

  // Teletype sequence
  let i = 0;
  (function next(){
    if (i < BOOT_LINES.length){
      appendBootLine(BOOT_LINES[i]);
      setBootProgress(Math.round(((i+1) / (BOOT_LINES.length + 2)) * 100));
      i++;
      const longBeat = (i === 3 || i === 6) ? 260 : 0;
      setTimeout(next, (Math.floor(pace[0] + Math.random()*(pace[1]-pace[0]))) + longBeat);
    } else {
      setTimeout(()=> setBootProgress(100), 180);
      if (bootHint) bootHint.textContent = 'PRESS ENTER TO CONTINUE ▌ • OR WAIT';
      enableBootDismiss();
      setTimeout(hideBoot, 650);
    }
  })();
}

/* ========= 7) Home: logos ========= */
const LOGOS = [
  { slug:'trs80', alt:'TRS:80 Logo',
    src:'https://raw.githubusercontent.com/Nevar530/Battletech-Mobile-Skirmish/main/images/TRS80LOGO.png' },
  { slug:'skirmish', alt:'Mobile Skirmish Logo',
    src:'https://raw.githubusercontent.com/Nevar530/Battletech-Mobile-Skirmish/main/images/MSS84LOGO.png' }
];

let homeRendered = false;
function renderHomeOnce(){
  if (homeRendered) return;
  homeRendered = true;
  logoCards.innerHTML = LOGOS.map(l=>`
    <a class="logo-card" data-open="${l.slug}" role="button" aria-label="Open ${l.alt}">
      <img src="${l.src}" alt="${l.alt}">
    </a>`).join('');
  logoCards.addEventListener('click', (e)=>{
    const a=e.target.closest('[data-open]');
    if (!a) return;
    openApp(a.dataset.open);
  });
}

/* ========= 8) Init ========= */
const params = new URLSearchParams(location.search);
const openSlug = params.get('open');

if (openSlug && REMOTE[openSlug]){
  // Bypass boot if deep-linked to app
  showHome(); renderHomeOnce(); openApp(openSlug);
} else {
  startBoot();
}
