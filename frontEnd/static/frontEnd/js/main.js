/* ═══════════════════════════════════════════════════════
   CRISTIAN PAUL GUILLEN — MAIN.JS v6
   Changes from v5:
   · Canvas sizing uses heroEl.getBoundingClientRect()
     instead of canvas.offsetWidth/Height (fixes mobile
     where absolute-positioned canvas reads 0 before paint)
   · WebGL context flags: failIfMajorPerformanceCaveat:false
     + powerPreference:'low-power' for Android browsers
   · Delayed resize check (300ms) for slow mobile paints
   · CSS starfield fallback already in HTML — no JS needed,
     WebGL canvas just fades in on top when ready
   · will-change toggled dynamically (set on startLoop,
     cleared on stopLoop) to release GPU layer off-screen
   · All v5 improvements retained: arc skill cards, RAF
     pauses via IntersectionObserver, tab visibility API
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

// ── SKILL CARDS — SVG arc animation ──────────────────
// Circumference = 2π × r(14) ≈ 87.96 → use 88
const CIRCUMFERENCE = 88;

const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-item').forEach((card, i) => {
                setTimeout(() => {
                    const pct = parseInt(card.dataset.proficiency || 0, 10);
                    const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
                    const arcFill = card.querySelector('.skill-arc-fill');
                    if (arcFill) arcFill.style.strokeDashoffset = offset;
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

// ── CONTACT FORM ──────────────────────────────────────
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
                    form.reset(); text.textContent = 'Send Message'; icon.textContent = '↗';
                    btn.style.background = ''; btn.disabled = false; feedback.style.display = 'none';
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
            if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        });
    }, { rootMargin: '-30% 0px -60% 0px' }).observe(s)
);

/* ═══════════════════════════════════════════════════════
   GALAXY WEBGL BACKGROUND
   ─────────────────────────────────────────────────────
   MOBILE FIX (key change from v5):
   · Canvas size read from heroEl.getBoundingClientRect()
     not canvas.offsetWidth/Height. On mobile, the canvas
     is position:absolute so offsetWidth=0 before first
     paint. BCR always returns correct rendered dimensions.
   · Context flags: failIfMajorPerformanceCaveat:false
     (allows software WebGL on Android) + low-power mode.
   · requestAnimationFrame + 300ms delayed second resize
     covers slow mobile paint paths.

   SCROLL LAG FIX (retained from v5):
   · will-change toggled: set to 'contents' on startLoop,
     reset to 'auto' on stopLoop → GPU layer released
     entirely when hero is off-screen.
   · IntersectionObserver(threshold:0) drives start/stop.
   · Tab visibility API also pauses.
   · Static uniforms uploaded once, DPR=1, lazy resize.
═══════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const canvas = document.getElementById('galaxyCanvas');
    const heroEl = document.getElementById('hero');
    if (!canvas || !heroEl) return;

    /* ── WebGL context with mobile-friendly flags ─── */
    let gl = null;
    const ctxOpts = {
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
        powerPreference: 'low-power',           // saves battery on mobile
        failIfMajorPerformanceCaveat: false,     // allows software WebGL on Android
        preserveDrawingBuffer: false,
    };
    try {
        gl = canvas.getContext('webgl', ctxOpts)
            || canvas.getContext('experimental-webgl', ctxOpts);
    } catch (e) { gl = null; }

    if (!gl) {
        // CSS starfield fallback already visible — nothing more to do
        console.info('WebGL unavailable — CSS starfield active');
        return;
    }

    /* ── SHADERS ────────────────────────────────────── */
    const VERT = `
        attribute vec2 position;
        varying vec2 vUv;
        void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}
    `;

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
            float d=length(uv);float m=(.05*uGlowIntensity)/d;
            float r=smoothstep(0.,1.,1.-abs(uv.x*uv.y*1000.));
            m+=r*fl*uGlowIntensity;uv=M45*uv;
            r=smoothstep(0.,1.,1.-abs(uv.x*uv.y*1000.));
            m+=r*.3*fl*uGlowIntensity;m*=smoothstep(1.,.2,d);return m;
        }

        vec3 StarLayer(vec2 uv){
            vec3 col=vec3(0.);
            vec2 gv=fract(uv)-.5,id=floor(uv);
            for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
                vec2 off=vec2(float(x),float(y)),si=id+off;
                float seed=H21(si),size=fract(seed*345.32);
                float fl=smoothstep(.9,1.,size)*tri(uStarSpeed/(3.*seed+1.));
                float rv=smoothstep(SCC,1.,H21(si+1.))+SCC;
                float bv=smoothstep(SCC,1.,H21(si+3.))+SCC;
                vec3 base=vec3(rv,min(rv,bv)*seed,bv);
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

    /* ── COMPILE & LINK ─────────────────────────────── */
    function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
        return s;
    }

    const vs = mkShader(gl.VERTEX_SHADER, VERT);
    const fs = mkShader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

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

    /* Static uniforms — uploaded once */
    gl.uniform2fv(U.uFocal, new Float32Array([0.5, 0.5]));
    gl.uniform2fv(U.uRotation, new Float32Array([1.0, 0.0]));
    gl.uniform1f(U.uDensity, 1.0);
    gl.uniform1f(U.uHueShift, 140.0);
    gl.uniform1f(U.uSpeed, 1.0);
    gl.uniform1f(U.uGlowIntensity, 0.3);
    gl.uniform1f(U.uSaturation, 0.0);
    gl.uniform1i(U.uMouseRepulsion, 1);
    gl.uniform1f(U.uTwinkleIntensity, 0.3);
    gl.uniform1f(U.uRotationSpeed, 0.05);
    gl.uniform1f(U.uRepulsionStrength, 2.0);
    gl.uniform1f(U.uAutoCenterRepulsion, 0.0);
    gl.uniform1i(U.uTransparent, 1);

    const mouse = { tx: .5, ty: .5, sx: .5, sy: .5, ta: 0, sa: 0 };
    const lerp = (a, b, t) => a + (b - a) * t;

    /* ── CANVAS SIZING ────────────────────────────────────
       Primary source: window.innerWidth/innerHeight
       Always available even before first paint on mobile.
       BCR used as refinement once layout is done.
    ──────────────────────────────────────────────────── */
    let lw = 0, lh = 0;
    function getSize() {
        const ww = window.innerWidth || 360;
        const wh = window.innerHeight || 700;
        const rect = heroEl.getBoundingClientRect();
        const rw = Math.round(rect.width);
        const rh = Math.round(rect.height);
        return { w: rw > 10 ? rw : ww, h: rh > 10 ? rh : wh };
    }
    function resize() {
        const { w, h } = getSize();
        if (w !== lw || h !== lh) {
            canvas.width = lw = w;
            canvas.height = lh = h;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            gl.viewport(0, 0, w, h);
        }
    }
    window.addEventListener('resize', resize, { passive: true });

    /* ── RENDER LOOP ──────────────────────────────────── */
    let rafId = null;

    function render(t) {
        rafId = requestAnimationFrame(render);
        resize();
        const ts = t * 0.001;
        mouse.sx = lerp(mouse.sx, mouse.tx, 0.05);
        mouse.sy = lerp(mouse.sy, mouse.ty, 0.05);
        mouse.sa = lerp(mouse.sa, mouse.ta, 0.05);

        gl.uniform1f(U.uTime, ts);
        gl.uniform1f(U.uStarSpeed, ts * 0.5 / 10);
        gl.uniform3f(U.uResolution, canvas.width, canvas.height, canvas.width / (canvas.height || 1));
        gl.uniform2f(U.uMouse, mouse.sx, mouse.sy);
        gl.uniform1f(U.uMouseActiveFactor, mouse.sa);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* Toggle will-change dynamically — GPU layer only exists while rendering */
    function startLoop() {
        if (!rafId) {
            canvas.style.willChange = 'contents';
            rafId = requestAnimationFrame(render);
        }
    }
    function stopLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
            canvas.style.willChange = 'auto'; // release GPU layer entirely
        }
    }

    /* Pause RAF when hero off-screen — zero GPU cost while scrolling */
    new IntersectionObserver((entries) => {
        entries[0].isIntersecting ? startLoop() : stopLoop();
    }, { threshold: 0 }).observe(heroEl);

    /* Tab visibility */
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stopLoop() : startLoop();
    });

    /* Mouse / touch */
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
        mouse.ta = 0.4; // gentler repulsion on mobile
    }, { passive: true });
    heroEl.addEventListener('touchend', () => { mouse.ta = 0; }, { passive: true });

    /* ── INIT ─────────────────────────────────────────────
       Run resize immediately — window.innerWidth is available
       right now so we get a valid canvas size instantly.
       Also schedule retries in case mobile layout shifts.
    ──────────────────────────────────────────────────── */
    resize(); // immediate — uses window.innerWidth/innerHeight
    canvas.classList.add('loaded');
    startLoop();

    // Retry resizes for slow mobile layout passes
    [100, 300, 600, 1000].forEach(ms =>
        setTimeout(() => { resize(); }, ms)
    );

})();