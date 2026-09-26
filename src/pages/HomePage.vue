<script setup>
import { ArrowRight, ArrowUpRight, BookOpen, Mail, Network, Orbit, Waypoints } from '@lucide/vue'
import { RouterLink } from 'vue-router'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { usePage } from '@/composables/usePage'
import { useSeo } from '@/composables/useSeo'
import { conferencePublications, journalPublications } from '@/data/publications'
import officePortrait from '@/assets/images/professor/lf-ignacio-office-portrait.jpg'

const { copy, pathFor } = usePage()
useSeo({ title: () => copy.value.home.title, description: () => copy.value.home.lead })

const fieldIcons = [Waypoints, Network, BookOpen, Orbit]
</script>

<template>
  <main id="main-content">
    <section class="hero hero--home">
      <div class="shell hero-grid">
        <div class="hero-copy">
          <SectionEyebrow :label="copy.home.eyebrow" />
          <h1>{{ copy.home.title }}</h1>
          <p class="hero-lead">{{ copy.home.lead }}</p>
          <div class="hero-actions">
            <RouterLink class="button button--primary" :to="pathFor('research')">
              {{ copy.home.researchCta }} <ArrowRight :size="18" aria-hidden="true" />
            </RouterLink>
            <RouterLink class="button button--ghost" :to="pathFor('teaching')">
              {{ copy.home.teachingCta }}
            </RouterLink>
          </div>
          <ul class="credential-list">
            <li v-for="credential in copy.home.credentials" :key="credential">{{ credential }}</li>
          </ul>
        </div>

        <div class="hero-portrait-wrap">
          <div class="portrait-index" aria-hidden="true">01 / LF</div>
          <figure class="hero-portrait">
            <img :src="officePortrait" :alt="copy.home.portraitAlt" width="720" height="1280" />
          </figure>
          <a class="portrait-contact" href="mailto:lfignacio@ic.uff.br">
            <Mail :size="17" aria-hidden="true" /> lfignacio@ic.uff.br
          </a>
        </div>
      </div>
    </section>

    <section class="section section--paper">
      <div class="shell">
        <div class="section-heading section-heading--split">
          <div>
            <SectionEyebrow index="01" :label="copy.home.fieldLabel" />
            <h2>{{ copy.home.fieldTitle }}</h2>
          </div>
          <p>{{ copy.home.fieldText }}</p>
        </div>
        <div class="field-grid">
          <RouterLink v-for="(field, index) in copy.home.fields" :key="field" class="field-card" :to="`${pathFor('research')}#topics`">
            <component :is="fieldIcons[index]" :size="24" :stroke-width="1.5" aria-hidden="true" />
            <span class="field-card__number">0{{ index + 1 }}</span>
            <strong>{{ field }}</strong>
            <ArrowUpRight :size="18" aria-hidden="true" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="section section--ink publications-preview">
      <div class="shell preview-grid">
        <div>
          <SectionEyebrow index="02" :label="copy.home.latestLabel" />
          <h2>{{ copy.home.latestTitle }}</h2>
          <p>{{ copy.home.latestText }}</p>
          <RouterLink class="text-link text-link--light" :to="`${pathFor('research')}#publications`">
            {{ copy.common.viewAll }} <ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
        </div>
        <div class="metric-grid">
          <div class="metric-card">
            <strong>{{ journalPublications.length }}</strong>
            <span>{{ copy.home.journalCount }}</span>
          </div>
          <div class="metric-card metric-card--accent">
            <strong>{{ conferencePublications.length }}</strong>
            <span>{{ copy.home.conferenceCount }}</span>
          </div>
          <div class="metric-years">2010 <span>→</span> 2025</div>
        </div>
      </div>
    </section>

    <section class="section mentorship-callout">
      <div class="shell callout-inner">
        <span class="callout-symbol" aria-hidden="true">?</span>
        <div>
          <h2>{{ copy.home.mentorshipTitle }}</h2>
          <p>{{ copy.home.mentorshipText }}</p>
        </div>
        <a class="button button--dark" href="mailto:lfignacio@ic.uff.br">
          {{ copy.home.mentorshipCta }} <ArrowRight :size="18" aria-hidden="true" />
        </a>
      </div>
    </section>
  </main>
</template>
