import streamlit as st
import json
import os
import uuid
from datetime import datetime

# --- CONFIGURATION & THEME ---
st.set_page_config(
    page_title="Smart Todo AI – Obsidian Crimson Edition",
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

# --- CSS & JS INJECTION (THE WOW FACTOR) ---
def inject_custom_assets():
    st.markdown(
        """
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=Outfit:wght@500;600;700;900&display=swap" rel="stylesheet">
        
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

            /* Hide default cursor */
            html, body, [data-testid="stAppViewContainer"] {
                cursor: none !important;
                background-color: var(--obsidian-950) !important;
            }

            .main {
                background-color: transparent !important;
            }

            /* Typography */
            h1, h2, h3 {
                font-family: 'Outfit', sans-serif !important;
                color: white !important;
                letter-spacing: -0.05em !important;
            }

            p, div, span {
                font-family: 'Inter', sans-serif !important;
            }

            /* Obsidian Cards */
            .glass-card {
                background: rgba(255, 255, 255, 0.02) !important;
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 24px;
                padding: 24px;
                margin-bottom: 16px;
                transition: all 0.4s ease;
            }

            .glass-card:hover {
                background: rgba(255, 255, 255, 0.04) !important;
                border-color: rgba(220, 38, 38, 0.3);
                box-shadow: 0 0 30px rgba(220, 38, 38, 0.1);
                transform: translateY(-4px);
            }

            /* Neon Accents */
            .hero-gradient {
                background: linear-gradient(135deg, #fff 0%, #fecaca 50%, #dc2626 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-weight: 900;
            }

            /* Input Styling */
            input, textarea {
                background: rgba(0,0,0,0.3) !important;
                border-color: rgba(255,255,255,0.05) !important;
                color: white !important;
                border-radius: 12px !important;
            }

            /* Buttons */
            .stButton > button {
                background: linear-gradient(90deg, #b91c1c, #dc2626) !important;
                color: white !important;
                border: none !important;
                border-radius: 12px !important;
                font-weight: 800 !important;
                padding: 12px 24px !important;
                transition: all 0.3s ease !important;
            }

            .stButton > button:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 0 20px rgba(220, 38, 38, 0.4) !important;
            }

            /* Molten Blobs */
            .blob-bg {
                position: fixed;
                width: 600px;
                height: 600px;
                background: rgba(220, 38, 38, 0.15);
                filter: blur(140px);
                border-radius: 50%;
                z-index: -1;
                pointer-events: none;
            }

            @keyframes molten {
                0% { transform: translate(0, 0) scale(1); }
                50% { transform: translate(2%, 2%) scale(1.1); }
                100% { transform: translate(0, 0) scale(1); }
            }
        </style>

        <div class="blob-bg" style="top: -10%; left: -10%; animation: molten 10s infinite alternate;"></div>
        <div class="blob-bg" style="bottom: -10%; right: -10%; animation: molten 8s infinite reverse;"></div>

        <!-- FUTURISTIC FLAMETHROWER JS -->
        <script>
            setTimeout(() => {
                const canvas = document.createElement('div');
                canvas.id = 'flame-engine';
                canvas.style.position = 'fixed';
                canvas.style.inset = '0';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '9999';
                document.body.appendChild(canvas);

                const mouse = { x: 0, y: 0 };
                const lastMouse = { x: 0, y: 0 };
                const particles = [];
                const MAX_PARTICLES = 25;

                // Custom Pointer
                const pointer = document.createElement('div');
                pointer.style.width = '12px';
                pointer.style.height = '12px';
                pointer.style.borderRadius = '50%';
                pointer.style.backgroundColor = 'white';
                pointer.style.position = 'fixed';
                pointer.style.zIndex = '10000';
                pointer.style.boxShadow = '0 0 15px #fff, 0 0 30px #dc2626';
                pointer.style.transform = 'translate(-50%, -50%)';
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
                        particles.push({
                            x: mouse.x,
                            y: mouse.y,
                            vx: -vx * 1.5 + (Math.random() - 0.5) * 5,
                            vy: -vy * 1.5 + (Math.random() - 0.5) * 5,
                            life: 1.0,
                            size: Math.random() * 15 + 10,
                            color: Math.random() > 0.7 ? '#fff' : (Math.random() > 0.4 ? '#f59e0b' : '#dc2626')
                        });
                    }
                    lastMouse.x = mouse.x;
                    lastMouse.y = mouse.y;
                }

                function update() {
                    createParticle();
                    
                    // Clear previous frame logic
                    const engine = document.getElementById('flame-engine');
                    engine.innerHTML = '';

                    for (let i = particles.length - 1; i >= 0; i--) {
                        const p = particles[i];
                        p.x += p.vx;
                        p.y += p.vy;
                        p.life -= 0.04;
                        p.size *= 0.95;

                        if (p.life <= 0 || p.size < 1) {
                            particles.splice(i, 1);
                            continue;
                        }

                        const el = document.createElement('div');
                        el.style.position = 'absolute';
                        el.style.left = p.x + 'px';
                        el.style.top = p.y + 'px';
                        el.style.width = p.size + 'px';
                        el.style.height = p.size + 'px';
                        el.style.backgroundColor = p.color;
                        el.style.borderRadius = '50%';
                        el.style.opacity = p.life;
                        el.style.filter = 'blur(4px)';
                        el.style.transform = 'translate(-50%, -50%)';
                        el.style.boxShadow = `0 0 15px ${p.color}`;
                        engine.appendChild(el);
                    }

                    requestAnimationFrame(update);
                }

                update();
            }, 500);
        </script>
        """,
        unsafe_allow_html=True
    )

inject_custom_assets()

# --- LOGIC ---
def add_task(text, desc="", date=None):
    new_task = {
        "id": str(uuid.uuid4()),
        "text": text,
        "description": desc,
        "completed": False,
        "date": date.strftime("%Y-%m-%d") if date else None,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    st.session_state.tasks.append(new_task)
    save_tasks(st.session_state.tasks)

def toggle_task(idx):
    st.session_state.tasks[idx]["completed"] = not st.session_state.tasks[idx]["completed"]
    save_tasks(st.session_state.tasks)

def delete_task(idx):
    st.session_state.tasks.pop(idx)
    save_tasks(st.session_state.tasks)

# --- UI LAYOUT ---
st.markdown('<div style="text-align: center; margin-top: 50px;">', unsafe_allow_html=True)
st.markdown('<p style="font-weight: 800; letter-spacing: 0.4em; color: #dc2626; font-size: 12px; text-transform: uppercase;">Futuristic Crimson Protocol</p>', unsafe_allow_html=True)
st.markdown('<h1 class="hero-gradient" style="font-size: 72px; margin-bottom: 10px;">Smart Todo AI</h1>', unsafe_allow_html=True)
st.markdown('<p style="color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto;">Liquid-fire orchestration for elite professional workflows.</p>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Stats Row
completed_count = len([t for t in st.session_state.tasks if t.completed])
total_count = len(st.session_state.tasks)
pending_count = total_count - completed_count

col1, col2, col3 = st.columns(3)
with col1:
    st.markdown(f'<div class="glass-card"><p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em;">Active Units</p><h2 style="font-size: 48px;">{total_count}</h2></div>', unsafe_allow_html=True)
with col2:
    st.markdown(f'<div class="glass-card"><p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em;">Success State</p><h2 style="font-size: 48px; color: #e11d48 !important;">{completed_count}</h2></div>', unsafe_allow_html=True)
with col3:
    st.markdown(f'<div class="glass-card"><p style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em;">Pending Logic</p><h2 style="font-size: 48px; color: #f59e0b !important;">{pending_count}</h2></div>', unsafe_allow_html=True)

# Input Section
st.markdown('<div class="glass-card">', unsafe_allow_html=True)
with st.form("task_form", clear_on_submit=True):
    task_text = st.text_input("Assemble a new primitive...", placeholder="Enter task title...")
    task_desc = st.text_area("Define operational parameters (optional)...", placeholder="Enter description...")
    task_date = st.date_input("Temporal Anchor")
    
    submitted = st.form_submit_button("Initialize")
    if submitted and task_text:
        add_task(task_text, task_desc, task_date)
        st.rerun()
st.markdown('</div>', unsafe_allow_html=True)

# Task List
st.markdown('<div style="margin-top: 40px;">', unsafe_allow_html=True)
if not st.session_state.tasks:
    st.markdown('<div style="text-align: center; padding: 60px; color: #475569;">Zero operational tasks detected. Initialize a new orchestrator to begin.</div>', unsafe_allow_html=True)
else:
    for i, task in enumerate(reversed(st.session_state.tasks)):
        idx = len(st.session_state.tasks) - 1 - i
        with st.container():
            cols = st.columns([0.1, 0.7, 0.1, 0.1])
            with cols[0]:
                if st.button("✓", key=f"check_{task['id']}"):
                    toggle_task(idx)
                    st.rerun()
            with cols[1]:
                text_style = "text-decoration: line-through; color: #475569;" if task['completed'] else "color: white;"
                st.markdown(f'<div style="{text_style} font-size: 20px; font-weight: 700;">{task["text"]}</div>', unsafe_allow_html=True)
                if task['description']:
                    st.markdown(f'<div style="color: #64748b; font-size: 14px; margin-top: 4px;">{task["description"]}</div>', unsafe_allow_html=True)
            with cols[2]:
                 st.markdown(f'<div style="color: #334155; font-size: 12px; margin-top: 8px;">{task["date"] or "No date"}</div>', unsafe_allow_html=True)
            with cols[3]:
                if st.button("🗑", key=f"del_{task['id']}"):
                    delete_task(idx)
                    st.rerun()
            st.markdown('<hr style="border-color: rgba(255,255,255,0.05); margin: 20px 0;">', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown('<div style="margin-top: 100px; text-align: center; color: #334155; font-size: 10px; letter-spacing: 0.5em; text-transform: uppercase;">Orchestrated By Manohar K | Python Edition</div>', unsafe_allow_html=True)
