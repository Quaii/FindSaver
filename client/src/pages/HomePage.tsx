import { Box, Button, Container, Heading, Text, Stack, Image, Flex, SimpleGrid, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiDatabase, FiSearch, FiTag } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  return (
    <Container maxW={'7xl'}>
      {/* Hero Section */}
      <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
          >
            <Text
              as={'span'}
              position={'relative'}
              color={'brand.400'}
            >
              FindSaver
            </Text>
            <br />
            <Text as={'span'} color={'brand.600'}>
              Save & Organize Your Finds
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Easily save and organize product information from TaoBao and agent sites. 
            Our tool automatically converts links from various platforms and extracts all relevant product information,
            allowing you to store your finds so you never forget what was shared with you.
            Track products and organize your personal collection effortlessly.
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Button
              as={RouterLink}
              to={isAuthenticated ? '/dashboard' : '/register'}
              rounded={'full'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              colorScheme={'brand'}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
            <Button
              as={RouterLink}
              to={isAuthenticated ? '/dashboard' : '/login'}
              rounded={'full'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              variant='outline'
              colorScheme={'brand'}
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
            height={'300px'}
            rounded={'2xl'}
            boxShadow={'2xl'}
            width={'full'}
            overflow={'hidden'}
          >
            <Image
              alt={'Hero Image'}
              fit={'cover'}
              align={'center'}
              w={'100%'}
              h={'100%'}
              src={'https://images.unsplash.com/photo-1611174743420-3d7df880ce32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'}
            />
          </Box>
        </Flex>
      </Stack>

      {/* Features Section */}
      <Box py={12}>
        <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }}>
          <Box textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', sm: '4xl' }}
              fontWeight="bold"
              mb={5}
              color={'brand.600'}
            >
              Features
            </Heading>
            <Text fontSize="xl" color={'gray.500'} maxW="3xl" mx="auto">
              Our web scraper provides powerful tools to help you collect and organize product information from various e-commerce websites.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={16}>
            <Feature
              icon={<Icon as={FiSearch} w={10} h={10} />}
              title="Link Conversion & Scraping"
              text="Paste any TaoBao or agent URL and our tool will convert it to CSSBuy format and extract all relevant product information."
            />
            <Feature
              icon={<Icon as={FiDatabase} w={10} h={10} />}
              title="Collections"
              text="Organize saved items into custom collections. Create collections to keep track of products you discover while browsing."
            />
            <Feature
              icon={<Icon as={FiTag} w={10} h={10} />}
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
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'brand.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600} fontSize={'xl'}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default HomePage;