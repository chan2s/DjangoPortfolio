/* ============================================================
   CRISTIAN PAUL GUILLEN — main.js
   ============================================================ */

'use strict';

// ─── Page Loader ────────────────────────────────────────────
(function () {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    function showLoader() {
        loader.classList.add('active');
        setTimeout(() => loader.classList.remove('active'), 600);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            showLoader();
            const targetId = href.split('#')[1];
            setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 280);
        });
    });

    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.remove('active'), 250);
    });
})();

// ─── Dark Mode Toggle ────────────────────────────────────────
(function () {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('.toggle-icon');
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.textContent = '☀️';
        }
    });
})();

// ─── PillNav ─────────────────────────────────────────────────
(function () {
    const pills = document.querySelectorAll('.pill');
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const pillLogo = document.getElementById('pillLogo');
    if (!pills.length) return;

    const ENTER_DUR = '0.28s';
    const LEAVE_DUR = '0.22s';

    function layoutCircles() {
        pills.forEach(pill => {
            const circle = pill.querySelector('.hover-circle');
            if (!circle) return;
            const { width: w, height: h } = pill.getBoundingClientRect();
            const R = ((w * w) / 4 + h * h) / (2 * h);
            const D = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
            const originY = D - delta;
            circle.style.width = `${D}px`;
            circle.style.height = `${D}px`;
            circle.style.bottom = `-${delta}px`;
            pill.style.setProperty('--circle-origin-y', `${originY}px`);
        });
    }

    layoutCircles();
    window.addEventListener('resize', layoutCircles, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(layoutCircles).catch(() => { });

    pills.forEach(pill => {
        pill.addEventListener('mouseenter', () => {
            pill.style.setProperty('--circle-dur', ENTER_DUR);
            pill.classList.add('is-filling');
        });
        pill.addEventListener('mouseleave', () => {
            pill.style.setProperty('--circle-dur', LEAVE_DUR);
            pill.classList.remove('is-filling');
        });
        pill.addEventListener('click', e => {
            const href = pill.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.getElementById(href.slice(1));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    if (pillLogo) {
        pillLogo.addEventListener('mouseenter', () => {
            pillLogo.style.transition = 'transform 0.32s cubic-bezier(0.4,0,0.2,1)';
            pillLogo.style.transform = 'rotate(360deg)';
        });
        pillLogo.addEventListener('mouseleave', () => {
            pillLogo.style.transition = 'transform 0s';
            pillLogo.style.transform = 'rotate(0deg)';
        });
        pillLogo.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            const [l1, l2] = hamburger.querySelectorAll('.hamburger-line');
            if (isOpen) {
                l1.style.transform = 'rotate(45deg) translate(3px, 3px)';
                l2.style.transform = 'rotate(-45deg) translate(3px, -3px)';
            } else {
                l1.style.transform = 'none';
                l2.style.transform = 'none';
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
                hamburger.querySelectorAll('.hamburger-line').forEach(l => l.style.transform = 'none');
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    setTimeout(() => {
                        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                    }, 60);
                }
            });
        });

        document.addEventListener('click', e => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('is-open');
                hamburger.querySelectorAll('.hamburger-line').forEach(l => l.style.transform = 'none');
            }
        });
    }

    const sections = document.querySelectorAll('section[id]');

    function setActive(id) {
        pills.forEach(pill => {
            const href = pill.getAttribute('href');
            pill.classList.toggle('is-active', href === `#${id}`);
        });
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
    }

    if (sections.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActive(entry.target.id);
            });
        }, { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' });
        sections.forEach(s => io.observe(s));
    }
})();

// ─── Scroll Reveal ───────────────────────────────────────────
(function () {
    const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .project-card, .timeline-item, .skill-chip, .soft-skill, .core-card');
    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            if (!entry.target.classList.contains('reveal-up') &&
                !entry.target.classList.contains('reveal-left') &&
                !entry.target.classList.contains('reveal-right')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el, i) => {
        if (!el.classList.contains('reveal-up') &&
            !el.classList.contains('reveal-left') &&
            !el.classList.contains('reveal-right')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.55s ease ${i * 0.05}s, transform 0.55s ease ${i * 0.05}s`;
        }
        observer.observe(el);
    });
})();

// ─── Counter Animation ───────────────────────────────────────
(function () {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;
        const suffix = el.querySelector('.stat-suffix');
        const suffixHTML = suffix ? suffix.outerHTML : '';
        const duration = 800;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.innerHTML = current + suffixHTML;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            animateCount(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
})();

// ─── Skill Chip Stagger ──────────────────────────────────────
(function () {
    const chips = document.querySelectorAll('.skill-chip');
    chips.forEach((chip, i) => {
        chip.style.transitionDelay = `${i * 0.03}s`;
    });
})();

// ─── Contact: topic pill selector ───────────────────────────
function selectTopic(el) {
    document.querySelectorAll('.topic-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const hidden = document.getElementById('subjectHidden');
    if (hidden) hidden.value = el.dataset.value;
}

// ─── Contact: live character counter ────────────────────────
function updateChar(textarea) {
    const counter = document.getElementById('charCount');
    if (counter) counter.textContent = textarea.value.length + ' / 500';
}

// ─── Contact Form (AJAX) ─────────────────────────────────────
(function () {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const feedback = document.getElementById('form-feedback');
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        const formData = new FormData(form);
        const csrfToken = form.querySelector('[name=csrfmiddlewaretoken]')?.value || '';

        try {
            const response = await fetch('/contact/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });

            const data = await response.json();
            feedback.style.display = 'block';

            if (data.success) {
                feedback.style.cssText = 'display:block;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);color:#16a34a;padding:0.875rem 1rem;border-radius:0.75rem;font-size:0.85rem;font-family:var(--font-mono);';
                feedback.textContent = '→ Message sent! I\'ll get back to you soon.';
                form.reset();
                // Reset topic pills and char count
                document.querySelectorAll('.topic-pill').forEach(b => b.classList.remove('active'));
                const hidden = document.getElementById('subjectHidden');
                if (hidden) hidden.value = '';
                const counter = document.getElementById('charCount');
                if (counter) counter.textContent = '0 / 500';
            } else {
                feedback.style.cssText = 'display:block;background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.3);color:#dc2626;padding:0.875rem 1rem;border-radius:0.75rem;font-size:0.85rem;font-family:var(--font-mono);';
                feedback.textContent = '→ ' + (data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            feedback.style.display = 'block';
            feedback.style.cssText = 'display:block;background:rgba(220,38,38,0.08);border:1px solid rgba(220,38,38,0.3);color:#dc2626;padding:0.875rem 1rem;border-radius:0.75rem;font-size:0.85rem;font-family:var(--font-mono);';
            feedback.textContent = '→ Network error. Please try again.';
        } finally {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            setTimeout(() => { feedback.style.display = 'none'; }, 5500);
        }
    });
})();

// ─── Parallax hero orb on mouse move ─────────────────────────
(function () {
    const orb = document.querySelector('.hero-orb');
    if (!orb) return;

    let rafId;
    document.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
})();

// ─── Core card stagger on section enter ──────────────────────
(function () {
    const cards = document.querySelectorAll('.core-card');
    if (!cards.length) return;
    cards.forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.04}s`;
    });
})();