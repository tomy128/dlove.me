import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const envConfig = loadEnv(mode, process.cwd(), '')

  console.log('envConfig: ', Object.fromEntries(Object.entries(envConfig).filter(([key]) => key.startsWith('VITE_'))))
  console.info('Backend Server infos: ', envConfig.VITE_API_BASE_URL + envConfig.VITE_API_URI_PREFIX)

  return {
    build: {
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            elementPlus: ['element-plus'],
            utils: ['axios']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      }
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@router': path.resolve(__dirname, 'src/router'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@views': path.resolve(__dirname, 'src/views'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: ['.dlove.me'],
      proxy: {
        '/api': {
          target: envConfig.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, envConfig.VITE_API_URI_PREFIX)
        }
      }
    }
  }
})