import { computed, ref } from "vue";
import type { NewRocket, Rocket } from "@/types/rocket";
import { getRocketById, getRockets } from "@/services/rocketService";

const apiRockets = ref<Rocket[]>([]);
const localRockets = ref<Rocket[]>([]);

const loading = ref(false);
const error = ref("");
const search = ref("");
const selectedCountry = ref("");

const rockets = computed(() => [...localRockets.value, ...apiRockets.value]);

const countries = computed(() => {
  const values = rockets.value
    .map((rocket) => rocket.manufacturer?.country_code)
    .filter((country): country is string => Boolean(country));

  return [...new Set(values)].sort();
});

const filteredRockets = computed(() => {
  const query = search.value.trim().toLowerCase();

  return rockets.value.filter((rocket) => {
    const matchesSearch =
      !query ||
      rocket.name.toLowerCase().includes(query) ||
      rocket.full_name.toLowerCase().includes(query) ||
      (rocket.manufacturer?.name ?? "").toLowerCase().includes(query);

    const matchesCountry =
      !selectedCountry.value ||
      rocket.manufacturer?.country_code === selectedCountry.value;

    return matchesSearch && matchesCountry;
  });
});

async function loadRockets() {
  loading.value = true;
  error.value = "";

  try {
    apiRockets.value = await getRockets();
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : "Unable to load rockets. Please try again.";
  } finally {
    loading.value = false;
  }
}

function addRocket(input: NewRocket) {
  const rocket: Rocket = {
    id: -Date.now(),
    name: input.name.trim(),
    full_name: input.full_name.trim(),
    description: input.description.trim() || null,
    image_url: input.image_url.trim() || null,
    launch_cost: input.launch_cost.trim() || null,
    maiden_flight: input.maiden_flight.trim() || null,
    manufacturer: {
      name: "SpaceX",
      country_code: input.country_code.trim().toUpperCase() || null,
    },
  };

  localRockets.value.unshift(rocket);
}

function clearFilters() {
  search.value = "";
  selectedCountry.value = "";
}

async function findRocketById(id: number): Promise<Rocket> {
  const localRocket = localRockets.value.find((rocket) => rocket.id === id);

  if (localRocket) {
    return localRocket;
  }

  const cachedRocket = apiRockets.value.find((rocket) => rocket.id === id);

  if (cachedRocket) {
    return cachedRocket;
  }

  return getRocketById(id);
}

export function useRockets() {
  return {
    rockets,
    loading,
    error,
    search,
    selectedCountry,
    countries,
    filteredRockets,
    loadRockets,
    addRocket,
    clearFilters,
    findRocketById,
  };
}
