import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pumping-frequency-estimator/',
  plugins: [react()],
                            server: {
                              host: true,
                              port: 3000,
                            },
})
