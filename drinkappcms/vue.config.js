const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      // Proxy for Azure backend
      '/api': {
        target: 'https://my-azure-function-kilo-dev.apps.inholland.hcs-lab.nl', // Azure backend URL
        changeOrigin: true,
        secure: true, // Set to false if using self-signed certificates
        pathRewrite: { '^/api': '' }, // Remove '/api' from proxied requests
      },
      // Proxy for Go backend
      '/go-api': {
        target: 'https://go-drinkapp-kilo-dev.apps.inholland.hcs-lab.nl/', // Replace with your Go backend URL
        changeOrigin: true,
        secure: true, // Set to false if using self-signed certificates
        pathRewrite: { '^/go-api': '' }, // Remove '/go-api' from proxied requests
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*', // Allows cross-origin requests
    },
  },
});