module.exports = {
  theme: {
    extend: {
      keyframes: {
        mount: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' }
        },
        unmount: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.9)' }
        }
      },
      animation: {
        mount: 'mount 0.3s ease-out forwards',
        unmount: 'unmount 0.3s ease-in forwards'
      },
      margin: {
        'page-mx': '15%'
      },
      height: {
        section: 'calc(100vh - 4rem)'
      },
      padding: {
        'page-px': '15%',
        'page-px-sm': '5%'
      },
      colors: {
        main: {
          dark: 'rgb(var(--bg-rgb) / <alpha-value>)',
          primary: 'rgb(var(--bg-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--muted-rgb) / <alpha-value>)',
          'dark-light': 'rgb(var(--surface-rgb) / <alpha-value>)',
          light: 'rgb(var(--surface-soft-rgb) / <alpha-value>)',
          'dark-hover': 'rgb(var(--surface-soft-rgb) / <alpha-value>)',
          lightest: 'rgb(var(--border-rgb) / <alpha-value>)',
          shadow: 'rgb(var(--shadow-rgb) / <alpha-value>)',
          'dark-slate': 'rgb(var(--muted-rgb) / <alpha-value>)',
          slate: 'rgb(var(--muted-rgb) / <alpha-value>)',
          'light-slate': 'rgb(var(--muted-rgb) / <alpha-value>)',
          'lightest-slate': 'rgb(var(--text-rgb) / <alpha-value>)',
          white: 'rgb(var(--text-rgb) / <alpha-value>)',
          green: 'rgb(var(--accent-rgb) / <alpha-value>)',
          greenTint: 'rgb(var(--surface-soft-rgb) / <alpha-value>)',
          pink: 'rgb(var(--accent-rgb) / <alpha-value>)',
          blue: 'rgb(var(--accent-rgb) / <alpha-value>)'
        },
        textColor: {
          primary: 'rgb(var(--text-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--muted-rgb) / <alpha-value>)',
          slate: 'rgb(var(--muted-rgb) / <alpha-value>)',
          light: 'rgb(var(--text-rgb) / <alpha-value>)',
          lightSlate: 'rgb(var(--muted-rgb) / <alpha-value>)',
          white: 'rgb(var(--text-rgb) / <alpha-value>)',
          green: 'rgb(var(--accent-rgb) / <alpha-value>)',
          pink: 'rgb(var(--accent-rgb) / <alpha-value>)',
          link: 'rgb(var(--accent-rgb) / <alpha-value>)',
          error: 'rgb(var(--danger-rgb) / <alpha-value>)'
        },
        button: {
          primary: 'rgb(var(--accent-rgb) / <alpha-value>)',
          light: 'rgb(var(--text-rgb) / <alpha-value>)'
        },
        backgroundColor: {
          primary: 'rgb(var(--bg-rgb) / <alpha-value>)',
          darkNavy: 'rgb(var(--bg-rgb) / <alpha-value>)',
          lightestNavy: 'rgb(var(--surface-rgb) / <alpha-value>)',
          gray: 'rgb(var(--border-rgb) / <alpha-value>)',
          lightSlate: 'rgb(var(--muted-rgb) / <alpha-value>)',
          slate: 'rgb(var(--muted-rgb) / <alpha-value>)',
          card: 'rgb(var(--surface-rgb) / <alpha-value>)',
          chat: 'rgb(var(--surface-rgb) / <alpha-value>)',
          button: 'rgb(var(--accent-rgb) / <alpha-value>)',
          buttonHover: 'rgb(var(--accent-rgb) / <alpha-value>)',
          success: 'rgb(var(--accent-rgb) / <alpha-value>)',
          danger: 'rgb(var(--danger-rgb) / <alpha-value>)',
          messageBox: 'rgb(var(--surface-soft-rgb) / <alpha-value>)'
        },
        borderColor: {
          gray: 'rgb(var(--border-rgb) / <alpha-value>)',
          button: 'rgb(var(--accent-rgb) / <alpha-value>)',
          success: 'rgb(var(--accent-rgb) / <alpha-value>)',
          danger: 'rgb(var(--danger-rgb) / <alpha-value>)'
        }
      }
    },
    plugins: [require('@tailwindcss/typography')]
  }
}
