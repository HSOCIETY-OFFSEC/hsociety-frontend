# HSociety Frontend Architecture

## Folder Conventions

### `src/features/`
Domain-scoped feature modules. Each folder owns its pages, components, services, and contracts.
CSS for features lives in `src/styles/features/<feature-name>/`.

### `src/shared/`
Cross-cutting code used by 2+ features.
- `components/` — reusable UI primitives and layout shells
- `hooks/` — custom React hooks
- `utils/` — pure utility functions, grouped by concern:
  - `auth/` — auth modal helpers
  - `display/` — avatar, badges, slugify
  - `errors/` — error formatting
  - (root) — date, sanitize, navigation, constants, helpers

### `src/styles/`
All CSS lives here, never co-located with components (exception: shared/ui primitives like PasswordInput.css).
- `base/` — app-wide reset, layout primitives, global UI tokens
- `components/` — styles for shared UI and layout components
- `features/` — styles for feature pages (one subfolder per feature)
- `landing/` — landing page section styles
- `dashboards/` — dashboard-specific styles (admin, corporate, student, pentester)
- `student/` — student workspace styles

### `src/data/`
- `static/` — pure JSON data files (no imports, no logic)
- Named subfolders — JS modules that may contain logic or transformations

### CSS Co-location Rule
Shared UI primitives (Button, Input, etc.) MAY co-locate their CSS.
All other CSS must live in `src/styles/`.

### Import Alias (recommended)
Configure `@/*` to resolve to `src/*` in `vite.config.js` to eliminate `../../../` chains.
