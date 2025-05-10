import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  FormErrorMessage,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  Text,
  Switch,
  InputGroup,
  InputRightElement,
  Box,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';
import { RootState } from '../../store';
import { closeScraperModal } from '../../store/uiSlice';
import { scrapeUrl } from '../../store/itemSlice';

const ScraperModal = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { isScraperModalOpen } = useSelector((state: RootState) => state.ui);
  const { collections, loading, error } = useSelector((state: RootState) => state.items);
  
  const [url, setUrl] = useState('');
  // Removed bulk conversion feature as it's not needed
  // Bulk mode has been completely removed
  const [collection, setCollection] = useState('');
  const [useJavaScript, setUseJavaScript] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [urlError, setUrlError] = useState('');
  const [collectionError, setCollectionError] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  // Bulk functionality has been completely removed

  // Reset form when modal opens
  useEffect(() => {
    if (isScraperModalOpen) {
      setUrl('');
      setCollection(collections.length > 0 ? collections[0].name : '');
      setUseJavaScript(false);
      setTags([]);
      setTagInput('');
      setUrlError('');
      setCollectionError('');
      setConvertedUrl('');
    }
  }, [isScraperModalOpen, collections]);
  
  // Function to convert a single URL
  const handleConvertUrl = async () => {
    if (!url.trim()) {
      setUrlError('Paste any Taobao or agent URL and our tool will convert it to CSS by format and extract all relevant product information.');
      return;
    }
    
    setIsConverting(true);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.convertedUrl) {
        setConvertedUrl(data.convertedUrl);
        setUrlError('');
      } else {
        setUrlError(data.message || 'Failed to convert URL');
        setConvertedUrl('');
      }
    } catch (err) {
      setUrlError('Error converting URL');
      setConvertedUrl('');
    } finally {
      setIsConverting(false);
    }
  };
  
  // Bulk conversion feature removed as requested

  const handleClose = () => {
    dispatch(closeScraperModal());
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Validate URL
    if (!url.trim()) {
      setUrlError('URL is required');
      isValid = false;
    } else if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
      setUrlError('Please enter a valid URL');
      isValid = false;
    } else {
      setUrlError('');
    }

    // Validate collection
    if (!collection) {
      setCollectionError('Please select a collection');
      isValid = false;
    } else {
      setCollectionError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Use converted URL if available, otherwise use the original URL
      const urlToScrape = convertedUrl || url;
      
      await dispatch(scrapeUrl({
        url: urlToScrape,
        collection,
        useJavaScript,
        tags
      }));
      
      toast({
        title: 'Scraping started',
        description: 'Your item is being scraped. This may take a moment.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
      
      handleClose();
    } catch (err) {
      toast({
        title: 'Scraping failed',
        description: error || 'Failed to scrape URL. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isScraperModalOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Scrape New Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!urlError}>
              <FormLabel>URL to Scrape</FormLabel>
              <InputGroup>
                <Input 
                  placeholder="Paste any Taobao or agent URL and our tool will convert it to CSS by format and extract all relevant product information" 
                  value={url} 
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setConvertedUrl('');
                  }}
                  isDisabled={isConverting}
                />
                <InputRightElement width="4.5rem">
                  <Button 
                    h="1.75rem" 
                    size="sm" 
                    onClick={handleConvertUrl}
                    isLoading={isConverting}
                  >
                    Convert
                  </Button>
                </InputRightElement>
              </InputGroup>
              {urlError && <FormErrorMessage>{urlError}</FormErrorMessage>}
              {convertedUrl && (
                <Box mt={2} p={2} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">Converted URL:</Text>
                  <Text wordBreak="break-all">{convertedUrl}</Text>
                </Box>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!collectionError}>
              <FormLabel>Save to Collection</FormLabel>
              <Select 
                placeholder="Select collection" 
                value={collection} 
                onChange={(e) => setCollection(e.target.value)}
              >
                {collections.map((col) => (
                  <option key={col.name} value={col.name}>
                    {col.name}
                  </option>
                ))}
              </Select>
              {collectionError && <FormErrorMessage>{collectionError}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <Flex mb={2}>
                <Input
                  placeholder="Add tags (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  mr={2}
                />
                <Button onClick={handleAddTag}>Add</Button>
              </Flex>
              <HStack spacing={2} flexWrap="wrap">
                {tags.map((tag) => (
                  <Tag
                    size="md"
                    key={tag}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="brand"
                    my={1}
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="use-javascript" mb="0">
                Use JavaScript (for dynamic content)
              </FormLabel>
              <Switch
                id="use-javascript"
                isChecked={useJavaScript}
                onChange={(e) => setUseJavaScript(e.target.checked)}
              />
            </FormControl>

            <Text fontSize="sm" color="gray.500">
              Note: Using JavaScript for scraping may take longer but is necessary for some websites with dynamic content.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="brand" 
            onClick={handleSubmit} 
            isLoading={loading}
            loadingText="Scraping"
          >
            Scrape
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScraperModal;