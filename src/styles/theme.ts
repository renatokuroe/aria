import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      300: '#81c784',
      400: '#66bb6a',
      500: '#4caf50', // Verde primário
      600: '#43a047',
      700: '#388e3c',
      800: '#2e7d32',
      900: '#1b5e20',
    },
    title: {
      900: '#1b5e20', // Verde escuro para títulos
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
          bg: '#43a047',
          color: 'white',
          _hover: {
            bg: '#388e3c',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)',
          },
          _active: {
            bg: '#2e7d32',
          },
        },
        outline: {
          borderColor: '#43a047',
          color: '#43a047',
          _hover: {
            bg: '#e8f5e9',
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
        color: '#1b5e20',
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
            borderColor: '#4caf50',
            boxShadow: '0 0 0 1px rgba(76, 175, 80, 0.1)',
          },
        },
      },
    },
    Alert: {
      variants: {
        subtle: {
          container: {
            bg: '#e8f5e9',
            borderLeft: '4px solid',
            borderColor: '#4caf50',
          },
          title: {
            color: '#1b5e20',
          },
          description: {
            color: '#43a047',
          },
        },
      },
    },
  },
})

export default theme
