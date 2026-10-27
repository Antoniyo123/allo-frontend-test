<template>
  <div class="page-shell">
    <header class="topbar">
      <a class="brand" href="/">
        <span class="brand-mark">A</span>
        <span>ALLO<span class="brand-light">SPACE</span></span>
      </a>
      <a class="back-link" href="/">← Back to catalog</a>
    </header>

    <main class="content detail-content">
      <div v-if="loading" class="state-panel" role="status">
        <div class="loader"></div>
        <h3>Loading rocket details...</h3>
      </div>

      <div v-else-if="error" class="state-panel" role="alert">
        <div class="state-icon">!</div>
        <h3>Unable to load rocket</h3>
        <p>{{ error }}</p>
        <button class="primary-button" @click="loadDetail">Try again</button>
        <button class="secondary-button" @click="goBack">
          Back to catalog
        </button>
      </div>

      <section v-else-if="rocket" class="detail-layout">
        <div class="detail-image">
          <img
            v-if="rocket.image_url && !imageFailed"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            @error="imageFailed = true"
          />
          <div v-else class="image-placeholder">
            <span>✳</span>
            <small>IMAGE UNAVAILABLE</small>
          </div>
        </div>

        <div class="detail-info">
          <p class="eyebrow">
            <span class="status-dot"></span>
            LAUNCH VEHICLE PROFILE
          </p>

          <h1>{{ rocket.full_name }}</h1>
          <p class="detail-description">
            {{
              rocket.description ||
              "No description available for this vehicle yet."
            }}
          </p>

          <div class="detail-facts">
            <div>
              <span>ROCKET NAME</span>
              <strong>{{ rocket.name }}</strong>
            </div>
            <div>
              <span>MANUFACTURER</span>
              <strong>{{ rocket.manufacturer?.name || "Unknown" }}</strong>
            </div>
            <div>
              <span>COUNTRY</span>
              <strong>{{
                rocket.manufacturer?.country_code || "Not available"
              }}</strong>
            </div>
            <div>
              <span>MAIDEN FLIGHT</span>
              <strong>{{ rocket.maiden_flight || "Not available" }}</strong>
            </div>
            <div>
              <span>LAUNCH COST</span>
              <strong>{{ formatCost(rocket.launch_cost) }}</strong>
            </div>
            <div>
              <span>DATA SOURCE</span>
              <strong>{{ isLocal ? "Local entry" : "Space Devs API" }}</strong>
            </div>
          </div>

          <button class="secondary-button" @click="goBack">
            ← Back to catalog
          </button>
        </div>
      </section>

      <div v-else class="state-panel">
        <h3>Rocket not found</h3>
        <button class="secondary-button" @click="goBack">
          Back to catalog
        </button>
      </div>

      <footer class="footer">
        <span>ALLOSPACE © 2026</span>
        <span>ROCKET DETAILS</span>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Rocket } from "@/types/rocket";
import { useRockets } from "@/composables/useRockets";
import "@/styles/rocket-catalog.css";

const route = useRoute();
const router = useRouter();
const { findRocketById } = useRockets();

const rocket = ref<Rocket | null>(null);
const loading = ref(false);
const error = ref("");
const imageFailed = ref(false);

const rocketId = computed(() => {
  const params = route.params as { id?: string };
  return Number(params.id);
});
const isLocal = computed(() => (rocket.value?.id ?? 0) < 0);

async function loadDetail() {
  loading.value = true;
  error.value = "";
  rocket.value = null;
  imageFailed.value = false;

  try {
    if (!Number.isInteger(rocketId.value) || rocketId.value === 0) {
      throw new Error("Invalid rocket ID.");
    }

    rocket.value = await findRocketById(rocketId.value);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Unable to load rocket details.";
  } finally {
    loading.value = false;
  }
}

function formatCost(cost: string | number | null) {
  if (cost === null || cost === "") return "Not available";

  const numericCost = Number(cost);

  if (!Number.isFinite(numericCost)) return String(cost);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericCost);
}

function goBack() {
  router.push("/");
}

watch(rocketId, loadDetail);
onMounted(loadDetail);
</script>
