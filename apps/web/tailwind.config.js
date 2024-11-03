const { join } = require('path');
const sharedConfig = require('@shared/tailwind-config/tailwind.config');

module.exports = {
    ...sharedConfig,
    content: [
        join(__dirname, 'app/**/*.{js,html,ts,jsx,tsx}'),
        join(__dirname, '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'), // UI package components
    ],
};
