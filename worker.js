import { escapeHtml, renderContent, getTopicSVG } from './public/js/topic-render.js';

// ─── Topics Data ─────────────────────────────────────────────────────────────

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

// ─── Beginner Cyber Pathway ───────────────────────────────────────────────────
// A guided, mentor-narrated sequence over the topics above for someone brand new
// to cyber. Ordered as an emotional arc: why → threats → defense → mechanics →
// hands-on → future. `topicIds` reference the `topics` array (single source of
// truth); the /start page renders each stage's topics as module cards.
const pathwayStages = [
  {
    num: 1,
    title: 'Start Here',
    track: 'Everyone',
    hook: "Everything in security stands on three simple ideas. Nail these and the rest clicks into place — so let's start right here.",
    badge: { name: 'Foundations', icon: '🧱' },
    topicIds: ['01'],
  },
  {
    num: 2,
    title: 'Know the Threats',
    track: 'Everyone',
    hook: "You can't defend against what you can't recognize. Let's meet the attacks you'll actually run into online.",
    badge: { name: 'Threat Spotter', icon: '🎯' },
    topicIds: ['02', '04'],
  },
  {
    num: 3,
    title: 'Protect Yourself',
    track: 'Everyone',
    hook: "Time to lock your own doors. These are the habits that keep you — and everyone who trusts you — safe starting today.",
    badge: { name: 'Guardian', icon: '🛡️' },
    topicIds: ['03', '07'],
  },
  {
    num: 4,
    title: 'Under the Hood',
    track: 'Everyone',
    hook: "Now that you care about staying safe, let's peek at how the internet actually moves — and hides — your data.",
    badge: { name: 'Net Runner', icon: '🌐' },
    topicIds: ['05', '06'],
  },
  {
    num: 5,
    title: 'Get Hands-On',
    track: 'Aspiring Pro',
    hook: "Ready to touch the tools the pros use every day? Don't worry — we'll take it one command at a time.",
    badge: { name: 'Operator', icon: '💻' },
    topicIds: ['08', '11'],
  },
  {
    num: 6,
    title: 'Go Further',
    track: 'Aspiring Pro',
    hook: "You've built a real foundation. Here's what happens when things break — and where this path can take your career.",
    badge: { name: 'Pathfinder', icon: '🧭' },
    topicIds: ['09', '10'],
  },
];

// Resolve a stage's topic ids to their full topic objects, in order.
function pathwayStageTopics(stage) {
  return stage.topicIds.map(id => topics.find(t => t.id === id)).filter(Boolean);
}

// Given a Set of completed topic ids, return each stage's badge with its earned
// state and a link to that stage on the pathway — for the profile badge shelf.
function pathwayBadges(doneTopicIds) {
  return pathwayStages.map(s => ({
    num: s.num,
    name: s.badge.name,
    icon: s.badge.icon,
    track: s.track,
    stageTitle: s.title,
    earned: s.topicIds.every(id => doneTopicIds.has(id)),
    href: `/start#stage-${s.num}`,
  }));
}

// A user's rank on a leaderboard, using the same ordering as /api/leaderboard
// (points, then count, then username). `table` is a fixed internal name, never
// user input. Returns null for guests or users with no points.
async function leaderboardRank(env, table, userId, username) {
  const agg = await env.DB.prepare(
    `SELECT SUM(score) AS points, COUNT(*) AS count FROM ${table} WHERE user_id = ?`
  ).bind(userId).first();
  const points = agg?.points ?? 0;
  const count = agg?.count ?? 0;
  if (points <= 0) return null;
  const row = await env.DB.prepare(`
    SELECT COUNT(*) + 1 AS rank FROM (
      SELECT u.username, SUM(t.score) AS pts, COUNT(*) AS cnt
      FROM users u JOIN ${table} t ON t.user_id = u.id
      WHERE u.role != 'guest'
      GROUP BY u.id
    ) x
    WHERE x.pts > ?
       OR (x.pts = ? AND x.cnt > ?)
       OR (x.pts = ? AND x.cnt = ? AND x.username < ?)
  `).bind(points, points, count, points, count, username).first();
  return row?.rank ?? null;
}

// Beginner framing for each topic: a mentor-voice "why this matters" hook shown
// at the top of the topic page, and a plain-English key takeaway at the bottom.
// Merged into the /api/topic/:id response so the client renders them.
const topicFraming = {
  '01': {
    hook: "Before we touch a single tool, let's get the big picture. Cybersecurity isn't about being a genius in a hoodie — it's about protecting information, and almost all of it comes back to three simple ideas. Get comfortable with these and everything else you learn will have a place to live.",
    takeaway: "Every security decision — a password, a lock, a backup — protects one of three things: keeping data secret (Confidentiality), keeping it correct (Integrity), or keeping it available when you need it (Availability). That's the CIA Triad.",
  },
  '02': {
    hook: "You can't protect yourself from something you can't name. The good news? The attacks you'll actually run into fall into a handful of familiar categories — and once you can spot them, they lose most of their power. Let's meet them.",
    takeaway: "Most attacks are variations on a few themes: tricking you (phishing, social engineering), holding your data hostage (ransomware), or overwhelming a system (DoS). Recognizing the pattern is your first line of defense.",
  },
  '03': {
    hook: "Your password is the front door to your entire digital life — and most people are still using a screen door. This is the single highest-impact habit you can fix today, and it takes about ten minutes. Let's lock things down properly.",
    takeaway: "Length beats complexity, never reuse a password, and turn on multi-factor authentication everywhere you can. A password manager makes all three effortless.",
  },
  '04': {
    hook: "Here's a secret the pros know: attackers rarely 'hack' anything — they trick a person into opening the door for them. That person doesn't have to be you. Once you learn the playbook, the tricks start to feel obvious.",
    takeaway: "If a message creates urgency, fear, or a too-good-to-be-true offer, slow down and verify through a channel you trust. Attackers rely on you reacting fast — so the fix is simply to pause.",
  },
  '05': {
    hook: "Every website you visit and every message you send travels across a network — and you don't need a computer-science degree to follow it. Just enough networking to know where the risks hide (and why that little padlock matters) goes a long way.",
    takeaway: "Data moves in packets across networks using addresses (IP) and rules (protocols). HTTPS encrypts that trip so eavesdroppers can't read it — which is why 'is there a padlock?' is a habit worth keeping.",
  },
  '06': {
    hook: "Encryption sounds like scary math, but the core idea is something you already understand: scrambling a message so only the right person can unscramble it. It's the invisible layer protecting your bank login, your texts, and this very page. Let's demystify it.",
    takeaway: "Encryption turns readable data into scrambled ciphertext that only someone with the right key can reverse. It's what keeps your data private even if someone manages to intercept it.",
  },
  '07': {
    hook: "Staying safe online isn't about paranoia — it's about a few small habits that run on autopilot, like locking your car or washing your hands. Build them once and they protect you every day without a second thought.",
    takeaway: "Keep software updated, be skeptical of links and downloads, use unique passwords, and back up what matters. Small, consistent habits stop the vast majority of everyday threats.",
  },
  '08': {
    hook: "The command line looks intimidating — a blinking cursor and no buttons — but it's just a different way to talk to your computer, one clear instruction at a time. Nearly every security tool lives here, so getting comfortable is your gateway to the hands-on side of cyber. We'll go slow.",
    takeaway: "The terminal lets you control a system precisely with typed commands. Learn a handful — moving between folders, listing files, reading permissions — and you've unlocked the environment most security work happens in.",
  },
  '09': {
    hook: "Sooner or later something goes wrong — a breach, a lost laptop, a login that wasn't you. What separates a minor scare from a disaster is having a plan before the panic. That plan has a name, and it's simpler than you'd think.",
    takeaway: "When something goes wrong, don't improvise — follow the lifecycle: Prepare, Identify, Contain, Eradicate, Recover, and capture Lessons learned. A calm, repeatable process beats panic every time.",
  },
  '10': {
    hook: "Here's the exciting part: everything you're learning opens real doors. Cybersecurity has more open jobs than people to fill them, and there's a role for almost every kind of thinker — the puzzle-solver, the communicator, the builder. Let's talk about where this path can take you.",
    takeaway: "There's no single 'right' way in. Pick a direction that fits how you like to work (defending, attacking, analyzing, building), grab an entry-level certification like Security+, and keep practicing — the field rewards curiosity over credentials.",
  },
  '11': {
    hook: "Ready to feel like you're actually doing cyber? Bash is the language you'll use to drive Kali Linux — the toolkit ethical hackers reach for every day. Don't try to memorize it all; you'll pick it up by doing. Let's write your first commands.",
    takeaway: "Bash lets you chain commands, automate tasks, and run the security tools in Kali. Start with the basics — moving around, running tools, simple scripts — and build from there. Every pro started exactly where you are now.",
  },
};

// ─── Security Headers ─────────────────────────────────────────────────────────

function addSecurityHeaders(headers) {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  return headers;
}

// ─── 404 Page ─────────────────────────────────────────────────────────────────

function notFoundResponse() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — CyberUnit @ UNG</title>
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="/css/style.css">
  <style>
    .page-body { padding-top: 0; }
    .not-found-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: calc(100vh - 56px - 48px);
      text-align: center;
      padding: 2rem 1rem;
      box-sizing: border-box;
    }
    .not-found-code {
      font-size: clamp(5rem, 18vw, 10rem);
      color: var(--accent);
      line-height: 1;
      font-family: 'Share Tech Mono', monospace;
      text-shadow: 0 0 40px rgba(0,255,136,0.6), 0 0 12px rgba(0,255,136,0.4);
    }
    .not-found-msg {
      color: var(--accent);
      margin: 1.25rem 0 2rem;
      font-size: clamp(1rem, 2.5vw, 1.3rem);
      font-family: 'Share Tech Mono', monospace;
      text-shadow: 0 0 16px rgba(0,255,136,0.4);
    }
    .secret { color: var(--bg); font-size: 0.4rem; text-decoration: none; margin-left: 0.2rem; }
    .secret:hover { color: var(--bg); }
  </style>
</head>
<body>

  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="container">
      <a href="/" class="navbar-logo"><img src="/images/CyberUnitLogo_Transparent.png" alt="CyberUnit @ UNG" class="navbar-logo-img"><span class="navbar-logo-text">[ CyberUnit @ UNG ]</span></a>
      <button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="navbar-links" id="navLinks">
        <li><a href="/">Home</a></li>
        <li><a href="/resources">Resources</a></li>
        <li><a href="/about">About</a></li>
        <li id="authNavItem"></li>
      </ul>
    </div>
  </nav>

  <main class="page-body">
    <div class="not-found-section">
      <div class="not-found-code">404</div>
      <p class="not-found-msg">// Page not found. This route doesn't exist.</p>
      <a href="/" class="btn">← Return to Home</a><a href="/danica" class="secret">·</a>
    </div>
  </main>

  <footer>
    CyberUnit @ UNG | Cybersecurity Intro Class | Built on Cloudflare Workers
  </footer>

  <script type="module" src="/js/main.js"></script>
</body>
</html>`;
  const headers = addSecurityHeaders(new Headers({ 'Content-Type': 'text/html; charset=utf-8' }));
  return new Response(html, { status: 404, headers });
}

// ─── Auth action pages (email confirm / password reset) ───────────────────────
// Minimal server-rendered pages for links clicked directly out of an email —
// no JS, so a plain <form method="POST"> is the actual state-changing step.
// This is deliberate: mail security gateways commonly pre-fetch every link in
// an inbound email automatically, before a human opens it. A GET here must
// never mutate anything, or an automated crawler silently burns the user's
// token before they ever see the message. Only the POST (triggered by an
// explicit click) is allowed to change state.
function authActionPageResponse({ title, heading, message, formHtml }, status = 200) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>${title} — CyberUnit @ UNG</title>
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="container">
      <a href="/" class="navbar-logo"><img src="/images/CyberUnitLogo_Transparent.png" alt="CyberUnit @ UNG" class="navbar-logo-img"><span class="navbar-logo-text">[ CyberUnit @ UNG ]</span></a>
      <ul class="navbar-links"><li><a href="/">Home</a></li></ul>
    </div>
  </nav>
  <main class="page-body">
    <div class="container" style="max-width: 480px; padding: 3rem 1rem;">
      <div class="card" style="padding: 2rem;">
        <h1 style="font-family:'Share Tech Mono',monospace;color:var(--accent);font-size:1.3rem;margin:0 0 0.75rem;">${heading}</h1>
        <p style="color:var(--text-soft);margin:0 0 1.25rem;">${message}</p>
        ${formHtml}
      </div>
    </div>
  </main>
</body>
</html>`;
  const headers = addSecurityHeaders(new Headers({ 'Content-Type': 'text/html; charset=utf-8' }));
  return new Response(html, { status, headers });
}

// Per-topic <head> tags so each /topic/:id is its own indexable page rather
// than sharing the generic topic.html metadata. Injected at serve time.
function topicMetaTags(topic) {
  const title = escapeHtml(`${topic.title} — UNG Cyber Unit`);
  const desc = escapeHtml(`${topic.shortDesc} A beginner cybersecurity lesson from the UNG Cyber Unit.`);
  const canonical = `https://ungcyberunit.org/topic/${topic.id}`;
  const image = 'https://ungcyberunit.org/images/CyberUnitLogo_Transparent.png';
  // BreadcrumbList so search engines show Home › Core Topics › <topic> and can
  // build sitelinks. `<` escaping prevents any "</script>" breakout.
  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ungcyberunit.org/' },
      { '@type': 'ListItem', position: 2, name: 'Core Topics', item: 'https://ungcyberunit.org/#topics' },
      { '@type': 'ListItem', position: 3, name: topic.title, item: canonical },
    ],
  }).replace(/</g, '\\u003c');
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:site_name" content="UNG Cyber Unit">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${desc}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary">`,
    `<script type="application/ld+json">${breadcrumb}</script>`,
  ].join('\n  ');
}

// A single topic "module" card — the shared component used by both the homepage
// grid and the pathway stages. `data-topic` lets client JS mark it complete.
function topicCard(t) {
  const title = escapeHtml(t.title);
  return `<a href="/topic/${t.id}" class="card card-link" data-topic="${t.id}" aria-label="${title}">
          <div class="card-icon" aria-hidden="true">${t.icon}</div>
          <h3 class="card-title">${title}</h3>
          <p class="card-desc">${escapeHtml(t.shortDesc)}</p>
          <div class="card-footer">
            <span class="badge badge-beginner">${escapeHtml(t.difficulty)}</span>
            <span class="btn btn-sm" aria-hidden="true">Explore →</span>
          </div>
        </a>`;
}

// Server-rendered topic cards for the homepage so the grid's content is in the
// HTML (crawlers and no-JS users see it). main.js re-renders these with per-user
// progress when it loads, and leaves them intact if that fetch fails.
function homeTopicCards() {
  return topics.map(topicCard).join('\n        ');
}

// Server-rendered Beginner Pathway: stages as nodes on a connecting line, each
// with its mentor hook, track tag, badge, and topic module cards. Client JS
// (start.js) layers on progress, badges, streaks, and motion.
function pathwayHtml() {
  const slug = s => s.toLowerCase().replace(/[^a-z]+/g, '-');
  const stages = pathwayStages.map(stage => {
    const track = slug(stage.track);
    const modules = pathwayStageTopics(stage).map(topicCard).join('\n            ');
    const ids = stage.topicIds.join(' ');
    return `      <li id="stage-${stage.num}" class="pw-stage" data-stage="${stage.num}" data-track="${track}" data-topics="${ids}" data-badge="${escapeHtml(stage.badge.name)}">
        <div class="pw-node" aria-hidden="true"><span class="pw-node-num">${stage.num}</span></div>
        <div class="pw-stage-body">
          <div class="pw-stage-head">
            <span class="pw-kicker">Stage ${stage.num}</span>
            <h2 class="pw-stage-title">${escapeHtml(stage.title)}</h2>
            <span class="pw-track pw-track--${track}">${escapeHtml(stage.track)}</span>
          </div>
          <p class="pw-hook">${escapeHtml(stage.hook)}</p>
          <div class="pw-badge" title="Complete this stage to earn the ${escapeHtml(stage.badge.name)} badge">
            <span class="pw-badge-icon" aria-hidden="true">${stage.badge.icon}</span>
            <span class="pw-badge-name">${escapeHtml(stage.badge.name)}</span>
          </div>
          <div class="pw-modules topic-grid">
            ${modules}
          </div>
        </div>
      </li>`;
  }).join('\n');
  return `<ol class="pathway">\n${stages}\n    </ol>`;
}

// ─── Auth & Progress Helpers ─────────────────────────────────────────────────

function jsonResponse(data, status = 200, extra = {}) {
  const h = new Headers({ 'Content-Type': 'application/json' });
  for (const [k, v] of Object.entries(extra)) h.set(k, v);
  addSecurityHeaders(h);
  return new Response(JSON.stringify(data), { status, headers: h });
}

// YYYY-MM-DD in UTC, offset by `days` (0 = today, -1 = yesterday). Used for
// the daily learning streak.
function dateStrUTC(days = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// New daily-streak value given the stored streak, the user's last-active date,
// and today's/yesterday's dates. Same day = unchanged; consecutive day = +1;
// any other gap (or never active) = reset to 1.
function nextStreak(prevStreak, lastActive, today, yesterday) {
  if (lastActive === today) return prevStreak || 1;
  if (lastActive === yesterday) return (prevStreak || 0) + 1;
  return 1;
}

// Confirm a base64 image payload's actual bytes match the declared type, so we
// never store arbitrary content (HTML/SVG/etc.) smuggled under an image label.
// Returns true only when the leading magic bytes match `type` (png|jpeg|webp).
function base64ImageMatchesType(b64, type) {
  let bin;
  try { bin = atob(b64); } catch { return false; }
  const byte = i => bin.charCodeAt(i);
  if (type === 'png') {
    // 89 50 4E 47 0D 0A 1A 0A
    return bin.length > 8 &&
      byte(0) === 0x89 && byte(1) === 0x50 && byte(2) === 0x4e && byte(3) === 0x47 &&
      byte(4) === 0x0d && byte(5) === 0x0a && byte(6) === 0x1a && byte(7) === 0x0a;
  }
  if (type === 'jpeg') {
    // FF D8 FF
    return bin.length > 3 && byte(0) === 0xff && byte(1) === 0xd8 && byte(2) === 0xff;
  }
  if (type === 'webp') {
    // "RIFF" .... "WEBP"
    return bin.length > 12 &&
      bin.slice(0, 4) === 'RIFF' && bin.slice(8, 12) === 'WEBP';
  }
  return false;
}

function parseCookies(header) {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k.trim(), v.join('=').trim()];
    })
  );
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256
  );
  const hex = arr => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${hex(salt)}:${hex(new Uint8Array(bits))}`;
}

async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  const salt = Uint8Array.from(saltHex.match(/.{2}/g), b => parseInt(b, 16));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256
  );
  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return timingSafeEqual(computed, hashHex);
}

// Single-use email-verification tokens are stored hashed (never raw) so a
// database leak alone can't be used to confirm arbitrary pending emails —
// same rationale as hashing passwords.
function randomTokenHex(byteLen = 32) {
  return Array.from(crypto.getRandomValues(new Uint8Array(byteLen)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sends via Resend's HTTP API (https://resend.com) rather than Cloudflare's
// own Email Sending product — that requires a paid plan; Resend's free tier
// (3,000/mo) covers this app's verification-email volume with a plain
// fetch() call, no SDK/binding needed. Throws on failure; caller decides how
// to surface that to the requester.
async function sendResendEmail(env, { to, subject, html, text }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'CyberUnit @ UNG <noreply@ungcyberunit.org>',
      to,
      subject,
      html,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }
}

async function signJWT(payload, secret) {
  const b64u = obj => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const header = b64u({ alg: 'HS256', typ: 'JWT' });
  const body   = b64u(payload);
  const data   = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${data}.${sigB64}`;
}

async function verifyJWT(token, secret) {
  try {
    const [h, p, s] = token.split('.');
    if (!h || !p || !s) return null;
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const sig = Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(`${h}.${p}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(p.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch { return null; }
}

async function getSession(request, secret) {
  const cookies = parseCookies(request.headers.get('Cookie'));
  return cookies.session ? verifyJWT(cookies.session, secret) : null;
}

function sessionCookie(token, maxAge, secure = true) {
  return `session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

// Guest sessions are short-lived (capped well below members' 7d) since guest
// accounts are throwaway, permissionless, and created with no rate limit
// beyond the shared signup limiter — bounding their lifetime bounds the
// window any one of them can pollute the leaderboard/DB.
const GUEST_SESSION_SECONDS = 2 * 3600;

// Role lives in the JWT, not re-checked against the DB on every request. If a
// DB role change (e.g. a student email just got verified) has moved past what
// this session's cookie was issued with, transparently reissue the cookie —
// called from the two endpoints every page already polls on load
// (/api/auth/me, /api/profile) so sessions self-heal without a re-login.
async function refreshRoleIfStale(env, session, dbRole, secure = true) {
  if (!dbRole || dbRole === session.role) return { role: session.role ?? 'member', cookie: null };
  // Never self-heal a guest token into a longer-lived non-guest cookie. A
  // guest JWT is only ever meant to live for its original short window
  // (GUEST_SESSION_SECONDS) — if this account was since upgraded via
  // /api/auth/upgrade, the browser that did the upgrade already got a fresh
  // member cookie directly from that response. This path is only reachable
  // by a *stale* copy of the old guest token (e.g. one captured before the
  // upgrade), so minting it a fresh 7-day cookie here would let a stolen
  // throwaway guest session outlive its cap by riding the account's later
  // upgrade. Keep it pinned at guest until it naturally expires.
  if (session.role === 'guest') return { role: 'guest', cookie: null };
  const token = await signJWT(
    { sub: session.sub, username: session.username, role: dbRole, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 },
    env.JWT_SECRET
  );
  return { role: dbRole, cookie: sessionCookie(token, 7 * 24 * 3600, secure) };
}

// ─── Role Helpers ─────────────────────────────────────────────────────────────

const ROLE_RANK = { guest: -1, member: 0, student: 1, instructor: 2, admin: 3 };

async function requireRole(request, env, minRole) {
  const session = await getSession(request, env.JWT_SECRET);
  if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);
  if ((ROLE_RANK[session.role] ?? 0) < (ROLE_RANK[minRole] ?? 0)) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }
  return session;
}

// ─── Quiz Room Helpers ────────────────────────────────────────────────────────

const MAX_QUESTION_LEN = 1000;
const MAX_ANSWER_LEN = 300;
const MAX_EXPLANATION_LEN = 2000;

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const r = i => chars[bytes[i] % chars.length];
  return `${r(0)}${r(1)}${r(2)}${r(3)}-${r(4)}${r(5)}${r(6)}${r(7)}`;
}

// ─── Room Lookup Rate Limiting ────────────────────────────────────────────────
// Throttle brute-force guessing of room codes. We count only *failed* lookups
// (unknown/closed/expired codes) per client IP in a sliding window, so ordinary
// use — joining rooms you have a valid code for — is never throttled.
const ROOM_RL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const ROOM_RL_MAX_FAILURES = 20;          // failed code lookups per IP per window

function clientIP(request) {
  return request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')?.split(',')[0].trim()
    || 'unknown';
}

// Returns a 429 Response when this IP is over the limit, otherwise null.
async function checkRoomLookupLimit(env, request) {
  if (!env.DB) return null;
  const cutoff = Date.now() - ROOM_RL_WINDOW_MS;
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM room_lookup_failures WHERE ip = ? AND ts > ?'
  ).bind(clientIP(request), cutoff).first();
  if ((row?.n ?? 0) >= ROOM_RL_MAX_FAILURES) {
    return jsonResponse({ error: 'Too many room attempts. Please wait a few minutes and try again.' }, 429);
  }
  return null;
}

async function recordRoomLookupFailure(env, request) {
  if (!env.DB) return;
  const now = Date.now();
  await env.DB.prepare('INSERT INTO room_lookup_failures (ip, ts) VALUES (?, ?)')
    .bind(clientIP(request), now).run();
  // Opportunistically prune expired rows so the table stays small.
  await env.DB.prepare('DELETE FROM room_lookup_failures WHERE ts < ?').bind(now - ROOM_RL_WINDOW_MS).run();
}

const FEEDBACK_RL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const FEEDBACK_RL_MAX = 5;                    // submissions per IP per window

// Returns a 429 Response when this IP is over the limit, otherwise null.
async function checkFeedbackLimit(env, request) {
  if (!env.DB) return null;
  const cutoff = Date.now() - FEEDBACK_RL_WINDOW_MS;
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM feedback_rate_limit WHERE ip = ? AND ts > ?'
  ).bind(clientIP(request), cutoff).first();
  if ((row?.n ?? 0) >= FEEDBACK_RL_MAX) {
    return jsonResponse({ error: 'Too many messages submitted recently. Please wait a while and try again.' }, 429);
  }
  return null;
}

async function recordFeedbackSubmission(env, request) {
  if (!env.DB) return;
  const now = Date.now();
  await env.DB.prepare('INSERT INTO feedback_rate_limit (ip, ts) VALUES (?, ?)')
    .bind(clientIP(request), now).run();
  // Opportunistically prune expired rows so the table stays small.
  await env.DB.prepare('DELETE FROM feedback_rate_limit WHERE ts < ?').bind(now - FEEDBACK_RL_WINDOW_MS).run();
}

const SIGNUP_RL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const SIGNUP_RL_MAX = 10;                   // account creations (register + guest) per IP per window

// Returns a 429 Response when this IP is over the limit, otherwise null.
async function checkSignupLimit(env, request) {
  if (!env.DB) return null;
  const cutoff = Date.now() - SIGNUP_RL_WINDOW_MS;
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM signup_rate_limit WHERE ip = ? AND ts > ?'
  ).bind(clientIP(request), cutoff).first();
  if ((row?.n ?? 0) >= SIGNUP_RL_MAX) {
    return jsonResponse({ error: 'Too many accounts created recently. Please wait a while and try again.' }, 429);
  }
  return null;
}

async function recordSignup(env, request) {
  if (!env.DB) return;
  const now = Date.now();
  await env.DB.prepare('INSERT INTO signup_rate_limit (ip, ts) VALUES (?, ?)')
    .bind(clientIP(request), now).run();
  // Opportunistically prune expired rows so the table stays small.
  await env.DB.prepare('DELETE FROM signup_rate_limit WHERE ts < ?').bind(now - SIGNUP_RL_WINDOW_MS).run();
}

const EMAIL_ACTION_RL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const EMAIL_ACTION_RL_MAX = 5;                    // forgot-password/-username requests per IP per window

// Shared IP limiter for the unauthenticated recovery endpoints (forgot
// password/username) — these have no account to rate-limit against until
// after a lookup, unlike verify-email/request which is behind a login.
async function checkEmailActionLimit(env, request) {
  if (!env.DB) return null;
  const cutoff = Date.now() - EMAIL_ACTION_RL_WINDOW_MS;
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM email_action_rate_limit WHERE ip = ? AND ts > ?'
  ).bind(clientIP(request), cutoff).first();
  if ((row?.n ?? 0) >= EMAIL_ACTION_RL_MAX) {
    return jsonResponse({ error: 'Too many requests. Please wait a while and try again.' }, 429);
  }
  return null;
}

async function recordEmailAction(env, request) {
  if (!env.DB) return;
  const now = Date.now();
  await env.DB.prepare('INSERT INTO email_action_rate_limit (ip, ts) VALUES (?, ?)')
    .bind(clientIP(request), now).run();
  await env.DB.prepare('DELETE FROM email_action_rate_limit WHERE ts < ?').bind(now - EMAIL_ACTION_RL_WINDOW_MS).run();
}

// Uniform response for any code that can't be joined (unknown, closed, or
// expired) so responses can't be used to probe which private rooms exist.
function roomUnavailable() {
  return jsonResponse({ error: 'Room not found or unavailable.' }, 404);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      result.push(current.trim()); current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { error: 'CSV must have a header row and at least one question' };
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  if (!headers.includes('question')) return { error: 'Missing required CSV column: question' };
  const get = (row, col) => { const i = headers.indexOf(col); return i >= 0 ? (row[i] ?? '') : ''; };
  const questions = [];
  for (let r = 1; r < lines.length; r++) {
    if (!lines[r].trim()) continue;
    const row = parseCSVLine(lines[r]);
    const question = get(row, 'question');
    if (!question) continue;
    if (question.length > MAX_QUESTION_LEN) return { error: `Row ${r}: question must be ${MAX_QUESTION_LEN} characters or fewer` };
    const type = get(row, 'type').toLowerCase().trim() === 'free_response' ? 'free_response' : 'multiple_choice';
    const explanation = get(row, 'explanation');
    if (explanation.length > MAX_EXPLANATION_LEN) return { error: `Row ${r}: explanation must be ${MAX_EXPLANATION_LEN} characters or fewer` };

    if (type === 'free_response') {
      questions.push({ question, type, answers: [], correct: null, explanation });
      continue;
    }

    const answers = ['answer_a', 'answer_b', 'answer_c', 'answer_d']
      .map(col => get(row, col)).filter(a => a !== '');
    if (answers.length < 2) return { error: `Row ${r}: need at least 2 non-empty answers` };
    if (answers.some(a => a.length > MAX_ANSWER_LEN)) return { error: `Row ${r}: each answer must be ${MAX_ANSWER_LEN} characters or fewer` };
    const correct = parseInt(get(row, 'correct'), 10);
    if (isNaN(correct) || correct < 0 || correct >= answers.length) {
      return { error: `Row ${r}: "correct" must be 0–${answers.length - 1}` };
    }
    questions.push({ question, type, answers, correct, explanation });
  }
  if (questions.length === 0) return { error: 'No valid questions found in CSV' };
  if (questions.length > 100) return { error: 'Maximum 100 questions per room' };
  return { questions };
}

function validateJSONQuestions(raw) {
  if (!Array.isArray(raw)) return { error: 'JSON must be an array of question objects' };
  if (raw.length === 0) return { error: 'At least one question is required' };
  if (raw.length > 100) return { error: 'Maximum 100 questions per room' };
  const questions = [];
  for (let i = 0; i < raw.length; i++) {
    const q = raw[i];
    if (typeof q.question !== 'string' || !q.question.trim()) {
      return { error: `Question ${i + 1}: question text is required` };
    }
    if (q.question.trim().length > MAX_QUESTION_LEN) {
      return { error: `Question ${i + 1}: question must be ${MAX_QUESTION_LEN} characters or fewer` };
    }
    const type = q.type === 'free_response' ? 'free_response' : 'multiple_choice';
    const explanation = typeof q.explanation === 'string' ? q.explanation : '';
    if (explanation.length > MAX_EXPLANATION_LEN) {
      return { error: `Question ${i + 1}: explanation must be ${MAX_EXPLANATION_LEN} characters or fewer` };
    }

    if (type === 'free_response') {
      questions.push({ question: q.question.trim(), type, answers: [], correct: null, explanation });
      continue;
    }

    if (!Array.isArray(q.answers) || q.answers.length < 2 || q.answers.length > 4) {
      return { error: `Question ${i + 1}: must have 2–4 answers` };
    }
    const answers = q.answers.map(a => String(a).trim());
    if (answers.some(a => !a)) return { error: `Question ${i + 1}: answer text cannot be empty` };
    if (answers.some(a => a.length > MAX_ANSWER_LEN)) {
      return { error: `Question ${i + 1}: each answer must be ${MAX_ANSWER_LEN} characters or fewer` };
    }
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= answers.length) {
      return { error: `Question ${i + 1}: correct must be 0–${answers.length - 1}` };
    }
    questions.push({ question: q.question.trim(), type, answers, correct: q.correct, explanation });
  }
  return { questions };
}

// ─── Test Exports ─────────────────────────────────────────────────────────────
// Named exports for unit testing. The Workers runtime uses only `export default`
// below and ignores these; they let test/worker.test.mjs import pure helpers.
export {
  base64ImageMatchesType,
  parseCookies,
  timingSafeEqual,
  hashPassword,
  verifyPassword,
  signJWT,
  verifyJWT,
  generateRoomCode,
  parseCSVLine,
  parseCSV,
  validateJSONQuestions,
  escapeHtml,
  renderContent,
  getTopicSVG,
  addSecurityHeaders,
  clientIP,
  jsonResponse,
  dateStrUTC,
  nextStreak,
  topics,
  pathwayStages,
  pathwayStageTopics,
  pathwayBadges,
  topicFraming,
  topicCard,
  pathwayHtml,
  topicMetaTags,
};

// ─── Worker Entry Point ───────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    // Cookies get the Secure flag whenever the request itself arrived over
    // HTTPS (always true in prod; `wrangler dev` defaults to plain HTTP, so
    // this keeps local login working without a Secure cookie the browser
    // would silently refuse to store).
    const secureCookie = url.protocol === 'https:';

    // ── Auth & Progress API ──────────────────────────────────────────────────
    if (path.startsWith('/api/auth/') || path.startsWith('/api/progress')) {
      if (!env.JWT_SECRET) return jsonResponse({ error: 'Server not configured' }, 503);

      // POST /api/auth/register
      if (path === '/api/auth/register' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Database not configured' }, 503);
        const limited = await checkSignupLimit(env, request);
        if (limited) return limited;
        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const { username, password } = body ?? {};
        if (!username || !password) return jsonResponse({ error: 'Username and password required' }, 400);
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return jsonResponse({ error: 'Username must be 3–20 alphanumeric characters or underscores' }, 400);
        if (typeof password !== 'string' || password.length < 8) return jsonResponse({ error: 'Password must be at least 8 characters' }, 400);
        if (password.length > 128) return jsonResponse({ error: 'Password too long' }, 400);

        const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
        if (existing) return jsonResponse({ error: 'Username already taken' }, 409);

        const hash = await hashPassword(password);
        const result = await env.DB.prepare(
          'INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, \'member\', ?)'
        ).bind(username, hash, Date.now()).run();

        const token = await signJWT(
          { sub: result.meta.last_row_id, username, role: 'member', exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 },
          env.JWT_SECRET
        );
        await recordSignup(env, request);
        return jsonResponse({ id: result.meta.last_row_id, username, role: 'member' }, 201, { 'Set-Cookie': sessionCookie(token, 7 * 24 * 3600, secureCookie) });
      }

      // POST /api/auth/login
      if (path === '/api/auth/login' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Database not configured' }, 503);
        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const { username, password } = body ?? {};
        if (!username || !password) return jsonResponse({ error: 'Username and password required' }, 400);

        const user = await env.DB.prepare(
          'SELECT id, username, password_hash, role FROM users WHERE username = ?'
        ).bind(username).first();
        const valid = user && await verifyPassword(String(password), user.password_hash);
        // Always return the same error to prevent username enumeration
        if (!valid) return jsonResponse({ error: 'Invalid username or password' }, 401);

        const role = user.role ?? 'member';
        const token = await signJWT(
          { sub: user.id, username: user.username, role, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 },
          env.JWT_SECRET
        );
        return jsonResponse({ id: user.id, username: user.username, role }, 200, { 'Set-Cookie': sessionCookie(token, 7 * 24 * 3600, secureCookie) });
      }

      // POST /api/auth/logout
      if (path === '/api/auth/logout' && request.method === 'POST') {
        return jsonResponse({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0, secureCookie) });
      }

      // POST /api/auth/guest — create a temporary, permissionless guest account.
      // Guests get their own throwaway user row (role 'guest', below member) so
      // profile/progress work normally, but they can never reach instructor/admin.
      if (path === '/api/auth/guest' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Database not configured' }, 503);
        const limited = await checkSignupLimit(env, request);
        if (limited) return limited;
        // Hyphenated name can't collide with real usernames (register allows [a-zA-Z0-9_] only).
        const suffix = Array.from(crypto.getRandomValues(new Uint8Array(6)))
          .map(b => b.toString(16).padStart(2, '0')).join('');
        const username = `guest-${suffix}`;
        // Random unguessable password hash — guests never log in by password.
        const hash = await hashPassword(username + crypto.randomUUID());
        const result = await env.DB.prepare(
          'INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, \'guest\', ?)'
        ).bind(username, hash, Date.now()).run();

        const token = await signJWT(
          { sub: result.meta.last_row_id, username, role: 'guest', exp: Math.floor(Date.now() / 1000) + GUEST_SESSION_SECONDS },
          env.JWT_SECRET
        );
        await recordSignup(env, request);
        return jsonResponse(
          { id: result.meta.last_row_id, username, role: 'guest' },
          201,
          { 'Set-Cookie': sessionCookie(token, GUEST_SESSION_SECONDS, secureCookie) },
        );
      }

      // POST /api/auth/upgrade — convert the caller's own guest account into a
      // real member account in place (same row, same id), so quiz_results and
      // streak carry over automatically with no separate data-migration step.
      if (path === '/api/auth/upgrade' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Database not configured' }, 503);
        const session = await getSession(request, env.JWT_SECRET);
        if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);
        if (session.role !== 'guest') return jsonResponse({ error: 'Only guest accounts can be upgraded' }, 403);

        const limited = await checkSignupLimit(env, request);
        if (limited) return limited;

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const { username, password } = body ?? {};
        if (!username || !password) return jsonResponse({ error: 'Username and password required' }, 400);
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) return jsonResponse({ error: 'Username must be 3–20 alphanumeric characters or underscores' }, 400);
        if (typeof password !== 'string' || password.length < 8) return jsonResponse({ error: 'Password must be at least 8 characters' }, 400);
        if (password.length > 128) return jsonResponse({ error: 'Password too long' }, 400);

        const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ? AND id != ?').bind(username, session.sub).first();
        if (existing) return jsonResponse({ error: 'Username already taken' }, 409);

        const hash = await hashPassword(password);
        const info = await env.DB.prepare(
          `UPDATE users SET username = ?, password_hash = ?, role = 'member' WHERE id = ? AND role = 'guest'`
        ).bind(username, hash, session.sub).run();
        if (info.meta.changes === 0) return jsonResponse({ error: 'Guest session no longer valid' }, 409);

        const token = await signJWT(
          { sub: session.sub, username, role: 'member', exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 },
          env.JWT_SECRET
        );
        await recordSignup(env, request);
        return jsonResponse({ id: session.sub, username, role: 'member' }, 200, { 'Set-Cookie': sessionCookie(token, 7 * 24 * 3600, secureCookie) });
      }

      // GET /api/auth/me
      if (path === '/api/auth/me' && request.method === 'GET') {
        const session = await getSession(request, env.JWT_SECRET);
        if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);
        let avatar = null;
        let hasUnreadAnnouncements = false;
        let role = session.role ?? 'member';
        let extraHeaders = {};
        if (env.DB) {
          const row = await env.DB.prepare('SELECT avatar, last_seen_announcements, role FROM users WHERE id = ?').bind(session.sub).first();
          avatar = row?.avatar ?? null;
          const refreshed = await refreshRoleIfStale(env, session, row?.role, secureCookie);
          role = refreshed.role;
          if (refreshed.cookie) extraHeaders = { 'Set-Cookie': refreshed.cookie };
          // Guests can't view /announcements at all, so never flag them as unread.
          if (role !== 'guest') {
            const latest = await env.DB.prepare('SELECT MAX(created_at) AS latest FROM announcements').first();
            hasUnreadAnnouncements = !!latest?.latest && (row?.last_seen_announcements ?? 0) < latest.latest;
          }
        }
        return jsonResponse({ id: session.sub, username: session.username, role, avatar, hasUnreadAnnouncements }, 200, extraHeaders);
      }

      // POST /api/auth/verify-email/request — any signed-in non-guest member
      // can confirm any email address on their account. Confirming does NOT
      // grant any role by itself — 'student' (and any future role) is
      // admin-assigned only (PATCH /api/admin/users/:id). This is purely an
      // identity/recovery marker, also used by forgot-password/-username below.
      if (path === '/api/auth/verify-email/request' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
        const session = await requireRole(request, env, 'member');
        if (session instanceof Response) return session;

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const email = (body?.email ?? '').toString().trim().toLowerCase();
        if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return jsonResponse({ error: 'Please enter a valid email address' }, 400);
        }

        const user = await env.DB.prepare(
          'SELECT email, email_verify_last_sent_at FROM users WHERE id = ?'
        ).bind(session.sub).first();
        if (user?.email) return jsonResponse({ error: 'This account already has a verified email' }, 409);

        const takenByOther = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?').bind(email, session.sub).first();
        if (takenByOther) return jsonResponse({ error: 'This email is already verified on another account' }, 409);

        const cooldownMs = 2 * 60 * 1000;
        if (user?.email_verify_last_sent_at && Date.now() - user.email_verify_last_sent_at < cooldownMs) {
          return jsonResponse({ error: 'Please wait a couple minutes before requesting another email' }, 429);
        }

        const token = randomTokenHex();
        const tokenHash = await sha256Hex(token);
        const now = Date.now();
        await env.DB.prepare(`
          UPDATE users
          SET email_pending = ?, email_verify_token_hash = ?, email_verify_expires_at = ?, email_verify_last_sent_at = ?
          WHERE id = ?
        `).bind(email, tokenHash, now + 60 * 60 * 1000, now, session.sub).run();

        if (env.RESEND_API_KEY) {
          const confirmUrl = `${url.origin}/api/auth/verify-email/confirm?token=${token}`;
          try {
            await sendResendEmail(env, {
              to: email,
              subject: 'Confirm your email — CyberUnit @ UNG',
              text: `Confirm this email address by opening this link (expires in 1 hour):\n\n${confirmUrl}\n\nIf you didn't request this, you can ignore this email.`,
              html: `<p>Confirm this email address by clicking the link below (expires in 1 hour):</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
            });
          } catch (err) {
            console.error('verify-email send failed', err.message);
            return jsonResponse({ error: 'Failed to send verification email, please try again shortly' }, 502);
          }
        }

        return jsonResponse({ ok: true });
      }

      // GET /api/auth/verify-email/confirm — clicked directly from the emailed
      // link, so it can't require the requesting browser's own session; the
      // high-entropy token itself is the credential. Renders a confirm page
      // only — does NOT mutate (see the authActionPageResponse comment for
      // why). The actual confirmation happens on the POST below.
      if (path === '/api/auth/verify-email/confirm' && request.method === 'GET') {
        if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
        const token = url.searchParams.get('token') ?? '';
        const tokenHash = token ? await sha256Hex(token) : '';
        const match = tokenHash && await env.DB.prepare(
          'SELECT id, email_pending FROM users WHERE email_verify_token_hash = ? AND email_verify_expires_at > ?'
        ).bind(tokenHash, Date.now()).first();

        if (!match) return Response.redirect(`${url.origin}/profile?verify_error=1`, 302);

        return authActionPageResponse({
          title: 'Confirm Email',
          heading: '// Confirm Your Email',
          message: `Click below to confirm <strong>${escapeHtml(match.email_pending)}</strong> for your account.`,
          formHtml: `<form method="POST" action="/api/auth/verify-email/confirm">
            <input type="hidden" name="token" value="${escapeHtml(token)}">
            <button type="submit" class="btn btn-primary">Confirm Email</button>
          </form>`,
        });
      }

      // POST /api/auth/verify-email/confirm — the actual mutation, only
      // reachable by submitting the form from the GET page above (a real
      // user click), never by an automated link-prefetcher (GET-only).
      if (path === '/api/auth/verify-email/confirm' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
        let form;
        try { form = await request.formData(); } catch { return Response.redirect(`${url.origin}/profile?verify_error=1`, 302); }
        const token = (form.get('token') ?? '').toString();
        const tokenHash = token ? await sha256Hex(token) : '';
        const match = tokenHash && await env.DB.prepare(
          'SELECT id FROM users WHERE email_verify_token_hash = ? AND email_verify_expires_at > ?'
        ).bind(tokenHash, Date.now()).first();

        if (!match) return Response.redirect(`${url.origin}/profile?verify_error=1`, 302);

        await env.DB.prepare(`
          UPDATE users
          SET email = email_pending, email_pending = NULL, email_verify_token_hash = NULL, email_verify_expires_at = NULL
          WHERE id = ?
        `).bind(match.id).run();

        return Response.redirect(`${url.origin}/profile?verified=1`, 302);
      }

      // POST /api/auth/forgot-password — unauthenticated (that's the whole
      // point). Always responds { ok: true } regardless of whether the email
      // matched an account, same anti-enumeration principle as login's
      // generic "Invalid username or password". Only works for accounts with
      // a confirmed email on file — there's no other way to prove identity.
      if (path === '/api/auth/forgot-password' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
        const limited = await checkEmailActionLimit(env, request);
        if (limited) return limited;
        await recordEmailAction(env, request);

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const email = (body?.email ?? '').toString().trim().toLowerCase();
        if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return jsonResponse({ error: 'Please enter a valid email address' }, 400);
        }

        const user = await env.DB.prepare(
          'SELECT id, password_reset_last_sent_at FROM users WHERE email = ?'
        ).bind(email).first();
        const cooldownMs = 2 * 60 * 1000;
        const inCooldown = user?.password_reset_last_sent_at && Date.now() - user.password_reset_last_sent_at < cooldownMs;

        if (user && !inCooldown) {
          const token = randomTokenHex();
          const tokenHash = await sha256Hex(token);
          const now = Date.now();
          await env.DB.prepare(`
            UPDATE users
            SET password_reset_token_hash = ?, password_reset_expires_at = ?, password_reset_last_sent_at = ?
            WHERE id = ?
          `).bind(tokenHash, now + 60 * 60 * 1000, now, user.id).run();

          if (env.RESEND_API_KEY) {
            const resetUrl = `${url.origin}/api/auth/reset-password?token=${token}`;
            try {
              await sendResendEmail(env, {
                to: email,
                subject: 'Reset your password — CyberUnit @ UNG',
                text: `Reset your password by opening this link (expires in 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
                html: `<p>Reset your password by clicking the link below (expires in 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
              });
            } catch (err) {
              console.error('forgot-password send failed', err.message);
              // Still return ok:true below — a distinguishable error here
              // would leak whether the account exists.
            }
          }
        }

        return jsonResponse({ ok: true });
      }

      function resetPasswordFormHtml(token) {
        return `<form method="POST" action="/api/auth/reset-password">
          <input type="hidden" name="token" value="${escapeHtml(token)}">
          <div class="form-group">
            <label for="password">New password</label>
            <input type="password" id="password" name="password" minlength="8" maxlength="128" required autocomplete="new-password">
          </div>
          <div class="form-group">
            <label for="passwordConfirm">Confirm password</label>
            <input type="password" id="passwordConfirm" name="passwordConfirm" minlength="8" maxlength="128" required autocomplete="new-password">
          </div>
          <button type="submit" class="btn btn-primary">Reset Password</button>
        </form>`;
      }

      const resetLinkInvalidPage = () => authActionPageResponse({
        title: 'Reset Link Invalid',
        heading: '// Link Expired or Invalid',
        message: 'This password reset link is invalid or has expired. Request a new one from the Sign In screen.',
        formHtml: `<a href="/" class="btn">← Return to Home</a>`,
      }, 400);

      // GET /api/auth/reset-password — same no-mutation-on-GET discipline as
      // verify-email/confirm, though setting a password requires a form
      // either way, so this route was never at risk of link-prefetch abuse.
      if (path === '/api/auth/reset-password' && request.method === 'GET') {
        if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
        const token = url.searchParams.get('token') ?? '';
        const tokenHash = token ? await sha256Hex(token) : '';
        const match = tokenHash && await env.DB.prepare(
          'SELECT id FROM users WHERE password_reset_token_hash = ? AND password_reset_expires_at > ?'
        ).bind(tokenHash, Date.now()).first();

        if (!match) return resetLinkInvalidPage();

        return authActionPageResponse({
          title: 'Reset Password',
          heading: '// Set a New Password',
          message: 'Choose a new password for your account.',
          formHtml: resetPasswordFormHtml(token),
        });
      }

      // POST /api/auth/reset-password — the actual mutation, then auto-login
      // (same signJWT/sessionCookie pattern as register/login) for good UX.
      if (path === '/api/auth/reset-password' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
        let form;
        try { form = await request.formData(); } catch { return resetLinkInvalidPage(); }
        const token = (form.get('token') ?? '').toString();
        const password = (form.get('password') ?? '').toString();
        const passwordConfirm = (form.get('passwordConfirm') ?? '').toString();

        const tokenHash = token ? await sha256Hex(token) : '';
        const match = tokenHash && await env.DB.prepare(
          'SELECT id, username, role FROM users WHERE password_reset_token_hash = ? AND password_reset_expires_at > ?'
        ).bind(tokenHash, Date.now()).first();
        if (!match) return resetLinkInvalidPage();

        if (password.length < 8 || password.length > 128) {
          return authActionPageResponse({
            title: 'Reset Password',
            heading: '// Set a New Password',
            message: 'Password must be at least 8 characters.',
            formHtml: resetPasswordFormHtml(token),
          }, 400);
        }
        if (password !== passwordConfirm) {
          return authActionPageResponse({
            title: 'Reset Password',
            heading: '// Set a New Password',
            message: 'Passwords did not match. Try again.',
            formHtml: resetPasswordFormHtml(token),
          }, 400);
        }

        const hash = await hashPassword(password);
        await env.DB.prepare(`
          UPDATE users SET password_hash = ?, password_reset_token_hash = NULL, password_reset_expires_at = NULL WHERE id = ?
        `).bind(hash, match.id).run();

        const sessionToken = await signJWT(
          { sub: match.id, username: match.username, role: match.role ?? 'member', exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 },
          env.JWT_SECRET
        );
        return new Response(null, {
          status: 302,
          headers: addSecurityHeaders(new Headers({
            'Location': `${url.origin}/profile?reset=1`,
            'Set-Cookie': sessionCookie(sessionToken, 7 * 24 * 3600, secureCookie),
          })),
        });
      }

      // POST /api/auth/forgot-username — unauthenticated, same anti-
      // enumeration principle as forgot-password. Usernames aren't secret,
      // so this just emails a reminder — no token/link needed.
      if (path === '/api/auth/forgot-username' && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
        const limited = await checkEmailActionLimit(env, request);
        if (limited) return limited;
        await recordEmailAction(env, request);

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const email = (body?.email ?? '').toString().trim().toLowerCase();
        if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return jsonResponse({ error: 'Please enter a valid email address' }, 400);
        }

        const user = await env.DB.prepare('SELECT username FROM users WHERE email = ?').bind(email).first();
        if (user && env.RESEND_API_KEY) {
          try {
            await sendResendEmail(env, {
              to: email,
              subject: 'Your username — CyberUnit @ UNG',
              text: `Your username is: ${user.username}\n\nIf you didn't request this, you can ignore this email.`,
              html: `<p>Your username is: <strong>${escapeHtml(user.username)}</strong></p><p>If you didn't request this, you can ignore this email.</p>`,
            });
          } catch (err) {
            console.error('forgot-username send failed', err.message);
          }
        }

        return jsonResponse({ ok: true });
      }

      // GET /api/progress  — returns [] if not authenticated (graceful for logged-out users)
      if (path === '/api/progress' && request.method === 'GET') {
        if (!env.DB) return jsonResponse({ results: [] });
        const session = await getSession(request, env.JWT_SECRET);
        if (!session) return jsonResponse({ results: [] });
        const { results } = await env.DB.prepare(
          'SELECT topic_id, score, total FROM quiz_results WHERE user_id = ?'
        ).bind(session.sub).all();
        // Current daily streak — only valid if the user was active today or
        // yesterday; otherwise the streak is broken and reads as 0.
        const u = await env.DB.prepare('SELECT streak, last_active FROM users WHERE id = ?').bind(session.sub).first();
        const streak = (u && (u.last_active === dateStrUTC(0) || u.last_active === dateStrUTC(-1))) ? (u.streak ?? 0) : 0;
        return jsonResponse({ results: results ?? [], streak });
      }

      // DELETE /api/progress/:topicId
      const progressMatch = path.match(/^\/api\/progress\/(\w+)$/);
      if (progressMatch && request.method === 'DELETE') {
        if (!env.DB) return jsonResponse({ error: 'Database not configured' }, 503);
        const session = await getSession(request, env.JWT_SECRET);
        if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);
        await env.DB.prepare(
          'DELETE FROM quiz_results WHERE user_id = ? AND topic_id = ?'
        ).bind(session.sub, progressMatch[1]).run();
        return jsonResponse({ ok: true });
      }

      // POST /api/progress/:topicId
      if (progressMatch && request.method === 'POST') {
        if (!env.DB) return jsonResponse({ error: 'Database not configured' }, 503);
        const session = await getSession(request, env.JWT_SECRET);
        if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);
        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const topicId = progressMatch[1];
        const topic = topics.find(t => t.id === topicId);
        if (!topic || !Array.isArray(topic.quiz) || topic.quiz.length === 0) {
          return jsonResponse({ error: 'Unknown topic' }, 404);
        }
        const { answers } = body ?? {};
        if (!Array.isArray(answers) || answers.length !== topic.quiz.length) {
          return jsonResponse({ error: 'Invalid answers data' }, 400);
        }
        const total = topic.quiz.length;
        const score = topic.quiz.reduce(
          (sum, q, i) => sum + (Number.isInteger(answers[i]) && answers[i] === q.correct ? 1 : 0),
          0
        );
        // Upsert: keep the best (highest) score the user has achieved
        await env.DB.prepare(`
          INSERT INTO quiz_results (user_id, topic_id, score, total, updated_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(user_id, topic_id) DO UPDATE SET
            score      = MAX(score, excluded.score),
            total      = excluded.total,
            updated_at = excluded.updated_at
        `).bind(session.sub, topicId, score, total, Date.now()).run();

        // Update the user's daily learning streak.
        const today = dateStrUTC(0);
        const u = await env.DB.prepare('SELECT streak, last_active FROM users WHERE id = ?').bind(session.sub).first();
        const streak = nextStreak(u?.streak, u?.last_active, today, dateStrUTC(-1));
        await env.DB.prepare('UPDATE users SET streak = ?, last_active = ? WHERE id = ?')
          .bind(streak, today, session.sub).run();

        return jsonResponse({ ok: true, streak });
      }
    }

    // ── Profile API ──────────────────────────────────────────────────────────
    // GET /api/profile — account details + quiz room attempt history
    if (path === '/api/profile' && request.method === 'GET') {
      if (!env.JWT_SECRET || !env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
      const session = await getSession(request, env.JWT_SECRET);
      if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);

      const user = await env.DB.prepare(
        'SELECT id, username, role, avatar, created_at, is_public, email, email_pending FROM users WHERE id = ?'
      ).bind(session.sub).first();
      if (!user) return jsonResponse({ error: 'Not authenticated' }, 401);

      const { role, cookie } = await refreshRoleIfStale(env, session, user.role, secureCookie);
      const profileExtraHeaders = cookie ? { 'Set-Cookie': cookie } : {};

      const { results: roomAttempts } = await env.DB.prepare(`
        SELECT r.title, r.code, a.score, a.total, a.completed_at,
               (SELECT COUNT(*) FROM quiz_room_answers ans
                 WHERE ans.attempt_id = a.id AND ans.is_correct IS NULL) AS pending
        FROM quiz_room_attempts a
        JOIN quiz_rooms r ON r.id = a.room_id
        WHERE a.user_id = ?
        ORDER BY a.completed_at DESC
      `).bind(session.sub).all();

      // Pathway badges: a stage's badge is earned once all its topics are done.
      const { results: prog } = await env.DB.prepare(
        'SELECT topic_id FROM quiz_results WHERE user_id = ?'
      ).bind(session.sub).all();
      const doneTopics = new Set((prog ?? []).map(r => String(r.topic_id)));

      // Leaderboard ranks (module completion + quiz rooms). Guests are unranked.
      const isGuest = role === 'guest';
      const rank = isGuest ? null : await leaderboardRank(env, 'quiz_results', session.sub, user.username);
      const roomRank = isGuest ? null : await leaderboardRank(env, 'quiz_room_attempts', session.sub, user.username);

      return jsonResponse({
        id: user.id,
        username: user.username,
        role,
        avatar: user.avatar ?? null,
        created_at: user.created_at,
        isPublic: !!user.is_public,
        email: user.email ?? null,
        emailPending: user.email_pending ?? null,
        roomAttempts: roomAttempts ?? [],
        badges: pathwayBadges(doneTopics),
        rank,
        roomRank,
      }, 200, profileExtraHeaders);
    }

    // POST /api/profile/visibility — toggle whether other logged-in users can
    // view this profile at /u/:username. Mutates only the caller's own row.
    if (path === '/api/profile/visibility' && request.method === 'POST') {
      if (!env.JWT_SECRET || !env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
      const session = await getSession(request, env.JWT_SECRET);
      if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);
      if (session.role === 'guest') return jsonResponse({ error: 'Guests cannot have a public profile' }, 403);

      let body;
      try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
      const { isPublic } = body ?? {};
      if (typeof isPublic !== 'boolean') return jsonResponse({ error: 'isPublic (boolean) required' }, 400);

      await env.DB.prepare('UPDATE users SET is_public = ? WHERE id = ?')
        .bind(isPublic ? 1 : 0, session.sub).run();
      return jsonResponse({ isPublic });
    }

    // GET /api/user/:username — the public subset of a profile, for other
    // logged-in users viewing /u/:username. Whitelisted fields only, and only
    // when the target has opted in via is_public — except for admins, who can
    // open any profile from the admin panel regardless of that toggle. Never
    // exposes quiz-room history, per-topic quiz progress, or the verified
    // email address itself — only the resulting isStudent badge — even to admins.
    const publicUserMatch = path.match(/^\/api\/user\/([a-zA-Z0-9_]{3,20})$/);
    if (publicUserMatch && request.method === 'GET') {
      if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
      const target = await env.DB.prepare(
        'SELECT id, username, role, avatar, created_at, is_public FROM users WHERE username = ?'
      ).bind(publicUserMatch[1]).first();
      if (!target || target.role === 'guest') return jsonResponse({ error: 'User not found' }, 404);
      const viewer = env.JWT_SECRET ? await getSession(request, env.JWT_SECRET) : null;
      if (!target.is_public && viewer?.role !== 'admin') return jsonResponse({ error: 'This profile is private' }, 403);

      const { results: prog } = await env.DB.prepare(
        'SELECT topic_id FROM quiz_results WHERE user_id = ?'
      ).bind(target.id).all();
      const doneTopics = new Set((prog ?? []).map(r => String(r.topic_id)));

      return jsonResponse({
        username: target.username,
        avatar: target.avatar ?? null,
        created_at: target.created_at,
        badges: pathwayBadges(doneTopics),
        rank: await leaderboardRank(env, 'quiz_results', target.id, target.username),
        roomRank: await leaderboardRank(env, 'quiz_room_attempts', target.id, target.username),
        isStudent: (ROLE_RANK[target.role] ?? 0) >= ROLE_RANK.student,
      });
    }

    // GET /api/leaderboard?mode=modules|rooms — top performers. "modules" ranks
    // by topic-quiz points, "rooms" by quiz-room points. Guests are excluded.
    if (path === '/api/leaderboard' && request.method === 'GET') {
      if (!env.JWT_SECRET || !env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
      const session = await getSession(request, env.JWT_SECRET);
      if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);

      const mode = url.searchParams.get('mode') === 'rooms' ? 'rooms' : 'modules';
      const src = mode === 'rooms'
        ? { table: 'quiz_room_attempts', join: 'a.user_id', score: 'a.score', total: 'a.total', unit: 'a.id' }
        : { table: 'quiz_results', join: 'q.user_id', score: 'q.score', total: 'q.total', unit: 'q.topic_id' };
      const t = mode === 'rooms' ? 'a' : 'q';

      const { results: top } = await env.DB.prepare(`
        SELECT u.username,
               u.avatar,
               SUM(${src.score}) AS points,
               COUNT(${src.unit}) AS count,
               SUM(CASE WHEN ${src.score} = ${src.total} THEN 1 ELSE 0 END) AS perfect
        FROM users u
        JOIN ${src.table} ${t} ON ${src.join} = u.id
        WHERE u.role != 'guest'
        GROUP BY u.id
        ORDER BY points DESC, count DESC, u.username ASC
        LIMIT 10
      `).all();

      const meRow = await env.DB.prepare(
        `SELECT SUM(score) AS points, COUNT(*) AS count FROM ${src.table} WHERE user_id = ?`
      ).bind(session.sub).first();

      return jsonResponse({
        mode,
        top: (top ?? []).map((r, i) => ({
          rank: i + 1, username: r.username, avatar: r.avatar ?? null, points: r.points ?? 0, count: r.count ?? 0, perfect: r.perfect ?? 0,
        })),
        me: {
          username: session.username,
          points: meRow?.points ?? 0,
          count: meRow?.count ?? 0,
          isGuest: (session.role ?? 'member') === 'guest',
        },
      });
    }

    // POST /api/profile/avatar — set profile picture (small data-URL image)
    // DELETE /api/profile/avatar — reset to default
    if (path === '/api/profile/avatar' && (request.method === 'POST' || request.method === 'DELETE')) {
      if (!env.JWT_SECRET || !env.DB) return jsonResponse({ error: 'Server not configured' }, 503);
      const session = await getSession(request, env.JWT_SECRET);
      if (!session) return jsonResponse({ error: 'Not authenticated' }, 401);

      if (request.method === 'DELETE') {
        await env.DB.prepare('UPDATE users SET avatar = NULL WHERE id = ?').bind(session.sub).run();
        return jsonResponse({ ok: true, avatar: null });
      }

      let body;
      try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
      const { avatar } = body ?? {};
      if (typeof avatar !== 'string') return jsonResponse({ error: 'Avatar image required' }, 400);
      if (avatar.length > 150_000) return jsonResponse({ error: 'Image too large' }, 400);
      const avatarMatch = avatar.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
      if (!avatarMatch) {
        return jsonResponse({ error: 'Invalid image format' }, 400);
      }
      // Verify the decoded bytes really are the declared image type — reject any
      // non-image content smuggled under an image MIME label.
      if (!base64ImageMatchesType(avatarMatch[2], avatarMatch[1])) {
        return jsonResponse({ error: 'File is not a valid image' }, 400);
      }

      await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(avatar, session.sub).run();
      return jsonResponse({ ok: true, avatar });
    }

    // ── Admin API ────────────────────────────────────────────────────────────
    if (path.startsWith('/api/admin/')) {
      if (!env.JWT_SECRET || !env.DB) return jsonResponse({ error: 'Server not configured' }, 503);

      const session = await requireRole(request, env, 'admin');
      if (session instanceof Response) return session;

      // GET /api/admin/users
      if (path === '/api/admin/users' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC'
        ).all();
        return jsonResponse({ results: results ?? [] });
      }

      // PATCH /api/admin/users/:id — change role
      const adminUserMatch = path.match(/^\/api\/admin\/users\/(\d+)$/);
      if (adminUserMatch && request.method === 'PATCH') {
        const targetId = parseInt(adminUserMatch[1], 10);
        if (targetId === session.sub) return jsonResponse({ error: 'Cannot modify your own account' }, 403);
        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const { role } = body ?? {};
        if (!['member', 'student', 'instructor', 'admin'].includes(role)) return jsonResponse({ error: 'Invalid role' }, 400);
        const info = await env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(role, targetId).run();
        if (info.meta.changes === 0) return jsonResponse({ error: 'User not found' }, 404);
        return jsonResponse({ ok: true });
      }

      // DELETE /api/admin/users/:id
      if (adminUserMatch && request.method === 'DELETE') {
        const targetId = parseInt(adminUserMatch[1], 10);
        if (targetId === session.sub) return jsonResponse({ error: 'Cannot delete your own account' }, 403);
        // Cascade room attempt answers before deleting attempts
        const { results: userAttempts } = await env.DB.prepare(
          'SELECT id FROM quiz_room_attempts WHERE user_id = ?'
        ).bind(targetId).all();
        const stmts = (userAttempts ?? []).map(a =>
          env.DB.prepare('DELETE FROM quiz_room_answers WHERE attempt_id = ?').bind(a.id)
        );
        stmts.push(env.DB.prepare('DELETE FROM quiz_room_attempts WHERE user_id = ?').bind(targetId));
        stmts.push(env.DB.prepare('DELETE FROM quiz_results WHERE user_id = ?').bind(targetId));
        stmts.push(env.DB.prepare('DELETE FROM users WHERE id = ?').bind(targetId));
        await env.DB.batch(stmts);
        return jsonResponse({ ok: true });
      }
    }

    // ── Announcements API ────────────────────────────────────────────────────
    // Read: any signed-in non-guest member. Write: admins only — announcements
    // are shared unit-wide content, not personal, so any admin may edit/delete
    // any post (no per-creator ownership check, unlike Quiz Rooms).
    if (path.startsWith('/api/announcements')) {
      if (!env.JWT_SECRET || !env.DB) return jsonResponse({ error: 'Server not configured' }, 503);

      const session = await requireRole(request, env, 'member');
      if (session instanceof Response) return session;

      // GET /api/announcements — newest first; client handles sort/search.
      if (path === '/api/announcements' && request.method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT a.id, a.title, a.body, a.created_at, a.updated_at, u.username
          FROM announcements a
          JOIN users u ON u.id = a.created_by
          ORDER BY a.created_at DESC
        `).all();
        return jsonResponse({ results: results ?? [] });
      }

      // POST /api/announcements/seen — any signed-in non-guest member marks
      // themself caught up, clearing the unread badge (see /api/auth/me).
      if (path === '/api/announcements/seen' && request.method === 'POST') {
        await env.DB.prepare('UPDATE users SET last_seen_announcements = ? WHERE id = ?')
          .bind(Date.now(), session.sub).run();
        return jsonResponse({ ok: true });
      }

      // POST /api/announcements — admin creates a new announcement.
      if (path === '/api/announcements' && request.method === 'POST') {
        if (session.role !== 'admin') return jsonResponse({ error: 'Forbidden' }, 403);

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const title = (body?.title ?? '').toString().trim();
        const text = (body?.body ?? '').toString().trim();
        if (!title) return jsonResponse({ error: 'Title is required' }, 400);
        if (title.length > 200) return jsonResponse({ error: 'Title must be 200 characters or fewer' }, 400);
        if (!text) return jsonResponse({ error: 'Body is required' }, 400);
        if (text.length > 5000) return jsonResponse({ error: 'Body must be 5000 characters or fewer' }, 400);

        const now = Date.now();
        const info = await env.DB.prepare(
          'INSERT INTO announcements (title, body, created_by, created_at) VALUES (?, ?, ?, ?)'
        ).bind(title, text, session.sub, now).run();
        return jsonResponse({ id: info.meta.last_row_id, title, body: text, created_at: now, username: session.username }, 201);
      }

      const idMatch = path.match(/^\/api\/announcements\/(\d+)$/);

      // PATCH /api/announcements/:id — admin edits any announcement.
      if (idMatch && request.method === 'PATCH') {
        if (session.role !== 'admin') return jsonResponse({ error: 'Forbidden' }, 403);

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const title = (body?.title ?? '').toString().trim();
        const text = (body?.body ?? '').toString().trim();
        if (!title) return jsonResponse({ error: 'Title is required' }, 400);
        if (title.length > 200) return jsonResponse({ error: 'Title must be 200 characters or fewer' }, 400);
        if (!text) return jsonResponse({ error: 'Body is required' }, 400);
        if (text.length > 5000) return jsonResponse({ error: 'Body must be 5000 characters or fewer' }, 400);

        const info = await env.DB.prepare(
          'UPDATE announcements SET title = ?, body = ?, updated_at = ? WHERE id = ?'
        ).bind(title, text, Date.now(), idMatch[1]).run();
        if (info.meta.changes === 0) return jsonResponse({ error: 'Announcement not found' }, 404);
        return jsonResponse({ ok: true });
      }

      // DELETE /api/announcements/:id — admin deletes any announcement.
      if (idMatch && request.method === 'DELETE') {
        if (session.role !== 'admin') return jsonResponse({ error: 'Forbidden' }, 403);

        const info = await env.DB.prepare('DELETE FROM announcements WHERE id = ?').bind(idMatch[1]).run();
        if (info.meta.changes === 0) return jsonResponse({ error: 'Announcement not found' }, 404);
        return jsonResponse({ ok: true });
      }
    }

    // ── Feedback API ─────────────────────────────────────────────────────────
    // Open to anyone, signed in or not — this is the site's public suggestion
    // box, so submission has no requireRole gate, just IP rate-limiting.
    // Reading/deleting submissions is admin-only.
    if (path.startsWith('/api/feedback')) {
      if (!env.DB) return jsonResponse({ error: 'Server not configured' }, 503);

      // POST /api/feedback — anyone may submit; username attached only if
      // a valid session happens to be present (getSession, not requireRole,
      // so signed-out visitors aren't blocked).
      if (path === '/api/feedback' && request.method === 'POST') {
        const limited = await checkFeedbackLimit(env, request);
        if (limited) return limited;

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const message = (body?.message ?? '').toString().trim();
        if (!message) return jsonResponse({ error: 'Message is required' }, 400);
        if (message.length > 5000) return jsonResponse({ error: 'Message must be 5000 characters or fewer' }, 400);

        const session = env.JWT_SECRET ? await getSession(request, env.JWT_SECRET) : null;
        const username = session?.username ?? null;

        const now = Date.now();
        await env.DB.prepare(
          'INSERT INTO feedback (message, username, created_at) VALUES (?, ?, ?)'
        ).bind(message, username, now).run();
        await recordFeedbackSubmission(env, request);
        return jsonResponse({ ok: true }, 201);
      }

      const feedbackIdMatch = path.match(/^\/api\/feedback\/(\d+)$/);

      // GET /api/feedback — admin reviews all submissions, newest first.
      if (path === '/api/feedback' && request.method === 'GET') {
        const session = await requireRole(request, env, 'admin');
        if (session instanceof Response) return session;

        const { results } = await env.DB.prepare(
          'SELECT id, message, username, created_at FROM feedback ORDER BY created_at DESC'
        ).all();
        return jsonResponse({ results: results ?? [] });
      }

      // DELETE /api/feedback/:id — admin dismisses a submission.
      if (feedbackIdMatch && request.method === 'DELETE') {
        const session = await requireRole(request, env, 'admin');
        if (session instanceof Response) return session;

        const info = await env.DB.prepare('DELETE FROM feedback WHERE id = ?').bind(feedbackIdMatch[1]).run();
        if (info.meta.changes === 0) return jsonResponse({ error: 'Feedback not found' }, 404);
        return jsonResponse({ ok: true });
      }
    }

    // ── Quiz Rooms API ───────────────────────────────────────────────────────
    if (path.startsWith('/api/rooms')) {
      if (!env.JWT_SECRET || !env.DB) return jsonResponse({ error: 'Server not configured' }, 503);

      // POST /api/rooms — instructor creates a room
      if (path === '/api/rooms' && request.method === 'POST') {
        const session = await requireRole(request, env, 'instructor');
        if (session instanceof Response) return session;

        let formData;
        try { formData = await request.formData(); } catch { return jsonResponse({ error: 'Expected multipart/form-data' }, 400); }

        const title = (formData.get('title') ?? '').trim();
        if (!title) return jsonResponse({ error: 'Room title is required' }, 400);
        if (title.length > 200) return jsonResponse({ error: 'Room title must be 200 characters or fewer' }, 400);

        const visibility = (formData.get('visibility') ?? 'private').toString().toLowerCase();
        if (!['public', 'private', 'student'].includes(visibility)) {
          return jsonResponse({ error: 'visibility must be "public", "private", or "student"' }, 400);
        }

        const expiresRaw = formData.get('expires_at');
        let expiresAt = null;
        if (expiresRaw) {
          const d = new Date(expiresRaw);
          if (isNaN(d.getTime())) return jsonResponse({ error: 'Invalid expires_at date' }, 400);
          expiresAt = Math.floor(d.getTime() / 1000);
        }

        const file = formData.get('file');
        if (!file || typeof file.text !== 'function') return jsonResponse({ error: 'No file uploaded' }, 400);
        if (file.size > 1_000_000) return jsonResponse({ error: 'Question file must be under 1MB' }, 400);

        const text = await file.text();
        const filename = (file.name ?? '').toLowerCase();
        let parseResult;
        if (filename.endsWith('.json')) {
          try { parseResult = validateJSONQuestions(JSON.parse(text)); }
          catch { return jsonResponse({ error: 'Invalid JSON file' }, 400); }
        } else {
          parseResult = parseCSV(text);
        }
        if (!parseResult) return jsonResponse({ error: 'Could not parse file' }, 400);
        if (parseResult.error) return jsonResponse({ error: parseResult.error }, 400);

        const { questions } = parseResult;

        // Generate a unique room code (collision retry)
        let code;
        for (let attempt = 0; attempt < 10; attempt++) {
          const candidate = generateRoomCode();
          const existing = await env.DB.prepare('SELECT id FROM quiz_rooms WHERE code = ?').bind(candidate).first();
          if (!existing) { code = candidate; break; }
        }
        if (!code) return jsonResponse({ error: 'Failed to generate unique room code, try again' }, 500);

        const roomResult = await env.DB.prepare(
          'INSERT INTO quiz_rooms (code, title, created_by, expires_at, status, visibility, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(code, title, session.sub, expiresAt, 'open', visibility, Date.now()).run();

        const roomId = roomResult.meta.last_row_id;
        await env.DB.batch(questions.map((q, i) =>
          env.DB.prepare(
            'INSERT INTO quiz_room_questions (room_id, sort_order, type, question, answers, correct, explanation) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(roomId, i, q.type ?? 'multiple_choice', q.question, JSON.stringify(q.answers), q.correct ?? null, q.explanation)
        ));

        return jsonResponse({ code, title, questionCount: questions.length }, 201);
      }

      // GET /api/rooms — instructor lists their rooms
      if (path === '/api/rooms' && request.method === 'GET') {
        const session = await requireRole(request, env, 'instructor');
        if (session instanceof Response) return session;

        // Admins can pass ?all=1 to see all rooms
        const showAll = session.role === 'admin' && url.searchParams.get('all') === '1';
        const query = showAll
          ? `SELECT r.id, r.code, r.title, r.status, r.visibility, r.expires_at, r.created_at,
                    COUNT(DISTINCT q.id) AS question_count,
                    COUNT(DISTINCT a.id) AS attempt_count
             FROM quiz_rooms r
             LEFT JOIN quiz_room_questions q ON q.room_id = r.id
             LEFT JOIN quiz_room_attempts a ON a.room_id = r.id
             GROUP BY r.id ORDER BY r.created_at DESC`
          : `SELECT r.id, r.code, r.title, r.status, r.visibility, r.expires_at, r.created_at,
                    COUNT(DISTINCT q.id) AS question_count,
                    COUNT(DISTINCT a.id) AS attempt_count
             FROM quiz_rooms r
             LEFT JOIN quiz_room_questions q ON q.room_id = r.id
             LEFT JOIN quiz_room_attempts a ON a.room_id = r.id
             WHERE r.created_by = ?
             GROUP BY r.id ORDER BY r.created_at DESC`;

        const stmt = showAll
          ? env.DB.prepare(query)
          : env.DB.prepare(query).bind(session.sub);
        const { results } = await stmt.all();
        return jsonResponse({ results: results ?? [] });
      }

      // GET /api/rooms/public — any logged-in member browses open public rooms
      if (path === '/api/rooms/public' && request.method === 'GET') {
        const session = await requireRole(request, env, 'member');
        if (session instanceof Response) return session;

        const nowSecs = Math.floor(Date.now() / 1000);
        // Student-only rooms are only listed to verified students+ — plain
        // members never see them here (they'd also be rejected on join/attempt).
        const visibilities = (ROLE_RANK[session.role] ?? 0) >= ROLE_RANK.student
          ? ['public', 'student']
          : ['public'];
        const { results } = await env.DB.prepare(`
          SELECT r.code, r.title, r.created_at, r.visibility, u.username AS instructor_name,
                 COUNT(DISTINCT q.id) AS question_count,
                 att.id IS NOT NULL AS attempted
          FROM quiz_rooms r
          JOIN users u ON u.id = r.created_by
          LEFT JOIN quiz_room_questions q ON q.room_id = r.id
          LEFT JOIN quiz_room_attempts att ON att.room_id = r.id AND att.user_id = ?
          WHERE r.visibility IN (${visibilities.map(() => '?').join(',')}) AND r.status = 'open'
            AND (r.expires_at IS NULL OR r.expires_at > ?)
          GROUP BY r.id ORDER BY r.created_at DESC
        `).bind(session.sub, ...visibilities, nowSecs).all();
        return jsonResponse({ results: results ?? [] });
      }

      // DELETE /api/rooms/:code/attempts/:attemptId — instructor resets a student's attempt
      const attemptMatch = path.match(/^\/api\/rooms\/([A-Z0-9]{4}-[A-Z0-9]{4})\/attempts\/(\d+)$/);
      if (attemptMatch && request.method === 'DELETE') {
        const session = await requireRole(request, env, 'instructor');
        if (session instanceof Response) return session;

        const [, attemptCode, attemptIdRaw] = attemptMatch;
        const attemptId = Number(attemptIdRaw);

        const room = await env.DB.prepare('SELECT id, created_by FROM quiz_rooms WHERE code = ?').bind(attemptCode).first();
        if (!room) return jsonResponse({ error: 'Room not found' }, 404);
        if (room.created_by !== session.sub && session.role !== 'admin') {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        const attempt = await env.DB.prepare(
          'SELECT id FROM quiz_room_attempts WHERE id = ? AND room_id = ?'
        ).bind(attemptId, room.id).first();
        if (!attempt) return jsonResponse({ error: 'Attempt not found' }, 404);

        await env.DB.batch([
          env.DB.prepare('DELETE FROM quiz_room_answers WHERE attempt_id = ?').bind(attemptId),
          env.DB.prepare('DELETE FROM quiz_room_attempts WHERE id = ?').bind(attemptId),
        ]);

        return jsonResponse({ ok: true });
      }

      // PATCH /api/rooms/:code/answers/:answerId — instructor grades a free-response answer
      const gradeAnswerMatch = path.match(/^\/api\/rooms\/([A-Z0-9]{4}-[A-Z0-9]{4})\/answers\/(\d+)$/);
      if (gradeAnswerMatch && request.method === 'PATCH') {
        const session = await requireRole(request, env, 'instructor');
        if (session instanceof Response) return session;

        const [, gradeCode, answerIdRaw] = gradeAnswerMatch;
        const answerId = Number(answerIdRaw);

        let body;
        try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
        const { is_correct } = body ?? {};
        if (is_correct !== 0 && is_correct !== 1) {
          return jsonResponse({ error: 'is_correct must be 0 or 1' }, 400);
        }

        const answer = await env.DB.prepare(`
          SELECT ans.id, ans.attempt_id, r.code, r.created_by
          FROM quiz_room_answers ans
          JOIN quiz_room_attempts att ON att.id = ans.attempt_id
          JOIN quiz_rooms r ON r.id = att.room_id
          WHERE ans.id = ?
        `).bind(answerId).first();
        if (!answer || answer.code !== gradeCode) return jsonResponse({ error: 'Answer not found' }, 404);
        if (answer.created_by !== session.sub && session.role !== 'admin') {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        await env.DB.prepare('UPDATE quiz_room_answers SET is_correct = ? WHERE id = ?')
          .bind(is_correct, answerId).run();

        const scoreRow = await env.DB.prepare(
          'SELECT COUNT(*) AS n FROM quiz_room_answers WHERE attempt_id = ? AND is_correct = 1'
        ).bind(answer.attempt_id).first();
        const pendingRow = await env.DB.prepare(
          'SELECT COUNT(*) AS n FROM quiz_room_answers WHERE attempt_id = ? AND is_correct IS NULL'
        ).bind(answer.attempt_id).first();

        await env.DB.prepare('UPDATE quiz_room_attempts SET score = ? WHERE id = ?')
          .bind(scoreRow.n, answer.attempt_id).run();

        return jsonResponse({ ok: true, score: scoreRow.n, pendingCount: pendingRow.n });
      }

      // Routes with a room code: /api/rooms/:code[/subpath]
      const roomCodeMatch = path.match(/^\/api\/rooms\/([A-Z0-9]{4}-[A-Z0-9]{4})(\/[a-z-]*)?$/);
      if (roomCodeMatch) {
        const code = roomCodeMatch[1];
        const subpath = roomCodeMatch[2] ?? '';

        // GET /api/rooms/:code/join — student joins a room
        if (subpath === '/join' && request.method === 'GET') {
          const session = await requireRole(request, env, 'member');
          if (session instanceof Response) return session;
          const limited = await checkRoomLookupLimit(env, request);
          if (limited) return limited;

          const room = await env.DB.prepare(
            'SELECT id, code, title, status, expires_at, visibility FROM quiz_rooms WHERE code = ?'
          ).bind(code).first();

          // Users who already attempted legitimately know the room exists, so
          // let them view their result even if it later closed or expired.
          const attempt = room ? await env.DB.prepare(
            'SELECT id, score, total, completed_at FROM quiz_room_attempts WHERE room_id = ? AND user_id = ?'
          ).bind(room.id, session.sub).first() : null;

          // Student-only rooms aren't code-secrets (they're listed to anyone
          // qualified), so a clear 403 is appropriate here, unlike the uniform
          // roomUnavailable() below which exists to stop code-guessing.
          if (room && !attempt && room.visibility === 'student' && (ROLE_RANK[session.role] ?? 0) < ROLE_RANK.student) {
            return jsonResponse({ error: 'This room is for verified students only.' }, 403);
          }

          if (!attempt && (!room || room.status === 'closed' || (room.expires_at && Date.now() / 1000 > room.expires_at))) {
            // Unknown, closed, and expired codes are indistinguishable, and each
            // failed lookup counts toward the brute-force limit.
            await recordRoomLookupFailure(env, request);
            return roomUnavailable();
          }

          if (attempt) {
            const { results: ansRows } = await env.DB.prepare(`
              SELECT a.question_id, a.selected, a.response_text, a.is_correct,
                     q.type, q.question, q.answers, q.correct, q.explanation, q.sort_order
              FROM quiz_room_answers a
              JOIN quiz_room_questions q ON q.id = a.question_id
              WHERE a.attempt_id = ?
              ORDER BY q.sort_order
            `).bind(attempt.id).all();
            const pendingCount = (ansRows ?? []).filter(a => a.is_correct === null).length;
            return jsonResponse({
              room: { code: room.code, title: room.title },
              alreadyAttempted: true,
              attempt: {
                score: attempt.score, total: attempt.total, completed_at: attempt.completed_at,
                pendingCount,
                answers: (ansRows ?? []).map(a => ({
                  question_id: a.question_id, type: a.type, question: a.question,
                  answers: JSON.parse(a.answers), correct: a.correct,
                  selected: a.selected, response_text: a.response_text,
                  is_correct: a.is_correct, explanation: a.explanation,
                })),
              },
            });
          }

          // Return questions without correct answers
          const { results: questions } = await env.DB.prepare(
            'SELECT id, sort_order, type, question, answers FROM quiz_room_questions WHERE room_id = ? ORDER BY sort_order'
          ).bind(room.id).all();
          return jsonResponse({
            room: { code: room.code, title: room.title },
            alreadyAttempted: false,
            questions: (questions ?? []).map(q => ({
              id: q.id, sort_order: q.sort_order, type: q.type,
              question: q.question, answers: JSON.parse(q.answers),
            })),
          });
        }

        // GET /api/rooms/:code/my-attempt — student checks their result
        if (subpath === '/my-attempt' && request.method === 'GET') {
          const session = await requireRole(request, env, 'member');
          if (session instanceof Response) return session;
          const limited = await checkRoomLookupLimit(env, request);
          if (limited) return limited;

          const room = await env.DB.prepare('SELECT id FROM quiz_rooms WHERE code = ?').bind(code).first();
          // An unknown code returns the same shape as a known room you haven't
          // attempted, so it can't be used to detect which rooms exist.
          if (!room) {
            await recordRoomLookupFailure(env, request);
            return jsonResponse({ attempt: null });
          }

          const attempt = await env.DB.prepare(
            'SELECT id, score, total, completed_at FROM quiz_room_attempts WHERE room_id = ? AND user_id = ?'
          ).bind(room.id, session.sub).first();
          if (!attempt) return jsonResponse({ attempt: null });

          const { results: ansRows } = await env.DB.prepare(`
            SELECT a.question_id, a.selected, a.response_text, a.is_correct,
                   q.type, q.question, q.answers, q.correct, q.explanation, q.sort_order
            FROM quiz_room_answers a
            JOIN quiz_room_questions q ON q.id = a.question_id
            WHERE a.attempt_id = ?
            ORDER BY q.sort_order
          `).bind(attempt.id).all();
          const pendingCount = (ansRows ?? []).filter(a => a.is_correct === null).length;
          return jsonResponse({
            attempt: {
              score: attempt.score, total: attempt.total, completed_at: attempt.completed_at,
              pendingCount,
              answers: (ansRows ?? []).map(a => ({
                question_id: a.question_id, type: a.type, question: a.question,
                answers: JSON.parse(a.answers), correct: a.correct,
                selected: a.selected, response_text: a.response_text,
                is_correct: a.is_correct, explanation: a.explanation,
              })),
            },
          });
        }

        // POST /api/rooms/:code/attempt — student submits their answers
        if (subpath === '/attempt' && request.method === 'POST') {
          const session = await requireRole(request, env, 'member');
          if (session instanceof Response) return session;
          const limited = await checkRoomLookupLimit(env, request);
          if (limited) return limited;

          const room = await env.DB.prepare(
            'SELECT id, code, title, status, expires_at, visibility FROM quiz_rooms WHERE code = ?'
          ).bind(code).first();
          const existing = room ? await env.DB.prepare(
            'SELECT id FROM quiz_room_attempts WHERE room_id = ? AND user_id = ?'
          ).bind(room.id, session.sub).first() : null;
          if (existing) return jsonResponse({ error: 'You have already submitted this quiz' }, 409);

          if (room && room.visibility === 'student' && (ROLE_RANK[session.role] ?? 0) < ROLE_RANK.student) {
            return jsonResponse({ error: 'This room is for verified students only.' }, 403);
          }

          // Unknown, closed, and expired codes look identical and count toward
          // the brute-force limit (a prior attempt is handled above).
          if (!room || room.status === 'closed' || (room.expires_at && Date.now() / 1000 > room.expires_at)) {
            await recordRoomLookupFailure(env, request);
            return roomUnavailable();
          }

          let body;
          try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
          const { answers } = body ?? {};
          if (!Array.isArray(answers)) return jsonResponse({ error: 'answers must be an array' }, 400);

          const { results: questions } = await env.DB.prepare(
            'SELECT id, type, correct FROM quiz_room_questions WHERE room_id = ? ORDER BY sort_order'
          ).bind(room.id).all();

          if (answers.length !== questions.length) {
            return jsonResponse({ error: `Expected ${questions.length} answers, got ${answers.length}` }, 400);
          }
          for (let i = 0; i < answers.length; i++) {
            const q = questions[i];
            if (q.type === 'free_response') {
              if (typeof answers[i] !== 'string') return jsonResponse({ error: `Answer at index ${i} must be text` }, 400);
            } else if (typeof answers[i] !== 'number' || answers[i] < 0) {
              return jsonResponse({ error: `Answer at index ${i} is invalid` }, 400);
            }
          }

          const scored = questions.map((q, i) => {
            if (q.type === 'free_response') {
              return {
                question_id: q.id, selected: null,
                response_text: answers[i].trim().slice(0, 5000), is_correct: null,
              };
            }
            return {
              question_id: q.id, selected: answers[i], response_text: null,
              is_correct: answers[i] === q.correct ? 1 : 0,
            };
          });
          const score = scored.reduce((sum, s) => sum + (s.is_correct === 1 ? 1 : 0), 0);
          const completedAt = Date.now();

          const attemptResult = await env.DB.prepare(
            'INSERT INTO quiz_room_attempts (room_id, user_id, score, total, completed_at) VALUES (?, ?, ?, ?, ?)'
          ).bind(room.id, session.sub, score, questions.length, completedAt).run();

          await env.DB.batch(scored.map(s =>
            env.DB.prepare(
              'INSERT INTO quiz_room_answers (attempt_id, question_id, selected, response_text, is_correct) VALUES (?, ?, ?, ?, ?)'
            ).bind(attemptResult.meta.last_row_id, s.question_id, s.selected, s.response_text, s.is_correct)
          ));

          // Return full results (correct answers now revealed)
          const { results: fullQs } = await env.DB.prepare(
            'SELECT id, sort_order, type, question, answers, correct, explanation FROM quiz_room_questions WHERE room_id = ? ORDER BY sort_order'
          ).bind(room.id).all();

          const pendingCount = scored.filter(s => s.is_correct === null).length;
          return jsonResponse({
            score, total: questions.length, completed_at: completedAt, pendingCount,
            answers: fullQs.map((q, i) => ({
              question_id: q.id, type: q.type, question: q.question,
              answers: JSON.parse(q.answers), correct: q.correct,
              selected: scored[i].selected, response_text: scored[i].response_text,
              is_correct: scored[i].is_correct, explanation: q.explanation,
            })),
          }, 201);
        }

        // GET /api/rooms/:code/results — instructor views attempt roster
        if (subpath === '/results' && request.method === 'GET') {
          const session = await requireRole(request, env, 'instructor');
          if (session instanceof Response) return session;

          const room = await env.DB.prepare(
            'SELECT id, code, title, status, created_by FROM quiz_rooms WHERE code = ?'
          ).bind(code).first();
          if (!room) return jsonResponse({ error: 'Room not found' }, 404);
          if (room.created_by !== session.sub && session.role !== 'admin') {
            return jsonResponse({ error: 'Forbidden' }, 403);
          }

          const { results: attempts } = await env.DB.prepare(`
            SELECT a.id, a.score, a.total, a.completed_at, u.username
            FROM quiz_room_attempts a
            JOIN users u ON u.id = a.user_id
            WHERE a.room_id = ?
            ORDER BY a.completed_at DESC
          `).bind(room.id).all();

          const { results: questions } = await env.DB.prepare(
            'SELECT id, sort_order, type, question, answers, correct, explanation FROM quiz_room_questions WHERE room_id = ? ORDER BY sort_order'
          ).bind(room.id).all();

          const detailedAttempts = await Promise.all((attempts ?? []).map(async att => {
            const { results: ansRows } = await env.DB.prepare(
              'SELECT id, question_id, selected, response_text, is_correct FROM quiz_room_answers WHERE attempt_id = ?'
            ).bind(att.id).all();
            const pendingCount = (ansRows ?? []).filter(a => a.is_correct === null).length;
            return { ...att, pendingCount, answers: ansRows ?? [] };
          }));

          return jsonResponse({
            room: { code: room.code, title: room.title, status: room.status },
            questions: (questions ?? []).map(q => ({
              id: q.id, sort_order: q.sort_order, type: q.type, question: q.question,
              answers: JSON.parse(q.answers), correct: q.correct, explanation: q.explanation,
            })),
            attempts: detailedAttempts,
          });
        }

        // GET /api/rooms/:code — instructor views room detail
        if (subpath === '' && request.method === 'GET') {
          const session = await requireRole(request, env, 'instructor');
          if (session instanceof Response) return session;

          const room = await env.DB.prepare(
            'SELECT id, code, title, status, expires_at, created_at, created_by FROM quiz_rooms WHERE code = ?'
          ).bind(code).first();
          if (!room) return jsonResponse({ error: 'Room not found' }, 404);
          if (room.created_by !== session.sub && session.role !== 'admin') {
            return jsonResponse({ error: 'Forbidden' }, 403);
          }

          const { results: questions } = await env.DB.prepare(
            'SELECT id, sort_order, question, answers, correct, explanation FROM quiz_room_questions WHERE room_id = ? ORDER BY sort_order'
          ).bind(room.id).all();

          return jsonResponse({
            room: {
              id: room.id, code: room.code, title: room.title,
              status: room.status, expires_at: room.expires_at, created_at: room.created_at,
            },
            questions: (questions ?? []).map(q => ({
              id: q.id, sort_order: q.sort_order, question: q.question,
              answers: JSON.parse(q.answers), correct: q.correct, explanation: q.explanation,
            })),
          });
        }

        // PATCH /api/rooms/:code — instructor updates status or expiry
        if (subpath === '' && request.method === 'PATCH') {
          const session = await requireRole(request, env, 'instructor');
          if (session instanceof Response) return session;

          const room = await env.DB.prepare('SELECT id, created_by FROM quiz_rooms WHERE code = ?').bind(code).first();
          if (!room) return jsonResponse({ error: 'Room not found' }, 404);
          if (room.created_by !== session.sub && session.role !== 'admin') {
            return jsonResponse({ error: 'Forbidden' }, 403);
          }

          let body;
          try { body = await request.json(); } catch { return jsonResponse({ error: 'Invalid request body' }, 400); }
          const { status, expires_at } = body ?? {};

          const updates = []; const params = [];
          if (status !== undefined) {
            if (!['open', 'closed'].includes(status)) return jsonResponse({ error: 'status must be "open" or "closed"' }, 400);
            updates.push('status = ?'); params.push(status);
          }
          if (expires_at !== undefined) {
            if (expires_at === null) {
              updates.push('expires_at = NULL');
            } else {
              const d = new Date(expires_at);
              if (isNaN(d.getTime())) return jsonResponse({ error: 'Invalid expires_at date' }, 400);
              updates.push('expires_at = ?'); params.push(Math.floor(d.getTime() / 1000));
            }
          }
          if (updates.length === 0) return jsonResponse({ error: 'Nothing to update' }, 400);
          params.push(room.id);
          await env.DB.prepare(`UPDATE quiz_rooms SET ${updates.join(', ')} WHERE id = ?`).bind(...params).run();
          return jsonResponse({ ok: true });
        }

        // DELETE /api/rooms/:code — instructor deletes room + all data
        if (subpath === '' && request.method === 'DELETE') {
          const session = await requireRole(request, env, 'instructor');
          if (session instanceof Response) return session;

          const room = await env.DB.prepare('SELECT id, created_by FROM quiz_rooms WHERE code = ?').bind(code).first();
          if (!room) return jsonResponse({ error: 'Room not found' }, 404);
          if (room.created_by !== session.sub && session.role !== 'admin') {
            return jsonResponse({ error: 'Forbidden' }, 403);
          }

          // Cascade: answers → attempts → questions → room
          const { results: attemptRows } = await env.DB.prepare(
            'SELECT id FROM quiz_room_attempts WHERE room_id = ?'
          ).bind(room.id).all();

          const stmts = (attemptRows ?? []).map(a =>
            env.DB.prepare('DELETE FROM quiz_room_answers WHERE attempt_id = ?').bind(a.id)
          );
          stmts.push(env.DB.prepare('DELETE FROM quiz_room_attempts WHERE room_id = ?').bind(room.id));
          stmts.push(env.DB.prepare('DELETE FROM quiz_room_questions WHERE room_id = ?').bind(room.id));
          stmts.push(env.DB.prepare('DELETE FROM quiz_rooms WHERE id = ?').bind(room.id));
          await env.DB.batch(stmts);
          return jsonResponse({ ok: true });
        }
      }

      return jsonResponse({ error: 'Not found' }, 404);
    }

    // ── API: list all topics (summary only) ──────────────────────────────────
    // ── robots.txt ────────────────────────────────────────────────────────────
    // Served from the worker so it's version-controlled and gets the same
    // security headers. Deliberately does NOT Disallow private routes (/admin,
    // /instructor, /profile): robots.txt is public, so listing them would only
    // advertise them. Those pages are protected by auth, not by robots rules.
    if (path === '/robots.txt') {
      const body = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /api/',
        // The PDF is also reachable at its raw static-asset path, which duplicates
        // the canonical /sop URL with no way to signal a canonical (PDFs can't
        // carry a <link rel="canonical">). Keep crawlers off the raw file.
        'Disallow: /Cyber_Unit_SOP.pdf',
        '',
        'Sitemap: https://ungcyberunit.org/sitemap.xml',
        '',
      ].join('\n');
      const headers = addSecurityHeaders(new Headers({ 'Content-Type': 'text/plain; charset=utf-8' }));
      return new Response(body, { headers });
    }

    // ── XML sitemap for search engines ────────────────────────────────────────
    // Generated from the topics list so it stays in sync as topics are added.
    if (path === '/sitemap.xml') {
      const base = 'https://ungcyberunit.org';
      const paths = ['/', '/start', '/about', '/resources', '/sop', ...topics.map(t => `/topic/${t.id}`)];
      const body = `<?xml version="1.0" encoding="UTF-8"?>\n`
        + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
        + paths.map(p => `  <url><loc>${base}${p}</loc></url>`).join('\n')
        + `\n</urlset>\n`;
      const headers = addSecurityHeaders(new Headers({ 'Content-Type': 'application/xml; charset=utf-8' }));
      return new Response(body, { headers });
    }

    if (path === '/api/topics') {
      const summary = topics.map(({ id, title, icon, shortDesc, image, difficulty, readTime }) => ({
        id, title, icon, shortDesc, image, difficulty, readTime,
      }));
      const headers = addSecurityHeaders(new Headers({ 'Content-Type': 'application/json' }));
      return new Response(JSON.stringify(summary), { headers });
    }

    // ── API: single topic by id ───────────────────────────────────────────────
    const topicMatch = path.match(/^\/api\/topic\/(\w+)$/);
    if (topicMatch) {
      const topic = topics.find(t => t.id === topicMatch[1]);
      if (!topic) {
        const headers = addSecurityHeaders(new Headers({ 'Content-Type': 'application/json' }));
        return new Response(JSON.stringify({ error: 'Topic not found' }), { status: 404, headers });
      }
      const headers = addSecurityHeaders(new Headers({ 'Content-Type': 'application/json' }));
      return new Response(JSON.stringify({ ...topic, ...(topicFraming[topic.id] || {}) }), { headers });
    }

    // ── Static assets: serve from the [assets] binding ───────────────────────
    // Pages/Workers with [assets] in wrangler.toml serves public/ automatically.
    // For HTML view routes we need to explicitly pass through to the asset binding.

    // ── HTML view routes → serve from views/ via asset binding ───────────────
    // Map Express routes to their HTML file equivalents in the public dir.
    // We'll put the HTML files in public/ so the asset binding can serve them.
    const viewRoutes = {
      '/': '/',
      '/resources': '/resources',
      '/about': '/about',
      '/instructor': '/instructor',
      '/admin': '/admin',
      '/quiz': '/quiz',
      '/profile': '/profile',
      '/start': '/start',
      '/leaderboard': '/leaderboard',
      '/announcements': '/announcements',
      '/contact': '/contact',
      '/student-hub': '/student-hub',
    };

    // topic/:id — any path matching /topic/<something>
    const topicPageMatch = path.match(/^\/topic\/\w+$/);
    // quiz/:code — any path matching /quiz/XXXX-XXXX
    const quizRoomMatch = path.match(/^\/quiz\/[A-Z0-9]{4}-[A-Z0-9]{4}$/i);
    // u/:username — public profile view; validity/privacy is resolved client-side
    // via /api/user/:username, same pattern as quiz/:code.
    const publicProfilePageMatch = path.match(/^\/u\/[a-zA-Z0-9_]+$/);

    let assetPath = null;
    if (viewRoutes[path] !== undefined) {
      assetPath = viewRoutes[path];
    } else if (topicPageMatch) {
      assetPath = '/topic';
    } else if (quizRoomMatch) {
      assetPath = '/quiz-room';
    } else if (publicProfilePageMatch) {
      assetPath = '/u';
    } else if (path === '/sop') {
      assetPath = '/Cyber_Unit_SOP.pdf';
    } else if (path === '/feedback') {
      // Renamed to /contact — redirect any old bookmarks/links.
      return Response.redirect(`${url.origin}/contact`, 301);
    } else if (path === '/danica') {
      return new Response('I love you! <3', {
        headers: addSecurityHeaders(new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })),
      });
    }

    if (assetPath !== null) {
      // Fetch from the asset binding using the mapped path
      const assetUrl = new URL(assetPath, url.origin);
      try {
        const assetResponse = await env.ASSETS.fetch(assetUrl.toString());
        if (assetResponse.ok) {
          const headers = addSecurityHeaders(new Headers(assetResponse.headers));
          // These pages are worker-generated (SEO meta + server-rendered grids
          // are injected per request). Don't inherit the static asset's
          // cacheability, or the edge freezes a stale copy (e.g. an empty /start).
          headers.delete('ETag');
          headers.set('Cache-Control', 'no-store');

          // Inject per-topic SEO metadata AND the actual lesson content into the
          // shared topic.html shell. An unknown topic id must 404, not silently
          // serve the generic shell as a 200 (that's a soft 404 — bad for search
          // indexing). The lesson content itself must also not be left as the
          // client-rendered "Loading topic..." placeholder: a crawler that
          // doesn't run JS (or gives up before the fetch to /api/topic/:id
          // resolves) would see identical thin content on every topic page,
          // which is exactly what got /topic/02 flagged as a Soft 404.
          if (topicPageMatch) {
            const topic = topics.find(t => t.id === path.split('/').pop());
            if (!topic) return notFoundResponse();
            const framed = { ...topic, ...(topicFraming[topic.id] || {}) };
            const html = (await assetResponse.text())
              .replace('<title>CyberUnit @ UNG — Topic</title>', topicMetaTags(topic))
              .replace('<span id="breadcrumbTopic">Loading...</span>', `<span id="breadcrumbTopic">${escapeHtml(topic.title)}</span>`)
              .replace('<span class="topic-icon-large" id="topicIcon" aria-hidden="true"></span>', `<span class="topic-icon-large" id="topicIcon" aria-hidden="true">${topic.icon}</span>`)
              .replace('<h1 class="topic-title" id="topicTitle">Loading...</h1>', `<h1 class="topic-title" id="topicTitle">${escapeHtml(topic.title)}</h1>`)
              .replace('<span class="badge badge-beginner" id="topicDifficulty">Beginner</span>', `<span class="badge badge-${topic.difficulty.toLowerCase()}" id="topicDifficulty">${escapeHtml(topic.difficulty)}</span>`)
              .replace('<span class="read-time" id="topicReadTime"></span>', `<span class="read-time" id="topicReadTime">${escapeHtml(topic.readTime)}</span>`)
              .replace('<div id="topicIllustration"></div>', `<div id="topicIllustration">${getTopicSVG(topic.id, topic.icon, topic.title)}</div>`)
              .replace(
                `<article class="topic-content" id="topicContent" aria-label="Topic content">
            <div style="color:var(--text-muted); font-family:'Share Tech Mono',monospace; padding:2rem 0; text-align:center;">
              Loading topic...
            </div>
          </article>`,
                `<article class="topic-content" id="topicContent" aria-label="Topic content">${renderContent(framed)}</article>`
              );
            headers.delete('Content-Length');
            headers.set('Content-Type', 'text/html; charset=utf-8');
            return new Response(html, { status: assetResponse.status, headers });
          }

          // Server-render the homepage topic grid + stat counts so the primary
          // content isn't dependent on a client-side fetch that crawlers may skip.
          if (path === '/') {
            const html = (await assetResponse.text())
              .replace('<!-- Populated by main.js -->', homeTopicCards())
              .replace('<strong id="statTopics">—</strong>', `<strong id="statTopics">${topics.length}</strong>`)
              .replace('<strong id="statQuizzes">—</strong>', `<strong id="statQuizzes">${topics.length}</strong>`);
            headers.delete('Content-Length');
            headers.set('Content-Type', 'text/html; charset=utf-8');
            return new Response(html, { status: assetResponse.status, headers });
          }

          // Server-render the Beginner Pathway into the /start page.
          if (path === '/start') {
            const html = (await assetResponse.text())
              .replace('<!-- PATHWAY -->', pathwayHtml());
            headers.delete('Content-Length');
            headers.set('Content-Type', 'text/html; charset=utf-8');
            return new Response(html, { status: assetResponse.status, headers });
          }

          return new Response(assetResponse.body, {
            status: assetResponse.status,
            headers,
          });
        }
      } catch (_) {
        // fall through to 404
      }
      return notFoundResponse();
    }

    // ── Everything else: try the asset binding directly (css, js, images) ────
    try {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.ok) {
        const headers = addSecurityHeaders(new Headers(assetResponse.headers));
        return new Response(assetResponse.body, {
          status: assetResponse.status,
          headers,
        });
      }
    } catch (_) {
      // fall through
    }

    return notFoundResponse();
  },

  // Cron Trigger: prune expired brute-force rate-limit rows and abandoned
  // guest accounts. Rate-limit tables already self-prune on write, so that
  // part just clears residual rows once traffic stops. Schedule is defined
  // in wrangler.toml ([triggers] crons).
  async scheduled(event, env, ctx) {
    if (!env.DB) return;
    ctx.waitUntil(
      env.DB.prepare('DELETE FROM room_lookup_failures WHERE ts < ?')
        .bind(Date.now() - ROOM_RL_WINDOW_MS)
        .run()
    );
    ctx.waitUntil(
      env.DB.prepare('DELETE FROM feedback_rate_limit WHERE ts < ?')
        .bind(Date.now() - FEEDBACK_RL_WINDOW_MS)
        .run()
    );
    ctx.waitUntil(
      env.DB.prepare('DELETE FROM email_action_rate_limit WHERE ts < ?')
        .bind(Date.now() - EMAIL_ACTION_RL_WINDOW_MS)
        .run()
    );
    ctx.waitUntil(
      env.DB.prepare('DELETE FROM signup_rate_limit WHERE ts < ?')
        .bind(Date.now() - SIGNUP_RL_WINDOW_MS)
        .run()
    );

    // Guest accounts that never upgraded (see /api/auth/upgrade) are dead
    // weight once their session has expired — nothing can log back into
    // them (guests have no password), so they'd otherwise sit in the DB
    // forever. Batched (one transaction, ordered child-tables-first) so a
    // guest mid-upgrade can't be deleted out from under that request — by
    // the time this runs their role is already 'member' and the WHERE
    // excludes them regardless.
    const guestCutoff = Date.now() - GUEST_SESSION_SECONDS * 1000;
    ctx.waitUntil(
      env.DB.batch([
        env.DB.prepare(`
          DELETE FROM quiz_room_answers WHERE attempt_id IN (
            SELECT id FROM quiz_room_attempts WHERE user_id IN (
              SELECT id FROM users WHERE role = 'guest' AND created_at < ?
            )
          )
        `).bind(guestCutoff),
        env.DB.prepare(`
          DELETE FROM quiz_room_attempts WHERE user_id IN (
            SELECT id FROM users WHERE role = 'guest' AND created_at < ?
          )
        `).bind(guestCutoff),
        env.DB.prepare(`
          DELETE FROM quiz_results WHERE user_id IN (
            SELECT id FROM users WHERE role = 'guest' AND created_at < ?
          )
        `).bind(guestCutoff),
        env.DB.prepare(`DELETE FROM users WHERE role = 'guest' AND created_at < ?`).bind(guestCutoff),
      ])
    );
  },
};
