# Auth Backend Implementation Plan

Plan for implementing the auth backend with MongoDB and JWT, aligned with the existing frontend and `User` model.

---

## 1. Scope

### Phase 1 – Core (implement first)
| Endpoint | Method | Purpose | Auth required |
|----------|--------|---------|----------------|
| `/auth/register` | POST | Create user (email + hashed password) | No |
| `/auth/login` | POST | Email + password → JWT + user | No |
| `/auth/me` | GET | Return current user from JWT | Yes |
| `/auth/refresh` | POST | Issue new access token from refresh token | No (send refresh token in body or cookie) |
| `/auth/verify` | GET | Validate token (e.g. on app load) | Yes (Bearer) |
| `/auth/logout` | POST | Client clears session; optional: blacklist refresh token later | No |

### Phase 2 – Later (optional)
- `/auth/otp/request`, `/auth/otp/verify` – email OTP (e.g. passwordless or step in login)
- Password reset: `/auth/password-reset/request`, `/auth/password-reset/confirm`
- 2FA: use `User.otpSecret` and TOTP (e.g. `speakeasy`)

---

## 2. Frontend contract (match this)

- **Session:** `sessionManager.setSession({ user, token, timestamp, expiresAt })`
- **Token:** Sent as `Authorization: Bearer <accessToken>`
- **User:** At least `{ id, email, name, role }` (frontend may use `id` as string)
- **401:** Frontend clears session and redirects to `/login`

### Register request (from `register.contract.js`)

```json
{
  "role": "student" | "corporate",
  "profile": { "fullName": "...", "organization": "..." },
  "credentials": { "email": "...", "password": "..." },
  "consent": { "acceptedTerms": true, "acceptedAt": "ISO date" },
  "metadata": { "source": "web", "version": "1" }
}
```

Backend maps: `profile.fullName` → `User.name`; can add `organization` to User later if needed. Role: map `corporate` → e.g. `analyst` or keep a separate enum.

### Login request

```json
{ "email": "...", "password": "..." }
```

### Success responses (register / login)

Return the same shape so the frontend can call `setSession`:

```json
{
  "user": {
    "id": "<userId>",
    "email": "...",
    "name": "...",
    "role": "student" | "analyst" | "admin"
  },
  "token": "<accessToken>",
  "expiresIn": 86400
}
```

`expiresIn` in seconds so the client can compute `expiresAt` (or backend can return `expiresAt`).

---

## 3. Tech choices

| Item | Choice | Notes |
|------|--------|--------|
| Password hashing | **bcrypt** | Store in `User.passwordHash`; never return in API |
| Access token | **JWT** (e.g. `jsonwebtoken`) | Short-lived (e.g. 15m–1h), signed with `JWT_SECRET` |
| Refresh token | **JWT** or opaque | Longer-lived (e.g. 7d); store in DB or in-memory blocklist on logout (Phase 2) |
| Auth middleware | Verify JWT, attach `req.user` | Return 401 if missing/invalid |
| Validation | **express-validator** or manual | Validate email, password length, required fields |

---

## 4. Environment

Add to `server/.env` and `server/.env.example`:

- `JWT_SECRET` – strong random string (e.g. 32+ chars) for signing JWTs  
- `JWT_ACCESS_EXPIRY` – e.g. `1h` or `15m`  
- `JWT_REFRESH_EXPIRY` – e.g. `7d` (if using refresh tokens)

---

## 5. Implementation order

1. **Dependencies**  
   - `bcrypt` (or `bcryptjs` if no native build), `jsonwebtoken`  
   - Optional: `express-validator`

2. **User model**  
   - Already has: `email`, `passwordHash`, `name`, `role`, `emailVerified`.  
   - Add: pre-save hook to hash password when `password` is present (or hash in service layer before `User.create`).  
   - Optional: add `organization` from `profile.organization` if desired.

3. **Auth service** (`server/services/auth.service.js`)  
   - `register(payload)` – map frontend DTO to User, hash password, create user, return user + tokens.  
   - `login(email, password)` – find user by email (with `passwordHash`), compare password, update `lastLoginAt`, return user + tokens.  
   - `issueTokens(userId, email, role)` – return `{ accessToken, refreshToken, expiresIn }`.  
   - Optional: `refresh(refreshToken)` – verify and issue new access token.

4. **Auth middleware** (`server/middleware/auth.middleware.js`)  
   - Read `Authorization: Bearer <token>`, verify JWT, load user (by `id` from payload), set `req.user`.  
   - On invalid/missing token → `401` JSON.

5. **Routes** (`server/routes/auth.routes.js`)  
   - `POST /register` – validate body, call auth service register, return `{ user, token, expiresIn }`.  
   - `POST /login` – validate body, call auth service login, return same shape.  
   - `GET /me` – use auth middleware, return `req.user` (safe fields only).  
   - `GET /verify` – use auth middleware, return `{ valid: true, user }`.  
   - `POST /refresh` – body or cookie with refresh token, return new access token (and optionally new refresh token).  
   - `POST /logout` – 200 OK; frontend clears session; later can blacklist refresh token.

6. **Errors**  
   - 400: validation (e.g. invalid email, short password).  
   - 401: wrong password, invalid/expired token.  
   - 409: email already exists on register.  
   - Use same JSON error shape as rest of API (e.g. `{ error: "message" }`).

---

## 6. Security notes

- Use **HTTPS** in production.  
- Keep **JWT_SECRET** in env only; never in code.  
- Prefer short access token + refresh token; implement refresh rotation later if needed.  
- Rate limit login/register (e.g. `express-rate-limit`) to reduce brute force.  
- On register, respond with the same success shape whether or not email exists (or 409 for “email already registered” depending on product choice).

---

## 7. Files to add/change

| File | Action |
|------|--------|
| `server/package.json` | Add `bcrypt`, `jsonwebtoken` (and optionally `express-validator`) |
| `server/.env.example` | Add `JWT_SECRET`, `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY` |
| `server/services/auth.service.js` | **New** – register, login, issueTokens, (refresh) |
| `server/middleware/auth.middleware.js` | **New** – JWT verify, set `req.user` |
| `server/routes/auth.routes.js` | Wire to auth service and middleware |
| `server/models/User.js` | Optional: add `organization`; ensure `passwordHash` never in JSON |

---

## 8. Role mapping (frontend → backend)

- Frontend `role`: `student` \| `corporate`  
- Backend `User.role`: `student` \| `analyst` \| `admin`  
- Suggested: `student` → `student`, `corporate` → `analyst` (or add `corporate` to User enum if you prefer).

This plan keeps the backend aligned with the current frontend (Register DTO, session shape, endpoints) and leaves OTP/password-reset/2FA for a second phase.
