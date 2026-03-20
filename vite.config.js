import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: ruta base donde vivirá la app en GitHub Pages.
  // Debe coincidir exactamente con el nombre del repositorio en GitHub.
  base: '/pokedex-felipe/',
})
