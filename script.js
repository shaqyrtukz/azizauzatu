// ---------- Build the September 2026 calendar, ring day 05 ----------
(function calendar() {
  const box = document.getElementById('calendar-days');
  if (!box) return;
  const EVENT_DAY = 5;
  // Mon-first grid. Sep 1, 2026 is a Tuesday → one empty cell before the 1st.
  const firstWeekdayMon = (new Date(2026, 8, 1).getDay() + 6) % 7; // 1 (Tue)
  const daysInMonth = 30;
  let html = '';
  for (let i = 0; i < firstWeekdayMon; i++) html += '<span></span>';
  for (let d = 1; d <= daysInMonth; d++) {
    html += `<span class="${d === EVENT_DAY ? 'is-day' : ''}">${d < 10 ? '0' + d : d}</span>`;
  }
  box.innerHTML = html;
})();

// ---------- Countdown to the toi (Astana, UTC+5) ----------
(function countdown() {
  const target = new Date('2026-09-05T15:00:00+05:00').getTime();
  const els = {
    days: document.getElementById('t-days'),
    hours: document.getElementById('t-hours'),
    min: document.getElementById('t-min'),
    sec: document.getElementById('t-sec'),
  };
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { Object.values(els).forEach((e) => e.textContent = '00'); return; }
    els.days.textContent  = pad(Math.floor(diff / 86400000));
    els.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    els.min.textContent   = pad(Math.floor((diff % 3600000) / 60000));
    els.sec.textContent   = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

// ---------- Fade-in blocks on scroll ----------
(function scrollReveal() {
  const blocks = document.querySelectorAll('.block[data-anim]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  blocks.forEach((b) => io.observe(b));
})();

// ---------- Scroll-down button ----------
(function scrollButton() {
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = document.querySelector(btn.getAttribute('data-scroll'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// ---------- Music toggle ----------
(function music() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  const note = btn.querySelector('.icon-note');
  const pause = btn.querySelector('.icon-pause');
  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      btn.classList.add('playing');
      note.style.display = 'none'; pause.style.display = '';
    } else {
      audio.pause();
      btn.classList.remove('playing');
      note.style.display = ''; pause.style.display = 'none';
    }
  });
})();

// ---------- RSVP → Google Sheets (Apps Script Web App) ----------
(function rsvp() {
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxkt_VtglZi3mdjNTstJbfmAAm4CfPSj4NPBJSKoMvqj62zUjtJWNneK0D5Mcf_4smf/exec';
  const form = document.getElementById('rsvp-form');
  const thanks = document.getElementById('rsvp-thanks');
  const submitBtn = form.querySelector('.btn-submit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const entry = {
      name: data.get('name') || '',
      status: data.get('status') || '',
      guests: data.get('guests') || '',
      submittedAt: new Date().toISOString(),
    };
    // Local backup in case the network request fails.
    try {
      const stored = JSON.parse(localStorage.getItem('rsvp_aziza') || '[]');
      stored.push(entry);
      localStorage.setItem('rsvp_aziza', JSON.stringify(stored));
    } catch (err) { /* ignore */ }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Жіберілуде...';

    // no-cors: Apps Script accepts the POST but the response is opaque,
    // so we show the thank-you optimistically.
    fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(entry) })
      .finally(() => { form.hidden = true; thanks.hidden = false; });
  });
})();
