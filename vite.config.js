import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const normalizeBase = (value) => {
  const base = value || '/~lfignacio/'
  const normalized = base.replace(/^\/+|\/+$/g, '')
  return normalized ? `/${normalized}/` : '/'
}

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH),
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    script: 'defer',
    formatting: 'minify',
  },
})
