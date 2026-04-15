const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// ─── Topics Data ────────────────────────────────────────────────────────────

const topics = [
  {
    id: '01',
    title: 'What is Cybersecurity?',
    icon: '🛡️',
    shortDesc: 'Learn the CIA Triad and why protecting digital systems matters.',
    image: 'cia-triad.png',
    difficulty: 'Beginner',
    readTime: '~5 min read',
    fullContent: {
      sections: [
        {
          heading: 'Defining Cybersecurity',
          body: 'Cybersecurity is the practice of protecting computers, networks, programs, and data from digital attacks, unauthorized access, damage, or theft. Think of it as a digital lock system for all your information and devices.',
        },
        {
          heading: 'The CIA Triad',
          body: 'The foundation of cybersecurity rests on three core principles known as the CIA Triad:',
          cia: true,
        },
        {
          heading: 'Real-World Example',
          body: 'Ever wonder why your bank\'s website shows a padlock icon (🔒) in the browser address bar? That padlock means the site uses HTTPS — an encrypted connection. This protects the <strong>Confidentiality</strong> of your login credentials, ensures the <strong>Integrity</strong> of your transactions, and the bank\'s 24/7 uptime provides <strong>Availability</strong> when you need it.',
          callout: { type: 'info', text: 'The padlock in your browser = Confidentiality + Integrity in action!' },
        },
      ],
    },
    quiz: [
      {
        question: 'Which part of the CIA Triad means only authorized people can see data?',
        answers: ['Availability', 'Integrity', 'Confidentiality', 'Authentication'],
        correct: 2,
        explanation: 'Confidentiality ensures data is only accessible to those with proper authorization.',
      },
      {
        question: 'What does "Integrity" mean in cybersecurity?',
        answers: ['Data is always fast', 'Data is accurate and unmodified', 'Data is encrypted', 'Data is deleted'],
        correct: 1,
        explanation: 'Integrity means data remains accurate, consistent, and unaltered by unauthorized parties.',
      },
      {
        question: 'What is cybersecurity primarily trying to protect?',
        answers: ['Hardware prices', 'Internet speed', 'Digital systems, networks, and data', 'Phone batteries'],
        correct: 2,
        explanation: 'Cybersecurity focuses on protecting digital systems, networks, programs, and the data within them.',
      },
    ],
  },
  {
    id: '02',
    title: 'Types of Threats',
    icon: '⚠️',
    shortDesc: 'Explore common cyber threats from malware to social engineering.',
    image: 'threat-types.png',
    difficulty: 'Beginner',
    readTime: '~6 min read',
    fullContent: {
      sections: [
        {
          heading: 'The Threat Landscape',
          body: 'Cyber threats come in many forms. Understanding each type helps you recognize and avoid them. Here are the most common categories you\'ll encounter:',
        },
        {
          heading: 'Common Threat Types',
          body: '',
          threats: [
            { icon: '🦠', name: 'Malware', desc: 'Software designed to damage, disrupt, or gain unauthorized access to a system.' },
            { icon: '🎣', name: 'Phishing', desc: 'Fake emails or websites that trick you into revealing sensitive information.' },
            { icon: '🔐', name: 'Ransomware', desc: 'Encrypts your files and demands payment to restore access.' },
            { icon: '👤', name: 'Social Engineering', desc: 'Manipulating people psychologically rather than exploiting technical weaknesses.' },
            { icon: '💣', name: 'DoS / DDoS', desc: 'Flooding a server with traffic to take it offline and deny service to legitimate users.' },
            { icon: '🕵️', name: 'Man-in-the-Middle', desc: 'Secretly intercepting and potentially altering communications between two parties.' },
          ],
        },
        {
          heading: 'Real-World Example',
          body: 'Have you ever received an email that looked like it was from Netflix, warning your account would be cancelled? That\'s phishing — attackers mimic trusted brands to steal your credentials.',
          callout: { type: 'warn', text: 'If an email creates urgency or panic, slow down and verify — it\'s likely a phishing attempt.' },
        },
      ],
    },
    quiz: [
      {
        question: 'What is phishing?',
        answers: ['Hacking a Wi-Fi router', 'A type of firewall', 'Tricking users into revealing sensitive info', 'Encrypting files for ransom'],
        correct: 2,
        explanation: 'Phishing uses deceptive emails or websites to trick users into giving up sensitive information like passwords.',
      },
      {
        question: 'What does ransomware do?',
        answers: ['Speeds up your PC', 'Sends spam emails', 'Locks your files and demands payment', 'Steals your browser history'],
        correct: 2,
        explanation: 'Ransomware encrypts your files and demands a ransom payment — usually in cryptocurrency — to restore access.',
      },
      {
        question: 'What is a DDoS attack?',
        answers: ['Guessing passwords', 'Overwhelming a server with traffic', 'Stealing credit cards', 'Installing a keylogger'],
        correct: 1,
        explanation: 'A Distributed Denial of Service (DDoS) attack floods a server with massive amounts of traffic to knock it offline.',
      },
    ],
  },
  {
    id: '03',
    title: 'Passwords & Authentication',
    icon: '🔑',
    shortDesc: 'Understand strong passwords, MFA, and password managers.',
    image: 'mfa-diagram.png',
    difficulty: 'Beginner',
    readTime: '~7 min read',
    fullContent: {
      sections: [
        {
          heading: 'Strong vs Weak Passwords',
          body: 'A weak password is an open door for attackers. Here\'s what separates a terrible password from a strong one:',
          passwordTable: true,
        },
        {
          heading: 'Length Beats Complexity',
          body: 'A longer password is exponentially harder to crack than a short complex one. "correct-horse-battery-staple" is far stronger than "P@ss1" even though it looks simpler. This is because of <strong>entropy</strong> — the measure of unpredictability in your password.',
          callout: { type: 'info', text: 'Aim for 16+ characters. Length is your best defense.' },
        },
        {
          heading: 'Multi-Factor Authentication (MFA)',
          body: 'MFA requires two or more verification factors. Even if an attacker steals your password, they can\'t log in without the second factor:<br><br><strong>Something you know</strong> → Password or PIN<br><strong>Something you have</strong> → Phone app (Authenticator), SMS code, hardware key<br><strong>Something you are</strong> → Fingerprint, face scan',
        },
        {
          heading: 'Password Managers',
          body: 'A password manager generates and securely stores unique, complex passwords for every account. You only remember one master password. Popular options include Bitwarden (free, open-source), 1Password, and Dashlane.',
          callout: { type: 'warn', text: 'Never reuse passwords. A breach on one site shouldn\'t compromise all your accounts.' },
        },
        {
          heading: 'Interactive Demo: Password Strength Checker',
          body: 'Try typing a password below to see its strength evaluated in real time:',
          demo: 'password-strength',
        },
      ],
    },
    quiz: [
      {
        question: 'Which password is strongest?',
        answers: ['password123', 'fluffy', 'T!g3r$unR1se#42', '12345678'],
        correct: 2,
        explanation: 'T!g3r$unR1se#42 uses uppercase, lowercase, numbers, and symbols with good length — maximizing entropy.',
      },
      {
        question: 'What does MFA stand for?',
        answers: ['Multiple File Access', 'Multi-Factor Authentication', 'Main Firewall App', 'Managed File Archive'],
        correct: 1,
        explanation: 'MFA stands for Multi-Factor Authentication — requiring two or more verification methods to log in.',
      },
      {
        question: 'What is a password manager?',
        answers: ['A person who resets passwords', 'A browser built-in feature only', 'A tool that generates and stores strong passwords securely', 'A type of antivirus'],
        correct: 2,
        explanation: 'Password managers generate and securely store unique passwords for every account, requiring only one master password.',
      },
    ],
  },
  {
    id: '04',
    title: 'Phishing & Social Engineering',
    icon: '🎣',
    shortDesc: 'Spot phishing emails and manipulation tactics before they catch you.',
    image: 'phishing-example.png',
    difficulty: 'Beginner',
    readTime: '~6 min read',
    fullContent: {
      sections: [
        {
          heading: 'Phishing: The Most Common Attack Vector',
          body: 'Phishing is the #1 way attackers gain initial access to systems. It\'s simple, cheap, and devastatingly effective. Attackers craft convincing fake emails, websites, or messages to steal credentials or install malware.',
        },
        {
          heading: 'Types of Phishing',
          body: '<strong>Generic Phishing</strong> → Mass emails sent to thousands of random targets (fake PayPal, Netflix, Amazon alerts).<br><br><strong>Spear Phishing</strong> → Targeted attacks on a specific person. The attacker researches you on LinkedIn, social media, etc. to craft a convincing, personalized message.<br><br><strong>Vishing</strong> → Voice phishing via phone calls. Attackers impersonate your bank, IRS, or IT support.<br><br><strong>Smishing</strong> → SMS phishing. Fake text messages with malicious links.',
        },
        {
          heading: 'Pretexting',
          body: 'Pretexting means creating a fabricated scenario (a "pretext") to manipulate someone into giving up information. Example: an attacker calls your company\'s helpdesk pretending to be an IT technician needing access credentials.',
        },
        {
          heading: 'Red Flags to Watch For',
          body: '',
          callout: {
            type: 'warn',
            text: '🚩 Mismatched sender address (support@paypa1.com instead of paypal.com)<br>🚩 Urgency language: "Act NOW or your account will be DELETED!"<br>🚩 Suspicious links — hover before you click<br>🚩 Generic greetings: "Dear Customer" instead of your name<br>🚩 Unexpected attachments<br>🚩 Requests for passwords or financial info via email<br>🚩 Too-good-to-be-true offers',
          },
        },
      ],
    },
    quiz: [
      {
        question: 'What is spear phishing?',
        answers: ['Attacking fish in the ocean', 'A targeted phishing attack aimed at a specific person', 'A firewall type', 'Random mass phishing'],
        correct: 1,
        explanation: 'Spear phishing targets specific individuals using personalized information gathered from research.',
      },
      {
        question: 'You get an email saying "Your account will be deleted in 24 hours — click now!" This is likely...',
        answers: ['A legitimate notice', 'A system error', 'A phishing attempt using urgency', 'A software update'],
        correct: 2,
        explanation: 'Urgency is a classic phishing tactic designed to make you act before you think critically.',
      },
      {
        question: 'What is "vishing"?',
        answers: ['A type of virus', 'Phishing via voice/phone calls', 'A VPN attack', 'Visual hacking'],
        correct: 1,
        explanation: 'Vishing (voice phishing) uses phone calls to impersonate legitimate organizations and extract sensitive information.',
      },
    ],
  },
  {
    id: '05',
    title: 'Networking Basics for Security',
    icon: '🌐',
    shortDesc: 'Understand IP addresses, firewalls, VPNs, and why HTTPS matters.',
    image: 'network-diagram.png',
    difficulty: 'Beginner',
    readTime: '~7 min read',
    fullContent: {
      sections: [
        {
          heading: 'IP Addresses, Ports & Protocols',
          body: 'Every device on a network has an <strong>IP address</strong> — like a home address for your computer. <strong>Public IPs</strong> are visible on the internet; <strong>Private IPs</strong> (like 192.168.x.x) are used inside your home network.<br><br><strong>Ports</strong> are like doors on a building — specific services use specific ports (HTTP uses port 80, HTTPS uses 443, SSH uses 22).<br><br><strong>Protocols</strong> are the agreed-upon rules for communication (TCP/IP, HTTP, DNS, etc.).',
        },
        {
          heading: 'What is a Firewall?',
          body: 'A firewall monitors incoming and outgoing network traffic and decides what to allow or block based on predefined rules. Think of it as a security guard at the door of a building — checking every visitor against an approved list.',
          callout: { type: 'info', text: 'Firewalls can be hardware (a physical device) or software (built into your OS or router).' },
        },
        {
          heading: 'What is a VPN?',
          body: 'A Virtual Private Network (VPN) creates an encrypted tunnel between your device and a VPN server. This hides your real IP address and encrypts your traffic, protecting you on public Wi-Fi and adding privacy from your ISP.',
          callout: { type: 'warn', text: 'A VPN protects your traffic in transit — it doesn\'t make you anonymous or protect against malware.' },
        },
        {
          heading: 'HTTP vs HTTPS',
          body: '<strong>HTTP</strong> (HyperText Transfer Protocol) sends data in plain text — anyone on the network can read it.<br><br><strong>HTTPS</strong> adds TLS/SSL encryption. The padlock in your browser means your connection is encrypted and the site\'s identity is verified.',
        },
        {
          heading: 'Network Flow Diagram',
          body: 'Here\'s how your data travels from your device to the internet:',
          diagram: 'network-flow',
        },
      ],
    },
    quiz: [
      {
        question: 'What does HTTPS provide that HTTP does not?',
        answers: ['Faster loading', 'Ad blocking', 'Encrypted communication', 'Larger file support'],
        correct: 2,
        explanation: 'HTTPS uses TLS/SSL to encrypt all data in transit, preventing eavesdropping and tampering.',
      },
      {
        question: 'What is a firewall?',
        answers: ['A physical wall in a data center', 'A system that monitors and controls network traffic', 'A type of antivirus', 'An internet speed booster'],
        correct: 1,
        explanation: 'A firewall monitors network traffic and applies rules to allow or block connections based on security policy.',
      },
      {
        question: 'What does a VPN primarily do?',
        answers: ['Speed up your internet', 'Block all ads', 'Encrypt your connection and mask your IP', 'Delete cookies'],
        correct: 2,
        explanation: 'A VPN creates an encrypted tunnel that hides your IP address and protects your traffic from eavesdropping.',
      },
    ],
  },
  {
    id: '06',
    title: 'Encryption Basics',
    icon: '🔒',
    shortDesc: 'Discover how encryption scrambles data and keeps secrets safe.',
    image: 'encryption-keys.png',
    difficulty: 'Beginner',
    readTime: '~8 min read',
    fullContent: {
      sections: [
        {
          heading: 'What is Encryption?',
          body: 'Encryption is the process of converting readable data (plaintext) into an unreadable scrambled format (ciphertext) using a mathematical algorithm and a key. Only someone with the correct key can decrypt it back to readable form.',
        },
        {
          heading: 'Symmetric vs Asymmetric Encryption',
          body: '<strong>Symmetric Encryption</strong> → The same key is used to both encrypt and decrypt. Fast and efficient, but the challenge is securely sharing that key. Think of a padlock where you and a friend both have copies of the same key.<br><br><strong>Asymmetric Encryption</strong> → Uses two mathematically linked keys: a <strong>public key</strong> (shared freely) and a <strong>private key</strong> (kept secret). Anyone can encrypt a message with your public key, but only your private key can decrypt it. Like a mailbox slot: anyone can drop mail in, only you can take it out.',
          callout: { type: 'info', text: 'HTTPS uses asymmetric encryption to exchange a symmetric key, then switches to symmetric for speed.' },
        },
        {
          heading: 'Common Algorithms',
          body: '<strong>AES</strong> (Advanced Encryption Standard) → The gold standard for symmetric encryption. Used in HTTPS, file encryption, and Wi-Fi (WPA2).<br><br><strong>RSA</strong> → A widely used asymmetric algorithm for key exchange and digital signatures.',
        },
        {
          heading: 'Hashing vs Encryption',
          body: '<strong>Encryption</strong> is a two-way process — you can encrypt and decrypt.<br><br><strong>Hashing</strong> is one-way — you convert data into a fixed-length hash (like a fingerprint). You can\'t reverse it. Passwords are stored as hashes — when you log in, your typed password is hashed and compared to the stored hash.',
          callout: { type: 'warn', text: 'Never store passwords in plain text. Always hash them with a strong algorithm like bcrypt.' },
        },
        {
          heading: 'Interactive Demo: Caesar Cipher',
          body: 'The Caesar Cipher is one of history\'s oldest encryption methods — it just shifts each letter by a fixed number. Try it below! (Real encryption is FAR more complex.)',
          demo: 'caesar-cipher',
        },
      ],
    },
    quiz: [
      {
        question: 'What is the main difference between encryption and hashing?',
        answers: ['They are the same thing', 'Encryption is reversible, hashing is not', 'Hashing is reversible, encryption is not', 'Neither can be reversed'],
        correct: 1,
        explanation: 'Encryption is designed to be reversed with the correct key. Hashing is a one-way function — you cannot recover the original data.',
      },
      {
        question: 'In asymmetric encryption, what does your public key do?',
        answers: ['Decrypts messages sent to you', 'Encrypts messages sent TO you', 'Signs your identity', 'Generates new keys'],
        correct: 1,
        explanation: 'Others use your public key to encrypt messages for you. Only your private key can decrypt them.',
      },
      {
        question: 'Which of these is a well-known symmetric encryption algorithm?',
        answers: ['RSA', 'SHA-256', 'AES', 'MD5'],
        correct: 2,
        explanation: 'AES (Advanced Encryption Standard) is the industry standard symmetric encryption algorithm used worldwide.',
      },
    ],
  },
  {
    id: '07',
    title: 'Safe Browsing & Digital Hygiene',
    icon: '🧹',
    shortDesc: 'Build habits that keep you secure in everyday digital life.',
    image: 'safe-browsing.png',
    difficulty: 'Beginner',
    readTime: '~6 min read',
    fullContent: {
      sections: [
        {
          heading: 'Browser Security Basics',
          body: '<strong>Cookies</strong> are small files websites store in your browser to remember you. While convenient, they can be used for tracking across sites.<br><br><strong>Trackers</strong> are scripts that monitor your behavior across the web, building a profile for targeted advertising (or worse).<br><br><strong>HTTPS</strong> ensures your connection to a website is encrypted — always look for the padlock.',
        },
        {
          heading: 'Spotting Suspicious URLs',
          body: 'Before clicking any link, look at the domain carefully. Attackers register look-alike domains to fool you:<br><br>❌ <code>paypa1.com</code> (number "1" instead of letter "l")<br>❌ <code>amazon-security-alert.com</code> (legitimate-looking subdomain trick)<br>❌ <code>netflix.account-verify.com</code> (real company name, but not their domain)<br><br>✅ Always verify the actual domain — the part right before .com/.org/.edu.',
          callout: { type: 'danger', text: 'Hover over links before clicking to preview the real destination URL.' },
        },
        {
          heading: 'Software Updates & Patching',
          body: 'Every software vulnerability gets a CVE (Common Vulnerabilities and Exposures) identifier. When developers discover a flaw, they release a patch. If you delay updating, attackers exploit the known vulnerability against you.',
          callout: { type: 'warn', text: 'Enable automatic updates. An outdated system is a system with known, exploitable holes.' },
        },
        {
          heading: 'Public Wi-Fi Risks',
          body: 'Public Wi-Fi (coffee shops, airports) is a hunting ground for attackers.<br><br><strong>Packet sniffing</strong> → Attackers capture unencrypted traffic on the same network.<br><strong>Evil Twin APs</strong> → Fake Wi-Fi hotspots that mimic legitimate ones to intercept your traffic.<br><br>If you must use public Wi-Fi, use a VPN and stick to HTTPS sites only.',
        },
        {
          heading: 'Digital Hygiene Checklist',
          body: 'Check off the habits you\'ve already built. Aim for a perfect score!',
          demo: 'hygiene-checklist',
        },
      ],
    },
    quiz: [
      {
        question: 'Why should you be cautious on public Wi-Fi?',
        answers: ['It is always slower', 'It may cost money', 'Attackers can intercept unencrypted traffic', 'It blocks HTTPS'],
        correct: 2,
        explanation: 'On public Wi-Fi, attackers on the same network can capture unencrypted traffic through packet sniffing.',
      },
      {
        question: 'What is a "domain spoofing" attack?',
        answers: ['Registering a look-alike domain to fool users', 'Hacking the DNS server', 'Redirecting all traffic to one IP', 'Stealing SSL certificates'],
        correct: 0,
        explanation: 'Domain spoofing involves registering domains that look like legitimate ones (e.g., paypa1.com) to deceive users.',
      },
      {
        question: 'Why are software updates important for security?',
        answers: ['They make apps look nicer', 'They add new features only', 'They patch known vulnerabilities', 'They speed up your CPU'],
        correct: 2,
        explanation: 'Updates patch known CVEs (vulnerabilities). Running outdated software means attackers can use documented exploits against you.',
      },
    ],
  },
  {
    id: '08',
    title: 'Linux & Command Line Basics',
    icon: '💻',
    shortDesc: 'Get familiar with the terminal tools security professionals use daily.',
    image: 'linux-terminal.png',
    difficulty: 'Beginner',
    readTime: '~8 min read',
    fullContent: {
      sections: [
        {
          heading: 'Why Security Pros Use Linux',
          body: 'Linux is the operating system of choice for cybersecurity professionals. It\'s free, open-source, powerful, and most security tools (Kali Linux, Wireshark, Metasploit, Nmap) are built for it. Understanding Linux is a fundamental skill for any security career.',
        },
        {
          heading: 'Essential Commands',
          body: 'Open a terminal and you\'re in control. Here are the commands you\'ll use constantly:',
          terminal: [
            { cmd: 'ls', desc: 'List files and directories in the current location' },
            { cmd: 'pwd', desc: 'Print Working Directory — shows where you are' },
            { cmd: 'cd /path/to/dir', desc: 'Change Directory — navigate to a folder' },
            { cmd: 'cat filename.txt', desc: 'Display the contents of a file' },
            { cmd: 'grep "pattern" file', desc: 'Search for text patterns inside files' },
            { cmd: 'chmod 755 file', desc: 'Change file permissions (read/write/execute)' },
            { cmd: 'whoami', desc: 'Display the current logged-in user' },
            { cmd: 'ifconfig  (or ip a)', desc: 'Show network interface info and IP addresses' },
            { cmd: 'ps aux', desc: 'List all currently running processes' },
            { cmd: 'sudo command', desc: 'Run a command with superuser (admin) privileges' },
          ],
        },
        {
          heading: 'File Permissions',
          body: 'Linux uses a permission system of <strong>r</strong> (read), <strong>w</strong> (write), <strong>x</strong> (execute) for three groups: <strong>owner</strong>, <strong>group</strong>, and <strong>other</strong>.<br><br>Example: <code>-rwxr-xr--</code><br>Owner: rwx (full control), Group: r-x (read + execute), Other: r-- (read only)',
          callout: { type: 'info', text: 'You\'ll use these commands in later cybersecurity courses and labs!' },
        },
      ],
    },
    quiz: [
      {
        question: 'What does the "ls" command do in Linux?',
        answers: ['Log out the user', 'List files and directories', 'Load a script', 'Link two systems'],
        correct: 1,
        explanation: '"ls" lists the files and directories in your current location — it\'s one of the most frequently used commands.',
      },
      {
        question: 'What does "chmod" do?',
        answers: ['Changes directory', 'Checks hardware modules', 'Changes file permissions', 'Chains commands'],
        correct: 2,
        explanation: '"chmod" (change mode) modifies file permission settings controlling who can read, write, or execute a file.',
      },
      {
        question: 'What does "sudo" do?',
        answers: ['Shows disk usage', 'Runs a command with superuser (admin) privileges', 'Starts a new user session', 'Searches for updates'],
        correct: 1,
        explanation: '"sudo" (superuser do) executes a command with elevated administrator privileges — use it carefully.',
      },
    ],
  },
  {
    id: '09',
    title: 'Incident Response Basics',
    icon: '🚨',
    shortDesc: 'Learn the 6-step lifecycle for handling a cybersecurity incident.',
    image: 'incident-response.png',
    difficulty: 'Beginner',
    readTime: '~6 min read',
    fullContent: {
      sections: [
        {
          heading: 'What is a Cybersecurity Incident?',
          body: 'A cybersecurity incident is any event that threatens the confidentiality, integrity, or availability of information or systems. Examples include a data breach, ransomware infection, unauthorized access, or a DDoS attack.',
        },
        {
          heading: 'The Incident Response Lifecycle',
          body: 'Organizations follow a structured process to handle incidents. NIST defines six phases:',
          diagram: 'ir-lifecycle',
        },
        {
          heading: 'Who Responds to Incidents?',
          body: '<strong>SOC (Security Operations Center)</strong> → The team that monitors systems 24/7 for threats and triages alerts.<br><br><strong>IR Team (Incident Response Team)</strong> → Specialized responders who investigate and contain confirmed incidents.<br><br><strong>CISO (Chief Information Security Officer)</strong> → The executive responsible for an organization\'s overall security strategy and incident communication.',
        },
        {
          heading: 'What YOU Should Do If You Think You\'ve Been Hacked',
          body: '',
          callout: {
            type: 'danger',
            text: '1. 🔌 Disconnect from the internet immediately<br>2. 🔐 Change your passwords FROM A CLEAN DEVICE<br>3. 📢 Notify your IT/security team (or school\'s IT helpdesk)<br>4. 🚫 Don\'t delete anything — preserve evidence<br>5. 📝 Document what happened and when',
          },
        },
      ],
    },
    quiz: [
      {
        question: 'What is the FIRST step in the incident response lifecycle?',
        answers: ['Recovery', 'Detection', 'Preparation', 'Eradication'],
        correct: 2,
        explanation: 'Preparation comes first — having policies, tools, and trained teams ready before an incident occurs.',
      },
      {
        question: 'If you suspect your account was hacked, what should you do FIRST?',
        answers: ['Delete all files', 'Post about it on social media', 'Change your passwords from a clean device', 'Ignore it'],
        correct: 2,
        explanation: 'Using a clean (uncompromised) device to change your passwords prevents the attacker from intercepting your new credentials.',
      },
      {
        question: 'What does SOC stand for in cybersecurity?',
        answers: ['System Operations Center', 'Security Operations Center', 'Software Output Check', 'Secure Online Connection'],
        correct: 1,
        explanation: 'SOC stands for Security Operations Center — a team that monitors and defends an organization\'s systems around the clock.',
      },
    ],
  },
  {
    id: '10',
    title: 'Careers in Cybersecurity',
    icon: '🚀',
    shortDesc: 'Explore the many career paths in the growing cybersecurity field.',
    image: 'cyber-careers.png',
    difficulty: 'Beginner',
    readTime: '~5 min read',
    fullContent: {
      sections: [
        {
          heading: 'A Field That\'s Exploding',
          body: 'There are over 3.5 million unfilled cybersecurity jobs worldwide. The demand far outpaces supply. Whether you love hacking, coding, investigations, policy, or communication — there\'s a cybersecurity career path for you.',
        },
        {
          heading: 'Career Paths',
          body: '',
          careers: [
            { color: '#ff4444', icon: '🔴', title: 'Penetration Tester', desc: 'Ethical hacker who finds vulnerabilities before attackers do. The red team.' },
            { color: '#4488ff', icon: '🔵', title: 'Security Analyst', desc: 'Monitors systems and responds to threats from the SOC. Frontline defender.' },
            { color: '#ffaa00', icon: '🟡', title: 'Security Engineer', desc: 'Builds and maintains security tools, firewalls, and infrastructure.' },
            { color: '#00ff88', icon: '🟢', title: 'Forensic Analyst', desc: 'Investigates incidents and recovers digital evidence for legal proceedings.' },
            { color: '#aa44ff', icon: '🟣', title: 'GRC Analyst', desc: 'Handles Governance, Risk, and Compliance — policies, audits, and regulations.' },
            { color: '#e0e0e0', icon: '⚪', title: 'Security Architect', desc: 'Designs secure systems and networks at a high, strategic level.' },
          ],
        },
        {
          heading: 'Certifications to Start With',
          body: 'These beginner-friendly certifications are recognized by employers worldwide:<br><br>🏆 <strong>CompTIA Security+</strong> → The industry-standard entry-level cert. Get this first.<br>🔧 <strong>CompTIA A+</strong> → Foundation in IT that makes Security+ much easier.<br>🌐 <strong>Google Cybersecurity Certificate</strong> → Free on Coursera, great for absolute beginners.',
        },
        {
          heading: 'Competitions & Hands-On Learning',
          body: 'The best way to learn cybersecurity is by <em>doing</em> it. Competitions give you real skills fast:<br><br>⚔️ <strong>NCL (National Cyber League)</strong> → College-level CTF competition. Join your school\'s team!<br>🏴 <strong>picoCTF</strong> → Beginner-friendly CTF challenges from Carnegie Mellon.<br>🕐 <strong>CTFtime.org</strong> → Calendar of CTF competitions worldwide.',
        },
        {
          heading: 'Ready to Go Deeper?',
          body: 'Check out these free platforms to start building real skills:',
          resources: [
            { name: 'TryHackMe', url: 'https://tryhackme.com', desc: 'Beginner-friendly guided cybersecurity labs and learning paths.' },
            { name: 'picoCTF', url: 'https://picoctf.org', desc: 'Free CTF challenges designed for beginners by Carnegie Mellon.' },
            { name: 'Cybrary', url: 'https://www.cybrary.it', desc: 'Free and paid cybersecurity courses for all skill levels.' },
          ],
        },
      ],
    },
    quiz: [
      {
        question: 'What does a penetration tester do?',
        answers: ['Repairs network cables', 'Writes company security policies', 'Ethically hacks systems to find vulnerabilities', 'Monitors server uptime'],
        correct: 2,
        explanation: 'Penetration testers (pen testers) are hired to ethically attack systems to find vulnerabilities before real attackers do.',
      },
      {
        question: 'Which certification is commonly recommended for cybersecurity beginners?',
        answers: ['CISSP', 'OSCP', 'CompTIA Security+', 'CISA'],
        correct: 2,
        explanation: 'CompTIA Security+ is the most widely recognized entry-level cybersecurity certification and a great first step.',
      },
      {
        question: 'What is NCL?',
        answers: ['National Code Library', 'Network Control Layer', 'National Cyber League — a cybersecurity competition', 'New Computer Language'],
        correct: 2,
        explanation: 'NCL (National Cyber League) is a college-level cybersecurity competition using CTF-style challenges.',
      },
    ],
  },
  {
    id: '11',
    title: 'Bash Basics for Kali Linux',
    icon: '⚡',
    shortDesc: 'Master the command-line tools and SSH skills used daily in security work and CTFs.',
    image: 'bash-basics.png',
    difficulty: 'Beginner',
    readTime: '~15 min read',
    fullContent: {
      sections: [
        {
          heading: 'Why Every Security Pro Uses Bash',
          body: 'The command line is your most powerful tool in cybersecurity. Whether you\'re running Kali Linux for pentesting, analyzing logs on a server, or competing in a CTF, bash proficiency separates beginners from practitioners. This guide assumes you\'re on <strong>Kali Linux</strong> — the go-to distro for security work. Open a terminal and follow along.',
          callout: { type: 'info', text: '💡 Kali Linux default user is <code>kali</code>. Your home directory is <code>/home/kali</code>. The terminal is your best friend.' },
        },
        {
          heading: 'Navigating the File System',
          body: 'These are the commands you\'ll run hundreds of times a day:',
          commandGroups: [
            {
              group: 'Navigation & Listing',
              cmds: [
                { cmd: 'pwd', desc: 'Print Working Directory — see exactly where you are' },
                { cmd: 'ls', desc: 'List files in current directory' },
                { cmd: 'ls -la', desc: 'List ALL files (including hidden .files) in long format' },
                { cmd: 'ls -lah', desc: 'Same but with human-readable sizes (KB, MB, GB)' },
                { cmd: 'ls -lt', desc: 'Sort by modification time, newest first' },
                { cmd: 'cd /path/to/dir', desc: 'Change to an absolute path' },
                { cmd: 'cd ~', desc: 'Jump to home directory (/home/kali)' },
                { cmd: 'cd -', desc: 'Jump back to the previous directory' },
                { cmd: 'cd ..', desc: 'Go up one directory level' },
                { cmd: 'tree -L 2', desc: 'Visual directory tree, 2 levels deep (apt install tree)' },
              ],
            },
          ],
        },
        {
          heading: 'File & Directory Operations',
          body: 'Creating, copying, moving, and deleting files. Note: Linux has no Recycle Bin — <code>rm</code> is permanent.',
          commandGroups: [
            {
              group: 'File Management',
              cmds: [
                { cmd: 'touch file.txt', desc: 'Create an empty file (or update its timestamp)' },
                { cmd: 'mkdir my_dir', desc: 'Create a directory' },
                { cmd: 'mkdir -p a/b/c', desc: 'Create nested directories, no error if they exist' },
                { cmd: 'cp file.txt copy.txt', desc: 'Copy a file' },
                { cmd: 'cp -r dir/ backup/', desc: 'Copy entire directory recursively' },
                { cmd: 'mv file.txt /tmp/', desc: 'Move a file to /tmp/ (also used to rename)' },
                { cmd: 'mv old.txt new.txt', desc: 'Rename a file' },
                { cmd: 'rm file.txt', desc: 'Delete a file — no trash, gone forever' },
                { cmd: 'rm -rf dir/', desc: '⚠️ Recursively delete directory and all contents' },
                { cmd: 'ln -s /real/path link', desc: 'Create a symbolic (soft) link' },
                { cmd: 'file mystery_file', desc: 'Identify file type — ignores the extension' },
              ],
            },
          ],
          callout: { type: 'danger', text: '⚠️ <code>rm -rf /</code> or <code>rm -rf /*</code> will delete your entire system with no undo. Always double-check before running <code>rm -rf</code>.' },
        },
        {
          heading: 'Viewing & Searching File Contents',
          body: 'Reading files and hunting for specific data — core skills for CTF forensics, log analysis, and recon:',
          commandGroups: [
            {
              group: 'Viewing Files',
              cmds: [
                { cmd: 'cat file.txt', desc: 'Print the entire file to terminal' },
                { cmd: 'cat -n file.txt', desc: 'Print file with line numbers' },
                { cmd: 'less file.txt', desc: 'Scroll through a file (q = quit, /word = search, n = next match)' },
                { cmd: 'head -n 20 file.txt', desc: 'Show first 20 lines of a file' },
                { cmd: 'tail -n 20 file.txt', desc: 'Show last 20 lines' },
                { cmd: 'tail -f /var/log/syslog', desc: 'Live-follow a log file as it grows' },
                { cmd: 'xxd file.bin | head', desc: 'Hex dump — see the raw bytes of any file' },
                { cmd: 'strings file.bin', desc: 'Extract printable strings from a binary (key CTF skill!)' },
              ],
            },
            {
              group: 'Searching',
              cmds: [
                { cmd: 'grep "pattern" file.txt', desc: 'Search for a pattern inside a file' },
                { cmd: 'grep -r "password" .', desc: 'Recursive search across all files in current directory' },
                { cmd: 'grep -i "admin" file.txt', desc: 'Case-insensitive search' },
                { cmd: 'grep -n "error" file.txt', desc: 'Show line numbers of matches' },
                { cmd: 'grep -v "nologin" /etc/passwd', desc: 'Show lines that do NOT match (invert)' },
                { cmd: 'grep -E "flag\\{.*\\}" *.txt', desc: 'Extended regex — hunt for CTF flags!' },
                { cmd: 'find / -name "*.conf" 2>/dev/null', desc: 'Find all .conf files (hide permission errors)' },
                { cmd: 'find . -perm -4000', desc: 'Find SUID files — common privilege escalation target' },
                { cmd: 'find / -user root -perm -4000 2>/dev/null', desc: 'Find root-owned SUID binaries' },
                { cmd: 'locate secret.txt', desc: 'Fast search using a database (run updatedb first)' },
              ],
            },
          ],
        },
        {
          heading: 'Text Processing Power Tools',
          body: 'Transform, filter, and extract data from text streams. These are indispensable for log analysis, wordlist manipulation, and CTF challenges:',
          commandGroups: [
            {
              group: 'Text Processing',
              cmds: [
                { cmd: 'cut -d":" -f1 /etc/passwd', desc: 'Cut field 1 using ":" as delimiter — extracts usernames' },
                { cmd: 'sort words.txt', desc: 'Sort lines alphabetically' },
                { cmd: 'sort -n numbers.txt', desc: 'Sort numerically (not lexicographically)' },
                { cmd: 'sort -u words.txt', desc: 'Sort and remove duplicate lines' },
                { cmd: 'sort -rn scores.txt', desc: 'Sort numerically in reverse (highest first)' },
                { cmd: 'uniq -c sorted.txt', desc: 'Count occurrences of adjacent identical lines (sort first!)' },
                { cmd: 'wc -l file.txt', desc: 'Count lines. -w = words, -c = bytes' },
                { cmd: 'sed "s/old/new/g" file.txt', desc: 'Replace all "old" with "new" (g = global)' },
                { cmd: 'sed -n "10,20p" file.txt', desc: 'Print only lines 10 through 20' },
                { cmd: "awk '{print $1, $3}' file.txt", desc: 'Print columns 1 and 3 (space-delimited)' },
                { cmd: "awk -F: '{print $1}' /etc/passwd", desc: 'Use ":" as field separator' },
                { cmd: 'tr "a-z" "A-Z" < file.txt', desc: 'Translate all lowercase to uppercase' },
                { cmd: 'base64 -d encoded.txt', desc: 'Decode base64 — extremely common in CTFs!' },
                { cmd: 'echo "hello" | rev', desc: 'Reverse a string — classic CTF trick' },
                { cmd: 'echo "74657374" | xxd -r -p', desc: 'Convert hex to ASCII' },
              ],
            },
          ],
        },
        {
          heading: 'Piping & Redirection',
          body: 'Piping and redirection let you chain commands into powerful one-liners. Understanding stdin, stdout, and stderr is fundamental:<br><br><strong>stdin (0)</strong> → input to a program<br><strong>stdout (1)</strong> → normal output<br><strong>stderr (2)</strong> → error messages',
          commandGroups: [
            {
              group: 'Operators',
              cmds: [
                { cmd: 'cmd1 | cmd2', desc: 'Pipe: stdout of cmd1 becomes stdin of cmd2' },
                { cmd: 'cmd > file.txt', desc: 'Redirect stdout to file — OVERWRITES existing content' },
                { cmd: 'cmd >> file.txt', desc: 'Append stdout to file — preserves existing content' },
                { cmd: 'cmd < file.txt', desc: 'Use file contents as stdin' },
                { cmd: 'cmd 2>/dev/null', desc: 'Discard error messages (/dev/null is the void)' },
                { cmd: 'cmd 2>&1', desc: 'Redirect stderr to stdout — see ALL output together' },
                { cmd: 'cmd > out.txt 2>&1', desc: 'Save all output (stdout + stderr) to file' },
                { cmd: 'cmd | tee file.txt', desc: 'Display output AND simultaneously save it to file' },
                { cmd: 'cmd1 && cmd2', desc: 'Run cmd2 only if cmd1 succeeds (exit code 0)' },
                { cmd: 'cmd1 || cmd2', desc: 'Run cmd2 only if cmd1 fails' },
                { cmd: 'cmd1 ; cmd2', desc: 'Run cmd2 after cmd1 regardless of success/failure' },
                { cmd: 'xargs', desc: 'Build commands from stdin: cat urls.txt | xargs curl -O' },
              ],
            },
          ],
          callout: { type: 'info', text: 'Example one-liner: <code>cat /etc/passwd | grep -v "nologin" | cut -d: -f1 | sort | tee users.txt</code><br>→ Extract all real user accounts, sort them, display them, and save to users.txt — all at once.' },
        },
        {
          heading: 'File Permissions Deep Dive',
          body: 'Linux permissions control exactly who can read, write, and execute files. Understanding them is essential for both hardening systems and finding privesc paths:<br><br><code>-rwxr-xr--</code><br>→ Char 1: type (<code>-</code>=file, <code>d</code>=dir, <code>l</code>=symlink)<br>→ Chars 2–4: <strong>owner</strong> permissions<br>→ Chars 5–7: <strong>group</strong> permissions<br>→ Chars 8–10: <strong>others</strong> permissions',
          permTable: true,
          commandGroups: [
            {
              group: 'Permission Commands',
              cmds: [
                { cmd: 'chmod 755 script.sh', desc: 'Owner: rwx, Group: r-x, Others: r-x' },
                { cmd: 'chmod 644 file.txt', desc: 'Owner: rw-, Group: r--, Others: r-- (standard for files)' },
                { cmd: 'chmod 600 private.key', desc: 'Owner: rw- only — REQUIRED for SSH private keys!' },
                { cmd: 'chmod 700 ~/.ssh', desc: 'Owner only — REQUIRED for your .ssh directory!' },
                { cmd: 'chmod +x script.sh', desc: 'Add execute permission (for all users)' },
                { cmd: 'chmod u+x,g-w file', desc: 'Owner +execute, Group -write (symbolic notation)' },
                { cmd: 'chown kali:kali file.txt', desc: 'Change owner to kali, group to kali' },
                { cmd: 'chown -R kali /opt/tools', desc: 'Recursively change ownership of entire directory' },
                { cmd: 'find / -perm -4000 2>/dev/null', desc: 'Find SUID files — a key privesc technique' },
                { cmd: 'find / -perm -2000 2>/dev/null', desc: 'Find SGID files' },
                { cmd: 'find / -writable -type d 2>/dev/null', desc: 'Find world-writable directories' },
              ],
            },
          ],
          callout: { type: 'warn', text: '🔺 <strong>SUID bit</strong> (chmod 4755): the file runs with its <em>owner\'s</em> privileges regardless of who executes it. Finding a root-owned SUID binary on a target is a classic privilege escalation vector — check GTFOBins!' },
        },
        {
          heading: 'Process Management',
          body: 'Monitoring and controlling running processes — essential for detecting malware, managing listeners, and sysadmin work:',
          commandGroups: [
            {
              group: 'Processes & Jobs',
              cmds: [
                { cmd: 'ps aux', desc: 'Show all running processes with user, PID, CPU, memory, command' },
                { cmd: 'ps aux | grep nginx', desc: 'Filter processes by name' },
                { cmd: 'top', desc: 'Live process monitor (press q to quit, k to kill by PID)' },
                { cmd: 'htop', desc: 'Colour-coded interactive process viewer (apt install htop)' },
                { cmd: 'kill 1234', desc: 'Send SIGTERM (graceful stop) to PID 1234' },
                { cmd: 'kill -9 1234', desc: 'Send SIGKILL (force stop) — the process cannot ignore this' },
                { cmd: 'killall firefox', desc: 'Kill all processes matching that name' },
                { cmd: 'pkill -f "python"', desc: 'Kill processes by matching the full command string' },
                { cmd: 'cmd &', desc: 'Run command in the background (gets a job number)' },
                { cmd: 'jobs', desc: 'List all background jobs in this shell session' },
                { cmd: 'fg %1', desc: 'Bring background job #1 to the foreground' },
                { cmd: 'bg %1', desc: 'Resume a stopped job in the background' },
                { cmd: 'Ctrl+Z', desc: 'Pause the current foreground process' },
                { cmd: 'nohup cmd &', desc: 'Run command immune to hangup — survives terminal close' },
                { cmd: 'screen -S mysession', desc: 'Create persistent named session (Ctrl+A, D to detach)' },
                { cmd: 'screen -r mysession', desc: 'Reattach to a detached screen session' },
              ],
            },
          ],
        },
        {
          heading: 'Networking Commands on Kali',
          body: 'These commands form your recon toolkit. Understanding your own network and probing target networks:',
          commandGroups: [
            {
              group: 'Network Recon & Configuration',
              cmds: [
                { cmd: 'ip a', desc: 'Show all network interfaces and assigned IP addresses' },
                { cmd: 'ip route', desc: 'Show routing table — identify the default gateway' },
                { cmd: 'ifconfig', desc: 'Classic network interface info (still common on older systems)' },
                { cmd: 'ping -c 4 8.8.8.8', desc: 'Send 4 ICMP packets to test connectivity' },
                { cmd: 'traceroute 8.8.8.8', desc: 'Trace the network path to a destination (each hop)' },
                { cmd: 'netstat -tulpn', desc: 'Show listening TCP/UDP ports and their processes' },
                { cmd: 'ss -tulpn', desc: 'Faster, modern replacement for netstat' },
                { cmd: 'curl -I https://example.com', desc: 'Fetch HTTP response headers only (great for recon)' },
                { cmd: 'curl -s url | grep "flag"', desc: 'Silently download and search content' },
                { cmd: 'wget -q https://example.com/file', desc: 'Download a file quietly' },
                { cmd: 'nc -lvnp 4444', desc: 'Listen on port 4444 — catch reverse shells here!' },
                { cmd: 'nc target.com 80', desc: 'Connect to port 80 (manual banner grab)' },
                { cmd: 'dig google.com', desc: 'Detailed DNS lookup (try dig @8.8.8.8 domain.com)' },
                { cmd: 'nslookup domain.com', desc: 'Simple DNS query' },
                { cmd: 'whois domain.com', desc: 'Domain registration info and CIDR ranges' },
                { cmd: 'arp -a', desc: 'View ARP cache to discover hosts on local network' },
                { cmd: 'host domain.com', desc: 'Quick DNS forward/reverse lookup' },
              ],
            },
          ],
        },
        {
          heading: 'SSH & SSH Keys — The Complete Guide',
          body: 'SSH (Secure Shell) is how you securely access remote servers — and how you\'ll pivot between machines during pentests. Key-based authentication is far stronger than passwords and is what professionals use.',
          sshKeySteps: true,
          callout: { type: 'danger', text: '🔑 <strong>NEVER share your private key</strong> (<code>~/.ssh/id_ed25519</code>). Your public key (<code>~/.ssh/id_ed25519.pub</code>) is safe to distribute — that\'s by design.' },
        },
        {
          heading: 'Package Management with APT',
          body: 'Kali uses <strong>APT</strong> (Advanced Package Tool) on top of Debian. Kali\'s repositories include hundreds of security tools ready to install:',
          commandGroups: [
            {
              group: 'APT Commands',
              cmds: [
                { cmd: 'sudo apt update', desc: 'Refresh the package index from repositories (do this first!)' },
                { cmd: 'sudo apt upgrade', desc: 'Upgrade all installed packages to latest versions' },
                { cmd: 'sudo apt full-upgrade', desc: 'Upgrade + handle dependency changes (safer for Kali)' },
                { cmd: 'sudo apt install nmap', desc: 'Install a package (e.g., nmap)' },
                { cmd: 'sudo apt install -y nmap', desc: 'Install without prompting for confirmation' },
                { cmd: 'sudo apt remove nmap', desc: 'Remove a package (keeps config files)' },
                { cmd: 'sudo apt purge nmap', desc: 'Remove package and all its configuration files' },
                { cmd: 'sudo apt autoremove', desc: 'Clean up unused dependency packages' },
                { cmd: 'apt search keyword', desc: 'Search for packages by keyword' },
                { cmd: 'apt show nmap', desc: 'Show detailed info about a package' },
                { cmd: 'dpkg -i package.deb', desc: 'Install a local .deb file directly' },
                { cmd: 'dpkg -l | grep nmap', desc: 'Check if a package is installed' },
              ],
            },
          ],
          callout: { type: 'info', text: 'Kali meta-packages: <code>kali-tools-top10</code> installs the 10 most-used tools. <code>kali-linux-large</code> installs the full toolkit. Start with top10.' },
        },
        {
          heading: 'Bash Scripting Basics',
          body: 'Automating repetitive tasks with scripts multiplies your effectiveness enormously. Every security professional should be able to write basic bash scripts:',
          scriptExample: {
            title: 'Example: Host Discovery Script',
            code: '#!/bin/bash\n# Ping-sweep a subnet to find live hosts\n# Usage: chmod +x discover.sh && ./discover.sh 192.168.1\n\nTARGET=$1\n\n# Check that an argument was provided\nif [ -z "$TARGET" ]; then\n    echo "Usage: $0 <subnet>"\n    echo "Example: $0 192.168.1"\n    exit 1\nfi\n\necho "[*] Scanning $TARGET.0/24 for live hosts..."\nALIVE=0\n\n# Loop through all 254 host addresses\nfor i in $(seq 1 254); do\n    HOST="$TARGET.$i"\n    # -c 1 = one packet, -W 1 = 1s timeout, &>/dev/null = suppress output\n    if ping -c 1 -W 1 "$HOST" &>/dev/null; then\n        echo "[+] ALIVE: $HOST"\n        ALIVE=$((ALIVE + 1))\n    fi\ndone\n\necho "[*] Scan complete. Found $ALIVE live host(s)."',
          },
          commandGroups: [
            {
              group: 'Scripting Essentials',
              cmds: [
                { cmd: '#!/bin/bash', desc: 'Shebang — first line, tells OS to use bash to run this file' },
                { cmd: 'VAR="hello world"', desc: 'Assign a variable — NO spaces around the = sign!' },
                { cmd: 'echo $VAR', desc: 'Print a variable\'s value (prefix with $)' },
                { cmd: '"$VAR"', desc: 'Always quote variables to handle spaces safely' },
                { cmd: 'read -p "Enter name: " NAME', desc: 'Prompt user for interactive input' },
                { cmd: '$((5 + 3))', desc: 'Arithmetic expansion — evaluates to 8' },
                { cmd: 'if [ -f file.txt ]; then ... fi', desc: 'Conditional: -f = file exists, -d = dir exists, -z = empty string' },
                { cmd: 'if [ "$VAR" = "yes" ]; then ... fi', desc: 'String comparison (use = not ==)' },
                { cmd: 'for i in $(seq 1 10); do ... done', desc: 'Loop from 1 to 10' },
                { cmd: 'for f in *.txt; do echo "$f"; done', desc: 'Loop over files matching a glob' },
                { cmd: 'while IFS= read -r line; do ... done < file', desc: 'Loop over each line in a file (safest method)' },
                { cmd: 'function greet() { echo "Hello, $1!"; }', desc: 'Define a function — $1 is first argument' },
                { cmd: 'chmod +x script.sh && ./script.sh', desc: 'Make executable, then run it' },
              ],
            },
          ],
        },
      ],
    },
    quiz: [
      {
        question: 'Which command generates a new Ed25519 SSH key pair?',
        answers: [
          'ssh-keygen -t ed25519',
          'ssh-newkey --type ed25519',
          'openssl genrsa -ed25519',
          'keygen -ed25519 ~/.ssh/',
        ],
        correct: 0,
        explanation: 'ssh-keygen -t ed25519 creates a secure Ed25519 key pair. Add -C "comment" to label it. The files are saved to ~/.ssh/ by default.',
      },
      {
        question: 'What does the pipe operator (|) do in bash?',
        answers: [
          'Redirects stdout to a file',
          'Runs two commands in parallel at the same time',
          'Passes the stdout of one command as stdin to the next',
          'Connects two separate terminal sessions together',
        ],
        correct: 2,
        explanation: 'The pipe chains commands: output of the left becomes input for the right. Example: cat /etc/passwd | grep kali | cut -d: -f1',
      },
      {
        question: 'What permissions does chmod 600 set on a file?',
        answers: [
          'Owner: read+write+execute; Group: none; Others: none',
          'Owner: read+write; Group: none; Others: none',
          'Owner: read+execute; Group: read; Others: read',
          'Everyone: read+write access',
        ],
        correct: 1,
        explanation: '600 = Owner rw- (6), Group --- (0), Others --- (0). SSH requires private keys to have 600 permissions — it will refuse keys that are too permissive.',
      },
    ],
  },
];

// ─── Express Setup ────────────────────────────────────────────────────────────

app.use(express.static(path.join(__dirname, 'public')));

// ─── View Routes ─────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/topic/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'topic.html'));
});

app.get('/resources', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'resources.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/sop', (req, res) => {
  res.sendFile(path.join(__dirname, 'Cyber_Unit_SOP.pdf'));
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.get('/api/topics', (req, res) => {
  const summary = topics.map(({ id, title, icon, shortDesc, image, difficulty, readTime }) => ({
    id, title, icon, shortDesc, image, difficulty, readTime,
  }));
  res.json(summary);
});

app.get('/api/topic/:id', (req, res) => {
  const topic = topics.find(t => t.id === req.params.id);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json(topic);
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 — CyberUnit @ UNG</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d0d; color: #e0e0e0; font-family: 'Share Tech Mono', monospace; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
        .container { padding: 2rem; }
        h1 { font-size: 6rem; color: #00ff88; line-height: 1; }
        p { color: #666; margin: 1rem 0 2rem; font-size: 1.1rem; }
        a { color: #00ff88; text-decoration: none; border: 1px solid #00ff88; padding: 0.75rem 1.5rem; border-radius: 4px; }
        a:hover { background: #00ff8820; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>// Page not found. This route doesn't exist.</p>
        <a href="/">← Return to Home</a>
      </div>
    </body>
    </html>
  `);
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
