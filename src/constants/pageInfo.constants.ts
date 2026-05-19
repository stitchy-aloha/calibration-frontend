export interface PageInfo {
  title: string;
  caption: string;
}

export const TOOL_MANAGEMENT_TABS: Record<string, PageInfo> = {
  calibration: {
    title: 'กระบวนการสอบเทียบ',
    caption: 'จัดการและรายละเอียดกระบวนการสอบเทียบได้อย่างเป็นระบบ',
  },
  settings: {
    title: 'ตั้งค่าเครื่องมือแพทย์',
    caption: 'จัดการและกำหนดค่าเครื่องมือแพทย์ให้พร้อมสำหรับการใช้งานได้อย่างสะดวก',
  },
  cost: {
    title: 'ค่าใช้จ่ายในการสอบเทียบ',
    caption: 'บันทึกและจัดการค่าใช้จ่ายที่เกี่ยวข้องกับการสอบเทียบได้อย่างเป็นระบบ',
  },
};
