import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, useToast, ChakraProvider } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import theme from './theme';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CollectionPage from './pages/CollectionPage';
import ItemDetailPage from './pages/ItemDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

// Redux
import { RootState, useAppDispatch } from './store';
import { loadUser } from './store/authSlice';

function App() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { error } = useSelector((state: RootState) => state.auth);

  // Load user on app load if token exists
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // Show error toast when auth error occurs
  useEffect(() => {
    if (error) {
      toast({
        title: 'Authentication Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    }
  }, [error, toast]);

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
      <Box flex="1" pb="80px" py={8} px={4}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/collections/:collectionId" element={
            <PrivateRoute>
              <CollectionPage />
            </PrivateRoute>
          } />
          <Route path="/items/:itemId" element={
            <PrivateRoute>
              <ItemDetailPage />
            </PrivateRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;