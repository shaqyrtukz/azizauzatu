// Music autoplay on first interaction
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let playing = false;

function startMusic() {
  audio.play().then(() => {
    playing = true;
    musicBtn.classList.remove('muted');
  }).catch(() => {});
}

document.addEventListener('click', function onFirstClick() {
  startMusic();
  document.removeEventListener('click', onFirstClick);
}, { once: true });

musicBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (playing) {
    audio.pause();
    playing = false;
    musicBtn.classList.add('muted');
  } else {
    startMusic();
  }
});

// Countdown timer — target: 14 August 2026, 17:00 Ekibastuz time (UTC+5)
const target = new Date('2026-08-14T17:00:00+05:00');

function updateTimer() {
  const now = new Date();
  const diff = target - now;

  if (diff <= 0) {
    document.getElementById('timer').innerHTML = '<span style="font-size:24px;letter-spacing:3px;">Той басталды! 🎉</span>';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent    = String(days).padStart(2, '0');
  document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateTimer();
setInterval(updateTimer, 1000);

// RSVP form
document.getElementById('rsvpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('rsvpSuccess').style.display = 'block';
});
