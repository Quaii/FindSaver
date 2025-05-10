import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// WeChat-inspired color palette
const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff', // WeChat primary blue
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  wechat: {
    green: '#07C160', // WeChat green
    darkBg: '#1F1F1F', // Dark mode background
    darkCard: '#2A2A2A', // Dark mode card background
    darkBorder: '#3A3A3A', // Dark mode borders
    darkText: '#FFFFFF', // Dark mode primary text
    darkTextSecondary: '#AAAAAA', // Dark mode secondary text
  },
};

const theme = extendTheme({ 
  config,
  colors,
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'wechat.darkBg' : 'white',
        color: props.colorMode === 'dark' ? 'wechat.darkText' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: (props: { colorMode: string }) => props.colorMode === 'dark' ? 'whiteAlpha.100' : 'brand.50',
          },
        },
      },
    },
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          bg: props.colorMode === 'dark' ? 'wechat.darkCard' : 'white',
          borderColor: props.colorMode === 'dark' ? 'wechat.darkBorder' : 'gray.200',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: 'lg',
          },
        },
      }),
    },
    Heading: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? 'wechat.darkText' : 'gray.800',
      }),
    },
    Text: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? 'wechat.darkTextSecondary' : 'gray.600',
      }),
    },
  },
});

export default theme;