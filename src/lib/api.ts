import { publicApiUrl } from './config';

export type PurposeType = 'CAR' | 'BIKE' | 'MOTORCYCLE' | 'ITEM';

export type SourceStatus = 'DISABLED' | 'ACTIVE' | 'FAILED' | 'PROVISIONED';

export interface Source {
  id: number;
  uid: string;
  name?: string;
  public_url?: string;
  attribution_license?: string | null;
  attribution_contributor?: string | null;
  attribution_url?: string | null;
  static_status?: SourceStatus;
  realtime_status?: SourceStatus;
  static_data_updated_at?: string;
  realtime_data_updated_at?: string;
}

export interface ParkingRestriction {
  type?: string;
  hours?: string;
  max_stay?: string;
}

export interface ParkingSite {
  id: number;
  source_id: number;
  original_uid: string;
  name: string;
  purpose: PurposeType;
  type?: string;
  operator_name?: string;
  public_url?: string;
  photo_url?: string;
  address?: string;
  description?: string;
  lat: number;
  lon: number;
  capacity?: number;
  realtime_capacity?: number;
  realtime_free_capacity?: number;
  has_realtime_data: boolean;
  realtime_opening_status?: 'OPEN' | 'CLOSED' | 'UNKNOWN';
  realtime_data_updated_at?: string;
  static_data_updated_at?: string;
  opening_hours?: string;
  has_fee?: boolean;
  fee_description?: string;
  max_height?: number;
  max_width?: number;
  max_stay?: number;
  park_and_ride_type?: string[];
  restrictions?: ParkingRestriction[];
}

interface ListResponse<T> {
  items: T[];
  total_count: number;
  next_path?: string;
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${publicApiUrl}${path}`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`ParkAPI responded with HTTP ${response.status} for ${path}`);
  }
  return (await response.json()) as T;
}

export async function fetchSources(signal?: AbortSignal): Promise<Source[]> {
  const response = await getJson<ListResponse<Source>>('/v3/sources', signal);
  return response.items;
}

export function fetchSource(sourceId: number, signal?: AbortSignal): Promise<Source> {
  return getJson<Source>(`/v3/sources/${sourceId}`, signal);
}

export function fetchParkingSite(parkingSiteId: number, signal?: AbortSignal): Promise<ParkingSite> {
  return getJson<ParkingSite>(`/v3/parking-sites/${parkingSiteId}`, signal);
}

export function tilesUrl(purpose: PurposeType | null): string {
  const query = purpose ? `?purpose=${purpose}` : '';
  return `${publicApiUrl}/v3/tiles/{z}/{x}/{y}.mvt${query}`;
}
