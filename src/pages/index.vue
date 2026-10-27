<template>
  <div class="page-shell">
    <header class="topbar">
      <a class="brand" href="/">
        <span class="brand-mark">A</span>
        <span>ALLO<span class="brand-light">SPACE</span></span>
      </a>
      <span class="topbar-label">SPACE EXPLORATION DATABASE</span>
    </header>

    <main class="content">
      <section class="hero">
        <div class="eyebrow">
          <span class="status-dot"></span>
          LAUNCHER DATABASE / SPACEX
        </div>

        <h1>Built to reach<br /><span>the extraordinary.</span></h1>

        <p class="hero-description">
          Explore the launch vehicles powering humanity's journey beyond Earth.
        </p>

        <div class="hero-stats">
          <div>
            <strong>{{ rockets.length }}</strong>
            <span>ROCKETS LOADED</span>
          </div>
          <div class="stat-divider"></div>
          <div>
            <strong>SpaceX</strong>
            <span>MANUFACTURER</span>
          </div>
        </div>
      </section>

      <section class="catalog">
        <div class="section-heading">
          <div>
            <p class="eyebrow">THE COLLECTION</p>
            <h2>Launch vehicles<span class="heading-period">.</span></h2>
          </div>
          <span class="result-count">{{ filteredRockets.length }} RESULTS</span>
        </div>

        <div class="catalog-actions">
          <RocketFilters
            v-model:search="search"
            v-model:selected-country="selectedCountry"
            :countries="countries"
            :loading="loading"
            @refresh="loadRockets"
          />
          <button
            class="primary-button add-toggle"
            type="button"
            @click="showAddForm = !showAddForm"
          >
            {{ showAddForm ? "Cancel" : "+ Add rocket" }}
          </button>
        </div>

        <form
          v-if="showAddForm"
          class="add-form"
          @submit.prevent="submitRocket"
        >
          <h3>Add a local rocket</h3>
          <p>
            This entry stays in this app session and is not sent to the API.
          </p>

          <div class="form-grid">
            <label>
              Rocket name *
              <input v-model="form.name" required maxlength="100" />
            </label>
            <label>
              Full name *
              <input v-model="form.full_name" required maxlength="150" />
            </label>
            <label>
              Country code
              <input
                v-model="form.country_code"
                maxlength="3"
                placeholder="US"
              />
            </label>
            <label>
              Maiden flight
              <input v-model="form.maiden_flight" type="date" />
            </label>
            <label>
              Launch cost (USD)
              <input v-model="form.launch_cost" type="number" min="0" />
            </label>
            <label>
              Image URL
              <input
                v-model="form.image_url"
                type="url"
                placeholder="https://..."
              />
            </label>
            <label class="form-wide">
              Description
              <textarea v-model="form.description" rows="3" maxlength="1000" />
            </label>
          </div>

          <button class="primary-button" type="submit">Save rocket</button>
        </form>

        <div
          v-if="loading && rockets.length === 0"
          class="state-panel"
          role="status"
        >
          <div class="loader"></div>
          <h3>Establishing connection</h3>
          <p>Fetching launch vehicle data...</p>
        </div>

        <div
          v-else-if="error && rockets.length === 0"
          class="state-panel"
          role="alert"
        >
          <div class="state-icon">!</div>
          <h3>Unable to load rockets</h3>
          <p>{{ error }}</p>
          <button class="primary-button" type="button" @click="loadRockets">
            Try again
          </button>
        </div>

        <div v-else-if="filteredRockets.length === 0" class="state-panel">
          <div class="state-icon">⌕</div>
          <h3>No rockets found</h3>
          <p>Try another search term or country.</p>
          <button class="secondary-button" type="button" @click="clearFilters">
            Clear filters
          </button>
        </div>

        <div v-else class="rocket-grid">
          <RocketCard
            v-for="(rocket, index) in filteredRockets"
            :key="rocket.id"
            :rocket="rocket"
            :index="index"
            @select="openRocket"
          />
        </div>

        <p v-if="error && rockets.length > 0" class="inline-error" role="alert">
          Refresh failed: {{ error }}. The previously loaded data is still
          shown.
        </p>
      </section>

      <footer class="footer">
        <span>ALLOSPACE © 2026</span>
        <span>DATA SOURCE: THE SPACE DEVS API</span>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import RocketCard from "@/components/rocket/RocketCard.vue";
import RocketFilters from "@/components/rocket/RocketFilters.vue";
import { useRockets } from "@/composables/useRockets";
import type { NewRocket } from "@/types/rocket";
import "@/styles/rocket-catalog.css";

const router = useRouter();

const {
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
} = useRockets();

const showAddForm = ref(false);

const form = reactive<NewRocket>({
  name: "",
  full_name: "",
  description: "",
  country_code: "US",
  maiden_flight: "",
  launch_cost: "",
  image_url: "",
});

function submitRocket() {
  addRocket({ ...form });
  search.value = "";
  selectedCountry.value = "";
  showAddForm.value = false;

  Object.assign(form, {
    name: "",
    full_name: "",
    description: "",
    country_code: "US",
    maiden_flight: "",
    launch_cost: "",
    image_url: "",
  });
}

function openRocket(id: number) {
  router.push(`/rockets/${id}`);
}

onMounted(loadRockets);
</script>
