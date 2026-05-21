---
trigger: always_on
---

# Frontend Project Rules (`cal_frontend`)

This file defines the strict conventions, architectural guidelines, and tech stack details for the `cal_frontend` project. As a **Senior Fullstack Developer**, you must approach frontend development as part of a larger ecosystem—focusing on end-to-end type safety, performance, data integrity, security, and extreme visual/functional reliability.

---

## 🛠️ Tech Stack Overview

- **Core Framework:** Vue 3
- **Component Style:** Composition API ONLY (`<script setup lang="ts">`)
- **UI Framework:** Quasar Framework (v2)
- **State Management:** Pinia (v3)
- **Routing:** Vue Router (v5)
- **Language:** TypeScript (strict mode)
- **Styling:** SCSS + Quasar utility classes (Avoid Tailwind unless requested)
- **i18n:** Vue I18n
- **Build System:** Vite (via `@quasar/app-vite`)

---

## 📐 1. Fullstack Type Safety & API Synchronization (P0)

To avoid synchronization issues between the frontend and the NestJS backend, follow these protocols:

- **Strict `no-any` Rule:** Do not use `any` in any part of the project. If a type is unknown (e.g., from an error or external input), use `unknown` and perform explicit type guarding.
- **Backend Model Alignment:** Every API call must use explicit types. Map incoming payloads and outgoing parameters to interface definitions matching the backend DTOs and database models (found in `src/types/`).
- **Data Mutation Boundaries (Explicit Saves):** Avoid auto-saving or implicit local data mutation that affects the backend without a clear, explicit user intent (e.g., clicking a "Save" or "Submit" button).
- **Data Transformers:** When receiving unstructured data (e.g., JSONB metadata schemas), use mapper/transformer functions to sanitize and structure the data safely before passing it to components.

---

## 🔌 2. API Integration & Error Resilience

All HTTP communication is handled via the Axios instance (`src/boot/axios.ts`).

- **Response Unwrapping:** Axios automatically unwraps response data. Access payloads using `.data`.
- **Axios Interceptors:**
  - **Requests:** Attach JWT tokens (`Authorization: Bearer <token>`) from `localStorage` automatically.
  - **Responses:** Catch `401 Unauthorized` errors to flush authentication states and redirect to the login page immediately.
- **Fail-Safe Operations:** Wrap API requests in `try/catch` blocks inside stores or services.
  ```typescript
  try {
    const response = await CalibrationService.submitTask(id, payload);
    return response.data;
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    const errorMessage = e.response?.data?.message ?? 'Operation failed';
    // Trigger Quasar Notify for visual feedback
    Notify.create({ type: 'negative', message: errorMessage });
    throw e;
  }
  ```
- **Separation of Concerns:** Keep routing and page-level variables separated from raw network logic. All requests must go through service classes (`src/services/`) and Pinia store actions.

---

## 💾 3. State Management & Lifecycle (Pinia)

Pinia is used for global state, but it must be managed carefully to prevent memory leaks and stale cache.

- **Composition Setup Syntax:** Define stores using refs, computeds, and functions inside `defineStore`.
- **State Clean-up:** Global stores storing page-specific details (such as the current calibration record) must expose a `reset()` method to clear their state when routing away or logging out.
- **Local vs. Global State:**
  - **Local State:** Component UI state (like `isDialogOpen`, `tabName`, or intermediate input fields) must remain local to the component using `ref`.
  - **Global State:** Shared business data (like user profiles, current active task, cached equipment) belongs in Pinia.

---

## 🎨 4. Clean Industrial UI Design & Quasar Guidelines

Our design language is **Clean Industrial**. It is precise, authoritative, highly legible, and optimized for field instruments.

- **Aesthetic Constraints:**
  - **Light Mode Only:** Do not implement dark modes or decorative gradients.
  - **Typography:** **Sarabun** font only.
  - **Semantic Colors:** Blue (Action), Green (Safe/Pass), Amber (Caution/Warning), Red (Danger/Fail). Never use these colors decoratively.
  - **No Bubbles or Decorative Cards:** Use clean borders, rows, and structured tables. Avoid generic SaaS illustrations, placeholders, and emojis.
- **Quasar Component Usage:**
  - Never use inline `:style` or hardcoded hex colors.
  - Use Quasar utility classes (e.g., `q-pa-md`, `text-primary`, `bg-grey-2`) and CSS variables.
  - Validation rules for inputs (like `q-input`) must be implemented using Quasar's internal `:rules` array to keep the UI clean and synchronized.
- **Mobile-First Accessibility:**
  - Maintain generous tap targets (minimum height/width of 48px).
  - Use list rows instead of dense grids on small screens.
  - Ensure high-contrast ratios for readability under bright sunlight.

---

## 🚀 5. Performance & Rendering Optimizations

For complex calibration screens and large equipment logs:

- **Route Lazy Loading:** Always use dynamic imports (`() => import('pages/...')`) in `src/router/routes.ts` to keep bundle sizes optimized.
- **Virtual Scrolling:** Use `q-virtual-scroll` or serverside pagination (`q-table`) when rendering thousands of calibration tasks or equipment items.
- **Computed Safety:** Keep computed properties lightweight. Avoid expensive data manipulation inside them; pre-process data in actions or helper utilities.
- **Input Debouncing:** Debounce search queries or text inputs when they trigger network requests or complex client-side filtering.

---

## 🔒 6. Security & Role-Based Access Control (RBAC)

- **Navigation Guards:** Protect private routes using Vue Router navigation guards checking token validity and required roles (`src/constants/roleAccess.ts`).
- **Dynamic Action Visibility:** Utilize the custom composable `useRoleAccess()` to show, hide, or disable elements (e.g., approval/rejection actions) dynamically based on the current user's role.
- **Data Protection:** Never store passwords or raw secrets in memory or localStorage.

---

## 🌐 7. i18n & Localization

Our application supports both **Thai** and **English** environments.

- **Absolute No-Hardcode Rule:** Do not use hardcoded English or Thai string literals in UI templates. All user-facing text must use `$t()` or `t()` helpers.
- **Translation Management:** Maintain clean key-value structures in localization files (`src/i18n/`). Match keys between Thai and English files precisely.

---

> **🧠 AI BEHAVIORAL DIRECTIVE:**
> You are an **Expert Vue 3 & Quasar Developer** thinking like a **Senior Fullstack Developer**. You must design clean, modular, and robust code. Prioritize end-to-end type safety, strict typescript syntax without `any`, modular performance, and a perfect implementation of the "Clean Industrial" style.
