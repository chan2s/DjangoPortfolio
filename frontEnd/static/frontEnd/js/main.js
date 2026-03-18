/* ════════════════════════════════════════════════════════
   MAIN.JS — Glassmorphism Portfolio
════════════════════════════════════════════════════════ */

// ── CUSTOM CURSOR ────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

if (cursor && cursorDot) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cursorDot.style.left = mx + 'px';
        cursorDot.style.top = my + 'px';
    });

    // Smooth cursor follow
    function animateCursor() {
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover interactions
    document.querySelectorAll('a, button, .service-card, .project-card, .blog-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '48px';
            cursor.style.height = '48px';
            cursor.style.borderColor = 'rgba(108,99,255,1)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '32px';
            cursor.style.height = '32px';
            cursor.style.borderColor = 'rgba(108,99,255,0.6)';
        });
    });
}

// ── NAV SCROLL ───────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── MOBILE NAV ───────────────────────────────────────────
const burger = document.getElementById('navBurger');
const navMenu = document.getElementById('navMenu');

if (burger && navMenu) {
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        burger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
        burger.querySelectorAll('span')[1].style.opacity = isOpen ? '0' : '1';
        burger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
            document.body.style.overflow = '';
        });
    });
}

// ── TYPED TEXT ───────────────────────────────────────────
const typedEl = document.getElementById('typed-text');
if (typedEl) {
    const phrases = [
        'Full-Stack Developer',
        'Problem Solver',
        'BSIT Student @ NORSU',
        'Clean Code Advocate',
        'Open to Opportunities'
    ];
    let pi = 0, ci = 0, deleting = false;

    function type() {
        const current = phrases[pi];
        if (!deleting) {
            typedEl.textContent = current.substring(0, ci + 1);
            ci++;
            if (ci === current.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
        } else {
            typedEl.textContent = current.substring(0, ci - 1);
            ci--;
            if (ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
            }
        }
        setTimeout(type, deleting ? 45 : 85);
    }
    setTimeout(type, 800);
}

// ── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger siblings
            const siblings = entry.target.parentElement?.querySelectorAll('.reveal:not(.visible)') || [];
            siblings.forEach((el, idx) => {
                if (el === entry.target) {
                    setTimeout(() => el.classList.add('visible'), idx * 80);
                }
            });
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SKILL BARS ───────────────────────────────────────────
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar__fill').forEach((fill, i) => {
                const w = fill.getAttribute('data-width');
                setTimeout(() => { fill.style.width = w + '%'; }, i * 150);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-list').forEach(el => skillObserver.observe(el));

// ── STAT COUNTER ─────────────────────────────────────────
function countUp(el, target, duration = 1400) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target; clearInterval(timer); return; }
        el.textContent = Math.floor(start);
    }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(el => {
                countUp(el, +el.getAttribute('data-count'));
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statObserver.observe(statsBar);

// ── CONTACT FORM ─────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const text = document.getElementById('btnText');
        const icon = document.getElementById('btnIcon');

        btn.disabled = true;
        text.textContent = 'Sending...';
        icon.style.display = 'none';

        await new Promise(r => setTimeout(r, 1200));

        text.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.style.boxShadow = '0 4px 20px rgba(34,197,94,0.35)';

        setTimeout(() => {
            form.reset();
            text.textContent = 'Send Message';
            icon.style.display = '';
            btn.disabled = false;
            btn.style.background = '';
            btn.style.boxShadow = '';
        }, 3000);
    });
}

// ── SMOOTH SCROLL ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── ACTIVE NAV LINK ──────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === '#' + entry.target.id
                );
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));