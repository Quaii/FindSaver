import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  FormErrorMessage,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { login, clearError } from '../store/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const { error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [showLoginError, setShowLoginError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginError(true);
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);  // Set loading state before login attempt
      await dispatch(login({ email, password }));
    } catch (err) {
      // Error is handled by the auth slice
    } finally {
      setIsLoading(false);  // Reset loading state after login attempt
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '4', md: '8' }} centerContent>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>Log in to your account</Heading>
            <Text color="fg.muted">
              Don't have an account? <RouterLink to="/register">Sign up</RouterLink>
            </Text>
          </Stack>
        </Stack>
        <Box
            py={{ base: '6', sm: '8' }}
            px={{ base: '6', sm: '10' }}
            bg={useColorModeValue('wechat.card.light', 'wechat.card.dark')}
            boxShadow='none'
            borderRadius='xl'
            border='1px solid'
            borderColor={useColorModeValue('wechat.border.light', 'wechat.border.dark')}
          >
          {error && showLoginError && (  // Only show error if showLoginError is true
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isInvalid={!!emailError}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      dispatch(clearError());
                    }}
                  />
                  {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!passwordError}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      dispatch(clearError());
                    }}
                  />
                  {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                </FormControl>
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                <Button variant="link" colorScheme="brand" size="sm">
                  Forgot password?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button
                  type="submit"
                  bg="wechat.primary"
                  color="white"
                  _hover={{ bg: 'wechat.primaryDark' }}
                  _active={{ bg: 'wechat.primaryDark' }}
                  isLoading={isLoading}  // Use the new loading state
                  loadingText="Signing in"
                  w="full"
                  fontSize="md"
                  h="12"
                >
                  Sign in
                </Button>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color="fg.muted">
                    or continue with
                  </Text>
                  <Divider />
                </HStack>
                <Button
                  variant="outline"
                  borderColor={useColorModeValue('wechat.border.light', 'wechat.border.dark')}
                  _hover={{
                    bg: (props) => props.colorMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.50'
                  }}
                  w="full"
                  h="12"
                >
                  <Text color="wechat.text.secondary.light">Continue with Google</Text>
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginPage;