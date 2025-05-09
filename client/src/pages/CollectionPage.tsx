import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  HStack,
  Badge,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { RootState, useAppDispatch } from '../store';
import { fetchItemsByCollection } from '../store/itemSlice';
import { openScraperModal, openDeleteConfirm, setActiveCollection } from '../store/uiSlice';
import ItemCard from '../components/items/ItemCard';
import ScraperModal from '../components/modals/ScraperModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

const CollectionPage = () => {
  const { collectionName } = useParams<{ collectionName: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, collections, loading, error } = useSelector((state: RootState) => state.items);
  const { searchQuery } = useSelector((state: RootState) => state.ui);
  const [filteredItems, setFilteredItems] = useState(items);

  // Set active collection and fetch items
  useEffect(() => {
    if (collectionName) {
      dispatch(setActiveCollection(collectionName));
      dispatch(fetchItemsByCollection(collectionName));
    }

    // Cleanup when unmounting
    return () => {
      dispatch(setActiveCollection(null));
    };
  }, [dispatch, collectionName]);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery]);

  // Find current collection details
  const currentCollection = collections.find((c) => c.name === collectionName);

  const handleDeleteCollection = () => {
    if (collectionName) {
      dispatch(openDeleteConfirm({ type: 'collection', id: collectionName }));
    }
  };

  return (
    <Container maxW="7xl">
      {/* Modals */}
      <ScraperModal />
      <DeleteConfirmModal />

      {/* Header */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <HStack>
            <IconButton
              aria-label="Back to dashboard"
              icon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            />
            <Heading as="h1" size="xl">
              {collectionName}
            </Heading>
            {currentCollection?.isPublic && (
              <Badge colorScheme="green" ml={2}>
                Public
              </Badge>
            )}
          </HStack>
          <HStack spacing={3}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={() => dispatch(openScraperModal())}
            >
              Add Item
            </Button>
            <Tooltip label="Delete this collection">
              <IconButton
                aria-label="Delete collection"
                icon={<DeleteIcon />}
                colorScheme="red"
                variant="outline"
                onClick={handleDeleteCollection}
              />
            </Tooltip>
          </HStack>
        </Flex>

        {currentCollection?.description && (
          <Text color="gray.600" mb={4}>
            {currentCollection.description}
          </Text>
        )}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading Spinner */}
      {loading && (
        <Flex justify="center" align="center" my={10}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Flex>
      )}

      {/* No Items Message */}
      {!loading && filteredItems.length === 0 && (
        <Box textAlign="center" py={10}>
          <Heading as="h3" size="lg" mb={3}>
            No items found
          </Heading>
          <Text mb={6}>
            {searchQuery
              ? 'No items match your search criteria.'
              : `You haven't added any items to the "${collectionName}" collection yet.`}
          </Text>
          <Button
            colorScheme="brand"
            leftIcon={<AddIcon />}
            onClick={() => dispatch(openScraperModal())}
          >
            Add Your First Item
          </Button>
        </Box>
      )}

      {/* Items Grid */}
      {!loading && filteredItems.length > 0 && (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={10}>
          {filteredItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default CollectionPage;