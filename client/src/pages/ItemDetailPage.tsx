import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Image,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Badge,
  Table,
  Tbody,
  Tr,
  Td,
  Tag,
  TagLabel,
  HStack,
  VStack,
  Divider,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { ArrowBackIcon, StarIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { RootState, useAppDispatch } from '../store';
import { fetchItem, toggleFavorite } from '../store/itemSlice';
import { openDeleteConfirm } from '../store/uiSlice';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

const ItemDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentItem, loading, error } = useSelector((state: RootState) => state.items);
  const [selectedImage, setSelectedImage] = useState('');

  // Fetch item details
  useEffect(() => {
    if (itemId) {
      dispatch(fetchItem(itemId));
    }
  }, [dispatch, itemId]);

  // Set the first image as selected when item loads
  useEffect(() => {
    if (currentItem && currentItem.images.length > 0) {
      setSelectedImage(currentItem.images[0]);
    }
  }, [currentItem]);

  const handleToggleFavorite = () => {
    if (currentItem) {
      dispatch(toggleFavorite(currentItem._id));
    }
  };

  const handleDeleteClick = () => {
    if (currentItem) {
      dispatch(openDeleteConfirm({ type: 'item', id: currentItem._id }));
    }
  };

  // Background colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (loading) {
    return (
      <Container maxW="7xl" py={10}>
        <Flex justify="center" align="center" my={10}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={10}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Container>
    );
  }

  if (!currentItem) {
    return (
      <Container maxW="7xl" py={10}>
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Item Not Found</AlertTitle>
          <AlertDescription>The item you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button mt={4} leftIcon={<ArrowBackIcon />} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      {/* Modal */}
      <DeleteConfirmModal />

      {/* Back Button */}
      <Flex mb={6}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Flex>

      {/* Main Content */}
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        {/* Left Column - Images */}
        <GridItem>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={cardBg}
            borderColor={borderColor}
            mb={4}
          >
            <Box position="relative" paddingTop="75%" width="100%">
              <Image
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                src={selectedImage || 'https://via.placeholder.com/600?text=No+Image'}
                alt={currentItem.title}
                objectFit="contain"
              />
            </Box>
          </Box>

          {/* Thumbnail Gallery */}
          {currentItem.images.length > 1 && (
            <Flex overflowX="auto" py={2} gap={2}>
              {currentItem.images.map((image, index) => (
                <Box
                  key={index}
                  width="80px"
                  height="80px"
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  borderColor={selectedImage === image ? 'brand.500' : borderColor}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    width="100%"
                    height="100%"
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    objectFit="cover"
                  />
                </Box>
              ))}
            </Flex>
          )}
        </GridItem>

        {/* Right Column - Details */}
        <GridItem>
          <VStack align="stretch" spacing={6}>
            {/* Title and Actions */}
            <Box>
              <Flex justify="space-between" align="flex-start">
                <Heading as="h1" size="xl" mb={2}>
                  {currentItem.title}
                </Heading>
                <HStack>
                  <IconButton
                    aria-label={currentItem.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    icon={<StarIcon />}
                    colorScheme={currentItem.isFavorite ? 'yellow' : 'gray'}
                    onClick={handleToggleFavorite}
                  />
                  <IconButton
                    aria-label="Delete item"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={handleDeleteClick}
                  />
                </HStack>
              </Flex>

              {/* Price and Source */}
              <Flex justify="space-between" align="center" mt={2} mb={4}>
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                  {currentItem.price || 'Price not available'}
                </Text>
                <HStack>
                  <Badge colorScheme="brand" fontSize="sm">
                    {currentItem.domain}
                  </Badge>
                  <Link href={currentItem.sourceUrl} isExternal>
                    <Button
                      rightIcon={<ExternalLinkIcon />}
                      size="sm"
                      variant="outline"
                    >
                      Visit Source
                    </Button>
                  </Link>
                </HStack>
              </Flex>

              {/* Tags */}
              {currentItem.tags && currentItem.tags.length > 0 && (
                <Box mb={4}>
                  <Text fontWeight="semibold" mb={2}>
                    Tags:
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {currentItem.tags.map((tag) => (
                      <Tag
                        size="md"
                        key={tag}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="brand"
                        my={1}
                      >
                        <TagLabel>{tag}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              )}

              {/* Description */}
              {currentItem.description && (
                <Box mb={4}>
                  <Text fontWeight="semibold" mb={2}>
                    Description:
                  </Text>
                  <Text>{currentItem.description}</Text>
                </Box>
              )}

              <Divider my={4} />

              {/* Product Details */}
              {Object.keys(currentItem.details).length > 0 && (
                <Box mb={4}>
                  <Heading as="h3" size="md" mb={3}>
                    Product Details
                  </Heading>
                  <Table variant="simple" size="sm">
                    <Tbody>
                      {Object.entries(currentItem.details).map(([key, value]) => (
                        <Tr key={key}>
                          <Td fontWeight="semibold" width="40%">
                            {key}
                          </Td>
                          <Td>{value}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}

              {/* Metadata */}
              <Box mt={6} fontSize="sm" color="gray.500">
                <Text>Collection: {currentItem.collection}</Text>
                <Text>Scraped: {new Date(currentItem.scrapedAt).toLocaleString()}</Text>
              </Box>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default ItemDetailPage;