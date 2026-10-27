<template>
  <div class="filters">
    <label class="search-box">
      <span aria-hidden="true">⌕</span>
      <input
        :value="search"
        type="search"
        placeholder="Search launch vehicles..."
        aria-label="Search launch vehicles"
        @input="updateSearch"
      />
    </label>

    <select
      :value="selectedCountry"
      aria-label="Filter by country"
      @change="updateCountry"
    >
      <option value="">All countries</option>
      <option v-for="country in countries" :key="country" :value="country">
        {{ country }}
      </option>
    </select>

    <button
      class="refresh-button"
      type="button"
      :disabled="loading"
      @click="$emit('refresh')"
    >
      <span aria-hidden="true">↻</span>
      <span>{{ loading ? "Loading..." : "Refresh" }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  search: string;
  selectedCountry: string;
  countries: string[];
  loading: boolean;
}>();

const emit = defineEmits<{
  "update:search": [value: string];
  "update:selectedCountry": [value: string];
  refresh: [];
}>();

function updateSearch(event: Event) {
  emit("update:search", (event.target as HTMLInputElement).value);
}

function updateCountry(event: Event) {
  emit("update:selectedCountry", (event.target as HTMLSelectElement).value);
}
</script>
