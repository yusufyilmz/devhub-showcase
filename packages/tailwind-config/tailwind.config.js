module.exports = {
    content: [
        "../../packages/ui/src/components/**/*.{js,ts,jsx,tsx}",
        "../../apps/web/src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            margin: {
                'page-mx': '15%',
            },
            padding: {
                'page-px': '15%',
                'page-px-sm': '5%',
            },
            colors: {
                main: {
                    black: '#000000',
                    gray: '#A3AAAE',
                    white: '#FFFFFF',
                    silver: '#D0D3D4',
                    blue: '#0071E3',
                    green: '#28CD41',
                    red: '#FF3B30',
                },
                button: {
                    light: '#f5f5f7',
                    dark: '#000000',
                },
                backgroundColor: {
                    primary: '#000000',
                    gray: '#A3AAAE',
                    light: '#FFFFFF',
                    card: '#FAFAFA',
                    chat: '#FAFAFA',
                    button: '#0071E3',
                    buttonHover: '#005BB5',
                    success: '#28CD41',
                    danger: '#FF3B30',
                    messageBox: '#f3f3f3',
                },
                textColor: {
                    primary: '#000000',
                    secondary: '#555555',
                    // #555555
                    gray: '#A3AAAE',
                    light: '#FFFFFF',
                    buttonText: '#FFFFFF',
                    link: '#0071E3',
                    error: '#FF3B30',
                },
                borderColor: {
                    gray: '#D0D3D4',
                    button: '#0071E3',
                    success: '#28CD41',
                    danger: '#FF3B30',
                },
            
            },
        },
        plugins: [require('@tailwindcss/typography')]
    }
}
