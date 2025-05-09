import { useEffect, useState } from 'react';
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { RootState, useAppDispatch } from '../store';
import { fetchItems, fetchCollections, fetchItemsByCollection } from '../store/itemSlice';
import { setActiveCollection, openScraperModal, openCollectionModal } from '../store/uiSlice';
import ItemCard from '../components/items/ItemCard';
import ScraperModal from '../components/modals/ScraperModal';
import CollectionModal from '../components/modals/CollectionModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { items, collections, loading, error } = useSelector((state: RootState) => state.items);
  const { activeCollection, searchQuery } = useSelector((state: RootState) => state.ui);
  const [filteredItems, setFilteredItems] = useState(items);

  // Fetch collections and items on component mount
  useEffect(() => {
    dispatch(fetchCollections());
    if (activeCollection) {
      dispatch(fetchItemsByCollection(activeCollection));
    } else {
      dispatch(fetchItems());
    }
  }, [dispatch, activeCollection]);

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

  const handleCollectionChange = (collectionName: string | null) => {
    dispatch(setActiveCollection(collectionName));
  };

  return (
    <Container maxW="7xl">
      {/* Modals */}
      <ScraperModal />
      <CollectionModal />
      <DeleteConfirmModal />

      {/* Header */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="xl">
            {activeCollection ? `Collection: ${activeCollection}` : 'All Items'}
          </Heading>
          <HStack spacing={3}>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="brand"
              onClick={() => dispatch(openScraperModal())}
            >
              Add Item
            </Button>
            <Button
              colorScheme="brand"
              variant="outline"
              onClick={() => dispatch(openCollectionModal())}
            >
              New Collection
            </Button>
          </HStack>
        </Flex>

        {/* Collection Filter */}
        <Flex mb={6} wrap="wrap" gap={4} align="center">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
              {activeCollection ? activeCollection : 'All Collections'}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => handleCollectionChange(null)}>All Collections</MenuItem>
              <Divider />
              {collections.map((collection) => (
                <MenuItem
                  key={collection.name}
                  onClick={() => handleCollectionChange(collection.name)}
                >
                  {collection.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {searchQuery && (
            <Tag size="lg" colorScheme="brand" borderRadius="full">
              Search: {searchQuery}
            </Tag>
          )}
        </Flex>
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
              : activeCollection
              ? `You haven't added any items to the "${activeCollection}" collection yet.`
              : "You haven't scraped any items yet."}
          </Text>
          <Button
            colorScheme="brand"
            leftIcon={<AddIcon />}
            onClick={() => dispatch(openScraperModal())}
          >
            Scrape Your First Item
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

export default DashboardPage;