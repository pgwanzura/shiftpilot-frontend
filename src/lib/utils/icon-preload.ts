import { AppIconType, getIconComponent } from '@/config/icons';

const iconCache = new Map<AppIconType, any>();

export const preloadIconsServer = async (
  iconNames: AppIconType[]
): Promise<void> => {
  const uniqueIcons = [...new Set(iconNames)];

  const loadPromises = uniqueIcons.map(async (name) => {
    if (!iconCache.has(name)) {
      try {
        const component = await getIconComponent(name);
        if (component) {
          iconCache.set(name, component);
        }
      } catch {
        console.warn(`Failed to preload icon: ${name}`);
      }
    }
  });

  await Promise.allSettled(loadPromises);
};

export const getCachedIconServer = (name: AppIconType): any => {
  return iconCache.get(name) || null;
};
