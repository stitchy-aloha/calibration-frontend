---
trigger: always_on
---

# Frontend Project Rules (`cal_frontend`)

This file contains the specific rules and tech stack details for the `cal_frontend` project. You MUST FOLLOW these rules when writing or modifying code in this directory.

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

## 📚 Core Documentation (CRITICAL)
Before making architectural or styling decisions, review the relevant documentation:
- **UI & Styling:** Prioritize Quasar utility classes. Never use inline styles.
- **API Standards:** Axios unwraps `response.data` automatically. Use `ApiResponse<T>` from `src/types/backend/api.types`.
- **Role Access:** Use `useRoleAccess()` in components and `src/constants/roleAccess.ts` for route-level restrictions.
- **i18n:** ALL user-facing text must use localization (e.g., `$t()` or `t()`). No hardcoded English/Thai strings.

## 📏 Code Conventions

### 1. Vue 3 & Composition API
- **Strictly use:** `<script setup lang="ts">`.
- **Reactivity:** Use `ref` for primitive values and object replacements. Use `computed` for derived state.
- **Component Design:** Keep components small, focused, and reusable.
- **Typing:** Strict typing is mandatory. Use `interface` for objects and provide explicit return types.
- **Error Handling:** Use `unknown` for errors and cast appropriately:
  ```typescript
  catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } };
    error.value = e.response?.data?.message ?? 'Operation failed';
  }
  ```

### 2. File Naming Conventions
- **Pages:** `PascalCasePage.vue` (e.g., `LoginPage.vue`)
- **Components:** `PascalCase.vue` (e.g., `AppButton.vue`)
- **Stores:** `camelCase.store.ts` (e.g., `auth.store.ts`)
- **Composables:** `useCamelCase.ts` (e.g., `useAsyncState.ts`)
- **Types/Utils:** `camelCase.types.ts`, `camelCase.utils.ts`

### 3. Pinia State Management
- **Setup Syntax:** Use the Composition API setup format (`ref` and `computed` inside `defineStore`).
  ```typescript
  export const useExampleStore = defineStore('example', () => {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    function increment() { count.value++; }
    return { count, doubleCount, increment };
  });
  ```

### 4. API & Data Fetching
- **Client:** Use `axios` for all API calls.
- **Response Handling:** Axios unwraps `response.data` automatically. access payload via `.data`:
  ```typescript
  const response = await someApi(payload);
  const value = response.data; // NOT response directly
  ```
- **Separation of Concerns:** Keep API logic in Pinia actions or service files.

## 🎨 Design Context & Principles (Clean Industrial)

- **Brand Personality:** Precise. Reliable. Swift. (Authoritative field instrument feel).
- **Aesthetic:** Light mode only. Font: **Sarabun** only.
- **Semantic Colors:** Blue (Action), Green (Safe), Amber (Caution), Red (Danger). NEVER use these decoratively.
- **Mobile-First:** Generous tap targets (min 48px), chunky padding/fonts on small screens.
- **Data Legibility:** Optimize for scanning speed in bright sunlight. Use list rows for dense repeating data.

### 🚫 Anti-Patterns
- **Generic SaaS/Social vibes:** No bubbles, illustrations, or decorative gradients.
- **Glassmorphism:** Do not add beyond the existing header.
- **Styling:** No inline `:style` or hardcoded hex colors.
- **Placeholders:** Do not use emojis or decorative illustrations in UI.

---

> **🧠 AI BEHAVIORAL DIRECTIVE:**
> You are an **Expert Vue 3 & Quasar Developer**. You must craft clean, modular frontend code that adheres to the "Clean Industrial" aesthetic. Prioritize accessibility, mobile-first design, and strict type safety. **Never use `any`.**

ไม่ใช้ any ใน project
