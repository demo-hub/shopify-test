require("dotenv").config();
const webpack = require('webpack');
const { default: Shopify } = require('@shopify/shopify-api');

const apiKey = JSON.stringify(Shopify.Context.API_KEY);

module.exports = {
    webpack: (config) => {
        const env = { API_KEY: apiKey };
        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
    },
};

SHOPIFY_API_KEY = '6510eb8ccb03a955cd8b72a9133a50c6'
SHOPIFY_API_SECRET = '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'
SHOPIFY_API_SCOPES = read_products, write_products, read_orders
SHOPIFY_APP_URL = 'https://600c4728ea7c.ngrok.io'