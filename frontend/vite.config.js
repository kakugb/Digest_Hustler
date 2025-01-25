import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  
  plugins: [
    tailwindcss(),
  ],
})
