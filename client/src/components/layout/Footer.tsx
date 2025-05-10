import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react';

const Footer = () => {
  // Use WeChat theme colors for the footer
  const textColor = useColorModeValue('wechat.black', 'wechat.white');
  const secondaryTextColor = useColorModeValue('wechat.darkGray', 'rgba(255, 255, 255, 0.7)');
  const borderColor = useColorModeValue('wechat.lightGray', 'rgba(255, 255, 255, 0.1)');
  
  // Apply blurred footer effect using CSS
  const blurredStyle = {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)', // For Safari
    background: useColorModeValue(
      'linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))',
      'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))'
    ),
    borderTop: '1px solid',
    borderColor: borderColor,
    zIndex: 10,
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      py={4}
      mt="auto"
      color={textColor}
      sx={blurredStyle}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={2}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text fontSize="sm" color={secondaryTextColor}>© {new Date().getFullYear()} FindSaver. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href={'#'} color={secondaryTextColor} fontSize="sm" _hover={{ color: 'wechat.primary' }}>Privacy</Link>
          <Link href={'#'} color={secondaryTextColor} fontSize="sm" _hover={{ color: 'wechat.primary' }}>Terms</Link>
          <Link href={'#'} color={secondaryTextColor} fontSize="sm" _hover={{ color: 'wechat.primary' }}>Contact</Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;