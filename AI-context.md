# AI Context & Starter Template Guide

This document defines the architecture, styling guidelines, folder structure, UI component patterns, and coding conventions for this Next.js project. It serves as a source of truth for both developers and AI assistants to maintain consistency when building features or upgrading the template.

---

## 1. Project Goal & Design Philosophy

- **Goal**: A clean, reusable, frontend-only Next.js template. It acts as a baseline template for all future projects.
- **Backend Mocking**: The template operates entirely offline. All API endpoints and network fetches are commented out and replaced with local mock data (e.g. in `AuthProvider.jsx`, `login/page.js`, `sidebar.js`, `auth.js`, etc.).
- **Branding**: Replaced all product-specific branding ("Elite ERP") with generic placeholders ("App Template", "App") to ensure clean reusability.
- **UI/UX Excellence**: High-contrast, premium, responsive layouts using HSL tailormade colors, smooth gradients, subtle glow cards, glassmorphic toast notifications, and interactive slide-out panels.

---

## 2. Directory Structure

```
├── .env.example            # Environment configurations (NEXT_PUBLIC_API_URL)
├── jsconfig.json           # Absolute imports mapping (@/* -> src/*)
├── package.json            # Dependencies (Next 16, React 19, HeroUI, Tailwind v4, Zustand)
├── src/
│   ├── app/                # Next.js App Router (Grouped layouts)
│   │   ├── (auth)/         # Authenticated routes inheriting the Sidebar layout
│   │   │   ├── dashboard/  # Main overview dashboard
│   │   │   ├── demo-table/ # Example searchable/sortable data table
│   │   │   ├── component-showcase/ # UI Component Playground
│   │   │   └── layout.js   # Main application dashboard shell
│   │   ├── (without-auth)/ # Unauthenticated public routes
│   │   │   └── login/      # Auth login screen
│   │   ├── globals.css     # Tailwind v4 variables, theme overrides, utility utilities
│   │   ├── layout.js       # App entry root layout
│   │   └── not-found.js    # Custom 404 page
│   ├── components/
│   │   ├── form/           # Form validation demos and patterns (demo-form.js)
│   │   ├── icon/           # Iconify Solar duotone wrapper library (icons.js)
│   │   └── ui/             # Core reusable component library
│   ├── hooks/              # Custom React hooks (useTranslation, useTableState, useAuth, etc.)
│   ├── lib/                # Internal modules (axios, permission rules, i18n, queryClient)
│   ├── locales/            # Dictionary resource files (en.json, fr.json)
│   ├── providers/          # React Context Providers (AuthProvider)
│   └── store/              # Zustand global state stores (authStore)
```

---

## 3. Styling & Theming Guidelines

### Tailwind CSS v4 & Color System
The project uses Tailwind CSS v4. Colors, border radius, spacing, shadows, and transitions are defined as CSS variables inside `src/app/globals.css`.

- **Base Colors**: `--color-bg`, `--color-surface`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`.
- **Button Variants**: Primary (`--color-btn-primary`), Secondary (`--color-btn-secondary`), Danger (red HSL), and respective hover/active state variations.
- **Visual Utilities**:
  - `card-premium`: Simple light border with a subtle shadow (`box-shadow: var(--shadow-sm)`).
  - `animate-fade-in-up`: Clean sliding fade-in animation for page layouts and modal entries.
  - `no-scrollbar`: Utility to hide default browser scrollbars.

### Dark Mode
- Dark mode is managed by appending the `.dark` class to the `html` element.
- Transition state changes (`color`, `background-color`) smoothly using standard transitions.

---

## 4. UI Component Library reference

The core components are located in `src/components/ui/`. Import them using the `@/components/ui/...` alias.

### 1. `AppButton` (`button.js`)
A wrappers around HeroUI's `Button` supporting states, sizes, and icons.
```javascript
import AppButton from "@/components/ui/button";

<AppButton
  name="Save Changes"
  variant="primary"        // "primary" | "secondary" | "danger"
  size="lg"               // "sm" | "md" | "lg"
  loading={false}         // Triggers a loader and disables clicking
  startIcon={<SaveIcon />}
  onClick={handleSave}
/>
```

### 2. `AppInput` (`input.js`)
An accessible input field with integrated form validation hookups, prefix icons, and description/error helpers.
```javascript
import AppInput from "@/components/ui/input";

<AppInput
  name="email"
  label="Email Address"
  placeholder="name@example.com"
  value={email}
  onChange={setEmail}
  errors={errors}         // Accepts react-hook-form errors object
  required
/>
```

### 3. `AppSections` (`select.js`)
A custom dropdown selector supporting single/multiple selections and option sections.
```javascript
import AppSections from "@/components/ui/select";

<AppSections
  name="role"
  label="User Role"
  placeholder="Select a role..."
  items={[{ id: "admin", label: "Admin" }, { id: "editor", label: "Editor" }]}
  selectedKey={role}
  onChange={(e) => setRole(e.target.value)}
/>
```

### 4. `AppCheckbox` & `AppSwitch` (`checkbox.js` / `switch.js`)
Custom Boolean inputs styled for premium looks.
```javascript
import AppCheckbox from "@/components/ui/checkbox";
import AppSwitch from "@/components/ui/switch";

<AppCheckbox
  name="agree"
  label="Accept terms"
  isSelected={agreed}
  onChange={setAgreed}
/>

<AppSwitch isSelected={enabled} onChange={setEnabled}>
  <span>Enable Notifications</span>
</AppSwitch>
```

### 5. `AppTable` (`table.js`)
A highly generic data table that coordinates with `useTableState` for searching, pagination, sorting, and column visibility.
```javascript
import AppTable from "@/components/ui/table";

<AppTable
  title="Users"
  items={paginatedItems}
  TableColumns={columns}
  renderCell={renderCell}
  actions={handleAction}
  searchText={tableState.search}
  pagination={{
    currentPage: tableState.pagination.currentPage,
    totalPages: tableState.pagination.totalPages,
    totalRows: tableState.pagination.totalRows,
  }}
  sort={tableState.sort}
/>
```

### 6. Overlays & Modals (`confirmModal.js`, `deleteModal.js`, `drawer.js`)
- **`AppConfirmModal`**: Action confirmations.
- **`AppDeleteModal`**: Pre-styled warning modal for deletions.
- **`AppDrawer`**: Right-hand panel for side-by-side editing.
```javascript
import AppConfirmModal from "@/components/ui/confirmModal";
import AppDrawer from "@/components/ui/drawer";

// Modal
<AppConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="Approve Action"
/>

// Drawer
<AppDrawer
  title="Settings"
  toggle={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  footer={<Button name="Save" />}
>
  <p>Content goes here</p>
</AppDrawer>
```

### 7. Form Validation Pattern (`src/components/form/demo-form.js`)
Demonstrates how to integrate `react-hook-form` and `yup` validation schemas with core inputs (`AppInput`, `AppSections`, `AppCheckbox`):
```javascript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object().shape({
  fullName: Yup.string().required("Required"),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema)
});

<AppInput name="fullName" register={register} errors={errors} />
```

---

## 5. Coding & Integration Conventions

When writing new features, follow these practices:

1. **API Mocking**: Never write live axios or fetch integrations directly in page views. Mock all responses inside hooks, stores, or providers. Keep active fetch requests commented out as reference for future developers.
2. **Localization**: All text elements (titles, table headers, descriptions, buttons) should fetch values from local JSON files via the `useTranslation` hook. Do not hardcode raw strings in views.
   - Edit [en.json](file:///d:/Test/nextjs-folder/src/locales/en.json) and [fr.json](file:///d:/Test/nextjs-folder/src/locales/fr.json) concurrently.
3. **Icons**: Centralize all icon usages by importing them from `@/components/icon/icons` (which wraps Iconify). If a new icon is needed, define it at the bottom of `src/components/icon/icons.js` using `createIcon("solar:...")`.
4. **Navigation Indexing**:
   - When adding a route, update `SIDEBAR_ITEMS` in `src/components/ui/sidebar.js`.
   - Update `QUICK_NAV_ITEMS` in `src/components/ui/search.js` so it is indexed in the Topbar search.
5. **State Management**:
   - Use **Zustand** (`src/store/`) for global states (e.g. theme, language, auth state).
   - Use local states or react-hook-form for view-level transient forms.
6. **Strict React 19 rules**: Never call `setState` directly inside the render phase. Always wrap state synchronizations in `useEffect` to prevent re-render limits.
7. **Validation Schemas**: All form validation schemas (Yup schemas) must be stored inside the `src/schema/` directory (e.g., `common.schema.js`, `login.schema.js`, `demo.schema.js`, `document.schema.js`). Avoid inline schemas; import them into components/views where they are required.

