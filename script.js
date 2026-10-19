// 1. Add gold corner ornaments to every framed box
document.querySelectorAll(".blush, .ivory").forEach(sec => {
  ["p1", "p2", "p3", "p4"].forEach(p => sec.insertAdjacentHTML("afterbegin", `<svg class="paisley ${p}"><use href="#paisley"/></svg>`));
});
document.querySelectorAll(".blush, .ivory, .dark").forEach(sec => {
  sec.insertAdjacentHTML("afterbegin", '<svg class="spin edge-mandala em-l"><use href="#mandala"/></svg><svg class="spin edge-mandala em-r"><use href="#mandala"/></svg>');
});
document.querySelectorAll(".frame").forEach(box => {
  ["tl", "tr", "bl", "br"].forEach(pos => {
    box.insertAdjacentHTML("beforeend", `<svg class="c ${pos}"><use href="#corner"/></svg>`);
  });
});

// 2. Falling petals
const petals = document.getElementById("petals");
const colors = ["#f2c14e", "#f7dd9b", "#ffffff", "#d9b68f"];
for (let i = 0; i < 22; i++) {
  const p = document.createElement("span");
  const size = 8 + Math.random() * 10;
  p.className = "petal";
  p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;background:${colors[i % 4]};` +
    `animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 15}s;--dx:${Math.random() * 160 - 80}px`;
  petals.appendChild(p);
}

// 3. Tap the seal -> doors open on Ganesh ji's blessing -> tap "Enter" -> the invitation begins
const cover = document.getElementById("cover");
const bless = document.getElementById("bless");
const ring = document.getElementById("ring");
const AC = window.AudioContext || window.webkitAudioContext;
const actx = new AC();
const gain = actx.createGain();
gain.gain.value = 0.7;
gain.connect(actx.destination);
let buf1, buf2;
Promise.all(["audio1.m4a", "audio2.mp3"].map(n => fetch(n).then(r => r.arrayBuffer()).then(d => actx.decodeAudioData(d))))
  .then(b => { buf1 = b[0]; buf2 = b[1]; }).catch(() => {});
function playMusic() {
  actx.resume();
  if (!buf1 || !buf2) {
    const a = new Audio("audio1.m4a"), b = new Audio("audio2.mp3");
    b.loop = true; a.volume = b.volume = 0.7;
    a.addEventListener("ended", () => b.play().catch(() => {}));
    a.play().catch(() => {});
    return;
  }
  const t = actx.currentTime + 0.05;
  const s1 = actx.createBufferSource(); s1.buffer = buf1; s1.connect(gain); s1.start(t);
  const s2 = actx.createBufferSource(); s2.buffer = buf2; s2.loop = true; s2.connect(gain); s2.start(t + buf1.duration);
}
document.getElementById("seal").addEventListener("click", () => {
  playMusic();                       // music starts the moment the seal is tapped
  cover.classList.add("open");
  bless.classList.add("show");
  setTimeout(() => cover.remove(), 1700);
});
document.getElementById("enter").addEventListener("click", () => {
  bless.classList.add("leave");                      // iris closes over the blessing
  ring.classList.add("go");                          // gold ring follows its edge
  petals.classList.add("off");                       // stop the falling petals
  window.scrollTo(0, 0);
  document.body.classList.remove("locked");          // hero animations start here
  setTimeout(() => { bless.remove(); ring.remove(); petals.remove(); }, 1800);
});

// 4. Countdown: change this to your wedding date and time
const weddingDate = new Date("2027-02-11T09:00:00").getTime();
function tick() {
  const diff = Math.max(0, weddingDate - Date.now());
  document.getElementById("days").textContent = Math.floor(diff / 86400000);
  document.getElementById("hours").textContent = Math.floor((diff / 3600000) % 24);
  document.getElementById("minutes").textContent = Math.floor((diff / 60000) % 60);
  document.getElementById("seconds").textContent = Math.floor((diff / 1000) % 60);
}
tick();
setInterval(tick, 1000);

// 6. Maps: each event card has data-place="..." (the map, directions and calendar location come from it)
document.querySelectorAll(".ecard").forEach(card => {
  const place = card.dataset.place;
  const col = card.closest(".ecol");
  col.querySelector("iframe").src = "https://maps.google.com/maps?q=" + encodeURIComponent(place) + "&output=embed";
  col.querySelector(".dir").href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(place);
  const cal = card.querySelector(".cal");
  const url = new URL(cal.href);
  url.searchParams.set("location", place);
  cal.href = url.toString();
});

// 7. Hero decoration: twinkling sparkles + floating glitter bubbles
const hero = document.querySelector(".hero");
const sparkleColors = ["#d9a24f", "#e8c46a", "#bf9a4a", "#ffffff"];
for (let i = 0; i < 36; i++) {
  const s = document.createElement("span");
  s.className = "sparkle";
  s.style.cssText = `left:${Math.random() * 100}%;top:${6 + Math.random() * 92}%;--s:${10 + Math.random() * 16}px;` +
    `--d:${2.5 + Math.random() * 3.5}s;--dl:${-Math.random() * 6}s;color:${sparkleColors[i % 4]}`;
  hero.appendChild(s);
}
for (let i = 0; i < 16; i++) {
  const b = document.createElement("span");
  const size = 14 + Math.random() * 40;
  b.className = "bokeh";
  b.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size}px;--dx:${Math.random() * 120 - 60}px;` +
    `animation-duration:${14 + Math.random() * 14}s;animation-delay:${-Math.random() * 20}s`;
  hero.appendChild(b);
}
const setRise = () => hero.style.setProperty("--h", hero.offsetHeight + "px");
setRise();
addEventListener("resize", setRise);
addEventListener("load", setRise);

// 8. Hero blossoms: soft pink flowers drifting along both edges
const mobile = innerWidth < 640;
for (let i = 0; i < (mobile ? 16 : 26); i++) {
  const size = (mobile ? 28 : 40) + Math.random() * (mobile ? 36 : 60);
  const edge = Math.random() * (mobile ? 12 : 22);
  const side = i % 2 ? "left" : "right";
  hero.insertAdjacentHTML("beforeend",
    `<svg class="blossom" width="${size}" height="${size}" style="${side}:${edge}%;top:${4 + Math.random() * 92}%;` +
    `--r:${Math.random() * 360}deg;--d:${5 + Math.random() * 6}s;--dl:${-Math.random() * 8}s"><use href="#blossom"/></svg>`);
}