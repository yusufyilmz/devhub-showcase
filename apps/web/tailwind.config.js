const { join } = require('path');

const withMT = require('@material-tailwind/react/utils/withMT');

const sharedConfig = require('@shared/tailwind-config/tailwind.config');

module.exports = withMT({
    ...sharedConfig,
    content: [
        join(__dirname, 'app/**/*.{js,html,ts,jsx,tsx}'),
        join(__dirname, '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'), // UI package components
        join(__dirname, '../../node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}'), // UI package components
        join(__dirname, '../../node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'), // UI package components
    ],
});
