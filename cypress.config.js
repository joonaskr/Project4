const {defineConfig} = require("cypress");

module.exports = defineConfig({
    viewportWidth: 1200,
    viewportHeight: 1200,
    pageLoadTimeout: 15000,
    



    env: {
        firstCookieValue: "firstValue",
    },

    e2e: {
        setupNodeEvents(on, config) {
            return config;
        }
    },
});
