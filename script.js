// ── Music ──────────────────────────────────────────
const audio    = document.getElementById('bgMusic');
const btn      = document.getElementById('musicBtn');
const iconPlay = document.getElementById('iconPlay');
const iconMute = document.getElementById('iconMute');

let playing = false;

function setPlayState(isPlaying) {
  playing = isPlaying;
  iconPlay.style.display = isPlaying ? 'none'  : 'block';
  iconMute.style.display = isPlaying ? 'block' : 'none';
}

function startMusic() {
  audio.volume = 0.5;
  audio.play().then(() => setPlayState(true)).catch(() => {});
}

function toggleMusic() {
  if (playing) { audio.pause(); setPlayState(false); }
  else          { startMusic(); }
}

// Autoplay on first interaction
document.addEventListener('click', function start() {
  startMusic();
  document.removeEventListener('click', start);
}, { once: true });

btn.addEventListener('click', e => { e.stopPropagation(); toggleMusic(); });

// ── Countdown Timer ─────────────────────────────────
const eventDate = new Date('2026-08-14T17:00:00+05:00'); // Kazakhstan time UTC+5

function updateCountdown() {
  const now  = new Date();
  const diff = eventDate - now;
  if (diff <= 0) {
    document.getElementById('cdDays').textContent  = '00';
    document.getElementById('cdHours').textContent = '00';
    document.getElementById('cdMins').textContent  = '00';
    document.getElementById('cdSecs').textContent  = '00';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cdDays').textContent  = String(d).padStart(2,'0');
  document.getElementById('cdHours').textContent = String(h).padStart(2,'0');
  document.getElementById('cdMins').textContent  = String(m).padStart(2,'0');
  document.getElementById('cdSecs').textContent  = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Scroll-reveal animation ─────────────────────────
const revealEls = document.querySelectorAll(
  '.invitation > *, .calendar-section > *, .location-section > *, .rsvp-section > *'
);

revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ── RSVP form ───────────────────────────────────────
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwLj-f0QfSZv46AQi-kPPM120_Ecj57PnKmKFQI-K1fvG5TuJwZs6447AE6KYF6v00lAA/exec';

document.getElementById('rsvpForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form   = e.target;
  const btn    = form.querySelector('.rsvp-btn');
  const name   = form.querySelector('input[type="text"]').value.trim();
  const attEl  = form.querySelector('input[name="att"]:checked');
  const guests = form.querySelector('.rsvp-input-guests').value;

  btn.disabled = true;
  btn.textContent = '...';

  const attLabels = { yes: 'Иә, әрине келемін', spouse: 'Жұбыммен келемін', no: 'Өкінішке орай, келе алмаймын' };
  const params = new URLSearchParams({
    name,
    attendance: attEl ? attLabels[attEl.value] : '',
    guests: guests || '1',
    timestamp: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })
  });

  try {
    await fetch(SHEET_URL + '?' + params.toString(), { method: 'GET', mode: 'no-cors' });
  } catch (_) {}

  form.style.display = 'none';
  const thanks = document.getElementById('rsvpThanks');
  thanks.style.display = 'block';
  thanks.classList.add('visible');
});
