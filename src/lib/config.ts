import { env } from './runtimeEnv';

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const config = {
  parkApiUrl: stripTrailingSlash(env('VITE_PARK_API_URL', 'https://api.mobidata-bw.de/park-api')),
  mapStyleUrl: env('VITE_MAP_STYLE_URL', 'https://tiles.binary-butterfly.de/osm-bright-gl-style/style.json'),
  operator: {
    name: env('VITE_OPERATOR_NAME', 'binary butterfly GmbH'),
    address: env('VITE_OPERATOR_ADDRESS', 'Am Hertinger Tor 1, 59423 Unna'),
    email: env('VITE_OPERATOR_EMAIL', 'ernesto.ruge@binary-butterfly.de'),
    phone: env('VITE_OPERATOR_PHONE', '+49 2303 6766916'),
    representative: env('VITE_OPERATOR_REPRESENTATIVE', 'Ernesto Ruge'),
    register: env('VITE_OPERATOR_REGISTER', 'Amtsgericht Hamm, HRB 9654'),
    vatId: env('VITE_OPERATOR_VAT_ID', 'DE323570669'),
  },
};

export const publicApiUrl = `${config.parkApiUrl}/api/public`;
export const openApiDocsUrl = `${config.parkApiUrl}/documentation/public.html`;
export const openApiSpecUrl = `${config.parkApiUrl}/documentation/public.json`;

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

// The hosts the browser loads map and parking data from, as the privacy policy names them.
export const parkApiHost = hostOf(config.parkApiUrl);
export const mapStyleHost = hostOf(config.mapStyleUrl);
