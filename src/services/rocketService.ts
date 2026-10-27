import type { Rocket, RocketApiItem, RocketApiResponse } from "@/types/rocket";
import { normalizeRocket } from "@/types/rocket";

const API_BASE_URL = "https://lldev.thespacedevs.com/2.2.0";

const ROCKET_LIST_URL = `${API_BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`;

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json() as Promise<T>;
}

export async function getRockets(): Promise<Rocket[]> {
  const data = await fetchJson<RocketApiResponse>(ROCKET_LIST_URL);
  return data.results.map(normalizeRocket);
}

export async function getRocketById(id: number): Promise<Rocket> {
  const data = await fetchJson<RocketApiItem>(
    `${API_BASE_URL}/config/launcher/${id}/`,
  );

  return normalizeRocket(data);
}
