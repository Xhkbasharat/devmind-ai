DevMind AI — Frontend

The frontend of DevMind AI is a React and TypeScript application designed to provide an AI-powered software engineering workspace.

Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- Recharts
- Lucide React

Project Features

- User registration and authentication
- AI code generation
- AI-powered debugging
- Code explanation
- Static code quality analysis
- GitHub repository workspace
- Project management
- Code review workspace
- Backend connection monitoring
- Responsive dashboard interface

Requirements

- Node.js 20 or later
- npm
- DevMind AI backend

Installation

Open a terminal inside the "frontend" directory and run:

npm install

Environment Configuration

Create a ".env" file in the frontend directory:

VITE_API_URL=http://localhost:8000

Change the URL when deploying the backend to a hosted server.

Never put private API keys or backend secrets in frontend environment variables.

Development

Start the development server:

npm run dev

Vite will provide a local development URL.

Type Checking

npm run typecheck

Production Build

npm run build

The production files are generated in the "dist" directory.

Preview Production Build

npm run preview

Backend Connection

The frontend communicates with the FastAPI backend through the centralized Axios client in:

"src/services/api.ts"

The backend must be running and configured to allow requests from the frontend origin.

Project Structure

frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   ├── AppRoutes.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts

Deployment

Build the frontend using "npm run build" and deploy the generated "dist" directory to a static hosting provider.

Configure the deployed frontend to use the publicly accessible backend URL.

---

Project: DevMind AI
Application: AI-powered software engineering platform
