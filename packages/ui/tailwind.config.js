// packages/ui/tailwind.config.js
const { join } = require('path')
const sharedConfig = require('@shared/tailwind-config/tailwind.config')

const withMT = require('@material-tailwind/react/utils/withMT')

module.exports = withMT({
  ...sharedConfig,
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, '../../apps/web/**/*.{html,js,ts,jsx,tsx}'), // Ensure web app files can use the shared UI styles
    join(
      __dirname,
      '../../node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}'
    ), // UI package components
    join(
      __dirname,
      '../../node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'
    ) // UI package components
  ]
})
