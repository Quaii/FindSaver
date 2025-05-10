import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// WeChat color palette
const colors = {
  wechat: {
    primary: '#07C160', // Primary green
    darkGray: '#7F7F7F', // Dark UI gray
    lightGray: '#EDEDED', // Light UI gray
    ultraLightGray: '#F7F7F7', // Ultra-light UI gray
    black: '#000000', // Black
    white: '#FFFFFF', // White
  },
};

// CSS variables for consistent theming
const styles = {
  global: (props: { colorMode: string }) => ({
    ':root': {
      '--wechat-primary': '#07C160',
      '--wechat-dark-gray': '#7F7F7F',
      '--wechat-light-gray': '#EDEDED',
      '--wechat-ultra-light-gray': '#F7F7F7',
      '--wechat-black': '#000000',
      '--wechat-white': '#FFFFFF',
    },
    body: {
      bg: props.colorMode === 'dark' ? 'wechat.black' : 'wechat.white',
      color: props.colorMode === 'dark' ? 'wechat.white' : 'wechat.black',
      fontSize: '16px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  }),
};


const theme = extendTheme({ 
  config,
  colors,
  styles,
  components: {
    // Button component styling
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: '4px',
        fontSize: '16px',
        transition: 'all 0.2s',
      },
      variants: {
        // Primary button (green with white text)
        primary: {
          bg: 'wechat.primary',
          color: 'wechat.white',
          _hover: {
            bg: 'wechat.primary',
            opacity: 0.9,
          },
          _active: {
            bg: 'wechat.primary',
            opacity: 0.8,
          },
        },
        // Secondary button (gray outline)
        secondary: {
          bg: 'transparent',
          color: (props: { colorMode: string }) => 
            props.colorMode === 'dark' ? 'wechat.white' : 'wechat.darkGray',
          border: '1px solid',
          borderColor: 'wechat.darkGray',
          _hover: {
            bg: (props: { colorMode: string }) => 
              props.colorMode === 'dark' ? 'whiteAlpha.100' : 'wechat.ultraLightGray',
          },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    
    // Input component styling
    Input: {
      baseStyle: {
        field: {
          borderRadius: '4px',
          fontSize: '16px',
          _placeholder: { color: 'wechat.darkGray' },
        },
      },
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'wechat.white',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'wechat.lightGray',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'wechat.darkGray',
            },
            _focus: {
              borderColor: 'wechat.primary',
              boxShadow: '0 0 0 1px var(--wechat-primary)',
            },
          },
        }),
      },
    },
    
    // Card component styling
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          borderRadius: '8px',
          boxShadow: 'sm',
          overflow: 'hidden',
          bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'wechat.white',
          borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'wechat.lightGray',
        },
      }),
    },
    
    // Text component styling
    Text: {
      baseStyle: (props: { colorMode: string }) => ({
        color: props.colorMode === 'dark' ? 'wechat.white' : 'wechat.black',
        fontSize: '16px',
      }),
      variants: {
        small: (props: { colorMode: string }) => ({
          fontSize: '14px',
          color: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'wechat.darkGray',
        }),
      },
    },
    
    // Navigation component styling
    Tabs: {
      baseStyle: (props: { colorMode: string }) => ({
        tab: {
          fontSize: '14px',
          fontWeight: 'medium',
          color: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'wechat.darkGray',
          _selected: {
            color: 'wechat.primary',
          },
        },
        tablist: {
          bg: props.colorMode === 'dark' ? 'wechat.black' : 'wechat.white',
          borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'wechat.lightGray',
        },
      }),
    },
  },
  
  // Custom layer styles for special effects
  layerStyles: {
    // Blurred footer/control bar
    blurredFooter: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '16px',
      backdropFilter: 'blur(12px)',
      background: 'linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))',
      borderTop: '1px solid',
      borderColor: 'wechat.lightGray',
      zIndex: 10,
    },
    // Dark mode variant of the blurred footer
    blurredFooterDark: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '16px',
      backdropFilter: 'blur(12px)',
      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))',
      borderTop: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      zIndex: 10,
    },
    // Bottom navigation bar
    bottomNav: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      height: '60px',
      bg: (props: { colorMode: string }) => props.colorMode === 'dark' ? 'wechat.black' : 'wechat.white',
      borderTop: '1px solid',
      borderColor: (props: { colorMode: string }) => 
        props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'wechat.lightGray',
    },
  },
});

export default theme;