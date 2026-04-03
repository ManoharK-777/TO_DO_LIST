import streamlit as st
import uuid

# --- Page Configuration ---
st.set_page_config(page_title="Smart Todo AI – Obsidian", page_icon="🔥", layout="wide", initial_sidebar_state="collapsed")

# --- SVG HELPER (MISSION CRITICAL) ---
SVGS = {
    "flame": '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 3.5 3 4 2.143 1.071 3 3 3 5a6 6 0 0 1-12 0c0-2.345 1.5-4.5 3-5.5.5 1.5 1.5 2.5 2 3Z"/>',
    "grid": '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    "activity": '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    "zap": '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "calendar": '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    "trash": '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
    "chevron": '<path d="m6 9 6 6 6-6"/>'
}
def ico(name, color="#DC2626", size=18):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">{SVGS.get(name, "")}</svg>'

# --- UI Definitions & CSS (Final Mission - Ultra Parity & Red Hot Flames) ---
CUSTOM_CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Outfit:wght@400;900&display=swap');

:root {
    --obsidian-950: #050505; --obsidian-900: #0A0A0A;
    --crimson-400: #EF4444; --crimson-500: #DC2626;
}

html, body, [data-testid="stAppViewContainer"] {
    background-color: var(--obsidian-950) !important; color: #f1f5f9 !important;
    font-family: 'Inter', sans-serif !important; cursor: none !important;
}

[data-testid="stHeader"], [data-testid="stDecoration"], footer { display: none !important; }

/* RE-SCALED HERO */
.hero-title {
    font-family: 'Outfit', sans-serif !important;
    background: linear-gradient(135deg, #fff 15%, #fee2e2 50%, #b91c1c 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    font-size: 3.2rem !important; font-weight: 900 !important; line-height: 1.1 !important; 
    letter-spacing: -0.05em !important; margin: 10px 0 !important; text-align: center;
}
.hero-subtitle { color: #64748b; font-size: 1.05rem; font-weight: 500; margin-bottom: 30px; text-align: center; }

/* THE PILL UNIFICATION */
[data-testid="stHorizontalBlock"] { 
    background: var(--obsidian-900) !important; border: 1px solid rgba(220,38,38,0.15) !important;
    border-radius: 999px !important; padding: 2px 6px 2px 24px !important; margin: 20px auto !important; max-width: 800px;
    align-items: center !important;
}

/* ZERO-WHITE OVERRIDES */
div[data-testid="stTextInputRootElement"], div[data-baseweb="input"], [data-baseweb="input"] > div {
    background-color: transparent !important; background: transparent !important; border: none !important; box-shadow: none !important;
}
.stTextInput input { background: transparent !important; color: white !important; font-size: 1rem !important; font-weight: 800 !important; }

/* HERO BUTTONS (THE DEFEATER) */
.hero-white-btn button { background-color: white !important; color: black !important; font-weight: 900 !important; border-radius: 50px !important; padding: 12px 35px !important; border: none !important; width: 100% !important; }
.hero-outline-btn button { background-color: transparent !important; color: white !important; border: 2px solid rgba(220,38,38,0.4) !important; font-weight: 900 !important; border-radius: 50px !important; padding: 12px 35px !important; width: 100% !important; }
.hero-white-btn button:hover { background-color: #f1f5f9 !important; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.1) !important; }
.hero-outline-btn button:hover { border-color: var(--crimson-500) !important; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(220,38,38,0.1) !important; }

/* STATS */
.stat-card { background: rgba(255, 255, 255, 0.012); border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 1.25rem; padding: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.4); }
.icon-box { width: 32px; height: 32px; border-radius: 0.6rem; display: flex; align-items: center; justify-content: center; margin-bottom: 0.6rem; }
.stat-cap { font-size: 8px; font-weight: 900; letter-spacing: 0.25em; color: #475569; text-transform: uppercase; margin-bottom: 2px !important; }
.stat-num { font-size: 1.8rem; font-weight: 900; color: white; line-height: 1; letter-spacing: -0.05em; }

/* TABS FIX */
div[data-testid="stButton"] button { color: #475569 !important; background: transparent !important; border: none !important; font-weight: 900 !important; font-size: 10px !important; letter-spacing: 1px !important; cursor: none !important; padding: 8px 15px !important; }
/* Re-applying active state with higher specificity */
.st-key-f_ALL_LOGIC button { background: var(--crimson-500) !important; color: white !important; border-radius: 10px !important; }
.st-key-f_PROCESSING button { background: var(--crimson-500) !important; color: white !important; border-radius: 10px !important; }
.st-key-f_FINALIZED button { background: var(--crimson-500) !important; color: white !important; border-radius: 10px !important; }

/* TASK UNITS */
.task-unit { background: rgba(255, 255, 255, 0.015); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 1.25rem; padding: 0.8rem 1.4rem; position: relative; display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; }
.molten-side { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
.task-prim { font-size: 1.1rem; font-weight: 900; color: white; display: flex; align-items: center; gap: 10px; margin: 0; }
.task-meta { display: flex; gap: 12px; margin-top: 6px; font-size: 8px; font-weight: 900; color: #475569; letter-spacing: 0.04em; }

/* IN-CARD BUTTONS */
.task-btn button { background: rgba(255,255,255,0.05) !important; color: white !important; border-radius: 50% !important; width: 33px !important; height: 33px !important; min-width: 33px !important; padding: 0 !important; }

.pulse-glow { animation: glow 2s infinite; color: var(--crimson-400); }
@keyframes glow { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

/* BRANDING */
.protocol-badge { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 99px; background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); color: var(--crimson-400); font-size: 8px; font-weight: 900; letter-spacing: 0.4em; text-transform: uppercase; }
</style>
"""

JS_ENGINE = """
<script>
(function() {
    let mPos = {x:-100, y:-100};
    const ensureCursor = () => {
        let ptr = document.getElementById('flame-ptr');
        if (!ptr) {
            ptr = document.createElement('div');
            ptr.id = 'flame-ptr';
            Object.assign(ptr.style, { position:'fixed', width:'8px', height:'8px', background:'#fff', borderRadius:'50%', boxShadow:'0 0 15px #fff, 0 0 30px #DC2626', zIndex:'100000', pointerEvents:'none', transform:'translate(-50%,-50%)' });
            document.body.appendChild(ptr);
        }
        return ptr;
    };

    function spawnFlame(x, y) {
        const p = document.createElement('div');
        const s = Math.random() * 20 + 8; // Larger particles
        Object.assign(p.style, {
            position: 'fixed', left: x + 'px', top: y + 'px',
            width: s + 'px', height: s + 'px',
            background: `radial-gradient(circle, #fff 0%, #F59E0B 40%, #DC2626 80%, transparent 100%)`,
            borderRadius: '50%', filter: 'blur(3px)', zIndex: '99999', pointerEvents: 'none',
            transform: 'translate(-50%, -50%)', transition: 'all 0.8s cubic-bezier(0, .3, .3, 1)'
        });
        document.body.appendChild(p);

        setTimeout(() => {
            const dx = (Math.random() - 0.5) * 80;
            const dy = -(Math.random() * 150 + 80); // Move MUCH further up
            p.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
            p.style.opacity = '0';
            setTimeout(() => p.remove(), 800);
        }, 10);
    }

    function renderTrail() {
        const ptr = ensureCursor();
        ptr.style.left = mPos.x + 'px'; ptr.style.top = mPos.y + 'px';
        
        // Always spawn flames when moving
        if (mPos.x > 0) {
            spawnFlame(mPos.x, mPos.y);
            if (Math.random() > 0.5) spawnFlame(mPos.x + (Math.random()-0.5)*10, mPos.y + (Math.random()-0.5)*10);
        }
        requestAnimationFrame(renderTrail);
    }

    window.addEventListener('mousemove', e => { mPos = {x:e.clientX, y:e.clientY}; }, {passive: true});
    renderTrail();
})();
</script>
"""

# --- Helpers ---
def render_metric(col, l, v, i, c, t_c):
    col.markdown(f'<div class="stat-card"><div class="icon-box" style="background:{c}26;">{ico(i, t_c, 16)}</div><p class="stat-cap">{l}</p><p class="stat-num">{v}</p></div>', unsafe_allow_html=True)

def render_feat(col, it, id, icon):
    col.markdown(f'<div class="feat-card"><div style="width:40px; height:40px; background:rgba(220,38,38,0.1); border-radius:0.8rem; display:flex; align-items:center; justify-content:center; margin-bottom:20px">{ico(icon, "#DC2626", 22)}</div><h3 style="font-size:1.4rem; font-weight:900; color:white; margin-bottom:10px; letter-spacing:-0.03em">{it}</h3><p style="color:#94a3b8; font-size:0.95rem; line-height:1.6">{id}</p></div>', unsafe_allow_html=True)

# --- App Logic ---
if 'tasks' not in st.session_state:
    st.session_state.tasks = [{"id": str(uuid.uuid4()), "text": "project on python", "comp": False}]
if 'filter' not in st.session_state:
    st.session_state.filter = 'ALL_LOGIC'

def op_logic(op, tid=None, val=None):
    if op=='add' and val: st.session_state.tasks.insert(0, {"id":str(uuid.uuid4()),"text":val,"comp":False})
    elif op=='toggle':
        for t in st.session_state.tasks:
            if t['id']==tid: t['comp'] = not t['comp']
    elif op=='del': st.session_state.tasks = [t for t in st.session_state.tasks if t['id'] != tid]
    st.rerun()

# --- Render ---
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)
st.markdown(JS_ENGINE, unsafe_allow_html=True)

with st.container():
    st.markdown(f'<div style="height:35px"></div><div style="text-align:center"><div class="protocol-badge">{ico("flame", "#DC2626", 12)} Futuristic Crimson Protocol</div><h1 class="hero-title">Smart Todo AI</h1><p class="hero-subtitle">Liquid-fire orchestration for elite professional workflows.</p></div>', unsafe_allow_html=True)
    
    hb1, hb2, hb3, hb4, hb5 = st.columns([2, 1.2, 0.2, 1.2, 2])
    with hb2: 
        st.markdown('<div class="hero-white-btn">', unsafe_allow_html=True)
        st.button("Go to Dashboard", key="h_dash_final_v13")
        st.markdown('</div>', unsafe_allow_html=True)
    with hb4: 
        st.markdown('<div class="hero-outline-btn">', unsafe_allow_html=True)
        st.button("Learn More", key="h_learn_final_v13")
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown('<div style="height:55px"></div>', unsafe_allow_html=True)

    t_tot, t_com = len(st.session_state.tasks), len([t for t in st.session_state.tasks if t['comp']])
    t_pen = t_tot - t_com
    sc1, sc2, sc3 = st.columns(3)
    render_metric(sc1, "Active Units", t_tot, "grid", "#DC2626", "#DC2626")
    render_metric(sc2, "Success State", t_com, "activity", "#E11D48", "#E11D48")
    render_metric(sc3, "Pending Logic", t_pen, "zap", "#F59E0B", "#F59E0B")

    st.markdown('<div style="height:15px"></div>', unsafe_allow_html=True)
    pi_row = st.columns([5.2, 1.4])
    with pi_row[0]: n_v = st.text_input("replic_ctrl_sys_v13", placeholder="Assemble a new primitive...", label_visibility="collapsed")
    with pi_row[1]: 
        st.markdown('<div class="pill-button">', unsafe_allow_html=True)
        if st.button("+ Initialize", key="init_v13", use_container_width=True):
            if n_v: op_logic('add', val=n_v)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div style="height:15px"></div>', unsafe_allow_html=True)
    tf_cols = st.columns([1.5, 1.5, 1.5, 5])
    filters = [("All Logic", "ALL_LOGIC"), ("Processing", "PROCESSING"), ("Finalized", "FINALIZED")]
    for i, (l, f) in enumerate(filters):
        active = st.session_state.filter == f
        label = l.upper()
        with tf_cols[i]:
            if st.button(label, key=f"f_{f}", use_container_width=True):
                st.session_state.filter = f; st.rerun()

    st.markdown('<div style="height:40px"></div>', unsafe_allow_html=True)

    for t in st.session_state.tasks:
        if (st.session_state.filter=='PROCESSING' and t['comp']) or (st.session_state.filter=='FINALIZED' and not t['comp']): continue
        tl1, tl2, tl3 = st.columns([0.15, 1, 0.15])
        with tl1: 
            st.markdown('<div class="task-btn">', unsafe_allow_html=True)
            if st.button(ico("check" if t['comp'] else "circle", "white", 14), key=f"chk_v13_{t['id']}", use_container_width=True): op_logic('toggle', tid=t['id'])
            st.markdown('</div>', unsafe_allow_html=True)
        m_c = "#E11D48" if t['comp'] else "#DC2626"
        tl2.markdown(f"""<div class="task-unit">
            <div class="molten-side" style="background:{m_c}"></div>
            <div style="flex:1">
                <p class="task-prim" style="{'opacity:0.3' if t['comp'] else ''}">{t['text']} <span class="pulse-glow">{ico("flame", "#DC2626", 16)}</span></p>
                <div class="task-meta">
                    <span style="display:flex; align-items:center; gap:8px">{ico("calendar", "#475569", 12)} 2 APR</span>
                    <span style="display:flex; align-items:center; gap:10px; color:#ef4444">{ico("clock", "#475569", 12)} 22:20</span>
                </div>
            </div>
            {ico("chevron", "#475569", 18)}
        </div>""", unsafe_allow_html=True)
        with tl3:
            st.markdown('<div class="task-btn">', unsafe_allow_html=True)
            if st.button(ico("trash", "white", 14), key=f"rm_v13_{t['id']}", use_container_width=True): op_logic('del', tid=t['id'])
            st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div style="margin-top:100px; text-align:center"><h2 style="font-size:2.8rem; font-weight:900; color:white; font-family:Outfit; letter-spacing:-0.05em; margin-bottom:5px">Obsidian Protocol</h2><p style="color:#64748b; font-size:1.1rem; margin-bottom:50px">Unlock maximum output via our crimson-grade high-tech logic.</p></div>', unsafe_allow_html=True)
    feat_cols = st.columns(3)
    render_feat(feat_cols[0], "Neural Sync", "Real-time task synchronization across local neural nodes.", "flame")
    render_feat(feat_cols[1], "Fortified", "Obsidian-grade persistence ensures your data never de-materializes.", "clock")
    render_feat(feat_cols[2], "Supersonic", "Ultra-low latency rendering powered by modern logic engines.", "zap")

    st.markdown('<div style="margin-top:120px; padding:60px 0; border-top:1px solid rgba(255,255,255,0.05); text-align:center;"><p style="color:#475569; font-size:10px; font-weight:900; letter-spacing:0.8em; text-transform:uppercase;">Orchestrated By <span style="background:var(--crimson-500); color:white; padding:3px 12px; border-radius:6px; box-shadow:0 0 12px rgba(220,38,38,0.4)">Manohar K</span> | AI Systems</p></div>', unsafe_allow_html=True)
