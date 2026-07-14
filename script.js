document.addEventListener("DOMContentLoaded", () => {
  // 1. Intersection Observer for scroll animations
  const revealElements = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));

  // 2. Countdown Timer
  const weddingDate = new Date('2026-08-20T17:00:00+01:00').getTime();
  
  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minsEl = document.getElementById('countdown-minutes');
  const secsEl = document.getElementById('countdown-seconds');

  function calculateCountdown() {
    const distance = Math.max(weddingDate - Date.now(), 0);
    return {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  }

  function updateCountdown() {
    const time = calculateCountdown();
    if (daysEl) daysEl.innerText = String(time.days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(time.hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(time.minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(time.seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. Web Audio API Music
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const musicIconContainer = document.getElementById('music-icon-container');
  const musicText = document.getElementById('music-text');
  
  let audioContext = null;
  let musicPlaying = false;
  let musicTimer = null;

  const playNote = (context, frequency, delay) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + delay;

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.035, start + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 2.8);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 3);
  };

  const playMusicPhrase = (context) => {
    const phrase = [523.25, 659.25, 783.99, 659.25];
    phrase.forEach((frequency, index) => {
      playNote(context, frequency, index * 1.45);
    });
  };

  musicToggleBtn.addEventListener('click', async () => {
    if (musicPlaying) {
      if (musicTimer) clearInterval(musicTimer);
      musicTimer = null;
      if (audioContext) await audioContext.suspend();
      musicPlaying = false;
      
      musicToggleBtn.classList.remove('is-playing');
      musicText.innerText = 'تشغيل الموسيقى';
      musicIconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/></svg>';
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audioContext) audioContext = new AudioContextClass();
    
    await audioContext.resume();
    playMusicPhrase(audioContext);
    musicTimer = setInterval(() => playMusicPhrase(audioContext), 6200);
    musicPlaying = true;
    
    musicToggleBtn.classList.add('is-playing');
    musicText.innerText = 'الموسيقى تعمل';
    musicIconContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/></svg>';
  });
});
