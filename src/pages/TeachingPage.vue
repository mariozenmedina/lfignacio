<script setup>
import { ArrowRight, ArrowUpRight, Binary, BookOpen, Braces, Dna, Network, Play, Sigma } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { usePage } from '@/composables/usePage'
import { useSeo } from '@/composables/useSeo'
import { courses } from '@/data/courses'
import outdoorPortrait from '@/assets/images/professor/lf-ignacio-outdoor-profile.jpg'

const { copy, locale, pathFor } = usePage()
useSeo({ title: () => copy.value.teaching.title, description: () => copy.value.teaching.intro })

const icons = { asa: Braces, fmc: Sigma, teocomp: Network, prog1: BookOpen, grafos: Network, alggrafos: Binary, topicosbioinfo: Dna }
const undergraduate = courses.filter((course) => course.levels.includes('undergraduate'))
const graduate = courses.filter((course) => course.levels.includes('graduate'))
const materialCount = (course) => course.materials.slides.length + course.materials.activities.length
</script>

<template>
  <main id="main-content">
    <section class="teaching-hero">
      <div class="shell teaching-hero-grid">
        <div class="page-hero-copy">
          <SectionEyebrow :label="copy.teaching.eyebrow" />
          <h1>{{ copy.teaching.title }}</h1>
          <p>{{ copy.teaching.intro }}</p>
          <a class="text-link text-link--light" href="https://www.youtube.com/@lfignacio1" target="_blank" rel="noopener noreferrer">
            <Play :size="17" aria-hidden="true" /> {{ copy.teaching.channel }} <ArrowUpRight :size="17" aria-hidden="true" />
          </a>
        </div>
        <figure class="teaching-portrait">
          <img :src="outdoorPortrait" alt="Luís Felipe Ignácio Cunha" width="720" height="1280" />
          <figcaption>UFF · IC · DCC</figcaption>
        </figure>
      </div>
    </section>

    <section class="section section--paper course-catalog">
      <div class="shell">
        <div class="catalog-group">
          <div class="catalog-heading">
            <SectionEyebrow index="01" :label="copy.teaching.undergraduate" />
            <h2>{{ copy.teaching.undergraduate }}</h2>
          </div>
          <div class="course-grid">
            <RouterLink
              v-for="course in undergraduate"
              :key="course.id"
              class="course-card"
              :style="{ '--course-accent': course.accent }"
              :to="pathFor('course', course.id)"
            >
              <div class="course-card__top">
                <component :is="icons[course.id]" :size="24" :stroke-width="1.5" aria-hidden="true" />
                <span>{{ course.code }}</span>
              </div>
              <h3>{{ course.title[locale] }}</h3>
              <p>{{ course.summary[locale] }}</p>
              <div class="course-card__footer">
                <span>{{ materialCount(course) }} {{ copy.teaching.resources }}</span>
                <ArrowRight :size="18" aria-hidden="true" />
              </div>
            </RouterLink>
          </div>
        </div>

        <div class="catalog-group catalog-group--graduate">
          <div class="catalog-heading">
            <SectionEyebrow index="02" :label="copy.teaching.graduate" />
            <h2>{{ copy.teaching.graduate }}</h2>
          </div>
          <div class="course-grid">
            <RouterLink
              v-for="course in graduate"
              :key="course.id"
              class="course-card"
              :style="{ '--course-accent': course.accent }"
              :to="pathFor('course', course.id)"
            >
              <div class="course-card__top">
                <component :is="icons[course.id]" :size="24" :stroke-width="1.5" aria-hidden="true" />
                <span>{{ course.code }}</span>
              </div>
              <h3>{{ course.title[locale] }}</h3>
              <p>{{ course.summary[locale] }}</p>
              <div class="course-card__footer">
                <span>{{ materialCount(course) }} {{ copy.teaching.resources }}</span>
                <ArrowRight :size="18" aria-hidden="true" />
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section learning-path">
      <div class="shell learning-path-grid">
        <h2>{{ copy.teaching.pathTitle }}</h2>
        <ol>
          <li v-for="(item, index) in copy.teaching.path" :key="item"><span>0{{ index + 1 }}</span>{{ item }}</li>
        </ol>
      </div>
    </section>
  </main>
</template>
