/* ════════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
    if (cursorDot) { cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px'; }
    requestAnimationFrame(animateCursor);
}
animateCursor();

/* ════════════════════════════════════════════
   TYPED EFFECT
════════════════════════════════════════════ */
const roles = [
    'BSIT Student @ NORSU',
    'Web Developer',
    'Backend Enthusiast',
    'C++ Programmer',
    'Problem Solver',
];
let ri = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed-text');

function runTyped() {
    if (!typedEl) return;
    const cur = roles[ri];
    typedEl.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    let wait = del ? 40 : 85;
    if (!del && ci === cur.length) { wait = 1800; del = true; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 400; }
    setTimeout(runTyped, wait);
}
runTyped();

/* ════════════════════════════════════════════
   NAV SCROLL
════════════════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ════════════════════════════════════════════
   MOBILE BURGER
════════════════════════════════════════════ */
const burger = document.getElementById('navBurger');
const menu = document.getElementById('navMenu');
if (burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), i * 70);
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

/* ════════════════════════════════════════════
   SKILL BAR ANIMATION
════════════════════════════════════════════ */
const fills = document.querySelectorAll('.skill-bar__fill');
const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.width + '%';
            barObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
fills.forEach(f => barObs.observe(f));

/* ════════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════════ */
const counters = document.querySelectorAll('.stat-num[data-count]');
const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const target = +e.target.dataset.count;
            const dur = 1400;
            const step = dur / target;
            let current = 0;
            const timer = setInterval(() => {
                current++;
                e.target.textContent = current;
                if (current >= target) clearInterval(timer);
            }, step);
            countObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => countObs.observe(c));

/* ════════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════════ */
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const txt = document.getElementById('btnText');
        const ico = document.getElementById('btnIcon');
        btn.style.background = 'var(--green)';
        txt.textContent = 'Message Sent!';
        ico.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
        ico.setAttribute('viewBox', '0 0 24 24');
        btn.disabled = true;
        setTimeout(() => {
            btn.style.background = '';
            txt.textContent = 'Send Message';
            ico.innerHTML = '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>';
            btn.disabled = false;
            form.reset();
        }, 3500);
    });
}

/* ════════════════════════════════════════════
   ACTIVE NAV LINK
════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            navLinks.forEach(a => {
                const active = a.getAttribute('href') === '#' + e.target.id;
                a.style.color = active ? 'var(--text)' : '';
            });
        }
    });
}, { threshold: 0.45 });
sections.forEach(s => secObs.observe(s));