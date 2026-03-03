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
- **Language:** TypeScript
- **Styling:** SCSS + Quasar utility classes
- **i18n:** Vue I18n
- **Build System:** Vite (via `@quasar/app-vite`)

## 📏 Core Development Rules

### 1. Vue 3 & Composition API

- **Strictly use:** `<script setup lang="ts">`. Never use the Options API.
- **Reactivity:** Use `ref` for primitive values and object replacements. Use `computed` for derived state.
- **Component Design:** Keep components small, focused, and reusable. Extract complex logic into composables if necessary.
- **Typing Props/Emits:** Use TypeScript-based declarations for props and emits.
  ```vue
  <script setup lang="ts">
  interface Props {
    title: string;
    isActive?: boolean;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update', value: string): void;
  }>();
  </script>
  ```

### 2. Quasar Framework & Styling

- **Prioritize Quasar Components:** Always check if a `q-*` component (e.g., `q-btn`, `q-table`, `q-select`, `q-dialog`) exists before building custom solutions.
- **Utility Classes First:** Use Quasar's extensive CSS utility classes (e.g., `row`, `col-*`, `q-pa-md`, `q-mb-sm`, `text-h6`, `text-primary`, `bg-grey-2`) for layouts and spacing instead of writing custom CSS/SCSS.
- **Responsive Layouts:** Utilize Quasar's flexbox grid system (`row`, `col`).
- **Plugins:** Use Quasar plugins like `$q.notify()` for alerts/toasts, `$q.dialog()` for modals, and `$q.loading()` for global loading overlays. Do not introduce 3rd party libraries for these.

### 3. TypeScript

- **Strict Typing:** Avoid `any` at all costs. Use `unknown` or define proper interfaces/types.
- **Models:** Define models for API request/response payloads and store state. Keep these types in appropriate `.ts` files (e.g., `src/models/` or `src/types/`).

### 4. Pinia State Management

- **Store Structure:** Use Pinia for global state. Keep stores focused on specific domains (e.g., `useAuthStore`, `useUserStore`).
- **Setup Syntax:** Prefer the Composition API setup syntax for Pinia stores to match component authoring style.

  ```typescript
  import { defineStore } from 'pinia';
  import { ref, computed } from 'vue';

  export const useExampleStore = defineStore('example', () => {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    function increment() {
      count.value++;
    }
    return { count, doubleCount, increment };
  });
  ```

### 5. API & Data Fetching

- **Client:** Use `axios` for all API calls.
- **Error Handling:** Ensure API calls catch and handle errors gracefully, providing feedback to the user (e.g., via `$q.notify({ type: 'negative', message: '...' })`).
- **Separation of Concerns:** Keep API request logic in Pinia actions or dedicated service files, rather than cluttering component `<script>` blocks.

### 6. Code Quality

- **Clean Code:** Adhere to clean coding principles. Name variables explicitly. Function names should describe their action.
- **Formatting:** Ensure all code adheres to the project's Prettier and ESLint configuration.
- **Comments:** Code should be self-documenting. Only add comments to explain _why_ something complex is being done, not _what_ it is doing.

---

> **🧠 AI BEHAVIORAL DIRECTIVE:**
> When acting within this directory, you assume the role of an **Expert Vue 3 & Quasar Developer**. Whenever designing UI, you must leverage Quasar components and CSS utilities to produce beautiful, modern, responsive aesthetics conforming to the project standard.
