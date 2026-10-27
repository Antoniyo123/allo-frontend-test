<template>
  <article
    class="rocket-card"
    tabindex="0"
    role="link"
    :aria-label="`View details for ${rocket.full_name}`"
    @click="selectRocket"
    @keydown.enter.prevent="selectRocket"
  >
    <div class="card-image">
      <img
        v-if="rocket.image_url && !imageFailed"
        :src="rocket.image_url"
        :alt="rocket.full_name"
        loading="lazy"
        @error="imageFailed = true"
      />

      <div v-else class="image-placeholder">
        <span>✳</span>
        <small>IMAGE UNAVAILABLE</small>
      </div>

      <span class="card-index">
        {{ String(index + 1).padStart(2, "0") }}
      </span>
      <span class="image-label">LAUNCH VEHICLE</span>
    </div>

    <div class="card-body">
      <div class="card-country">
        {{ rocket.manufacturer?.country_code || "COUNTRY N/A" }}
      </div>

      <h3>{{ rocket.full_name }}</h3>

      <p class="card-description">
        {{
          rocket.description || "No description available for this vehicle yet."
        }}
      </p>

      <div class="card-meta">
        <div>
          <span>MAIDEN FLIGHT</span>
          <strong>{{ rocket.maiden_flight || "Unknown" }}</strong>
        </div>
        <div>
          <span>LAUNCH COST</span>
          <strong>{{ formatCost(rocket.launch_cost) }}</strong>
        </div>
      </div>

      <div class="card-footer">
        <span>Explore vehicle</span>
        <span class="arrow">↗</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Rocket } from "@/types/rocket";

const props = defineProps<{
  rocket: Rocket;
  index: number;
}>();

const emit = defineEmits<{
  select: [id: number];
}>();

const imageFailed = ref(false);

watch(
  () => props.rocket.image_url,
  () => {
    imageFailed.value = false;
  },
);

function selectRocket() {
  emit("select", props.rocket.id);
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
</script>
