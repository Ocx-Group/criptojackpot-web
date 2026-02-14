# Copilot Instructions for CriptoJackpot App

## Project Overview

A **Next.js 15 (App Router)** lottery/giveaway platform with TypeScript, featuring public lottery browsing, user authentication, and admin management panels.

## Architecture

### Route Groups (App Router)

- `(public)/` - Public pages: login, register, landing pages (no auth required)
- `(user-panel)/` - Authenticated user dashboard (requires `client` role)
- `(admin-panel)/` - Admin dashboard (requires `admin` role)

Each protected layout wraps content with `<AuthGuard requireAuth={true} requiredRole="...">`.

### Services (Singleton Instances)

All services are exported as singleton instances from `src/services/index.ts`. Import them directly:

```typescript
import { lotteryService, authService } from '@/services';
const lottery = await lotteryService.getLotteryById(id);
```

### State Management

- **Zustand stores** in `src/store/` with localStorage persistence (`authStore`, `notificationStore`)
- **TanStack Query** for server state - all API calls use `useQuery`/`useMutation` hooks

### Service Layer Pattern

All services extend `BaseService` which provides:

- Axios client with interceptors (auth token, language header)
- Auto-logout on 401 responses
- Generic CRUD methods: `getAll`, `getAllPaginated`, `getById`, `create`, `update`, `delete`

Create new services following this pattern:

```typescript
class MyService extends BaseService {
  protected override endpoint = 'my-endpoint';

  constructor() {
    super('/api/v1');
  }
  // Custom methods use inherited CRUD methods
}

export { MyService };
```

Then add a singleton instance in `src/services/index.ts`:

```typescript
export const myService = new MyService();
```

## Feature Module Structure

Features in `src/features/{feature-name}/` contain:

- `components/` - Feature-specific React components
- `hooks/` - Custom hooks using TanStack Query + service instances
- `types/` - TypeScript interfaces
- `validators/` - Form validation functions

Example hook pattern (see `useLoginForm.ts`):

```typescript
import { myService } from '@/services';

const mutation = useMutation({
  mutationFn: data => myService.create(data),
  onSuccess: () => showNotification('success', t('KEY'), ''),
  onError: () => showNotification('error', t('ERROR_KEY'), ''),
});
```

## Conventions

### Imports

- Use `@/` path alias for `src/` directory
- Public assets: `@/../public/images/...`

### Internationalization

- Use `react-i18next` with `useTranslation()` hook
- Translations in `src/locales/{en,es}.json`
- Default language: Spanish (`es`)

### Notifications

```typescript
const showNotification = useNotificationStore(state => state.show);
showNotification('success' | 'error' | 'warning' | 'info', title, message);
```

### Styling

- Bootstrap 5 + custom SCSS in `src/styles/scss/`
- Use Bootstrap utility classes (e.g., `pt-120`, `pb-120`, `radius24`)
- Icons: `@phosphor-icons/react` and `lucide-react`

### API Response Format

Backend returns standardized responses:

```typescript
interface Response<T> {
  success: boolean;
  code: number;
  data?: T;
  message?: string;
}
interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}
```

## Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint check
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (required)
