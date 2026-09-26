<script setup>
import { computed, ref } from 'vue'
import { ArrowUpRight } from '@lucide/vue'
import { conferencePublications, journalPublications } from '@/data/publications'

const props = defineProps({ copy: { type: Object, required: true } })
const activeType = ref('journals')
const selectedYear = ref('all')

const years = [...new Set([...journalPublications, ...conferencePublications].map((item) => item.year))].sort((a, b) => b - a)
const filteredJournals = computed(() => selectedYear.value === 'all' ? journalPublications : journalPublications.filter((item) => String(item.year) === selectedYear.value))
const filteredConferences = computed(() => selectedYear.value === 'all' ? conferencePublications : conferencePublications.filter((item) => String(item.year) === selectedYear.value))
</script>

<template>
  <div class="publication-explorer">
    <div class="publication-toolbar">
      <div class="segmented-control" role="tablist" :aria-label="copy.publicationsTitle">
        <button type="button" role="tab" :aria-selected="activeType === 'journals'" @click="activeType = 'journals'">
          {{ copy.journals }} <span>{{ journalPublications.length }}</span>
        </button>
        <button type="button" role="tab" :aria-selected="activeType === 'conferences'" @click="activeType = 'conferences'">
          {{ copy.conferences }} <span>{{ conferencePublications.length }}</span>
        </button>
      </div>
      <label class="year-filter">
        <span>{{ copy.filterYear }}</span>
        <select v-model="selectedYear">
          <option value="all">{{ copy.allYears }}</option>
          <option v-for="year in years" :key="year" :value="String(year)">{{ year }}</option>
        </select>
      </label>
    </div>

    <section v-show="activeType === 'journals'" class="publication-panel" role="tabpanel">
      <div class="publication-summary">{{ filteredJournals.length }} {{ copy.results }}</div>
      <ol class="publication-list">
        <li v-for="item in filteredJournals" :key="item.id">
          <span class="publication-year">{{ item.year }}</span>
          <p>{{ item.citation }}</p>
          <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" :aria-label="`${copy.openPublication}: ${item.citation}`">
            <ArrowUpRight :size="18" aria-hidden="true" />
          </a>
        </li>
      </ol>
    </section>

    <section v-show="activeType === 'conferences'" class="publication-panel" role="tabpanel">
      <div class="publication-summary">{{ filteredConferences.length }} {{ copy.results }}</div>
      <ol class="publication-list">
        <li v-for="item in filteredConferences" :key="item.id">
          <span class="publication-year">{{ item.year }}</span>
          <p>{{ item.citation }}</p>
          <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" :aria-label="`${copy.openPublication}: ${item.citation}`">
            <ArrowUpRight :size="18" aria-hidden="true" />
          </a>
        </li>
      </ol>
    </section>
  </div>
</template>
