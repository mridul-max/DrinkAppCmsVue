const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': { // Use '/api' as a common prefix for backend routes
        target: 'https://my-azure-function-kilo-dev.apps.inholland.hcs-lab.nl', // Replace with your backend's base URL
        changeOrigin: true,
        secure: true, // Set to false if using self-signed certificates
        pathRewrite: { '^/api': '' }, // Remove '/api' from proxied requests
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*', // Allows cross-origin requests
    },
  },
});
