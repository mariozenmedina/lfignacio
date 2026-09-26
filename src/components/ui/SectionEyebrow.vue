<script setup>
defineProps({ label: { type: String, required: true }, index: { type: String, default: '' } })
</script>

<template>
  <div class="section-eyebrow">
    <span v-if="index" class="section-eyebrow__index">{{ index }}</span>
    <span>{{ label }}</span>
  </div>
</template>
