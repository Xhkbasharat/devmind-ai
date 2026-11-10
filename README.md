DevMind AI 🤖

AI-Powered Software Engineering Assistant

DevMind AI is an intelligent software engineering platform that combines Artificial Intelligence and Machine Learning to help developers generate, understand, debug, and improve code.

🚀 Features

- AI Code Generation: Generate code from natural-language instructions.
- AI Debugging: Identify errors and suggest solutions.
- Code Explanation: Understand complex programming logic.
- Static Code Analysis: Detect potential code-quality issues.
- ML Code Quality Prediction: Predict code quality using machine learning.
- Automated Code Review: Analyze source code and identify problems.
- GitHub Integration: Retrieve repository information and contents.
- User Authentication: Secure registration and login using JWT.
- Project Management: Create and manage development projects.

🛠️ Tech Stack

Technology| Purpose
Python| Backend development
FastAPI| REST API
React| Frontend (planned)
TypeScript| Frontend development (planned)
scikit-learn| Machine Learning
OpenAI API| AI integration
SQLAlchemy| Database ORM
PostgreSQL| Production database
SQLite| Local development
GitHub API| Repository integration
pytest| Automated testing

📂 Project Structure

devmind-ai/
├── .github/
│   └── workflows/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── ml/
│   │   ├── main.py
│   │   ├── config.py
│   │   └── database.py
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
├── .gitignore
└── README.md

⚙️ Installation

1. Clone the repository

git clone YOUR_REPOSITORY_URL
cd devmind-ai

2. Navigate to backend

cd backend

3. Install dependencies

pip install -r requirements.txt

4. Configure environment variables

Copy ".env.example" to ".env" and configure your credentials.

Required settings include:

SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
AI_API_KEY=your-ai-api-key
GITHUB_TOKEN=your-github-token

Never upload your actual API keys or passwords to GitHub.

5. Run database migrations

alembic upgrade head

6. Start the application

uvicorn app.main:app --reload

The API will run at:

"http://127.0.0.1:8000"

📡 API Documentation

Once the backend is running:

- Swagger UI: "/docs"
- ReDoc: "/redoc"
- Health Check: "/health"

Main API Endpoints

Module| Endpoint
Authentication| "/auth/register"
Login| "/auth/login"
AI Generation| "/ai/generate"
AI Debugging| "/ai/debug"
Code Explanation| "/ai/explain"
Static Analysis| "/analysis/static"
ML Prediction| "/analysis/predict"
Projects| "/projects/"
Code Reviews| "/reviews/"
GitHub| "/github/repositories/{owner}/{repo}"

🧪 Testing

Run automated tests from the backend directory:

pytest -v

GitHub Actions is configured to run backend tests automatically on pushes and pull requests targeting "main".

🗺️ Development Roadmap

- [x] Backend architecture
- [x] AI service integration
- [x] Static code analyzer
- [x] ML feature extraction
- [x] JWT authentication
- [x] Project management API
- [x] Code review API
- [x] GitHub integration
- [x] Initial test files
- [ ] Verify and execute all tests
- [ ] Validate database migrations
- [ ] Train and evaluate ML model
- [ ] Develop React frontend
- [ ] Build developer dashboard
- [ ] Add advanced AI code review
- [ ] Deploy production application

🔐 Security

- JWT-based authentication
- Password hashing
- Environment-based configuration
- Protected project and review resources
- Secure API key management

Additional security validation is required before production deployment.

📌 Project Status

Currently in development.

DevMind AI aims to become a comprehensive AI-powered software engineering assistant.

📄 License

This project is proprietary. All rights reserved by the project owner. See the "LICENSE" file for complete terms.

---

DevMind AI — Build Smarter. Code Better. Engineer Faster.
