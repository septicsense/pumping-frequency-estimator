import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // *** THIS IS THE CRITICAL ADDITION FOR GITHUB PAGES ***
  base: '/pumping-frequency-estimator/',

  plugins: [react()],

                            // Your existing server configuration is preserved
                            server: {
                              host: true,
                            port: 3000,
                            },
})
