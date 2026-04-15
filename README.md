# CyberUnit @ UNG

An interactive cybersecurity education website for the **University of North Georgia Boar's Head Brigade Cyber Unit**.

Built with Node.js and Express, the site covers beginner cybersecurity topics with quizzes, and includes an About page with the unit's structure, roles, and SOP documentation.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher

### Install & Run

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`.

For development with auto-reload:

```bash
npm run dev
```

## Project Structure

```
cybersec-basics/
├── public/
│   ├── css/          # Global stylesheet
│   ├── images/       # Logos and topic images
│   └── js/           # Client-side scripts
├── views/
│   ├── index.html    # Home / topics page
│   ├── topic.html    # Individual topic viewer
│   ├── resources.html
│   └── about.html    # Unit info, org chart, SOP link
├── Cyber_Unit_SOP.pdf
├── server.js         # Express app + topic data
└── package.json
```

## Routes

| Route | Description |
|---|---|
| `/` | Home page with topic grid |
| `/topic/:id` | Individual topic with quiz |
| `/resources` | External learning resources |
| `/about` | Unit overview, org chart, roles |
| `/sop` | Cyber Unit SOP (PDF) |
| `/api/topics` | JSON list of all topics |
| `/api/topic/:id` | JSON data for a single topic |
