const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  env: {
    coverage: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config); // Оставить только этот вызов
      return config;
    },
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/index.js",
  },
});
