/* ============================================================
   CyberUnit @ UNG — main.js
   Client-side logic for homepage and topic pages
   ============================================================ */

'use strict';

// ─── Utility ──────────────────────────────────────────────────────────────────

function getTopicIdFromURL() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1];
}

function isHomePage() {
  return window.location.pathname === '/' || window.location.pathname === '/index.html';
}

// ─── Navbar Hamburger ─────────────────────────────────────────────────────────

function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─── Typewriter Effect ────────────────────────────────────────────────────────

function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const text = 'Learn Cybersecurity. One Concept at a Time.';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 55);
    }
  }
  setTimeout(type, 400);
}

// ─── Smooth Scroll ────────────────────────────────────────────────────────────

function initSmoothScroll() {
  document.querySelectorAll('a[href^="/#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').split('#')[1];
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ─── Homepage: Render Topic Grid ──────────────────────────────────────────────

async function renderTopicGrid() {
  const grid = document.getElementById('topicGrid');
  if (!grid) return;

  try {
    const res = await fetch('/api/topics');
    const topics = await res.json();

    // Update dynamic stats bar
    const statTopics  = document.getElementById('statTopics');
    const statQuizzes = document.getElementById('statQuizzes');
    if (statTopics)  statTopics.textContent  = topics.length;
    if (statQuizzes) statQuizzes.textContent = topics.length;

    grid.innerHTML = topics.map(t => `
      <article class="card" aria-label="${t.title}">
        <div class="card-icon" aria-hidden="true">${t.icon}</div>
        <h3 class="card-title">${t.title}</h3>
        <p class="card-desc">${t.shortDesc}</p>
        <div class="card-footer">
          <span class="badge badge-beginner">${t.difficulty}</span>
          <a href="/topic/${t.id}" class="btn btn-sm" aria-label="Explore ${t.title}">Explore →</a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    grid.innerHTML = '<p style="color:var(--danger);font-family:\'Share Tech Mono\',monospace;">Failed to load topics.</p>';
  }
}

// ─── Topic Page: Load & Render ────────────────────────────────────────────────

async function renderTopicPage() {
  const id = getTopicIdFromURL();

  try {
    const [topicRes, allRes] = await Promise.all([
      fetch(`/api/topic/${id}`),
      fetch('/api/topics'),
    ]);

    if (!topicRes.ok) {
      document.getElementById('topicContent').innerHTML =
        '<p style="color:var(--danger);">Topic not found.</p>';
      return;
    }

    const topic  = await topicRes.json();
    const topics = await allRes.json();

    // Update <title>
    document.title = `CyberUnit @ UNG — ${topic.title}`;

    // Breadcrumb
    document.getElementById('breadcrumbTopic').textContent = topic.title;

    // Header
    document.getElementById('topicIcon').textContent  = topic.icon;
    document.getElementById('topicTitle').textContent = topic.title;
    const badge = document.getElementById('topicDifficulty');
    badge.textContent = topic.difficulty;
    badge.className   = `badge badge-${topic.difficulty.toLowerCase()}`;
    document.getElementById('topicReadTime').textContent = topic.readTime;

    // Illustration (inline SVG)
    document.getElementById('topicIllustration').innerHTML = getTopicSVG(topic.id, topic.icon, topic.title);

    // Content
    document.getElementById('topicContent').innerHTML = renderContent(topic);

    // Quiz
    renderQuiz(topic.quiz);

    // Previous / Next navigation
    renderTopicNav(topics, id);

    // Build table of contents
    buildTOC(topic.fullContent.sections);

    // Wire up interactive demos
    if (topic.id === '03') initPasswordStrength();
    if (topic.id === '06') initCaesarCipher();
    if (topic.id === '07') initHygieneChecklist();

    // Start scroll spy after a tick (lets DOM settle)
    requestAnimationFrame(initScrollSpy);

  } catch (err) {
    document.getElementById('topicContent').innerHTML =
      `<p style="color:var(--danger);font-family:'Share Tech Mono',monospace;">Error loading topic: ${err.message}</p>`;
  }
}

// ─── Content Renderer ─────────────────────────────────────────────────────────

function renderContent(topic) {
  return topic.fullContent.sections.map((section, index) => {
    let html = `<div class="content-section" id="section-${index}">
      <h3>${section.heading}</h3>`;

    if (section.body) {
      html += `<p>${section.body}</p>`;
    }

    if (section.cia) {
      html += renderCIATriad();
    }

    if (section.threats) {
      html += renderThreatCards(section.threats);
    }

    if (section.passwordTable) {
      html += renderPasswordTable();
    }

    if (section.terminal) {
      html += renderTerminal(section.terminal);
    }

    if (section.diagram === 'network-flow') {
      html += renderNetworkFlow();
    }

    if (section.diagram === 'ir-lifecycle') {
      html += renderIRLifecycle();
    }

    if (section.careers) {
      html += renderCareers(section.careers);
    }

    if (section.resources) {
      html += renderResources(section.resources);
    }

    if (section.callout) {
      html += renderCallout(section.callout);
    }

    if (section.demo === 'password-strength') {
      html += renderPasswordStrengthDemo();
    }

    if (section.demo === 'caesar-cipher') {
      html += renderCaesarCipherDemo();
    }

    if (section.demo === 'hygiene-checklist') {
      html += renderHygieneChecklist();
    }

    if (section.commandGroups) {
      html += renderCommandGroups(section.commandGroups);
    }

    if (section.permTable) {
      html += renderPermTable();
    }

    if (section.sshKeySteps) {
      html += renderSSHKeySteps();
    }

    if (section.scriptExample) {
      html += renderScriptExample(section.scriptExample);
    }

    html += `</div>`;
    return html;
  }).join('');
}

// ─── Component Renderers ──────────────────────────────────────────────────────

function renderCIATriad() {
  return `
    <div class="cia-triad" role="list">
      <div class="cia-box" role="listitem">
        <div class="cia-icon" aria-hidden="true">🔒</div>
        <h4>Confidentiality</h4>
        <p>Only authorized people can access the data. No peeking!</p>
      </div>
      <div class="cia-box" role="listitem">
        <div class="cia-icon" aria-hidden="true">✅</div>
        <h4>Integrity</h4>
        <p>Data is accurate, complete, and unmodified by unauthorized parties.</p>
      </div>
      <div class="cia-box" role="listitem">
        <div class="cia-icon" aria-hidden="true">⚡</div>
        <h4>Availability</h4>
        <p>Systems and data are accessible to authorized users when needed.</p>
      </div>
    </div>`;
}

function renderThreatCards(threats) {
  return `<div class="threat-grid" role="list">
    ${threats.map(t => `
      <div class="threat-card" role="listitem">
        <div class="threat-icon" aria-hidden="true">${t.icon}</div>
        <div>
          <h4>${t.name}</h4>
          <p>${t.desc}</p>
        </div>
      </div>`).join('')}
  </div>`;
}

function renderPasswordTable() {
  return `
    <table class="password-table" aria-label="Password strength comparison">
      <thead>
        <tr>
          <th class="bad">❌ Weak Passwords</th>
          <th class="good">✅ Strong Passwords</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="bad-pw">password123</td><td class="good-pw">T!g3r$unR1se#42</td></tr>
        <tr><td class="bad-pw">abc</td><td class="good-pw">correct-horse-battery-staple</td></tr>
        <tr><td class="bad-pw">john1990</td><td class="good-pw">Xk9#mP2&vL5@qW8!</td></tr>
      </tbody>
    </table>`;
}

function renderTerminal(commands) {
  const lines = commands.map(c => `
    <div class="terminal-line">
      <span class="terminal-cmd"><span class="terminal-prompt" aria-hidden="true">$</span> ${escHtml(c.cmd)}</span>
      <span class="terminal-desc"># ${escHtml(c.desc)}</span>
    </div>`).join('');

  return `
    <div class="terminal-window" role="region" aria-label="Terminal commands">
      <div class="terminal-titlebar" aria-hidden="true">
        <div class="terminal-dot red"></div>
        <div class="terminal-dot yellow"></div>
        <div class="terminal-dot green"></div>
        <span class="terminal-titlebar-label">bash — user@kali: ~</span>
      </div>
      <div class="terminal-body">${lines}</div>
    </div>`;
}

function renderNetworkFlow() {
  return `
    <div class="network-flow" role="img" aria-label="Network flow: Your Device to Router to Firewall to Internet">
      <div class="flow-node">💻<br>Your Device</div>
      <div class="flow-arrow" aria-hidden="true">→</div>
      <div class="flow-node">📡<br>Router</div>
      <div class="flow-arrow" aria-hidden="true">→</div>
      <div class="flow-node">🛡️<br>Firewall</div>
      <div class="flow-arrow" aria-hidden="true">→</div>
      <div class="flow-node">🌐<br>Internet</div>
    </div>`;
}

function renderIRLifecycle() {
  const steps = [
    { name: 'Preparation',   desc: 'Have plans, tools, and trained teams ready.' },
    { name: 'Detection',     desc: 'Identify that an incident has occurred.' },
    { name: 'Containment',   desc: 'Limit the spread and impact of the incident.' },
    { name: 'Eradication',   desc: 'Remove the threat from affected systems.' },
    { name: 'Recovery',      desc: 'Restore systems to normal operation.' },
    { name: 'Lessons Learned', desc: 'Review what happened and improve defenses.' },
  ];
  return `
    <div class="ir-lifecycle" role="list">
      ${steps.map(s => `
        <div class="ir-step" role="listitem">
          <h4>${s.name}</h4>
          <p>${s.desc}</p>
        </div>`).join('')}
    </div>`;
}

function renderCareers(careers) {
  return `
    <div class="career-grid" role="list">
      ${careers.map(c => `
        <div class="career-card" role="listitem">
          <div class="career-icon" aria-hidden="true">${c.icon}</div>
          <div>
            <h4>${c.title}</h4>
            <p>${c.desc}</p>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderResources(resources) {
  return `
    <div class="resource-list" role="list">
      ${resources.map(r => `
        <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link" role="listitem" aria-label="${r.name}: ${r.desc}">
          <div>
            <h4>${r.name}</h4>
            <p>${r.desc}</p>
          </div>
          <span class="link-arrow" aria-hidden="true">↗</span>
        </a>`).join('')}
    </div>`;
}

function renderCallout({ type, text }) {
  return `<div class="callout callout-${type}" role="note">${text}</div>`;
}

// ─── Bash Topic Renderers ─────────────────────────────────────────────────────

function renderCommandGroups(groups) {
  return groups.map(g => `
    <div class="cmd-group" role="region" aria-label="${g.group}">
      <div class="cmd-group-title">${g.group}</div>
      <div class="cmd-table" role="table" aria-label="${g.group} commands">
        ${g.cmds.map(c => `
          <div class="cmd-row" role="row">
            <code class="cmd-cell" role="cell">${escHtml(c.cmd)}</code>
            <span class="cmd-desc" role="cell">${c.desc}</span>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function renderPermTable() {
  const octal = [
    ['7', 'rwx', 'Read + Write + Execute'],
    ['6', 'rw-', 'Read + Write'],
    ['5', 'r-x', 'Read + Execute'],
    ['4', 'r--', 'Read only'],
    ['3', '-wx', 'Write + Execute'],
    ['2', '-w-', 'Write only'],
    ['1', '--x', 'Execute only'],
    ['0', '---', 'No permissions'],
  ];
  const common = [
    ['755', '-rwxr-xr-x', 'Scripts/executables: owner full, others can run'],
    ['644', '-rw-r--r--', 'Regular files: owner edits, others read'],
    ['700', '-rwx------', 'Private dirs/scripts: only owner can access'],
    ['600', '-rw-------', 'Private files: SSH keys, config secrets'],
    ['777', '-rwxrwxrwx', '⚠️ Dangerous: everyone has full access'],
  ];
  return `
    <div class="perm-tables" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1rem 0;" role="region" aria-label="Permission reference tables">
      <div>
        <p style="font-family:'Share Tech Mono',monospace;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.4rem;">Octal reference:</p>
        <table class="password-table" aria-label="Octal permission values">
          <thead><tr>
            <th style="color:var(--accent)">Oct</th>
            <th style="color:var(--accent)">Symbol</th>
            <th style="color:var(--accent)">Meaning</th>
          </tr></thead>
          <tbody>
            ${octal.map(([o, s, m]) => `<tr>
              <td style="color:var(--accent);font-family:'Share Tech Mono',monospace">${o}</td>
              <td style="font-family:'Share Tech Mono',monospace">${s}</td>
              <td style="color:var(--text-muted);font-size:0.85rem">${m}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div>
        <p style="font-family:'Share Tech Mono',monospace;font-size:0.82rem;color:var(--text-muted);margin-bottom:0.4rem;">Common combinations:</p>
        <table class="password-table" aria-label="Common chmod values">
          <thead><tr>
            <th style="color:var(--accent)">chmod</th>
            <th style="color:var(--accent)">Result</th>
            <th style="color:var(--accent)">Use Case</th>
          </tr></thead>
          <tbody>
            ${common.map(([c, r, u]) => `<tr>
              <td style="color:var(--warn);font-family:'Share Tech Mono',monospace">${c}</td>
              <td style="font-family:'Share Tech Mono',monospace;font-size:0.8rem">${r}</td>
              <td style="color:var(--text-muted);font-size:0.82rem">${u}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderSSHKeySteps() {
  const steps = [
    {
      title: 'Generate a Key Pair',
      code: '# Ed25519 (modern, recommended)\nssh-keygen -t ed25519 -C "you@email.com"\n\n# RSA (for legacy server compatibility)\nssh-keygen -t rsa -b 4096 -C "you@email.com"\n\n# Accept default location or choose a custom path\n# Set a passphrase (recommended for extra protection!)',
      note: 'Creates two files:\n  ~/.ssh/id_ed25519      ← PRIVATE key (never share!)\n  ~/.ssh/id_ed25519.pub  ← PUBLIC key (safe to distribute)',
    },
    {
      title: 'View & Verify Your Keys',
      code: '# See your public key (safe to copy anywhere)\ncat ~/.ssh/id_ed25519.pub\n\n# List all SSH files and their permissions\nls -la ~/.ssh/\n\n# Fix permissions if SSH complains\nchmod 700 ~/.ssh\nchmod 600 ~/.ssh/id_ed25519\nchmod 644 ~/.ssh/id_ed25519.pub',
      note: 'SSH is strict about permissions. If your private key is readable by others, SSH will refuse to use it.',
    },
    {
      title: 'Deploy Your Public Key to a Server',
      code: '# Automatic method (if you can already log in)\nssh-copy-id -i ~/.ssh/id_ed25519.pub user@server\n\n# Manual method (append to authorized_keys)\ncat ~/.ssh/id_ed25519.pub | ssh user@server \\\n  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && \\\n   cat >> ~/.ssh/authorized_keys && \\\n   chmod 600 ~/.ssh/authorized_keys"',
      note: 'The server stores your PUBLIC key in ~/.ssh/authorized_keys. When you connect, SSH proves you hold the matching private key — without ever transmitting it.',
    },
    {
      title: 'Connect With Key Authentication',
      code: '# Default (uses ~/.ssh/id_ed25519 automatically)\nssh user@server\n\n# Specify a key explicitly\nssh -i ~/.ssh/id_ed25519 user@server\n\n# Custom port\nssh -p 2222 user@server\n\n# Run a remote command without interactive shell\nssh user@server "cat /etc/os-release"\nssh user@server "ls /var/www/html"',
      note: 'If you get Permission denied (publickey), verify the public key is in the server\'s ~/.ssh/authorized_keys and permissions are correct.',
    },
    {
      title: 'Create an SSH Config File (~/.ssh/config)',
      code: '# ~/.ssh/config — alias multiple servers\n\nHost kali-vm\n    HostName 192.168.1.100\n    User kali\n    IdentityFile ~/.ssh/id_ed25519\n    Port 22\n\nHost ctf-box\n    HostName 10.10.10.5\n    User root\n    IdentityFile ~/.ssh/ctf_key\n    Port 22\n\n# Set permissions!\nchmod 600 ~/.ssh/config\n\n# Now connect with just:\n# ssh kali-vm\n# ssh ctf-box',
      note: 'The config file saves you from typing long commands. You can have different keys for different hosts.',
    },
    {
      title: 'SSH Agent — Store Keys in Memory',
      code: '# Start the ssh-agent daemon\neval "$(ssh-agent -s)"\n\n# Add your key (enter passphrase once)\nssh-add ~/.ssh/id_ed25519\n\n# List keys currently loaded in agent\nssh-add -l\n\n# Remove all keys from agent\nssh-add -D\n\n# On Kali, add to ~/.bashrc for auto-start:\necho \'eval "$(ssh-agent -s)"\' >> ~/.bashrc',
      note: 'The agent holds your decrypted key in memory. You enter your passphrase once per session instead of on every connection.',
    },
    {
      title: 'SSH Port Forwarding (Tunneling)',
      code: '# LOCAL forward: access a remote service locally\n# Access the server\'s port 80 at localhost:8080\nssh -L 8080:localhost:80 user@server\n\n# REMOTE forward: expose your local service on the server\n# Makes your local port 3000 reachable as server:9090\nssh -R 9090:localhost:3000 user@server\n\n# DYNAMIC SOCKS5 proxy (route browser traffic through server)\nssh -D 1080 user@server\n# Then configure browser to use SOCKS5 proxy at 127.0.0.1:1080\n\n# Keep-alive tunnel in background (pentest pivoting)\nssh -fN -L 8080:internal-server:80 user@pivot-host',
      note: 'Port forwarding is a key technique in penetration testing for pivoting through network segments and accessing internal services.',
    },
    {
      title: 'Generate & Use Multiple Key Pairs',
      code: '# Generate a dedicated key for a specific purpose\nssh-keygen -t ed25519 -f ~/.ssh/github_key -C "github"\nssh-keygen -t ed25519 -f ~/.ssh/ctf_key    -C "ctf-labs"\n\n# ~/.ssh/config for multiple identities\nHost github.com\n    IdentityFile ~/.ssh/github_key\n    User git\n\nHost *.htb\n    IdentityFile ~/.ssh/ctf_key\n    User root\n\n# Copy a CTF target\'s private key and connect\nchmod 600 id_rsa\nssh -i id_rsa user@target',
      note: 'Best practice: use a separate key pair for each context (work, CTFs, personal). If one is compromised, the others remain safe.',
    },
  ];

  return `
    <div class="ssh-steps" role="list">
      ${steps.map((s, i) => `
        <div class="ssh-step" role="listitem">
          <div class="ssh-step-num" aria-hidden="true">${i + 1}</div>
          <div class="ssh-step-body">
            <h4>${s.title}</h4>
            <pre class="code-block ssh-code">${escHtml(s.code)}</pre>
            <p class="ssh-step-note">${escHtml(s.note).replace(/\n/g, '<br>')}</p>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderScriptExample({ title, code }) {
  return `
    <div class="script-example" role="region" aria-label="${escHtml(title)}">
      <div class="script-title">${escHtml(title)}</div>
      <pre class="code-block" style="white-space:pre;overflow-x:auto;">${escHtml(code)}</pre>
    </div>`;
}

// ─── Interactive Demos ────────────────────────────────────────────────────────

function renderPasswordStrengthDemo() {
  return `
    <div class="demo-box" id="pwStrengthDemo">
      <label for="pwInput">Enter a password to test:</label>
      <input type="text" id="pwInput" class="demo-input" placeholder="Type a password..." autocomplete="off" spellcheck="false" aria-label="Password to test">
      <div class="strength-label" id="pwStrengthLabel">Strength: —</div>
      <div class="progress-bar-wrap" role="progressbar" aria-label="Password strength indicator" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" id="pwProgressBar" style="width:0%"></div>
      </div>
      <ul class="strength-tips" id="pwTips" aria-label="Password feedback">
        <li id="tip-length">At least 12 characters</li>
        <li id="tip-upper">Uppercase letters (A–Z)</li>
        <li id="tip-lower">Lowercase letters (a–z)</li>
        <li id="tip-number">Numbers (0–9)</li>
        <li id="tip-symbol">Symbols (!@#$...)</li>
      </ul>
    </div>`;
}

function renderCaesarCipherDemo() {
  return `
    <div class="demo-box" id="cipherDemo">
      <div class="cipher-controls">
        <div>
          <label for="cipherInput">Plaintext message:</label>
          <input type="text" id="cipherInput" class="demo-input" placeholder="Hello World" value="Hello World" autocomplete="off" aria-label="Message to encrypt">
        </div>
        <div>
          <label for="cipherOutput">Encrypted output:</label>
          <input type="text" id="cipherOutput" class="demo-input" readonly aria-label="Encrypted output" aria-live="polite">
        </div>
        <div class="cipher-slider-wrap">
          <label for="cipherShift">
            <span>Shift amount:</span>
            <span id="cipherShiftVal" aria-live="polite">3</span>
          </label>
          <input type="range" id="cipherShift" min="1" max="25" value="3" aria-label="Caesar cipher shift amount">
        </div>
        <p class="cipher-note">⚠️ This is a toy cipher — real encryption is FAR more complex!</p>
      </div>
      <div class="cipher-btn-row">
        <button class="btn btn-primary btn-sm" id="cipherEncodeBtn" aria-label="Encode message">Encode</button>
        <button class="btn btn-sm" id="cipherDecodeBtn" aria-label="Decode message">Decode</button>
      </div>
    </div>`;
}

function renderHygieneChecklist() {
  const items = [
    'I use HTTPS websites when possible',
    'I keep my OS and apps updated',
    'I use a different password for every account',
    'I have MFA enabled on important accounts',
    "I don't click links in unexpected emails",
    'I lock my screen when stepping away',
    'I avoid using public Wi-Fi for sensitive tasks',
  ];
  return `
    <div class="demo-box" id="hygieneDemo">
      <ul class="checklist" id="hygieneChecklist" role="list" aria-label="Digital hygiene checklist">
        ${items.map((item, i) => `
          <li data-index="${i}" role="listitem" tabindex="0" aria-checked="false">
            <div class="checklist-checkbox" aria-hidden="true"></div>
            <span>${item}</span>
          </li>`).join('')}
      </ul>
      <div class="checklist-score" id="hygieneScore" aria-live="polite">
        Score: <span id="hygieneScoreNum">0</span> / ${items.length} habits secured
      </div>
    </div>`;
}

// ─── Demo Logic: Password Strength ───────────────────────────────────────────

function initPasswordStrength() {
  const input    = document.getElementById('pwInput');
  const bar      = document.getElementById('pwProgressBar');
  const label    = document.getElementById('pwStrengthLabel');
  const barWrap  = bar && bar.parentElement;
  if (!input || !bar) return;

  function checkTip(id, pass) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('pass', pass);
    el.classList.toggle('fail', !pass);
    el.textContent = (pass ? '✓ ' : '○ ') + el.textContent.replace(/^[✓○] /, '');
  }

  function evaluate(pw) {
    const hasUpper  = /[A-Z]/.test(pw);
    const hasLower  = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSymbol = /[^A-Za-z0-9]/.test(pw);
    const longEnough = pw.length >= 12;

    checkTip('tip-length', longEnough);
    checkTip('tip-upper',  hasUpper);
    checkTip('tip-lower',  hasLower);
    checkTip('tip-number', hasNumber);
    checkTip('tip-symbol', hasSymbol);

    const score = [longEnough, hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    const pct   = score * 20;

    bar.style.width = pct + '%';
    bar.className   = 'progress-bar';
    if (barWrap) barWrap.setAttribute('aria-valuenow', pct);

    if (score <= 2) {
      bar.classList.add('progress-weak');
      label.textContent = `Strength: Weak`;
      label.style.color = 'var(--danger)';
    } else if (score <= 3) {
      bar.classList.add('progress-fair');
      label.textContent = `Strength: Fair`;
      label.style.color = 'var(--warn)';
    } else {
      bar.classList.add('progress-strong');
      label.textContent = `Strength: Strong`;
      label.style.color = 'var(--accent)';
    }
  }

  input.addEventListener('input', () => evaluate(input.value));
  evaluate(input.value);
}

// ─── Demo Logic: Caesar Cipher ────────────────────────────────────────────────

function caesarShift(text, shift, decode = false) {
  const s = decode ? (26 - shift) % 26 : shift;
  return text.split('').map(ch => {
    if (/[a-z]/.test(ch)) return String.fromCharCode(((ch.charCodeAt(0) - 97 + s) % 26) + 97);
    if (/[A-Z]/.test(ch)) return String.fromCharCode(((ch.charCodeAt(0) - 65 + s) % 26) + 65);
    return ch;
  }).join('');
}

function initCaesarCipher() {
  const input    = document.getElementById('cipherInput');
  const output   = document.getElementById('cipherOutput');
  const slider   = document.getElementById('cipherShift');
  const shiftVal = document.getElementById('cipherShiftVal');
  const encBtn   = document.getElementById('cipherEncodeBtn');
  const decBtn   = document.getElementById('cipherDecodeBtn');
  if (!input || !output || !slider) return;

  function update(decode = false) {
    const shift = parseInt(slider.value, 10);
    shiftVal.textContent = shift;
    output.value = caesarShift(input.value, shift, decode);
  }

  slider.addEventListener('input', () => update(false));
  input.addEventListener('input', () => update(false));
  encBtn.addEventListener('click', () => update(false));
  decBtn.addEventListener('click', () => update(true));
  update(false);
}

// ─── Demo Logic: Hygiene Checklist ───────────────────────────────────────────

function initHygieneChecklist() {
  const list     = document.getElementById('hygieneChecklist');
  const scoreEl  = document.getElementById('hygieneScoreNum');
  if (!list) return;

  const STORAGE_KEY = 'cyberunit-hygiene';
  const total = list.querySelectorAll('li').length;

  // Load saved state
  let checked = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  function updateScore() {
    if (scoreEl) scoreEl.textContent = checked.length;
  }

  function applyState() {
    list.querySelectorAll('li').forEach(li => {
      const idx = parseInt(li.dataset.index, 10);
      const isChecked = checked.includes(idx);
      li.classList.toggle('checked', isChecked);
      li.setAttribute('aria-checked', isChecked);
    });
    updateScore();
  }

  function toggle(li) {
    const idx = parseInt(li.dataset.index, 10);
    if (checked.includes(idx)) {
      checked = checked.filter(i => i !== idx);
    } else {
      checked.push(idx);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    applyState();
  }

  list.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => toggle(li));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(li); }
    });
  });

  applyState();
}

// ─── Table of Contents ───────────────────────────────────────────────────────

function buildTOC(sections) {
  const toc = document.getElementById('toc');
  if (!toc) return;

  const items = sections.map((s, i) => `
    <li>
      <a href="#section-${i}" class="toc-link" data-target="section-${i}">
        <span class="toc-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="toc-text">${escHtml(s.heading)}</span>
      </a>
    </li>`).join('');

  const quizItem = `
    <li class="toc-divider-item">
      <a href="#quizSection" class="toc-link toc-quiz" data-target="quizSection">
        <span class="toc-num" aria-hidden="true">✦</span>
        <span class="toc-text">Knowledge Check</span>
      </a>
    </li>`;

  toc.innerHTML = `
    <div class="toc-header">
      <span class="toc-title">// Contents</span>
      <button class="toc-toggle" id="tocToggle" aria-label="Toggle table of contents" aria-expanded="true">
        <span class="toc-toggle-icon" aria-hidden="true">▲</span>
      </button>
    </div>
    <nav aria-label="Section navigation">
      <ul class="toc-list" id="tocList" role="list">
        ${items}
        <li class="toc-sep" role="separator" aria-hidden="true"></li>
        ${quizItem}
      </ul>
    </nav>`;

  // ── Smooth scroll on click ──
  toc.querySelectorAll('.toc-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
      // Update active immediately on click
      toc.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ── Mobile toggle ──
  const toggle   = document.getElementById('tocToggle');
  const list     = document.getElementById('tocList');
  const icon     = toggle && toggle.querySelector('.toc-toggle-icon');

  function isMobileLayout() { return window.innerWidth < 1100; }

  function applyInitialCollapse() {
    if (!toggle || !list) return;
    if (isMobileLayout()) {
      list.classList.add('toc-collapsed');
      if (icon) icon.textContent = '▼';
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      list.classList.remove('toc-collapsed');
      if (icon) icon.textContent = '▲';
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  applyInitialCollapse();
  window.addEventListener('resize', applyInitialCollapse);

  if (toggle && list) {
    toggle.addEventListener('click', () => {
      const collapsed = list.classList.toggle('toc-collapsed');
      if (icon) icon.textContent = collapsed ? '▼' : '▲';
      toggle.setAttribute('aria-expanded', !collapsed);
    });
  }
}

function initScrollSpy() {
  const toc = document.getElementById('toc');
  if (!toc) return;

  const links = toc.querySelectorAll('.toc-link[data-target]');
  if (!links.length) return;

  // Track which section is most visible
  let activeId = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = toc.querySelector(`.toc-link[data-target="${entry.target.id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        // Deactivate all, activate this one
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        activeId = entry.target.id;

        // Keep active link scrolled into view inside the TOC
        if (window.innerWidth >= 1100) {
          link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    });
  }, {
    // Fire when the top of a section crosses 20% from the top of the viewport
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0,
  });

  links.forEach(link => {
    const target = document.getElementById(link.dataset.target);
    if (target) observer.observe(target);
  });

  // Activate the first link immediately (before any scrolling)
  if (links[0]) links[0].classList.add('active');
}

// ─── Quiz System ──────────────────────────────────────────────────────────────

function renderQuiz(questions) {
  const container = document.getElementById('quizContainer');
  if (!container || !questions) return;

  let answered = 0;
  let correct  = 0;
  const total  = questions.length;

  container.innerHTML = questions.map((q, qi) => `
    <div class="quiz-box" id="quiz-${qi}">
      <p class="quiz-question">${qi + 1}. ${escHtml(q.question)}</p>
      <div class="quiz-options" role="group" aria-label="Answer choices for question ${qi + 1}">
        ${q.answers.map((ans, ai) => `
          <button class="quiz-option"
            data-qi="${qi}" data-ai="${ai}"
            aria-label="Option ${String.fromCharCode(65 + ai)}: ${escHtml(ans)}">
            <strong>${String.fromCharCode(65 + ai)})</strong> ${escHtml(ans)}
          </button>`).join('')}
      </div>
      <div class="quiz-feedback" id="feedback-${qi}" aria-live="polite"></div>
    </div>`).join('');

  container.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const qi  = parseInt(btn.dataset.qi, 10);
      const ai  = parseInt(btn.dataset.ai, 10);
      const q   = questions[qi];
      const box = document.getElementById(`quiz-${qi}`);

      // Disable all options for this question
      box.querySelectorAll('.quiz-option').forEach(b => { b.disabled = true; });

      const isCorrect = ai === q.correct;
      btn.classList.add(isCorrect ? 'correct' : 'wrong');

      if (!isCorrect) {
        box.querySelector(`[data-qi="${qi}"][data-ai="${q.correct}"]`).classList.add('correct');
      }

      const feedback = document.getElementById(`feedback-${qi}`);
      if (feedback) {
        feedback.className  = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        feedback.innerHTML  = isCorrect
          ? `✓ Correct! ${escHtml(q.explanation)}`
          : `✗ Not quite. The answer is <strong>${String.fromCharCode(65 + q.correct)}</strong>. ${escHtml(q.explanation)}`;
      }

      answered++;
      if (isCorrect) correct++;

      if (answered === total) showScore();
    });
  });

  function showScore() {
    const scoreEl   = document.getElementById('quizScore');
    const numEl     = document.getElementById('quizScoreNum');
    const msgEl     = document.getElementById('quizScoreMsg');
    const tryAgain  = document.getElementById('tryAgainBtn');
    if (!scoreEl) return;

    numEl.textContent = `You got ${correct} / ${total} correct`;
    if (correct === total) {
      msgEl.textContent = 'Perfect score! 🎉';
      msgEl.style.color = 'var(--accent)';
    } else if (correct >= total - 1) {
      msgEl.textContent = 'Nice work! Review the topic and try again.';
      msgEl.style.color = 'var(--warn)';
    } else {
      msgEl.textContent = 'Keep studying — you\'ve got this!';
      msgEl.style.color = 'var(--text-muted)';
    }
    scoreEl.style.display = 'block';
    scoreEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    tryAgain.addEventListener('click', () => {
      scoreEl.style.display = 'none';
      answered = 0;
      correct  = 0;
      renderQuiz(questions);
    }, { once: true });
  }
}

// ─── Topic Navigation ─────────────────────────────────────────────────────────

function renderTopicNav(topics, currentId) {
  const idx   = topics.findIndex(t => t.id === currentId);
  const prev  = topics[idx - 1];
  const next  = topics[idx + 1];

  const prevEl = document.getElementById('prevLink');
  const nextEl = document.getElementById('nextLink');

  if (prevEl) {
    prevEl.innerHTML = prev
      ? `<a href="/topic/${prev.id}" aria-label="Previous topic: ${prev.title}">← ${prev.title}</a>`
      : '';
  }
  if (nextEl) {
    nextEl.innerHTML = next
      ? `<a href="/topic/${next.id}" aria-label="Next topic: ${next.title}">${next.title} →</a>`
      : '';
  }
}

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function getTopicSVG(id, icon, title) {
  const svgs = {
    '01': `<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg" aria-label="CIA Triad diagram">
      <rect width="800" height="260" fill="#141414" rx="8"/>
      <text x="400" y="35" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="13">// CIA Triad</text>
      <!-- C -->
      <rect x="60" y="60" width="190" height="150" rx="6" fill="#0d0d0d" stroke="#00ff88" stroke-width="1.5"/>
      <text x="155" y="105" text-anchor="middle" fill="#00ff88" font-size="26">🔒</text>
      <text x="155" y="135" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="14">Confidentiality</text>
      <text x="155" y="155" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="11">Authorized access only</text>
      <!-- I -->
      <rect x="305" y="60" width="190" height="150" rx="6" fill="#0d0d0d" stroke="#00ff88" stroke-width="1.5"/>
      <text x="400" y="105" text-anchor="middle" fill="#00ff88" font-size="26">✅</text>
      <text x="400" y="135" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="14">Integrity</text>
      <text x="400" y="155" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="11">Data accurate &amp; unmodified</text>
      <!-- A -->
      <rect x="550" y="60" width="190" height="150" rx="6" fill="#0d0d0d" stroke="#00ff88" stroke-width="1.5"/>
      <text x="645" y="105" text-anchor="middle" fill="#00ff88" font-size="26">⚡</text>
      <text x="645" y="135" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="14">Availability</text>
      <text x="645" y="155" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="11">Systems up when needed</text>
      <!-- Arrows -->
      <line x1="250" y1="135" x2="305" y2="135" stroke="#1f1f1f" stroke-width="2"/>
      <line x1="495" y1="135" x2="550" y2="135" stroke="#1f1f1f" stroke-width="2"/>
    </svg>`,

    '02': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Cyber threat types">
      <rect width="800" height="200" fill="#141414" rx="8"/>
      <text x="400" y="30" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="13">// Threat Landscape</text>
      ${['🦠 Malware','🎣 Phishing','🔐 Ransomware','👤 Social Eng.','💣 DDoS','🕵️ MitM'].map((t,i) => {
        const x = 70 + (i % 3) * 230;
        const y = 60 + Math.floor(i / 3) * 90;
        const [em, ...rest] = t.split(' ');
        return `<rect x="${x-55}" y="${y-20}" width="160" height="55" rx="4" fill="#0d0d0d" stroke="#1f1f1f" stroke-width="1"/>
        <text x="${x-55+15}" y="${y+8}" fill="#00ff88" font-size="20">${em}</text>
        <text x="${x-55+45}" y="${y+8}" fill="#e0e0e0" font-family="Share Tech Mono" font-size="12">${rest.join(' ')}</text>`;
      }).join('')}
    </svg>`,

    '03': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="MFA diagram">
      <rect width="800" height="200" fill="#141414" rx="8"/>
      <text x="400" y="30" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="13">// Multi-Factor Authentication</text>
      ${[['🧠','Something you KNOW','Password / PIN'],['📱','Something you HAVE','Auth App / SMS'],['👁️','Something you ARE','Fingerprint / Face']].map(([em,label,ex],i) => {
        const x = 120 + i * 240;
        return `<circle cx="${x}" cy="100" r="40" fill="#0d0d0d" stroke="#00ff88" stroke-width="1.5"/>
        <text x="${x}" y="107" text-anchor="middle" font-size="24">${em}</text>
        <text x="${x}" y="160" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="10">${label}</text>
        <text x="${x}" y="175" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="10">${ex}</text>`;
      }).join('')}
      <line x1="160" y1="100" x2="240" y2="100" stroke="#1f1f1f" stroke-width="1.5" stroke-dasharray="4"/>
      <line x1="400" y1="100" x2="480" y2="100" stroke="#1f1f1f" stroke-width="1.5" stroke-dasharray="4"/>
    </svg>`,

    '04': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Phishing red flags">
      <rect width="800" height="200" fill="#141414" rx="8"/>
      <rect x="40" y="30" width="350" height="140" rx="4" fill="#0d0d0d" stroke="#1f1f1f"/>
      <rect x="40" y="30" width="350" height="25" rx="4" fill="#1a1a1a"/>
      <text x="55" y="47" fill="#666" font-family="Share Tech Mono" font-size="11">From: support@paypa1.com ⚠️</text>
      <text x="55" y="75" fill="#e0e0e0" font-family="Share Tech Mono" font-size="12">⚠️ YOUR ACCOUNT WILL BE</text>
      <text x="55" y="92" fill="#e0e0e0" font-family="Share Tech Mono" font-size="12">DELETED IN 24 HOURS!</text>
      <text x="55" y="115" fill="#666" font-family="Share Tech Mono" font-size="11">Click here: http://evil-site.com ⚠️</text>
      <text x="55" y="140" fill="#666" font-family="Share Tech Mono" font-size="11">See attachment: invoice.exe ⚠️</text>
      <text x="215" y="168" fill="#ff4444" font-family="Share Tech Mono" font-size="11" text-anchor="middle">Multiple Red Flags!</text>
      <text x="550" y="55" fill="#00ff88" font-family="Share Tech Mono" font-size="12" text-anchor="middle">Red Flags</text>
      ${['Spoofed sender','Urgency tactics','Suspicious link','Malicious attachment'].map((t,i)=>`<text x="440" y="${80 + i * 25}" fill="#ff8888" font-family="Share Tech Mono" font-size="11">🚩 ${t}</text>`).join('')}
    </svg>`,

    '05': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Network diagram">
      <rect width="800" height="200" fill="#141414" rx="8"/>
      <text x="400" y="30" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="13">// Network Security Flow</text>
      ${[['💻','Your Device',80],['📡','Router',240],['🛡️','Firewall',400],['☁️','Internet',560]].map(([em,lbl,x])=>`
        <rect x="${x-55}" y="55" width="110" height="90" rx="6" fill="#0d0d0d" stroke="#00ff88" stroke-width="1.5"/>
        <text x="${x}" y="95" text-anchor="middle" font-size="28">${em}</text>
        <text x="${x}" y="120" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="11">${lbl}</text>
      `).join('')}
      <line x1="135" y1="100" x2="185" y2="100" stroke="#1f1f1f" stroke-width="2"/>
      <text x="160" y="94" fill="#666" font-size="16" text-anchor="middle">→</text>
      <line x1="295" y1="100" x2="345" y2="100" stroke="#1f1f1f" stroke-width="2"/>
      <text x="320" y="94" fill="#666" font-size="16" text-anchor="middle">→</text>
      <line x1="455" y1="100" x2="505" y2="100" stroke="#1f1f1f" stroke-width="2"/>
      <text x="480" y="94" fill="#666" font-size="16" text-anchor="middle">🔒</text>
    </svg>`,

    '06': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Encryption keys diagram">
      <rect width="800" height="200" fill="#141414" rx="8"/>
      <text x="400" y="28" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="13">// Asymmetric Encryption</text>
      <text x="130" y="60" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="11">Public Key 🔑</text>
      <rect x="50" y="70" width="160" height="50" rx="4" fill="#0d0d0d" stroke="#00ff88" stroke-width="1.5"/>
      <text x="130" y="100" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="12">Encrypts message</text>
      <text x="130" y="155" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="10">Share freely with anyone</text>
      <text x="670" y="60" text-anchor="middle" fill="#ff4444" font-family="Share Tech Mono" font-size="11">Private Key 🗝️</text>
      <rect x="590" y="70" width="160" height="50" rx="4" fill="#0d0d0d" stroke="#ff4444" stroke-width="1.5"/>
      <text x="670" y="100" text-anchor="middle" fill="#ff4444" font-family="Share Tech Mono" font-size="12">Decrypts message</text>
      <text x="670" y="155" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="10">Keep this SECRET always</text>
      <text x="400" y="85" text-anchor="middle" font-size="32">✉️</text>
      <text x="400" y="115" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="11">Ciphertext</text>
      <line x1="210" y1="95" x2="370" y2="95" stroke="#00ff88" stroke-width="1.5" stroke-dasharray="6,3"/>
      <line x1="430" y1="95" x2="590" y2="95" stroke="#ff4444" stroke-width="1.5" stroke-dasharray="6,3"/>
    </svg>`,

    '07': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Safe browsing illustration">
      <rect width="800" height="200" fill="#141414" rx="8"/>
      <rect x="40" y="30" width="440" height="140" rx="6" fill="#0d0d0d" stroke="#1f1f1f"/>
      <rect x="40" y="30" width="440" height="28" rx="6" fill="#1a1a1a"/>
      <text x="55" y="49" fill="#00ff88" font-size="13">🔒</text>
      <rect x="75" y="38" width="260" height="14" rx="3" fill="#141414" stroke="#2a2a2a"/>
      <text x="85" y="50" fill="#00ff88" font-family="Share Tech Mono" font-size="10">https://bank.com</text>
      <text x="260" y="50" fill="#666" font-family="Share Tech Mono" font-size="9">✓ Verified</text>
      <text x="220" y="90" text-anchor="middle" fill="#e0e0e0" font-family="Share Tech Mono" font-size="16">Secure Connection ✓</text>
      <text x="220" y="115" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="12">TLS 1.3 Encrypted</text>
      <text x="600" y="55" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="11">Good Habits</text>
      ${['✓ Use HTTPS','✓ Check the URL','✓ Keep updated','✓ Use a VPN'].map((t,i)=>`<text x="520" y="${75 + i * 22}" fill="#00cc6a" font-family="Share Tech Mono" font-size="11">${t}</text>`).join('')}
    </svg>`,

    '08': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Linux terminal">
      <rect width="800" height="200" fill="#0a0a0a" rx="8" stroke="#2a2a2a"/>
      <rect x="0" y="0" width="800" height="28" rx="8" fill="#1a1a1a"/>
      <circle cx="18" cy="14" r="6" fill="#ff5f57"/>
      <circle cx="38" cy="14" r="6" fill="#ffbd2e"/>
      <circle cx="58" cy="14" r="6" fill="#28c840"/>
      <text x="400" y="19" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="11">bash — user@kali: ~</text>
      ${[
        ['$','ls -la','list directory contents'],
        ['$','cat /etc/passwd','read a file'],
        ['$','grep -r "admin" .','search files'],
        ['$','chmod 755 script.sh','set permissions'],
        ['$','sudo nmap -sV target','port scan'],
      ].map(([p,cmd,comment],i)=>`
        <text x="20" y="${50 + i * 28}" fill="#00ff88" font-family="Share Tech Mono" font-size="12">${p} ${cmd}</text>
        <text x="340" y="${50 + i * 28}" fill="#444" font-family="Share Tech Mono" font-size="12"># ${comment}</text>
      `).join('')}
    </svg>`,

    '09': `<svg viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg" aria-label="Incident response lifecycle">
      <rect width="800" height="220" fill="#141414" rx="8"/>
      <text x="400" y="28" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="13">// IR Lifecycle (NIST)</text>
      ${['Preparation','Detection','Containment','Eradication','Recovery','Lessons Learned'].map((step,i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const cx = 400 + Math.cos(angle) * 140;
        const cy = 125 + Math.sin(angle) * 80;
        return `<circle cx="${cx}" cy="${cy}" r="28" fill="#0d0d0d" stroke="#00ff88" stroke-width="1.5"/>
          <text x="${cx}" y="${cy - 3}" text-anchor="middle" fill="#00ff88" font-family="Share Tech Mono" font-size="10">${i+1}</text>
          <text x="${cx}" y="${cy + 10}" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="8">${step.split(' ')[0]}</text>`;
      }).join('')}
    </svg>`,

    '11': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Bash and SSH terminal">
      <rect width="800" height="200" fill="#0a0a0a" rx="8" stroke="#2a2a2a"/>
      <rect x="0" y="0" width="800" height="26" rx="8" fill="#1a1a1a"/>
      <circle cx="16" cy="13" r="5" fill="#ff5f57"/>
      <circle cx="34" cy="13" r="5" fill="#ffbd2e"/>
      <circle cx="52" cy="13" r="5" fill="#28c840"/>
      <text x="400" y="18" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="11">bash — kali@kali: ~</text>
      <text x="16" y="48" fill="#666" font-family="Share Tech Mono" font-size="12">kali@kali:~$</text>
      <text x="115" y="48" fill="#00ff88" font-family="Share Tech Mono" font-size="12">ssh-keygen -t ed25519 -C "me@kali"</text>
      <text x="16" y="66" fill="#4488ff" font-family="Share Tech Mono" font-size="11">Generating public/private ed25519 key pair.</text>
      <text x="16" y="82" fill="#666" font-family="Share Tech Mono" font-size="11">Enter file: /home/kali/.ssh/id_ed25519</text>
      <text x="16" y="98" fill="#666" font-family="Share Tech Mono" font-size="11">Your public key has been saved in id_ed25519.pub</text>
      <text x="16" y="120" fill="#666" font-family="Share Tech Mono" font-size="12">kali@kali:~$</text>
      <text x="115" y="120" fill="#00ff88" font-family="Share Tech Mono" font-size="12">cat /etc/passwd | grep -v nologin | cut -d: -f1</text>
      <text x="16" y="138" fill="#ffaa00" font-family="Share Tech Mono" font-size="11">root  kali  postgres  mysql</text>
      <text x="16" y="160" fill="#666" font-family="Share Tech Mono" font-size="12">kali@kali:~$</text>
      <text x="115" y="160" fill="#00ff88" font-family="Share Tech Mono" font-size="12">find / -perm -4000 2&gt;/dev/null</text>
      <text x="16" y="178" fill="#ff4444" font-family="Share Tech Mono" font-size="11">/usr/bin/sudo  /usr/bin/passwd  /usr/bin/newgrp</text>
    </svg>`,

    '10': `<svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label="Cybersecurity careers">
      <rect width="800" height="200" fill="#141414" rx="8"/>
      <text x="400" y="28" text-anchor="middle" fill="#666" font-family="Share Tech Mono" font-size="13">// Cybersecurity Career Paths</text>
      ${[['🔴','Pen Tester','#ff4444'],['🔵','Analyst','#4488ff'],['🟡','Engineer','#ffaa00'],['🟢','Forensics','#00ff88'],['🟣','GRC','#aa44ff'],['⚪','Architect','#e0e0e0']].map(([em,role,color],i) => {
        const x = 70 + (i % 3) * 240;
        const y = 65 + Math.floor(i / 3) * 85;
        return `<rect x="${x-55}" y="${y-20}" width="160" height="50" rx="4" fill="#0d0d0d" stroke="${color}33" stroke-width="1.5"/>
          <text x="${x-35}" y="${y+8}" fill="${color}" font-size="18">${em}</text>
          <text x="${x-10}" y="${y+8}" fill="#e0e0e0" font-family="Share Tech Mono" font-size="12">${role}</text>`;
      }).join('')}
    </svg>`,
  };

  const svg = svgs[id];
  if (!svg) return '';
  return `<div class="topic-svg-wrap" role="img" aria-label="${title} illustration">${svg}</div>`;
}

// ─── Utility: HTML Escape ─────────────────────────────────────────────────────

function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initSmoothScroll();

  if (isHomePage()) {
    initTypewriter();
    renderTopicGrid();
  } else if (window.location.pathname.startsWith('/topic/')) {
    renderTopicPage();
  }
});
