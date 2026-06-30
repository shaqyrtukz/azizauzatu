// ── Music ──────────────────────────────────────────
const audio   = document.getElementById('bgMusic');
const btn     = document.getElementById('musicBtn');
const iconPlay = document.getElementById('iconPlay');
const iconMute = document.getElementById('iconMute');
let playing   = false;

function startMusic() {
  audio.volume = 0.5;
  audio.play().then(() => {
    playing = true;
    iconPlay.style.display = 'none';
    iconMute.style.display = 'block';
  }).catch(() => {});
}

// Autoplay on first interaction
document.addEventListener('click', function start() {
  startMusic();
  document.removeEventListener('click', start);
}, { once: true });

btn.addEventListener('click', e => {
  e.stopPropagation();
  if (playing) {
    audio.pause();
    playing = false;
    iconPlay.style.display = 'block';
    iconMute.style.display = 'none';
  } else {
    startMusic();
  }
});

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
document.getElementById('rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('rsvpForm').style.display = 'none';
  const thanks = document.getElementById('rsvpThanks');
  thanks.style.display = 'block';
  thanks.classList.add('visible');
});
