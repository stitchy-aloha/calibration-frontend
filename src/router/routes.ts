import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/FullScreen.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },
  {
    path: '/director-dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DirectorDashboardPage.vue') }],
  },
  {
    path: '/ward',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/WardPage.vue') }],
  },
  {
    path: '/schedule',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SchedulePage.vue') }],
  },
  {
    path: '/approval',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ApprovalsPage.vue') }],
  },
  {
    path: '/approval/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ApprovalDetailPage.vue') }],
  },
  {
    path: '/tools',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ToolsPage.vue') }],
  },
  {
    path: '/tools/manage',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ToolManagementPage.vue') }],
  },
  {
    path: '/tools/config/:name',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ToolConfigPage.vue') }],
  },
  {
    path: '/calibration',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CalibrationPage.vue') }],
  },
  {
    path: '/calibration/inspection/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ExternalInspectionPage.vue') }],
  },
  {
    path: '/calibration/record/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CalibrationRecordPage.vue') }],
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UsersPage.vue') }],
  },
  {
    path: '/departments',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/DepartmentsPage.vue') }],
  },
  {
    path: '/history',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HistoryPage.vue') }],
  },
  {
    path: '/cer-view',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CerViewPage.vue') }],
  },
  {
    path: '/status/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PublicStatusPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
