import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Enhanced WeChat color palette
const colors = {
  wechat: {
    primary: '#1AAD19', // Active tab green
    primaryDark: '#148812', // Darker shade for hover states
    primaryLight: '#E8F8F0', // Light green for backgrounds
    darkGray: '#8E8E93', // Inactive icons/tabs
    lightGray: '#888888', // Secondary text
    ultraLightGray: '#666666', // Disabled text
    black: '#121212', // Dark mode background
    white: '#FFFFFF', // Primary text light
    border: {
      light: '#EDEDED',
      dark: '#1E1E1E'
    },
    card: {
      light: '#FFFFFF',
      dark: '#242424'
    },
    text: {
      secondary: {
        light: '#888888',
        dark: '#AAAAAA'
      }
    },
    notification: '#FF3B30', // Red notification dot
    official: '#007AFF', // Blue for official accounts
    background: {
      dark: '#121212',
      light: '#F5F5F5'
    }
  },
};

// CSS variables for consistent theming
const styles = {
  global: (props: { colorMode: string }) => ({
    ':root': {
      '--wechat-primary': colors.wechat.primary,
      '--wechat-primary-dark': colors.wechat.primaryDark,
      '--wechat-primary-light': colors.wechat.primaryLight,
      '--wechat-dark-gray': colors.wechat.darkGray,
      '--wechat-light-gray': colors.wechat.lightGray,
      '--wechat-ultra-light-gray': colors.wechat.ultraLightGray,
      '--wechat-black': colors.wechat.black,
      '--wechat-white': colors.wechat.white,
      '--wechat-border': props.colorMode === 'dark' ? colors.wechat.border.dark : colors.wechat.border.light,
      '--wechat-card-bg': props.colorMode === 'dark' ? colors.wechat.card.dark : colors.wechat.card.light,
      '--wechat-secondary-text': props.colorMode === 'dark' ? colors.wechat.text.secondary.dark : colors.wechat.text.secondary.light,
    },
    body: {
      bg: props.colorMode === 'dark' ? 'wechat.black' : 'wechat.white',
      color: props.colorMode === 'dark' ? 'wechat.white' : 'wechat.black',
      fontSize: '16px',
      lineHeight: '1.5',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      transition: 'background-color 0.2s, color 0.2s',
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
        _focus: {
          boxShadow: '0 0 0 2px var(--wechat-primary-light)',
        },
      },
      variants: {
        // Primary button (green with white text)
        primary: {
          bg: 'wechat.primary',
          color: 'wechat.white',
          _hover: {
            bg: 'wechat.primaryDark',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: 'wechat.primaryDark',
            transform: 'translateY(0)',
          },
        },
        // Secondary button (gray outline)
        secondary: {
          bg: 'transparent',
          color: (props: { colorMode: string }) => 
            props.colorMode === 'dark' ? 'wechat.white' : 'wechat.darkGray',
          border: '1px solid',
          borderColor: (props: { colorMode: string }) => 
            props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'wechat.darkGray',
          _hover: {
            bg: (props: { colorMode: string }) => 
              props.colorMode === 'dark' ? 'whiteAlpha.100' : 'wechat.ultraLightGray',
            transform: 'translateY(-1px)',
          },
          _active: {
            transform: 'translateY(0)',
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
          _placeholder: { color: 'var(--wechat-secondary-text)' },
        },
      },
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'wechat.white',
            border: '1px solid',
            borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'wechat.lightGray',
            _focus: {
              borderColor: 'wechat.primary',
              boxShadow: '0 0 0 1px var(--wechat-primary)',
            },
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'wechat.darkGray',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    
    // Card component styling
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          backgroundColor: props.colorMode === 'dark' ? 'wechat.card.dark' : 'wechat.card.light',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'wechat.border.dark' : 'wechat.border.light',
          boxShadow: props.colorMode === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: props.colorMode === 'dark' ? '0 4px 16px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        body: {
          padding: '16px',
        },
        header: {
          padding: '16px',
          borderBottom: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'wechat.border.dark' : 'wechat.border.light',
        },
        footer: {
          padding: '16px',
          borderTop: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'wechat.border.dark' : 'wechat.border.light',
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