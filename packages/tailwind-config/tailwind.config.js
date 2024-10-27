module.exports = {
    theme: {
        extend: {
            margin: {
                'page-mx': '15%',
            },
            height: {
                'section': 'calc(100vh - 4rem)',
            },
            padding: {
                'page-px': '15%',
                'page-px-sm': '5%',
            },
            colors: {
                textColor: {
                    primary: '#010D1A',
                    secondary: '#495670',
                    slate: '#8892b0',
                    light: '#E2E8F0',
                    lightSlate: '#a8b2d1',
                    white: '#e6f1ff',
                    green: '#64ffda',
                    pink: '#f57dff',
                    link: '#57cbff',
                    error: '#FF3B30',
                },
                main: {
                    dark: '#020c1b',
                    primary: '#010D1A',
                    'dark-light': '#132033',
                    light: '#112240',
                    'dark-hover': 'rgba(26, 42, 58, 0.2)',
                    'lightest': '#233554',
                    shadow: 'rgba(2, 12, 27, 0.7)',
                    'dark-slate': '#495670',
                    slate: '#8892b0',
                    'light-slate': '#a8b2d1',
                    'lightest-slate': '#ccd6f6',
                    white: '#e6f1ff',
                    green: '#64ffda',
                    greenTint: 'rgba(100, 255, 218, 0.1)',
                    pink: '#f57dff',
                    blue: '#57cbff',
                },
                button: {
                    primary: 'rgba(45,212,191,0.1)',
                    light: '#e6f1ff'
                },
                backgroundColor: {
                    primary: '#010D1A',
                    darkNavy: '#020c1b',
                    lightestNavy: '#233554',
                    gray: '#495670',
                    lightSlate: '#a8b2d1',
                    slate: '#8892b0',
                    card: '#FAFAFA',
                    chat: '#FAFAFA',
                    button: '#57cbff',
                    buttonHover: '#005BB5',
                    success: '#64ffda',
                    danger: '#FF3B30',
                    messageBox: '#f3f3f3',
                },

                borderColor: {
                    gray: '#a8b2d1',
                    button: '#57cbff',
                    success: '#64ffda',
                    danger: '#FF3B30',
                },
            },
        },
        plugins: [require('@tailwindcss/typography')]
    }
}
