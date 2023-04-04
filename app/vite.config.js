export default {
  root: './src',
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      '/geoserver': 'http://localhost:8080/'
    },
    port: 8081
  }
}
