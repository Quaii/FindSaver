import { Box, Button, Container, Heading, Text, Stack, Image, Flex, SimpleGrid, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiDatabase, FiSearch, FiTag } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return (
    <Container maxW={'7xl'} px={{ base: 4, md: 8 }} py={{ base: 10, md: 20 }} centerContent position="relative" sx={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '3xl', boxShadow: '0 12px 40px rgba(31, 38, 135, 0.15)', background: 'rgba(255,255,255,0.8)', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', _hover: { boxShadow: '0 16px 48px rgba(31, 38, 135, 0.2)', transform: 'translateY(-2px)' } }}>
      {/* Hero Section */}
      <Stack
        align={'center'}
        spacing={{ base: 10, md: 16 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
        position="relative"
        w="full"
        sx={{
          animation: 'fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Stack flex={1} spacing={{ base: 6, md: 10 }} px={{ base: 0, md: 8 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={700}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            color={'wechat.primary'}
            sx={{
              textShadow: '0 4px 12px rgba(7,193,96,0.12)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              _hover: { textShadow: '0 6px 16px rgba(7,193,96,0.18)' }
            }}
          >
            <Text as={'span'} position={'relative'} color={'wechat.primary'}>
              FindSaver
            </Text>
            <br />
            <Text as={'span'} color={'wechat.darkGray'} fontWeight={500} fontSize={{ base: 'xl', md: '2xl' }}>
              Save & Organize Your Finds
            </Text>
          </Heading>
          <Text color={'wechat.darkGray'} fontSize={{ base: 'md', md: 'lg' }}>
            Easily save and organize product information from TaoBao and agent sites. Our tool automatically converts links from various platforms and extracts all relevant product information, allowing you to store your finds so you never forget what was shared with you. Track products and organize your personal collection effortlessly.
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: 'column', sm: 'row' }}
            pt={2}
          >
            <Button
              as={RouterLink}
              to={isAuthenticated ? '/dashboard' : '/register'}
              rounded={'full'}
              size={'lg'}
              fontWeight={'bold'}
              px={8}
              colorScheme={'wechat'}
              bg={'wechat.primary'}
              color={'white'}
              _hover={{ bg: 'wechat.primaryDark', transform: 'scale(1.04)' }}
              sx={{ transition: 'all 0.2s cubic-bezier(.4,0,.2,1)' }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
            <Button
              as={RouterLink}
              to={isAuthenticated ? '/dashboard' : '/login'}
              rounded={'full'}
              size={'lg'}
              fontWeight={'bold'}
              px={8}
              variant='outline'
              colorScheme={'wechat'}
              color={'wechat.primary'}
              borderColor={'wechat.primary'}
              _hover={{ bg: 'wechat.primaryLight', color: 'wechat.black', transform: 'scale(1.04)' }}
              sx={{ transition: 'all 0.2s cubic-bezier(.4,0,.2,1)' }}
            >
              {isAuthenticated ? 'View Collections' : 'Sign In'}
            </Button>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          justify={'center'}
          align={'center'}
          position={'relative'}
          w={'full'}
        >
          <Box
            position={'relative'}
            height={{ base: '220px', md: '320px' }}
            rounded={'2xl'}
            boxShadow={'2xl'}
            width={'full'}
            overflow={'hidden'}
            sx={{
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              _hover: { 
                transform: 'scale(1.04)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.15)'
              },
            }}
          >
            <Image
              alt={'Hero Image'}
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={'100%'}
              src={'https://images.unsplash.com/photo-1611174743420-3d7df880ce32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'}
              sx={{ filter: 'blur(0.5px) brightness(0.98)', transition: 'filter 0.3s' }}
            />
          </Box>
        </Flex>
      </Stack>

      {/* Features Section */}
      <Box py={16} w="full">
        <Box maxW="7xl" mx="auto" px={{ base: 2, md: 8 }}>
          <Box textAlign="center" mb={10}>
            <Heading
              as="h2"
              fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
              fontWeight="bold"
              mb={4}
              color={'wechat.primary'}
              sx={{ letterSpacing: '0.01em' }}
            >
              Features
            </Heading>
            <Text fontSize={{ base: 'md', md: 'xl' }} color={'wechat.darkGray'} maxW="3xl" mx="auto">
              Our web scraper provides powerful tools to help you collect and organize product information from various e-commerce websites.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={10}>
            <Feature
              icon={<Icon as={FiSearch} w={10} h={10} color="wechat.primary" />}
              title="Link Conversion & Scraping"
              text="Paste any TaoBao or agent URL and our tool will convert it to CSSBuy format and extract all relevant product information."
            />
            <Feature
              icon={<Icon as={FiDatabase} w={10} h={10} color="wechat.primary" />}
              title="Collections"
              text="Organize saved items into custom collections. Create collections to keep track of products you discover while browsing."
            />
            <Feature
              icon={<Icon as={FiTag} w={10} h={10} color="wechat.primary" />}
              title="Personal Storage"
              text="Never forget what was shared with you. Save links and product details for future reference in your personal collection."
            />
          </SimpleGrid>
        </Box>
      </Box>
    </Container>
  );
};

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack align={'center'} textAlign={'center'} spacing={6} px={4} py={6} sx={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '2xl', boxShadow: '0 4px 16px rgba(7,193,96,0.08)', _hover: { boxShadow: '0 8px 24px rgba(7,193,96,0.15)', transform: 'translateY(-4px) scale(1.02)' }, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'wechat.primary'}
        mb={2}
        sx={{ boxShadow: '0 2px 8px rgba(7,193,96,0.10)', transition: 'background 0.3s' }}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={{ base: 'lg', md: 'xl' }} color={'wechat.primary'}>{title}</Text>
      <Text color={'wechat.darkGray'} fontSize={{ base: 'sm', md: 'md' }}>{text}</Text>
    </Stack>
  );
};

export default HomePage;