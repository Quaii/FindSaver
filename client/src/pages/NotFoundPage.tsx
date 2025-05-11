import { Box, Heading, Text, Button, Container, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const NotFoundPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Container maxW="xl" py={20} sx={{
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '3xl',
      boxShadow: (props) => props.colorMode === 'dark'
        ? '0 12px 40px rgba(26, 173, 25, 0.15)'
        : '0 12px 40px rgba(26, 173, 25, 0.1)',
      bg: (props) => props.colorMode === 'dark'
        ? 'wechat.card.dark'
        : 'wechat.card.light',
      color: (props) => props.colorMode === 'dark'
        ? 'wechat.white'
        : 'wechat.black',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      _hover: {
        boxShadow: (props) => props.colorMode === 'dark'
          ? '0 16px 48px rgba(26, 173, 25, 0.2)'
          : '0 16px 48px rgba(26, 173, 25, 0.15)',
        transform: 'translateY(-2px)'
      },
      animation: 'fadeIn 0.8s ease-out'
    }}>
      <VStack spacing={8} textAlign="center" sx={{ animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <Heading 
          as="h1" 
          size="4xl" 
          bgGradient="linear(to-r, wechat.primary, wechat.official)" 
          bgClip="text"
          letterSpacing="tight"
        >
          404
        </Heading>
        <Heading 
          as="h2" 
          size="xl"
          color={useColorModeValue('wechat.black', 'wechat.white')}
        >
          Page Not Found
        </Heading>
        <Text 
          fontSize="lg" 
          color={useColorModeValue('wechat.text.secondary.light', 'wechat.text.secondary.dark')}
        >
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Box pt={8}>
          <Button
            as={RouterLink}
            to={isAuthenticated ? '/dashboard' : '/'}
            bg="wechat.primary"
            color="white"
            _hover={{ bg: 'wechat.primaryDark' }}
            _active={{ bg: 'wechat.primaryDark' }}
            size="lg"
            h="12"
            px={8}
            fontSize="md"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Return Home'}
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;