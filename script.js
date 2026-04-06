/* ============================================
   meowmet PORTFOLIO
   Cyber-AI Fusion — CTF Terminal Edition
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTerminal();
  initNavigation();
  initScrollReveal();
  initProjectFilters();
  initProjectModal();
  initCertsAccordion();
  initCounters();
  initCoreVisuals();
  initMouseEffects();
  initProjectReadButtons();
});


/* ============================================
   MOUSE EFFECTS
   ============================================ */
function initMouseEffects() {
  const glow = document.getElementById('mouse-glow');
  const dot  = document.getElementById('mouse-dot');
  const rippleContainer = document.getElementById('ripple-container');
  if (!glow || !dot) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateGlow() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  document.addEventListener('click', e => {
    if (!rippleContainer) return;
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    rippleContainer.appendChild(r);
    setTimeout(() => r.remove(), 800);
  });
}


/* ============================================
   PARTICLES
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x       = Math.random() * canvas.width;
      this.y       = Math.random() * canvas.height;
      this.size    = Math.random() * 1.5 + 0.5;
      this.speedX  = (Math.random() - 0.5) * 0.3;
      this.speedY  = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color   = Math.random() > 0.5 ? '0,255,65' : '0,180,216';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,65,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', init);
}


/* ============================================
   INTERACTIVE TERMINAL — CTF Edition v3.0
   ============================================ */
function initTerminal() {
  const history  = document.getElementById('terminal-history');
  const inputEl  = document.getElementById('terminal-input');
  const termBody = document.getElementById('hero-terminal-body');
  const promptEl = document.getElementById('terminal-prompt');
  const inputLine = document.getElementById('terminal-input-line');
  const heroTerminal = document.querySelector('.hero-terminal');
  if (!history || !inputEl) return;

  let cmdHistory = [];
  let historyIdx = -1;
  let isRoot = false;
  let currentDir = '/home/nuri'; // guests start in their home directory

  // Prompts
  function currentPrompt() {
    const homeDir = isRoot ? '/root' : '/home/nuri';
    const displayDir = currentDir === homeDir ? '~' : currentDir;
    return isRoot ? `root@meowmet:${displayDir}#` : `guest@meowmet:${displayDir}$`;
  }

  function updatePromptUI() {
    if (promptEl) {
      promptEl.innerHTML = currentPrompt() + '&nbsp;';
      promptEl.classList.toggle('root-mode', isRoot);
    }
    if (inputEl) {
      inputEl.classList.toggle('root-mode', isRoot);
    }
    if (inputLine) {
      inputLine.classList.toggle('root-mode', isRoot);
    }
    if (heroTerminal) {
      heroTerminal.classList.toggle('root-mode', isRoot);
    }
  }

  // Real Linux Filesystem with permission system
  // Structure: path -> {type: 'file'|'dir', content?, owner, group, mode}
  // mode: Unix permissions (e.g., 0o644, 0o755, 0o600)
  const FS = {
    // Directories
    '/': { type: 'dir', owner: 'root', group: 'root', mode: 0o755 },
    '/root': { type: 'dir', owner: 'root', group: 'root', mode: 0o700 },
    '/etc': { type: 'dir', owner: 'root', group: 'root', mode: 0o755 },
    '/home': { type: 'dir', owner: 'root', group: 'root', mode: 0o755 },
    '/home/nuri': { type: 'dir', owner: 'nuri', group: 'nuri', mode: 0o755 },
    
    // Root files (highly restricted)
    '/root/.bashrc': { type: 'file', content: '# Root bashrc config\nalias ll="ls -la"\nalias la="ls -A"', owner: 'root', group: 'root', mode: 0o644 },
    '/root/matrix_tutorial.txt': { type: 'file', content: `Matrix Rain Effect — Learning Guide
=====================================

The matrix easter egg (type "matrix") showcases a classic digital rain effect
inspired by the Matrix movies. Here's how it works:

1. CANVAS: Uses HTML5 Canvas for rendering
2. CHARACTERS: Mixes ASCII, numbers, and Japanese katakana
3. ANIMATION: Characters fall at random speeds from top to bottom
4. RESET: When a column fills, it resets and starts over
5. COLOR: Neon green (#00FF41) to match authentic Matrix aesthetic
6. PERFORMANCE: Uses requestAnimationFrame for smooth 60fps rendering

Technical Implementation:
- Canvas dimensions: Full viewport (window.innerWidth/Height)
- Font: JetBrains Mono at 14px size
- Refresh rate: Per frame (~16.67ms at 60fps)
- Duration: Effect runs for 3 seconds then clears
- Gradient fade: Dark semi-transparent overlay for trails

Use the "matrix" command while logged in as root to see this effect!
Try it now: matrix`, owner: 'root', group: 'root', mode: 0o644 },
    '/root/commands_reference.txt': { type: 'file', content: `MeowmetOS Terminal — Commands Reference
=========================================

IMPORTANT: Most commands require ROOT privileges!
Non-root users will receive "⚠️ You don't have permission" errors.

CORE COMMANDS (Require Root):
  cd <path>          Navigate directories (/, /root, /home, /etc, etc.)
  ls                 List current directory (with colors & symbols)
  ls -a              Show hidden files (includes dotfiles)
  ls -la             Long format with details
  pwd                Print working directory path
  cat <file>         Read file contents (permission-checked)
  whoami             Display current user identity
  one piece          Easter egg - The One Piece! (Root only)
  matrix             Easter egg - Digital rain effect (Root only)

ROOT PRIVILEGE SYSTEM:
  su root            Attempt to escalate to root (requires password)
  exit               Exit root mode, return to guest shell
  Ctrl+D             Alternative exit from root

FILE STRUCTURE:
  /                  Root directory
  /root              Root user home directory (root-only files)
  /home              User home directories
  /etc               System configuration files
  /etc/profile       User profile information
  /etc/hostname      System hostname
  /etc/os-release    OS information
  /etc/languages     Languages configuration

SPECIAL FILES (Root Only):
  /root/matrix_tutorial.txt      How the matrix effect works
  /root/commands_reference.txt   This file - command documentation

HIDDEN FILES:
  .bashrc            Shell configuration
  .secret_key        Base64-encoded sensitive data

NAVIGATION TIPS:
  cd /              Go to root directory
  cd /root          Enter root's home (requires root privilege)
  cd /etc           View system config
  pwd               Always check where you are!

PERMISSION LOGIC:
  Root user (root): Full access to all files and commands
  Guest user (guest): Limited access, permission denied on sensitive files
  
Try: su root (password: purrfect-password)`, owner: 'root', group: 'root', mode: 0o644 },
    '/root/.secret_key': { type: 'file', content: 'cHVycmZlY3QtcGFzc3dvcmQ=', owner: 'root', group: 'root', mode: 0o600 },
    
    // System files
    '/etc/profile': { type: 'file', content: `name:       Nuri (Mehmet Nuri Erkan)
alias:      Meowmet
location:   Ankara, Türkiye
university: Atatürk University — Computer Engineering, 3rd Year
focus:      AI/ML  ·  Cybersecurity (Offensive)  ·  Automation
shell:      /bin/zsh  (obviously)
editor:     vim  (no regrets)
anime:      One Piece  ·  Gundam  (GRUB theme exists. yes.)`, owner: 'root', group: 'root', mode: 0o644 },
    '/etc/hostname': { type: 'file', content: 'meowmet', owner: 'root', group: 'root', mode: 0o644 },
    '/etc/os-release': { type: 'file', content: `NAME="MeowmetOS"
VERSION="3.0-atauni"
ID=meowmet
PRETTY_NAME="MeowmetOS 3.0 (Cyber-AI Fusion)"
HOME_URL="https://meowmet.github.io"`, owner: 'root', group: 'root', mode: 0o644 },
    '/etc/languages': { type: 'file', content: `🇹🇷  Türkçe     ──────────────────────── Native (ana dil)
🇮🇩  Indonesian ──────────────────────── Fluent(B2) 
🇬🇧  English    ────────────────────░░░░ B2-C1
🇸🇦  Arabic     ───────░░░░░░░░░░░░░░░░░ A1 `, owner: 'root', group: 'root', mode: 0o644 },
    
    // Home files
    '/home/nuri/.secret_key': { type: 'file', content: 'cHVycmZlY3QtcGFzc3dvcmQ=', owner: 'nuri', group: 'nuri', mode: 0o600 },
    '/home/nuri/achievements.log': { type: 'file', content: `#01 🥇 1st Place  ── Atasiber "SPEED HACK: EXPLOIT RUN" CTF      [Dec 2025]
#02 🥉 3rd Place  ── AI Spark Hackathon · Property Estimation     [2025]
#03 📊 Rank 41/659── Kaggle Customer Churn (Score: 1.23938)       [2025]
#04 📊 Top 7%     ── ING Hubs Türkiye Datathon (Kaggle)           [2025]
#05 🔤 Top 25%    ── Deep Past Initiative · Akkadian NLP (ByT5)   [2026]`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/social_links.json': { type: 'file', content: `{
  "github":   "github.com/meowmet",
  "linkedin": "linkedin.com/in/mehmet-nuri-erkan-97b024347",
  "telegram": "t.me/miyavmet",
  "thm":      "tryhackme.com/p/Meowmet",
  "medium":   "medium.com/@meowmetnuwri"
}`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/skills.yaml': { type: 'file', content: `intelligence_core:
  - Python (Advanced)
  - Machine Learning
  - NLP / Transformers
  - LightGBM / XGBoost
  - Deep Learning
  - Streamlit
  - Data Pipelines

security_core:
  - Kali Linux
  - Metasploit
  - Penetration Testing
  - Web Security
  - CTF / OSINT
  - Network Security

general_ops:
  - Linux Terminal (Advanced)
  - Git / SQL / C++ / C / C#
  - Flask / React / JavaScript
  - Selenium / Firebase / Docker`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    
    // Projects directory
    '/home/nuri/projects': { type: 'dir', owner: 'nuri', group: 'nuri', mode: 0o755 },
    '/home/nuri/projects/rainsense.md': { type: 'file', content: `# Rainsense — Smart AgriTech AI
Status:     ACTIVE — Teknofest 2026
Role:       Lead AI Developer
Stack:      Python, ML, IoT, Data Pipeline, Streamlit, Sensors

Smart Agriculture AI system for Teknofest 2026 AgriTech competition.
Predicts crop health using real-time weather and soil sensor data
with advanced ML pipelines. Integrates IoT sensor arrays, data
preprocessing, and ensemble model predictions into a unified dashboard.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/tanimatik.md': { type: 'file', content: `# Tanımatık — Medical AI Diagnosis
Status:     ACTIVE — Teknofest 2026
Role:       Lead AI Developer
Stack:      Python, Deep Learning, Medical AI, Computer Vision, CNN

Medical Diagnosis AI system for Teknofest 2026 Healthcare AI track.
Builds intelligent diagnostic tools assisting healthcare professionals
with image-based analysis. Uses deep learning pipelines trained on
medical imaging datasets for real-world clinical assistance.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/deep_past.md': { type: 'file', content: `# Deep Past Initiative — Akkadian NLP
Status:     Kaggle Top 25%
Role:       Solo Developer
Stack:      NLP, Transformer, ByT5, Python, Kaggle, Fine-tuning

NLP architecture for translating Ancient Akkadian cuneiform tablets
to modern English. Fine-tuned a ByT5 Transformer model on historical
linguistic datasets. Pushing boundaries of what language models can
do with ancient scripts.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/meowtools.md': { type: 'file', content: `# MeowTools — Crypto Toolkit
Status:     Portfolio Project
Role:       Solo Developer
Stack:      Python, Cryptography, Encryption, CLI

Custom cryptography and encryption toolkit built in Python.
A modular library of cipher implementations, hash utilities,
and key management tools. Zero third-party crypto dependencies.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/faspa.md': { type: 'file', content: `# FASPA — Fast & Secure Personal Assistant
Status:     Open Source
Role:       Solo Developer
Stack:      C++, Encryption, CLI, AES, Local AI, Security

High-performance local AI assistant with AES-encrypted data handling,
zero telemetry, and zero cloud dependency. Designed for developers
who refuse to send their data to a server they don't control.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/guard_pc.md': { type: 'file', content: `# Guard-PC — Remote PC Monitor
Status:     Open Source
Role:       Solo Developer
Stack:      Python, Telegram API, Monitoring, Security, Automation

Telegram-integrated PC monitoring & security tool. Real-time alerts,
screenshot capture, webcam snapshots, location data, and remote
command execution — all through a Telegram bot.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/web_monitoring_pbl.md': { type: 'file', content: `# Web Monitoring PBL
Status:     Open Source
Role:       Solo Developer
Stack:      Python, Firebase, Security, Logging, Automation

Educational offensive security tool: monitoring tool that logs
browsing history, passwords, and screenshots synced to Firebase.
Built for red-team perspective learning.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/one_piece_grub_theme.md': { type: 'file', content: `# One Piece GRUB Theme
Status:     Open Source
Role:       Designer & Developer
Stack:      GRUB2, Linux, UI Design, Shell

Custom-designed anime-inspired GRUB2 bootloader theme for Linux
enthusiasts with taste. Minimal, clean, and unmistakably One Piece.
Because boring boot screens should be illegal.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/autocell.md': { type: 'file', content: `# Autocell — Office Automation
Status:     Open Source
Role:       Solo Developer
Stack:      Python, Excel, Word, Automation, Macros, GUI

Python automation app for Excel & Word with auto-click and
keyboard macros. Saves hours of repetitive office work through
configurable task sequences.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/maps_scraper.md': { type: 'file', content: `# Google Maps Scraper
Status:     Open Source
Role:       Solo Developer
Stack:      Python, Selenium, Tkinter, Multithreading, CSV

Python Tkinter GUI app using Selenium and multithreading to
scrape business data from Google Maps. Features intelligent
caching, CSV export, and clean UI for batch collection.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/vocab_bot.md': { type: 'file', content: `# Daily Vocab Bot
Status:     Active
Role:       Solo Developer
Stack:      Python, Telegram API, Bot, Automation, NLP

Telegram bot that sends curated Turkish vocabulary words daily
with images to study groups. Part of the Bahasakedi language
learning ecosystem.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/event_management_system.md': { type: 'file', content: `# Event Management System
Status:     Portfolio Project
Role:       Full-Stack Developer
Stack:      Flask, React, Python, JavaScript, Weather API

Full-stack Flask & React application with user roles, event
recommendations, weather API integration, and a ticket cart
system. Role-based access control and responsive frontend.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/bahasakedi.md': { type: 'file', content: `# Bahasakedi — Language Platform
Status:     In Progress
Role:       Creator
Stack:      Web, Languages, Content, Community

Bilingual Turkish ↔ Indonesian language learning platform.
Nuri speaks Indonesian at near-native level — this project
is built from real fluency, not a translation API.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/hatimreader.md': { type: 'file', content: `# HatimReader
Status:     Portfolio Project
Role:       Solo Developer  
Stack:      Web, JavaScript, HTML5, CSS3, Multi-language

Dynamic web application for tracking Quran recitation cycles.
Multi-language support, personal progress tracking, and
community sharing features.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/aqaq.md': { type: 'file', content: `# Aqaq — Challenge Tracker
Status:     Portfolio Project
Role:       Solo Developer
Stack:      Web, JavaScript, HTML5, CSS3

Web-based challenge tracker and calendar for two users.
Shared progress tracking, daily challenge streaks, and
reward GIFs for motivation.`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/projects/aqaq.md': { type: 'file', content: `# Aqaq — Challenge Tracker`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    
    // User achievements and social files
    '/home/nuri/achievements.log': { type: 'file', content: `#01 🥇 1st Place  ── Atasiber "SPEED HACK: EXPLOIT RUN" CTF      [Dec 2025]
#02 🥉 3rd Place  ── AI Spark Hackathon · Property Estimation     [2025]
#03 📊 Rank 41/659── Kaggle Customer Churn (Score: 1.23938)       [2025]
#04 📊 Top 7%     ── ING Hubs Türkiye Datathon (Kaggle)           [2025]
#05 🔤 Top 25%    ── Deep Past Initiative · Akkadian NLP (ByT5)   [2026]`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    '/home/nuri/social_links.json': { type: 'file', content: `{
  "github":   "github.com/meowmet",
  "linkedin": "linkedin.com/in/mehmet-nuri-erkan-97b024347",
  "telegram": "t.me/miyavmet",
  "thm":      "tryhackme.com/p/Meowmet",
  "medium":   "medium.com/@meowmetnuwri"
}`, owner: 'nuri', group: 'nuri', mode: 0o644 },
    
    // Secret root folder with easter egg guides
    '/root/.secret': { type: 'dir', owner: 'root', group: 'root', mode: 0o700 },
    '/root/.secret/treasure.txt': { type: 'file', content: `🏴‍☠️ ONE PIECE EASTER EGG — TREASURE MAP
==========================================

COMMAND: one piece

Ah, you found the treasure! The legendary "One Piece" is an Easter Egg 
hidden in this terminal for true fans of the series.

HOW TO TRIGGER:
1. Escalate to root: su root (password: purrfect-password)
2. Type: one piece
3. Watch as the legendary treasure appears! ⚡

WHAT HAPPENS:
- A glorious image of the One Piece itself appears
- Epic victory music plays to celebrate your achievement
- The Ultimate Treasure Theme echoes through the terminal

LORE:
In the world of One Piece, the legendary One Piece is the ultimate treasure
hidden by the previous Pirate King, Gol. D. Roger. Finding it is the 
final goal of every pirate. This Easter Egg celebrates that dream!

"I'm gonna be King of the Pirates!" — Monkey D. Luffy

Only root users can access this treasure. Guard it well, captain! 🏴‍☠️`, owner: 'root', group: 'root', mode: 0o600 },
    '/root/.secret/01.txt': { type: 'file', content: `💊 MATRIX EASTER EGG — THE BLUE PILL
=====================================

COMMAND: matrix

You've discovered the Matrix Easter Egg! The digital rain effect awaits...

HOW TO TRIGGER:
1. Escalate to root: su root (password: purrfect-password)
2. Type: matrix
3. Witness the legendary digital rain cascading down your terminal

WHAT HAPPENS:
- The entire terminal fills with falling neon green characters
- ASCII digits, letters, and Japanese katakana rain down
- Characters represent the code layers of digital reality
- Effect lasts 3 seconds then clears - blink and you'll miss it!

TECHNICAL BREAKDOWN:
- Canvas-based HTML5 animation engine
- Variable character speeds creating depth illusion
- Semi-transparent overdraw for motion trails
- Automatic column reset for infinite rain effect
- 60 FPS rendering for smooth visual experience

PHILOSOPHY:
The Matrix trilogy explores themes of reality, perspective, and awakening.
The digital rain is the visual representation of the Matrix itself—the
code that forms the simulated world. When you see the rain, you're seeing
the underlying structure of perceived reality.

"There is no spoon" — The Matrix (1999)

Only root users can pierce the veil and see the Matrix. Are you ready
to see how deep the rabbit hole goes? 💊`, owner: 'root', group: 'root', mode: 0o600 },
  };

  // Helper function to check file/directory permissions
  function canRead(path, user) {
    const file = FS[path];
    if (!file) return false;
    if (user === 'root') return true; // root can read everything
    
    // For directories: check if world-readable (mode 0o755)
    if (file.type === 'dir') {
      return (file.mode & 0o005) !== 0; // others can execute (enter) this directory
    }
    
    // For files: check ownership or world-readable
    if (file.owner === user) return true; // own files
    if (file.owner === 'nuri') return true; // nuri's accessible files are readable by guests
    if (file.mode & 0o004) return true; // world readable
    return false; // no permission
  }

  // Helper function to check if user can enter a directory
  function canEnterDir(path, user) {
    const file = FS[path];
    if (!file || file.type !== 'dir') return false;
    if (user === 'root') return true; // root can enter any directory
    // Guests can enter world-executable directories (0o755)
    return (file.mode & 0o005) !== 0;
  }

  // Helper function to check if path exists and list contents
  function listDirectory(dirPath, user) {
    const contents = Object.keys(FS).filter(path => {
      const parent = path.substring(0, path.lastIndexOf('/')) || '/';
      return parent === dirPath;
    });
    
    if (contents.length === 0) {
      return `<span class="term-error">ls: cannot access '${escapeHtml(dirPath)}': No such file or directory</span>`;
    }

    const lines = contents.map(path => {
      const file = FS[path];
      const name = path.substring(path.lastIndexOf('/') + 1);
      
      // Skip files user can't read (especially hidden files)
      if (!canRead(path, user)) {
        return null;
      }
      
      if (file.type === 'dir') {
        return `<span class="highlight-blue">${name}/</span>`;
      } else {
        return `<span class="highlight-green">${name}</span>`;
      }
    }).filter(Boolean);

    return `<div class="term-output-block">${lines.join('  ')}</div>`;
  }
  

  const COMMANDS = {
    'whoami': () => `<div class="whoami-output">
  <h1 class="hero-title glitch" data-text="Nuri — Meowmet">Mehmet Nuri ERKAN </h1>
  <p class="hero-subtitle">Atatürk Üniversitesi · Bilgisayar Mühendisliği · 3. Sınıf | AI &amp; Cybersecurity</p>
  <p class="hero-tagline">"Bridging the gap between <span class="highlight-blue">Secure Systems</span> and <span class="highlight-green">Intelligent Models</span>"</p>
  <div class="hero-stats">
    <div class="stat"><span class="stat-value">3rd yr</span><span class="stat-label">Atatürk Uni.</span></div>
    <div class="stat"><span class="stat-value">1st</span><span class="stat-label">CTF Champion</span></div>
    <div class="stat"><span class="stat-value">15+</span><span class="stat-label">Projects</span></div>
  </div>
</div>`,

    'help': () => {
      let helpText = `<div class="term-output-block">
<span class="highlight-green">Available commands (most require root):</span>
<br>
<span class="term-cmd-list"><span class="highlight-green">cd &lt;path&gt;</span>                 change directory</span>
<span class="term-cmd-list"><span class="highlight-green">pwd</span>                       print working directory</span>                 
<span class="term-cmd-list"><span class="highlight-green">ls</span>                        list current directory</span>
<span class="term-cmd-list"><span class="highlight-green">ls -a</span>                     show hidden files</span>
<span class="term-cmd-list"><span class="highlight-green">cat &lt;file&gt;</span>                read file (permission-checked)</span>
<span class="term-cmd-list"><span class="highlight-green">whoami</span>                    display current user</span>
<span class="term-cmd-list"><span class="highlight-green">su root</span>                   switch to root user</span>
<span class="term-cmd-list"><span class="highlight-green">exit</span>                      exit root / close session</span>
<span class="term-cmd-list"><span class="highlight-green">clear</span>                     clear terminal</span>
<span class="term-cmd-list"><span class="highlight-yellow">💡 Pro Tip:</span> Explore the filesystem for hidden secrets...</span>
</div>`;
      return helpText;
    },

    'pwd': () => {
      return `<span class="highlight-blue">${currentDir}</span>`;
    },

    'ls': () => {
      const user = isRoot ? 'root' : 'guest';
      return listDirectory(currentDir, user);
    },

    'ls -a': () => {
      const user = isRoot ? 'root' : 'guest';
      return listDirectory(currentDir, user);
    },

    'ls -la': () => {
      const user = isRoot ? 'root' : 'guest';
      return listDirectory(currentDir, user);
    },

    'ls -al': () => {
      const user = isRoot ? 'root' : 'guest';
      return listDirectory(currentDir, user);
    },

    'clear': () => '__CLEAR__',

    'exit': () => {
      if (isRoot) {
        isRoot = false;
        currentDir = '/home/nuri'; // return to guest home
        updatePromptUI();
        return '<span class="highlight-green">Returning to guest shell...</span>';
      }
      return '<span class="term-comment">logout</span>';
    },

    'one piece': () => '__ONE_PIECE__',
    'matrix':    () => '__MATRIX__',
  };

  // Resolve command with permission checking and directory navigation
  function resolveCommand(cmd) {
    if (COMMANDS[cmd]) return COMMANDS[cmd];

    // Handle cd command with proper type checking
    const cdMatch = cmd.match(/^cd\s+(.+)$/);
    if (cdMatch) {
      let target = cdMatch[1].trim();
      
      // Handle tilde expansion
      const homeDir = isRoot ? '/root' : '/home/nuri';
      if (target === '~') target = homeDir;
      else if (target.startsWith('~/')) target = homeDir + target.substring(1);
      else if (!target.startsWith('/')) {
        // Relative paths
        if (target.startsWith('.')) target = currentDir + '/' + target;
        else {
          // Don't double-slash if currentDir is '/'
          target = currentDir === '/' ? '/' + target : currentDir + '/' + target;
        }
      }
      
      // Clean up double slashes
      target = target.split('/').filter(Boolean).join('/');
      if (!target.startsWith('/')) target = '/' + target;
      
      const user = isRoot ? 'root' : 'guest';
      const file = FS[target];
      
      if (file && file.type === 'dir') {
        // Check permission to enter directory
        if (!canEnterDir(target, user)) {
          return () => `<span class="term-error">⚠️ You don't have permission to access ${escapeHtml(target)}</span>`;
        }
        currentDir = target;
        return () => '';
      }
      
      // Check if it's a file
      if (file && file.type === 'file') {
        return () => `<span class="term-error">cd: ${escapeHtml(target)}: Not a directory</span>`;
      }
      
      return () => `<span class="term-error">cd: ${escapeHtml(target)}: No such file or directory</span>`;
    }

    // Handle cat command with permission checking and relative path expansion
    const catMatch = cmd.match(/^cat\s+(.+)$/);
    if (catMatch) {
      let path = catMatch[1].trim();
      
      // Expand relative paths
      if (!path.startsWith('/')) {
        const homeDir = isRoot ? '/root' : '/home/nuri';
        if (path === '~') path = homeDir;
        else if (path.startsWith('~/')) path = homeDir + path.substring(1);
        else if (path.startsWith('.')) path = currentDir + '/' + path; // relative like ./file or .file
        else path = currentDir + '/' + path; // default to current directory
      }
      
      // Clean up double slashes
      path = path.split('/').filter(Boolean).join('/');
      if (!path.startsWith('/')) path = '/' + path;
      
      if (FS[path]) {
        // Prevent cat from reading directories
        if (FS[path].type === 'dir') {
          return () => `<span class="term-error">cat: ${escapeHtml(path)}: Is a directory</span>`;
        }
        if (!canRead(path, isRoot ? 'root' : 'guest')) {
          return () => `<span class="term-error">⚠️ You don't have permission to read that file</span>`;
        }
        return () => `<div class="term-output-block"><pre>${FS[path].content || FS[path]}</pre></div>`;
      }
      return () => `<span class="term-error">cat: ${escapeHtml(path)}: No such file or directory</span>`;
    }

    // Handle ls with path
    if (cmd.startsWith('ls ')) {
      let target = cmd.slice(3).trim();
      
      // Expand relative paths for ls
      if (!target.startsWith('/')) {
        const homeDir = isRoot ? '/root' : '/home/nuri';
        if (target === '~') target = homeDir;
        else if (target.startsWith('~/')) target = homeDir + target.substring(1);
        else if (target.startsWith('.')) target = currentDir + '/' + target;
        else target = currentDir === '/' ? '/' + target : currentDir + '/' + target;
      }
      
      // Clean up double slashes
      target = target.split('/').filter(Boolean).join('/');
      if (!target.startsWith('/')) target = '/' + target;
      
      if (FS[target] && FS[target].type === 'dir') {
        const user = isRoot ? 'root' : 'guest';
        if (!canEnterDir(target, user)) {
          return () => `<span class="term-error">⚠️ You don't have permission to read that directory</span>`;
        }
        return () => listDirectory(target, user);
      }
      return () => `<span class="term-error">ls: cannot access '${escapeHtml(target)}': No such file or directory</span>`;
    }

    // Sudo interception
    if (cmd.startsWith('sudo')) {
      return () => `<span class="term-warning">⚠️ I would not try that if I were you</span>`;
    }

    // Handle su command generically
    const suMatch = cmd.match(/^su\s+(.*)$/);
    if (suMatch) {
      const target = suMatch[1].trim();
      // Only root user can be switched to
      if (target === 'root' || target === '') {
        return () => '__SU_ROOT__';
      } else {
        return () => `<span class="term-error">su: user ${escapeHtml(target)}: no such user</span>`;
      }
    }

    // Check for standalone su
    if (cmd === 'su') {
      return () => '__SU_ROOT__';
    }
  }

  // Boot sequence
  const bootLines = [
    { delay: 0,    text: '<span class="term-comment">[    0.000000] booting meowmet-portfolio v3.0...</span>' },
    { delay: 300,  text: '<span class="highlight-green">[  OK  ]</span> Started AI inference engine' },
    { delay: 600,  text: '<span class="highlight-green">[  OK  ]</span> Started security modules' },
    { delay: 900,  text: '<span class="highlight-green">[  OK  ]</span> Reached target: interactive shell' },
    { delay: 1200, text: '<span class="term-comment">Type <span class="highlight-green">help</span> for a list of commands.</span>' },
  ];

  bootLines.forEach(({ delay, text }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'term-boot-line';
      line.innerHTML = text;
      history.appendChild(line);
      scrollTerminal();
    }, delay);
  });

  // Input handler
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const raw = inputEl.value.trim();
      const cmd = raw.toLowerCase();
      if (!cmd) return;

      cmdHistory.unshift(cmd);
      historyIdx = -1;

      // Echo the command
      const promptClass = isRoot ? 'prompt root-mode' : 'prompt';
      appendLine(`<span class="${promptClass}">${currentPrompt()}&nbsp;</span><span class="command">${escapeHtml(raw)}</span>`);

      // Execute
      if (cmd === 'clear') {
        history.innerHTML = '';
      } else if (cmd === 'su' || cmd.startsWith('su ')) {
        const suMatch = cmd.match(/^su\s+(.*)$/);
        const target = suMatch ? suMatch[1].trim() : '';
        if (target === 'root' || target === '') {
          showSuOverlay();
        } else {
          appendLine(`<span class="term-error">su: user ${escapeHtml(target)}: no such user</span>`);
        }
      } else if (cmd === 'one piece') {
        if (!isRoot) {
          appendLine(`<span class="term-error">⚠️ You don't have permission to execute that command</span>`);
        } else {
          triggerOnePiece();
        }
      } else if (cmd === 'matrix') {
        if (!isRoot) {
          appendLine(`<span class="term-error">⚠️ You don't have permission to execute that command</span>`);
        } else {
          triggerMatrix();
        }
      } else if (cmd === 'exit') {
        appendLine(COMMANDS['exit']());
      } else if (cmd.startsWith('sudo')) {
        appendLine(`<span class="term-warning">⚠️ I would not try that if I were you</span>`);
      } else {
        const fn = resolveCommand(cmd);
        if (fn) {
          const result = fn();
          appendLine(result);
        } else {
          appendLine(`<span class="term-error">bash: ${escapeHtml(cmd)}: command not found</span>`);
        }
      }

      inputEl.value = '';
      scrollTerminal();
    }

    // Ctrl+D to exit root
    if (e.key === 'd' && e.ctrlKey) {
      e.preventDefault();
      if (isRoot) {
        isRoot = false;
        currentDir = '/home/nuri'; // return to guest home
        updatePromptUI();
        appendLine(`<span class="highlight-green">Returning to guest shell...</span>`);
        scrollTerminal();
      }
    }

    // Ctrl+L to clear terminal
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      history.innerHTML = '';
      inputEl.focus();
    }

    // History navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) historyIdx++;
      inputEl.value = cmdHistory[historyIdx] || '';
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) historyIdx--;
      else { historyIdx = -1; inputEl.value = ''; return; }
      inputEl.value = cmdHistory[historyIdx] || '';
    }

    // Tab autocomplete — bash-like behavior
    if (e.key === 'Tab') {
      e.preventDefault();
      const input = inputEl.value;
      
      // Determine what we're trying to complete
      const isCdCommand = input.match(/^cd\s+(.*)$/i);
      const isCatCommand = input.match(/^cat\s+(.*)$/i);
      const isLsCommand = input.match(/^ls\s+(.*)$/i);
      
      if (isCdCommand) {
        // Completing directory path for cd
        let pathPart = isCdCommand[1] || '';
        const prefix = input.substring(0, input.length - pathPart.length);
        const matches = getPathMatches(pathPart, true); // true = dirs only
        completeWithMatches(prefix, pathPart, matches);
      } else if (isCatCommand) {
        // Completing file path for cat
        let pathPart = isCatCommand[1] || '';
        const prefix = input.substring(0, input.length - pathPart.length);
        const matches = getPathMatches(pathPart, false); // false = all files
        completeWithMatches(prefix, pathPart, matches);
      } else if (isLsCommand) {
        // Completing path for ls
        let pathPart = isLsCommand[1] || '';
        const prefix = input.substring(0, input.length - pathPart.length);
        const matches = getPathMatches(pathPart, true); // dirs for ls
        completeWithMatches(prefix, pathPart, matches);
      } else {
        // Completing command names
        const partial = input.toLowerCase();
        const allCmds = Object.keys(COMMANDS);
        const matches = allCmds.filter(cmd => cmd.startsWith(partial));
        completeWithMatches('', partial, matches);
      }
      
      // Helper: get matching paths
      function getPathMatches(partial, dirsOnly) {
        // Expand tilde if needed
        let expandedPartial = partial;
        const homeDir = isRoot ? '/root' : '/home/nuri';
        if (partial === '~') expandedPartial = homeDir;
        else if (partial.startsWith('~/')) expandedPartial = homeDir + partial.substring(1);
        else if (!partial.startsWith('/') && !partial.startsWith('.')) {
          expandedPartial = currentDir + '/' + partial;
        } else if (partial.startsWith('.')) {
          expandedPartial = currentDir + '/' + partial;
        }
        
        const allPaths = Object.keys(FS);
        const matches = allPaths.filter(p => {
          if (!p.startsWith(expandedPartial)) return false;
          if (dirsOnly && FS[p].type !== 'dir') return false;
          return true;
        }).map(p => {
          // Convert back to user-friendly format
          if (partial.startsWith('~')) {
            return '~' + p.substring(homeDir.length);
          } else if (partial.startsWith('.')) {
            const relPath = p.substring(currentDir.length + 1);
            return './' + relPath;
          }
          return p;
        });
        
        return matches;
      }
      
      // Helper: complete input with matches
      function completeWithMatches(prefix, partial, matches) {
        if (matches.length === 0) return;
        
        if (matches.length === 1) {
          // Single match: complete it with space for dirs
          const match = matches[0];
          const isDir = partial === '' || partial.endsWith('/') || 
                       (match.includes('/') && !match.endsWith('/'));
          inputEl.value = prefix + match + (isDir ? '/' : '');
        } else {
          // Multiple matches: show them and complete to common prefix
          const commonPrefix = getCommonPrefix(matches);
          inputEl.value = prefix + commonPrefix;
          
          // Show suggestions in terminal
          appendLine(`<span class="term-comment">Available options:</span>`);
          const suggestions = matches.map(m => {
            const obj = resolvePath(m);
            if (obj && obj.type === 'dir') return `<span class="highlight-blue">${m}/</span>`;
            return `<span class="highlight-green">${m}</span>`;
          });
          appendLine(`<div class="term-output-block">${suggestions.join('  ')}</div>`);
          scrollTerminal();
        }
      }
      
      // Helper: get common prefix for array of strings
      function getCommonPrefix(arr) {
        if (arr.length === 0) return '';
        let prefix = arr[0];
        for (let i = 1; i < arr.length; i++) {
          while (!arr[i].startsWith(prefix)) {
            prefix = prefix.slice(0, -1);
          }
        }
        return prefix;
      }
      
      // Helper: resolve path to FS object
      function resolvePath(path) {
        let resolved = path;
        const homeDir = isRoot ? '/root' : '/home/nuri';
        if (path.startsWith('~')) resolved = homeDir + path.substring(1);
        else if (path.startsWith('./')) resolved = currentDir + '/' + path.substring(2);
        else if (!path.startsWith('/')) resolved = currentDir + '/' + path;
        
        return FS[resolved];
      }
    }
  });

  // Click terminal body to focus input
  termBody.addEventListener('click', () => inputEl.focus());

  function appendLine(html) {
    const div = document.createElement('div');
    div.className = 'term-output';
    div.innerHTML = html;
    history.appendChild(div);
  }

  function scrollTerminal() {
    history.scrollTop = history.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ---- SU ROOT overlay ----
  function showSuOverlay() {
    const overlay = document.getElementById('su-overlay');
    const pwInput = document.getElementById('su-password-input');
    const hint    = document.getElementById('su-hint');
    if (!overlay || !pwInput) return;

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    hint.textContent = '';
    pwInput.value = '';

    setTimeout(() => pwInput.focus(), 100);

    function handleSuInput(e) {
      if (e.key === 'Enter') {
        const pw = pwInput.value;
        if (pw === 'purrfect-password') {
          // SUCCESS — escalate to root
          isRoot = true;
          currentDir = '/root'; // change to root's home directory
          updatePromptUI();
          overlay.classList.remove('open');
          overlay.setAttribute('aria-hidden', 'true');
          appendLine('<span class="highlight-red">⚡ Privilege escalation successful. Welcome, root.</span>');
          scrollTerminal();
          pwInput.removeEventListener('keydown', handleSuInput);
        } else {
          // FAIL
          hint.textContent = '⚠️ I would not try that if I were you';
          pwInput.value = '';
          pwInput.style.animation = 'none';
          requestAnimationFrame(() => {
            pwInput.style.animation = 'shake 0.3s ease';
          });
        }
      }
      if (e.key === 'Escape') {
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        appendLine('<span class="term-comment">su: authentication cancelled</span>');
        scrollTerminal();
        inputEl.focus();
        pwInput.removeEventListener('keydown', handleSuInput);
      }
    }

    pwInput.addEventListener('keydown', handleSuInput);
  }

  // ---- ONE PIECE Easter Egg ----
  function triggerOnePiece() {
    appendLine('<span class="highlight-yellow">🏴‍☠️ THE ONE PIECE... IS REAL!</span>');
    scrollTerminal();

    // Audio ve Resim Ayarları
    const audioUrl = 'https://www.myinstants.com/media/sounds/the-one-piece-is-real.mp3';
    const imageUrl = 'https://i.pinimg.com/originals/69/26/f8/6926f8f7d1bfa846c6c031fc46d18bf7.jpg';

    // Resim Oluşturma ve 270 Derece Döndürme
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.position = 'fixed';
    img.style.top = '50%';
    img.style.left = '50%';
    // Başlangıçta 270 derece dönmüş ve görünmez (scale 0)
    img.style.transform = 'translate(-50%, -50%) rotate(270deg) scale(0)';
    img.style.zIndex = '999999';
    img.style.borderRadius = '20px';
    img.style.boxShadow = '0 0 60px rgba(255, 255, 255, 0.6)';
    img.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    img.style.maxWidth = '80vh';
    img.style.maxHeight = '80vw';

    // Arka Plan Karartma
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.9); z-index:999998; opacity:0; transition:opacity 0.5s;';

    document.body.appendChild(overlay);
    document.body.appendChild(img);

    // Ses ve Animasyon Tetikleme
    const audio = new Audio(audioUrl);
    
    audio.play().then(() => {
        // Ses başlarsa efektleri göster
        overlay.style.opacity = '1';
        // 270 derece sabit kalarak ekrana fırlar
        img.style.transform = 'translate(-50%, -50%) rotate(270deg) scale(1)';
    }).catch(e => {
        console.error("Audio playback requires user interaction. Click the page and try again.");
        img.remove();
        overlay.remove();
    });

    // Temizleme (3.5 Saniye Sonra)
    setTimeout(() => {
        img.style.transform = 'translate(-50%, -50%) rotate(270deg) scale(0)';
        overlay.style.opacity = '0';
        setTimeout(() => {
            img.remove();
            overlay.remove();
        }, 600);
    }, 3500);
  }

  // ---- MATRIX Easter Egg ----
  function triggerMatrix() {
    appendLine('<span class="highlight-green">💊 Wake up, Neo...</span>');
    scrollTerminal();

    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    canvas.classList.add('active');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?ﾊﾐﾋｰｳｼﾅﾓﾆ';

    let frameId;
    function drawMatrix() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00FF41';
      ctx.font = fontSize + 'px JetBrains Mono, monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      frameId = requestAnimationFrame(drawMatrix);
    }

    drawMatrix();

    // Stop after 3 seconds
    setTimeout(() => {
      cancelAnimationFrame(frameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.classList.remove('active');
    }, 3000);
  }

  // Auto-run whoami after boot
  setTimeout(() => {
    appendLine(`<span class="prompt">${currentPrompt()}&nbsp;</span><span class="command">whoami</span>`);
    appendLine(COMMANDS.whoami());
    scrollTerminal();
  }, 1600);

  // Set initial prompt
  updatePromptUI();
}


/* ============================================
   NAVIGATION — scroll-based active state
   ============================================ */
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    });
  });

  // Scroll spy
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}


/* ============================================
   SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.core-card, .project-card, .certs-accordion, .contact-terminal, .section-header, .scoreboard-terminal'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => observer.observe(el));

  // Scoreboard stagger
  const scoreRows = document.querySelectorAll('.score-row');
  const scoreObs  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scoreRows.forEach((row, i) => setTimeout(() => row.classList.add('animate-in'), i * 90));
        scoreObs.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const board = document.getElementById('scoreboard-body');
  if (board) scoreObs.observe(board);
}


/* ============================================
   PROJECT FILTERS
   ============================================ */
function initProjectFilters() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}


/* ============================================
   PROJECT MODAL
   ============================================ */
function initProjectModal() {
  const modal       = document.getElementById('project-modal');
  const closeBtn    = document.getElementById('modal-close');
  const modalTitle  = document.getElementById('modal-title');
  const modalStatus = document.getElementById('modal-status-badge');
  const modalRole   = document.getElementById('modal-role-wrap');
  const modalDesc   = document.getElementById('modal-desc');
  const modalTech   = document.getElementById('modal-tech');
  const modalCmd    = document.getElementById('modal-cmd');

  if (!modal) return;

  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // Don't open modal when clicking the "Detaylı Oku" button
      if (e.target.classList.contains('project-read-btn')) return;

      const title  = card.dataset.title  || '';
      const status = card.dataset.status || '';
      const stype  = card.dataset.statusType || '';
      const role   = card.dataset.role   || '';
      const desc   = card.dataset.desc   || '';
      const tech   = (card.dataset.tech  || '').split(',').map(t => t.trim()).filter(Boolean);

      modalTitle.textContent = title;

      modalStatus.className = 'project-status ' + (stype === 'live' ? 'live' : stype === 'kaggle' ? 'kaggle' : '');
      modalStatus.innerHTML = `<span class="status-dot"></span> ${status}`;

      modalRole.innerHTML = role ? `<span class="role-badge">${role}</span>` : '';
      modalDesc.innerHTML = desc;

      modalTech.innerHTML = tech.map(t => `<span>${t}</span>`).join('');

      modalCmd.textContent = `cat projects/${title.toLowerCase().replace(/\s+/g, '_')}.md`;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}


/* ============================================
   PROJECT READ BUTTONS — Navigate to GitHub
   ============================================ */
function initProjectReadButtons() {
  // Read buttons are now <a> tags pointing to GitHub
  // They navigate natively without additional JS handling needed
}


/* ============================================
   CERTIFICATION ACCORDION
   ============================================ */
function initCertsAccordion() {
  const headers = document.querySelectorAll('.cert-group-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.getAttribute('aria-expanded') === 'true';

      // Close all others
      headers.forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('open');
      });

      // Toggle this one
      if (!isOpen) {
        header.setAttribute('aria-expanded', 'true');
        if (body) body.classList.add('open');
      }

      // if the big one closed then scroll to certs section to prevent disorientation
      const certsSection = document.getElementById('certs');
      if (certsSection) {
        certsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}


/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, 0, parseInt(entry.target.dataset.count), 1500);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCount(el, start, end, dur) {
  const t0 = performance.now();
  function update(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.floor(start + (end - start) * (1 - (1 - p) * (1 - p)));
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = end;
  }
  requestAnimationFrame(update);
}


/* ============================================
   CORE VISUALS (Neural Net & Shield)
   ============================================ */
function initCoreVisuals() {
  // Neural Net
  const neuralNet = document.getElementById('neural-net');
  if (neuralNet) {
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 60;
    canvas.style.cssText = 'width:100%;height:100%';
    neuralNet.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const layers = [4, 6, 6, 3];
    const nodes = [];

    layers.forEach((count, li) => {
      const xStep = canvas.width / (layers.length + 1);
      const x = xStep * (li + 1);
      for (let ni = 0; ni < count; ni++) {
        nodes.push({ x, y: (canvas.height / (count + 1)) * (ni + 1), layer: li, pulse: Math.random() * Math.PI * 2 });
      }
    });

    (function drawNet(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
          if (nodes[j].layer === nodes[i].layer + 1) {
            const p = Math.sin(t * 0.002 + nodes[i].pulse) * 0.5 + 0.5;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0,180,216,${0.05 + p * 0.12})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        const p = Math.sin(t * 0.003 + n.pulse) * 0.5 + 0.5;
        ctx.beginPath(); ctx.arc(n.x, n.y, 2 + p * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,216,${0.4 + p * 0.5})`; ctx.fill();
      });
      requestAnimationFrame(drawNet);
    })(0);
  }

  // Shield / Matrix rain
  const shieldAnim = document.getElementById('shield-anim');
  if (shieldAnim) {
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 60;
    canvas.style.cssText = 'width:100%;height:100%';
    shieldAnim.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const streams = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 1.5 + 0.5,
      char: String.fromCharCode(0x30 + Math.floor(Math.random() * 10)),
      opacity: Math.random() * 0.4 + 0.1
    }));

    (function drawShield() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '10px JetBrains Mono, monospace';
      streams.forEach(s => {
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = -10; s.x = Math.random() * canvas.width; s.char = String.fromCharCode(0x30 + Math.floor(Math.random() * 10)); }
        ctx.fillStyle = `rgba(0,255,65,${s.opacity})`;
        ctx.fillText(s.char, s.x, s.y);
      });
      requestAnimationFrame(drawShield);
    })();
  }
}
