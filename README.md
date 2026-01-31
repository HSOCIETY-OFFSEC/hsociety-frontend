# README.md

# Hsociety - Offensive Security SaaS Platform

Elite penetration testing and offensive security management platform for ethical hackers, security teams, and security learners.

## 🚀 Features

- **Authentication & Authorization**
  - Secure httpOnly cookie-based authentication
  - Protected routes with auto-redirect
  - Session management with token refresh

- **Dashboard**
  - Real-time project overview
  - Task management
  - Vulnerability tracking
  - Team collaboration

- **Penetration Testing Management**
  - Create and track penetration tests
  - Progress monitoring
  - Finding categorization by severity
  - Client management

- **Task Management**
  - Priority-based task system
  - Assignment and status tracking
  - Project-based task organization

- **Dark/Light Theme**
  - System-wide theme switching
  - Persistent theme preferences

## 🛠 Tech Stack

- **Frontend Framework**: React 18 + Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Custom CSS with CSS Variables
- **Icons**: React Icons
- **HTTP Client**: Fetch API with custom service layer

## 📁 Project Structure
```
src/
├── config/
│   └── api.config.js          # API endpoints and configuration
├── services/
│   ├── api.service.js         # Base API service with retry logic
│   ├── auth.service.js        # Authentication operations
│   ├── pentest.service.js     # Pentest CRUD operations
│   └── task.service.js        # Task CRUD operations
├── context/
│   ├── AuthContext.jsx        # Global authentication state
│   └── ThemeContext.jsx       # Theme management
├── hooks/
│   ├── useApi.js              # Generic API hook
│   ├── usePentests.js         # Pentest operations hook
│   └── useTasks.js            # Task operations hook
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ThemeToggle.jsx
│   ├── ProtectedRoute.jsx     # Auth-protected route wrapper
│   ├── PublicRoute.jsx        # Public route wrapper
│   └── Logo.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Dashboard.jsx
├── utils/
│   ├── validators.js          # Form validation utilities
│   ├── formatters.js          # Data formatting helpers
│   └── constants.js           # Application constants
├── styles/
│   └── theme.css              # Theme variables
├── App.css                    # Component styles
├── index.css                  # Global styles
├── App.jsx                    # Main app component
└── main.jsx                   # App entry point
```

## 🔧 Setup & Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hsociety.git
cd hsociety
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
```

5. Start development server
```bash
npm run dev
```

## 🏃 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Security Architecture

### Authentication Flow

1. **Login/Signup**
   - User submits credentials
   - Backend validates and returns user data
   - **Tokens stored in httpOnly cookies** (NOT localStorage)
   - Client maintains auth state in memory

2. **Protected Routes**
   - `ProtectedRoute` wrapper checks authentication
   - Redirects to login if unauthenticated
   - Preserves intended destination

3. **Session Management**
   - Session verified on app initialization
   - Automatic token refresh on expiration
   - Logout clears server-side session

4. **API Requests**
   - `credentials: 'include'` sends cookies automatically
   - Retry logic with exponential backoff
   - Centralized error handling

### Security Features

- ✅ HttpOnly cookies (prevent XSS token theft)
- ✅ CSRF protection ready
- ✅ Input validation and sanitization
- ✅ Secure password requirements
- ✅ Session timeout handling
- ✅ Rate limiting support

## 🎨 Theming

The application supports dark and light themes with CSS variables:
```css
/* Dark theme (default) */
--bg-primary: #0a0a0a
--text-primary: #ffffff
--accent-primary: #00ff88

/* Light theme */
--bg-primary: #ffffff
--text-primary: #0a0a0a
--accent-primary: #00aa5a
```

Theme preference is persisted in localStorage.

## 📡 API Integration

### Base Configuration

API endpoints are configured in `src/config/api.config.js`:
```javascript
const API_CONFIG = {
  BASE_URL: 'https://api.hsociety.com/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};
```

### Service Layer

All API calls go through service modules:
```javascript
// Example: Fetch pentests
import { pentestService } from './services/pentest.service';

const pentests = await pentestService.getAllPentests();
```

### Custom Hooks

React hooks provide state management for API operations:
```javascript
import { usePentests } from './hooks/usePentests';

const { pentests, loading, error, refresh } = usePentests();
```

## 🚧 Backend Requirements

This frontend expects a REST API backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/signup` - Register user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify session
- `POST /api/auth/refresh` - Refresh token

### Pentests
- `GET /api/pentests` - List pentests
- `POST /api/pentests` - Create pentest
- `GET /api/pentests/:id` - Get pentest
- `PUT /api/pentests/:id` - Update pentest
- `DELETE /api/pentests/:id` - Delete pentest

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Authentication Response Format
```json
{
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "pentester"
  }
}
```

**Note**: Access/refresh tokens should be set as httpOnly cookies, NOT returned in response body.

## 🔄 State Management

- **Authentication**: Global state via `AuthContext`
- **Theme**: Global state via `ThemeContext`
- **API Data**: Component-level state with custom hooks
- **No Redux**: Context API + hooks pattern for simplicity

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## 🎯 Next Steps / Roadmap

### MVP Features to Implement

- [ ] Backend API development
- [ ] Real-time notifications (WebSocket)
- [ ] File upload for reports
- [ ] Advanced filtering and search
- [ ] Export reports (PDF)
- [ ] Team invitation system
- [ ] User profile management
- [ ] Settings page

### Future Enhancements

- [ ] Real-time collaboration
- [ ] Automated vulnerability scanning
- [ ] Integration with security tools
- [ ] Mobile app (React Native)
- [ ] AI-powered vulnerability analysis

## 🤝 Contributing

This is a startup project. Contribution guidelines TBD.

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- Live App: https://hsociety.vercel.app/
- API Documentation: TBD
- Support: contact@hsociety.com

---

Built with ⚡ by the Hsociety team