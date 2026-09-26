<script setup>
import { computed, ref } from 'vue'
import { ArrowLeft, ArrowUpRight, BookOpen, Download, FileArchive, FileText, Play, Search } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { usePage } from '@/composables/usePage'
import { useSeo } from '@/composables/useSeo'
import { courses } from '@/data/courses'
import { publicPath } from '@/utils/paths'

const { locale, copy, courseId, pathFor } = usePage()
const query = ref('')
const course = computed(() => courses.find((item) => item.id === courseId.value))
const localizedTitle = computed(() => course.value?.title[locale.value] || '')
const localizedSummary = computed(() => course.value?.summary[locale.value] || '')
const localizedSyllabus = computed(() => course.value?.syllabus[locale.value] || '')

useSeo({ title: localizedTitle, description: localizedSummary })

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const matches = (item) => !query.value || normalize(item.label).includes(normalize(query.value))
const filteredSlides = computed(() => course.value?.materials.slides.filter(matches) || [])
const filteredActivities = computed(() => course.value?.materials.activities.filter(matches) || [])

const resourceIcon = (item) => item.type === 'zip' ? FileArchive : FileText
</script>

<template>
  <main v-if="course" id="main-content" class="course-page" :style="{ '--course-accent': course.accent }">
    <section class="course-hero">
      <div class="shell">
        <RouterLink class="course-back" :to="pathFor('teaching')">
          <ArrowLeft :size="17" aria-hidden="true" /> {{ copy.course.back }}
        </RouterLink>
        <div class="course-hero-grid">
          <div>
            <SectionEyebrow :label="`${course.code} · ${copy.common.updated}`" />
            <h1>{{ localizedTitle }}</h1>
            <p>{{ localizedSummary }}</p>
          </div>
          <div class="course-stats">
            <div><strong>{{ course.materials.slides.length }}</strong><span>{{ copy.course.slides }}</span></div>
            <div><strong>{{ course.materials.activities.length }}</strong><span>{{ copy.course.activities }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--paper course-overview">
      <div class="shell course-overview-grid">
        <article>
          <SectionEyebrow index="01" :label="copy.course.syllabus" />
          <h2>{{ copy.course.syllabus }}</h2>
          <p>{{ localizedSyllabus }}</p>
        </article>
        <article>
          <SectionEyebrow index="02" :label="copy.course.bibliography" />
          <h2>{{ copy.course.bibliography }}</h2>
          <ul class="bibliography-list">
            <li v-for="entry in course.bibliography" :key="entry">{{ entry }}</li>
          </ul>
          <div v-if="course.references?.length" class="course-references">
            <strong>{{ copy.course.references }}</strong>
            <a v-for="reference in course.references" :key="reference.href" :href="reference.href" target="_blank" rel="noopener noreferrer">
              {{ reference.label }} <ArrowUpRight :size="16" aria-hidden="true" />
            </a>
          </div>
        </article>
        <aside v-if="course.playlistId" class="playlist-card">
          <Play :size="28" aria-hidden="true" />
          <div><span>{{ copy.course.playlist }}</span><strong>YouTube</strong></div>
          <a :href="`https://www.youtube.com/playlist?list=${course.playlistId}`" target="_blank" rel="noopener noreferrer" :aria-label="copy.course.watchPlaylist">
            <ArrowUpRight :size="20" aria-hidden="true" />
          </a>
        </aside>
      </div>
    </section>

    <section class="section course-materials">
      <div class="shell">
        <div class="materials-header">
          <div>
            <SectionEyebrow index="03" :label="copy.course.materials" />
            <h2>{{ copy.course.materials }}</h2>
            <p>{{ copy.course.portugueseNotice }}</p>
          </div>
          <label class="material-search">
            <Search :size="18" aria-hidden="true" />
            <span class="sr-only">{{ copy.course.search }}</span>
            <input v-model="query" type="search" :placeholder="copy.course.searchPlaceholder" />
          </label>
        </div>

        <div v-if="filteredSlides.length" class="material-group">
          <h3><BookOpen :size="20" aria-hidden="true" /> {{ copy.course.slides }} <span>{{ filteredSlides.length }}</span></h3>
          <div class="material-list">
            <a v-for="(item, index) in filteredSlides" :key="item.path" :href="publicPath(item.path)" target="_blank" rel="noopener noreferrer">
              <span class="material-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <component :is="resourceIcon(item)" :size="20" :stroke-width="1.5" aria-hidden="true" />
              <strong>{{ item.label }}</strong>
              <small>{{ item.type.toUpperCase() }}</small>
              <Download :size="18" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div v-if="filteredActivities.length" class="material-group">
          <h3><FileText :size="20" aria-hidden="true" /> {{ copy.course.activities }} <span>{{ filteredActivities.length }}</span></h3>
          <div class="material-list">
            <a v-for="(item, index) in filteredActivities" :key="item.path" :href="publicPath(item.path)" target="_blank" rel="noopener noreferrer">
              <span class="material-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <component :is="resourceIcon(item)" :size="20" :stroke-width="1.5" aria-hidden="true" />
              <strong>{{ item.label }}</strong>
              <small>{{ item.type.toUpperCase() }}</small>
              <Download :size="18" aria-hidden="true" />
            </a>
          </div>
        </div>

        <p v-if="!filteredSlides.length && !filteredActivities.length" class="material-empty">{{ copy.course.empty }}</p>
      </div>
    </section>

    <section class="course-contact">
      <div class="shell">
        <p>{{ copy.course.contact }}</p>
        <a href="mailto:lfignacio@ic.uff.br">lfignacio@ic.uff.br <ArrowUpRight :size="17" aria-hidden="true" /></a>
      </div>
    </section>
  </main>
</template>
