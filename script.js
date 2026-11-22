// 1. Add gold corner ornaments to every framed box
document.querySelectorAll(".blush, .ivory").forEach(sec => {
  ["p1", "p2", "p3", "p4"].forEach(p => sec.insertAdjacentHTML("afterbegin", `<svg class="paisley ${p}"><use href="#paisley"/></svg>`));
});
document.querySelectorAll(".blush, .ivory, .dark, .foot").forEach(sec => {
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
let bgm = document.getElementById("bgm");
if (!bgm) {                                   // safety: create the player if the HTML tag is missing
  bgm = document.createElement("audio");
  bgm.src = "music.mp3";
  bgm.preload = "auto";
  bgm.setAttribute("playsinline", "");
  document.body.appendChild(bgm);
}
bgm.loop = true;

function playMusic() {
  try { bgm.play().catch(e => console.log("Play blocked:", e.name)); } catch (e) { console.log(e); }
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
  const dl = card.querySelector(".dirlink");
  if (dl) dl.href = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(place);
  const cal = card.querySelector(".cal:not(.dirlink)");
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


// 9. RSVP: footer QR code -> opens the RSVP form
// ---- SETTINGS (edit these) -------------------------------------------------
const RSVP_URL = "";        // optional: link the QR should open. Leave "" to use this site's own address + #rsvp
const RSVP_WHATSAPP = "";   // optional: WhatsApp number with country code, e.g. "919876543210". "" lets the guest pick the chat
const RSVP_ENDPOINT = "";   // optional: Google Apps Script / Formspree URL to collect replies. If set, replies go there instead of WhatsApp
// -----------------------------------------------------------------------------
const rsvpTarget = RSVP_URL || (location.origin + location.pathname + "#rsvp");
const qrBox = document.getElementById("qr");
try {
  const qr = qrcode(0, "M");
  qr.addData(rsvpTarget);
  qr.make();
  const n = qr.getModuleCount(), q = 2;
  let d = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + q} ${r + q}h1v1h-1z`;
  qrBox.innerHTML = `<svg viewBox="0 0 ${n + q * 2} ${n + q * 2}" shape-rendering="crispEdges"><path d="${d}" fill="#1d4a37"/></svg>`;
} catch (e) {
  qrBox.innerHTML = '<span class="qr-fallback">Tap to RSVP</span>';
}

const rsvpModal = document.getElementById("rsvpModal");
const rsvpForm = document.getElementById("rsvpForm");
const rsvpThanks = document.getElementById("rsvpThanks");
const rsvpErr = document.getElementById("rsvpErr");
function openRsvp() {
  rsvpModal.hidden = false;
  document.body.classList.add("rsvp-open");
  rsvpModal.scrollTop = 0;
}
function closeRsvp() {
  rsvpModal.hidden = true;
  document.body.classList.remove("rsvp-open");
  if (location.hash === "#rsvp") history.replaceState(null, "", location.pathname + location.search);
}
document.getElementById("qrBtn").addEventListener("click", openRsvp);
document.getElementById("rsvpClose").addEventListener("click", closeRsvp);
rsvpModal.addEventListener("click", e => { if (e.target === rsvpModal) closeRsvp(); });
addEventListener("keydown", e => { if (e.key === "Escape" && !rsvpModal.hidden) closeRsvp(); });
rsvpForm.addEventListener("change", () => {
  document.getElementById("guestsRow").style.display = rsvpForm.attend.value === "Joyfully accepts" ? "" : "none";
});
rsvpForm.addEventListener("submit", async e => {
  e.preventDefault();
  const f = new FormData(rsvpForm);
  const name = (f.get("name") || "").toString().trim();
  rsvpErr.hidden = !!name;
  if (!name) return;
  const going = f.get("attend") === "Joyfully accepts";
  const msg = (f.get("msg") || "").toString().trim();
  const text = `RSVP - Satarupa & Rohan's wedding (11 Feb 2027)\nName: ${name}\nReply: ${f.get("attend")}` +
    (going ? `\nGuests: ${f.get("guests")}` : "") + (msg ? `\nMessage: ${msg}` : "");
  if (RSVP_ENDPOINT) {
    try {
      await fetch(RSVP_ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams({ name, attend: f.get("attend"), guests: going ? f.get("guests") : "0", message: msg }) });
    } catch (err) { console.log(err); }
  } else {
    window.open(`https://wa.me/${RSVP_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }
  rsvpForm.hidden = true;
  rsvpThanks.hidden = false;
});

// Scanned the QR (link ends in #rsvp)? Skip the intro and show the RSVP form straight away
if (location.hash === "#rsvp") {
  [cover, bless, ring, petals].forEach(el => el && el.remove());
  document.body.classList.remove("locked");
  openRsvp();
}
