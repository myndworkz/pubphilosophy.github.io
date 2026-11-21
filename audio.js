// --- UNIVERSAL WEB AUDIO SOUND ENGINE ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 1. "Boing" on sphere tap / node interaction
function playBoing() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(170, now + 0.32);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  } catch (_) {}
}

// 2. "Woop" on navigation links / opening modals
function playWoop() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.16);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  } catch (_) {}
}

// 3. "Swish" on opening accordions / clusters
function playSwish() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const bufferSize = audioCtx.sampleRate * 0.16;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.12);
    filter.Q.value = 1.6;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start(now);
  } catch (_) {}
}

// Wire links universally
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { playWoop(); });
  });
});
