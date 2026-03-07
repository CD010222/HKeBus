// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import { createPinia } from 'pinia'
import PasswordGuard from './PasswordGuard.vue'

/** @type {import('vitepress').Theme} */

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(PasswordGuard, null, {
        default: () => null
      })
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(createPinia())
  }
}
