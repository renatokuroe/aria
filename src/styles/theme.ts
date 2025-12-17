import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    colors: {
        brand: {
            50: '#e6f2ff',
            100: '#cce5ff',
            200: '#99cbff',
            300: '#66b0ff',
            400: '#1D8FF2', // Azul botões
            500: '#1D8FF2',
            600: '#1a7acb',
            700: '#1566a3',
            800: '#0f517b',
            900: '#0a3c53',
        },
        title: {
            900: '#002695', // Azul títulos
        },
        dark: {
            50: '#f5f5f5',
            100: '#e8e8e8',
            200: '#d0d0d0',
            300: '#b8b8b8',
            400: '#808080',
            500: '#484848',
            600: '#3a3a3a',
            700: '#2a2a2a',
            800: '#1a1a1a',
            900: '#0a0a0a',
        },
    },
    fonts: {
        body: '"Space Grotesk", sans-serif',
        heading: '"Space Grotesk", sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: 'white',
                color: 'dark.900',
                fontFamily: 'body',
            },
            html: {
                scrollBehavior: 'smooth',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 600,
                borderRadius: 'md',
                transition: 'all 0.3s ease',
            },
            variants: {
                solid: {
                    bg: '#1D8FF2',
                    color: 'white',
                    _hover: {
                        bg: '#1a7acb',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(29, 143, 242, 0.3)',
                    },
                    _active: {
                        bg: '#0f517b',
                    },
                },
                outline: {
                    borderColor: '#1D8FF2',
                    color: '#1D8FF2',
                    _hover: {
                        bg: '#e6f2ff',
                    },
                },
                ghost: {
                    color: 'dark.600',
                    _hover: {
                        bg: 'dark.50',
                    },
                },
            },
            defaultProps: {
                variant: 'solid',
            },
        },
        Heading: {
            baseStyle: {
                color: '#002695',
                fontWeight: 700,
            },
            sizes: {
                xl: {
                    fontSize: '2xl',
                },
                lg: {
                    fontSize: 'xl',
                },
                md: {
                    fontSize: 'lg',
                },
                sm: {
                    fontSize: 'md',
                },
            },
        },
        Input: {
            baseStyle: {
                field: {
                    borderColor: 'dark.200',
                    _focus: {
                        borderColor: '#1D8FF2',
                        boxShadow: '0 0 0 1px rgba(29, 143, 242, 0.1)',
                    },
                },
            },
        },
        Alert: {
            variants: {
                subtle: {
                    container: {
                        bg: '#e6f2ff',
                        borderLeft: '4px solid',
                        borderColor: '#1D8FF2',
                    },
                    title: {
                        color: '#002695',
                    },
                    description: {
                        color: '#1a7acb',
                    },
                },
            },
        },
    },
})

export default theme
