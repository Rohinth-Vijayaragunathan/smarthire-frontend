# SmartHire - Frontend

Modern React-based frontend for Intelligent Applicant Tracking System (ATS).

## 🚀 Features

- **User Authentication** - Login, register, forgot password
- **Recruiter Dashboard** - Post jobs, manage applications, filter candidates
- **Candidate Dashboard** - Search jobs, apply, track applications, upload resumes
- **Resume Management** - Upload, download, view extracted resume content
- **Job Search** - Advanced filtering by location, job type, skills
- **Application Tracking** - Real-time status updates and notifications
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Professional UI with dark mode
- **CSV Export** - Export applications to CSV
- **Bulk Actions** - Update multiple applications at once

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS (with inline CSS fallback)
- **Icons:** Lucide React

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Git

## 🔧 Installation

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/smarthire-frontend.git
cd smarthire-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000/api
# For production:
# VITE_API_URL=https://smarthire-backend.onrender.com/api
```

### 4. Start Development Server

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📚 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎯 Pages & Components

### Pages

- **Login** - User authentication
- **Register** - New user signup
- **Forgot Password** - Password reset
- **Reset Password** - Set new password
- **Recruiter Dashboard** - Job and application management
- **Candidate Dashboard** - Job search and applications
- **Resume Search** - Search candidates by skills

### Components

- **ApplicationCard** - Display application details
- **PostJobModal** - Create new job posting
- **JobCard** - Display job listing

## 🔐 Authentication

Uses JWT tokens stored in localStorage.

### Login Flow

User enters credentials
↓
POST /api/auth/login/
↓
Receive access_token & refresh_token
↓
Store in localStorage
↓
Set Authorization header
↓
Access protected routes ✅

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import GitHub repository
4. Set environment variables:
   - `VITE_API_URL=https://smarthire-backend.onrender.com/api`

5. Build Command: `npm run build`
6. Output Directory: `dist`

Frontend lives at: `https://your-project.vercel.app`

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── RecruiterDashboard.jsx
│   │   ├── CandidateDashboard.jsx
│   │   └── ResumeSearchPage.jsx
│   ├── components/
│   │   ├── ApplicationCard.jsx
│   │   ├── PostJobModal.jsx
│   │   └── JobCard.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🌐 API Integration

All API calls go through `src/services/api.js`:

```javascript
import { authAPI, jobsAPI, applicationsAPI } from '../services/api';

// Login
const response = await authAPI.login(email, password);

// Get jobs
const jobs = await jobsAPI.listJobs();

// Apply for job
const app = await applicationsAPI.applyForJob(jobData);
```

## 🎨 Styling

Uses pure inline CSS (no CSS framework dependency) for maximum compatibility.

Color scheme:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Success: `#10b981`
- Error: `#ef4444`

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🧪 Development

### Run locally with backend

```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev
```

Access at `http://localhost:5173`

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |

## 🐛 Troubleshooting

### API Connection Error
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check browser console (F12) for errors

### CORS Error
- Verify backend `CORS_ALLOWED_ORIGINS` includes frontend URL
- Check CORS headers in Network tab

### Build Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🔗 Links

- **Backend:** [smarthire-backend](https://github.com/Rohinth-Vijayaragunathan/smarthire-backend)
- **Demo:** https://smarthire-frontend-lac.vercel.app
- **API Docs:** https://smarthire-backend.onrender.com/api/

## 📄 License

MIT License - feel free to use this project

## 👤 Author

Rohinth Vijayaragunathan

## 📞 Support

For issues and questions, open a GitHub issue.
