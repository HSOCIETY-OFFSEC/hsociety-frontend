# HSOCIETY MVP - Offensive Security Platform

A minimal, secure web platform for offensive security services, client engagement, and community-driven penetration testing.

## 🎯 Core Features

- **Secure Authentication**: OTP + 2FA login system
- **Penetration Testing**: Request and manage security engagements
- **Security Audits**: View and download audit reports
- **Feedback System**: Public feedback submission
- **Dashboard**: Overview of security activities
- **Theme Support**: Light and dark modes

## 🔒 Security Features

- OTP-based authentication
- Two-factor authentication (2FA)
- Session management with auto-logout
- Input validation and sanitization
- Encryption placeholders (ready for integration)
- CSRF protection
- Rate limiting
- Secure headers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hsociety-offsec
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

5. Start the app:

   **Option A: Frontend only** (mock data):
   ```bash
   npm run dev
   ```

   **Option B: Frontend + Backend** (with Express API):
   ```bash
   # Terminal 1 - API server
   cd server && npm install && npm run dev

   # Terminal 2 - Frontend (from project root)
   npm run dev
   ```

6. Open browser to `http://localhost:5173`

## 📁 Project Structure
```
hsociety-offsec/
├── src/                    # Frontend (React + Vite)
│   ├── app/               # App config, router, providers
│   ├── core/              # Auth, encryption, validation
│   ├── features/          # Feature modules (dashboard, audits, etc.)
│   ├── shared/            # Layout, UI components, API client
│   ├── config/            # API, env, navigation config
│   ├── styles/            # CSS
│   └── utils/             # Helpers
├── server/                 # Backend (Express.js)
│   ├── routes/            # API route handlers
│   ├── index.js           # Server entry
│   └── .env.example       # Backend env template
└── .env.example           # Frontend env template
```

## 🎨 Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: Express.js (see `server/`)
- **Routing**: React Router v6
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Context API

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_ENABLE_2FA` - Enable two-factor authentication
- `VITE_SESSION_DURATION` - Session timeout duration
- `VITE_INACTIVITY_TIMEOUT` - Auto-logout timeout

## Netlify/Vercel + Render Deployment

For a Netlify or Vercel frontend talking to your Render backend, set:

- `VITE_API_BASE_URL=https://hsociety-backend.onrender.com/api`

Where to set it:

1. Netlify (or Vercel) Dashboard
2. Project Settings
3. Environment Variables
4. Add `VITE_API_BASE_URL` for Production (and Preview if needed)
5. Redeploy

Backend CORS must allow your frontend domain. On Render backend, set:

- `FRONTEND_URLS=https://<your-project>.netlify.app,https://<your-project>.vercel.app,https://your-custom-domain.com`

## 📝 Backend Integration

The Express backend in `server/` is scaffolded and ready. Vite proxies `/api` to the backend in dev.

- **Dashboard**: `GET /api/dashboard/overview` returns mock data
- **Feedback**: `POST /api/feedback` accepts submissions
- **Pentest**: `POST /api/pentest` accepts requests
- **Auth, Audits, etc.**: Placeholders; implement with JWT + DB

See `server/README.md` for backend setup.

## 🔐 Security Notes

- Change default encryption keys in production
- Enable HTTPS in production
- Configure CORS properly
- Set up rate limiting on backend
- Implement proper session management
- Enable security headers

## 📄 License

Proprietary - HSOCIETY

## 👥 Team

Built for real, in-depth, African-centric offensive security.

---

**Execution over marketing. Proof over promises.**
