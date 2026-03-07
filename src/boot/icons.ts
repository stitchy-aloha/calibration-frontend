// Custom SVG icon mapping for Quasar components
import { boot } from 'quasar/wrappers';

// Icon map for custom SVGs in the public/svg folder
const customSvgIcons: Record<string, string> = {
  'app:home': 'img:/svg/home.svg',
  'app:calendar': 'img:/svg/calendar.svg',
  'app:note': 'img:/svg/note.svg',
  'app:appr': 'img:/svg/appr.svg',
  'app:shield': 'img:/svg/shield.svg',
  'app:repair': 'img:/svg/repair.svg',
  'app:save': 'img:/svg/save.svg',
  'app:syringe': 'img:/svg/syringe.svg',
  'app:settings_heart': 'img:/svg/settingh.svg',
  'app:med': 'img:/svg/med.svg',
  'app:config': 'img:/svg/config.svg',
  'app:expense': 'img:/svg/expense.svg',
  'app:container': 'img:/svg/container.svg',
};

export default boot(({ app }) => {
  // Get Quasar instance
  const $q = app.config.globalProperties.$q;

  // Set the icon mapping function
  $q.iconMapFn = (iconName: string) => {
    // If the icon name starts with 'app:', map it to our custom SVG icons
    if (iconName.startsWith('app:')) {
      const mappedIcon = customSvgIcons[iconName];

      if (mappedIcon !== undefined) {
        return { icon: mappedIcon };
      }
    }

    // For any other icons, let Quasar handle them with its default behavior
    return undefined;
  };
});
