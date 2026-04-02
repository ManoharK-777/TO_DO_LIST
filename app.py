import streamlit as st
import json
import os
import uuid
from datetime import datetime

# --- CONFIGURATION & THEME ---
st.set_page_config(
    page_title="Smart Todo AI – Obsidian Crimson Protocol",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# --- PERSISTENCE ---
DB_FILE = "tasks.json"

def load_tasks():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open(DB_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

if "tasks" not in st.session_state:
    st.session_state.tasks = load_tasks()
if "filter" not in st.session_state:
    st.session_state.filter = "all"

# --- CSS & JS INJECTION ---
def inject_custom_assets():
    st.markdown(
        """
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">
        
        <style>
            :root {
                --obsidian-950: #050505;
                --obsidian-900: #0A0A0A;
                --obsidian-800: #121212;
                --crimson-400: #EF4444;
                --crimson-500: #DC2626;
                --crimson-600: #B91C1C;
                --rose-gold: #E11D48;
            }

            /* Global Overrides */
            html, body, [data-testid="stAppViewContainer"] {
                cursor: none !important;
                background-color: var(--obsidian-950) !important;
                color: #fff !important;
            }
            .stApp {
                background: transparent !important;
            }

            /* Hide Streamlit components headers/footers */
            header[data-testid="stHeader"] { display: none !important; }
            footer { display: none !important; }

            /* Typography */
            h1, h2, h3, h4, h5, h6 {
                font-family: 'Outfit', sans-serif !important;
                color: white !important;
            }
            p, div, span, label, input, textarea {
                font-family: 'Inter', sans-serif !important;
            }

            /* Container Spacing & Layout */
            .block-container {
                max-width: 1000px !important;
                padding-top: 4rem !important;
                padding-bottom: 8rem !important;
            }

            /* Molten Blobs */
            .blob-bg {
                position: fixed;
                width: 600px;
                height: 600px;
                background: rgba(220, 38, 38, 0.12);
                filter: blur(140px);
                border-radius: 50%;
                z-index: -10;
                pointer-events: none;
            }
            @keyframes molten {
                0% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(2%, 2%) scale(1.1); }
                100% { transform: translate(0, 0) scale(1); }
            }

            /* Glass Cards / Metric Cards */
            div[data-testid="stMetricValue"] {
                font-size: 3rem !important;
                font-weight: 900 !important;
                color: #fff !important;
            }
            div[data-testid="stMetricLabel"] {
                font-size: 0.7rem !important;
                font-weight: 800 !important;
                letter-spacing: 0.2em !important;
                text-transform: uppercase !important;
                color: #64748b !important;
            }
            /* Style metric container to look like glass cards */
            div[data-testid="metric-container"] {
                background: rgba(255, 255, 255, 0.02) !important;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 24px;
                padding: 24px;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);
                transition: all 0.4s ease;
            }
            div[data-testid="metric-container"]:hover {
                border-color: rgba(220, 38, 38, 0.3);
                box-shadow: 0 0 30px rgba(220, 38, 38, 0.15);
                transform: translateY(-4px);
            }

            /* Hero Buttons */
            .hero-btn {
                display: inline-block;
                padding: 14px 28px;
                border-radius: 16px;
                font-weight: 800;
                font-size: 14px;
                text-decoration: none;
                transition: all 0.3s;
                margin: 0 10px;
            }
            .hero-btn-primary {
                background: white;
                color: var(--obsidian-950);
                box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
            }
            .hero-btn-primary:hover {
                transform: scale(1.05);
                box-shadow: 0 0 20px rgba(255,255,255,0.4);
            }
            .hero-btn-secondary {
                background: rgba(185, 28, 28, 0.1);
                border: 1px solid rgba(220, 38, 38, 0.2);
                color: white;
                backdrop-filter: blur(10px);
            }
            .hero-btn-secondary:hover {
                background: var(--crimson-600);
            }

            /* Form Elements */
            input[type="text"], textarea, .stDateInput input, .stTimeInput input {
                background: rgba(255, 255, 255, 0.02) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 255, 255, 0.05) !important;
                border-radius: 20px !important;
                color: white !important;
                padding: 16px 20px !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                transition: all 0.3s !important;
            }
            input[type="text"]:focus, textarea:focus {
                border-color: rgba(220, 38, 38, 0.6) !important;
                box-shadow: 0 0 25px rgba(220, 38, 38, 0.3) !important;
            }

            /* Streamlit Buttons */
            .stButton > button {
                background: linear-gradient(90deg, #b91c1c, #dc2626) !important;
                color: white !important;
                border: none !important;
                border-radius: 16px !important;
                font-weight: 800 !important;
                padding: 10px 24px !important;
                height: 100% !important;
                min-height: 50px !important;
                transition: all 0.3s ease !important;
            }
            .stButton > button:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 0 20px rgba(220, 38, 38, 0.5) !important;
            }

            /* Task Items Container */
            .task-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 36px;
                padding: 24px;
                margin-bottom: 16px;
                position: relative;
                overflow: hidden;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);
            }
            .task-completed {
                opacity: 0.6;
                filter: grayscale(0.5);
            }
            .task-indicator {
                position: absolute;
                left: 0; top: 0; bottom: 0; width: 8px;
                background: var(--crimson-500);
                box-shadow: 0 0 15px rgba(220,38,38,0.5);
            }
            .task-indicator.completed {
                background: var(--rose-gold);
                box-shadow: 0 0 15px rgba(225,29,72,0.5);
            }

            /* Feature Matrix Cards */
            .feature-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.04);
                border-radius: 40px;
                padding: 40px;
                text-align: left;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.4);
                transition: transform 0.4s ease;
                height: 100%;
            }
            .feature-card:hover {
                transform: translateY(-8px);
                border-color: rgba(220, 38, 38, 0.3);
            }
            .feature-icon-wrapper {
                width: 56px; height: 56px;
                background: rgba(185, 28, 28, 0.1);
                border-radius: 16px;
                display: flex; align-items: center; justify-content: center;
                margin-bottom: 24px;
                color: var(--crimson-400);
            }

        </style>

        <!-- Molten Blobs Background -->
        <div class="blob-bg" style="top: -10%; left: -10%; animation: molten 10s infinite alternate;"></div>
        <div class="blob-bg" style="bottom: -10%; right: -10%; animation: molten 8s infinite reverse; background: rgba(225, 29, 72, 0.08);"></div>
        
        <!-- FLAMETHROWER CURSOR INJECTION -->
        <img src="dummy_cursor.gif" style="display:none;" onerror="
            if (!window.flameEngineInjected) {
                window.flameEngineInjected = true;
                
                const canvas = document.createElement('div');
                canvas.id = 'flame-engine';
                canvas.style.position = 'fixed';
                canvas.style.inset = '0';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '9999';
                document.body.appendChild(canvas);

                const mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
                const lastMouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
                const particles = [];

                const pointer = document.createElement('div');
                pointer.style.width = '12px';
                pointer.style.height = '12px';
                pointer.style.borderRadius = '50%';
                pointer.style.backgroundColor = 'white';
                pointer.style.position = 'fixed';
                pointer.style.zIndex = '10000';
                pointer.style.boxShadow = '0 0 15px #fff, 0 0 30px #dc2626';
                pointer.style.transform = 'translate(-50%, -50%)';
                pointer.style.pointerEvents = 'none';
                document.body.appendChild(pointer);

                window.addEventListener('mousemove', (e) => {
                    mouse.x = e.clientX;
                    mouse.y = e.clientY;
                    pointer.style.left = e.clientX + 'px';
                    pointer.style.top = e.clientY + 'px';
                });

                function createParticle() {
                    const vx = mouse.x - lastMouse.x;
                    const vy = mouse.y - lastMouse.y;
                    if (Math.hypot(vx, vy) > 2) {
                        for(let i=0; i<2; i++){
                            particles.push({
                                x: mouse.x, y: mouse.y,
                                vx: -vx * 1.5 + (Math.random() - 0.5) * 8,
                                vy: -vy * 1.5 + (Math.random() - 0.5) * 8,
                                life: 1.0, size: Math.random() * 20 + 10,
                                color: Math.random() > 0.7 ? '#fff' : (Math.random() > 0.4 ? '#f59e0b' : '#dc2626')
                            });
                        }
                    }
                    lastMouse.x = mouse.x; lastMouse.y = mouse.y;
                }

                function update() {
                    createParticle();
                    const engine = document.getElementById('flame-engine');
                    if(engine) engine.innerHTML = '';
                    
                    for (let i = particles.length - 1; i >= 0; i--) {
                        const p = particles[i];
                        p.x += p.vx; p.y += p.vy; p.life -= 0.04; p.size *= 0.95;
                        if (p.life <= 0 || p.size < 1) { particles.splice(i, 1); continue; }
                        const el = document.createElement('div');
                        el.style.position = 'absolute'; el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
                        el.style.width = p.size + 'px'; el.style.height = p.size + 'px';
                        el.style.backgroundColor = p.color; el.style.borderRadius = '50%';
                        el.style.opacity = p.life; el.style.filter = 'blur(4px)';
                        el.style.transform = 'translate(-50%, -50%)';
                        el.style.boxShadow = '0 0 15px ' + p.color; el.style.mixBlendMode = 'screen';
                        if(engine) engine.appendChild(el);
                    }
                    requestAnimationFrame(update);
                }
                update();
            }
        ">
        """,
        unsafe_allow_html=True
    )

inject_custom_assets()

# --- HEADER SECTION ---
st.markdown("""
<div style='text-align: center; margin-bottom: 3rem;'>
    <div style='display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 99px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3); color: #ef4444; font-size: 10px; font-weight: 900; letter-spacing: 0.4em; text-transform: uppercase; margin-bottom: 2rem;'>
        🔥 Futuristic Crimson Protocol
    </div>
    <h1 style='font-size: 5rem; font-weight: 900; line-height: 1; margin-bottom: 1rem; background: linear-gradient(135deg, #fff 0%, #fecaca 50%, #dc2626 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>
        Smart Todo AI
    </h1>
    <p style='color: #94a3b8; font-size: 1.25rem; max-width: 600px; margin: 0 auto; font-weight: 500;'>
        Liquid-fire orchestration for elite professional workflows.
    </p>
    <div style='margin-top: 2.5rem; display: flex; justify-content: center; gap: 20px;'>
        <a href="#dashboard" class="hero-btn hero-btn-primary">Go to Dashboard</a>
        <a href="#protocol" class="hero-btn hero-btn-secondary">Learn More</a>
    </div>
</div>
""", unsafe_allow_html=True)

# --- STATS ROW ---
st.markdown('<div id="dashboard"></div>', unsafe_allow_html=True)

completed_count = len([t for t in st.session_state.tasks if t.get('completed', False)])
total_count = len(st.session_state.tasks)
pending_count = total_count - completed_count

st.markdown('<style>div[data-testid="column"] { padding: 0; }</style>', unsafe_allow_html=True) # Reduce default col padding
c1, c2, c3 = st.columns(3)
c1.metric("Active Units", total_count)
c2.metric("Success State", completed_count)
c3.metric("Pending Logic", pending_count)

st.write("")
st.write("")

# --- INPUT ROW ---
with st.container():
    col_input, col_init = st.columns([0.8, 0.2])
    with col_input:
        task_text = st.text_input("Assemble", placeholder="Assemble a new primitive...", label_visibility="collapsed")
    with col_init:
        if st.button("＋ Initialize", use_container_width=True):
            if task_text:
                new_task = {
                    "id": str(uuid.uuid4()),
                    "text": task_text,
                    "description": "",
                    "completed": False,
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                st.session_state.tasks.insert(0, new_task)
                save_tasks(st.session_state.tasks)
                st.rerun()

st.write("")

# --- FILTER ROW ---
# Using Streamlit columns logic to emulate pills
f_col1, f_col2, f_col3, _ = st.columns([0.2, 0.2, 0.2, 0.4])
with f_col1:
    if st.button(f"≡ ALL LOGIC  {total_count}", use_container_width=True): st.session_state.filter = "all"; st.rerun()
with f_col2:
    if st.button(f"◷ PROCESSING  {pending_count}", use_container_width=True): st.session_state.filter = "pending"; st.rerun()
with f_col3:
    if st.button(f"✓ FINALIZED  {completed_count}", use_container_width=True): st.session_state.filter = "completed"; st.rerun()

st.markdown("<hr style='border-color: rgba(255,255,255,0.05); margin: 1rem 0 2rem;' />", unsafe_allow_html=True)

# --- TASK LIST RECIPE ---
filtered_tasks = []
if st.session_state.filter == "completed":
    filtered_tasks = [t for t in st.session_state.tasks if t.get('completed', False)]
elif st.session_state.filter == "pending":
    filtered_tasks = [t for t in st.session_state.tasks if not t.get('completed', False)]
else:
    filtered_tasks = st.session_state.tasks

def toggle_task(task_id):
    for t in st.session_state.tasks:
        if t['id'] == task_id:
            t['completed'] = not t.get('completed', False)
            break
    save_tasks(st.session_state.tasks)

def delete_task(task_id):
    st.session_state.tasks = [t for t in st.session_state.tasks if t['id'] != task_id]
    save_tasks(st.session_state.tasks)

if not filtered_tasks:
    st.markdown("""
    <div style="text-align: center; padding: 4rem; background: rgba(255,255,255,0.02); border-radius: 40px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 20px rgba(0,0,0,0.4);">
        <div style="width: 64px; height: 64px; background: rgba(220,38,38,0.1); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🔥</div>
        <h3 style="margin-bottom: 8px;">System Sanitized</h3>
        <p style="color: #64748b;">Zero active primitives detected. Initialize a new orchestrator to begin.</p>
    </div>
    """, unsafe_allow_html=True)
else:
    for task in filtered_tasks:
        is_done = task.get('completed', False)
        card_class = "task-card task-completed" if is_done else "task-card"
        indicator_class = "task-indicator completed" if is_done else "task-indicator"
        date_str = task.get('date', '')

        # HTML Structure for Task Card
        st.markdown(f"""
        <div class="{card_class}">
            <div class="{indicator_class}"></div>
            <div style="display: flex; align-items: center; gap: 24px; padding-left: 20px;">
                <div style="flex-grow: 1;">
                    <h3 style="margin: 0; font-size: 1.5rem; text-decoration: {'line-through' if is_done else 'none'}; color: {'#64748b' if is_done else '#fff'};">{task['text']}</h3>
                    <div style="display: flex; align-items: center; gap: 16px; margin-top: 12px;">
                        <span style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em;">🗓 {date_str}</span>
                        {f'<span style="padding: 4px 12px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.2); border-radius: 8px; font-size: 10px; font-weight: 800; color: #ef4444; text-transform: uppercase;">⚡ Pending</span>' if not is_done else '<span style="padding: 4px 12px; background: rgba(225,29,72,0.1); border: 1px solid rgba(225,29,72,0.2); border-radius: 8px; font-size: 10px; font-weight: 800; color: #e11d48; text-transform: uppercase;">✓ Finalized</span>'}
                    </div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # Placing functional buttons directly underneath/aligned via columns
        # To maintain the design illusion, we put buttons right after the HTML render
        b1, b2, b3, b4 = st.columns([0.15, 0.15, 0.6, 0.1])
        with b1:
            if st.button("✅ Toggle Phase", key=f"tog_{task['id']}"):
                toggle_task(task['id'])
                st.rerun()
        with b2:
            if st.button("🗑 Destroy", key=f"del_{task['id']}"):
                delete_task(task['id'])
                st.rerun()
        st.markdown("<div style='margin-bottom: 24px;'></div>", unsafe_allow_html=True)

# --- OBSIDIAN PROTOCOL SECTION ---
st.markdown('<div id="protocol" style="padding-top: 6rem; padding-bottom: 4rem; text-align: center;">', unsafe_allow_html=True)
st.markdown("""
<h2 style='font-size: 3rem; font-weight: 900; margin-bottom: 1rem;'>Obsidian Protocol</h2>
<p style='color: #64748b; font-size: 1.2rem; max-width: 500px; margin: 0 auto 4rem;'>Unlock maximum output via our crimson-grade high-tech logic.</p>
""", unsafe_allow_html=True)

st.markdown('<style>div[data-testid="column"] { padding: 0 10px; }</style>', unsafe_allow_html=True)
m1, m2, m3 = st.columns(3)

with m1:
    st.markdown("""
    <div class="feature-card">
        <div class="feature-icon-wrapper">🧠</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Neural Sync</h3>
        <p style="color: #64748b; line-height: 1.6;">Real-time task synchronization across local neural nodes safely stored in your file system.</p>
    </div>
    """, unsafe_allow_html=True)

with m2:
    st.markdown("""
    <div class="feature-card">
        <div class="feature-icon-wrapper">🛡️</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Fortified</h3>
        <p style="color: #64748b; line-height: 1.6;">Obsidian-grade persistence ensures your datastreams never de-materialize during compute.</p>
    </div>
    """, unsafe_allow_html=True)

with m3:
    st.markdown("""
    <div class="feature-card">
        <div class="feature-icon-wrapper">🚀</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 16px;">Supersonic</h3>
        <p style="color: #64748b; line-height: 1.6;">Ultra-low latency rendering powered by modern Streamlit and injected Python architecture.</p>
    </div>
    """, unsafe_allow_html=True)

st.markdown('</div>', unsafe_allow_html=True)

# --- FOOTER ---
st.markdown("""
<div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; margin-top: 4rem; text-align: center;">
    <p style="color: #64748b; font-size: 10px; font-weight: 900; letter-spacing: 0.5em; text-transform: uppercase;">
        Orchestrated By <span style="color: #dc2626;">Manohar K</span> | AI Systems
    </p>
</div>
""", unsafe_allow_html=True)
