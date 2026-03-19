/* ═══════════════════════════════════════════════════════
   CRISTIAN PAUL GUILLEN — MAIN.JS v2
═══════════════════════════════════════════════════════ */

// ── NAV SCROLL STATE ──────────────────────────────────
const header = document.getElementById('site-header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// ── MOBILE NAV ────────────────────────────────────────
const burger = document.getElementById('burger');
const mainNav = document.getElementById('main-nav');

if (burger && mainNav) {
    burger.addEventListener('click', () => {
        const open = mainNav.classList.toggle('open');
        const spans = burger.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            document.body.style.overflow = 'hidden';
        } else {
            spans[0].style.transform = '';
            spans[1].style.transform = '';
            document.body.style.overflow = '';
        }
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            burger.querySelectorAll('span').forEach(s => s.style.transform = '');
            document.body.style.overflow = '';
        });
    });
}
const typedEl = document.getElementById('typed-text');
if (typedEl) {
    const phrases = [

        '3rd Year BSINT Student @ NORSU-BSC',
        'Good Listener',
        'Yearner',
        'Basketball Player',
        'Open to Opportunities'
    ];
    let pi = 0, ci = 0, deleting = false;

    function type() {
        const curr = phrases[pi];
        typedEl.textContent = deleting
            ? curr.substring(0, ci - 1)
            : curr.substring(0, ci + 1);

        if (!deleting) { ci++; }
        else { ci--; }

        if (!deleting && ci === curr.length) {
            deleting = true;
            setTimeout(type, 2000);
            return;
        }
        if (deleting && ci === 0) {
            deleting = false;
            pi = (pi + 1) % phrases.length;
        }
        setTimeout(type, deleting ? 40 : 80);
    }
    setTimeout(type, 900);
}

// ── REVEAL ON SCROLL ──────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── SKILL BARS ────────────────────────────────────────
const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
                setTimeout(() => {
                    fill.style.width = fill.getAttribute('data-width') + '%';
                }, i * 100);
            });
            skillObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-bar-list').forEach(el => skillObs.observe(el));

// ── STAT COUNTER ──────────────────────────────────────
function countUp(el, target, duration = 1200) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
            return;
        }
        el.textContent = Math.floor(start);
    }, 16);
}

const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-count]').forEach(el => {
                countUp(el, +el.getAttribute('data-count'));
            });
            statObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statObs.observe(statsRow);

// ── CONTACT FORM ──────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const text = document.getElementById('btnText');
        const icon = document.getElementById('btnIcon');

        btn.disabled = true;
        text.textContent = 'Sending...';
        icon.textContent = '⟳';

        await new Promise(r => setTimeout(r, 1200));

        text.textContent = 'Sent!';
        icon.textContent = '✓';
        btn.style.background = '#4affce';

        setTimeout(() => {
            form.reset();
            text.textContent = 'Send Message';
            icon.textContent = '↗';
            btn.style.background = '';
            btn.disabled = false;
        }, 3500);
    });
}

// ── SMOOTH SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const y = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});

// ── ACTIVE NAV HIGHLIGHT ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => activeObs.observe(s));