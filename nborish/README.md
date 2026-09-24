# Borish Portfolio

React + Vite portfolio for Ningombam Borish Singh, built from merged CV data.

## Structure

```
borish-portfolio/
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # composes all sections
    ├── data/
    │   └── profile.json   # the "database" — all résumé data lives here
    ├── components/
    │   ├── Primitives.jsx # Frame, Chip, SectionHead
    │   ├── Nav.jsx
    │   ├── Hero.jsx
    │   ├── About.jsx
    │   ├── Experience.jsx
    │   ├── Projects.jsx
    │   ├── Skills.jsx
    │   ├── Honors.jsx
    │   ├── Contact.jsx
    │   └── ChatBot.jsx    # chatbot grounded on profile.json
    └── styles/
        └── global.css
```

## Run locally

```bash
npm install
npm run dev
```

## Chatbot

`ChatBot.jsx` sends `profile.json` as the system prompt to the Anthropic
Messages API (`https://api.anthropic.com/v1/messages`, model
`claude-sonnet-4-6`) so answers stay grounded in the actual résumé data
instead of being invented. To deploy this outside the current environment,
route that fetch through your own backend/proxy that holds the API key —
never ship an API key in client-side code.

## Editing content

All portfolio content (experience, projects, skills, honors, contact info)
lives in `src/data/profile.json`. Edit that one file to update both the
page and what the chatbot knows — no component code needs to change.
