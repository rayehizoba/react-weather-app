export type ID = number | string;

export interface LocationResource {
  admin1?: string;
  country: string;
  country_code: string;
  country_id: ID;
  elevation?: number;
  feature_code: string;
  id: ID;
  latitude: number;
  longitude: number;
  name: string;
  population: number;
  timezone: string;
}

export interface SearchResponseData {
  results: LocationResource[];
}

export type ActionType<T> = {
  type: string;
  data?: T;
};

export interface HourlyData {
  relativehumidity_2m: number[];
  temperature_2m: number[];
  time: string[];
  weathercode: number[];
  windspeed_10m: number[];
}

interface HourlyUnits {
  time: string;
  temperature_2m: string;
  weathercode: string;
  windspeed_10m: string;
  relativehumidity_2m: string;
}

interface DailyData {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

interface DailyUnits {
  time: string;
  weathercode: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
}

export interface ForecastResource {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: HourlyData;
  daily_units: DailyUnits;
  daily: DailyData;
}

export interface NoteData {
  title: string;
  note: string;
}

export interface NoteResource extends NoteData {
  id: ID;
  created_at: number;
  updated_at: number;
}

export interface GeoNamesResource {
  recordid: string;
  fields: {
    coordinates: number[];
    cou_name_en: string;
    country_code: string;
    geoname_id: string;
    feature_code: string;
    name: string;
    population: number;
    timezone: string;
  }
}

export interface GeoNamesResponseData {
  records: GeoNamesResource[],
}

export interface WeatherData {
  time: string;
  temperature_2m: number;
  weathercode: number;
  windspeed_10m: number;
  relativehumidity_2m: number;
}
