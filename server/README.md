# Hsociety API Server

Express.js backend for the Hsociety OffSec platform.

## Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env if needed
```

## Development

```bash
npm run dev
```

Server runs at `http://localhost:3000`. API base: `http://localhost:3000/api`.

## Production

```bash
npm start
```

## API Structure

Routes match the frontend `API_ENDPOINTS` in `src/config/api.config.js`:

- `/api/auth` - Login, register, OTP, 2FA
- `/api/dashboard` - Stats, activity, overview
- `/api/pentest` - Pentest requests and management
- `/api/audits` - Security audits
- `/api/feedback` - Feedback submission
- `/api/community` - Community features
- `/api/student` - Student dashboard
- `/api/profile` - User profile

## Next Steps

1. Add JWT auth middleware
2. Connect database (PostgreSQL/MongoDB)
3. Implement auth routes (login, register, verify)
4. Add rate limiting
5. Add request validation (e.g. Joi/Zod)
