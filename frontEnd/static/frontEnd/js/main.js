/* ═══════════════════════════════════════════════════════
   CRISTIAN PAUL GUILLEN — MAIN.JS v5
   Perf fix: will-change toggled dynamically (only while rendering),
   galaxy RAF pauses when hero is off-screen,
   skill bars replaced with card + SVG arc animation
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
        const [s1, s2] = burger.querySelectorAll('span');
        if (open) {
            s1.style.transform = 'rotate(45deg) translate(5px,5px)';
            s2.style.transform = 'rotate(-45deg) translate(5px,-5px)';
            document.body.style.overflow = 'hidden';
        } else {
            s1.style.transform = s2.style.transform = '';
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

// ── TYPED TEXT ────────────────────────────────────────
const typedEl = document.getElementById('typed-text');
if (typedEl) {
    const phrases = [
        '3rd Year BSINT Student @ NORSU-BSC',
        'Good Listener',
        'Basketball Player',
        'Open to Opportunities',
    ];
    let pi = 0, ci = 0, deleting = false;
    function type() {
        const curr = phrases[pi];
        typedEl.textContent = deleting ? curr.slice(0, ci - 1) : curr.slice(0, ci + 1);
        deleting ? ci-- : ci++;
        if (!deleting && ci === curr.length) { deleting = true; setTimeout(type, 2000); return; }
        if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        setTimeout(type, deleting ? 40 : 80);
    }
    setTimeout(type, 900);
}

// ── REVEAL ON SCROLL ──────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── SKILL CARDS — arc + bottom-bar animation ──────────
// Replaces the old progress-bar observer.
// Each .skill-item has data-proficiency="N" set in the template.
// The SVG arc uses stroke-dashoffset; circumference = 2π × r(14) ≈ 87.96 ≈ 88
const CIRCUMFERENCE = 88;

const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-item').forEach((card, i) => {
                setTimeout(() => {
                    const pct = parseInt(card.dataset.proficiency || 0, 10);
                    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

                    // Animate SVG arc
                    const arcFill = card.querySelector('.skill-arc-fill');
                    if (arcFill) arcFill.style.strokeDashoffset = offset;

                    // Animate bottom gradient bar via CSS custom property
                    card.style.setProperty('--bar-scale', pct / 100);
                    card.classList.add('bar-animated');
                }, i * 80);
            });
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar-list').forEach(el => skillObs.observe(el));

// ── STAT COUNTER ──────────────────────────────────────
function countUp(el, target, dur = 1200) {
    const step = target / (dur / 16);
    let v = 0;
    const t = setInterval(() => {
        v += step;
        if (v >= target) { el.textContent = target; clearInterval(t); return; }
        el.textContent = Math.floor(v);
    }, 16);
}
const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('[data-count]').forEach(el => countUp(el, +el.dataset.count));
            statObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
const statsRow = document.querySelector('.stats-row');
if (statsRow) statObs.observe(statsRow);

// ── CONTACT FORM (AJAX → Django) ─────────────────────
const form = document.getElementById('contactForm');
if (form) {
    const feedback = document.getElementById('form-feedback');
    const getCsrf = () => (form.querySelector('[name=csrfmiddlewaretoken]') || {}).value || '';

    function showFeedback(msg, type) {
        feedback.textContent = msg;
        feedback.className = type;
        feedback.style.display = 'block';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const text = document.getElementById('btnText');
        const icon = document.getElementById('btnIcon');

        const n = form.querySelector('[name=full_name]').value.trim();
        const em = form.querySelector('[name=email]').value.trim();
        const m = form.querySelector('[name=message]').value.trim();
        if (!n || !em || !m) { showFeedback('Please fill in all required fields.', 'error'); return; }

        btn.disabled = true; text.textContent = 'Sending...'; icon.textContent = '⟳';
        feedback.style.display = 'none';

        const payload = {};
        new FormData(form).forEach((v, k) => payload[k] = v);

        try {
            const res = await fetch('/contact/submit/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrf() },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                text.textContent = 'Sent!'; icon.textContent = '✓'; btn.style.background = '#4affce';
                showFeedback("Your message was sent successfully! I'll get back to you soon.", 'success');
                setTimeout(() => {
                    form.reset();
                    text.textContent = 'Send Message'; icon.textContent = '↗';
                    btn.style.background = ''; btn.disabled = false;
                    feedback.style.display = 'none';
                }, 4000);
            } else {
                text.textContent = 'Send Message'; icon.textContent = '↗'; btn.disabled = false;
                showFeedback(data.errors ? Object.values(data.errors).flat().join(' ') : 'Something went wrong.', 'error');
            }
        } catch {
            text.textContent = 'Send Message'; icon.textContent = '↗'; btn.disabled = false;
            showFeedback('Network error. Check your connection and try again.', 'error');
        }
    });
}

// ── SMOOTH SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
    });
});

// ── ACTIVE NAV HIGHLIGHT ──────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');
document.querySelectorAll('section[id]').forEach(s =>
    new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
            }
        });
    }, { rootMargin: '-30% 0px -60% 0px' }).observe(s)
);

/* ═══════════════════════════════════════════════════════
   GALAXY WEBGL BACKGROUND
   ─────────────────────────────────────────────────────
   SCROLL LAG FIX (root cause was will-change: transform
   pinning the canvas to a GPU compositor layer 100% of
   the time — even when the RAF was paused):

   · will-change is set to 'contents' ONLY while the RAF
     loop is actually running, and reset to 'auto' the
     moment stopLoop() fires — this releases the GPU layer
     entirely when the hero is off-screen.
   · contain: strict on the canvas (set in CSS) isolates
     paint so scroll doesn't cause canvas repaints.
   · body::before / body::after get transform:translateZ(0)
     in CSS so grain + nebula are on their own layers and
     don't re-composite on every scroll tick.
   · IntersectionObserver (threshold:0) still drives the
     start/stop so zero work happens off-screen.
   · Tab visibility API also pauses the loop.
   · DPR capped at 1 (no 2× overdraw on retina).
   · Static uniforms uploaded ONCE at init.
   · Canvas resizes lazily (only when dims actually change).
═══════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const CFG = {
        focal: [0.5, 0.5],
        rotation: [1.0, 0.0],
        starSpeed: 0.5,
        density: 1.0,
        hueShift: 140.0,
        speed: 1.0,
        glowIntensity: 0.3,
        saturation: 0.0,
        mouseRepulsion: true,
        repulsionStrength: 2.0,
        twinkleIntensity: 0.3,
        rotationSpeed: 0.05,
        autoCenterRepulsion: 0.0,
        transparent: true,
    };

    /* ── VERTEX SHADER ─────────────────────────────── */
    const VERT = `
        attribute vec2 position;
        varying vec2 vUv;
        void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}
    `;

    /* ── FRAGMENT SHADER (mediump = faster) ─────────── */
    const FRAG = `
        precision mediump float;

        uniform float uTime, uStarSpeed, uDensity, uHueShift, uSpeed;
        uniform float uGlowIntensity, uSaturation, uTwinkleIntensity;
        uniform float uRotationSpeed, uRepulsionStrength, uMouseActiveFactor;
        uniform float uAutoCenterRepulsion;
        uniform vec3  uResolution;
        uniform vec2  uFocal, uRotation, uMouse;
        uniform bool  uMouseRepulsion, uTransparent;
        varying vec2  vUv;

        #define NL 4.0
        #define SCC 0.2
        #define PI  3.14159265

        mat2 M45=mat2(.7071,-.7071,.7071,.7071);

        float H21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
        float tri(float x){return abs(fract(x)*2.-1.);}
        float tris(float x){float t=fract(x);return 1.-smoothstep(0.,1.,abs(2.*t-1.));}
        float trisn(float x){float t=fract(x);return 2.*(1.-smoothstep(0.,1.,abs(2.*t-1.)))-1.;}

        vec3 hsv2rgb(vec3 c){
            vec4 K=vec4(1.,2./3.,1./3.,3.);
            vec3 p=abs(fract(c.xxx+K.xyz)*6.-K.www);
            return c.z*mix(K.xxx,clamp(p-K.xxx,0.,1.),c.y);
        }

        float Star(vec2 uv,float fl){
            float d=length(uv);
            float m=(.05*uGlowIntensity)/d;
            float r=smoothstep(0.,1.,1.-abs(uv.x*uv.y*1000.));
            m+=r*fl*uGlowIntensity;
            uv=M45*uv;
            r=smoothstep(0.,1.,1.-abs(uv.x*uv.y*1000.));
            m+=r*.3*fl*uGlowIntensity;
            m*=smoothstep(1.,.2,d);
            return m;
        }

        vec3 StarLayer(vec2 uv){
            vec3 col=vec3(0.);
            vec2 gv=fract(uv)-.5, id=floor(uv);
            for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
                vec2 off=vec2(float(x),float(y)), si=id+off;
                float seed=H21(si), size=fract(seed*345.32);
                float fl=smoothstep(.9,1.,size)*tri(uStarSpeed/(3.*seed+1.));
                float r=smoothstep(SCC,1.,H21(si+1.))+SCC;
                float b=smoothstep(SCC,1.,H21(si+3.))+SCC;
                vec3 base=vec3(r,min(r,b)*seed,b);
                float hue=atan(base.g-base.r,base.b-base.r)/(2.*PI)+.5;
                hue=fract(hue+uHueShift/360.);
                float sat=length(base-vec3(dot(base,vec3(.299,.587,.114))))*uSaturation;
                float val=max(max(base.r,base.g),base.b);
                base=hsv2rgb(vec3(hue,sat,val));
                vec2 pad=vec2(tris(seed*34.+uTime*uSpeed/10.),tris(seed*38.+uTime*uSpeed/30.))-.5;
                float st=Star(gv-off-pad,fl);
                float tw=mix(1.,trisn(uTime*uSpeed+seed*6.2831)*.5+1.,uTwinkleIntensity);
                col+=st*size*base*tw;
            }
            return col;
        }

        void main(){
            vec2 fp=uFocal*uResolution.xy;
            vec2 uv=(vUv*uResolution.xy-fp)/uResolution.y;

            if(uAutoCenterRepulsion>0.){
                float d=length(uv);
                uv+=normalize(uv)*(uAutoCenterRepulsion/(d+.1))*.05;
            } else if(uMouseRepulsion){
                vec2 mp=(uMouse*uResolution.xy-fp)/uResolution.y;
                float md=length(uv-mp);
                uv+=normalize(uv-mp)*(uRepulsionStrength/(md+.1))*.05*uMouseActiveFactor;
            } else {
                uv+=(uMouse-.5)*.1*uMouseActiveFactor;
            }

            float ang=uTime*uRotationSpeed;
            uv=mat2(cos(ang),-sin(ang),sin(ang),cos(ang))*uv;
            uv=mat2(uRotation.x,-uRotation.y,uRotation.y,uRotation.x)*uv;

            vec3 col=vec3(0.);
            for(float i=0.;i<1.;i+=1./NL){
                float dep=fract(i+uStarSpeed*uSpeed);
                float sc=mix(20.*uDensity,.5*uDensity,dep);
                col+=StarLayer(uv*sc+i*453.32)*dep*smoothstep(1.,.9,dep);
            }

            if(uTransparent){
                float a=smoothstep(0.,.3,length(col));
                gl_FragColor=vec4(col,min(a,1.));
            } else {
                gl_FragColor=vec4(col,1.);
            }
        }
    `;

    /* ── SETUP ──────────────────────────────────────── */
    const canvas = document.getElementById('galaxyCanvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        powerPreference: 'default'
    });
    if (!gl) { console.warn('WebGL unavailable'); return; }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
        return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    ['uTime', 'uResolution', 'uFocal', 'uRotation', 'uStarSpeed', 'uDensity', 'uHueShift', 'uSpeed',
        'uMouse', 'uGlowIntensity', 'uSaturation', 'uMouseRepulsion', 'uTwinkleIntensity', 'uRotationSpeed',
        'uRepulsionStrength', 'uMouseActiveFactor', 'uAutoCenterRepulsion', 'uTransparent']
        .forEach(n => U[n] = gl.getUniformLocation(prog, n));

    /* Upload static uniforms ONCE */
    gl.uniform2fv(U.uFocal, new Float32Array(CFG.focal));
    gl.uniform2fv(U.uRotation, new Float32Array(CFG.rotation));
    gl.uniform1f(U.uDensity, CFG.density);
    gl.uniform1f(U.uHueShift, CFG.hueShift);
    gl.uniform1f(U.uSpeed, CFG.speed);
    gl.uniform1f(U.uGlowIntensity, CFG.glowIntensity);
    gl.uniform1f(U.uSaturation, CFG.saturation);
    gl.uniform1i(U.uMouseRepulsion, CFG.mouseRepulsion ? 1 : 0);
    gl.uniform1f(U.uTwinkleIntensity, CFG.twinkleIntensity);
    gl.uniform1f(U.uRotationSpeed, CFG.rotationSpeed);
    gl.uniform1f(U.uRepulsionStrength, CFG.repulsionStrength);
    gl.uniform1f(U.uAutoCenterRepulsion, CFG.autoCenterRepulsion);
    gl.uniform1i(U.uTransparent, CFG.transparent ? 1 : 0);

    /* Mouse lerp state */
    const mouse = { tx: .5, ty: .5, sx: .5, sy: .5, ta: 0, sa: 0 };
    const lerp = (a, b, t) => a + (b - a) * t;
    const LF = 0.05;

    /* Lazy canvas resize (DPR = 1 for perf) */
    let lw = 0, lh = 0;
    function resize() {
        const w = canvas.offsetWidth, h = canvas.offsetHeight;
        if (w !== lw || h !== lh) { canvas.width = lw = w; canvas.height = lh = h; gl.viewport(0, 0, w, h); }
    }

    /* ── RENDER LOOP ────────────────────────────────── */
    let rafId = null;

    function render(t) {
        rafId = requestAnimationFrame(render);
        resize();
        const ts = t * 0.001;
        mouse.sx = lerp(mouse.sx, mouse.tx, LF);
        mouse.sy = lerp(mouse.sy, mouse.ty, LF);
        mouse.sa = lerp(mouse.sa, mouse.ta, LF);

        gl.uniform1f(U.uTime, ts);
        gl.uniform1f(U.uStarSpeed, ts * CFG.starSpeed / 10);
        gl.uniform3f(U.uResolution, canvas.width, canvas.height, canvas.width / canvas.height);
        gl.uniform2f(U.uMouse, mouse.sx, mouse.sy);
        gl.uniform1f(U.uMouseActiveFactor, mouse.sa);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* ★ THE SCROLL LAG FIX ★
       Toggle will-change ONLY while the RAF is running.
       When the hero leaves the viewport we call stopLoop()
       which cancels the RAF AND resets will-change to 'auto'
       — releasing the GPU compositor layer entirely.
       startLoop() sets it back to 'contents' just before
       the first frame fires so the browser promotes the
       canvas right when it needs it, and not a moment before.
    */
    function startLoop() {
        if (!rafId) {
            canvas.style.willChange = 'contents'; // promote GPU layer just-in-time
            rafId = requestAnimationFrame(render);
        }
    }

    function stopLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
            canvas.style.willChange = 'auto'; // release GPU layer — zero cost while off-screen
        }
    }

    /* ══════════════════════════════════════════════════
       IntersectionObserver drives the start/stop.
       threshold:0 means even 1px visible = running,
       fully off-screen = stopped.
    ══════════════════════════════════════════════════ */
    const heroEl = document.getElementById('hero');
    new IntersectionObserver((entries) => {
        entries[0].isIntersecting ? startLoop() : stopLoop();
    }, { threshold: 0 }).observe(heroEl);

    /* Mouse interaction — hero only */
    heroEl.addEventListener('mousemove', e => {
        const r = heroEl.getBoundingClientRect();
        mouse.tx = (e.clientX - r.left) / r.width;
        mouse.ty = 1 - (e.clientY - r.top) / r.height;
        mouse.ta = 1;
    }, { passive: true });
    heroEl.addEventListener('mouseleave', () => { mouse.ta = 0; }, { passive: true });
    heroEl.addEventListener('touchmove', e => {
        const t = e.touches[0], r = heroEl.getBoundingClientRect();
        mouse.tx = (t.clientX - r.left) / r.width;
        mouse.ty = 1 - (t.clientY - r.top) / r.height;
        mouse.ta = 1;
    }, { passive: true });
    heroEl.addEventListener('touchend', () => { mouse.ta = 0; }, { passive: true });

    /* Also pause when tab is hidden */
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopLoop() : startLoop();
    });

    canvas.classList.add('loaded');
    resize();
    startLoop();
})();