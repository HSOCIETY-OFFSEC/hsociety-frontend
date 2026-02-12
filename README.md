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

5. Start development server:
```bash
npm run dev
```

6. Open browser to `http://localhost:5173`

## 📁 Project Structure
```
src/
├── app/                    # App configuration
│   ├── App.jsx            # Main app component
│   ├── providers.jsx      # Theme & context providers
│   └── router.jsx         # Route configuration
├── core/                   # Core functionality
│   ├── auth/              # Authentication logic
│   ├── encryption/        # Encryption utilities
│   ├── inactivity/        # Auto-logout
│   ├── security-tests/    # Security scanning
│   └── validation/        # Input validation
├── features/              # Feature modules
│   ├── audits/           # Security audits
│   ├── dashboard/        # User dashboard
│   ├── feedback/         # Feedback system
│   └── pentest/          # Penetration testing
├── shared/               # Shared components
│   ├── components/       # Reusable UI components
│   └── services/         # API client
├── styles/               # CSS files
├── config/               # Configuration files
└── utils/                # Utility functions
```

## 🎨 Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **Build Tool**: Vite
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

## 📝 TODO: Backend Integration

All service files contain placeholders for backend integration:
- Authentication endpoints
- OTP & 2FA verification
- Pentest management
- Audit reports
- Feedback submission

Search for `TODO: Backend integration` in the codebase.

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