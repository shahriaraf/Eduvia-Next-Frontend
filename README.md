# Eduvia — Student Management Dashboard (Frontend)

Frontend for the Student Management Dashboard technical assignment, built with
**Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, and
**Redux Toolkit**.

## 1. Stack & Why

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Required by the assignment |
| Language | TypeScript | Required by the assignment |
| Styling | Tailwind CSS v4 | Required by the assignment |
| State | Redux Toolkit + RTK Query | Required by the assignment. RTK Query owns server data (fetching/caching/loading/error/cache invalidation on mutations); a small `studentFiltersSlice` owns local UI state (search/filter/sort/pagination) — see §2 for why that split. |
| Component primitives | Radix UI (`react-dialog`, `react-select`, `react-toast`, `react-alert-dialog`, `react-label`, `react-slot`) | Accessible interaction mechanics (focus trapping, keyboard nav, ARIA) for the modal, dropdowns, and toasts — mature and stable, so we're not hand-rolling that logic. |
| Component styling | Original components in `components/ui/`, styled with Tailwind + CSS-variable design tokens | No external design-system dependency (see note below on Astryx). |
| Forms | `react-hook-form` + `zod` | Typed validation schema (`studentSchema.ts`) mirrored field-for-field from the backend's DTOs. |
| Icons | `lucide-react` | Consistent line-icon set. |
| Theme | `next-themes` | Light/dark mode, persisted, no flash of wrong theme. |

**A note on Astryx:** the initial direction considered Meta's Astryx design
system as the component library. It was evaluated and *not* added as a
dependency — as a public beta (~7 weeks old at the time), it had already
shipped breaking prop-level changes in patch releases, which is a real risk
for a submission that needs to build reliably on a reviewer's machine.
Instead, `components/ui/` is a small original component library in Astryx's
visual language (clean neutral surfaces, restrained radii, token-driven
color), built on Radix primitives for the accessibility mechanics rather
than reinventing them.

## 2. Architecture

```
src/
  app/                        Next.js App Router pages
    layout.tsx                 Root layout: providers, header, toaster
    page.tsx                   Redirects to /students
    students/page.tsx          Student list: search, filter, sort, paginate
    students/[id]/page.tsx     Student details (bonus feature)
  components/
    ui/                        Original component library (Button, Input, Select,
                                Table, Dialog, AlertDialog, Toast, Badge, Card, …)
    layout/                    App shell pieces (header, theme toggle)
    providers/                 Theme + Redux providers
  features/students/
    types.ts                   Types mirroring the backend entity/DTOs
    studentSchema.ts           Zod validation schema (mirrors backend DTO rules)
    studentsApi.ts              RTK Query endpoints (list/get/create/update/delete)
    studentFiltersSlice.ts     Redux slice: search/filter/sort/pagination UI state
    components/                Feature components (form dialog, delete dialog,
                                filter bar, table, pagination)
  store/
    index.ts                   Redux store configuration
    hooks.ts                   Typed useAppDispatch/useAppSelector
    api.ts                     Base RTK Query API instance + error-message helper
  lib/
    utils.ts                   cn() className helper
    use-debounced-value.ts     Debounce hook (used by the search input)
```

**Why Redux holds filters but not student data:** RTK Query already solves
loading/error/caching/invalidation correctly for server data — duplicating
that in a slice would just create a second, easily-desynced source of
truth. What *does* belong in Redux is the list's search/filter/sort/page
state, since several actions (changing a filter, searching) need to reset
the page number together, and centralizing that in one reducer beats
scattering `setPage(1)` calls next to every setter.

## 3. Requirements

- Node.js 20+
- npm 10+
- The backend running (see the backend README) — this app is a pure client
  for that API and has no server-side data layer of its own.

## 4. Installation

```bash
npm install
```

## 5. Environment Variables

```bash
cp .env.local.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API, e.g. `http://localhost:4000/api` |

## 6. Running the Application

```bash
npm run dev
```

The app runs at `http://localhost:3000`. Make sure the backend is running
and `NEXT_PUBLIC_API_URL` points to it (and that the backend's `CORS_ORIGIN`
includes `http://localhost:3000`).

## 7. Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |

## 8. Features Implemented

Everything in the assignment's core spec (view/search/filter/add/edit/delete
students, validation with inline error messages, loading/empty/error states,
responsive layout), plus these bonus items:

- **Pagination** and **sorting** (name, class, created date) on the student list
- **Debounced search** (350ms) so the API isn't called on every keystroke
- **Student Details page** (`/students/:id`)
- **API documentation** is on the backend (Swagger at `/docs`) — nothing to
  duplicate here

Not implemented: authentication (explicitly out of scope in the assignment).

## 9. Design Notes

- **Toasts** for every create/update/delete outcome (success and failure),
  built on Radix's Toast primitive with our own success/error/warning/info
  styling — this was a specific preference for the project.
- **Optimistic UX without optimistic updates**: mutations show a loading
  state on their trigger (spinner in the button) rather than assuming
  success and rolling back on failure — simpler to reason about correctly
  for a small admin table, at the cost of a beat of latency the user can see.
- **Accessibility**: every form field has a real `<label>` wired via
  `htmlFor`/`id`, validation errors are announced via `role="alert"` and
  `aria-describedby`, and the modal/dropdown/toast interactions all come
  from Radix's tested ARIA implementations rather than custom keyboard
  handling.
- **Responsive**: the layout, filter bar, and table are usable down to a
  narrow mobile viewport (the table scrolls horizontally rather than
  overflowing the page).
