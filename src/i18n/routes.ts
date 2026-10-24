export const routes = {
  map: '/',
  about: '/about',
  openData: '/open-data',
  imprint: '/imprint',
  privacy: '/privacy',
} as const;

export type RouteName = keyof typeof routes;
