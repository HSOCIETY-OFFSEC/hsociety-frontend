# BACKEND_REQUIREMENTS.md

# Backend API Requirements for Hsociety

This document specifies the backend API requirements that the Hsociety frontend expects.

## 🔐 Authentication Architecture

### Security Model

- **Token Storage**: httpOnly cookies (NOT in response body or localStorage)
- **Token Types**: 
  - Access Token (short-lived, ~15 minutes)
  - Refresh Token (long-lived, ~7 days)
- **CSRF Protection**: Required for state-changing operations
- **CORS**: Must allow credentials from frontend domain

### Cookie Configuration
```javascript
// Example backend cookie settings
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true, // HTTPS only in production
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

---

## 📡 API Endpoints

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.hsociety.com/api`

### CORS Configuration
```javascript
// Required CORS headers
Access-Control-Allow-Origin: https://hsociety.vercel.app
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-CSRF-Token
```

---

## 🔑 Authentication Endpoints

### POST /api/auth/signup

Register new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (201):
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "pentester",
    "createdAt": "2026-01-31T10:00:00Z"
  }
}
```

**Sets Cookies**: `accessToken`, `refreshToken`

**Error Responses**:
- `400`: Validation error
- `409`: Email already exists

---

### POST /api/auth/login

Authenticate existing user.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response** (200):
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "pentester"
  }
}
```

**Sets Cookies**: `accessToken`, `refreshToken`

**Error Responses**:
- `401`: Invalid credentials
- `403`: Account locked/suspended
- `429`: Too many login attempts

---

### POST /api/auth/logout

End user session.

**Request**: Requires authentication cookie

**Success Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

**Clears Cookies**: `accessToken`, `refreshToken`

---

### GET /api/auth/verify

Verify current session validity.

**Request**: Requires authentication cookie

**Success Response** (200):
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "pentester"
  }
}
```

**Error Responses**:
- `401`: Invalid or expired session

**Usage**: Called on app initialization to restore auth state.

---

### POST /api/auth/refresh

Refresh access token using refresh token.

**Request**: Requires `refreshToken` cookie

**Success Response** (200):
```json
{
  "message": "Token refreshed"
}
```

**Sets Cookies**: New `accessToken`

**Error Responses**:
- `401`: Invalid or expired refresh token

**Usage**: Automatically called by frontend when access token expires.

---

### POST /api/auth/forgot-password

Request password reset.

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "Password reset email sent"
}
```

---

### POST /api/auth/reset-password

Reset password with token.

**Request Body**:
```json
{
  "token": "reset_token_here",
  "password": "NewSecurePass123!"
}
```

**Success Response** (200):
```json
{
  "message": "Password reset successful"
}
```

**Error Responses**:
- `400`: Invalid or expired token
- `422`: Password doesn't meet requirements

---

## 👤 User Management Endpoints

### GET /api/user/profile

Get current user profile.

**Auth Required**: Yes

**Success Response** (200):
```json
{
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "pentester",
    "avatar": "https://cdn.hsociety.com/avatars/user_123.jpg",
    "createdAt": "2026-01-15T08:30:00Z",
    "settings": {
      "notifications": true,
      "theme": "dark"
    }
  }
}
```

---

### PUT /api/user/update

Update user profile.

**Auth Required**: Yes

**Request Body**:
```json
{
  "name": "John Updated",
  "avatar": "https://..."
}
```

**Success Response** (200):
```json
{
  "data": {
    "id": "user_123",
    "name": "John Updated",
    "email": "john@example.com",
    "role": "pentester",
    "avatar": "https://..."
  }
}
```

---

### PUT /api/user/settings

Update user settings.

**Auth Required**: Yes

**Request Body**:
```json
{
  "notifications": false,
  "theme": "light"
}
```

**Success Response** (200):
```json
{
  "data": {
    "notifications": false,
    "theme": "light"
  }
}
```

---

### DELETE /api/user/delete

Delete user account.

**Auth Required**: Yes

**Success Response** (204): No content

---

## 🛡️ Pentest Endpoints

### GET /api/pentests

List all penetration tests.

**Auth Required**: Yes

**Query Parameters**:
- `status` (optional): Filter by status (scheduled, in-progress, completed, cancelled)
- `client` (optional): Filter by client name
- `page` (optional): Page number for pagination
- `limit` (optional): Results per page (default: 20)

**Success Response** (200):
```json
{
  "data": [
    {
      "id": "pentest_1",
      "projectName": "Web Application Security Assessment",
      "client": "TechCorp Inc.",
      "status": "in-progress",
      "severity": "high",
      "startDate": "2026-01-15",
      "endDate": "2026-02-15",
      "assignedTo": "Alice Johnson",
      "assignedToId": "user_123",
      "findings": {
        "critical": 2,
        "high": 5,
        "medium": 8,
        "low": 12
      },
      "progress": 65,
      "createdAt": "2026-01-10T09:00:00Z",
      "updatedAt": "2026-01-30T14:22:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### GET /api/pentests/:id

Get single pentest by ID.

**Auth Required**: Yes

**Success Response** (200):
```json
{
  "data": {
    "id": "pentest_1",
    "projectName": "Web Application Security Assessment",
    "client": "TechCorp Inc.",
    "status": "in-progress",
    "severity": "high",
    "startDate": "2026-01-15",
    "endDate": "2026-02-15",
    "assignedTo": "Alice Johnson",
    "assignedToId": "user_123",
    "findings": {
      "critical": 2,
      "high": 5,
      "medium": 8,
      "low": 12
    },
    "progress": 65,
    "description": "Comprehensive security assessment...",
    "scope": ["Web Application", "API", "Authentication"],
    "createdAt": "2026-01-10T09:00:00Z",
    "updatedAt": "2026-01-30T14:22:00Z"
  }
}
```

**Error Responses**:
- `404`: Pentest not found

---

### POST /api/pentests

Create new pentest.

**Auth Required**: Yes (Admin/Pentester only)

**Request Body**:
```json
{
  "projectName": "Mobile App Security Review",
  "client": "RetailChain Co.",
  "status": "scheduled",
  "severity": "high",
  "startDate": "2026-02-01",
  "endDate": "2026-02-20",
  "assignedToId": "user_456",
  "description": "Security review of mobile application",
  "scope": ["iOS App", "Android App", "Backend API"]
}
```

**Success Response** (201):
```json
{
  "data": {
    "id": "pentest_new",
    "projectName": "Mobile App Security Review",
    "client": "RetailChain Co.",
    "status": "scheduled",
    "severity": "high",
    "startDate": "2026-02-01",
    "endDate": "2026-02-20",
    "assignedTo": "David Brown",
    "assignedToId": "user_456",
    "findings": {
      "critical": 0,
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "progress": 0,
    "createdAt": "2026-01-31T10:00:00Z"
  }
}
```

**Error Responses**:
- `400`: Validation error
- `403`: Insufficient permissions

---

### PUT /api/pentests/:id

Update existing pentest.

**Auth Required**: Yes

**Request Body** (partial update allowed):
```json
{
  "status": "completed",
  "progress": 100,
  "findings": {
    "critical": 3,
    "high": 7,
    "medium": 10,
    "low": 15
  }
}
```

**Success Response** (200):
```json
{
  "data": {
    "id": "pentest_1",
    "projectName": "Web Application Security Assessment",
    "status": "completed",
    "progress": 100,
    "findings": {
      "critical": 3,
      "high": 7,
      "medium": 10,
      "low": 15
    },
    "updatedAt": "2026-01-31T11:00:00Z"
  }
}
```

---

### DELETE /api/pentests/:id

Delete pentest.

**Auth Required**: Yes (Admin only)

**Success Response** (204): No content

**Error Responses**:
- `403`: Insufficient permissions
- `404`: Pentest not found

---

### GET /api/pentests/:id/findings

Get detailed findings for a pentest.

**Auth Required**: Yes

**Success Response** (200):
```json
{
  "data": [
    {
      "id": "finding_1",
      "title": "SQL Injection in Login Form",
      "severity": "critical",
      "category": "injection",
      "cvss": 9.8,
      "description": "The login form is vulnerable to SQL injection...",
      "remediation": "Use parameterized queries...",
      "status": "open",
      "createdAt": "2026-01-20T10:00:00Z"
    }
  ]
}
```

---

## 📋 Task Endpoints

### GET /api/tasks

List all tasks.

**Auth Required**: Yes

**Query Parameters**:
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `assignedTo` (optional): Filter by assigned user ID
- `page` (optional): Page number
- `limit` (optional): Results per page

**Success Response** (200):
```json
{
  "data": [
    {
      "id": "task_1",
      "title": "Complete SQL Injection testing for TechCorp",
      "description": "Test all input fields and API endpoints for SQL injection vulnerabilities",
      "priority": "high",
      "status": "in-progress",
      "assignedTo": "Alice Johnson",
      "assignedToId": "user_123",
      "dueDate": "2026-01-30",
      "project": "Web Application Security Assessment",
      "projectId": "pentest_1",
      "createdAt": "2026-01-15T09:00:00Z",
      "updatedAt": "2026-01-29T16:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 32,
    "totalPages": 2
  }
}
```

---

### GET /api/tasks/:id

Get single task by ID.

**Auth Required**: Yes

**Success Response** (200):
```json
{
  "data": {
    "id": "task_1",
    "title": "Complete SQL Injection testing for TechCorp",
    "description": "Test all input fields and API endpoints for SQL injection vulnerabilities",
    "priority": "high",
    "status": "in-progress",
    "assignedTo": "Alice Johnson",
    "assignedToId": "user_123",
    "dueDate": "2026-01-30",
    "project": "Web Application Security Assessment",
    "projectId": "pentest_1",
    "createdAt": "2026-01-15T09:00:00Z",
    "updatedAt": "2026-01-29T16:30:00Z"
  }
}
```

---

### POST /api/tasks

Create new task.

**Auth Required**: Yes

**Request Body**:
```json
{
  "title": "Review OWASP Top 10 findings",
  "description": "Map identified vulnerabilities to OWASP Top 10 categories",
  "priority": "medium",
  "status": "pending",
  "assignedToId": "user_456",
  "dueDate": "2026-02-05",
  "projectId": "pentest_2"
}
```

**Success Response** (201):
```json
{
  "data": {
    "id": "task_new",
    "title": "Review OWASP Top 10 findings",
    "description": "Map identified vulnerabilities to OWASP Top 10 categories",
    "priority": "medium",
    "status": "pending",
    "assignedTo": "Bob Smith",
    "assignedToId": "user_456",
    "dueDate": "2026-02-05",
    "project": "Network Penetration Test",
    "projectId": "pentest_2",
    "createdAt": "2026-01-31T10:00:00Z"
  }
}
```

---

### PUT /api/tasks/:id

Update existing task.

**Auth Required**: Yes

**Request Body** (partial update allowed):
```json
{
  "status": "completed",
  "priority": "low"
}
```

**Success Response** (200):
```json
{
  "data": {
    "id": "task_1",
    "status": "completed",
    "priority": "low",
    "updatedAt": "2026-01-31T11:00:00Z"
  }
}
```

---

### DELETE /api/tasks/:id

Delete task.

**Auth Required**: Yes

**Success Response** (204): No content

---

### GET /api/tasks/project/:projectId

Get all tasks for a specific project.

**Auth Required**: Yes

**Success Response** (200):
```json
{
  "data": [
    {
      "id": "task_1",
      "title": "Complete SQL Injection testing",
      "status": "in-progress",
      "priority": "high"
    },
    {
      "id": "task_2",
      "title": "Test authentication mechanisms",
      "status": "pending",
      "priority": "critical"
    }
  ]
}
```

---

## 👥 Team Management (Future)

### GET /api/team/members

List team members.

### POST /api/team/invite

Invite new team member.

### DELETE /api/team/remove/:userId

Remove team member.

---

## 📊 Analytics (Future)

### GET /api/analytics/dashboard

Get dashboard statistics.

### GET /api/analytics/reports

List generated reports.

---

## ⚠️ Error Response Format

All error responses follow this format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## 🔒 Security Requirements

### Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **API endpoints**: 100 requests per minute per user
- **Upload endpoints**: 10 requests per hour per user

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### Token Expiry

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days
- **Password Reset Token**: 1 hour

---

## 📝 Additional Notes

### Pagination

Default pagination values:
- `limit`: 20
- `maxLimit`: 100

### Date Format

All dates in ISO 8601 format: `2026-01-31T10:00:00Z`

### File Uploads

Maximum file size: 10MB

Allowed file types:
- Images: jpeg, png, gif
- Documents: pdf, doc, docx, txt

---

**Last Updated**: January 31, 2026
**API Version**: 1.0.0