# Student User Flow (UI-Based)

```mermaid
flowchart TD
  %% Legend
  %% [Process]  {Decision}  ((Start/End))

  Start((Start)) --> A[Landing /]
  A --> B{Authenticated?}

  B -- No --> C[Login /login]
  C --> D{2FA required?}
  D -- Yes --> E[Enter 2FA code]
  E --> F[Student Dashboard /student-dashboard]
  D -- No --> F

  B -- Yes --> F

  %% Student Dashboard
  F --> G[Go to Learning Path /student-learning]
  F --> H[Resources Hub /student-resources]
  F --> I[Register for Bootcamp /student-bootcamp]
  F --> J[Complete Payment /student-payments]
  F --> K[Community /community]
  F --> L[Account Settings /settings]
  F --> M[Logout]

  %% Bootcamp Registration
  I --> N{Registered?}
  N -- No --> O[Submit registration form]
  O --> P[Registered]
  N -- Yes --> P

  %% Payment
  J --> Q{Registered?}
  Q -- No --> I
  Q -- Yes --> R[Open Payment Modal]
  R --> S{Method?}
  S -- BTC --> T[Submit BTC tx hash]
  S -- MOMO/TELCEL/Bank --> U[Redirect to Paystack]
  T --> V[Payment Pending/Verified]
  U --> V

  %% Learning Path
  G --> W{Registered?}
  W -- No --> I
  W -- Yes --> X{Paid?}
  X -- No --> J
  X -- Yes --> Y[Bootcamp Modules Grid]
  Y --> Z{Previous module complete?}
  Z -- No --> AA[Show status message]
  Z -- Yes --> AB[Open first room]
  AB --> AC[Lesson /student-learning/module/:moduleId/room/:roomId]

  %% Course Learning (within Learning Path)
  Y --> AD[Course Learning Section]
  AD --> AE[View resources per room]
  AD --> AF[Take room quiz]
  AD --> AG[Start practical exercise (CTF) after rooms]
  AD --> AH[Module check-in quiz]

  %% Lesson Page
  AC --> AI[Back to Learning Path]
  AC --> AJ[Switch room within module]
  AC --> AK[Switch module if previous complete]
  AC --> AL[Mark room complete (local)]

  %% Resources
  H --> AM{Paid?}
  AM -- No --> J
  AM -- Yes --> AN[Open playbooks / readings / tooling]

  %% Quiz Material
  AQ[Quiz Material /student-quiz-material] --> AR{Paid?}
  AR -- No --> J
  AR -- Yes --> AS[Start check-ins / skill validation]

  %% Community & Settings
  K --> AT[Community hub]
  L --> AU[Profile / Account Settings]

  %% Role Blocking
  AV[Attempt non-student route] --> AW[Access Restricted Modal]
  AW --> F

  M --> End((End))
```
