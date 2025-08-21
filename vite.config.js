import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This line is the key to the entire deployment.
  base: '/pumping-frequency-estimator/',

  plugins: [react()],

                            server: {
                              host: true,
                            port: 3000,
                            },
})
