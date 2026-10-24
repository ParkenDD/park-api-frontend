/**
 * Reads configuration values at runtime, so that one built image can be deployed against any ParkAPI instance and for
 * any operator.
 *
 * Lookup order:
 *   1. a data-* attribute on the #root element, written into index.html by nginx sub_filter at request time from the
 *      container environment (see deployment/nginx.conf.template). `VITE_FOO_BAR` is read from `data-vite-foo-bar`.
 *   2. import.meta.env, which is what `npm run dev` and `npm run preview` provide, as there is no nginx in front and the
 *      attribute still holds its placeholder (the variable name itself).
 *   3. the default given by the caller.
 */
function datasetKey(key: string): string {
  return key.toLowerCase().replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

export function env(key: string, fallback = ''): string {
  const root = typeof document !== 'undefined' ? document.getElementById('root') : null;
  const stated = root?.dataset[datasetKey(key)];
  if (stated !== undefined && stated !== key) {
    return stated;
  }
  const built = (import.meta.env as Record<string, string | undefined>)[key];
  if (built !== undefined && built !== '') {
    return built;
  }
  return fallback;
}
