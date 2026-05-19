import type { EssentialLinkProps } from 'src/components/EssentialLink.vue';

export const ALL_NAV_LINKS: EssentialLinkProps[] = [
  { title: 'หน้าหลัก', caption: 'Home Page', icon: 'app:home', link: '/dashboard' },
  {
    title: 'แดชบอร์ดผู้บริหาร',
    caption: 'Executive Dashboard',
    icon: 'app:home',
    link: '/director-dashboard',
  },
  {
    title: 'แผนการสอบเทียบ',
    caption: 'Calibration Schedule',
    icon: 'calendar_month',
    link: '/schedule',
  },
  { title: 'จัดการวอร์ด', caption: 'Ward Management', icon: 'location_on', link: '/ward' },
  {
    title: 'บันทึกการสอบเทียบ',
    caption: 'Calibration Records',
    icon: 'app:note',
    link: '/calibration',
  },
  {
    title: 'รับรองการสอบเทียบ',
    caption: 'Calibration Approval',
    icon: 'app:appr',
    link: '/approval',
  },
  { title: 'เครื่องมือแพทย์', caption: 'Medical Tools', icon: 'vaccines', link: '/tools' },
  {
    title: 'จัดการเครื่องมือ',
    caption: 'Config Tools',
    icon: 'app:config',
    children: [
      {
        title: 'กระบวนการสอบเทียบ',
        caption: 'Calibration Processes',
        icon: 'app:container',
        link: '/tools/manage?tab=calibration',
      },
      {
        title: 'ตั้งค่าเครื่องมือแพทย์',
        caption: 'Medical Tools Settings',
        icon: 'settings',
        link: '/tools/manage?tab=settings',
      },
      {
        title: 'ค่าใช้จ่าย',
        caption: 'Calibration Costs',
        icon: 'app:expense',
        link: '/tools/manage?tab=cost',
      },
    ],
  },
  { title: 'หน่วยงาน', caption: 'Departments', icon: 'business', link: '/departments' },
  { title: 'จัดการผู้ใช้งาน', caption: 'User Management', icon: 'group', link: '/users' },
  {
    title: 'ข้อมูลโรงพยาบาล',
    caption: 'Hospital Info',
    icon: 'local_hospital',
    link: '/hospitals',
  },
  {
    title: 'ประวัติการสอบเทียบ',
    caption: 'Calibration History',
    icon: 'app:save',
    link: '/history',
  },
];
