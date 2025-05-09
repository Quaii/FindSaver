import { Box, Heading, Text, Button, Container, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const NotFoundPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Container maxW="xl" py={20}>
      <VStack spacing={6} textAlign="center">
        <Heading as="h1" size="4xl" color="brand.500">
          404
        </Heading>
        <Heading as="h2" size="xl">
          Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.600">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Box pt={6}>
          <Button
            as={RouterLink}
            to={isAuthenticated ? '/dashboard' : '/'}
            colorScheme="brand"
            size="lg"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Return Home'}
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;