// packages/ui/tailwind.config.js
const { join } = require('path');
const sharedConfig = require('@shared/tailwind-config/tailwind.config');

module.exports = {
  ...sharedConfig,
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../../apps/web/**/*.{html,js,ts,jsx,tsx}'), // Ensure web app files can use the shared UI styles
  ]
};
