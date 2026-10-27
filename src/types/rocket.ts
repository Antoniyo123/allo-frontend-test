export interface RocketManufacturer {
  name: string;
  country_code: string | null;
}

export interface Rocket {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  image_url: string | null;
  launch_cost: string | number | null;
  maiden_flight: string | null;
  manufacturer: RocketManufacturer | null;
}

export interface RocketApiItem {
  id: number;
  name?: string;
  full_name?: string;
  description?: string | null;
  image_url?: string | null;
  launch_cost?: string | number | null;
  maiden_flight?: string | null;
  manufacturer?: {
    name?: string;
    country_code?: string | null;
  } | null;
}

export interface RocketApiResponse {
  results: RocketApiItem[];
}

export interface NewRocket {
  name: string;
  full_name: string;
  description: string;
  country_code: string;
  maiden_flight: string;
  launch_cost: string;
  image_url: string;
}

export function normalizeRocket(item: RocketApiItem): Rocket {
  return {
    id: item.id,
    name: item.name || item.full_name || "Unknown Rocket",
    full_name: item.full_name || item.name || "Unknown Rocket",
    description: item.description ?? null,
    image_url: item.image_url ?? null,
    launch_cost: item.launch_cost ?? null,
    maiden_flight: item.maiden_flight ?? null,
    manufacturer: item.manufacturer
      ? {
          name: item.manufacturer.name || "Unknown Manufacturer",
          country_code: item.manufacturer.country_code ?? null,
        }
      : null,
  };
}
