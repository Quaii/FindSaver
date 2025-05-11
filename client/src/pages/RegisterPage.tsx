import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
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
import { register, clearError, loadUser } from '../store/authSlice';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      isValid = false;
    } else {
      setNameError('');
    }
    
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

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await dispatch(register({ name, email, password })).unwrap();
      if (result.token) {
        // If registration is successful and returns a token, load the user data
        await dispatch(loadUser());
      }
    } catch (err) {
      // Error is handled by the auth slice and displayed via the error state
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '4', sm: '8' }} centerContent sx={{
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
      <Stack spacing="8" sx={{ animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)', willChange: 'transform, opacity' }}>
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>Create an account</Heading>
            <Text color="fg.muted">
              Already have an account? <RouterLink to="/login">Sign in</RouterLink>
            </Text>
          </Stack>
        </Stack>
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          {error && (
            <Alert status="error" mb={4} borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl isInvalid={!!nameError}>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      dispatch(clearError());
                    }}
                  />
                  {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
                </FormControl>
                
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
                
                <FormControl isInvalid={!!confirmPasswordError}>
                  <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      dispatch(clearError());
                    }}
                  />
                  {confirmPasswordError && <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>}
                </FormControl>
              </Stack>
              
              <Stack spacing="6">
                <Button
                type="submit"
                bg="wechat.primary"
                color="white"
                _hover={{ bg: 'wechat.primaryDark' }}
                _active={{ bg: 'wechat.primaryDark' }}
                isLoading={loading}
                loadingText="Creating account"
                w="full"
                fontSize="md"
                h="12"
              >
                Create Account
              </Button>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color="fg.muted">
                    or continue with
                  </Text>
                  <Divider />
                </HStack>
                <Button variant="outline">Google</Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
};

export default RegisterPage;