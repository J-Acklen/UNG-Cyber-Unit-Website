// ─── Topic Content Rendering ───────────────────────────────────────────────
// Shared between worker.js (server-side render for crawlers/no-JS) and
// public/js/main.js (client-side render). Pure string-builders only — no
// DOM/browser APIs — so this one file works unmodified in both the Workers
// runtime and the browser. See CLAUDE.md for why this split exists.

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderContent(topic) {
  const sectionsHtml = topic.fullContent.sections.map((section, index) => {
    let html = `<div class="content-section" id="section-${index}">
      <h3>${escapeHtml(section.heading)}</h3>`;

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

  // Beginner framing: a mentor-voice "why this matters" hook up top, and a
  // plain-English key takeaway at the bottom. Both are optional per topic.
  const hook = topic.hook
    ? `<div class="topic-hook">${escapeHtml(topic.hook)}</div>`
    : '';
  const takeaway = topic.takeaway
    ? `<div class="topic-takeaway">
         <span class="topic-takeaway-label">🎯 Key Takeaway</span>
         <p>${escapeHtml(topic.takeaway)}</p>
       </div>`
    : '';
  return hook + sectionsHtml + takeaway;
}

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
        <div class="threat-icon" aria-hidden="true">${escapeHtml(t.icon)}</div>
        <div>
          <h4>${escapeHtml(t.name)}</h4>
          <p>${escapeHtml(t.desc)}</p>
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
      <span class="terminal-cmd"><span class="terminal-prompt" aria-hidden="true">$</span> ${escapeHtml(c.cmd)}</span>
      <span class="terminal-desc"># ${escapeHtml(c.desc)}</span>
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
          <div class="career-icon" aria-hidden="true">${escapeHtml(c.icon)}</div>
          <div>
            <h4>${escapeHtml(c.title)}</h4>
            <p>${escapeHtml(c.desc)}</p>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderResources(resources) {
  return `
    <div class="resource-list" role="list">
      ${resources.map(r => `
        <a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" class="resource-link" role="listitem" aria-label="${escapeHtml(r.name)}: ${escapeHtml(r.desc)}">
          <div>
            <h4>${escapeHtml(r.name)}</h4>
            <p>${escapeHtml(r.desc)}</p>
          </div>
          <span class="link-arrow" aria-hidden="true">↗</span>
        </a>`).join('')}
    </div>`;
}

function renderCallout({ type, text }) {
  return `<div class="callout callout-${type}" role="note">${text}</div>`;
}

function renderCommandGroups(groups) {
  return groups.map(g => `
    <div class="cmd-group" role="region" aria-label="${escapeHtml(g.group)}">
      <div class="cmd-group-title">${escapeHtml(g.group)}</div>
      <div class="cmd-table" role="table" aria-label="${escapeHtml(g.group)} commands">
        ${g.cmds.map(c => `
          <div class="cmd-row" role="row">
            <code class="cmd-cell" role="cell">${escapeHtml(c.cmd)}</code>
            <span class="cmd-desc" role="cell">${escapeHtml(c.desc)}</span>
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
            <pre class="code-block ssh-code">${escapeHtml(s.code)}</pre>
            <p class="ssh-step-note">${escapeHtml(s.note).replace(/\n/g, '<br>')}</p>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderScriptExample({ title, code }) {
  return `
    <div class="script-example" role="region" aria-label="${escapeHtml(title)}">
      <div class="script-title">${escapeHtml(title)}</div>
      <pre class="code-block" style="white-space:pre;overflow-x:auto;">${escapeHtml(code)}</pre>
    </div>`;
}

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

export function getTopicSVG(id, icon, title) {
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
  return `<div class="topic-svg-wrap" role="img" aria-label="${escapeHtml(title)} illustration">${svg}</div>`;
}
