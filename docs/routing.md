# Routing & Navigation Convention

มาตรฐานการจัดการโครงสร้าง URL เส้นทาง (Routes) และการควบคุมการเปลี่ยนหน้า (Navigation Guards) ในแอปพลิเคชัน Vue 3 + Quasar

---

## 1. การกำหนดค่าเส้นทาง (Route Definitions)

เส้นทางทั้งหมดต้องระบุใน `src/router/routes.ts` โดยปฏิบัติตามกฎดังนี้:

- **Lazy Loading (P0):** ทุกหน้าเพจต้องใช้ Lazy Loading (Dynamic Import) เพื่อเพิ่มประสิทธิภาพการโหลดและลดขนาด Bundle ของโปรเจกต์
- **Metadata Protection:** ข้อมูลเพิ่มเติมเกี่ยวกับความปลอดภัยต้องระบุไว้ที่ออบเจกต์ `meta`

### 🛠️ ตัวอย่างการเขียน `routes.ts`
```typescript
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'equipment',
        name: 'EquipmentList',
        component: () => import('pages/equipment/EquipmentListPage.vue'),
        meta: {
          requiresAuth: true,
          roles: ['Admin', 'Technician', 'Approver']
        }
      },
      {
        path: 'admin/settings',
        name: 'AdminSettings',
        component: () => import('pages/admin/SettingsPage.vue'),
        meta: {
          requiresAuth: true,
          roles: ['Admin']
        }
      }
    ]
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('pages/ErrorUnauthorized.vue')
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
```

---

## 2. ระบบตรวจสอบสิทธิ์ก่อนเข้าสู่หน้าเพจ (Navigation Guards)

เพื่อป้องกันไม่ให้ผู้ใช้สิทธิ์ไม่พึงประสงค์เข้าถึงเพจที่ถูกจำกัด ให้เขียน Logic การจัดการสิทธิ์ใน `router.beforeEach` ดังนี้:

```typescript
// src/router/index.ts
import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

export default route(function () {
  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(process.env.VUE_ROUTER_BASE)
  });

  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.userRole;

    // 1. ตรวจสอบว่าหน้านี้ต้องการการล็อกอินหรือไม่
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'Login' });
      return;
    }

    // 2. ตรวจสอบว่าผู้ใช้มีบทบาท (Role) ตรงตามที่ระบุไว้หรือไม่
    if (to.meta.roles && !to.meta.roles.includes(userRole)) {
      // นำทางไปยังหน้าจำกัดสิทธิ์ (Unauthorized)
      next({ name: 'Unauthorized' });
      return;
    }

    // 3. ผ่านการตรวจสอบทั้งหมด นำทางไปยังหน้าปลายทาง
    next();
  });

  return router;
});
```
