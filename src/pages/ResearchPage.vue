<script setup>
import { ArrowRight } from '@lucide/vue'
import PublicationExplorer from '@/components/research/PublicationExplorer.vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import ResearchGraph from '@/components/visual/ResearchGraph.vue'
import { usePage } from '@/composables/usePage'
import { useSeo } from '@/composables/useSeo'

const { copy } = usePage()
useSeo({ title: () => copy.value.research.title, description: () => copy.value.research.intro })
</script>

<template>
  <main id="main-content">
    <section class="research-hero">
      <div class="shell research-hero-grid">
        <div class="page-hero-copy">
          <SectionEyebrow :label="copy.research.eyebrow" />
          <h1>{{ copy.research.title }}</h1>
          <p>{{ copy.research.intro }}</p>
        </div>
        <ResearchGraph :label="copy.research.constellation" />
      </div>
    </section>

    <section id="topics" class="section section--paper research-topics">
      <div class="shell">
        <div class="section-heading">
          <SectionEyebrow index="01" :label="copy.research.topicsLabel" />
          <h2>{{ copy.research.topicsTitle }}</h2>
        </div>
        <div class="topic-list">
          <article v-for="topic in copy.research.topics" :key="topic.id" class="topic-row">
            <span>{{ topic.number }}</span>
            <h3>{{ topic.title }}</h3>
            <p>{{ topic.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="publications" class="section publications-section">
      <div class="shell">
        <div class="section-heading section-heading--split">
          <div>
            <SectionEyebrow index="02" :label="copy.research.publicationsTitle" />
            <h2>{{ copy.research.publicationsTitle }}</h2>
          </div>
          <p>{{ copy.research.publicationsIntro }}</p>
        </div>
        <PublicationExplorer :copy="copy.research" />
      </div>
    </section>

    <section class="section research-cta">
      <div class="shell research-cta-inner">
        <div>
          <span>{{ copy.research.tags }}</span>
          <h2>{{ copy.research.mentorshipTitle }}</h2>
          <p>{{ copy.research.mentorshipText }}</p>
        </div>
        <a class="button button--primary" href="mailto:lfignacio@ic.uff.br">
          lfignacio@ic.uff.br <ArrowRight :size="18" aria-hidden="true" />
        </a>
      </div>
    </section>
  </main>
</template>
