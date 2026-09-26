<script setup>
import { ArrowUpRight, FileText, GraduationCap } from '@lucide/vue'
import SectionEyebrow from '@/components/ui/SectionEyebrow.vue'
import { usePage } from '@/composables/usePage'
import { useSeo } from '@/composables/useSeo'
import { publicPath } from '@/utils/paths'
import mountainPortrait from '@/assets/images/professor/lf-ignacio-mountain-portrait.jpg'
import personalPortrait from '@/assets/images/professor/lf-ignacio-star-trek-portrait.jpg'

const { copy } = usePage()
useSeo({ title: () => copy.value.about.title, description: () => copy.value.about.intro })

const documents = [
  { label: () => copy.value.about.lattes, href: 'http://lattes.cnpq.br/5594677783572346' },
  { label: () => copy.value.about.resume, href: publicPath('documents/cv-luis-felipe-ignacio-en.pdf') },
  { label: () => copy.value.about.thesis, href: 'https://www.cos.ufrj.br/uploadfile/publicacao/2757.pdf' },
]

const timelineLinks = [
  [
    { label: 'PESC/COPPE/UFRJ', href: 'https://www.cos.ufrj.br/' },
    { label: 'Celina de Figueiredo', href: 'https://www.cos.ufrj.br/~celina' },
  ],
  [
    { label: 'IC/UFF', href: 'https://www.ic.uff.br/' },
    { label: 'Fábio Protti', href: 'https://www.ic.uff.br/~fabio/' },
  ],
  [
    { label: 'PESC/COPPE/UFRJ', href: 'https://www.cos.ufrj.br/' },
    { label: 'Celina de Figueiredo', href: 'https://www.cos.ufrj.br/~celina' },
    { label: 'Luis Kowada', href: 'http://www.professores.uff.br/kowada/' },
  ],
  [
    { label: 'PESC/COPPE/UFRJ', href: 'https://www.cos.ufrj.br/' },
    { label: 'Celina de Figueiredo', href: 'https://www.cos.ufrj.br/~celina' },
    { label: 'Luis Kowada', href: 'http://www.professores.uff.br/kowada/' },
  ],
  [{ label: 'Universidade Federal Fluminense', href: 'https://www.uff.br/' }],
]
</script>

<template>
  <main id="main-content">
    <section class="page-hero page-hero--image">
      <div class="shell page-hero-grid">
        <div class="page-hero-copy">
          <SectionEyebrow :label="copy.about.eyebrow" />
          <h1>{{ copy.about.title }}</h1>
          <p>{{ copy.about.intro }}</p>
        </div>
        <figure class="about-landscape">
          <img :src="mountainPortrait" :alt="copy.about.portraitAlt" width="720" height="1280" />
          <figcaption>2011 → {{ new Date().getFullYear() }}</figcaption>
        </figure>
      </div>
    </section>

    <section class="section section--paper">
      <div class="shell about-content-grid">
        <div class="timeline-column">
          <SectionEyebrow index="01" :label="copy.about.timelineLabel" />
          <ol class="academic-timeline">
            <li v-for="(item, index) in copy.about.timeline" :key="`${item.year}-${item.title}`">
              <time>{{ item.year }}</time>
              <div>
                <h2>{{ item.title }}</h2>
                <p>{{ item.detail }}</p>
                <div class="timeline-links">
                  <a v-for="link in timelineLinks[index]" :key="link.href" :href="link.href" target="_blank" rel="noopener noreferrer">
                    {{ link.label }} <ArrowUpRight :size="13" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </li>
          </ol>
        </div>

        <aside class="about-aside">
          <figure class="personal-portrait">
            <img :src="personalPortrait" :alt="copy.about.personalAlt" width="720" height="1280" loading="lazy" />
          </figure>
          <GraduationCap :size="28" :stroke-width="1.5" aria-hidden="true" />
          <h2>{{ copy.about.asideTitle }}</h2>
          <p>{{ copy.about.asideText }}</p>
        </aside>
      </div>
    </section>

    <section class="section documents-section">
      <div class="shell documents-grid">
        <div>
          <SectionEyebrow index="02" :label="copy.about.documentsTitle" />
          <h2>{{ copy.about.documentsTitle }}</h2>
        </div>
        <div class="document-list">
          <a v-for="document in documents" :key="document.href" :href="document.href" target="_blank" rel="noopener noreferrer">
            <FileText :size="22" :stroke-width="1.5" aria-hidden="true" />
            <span>{{ document.label() }}</span>
            <ArrowUpRight :size="18" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  </main>
</template>
