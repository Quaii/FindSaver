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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  InputGroup,
  InputRightElement,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Textarea,
  Badge,
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
  const [bulkUrls, setBulkUrls] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [collection, setCollection] = useState('');
  const [useJavaScript, setUseJavaScript] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [urlError, setUrlError] = useState('');
  const [collectionError, setCollectionError] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResults, setConversionResults] = useState<Array<{originalUrl: string, convertedUrl: string | null, isValid: boolean, isConvertible: boolean}>>([]);

  // Reset form when modal opens
  useEffect(() => {
    if (isScraperModalOpen) {
      setUrl('');
      setBulkUrls('');
      setIsBulkMode(false);
      setCollection(collections.length > 0 ? collections[0].name : '');
      setUseJavaScript(false);
      setTags([]);
      setTagInput('');
      setUrlError('');
      setCollectionError('');
      setConvertedUrl('');
      setConversionResults([]);
    }
  }, [isScraperModalOpen, collections]);
  
  // Function to convert a single URL
  const handleConvertUrl = async () => {
    if (!url.trim()) {
      setUrlError('URL is required');
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
  
  // Function to convert bulk URLs
  const handleBulkConvert = async () => {
    if (!bulkUrls.trim()) {
      setUrlError('Please enter at least one URL');
      return;
    }
    
    const urlList = bulkUrls.split('\n').filter(u => u.trim());
    
    setIsConverting(true);
    try {
      const response = await fetch('/api/convert/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlList }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setConversionResults(data.results);
        setUrlError('');
      } else {
        setUrlError(data.message || 'Failed to convert URLs');
        setConversionResults([]);
      }
    } catch (err) {
      setUrlError('Error converting URLs');
      setConversionResults([]);
    } finally {
      setIsConverting(false);
    }
  };

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
    if (isBulkMode) {
      if (!bulkUrls.trim()) {
        setUrlError('Please enter at least one URL');
        isValid = false;
      } else {
        setUrlError('');
      }
    } else {
      if (!url.trim()) {
        setUrlError('URL is required');
        isValid = false;
      } else if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
        setUrlError('Please enter a valid URL');
        isValid = false;
      } else {
        setUrlError('');
      }
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
      if (isBulkMode) {
        // Handle bulk scraping
        const urlList = bulkUrls.split('\n').filter(u => u.trim());
        
        // For now, just scrape the first valid URL
        // In a real implementation, you might want to queue these for processing
        const validUrl = urlList.find(u => u.match(/^(http|https):\/\/[^ "]+$/));
        
        if (validUrl) {
          await dispatch(scrapeUrl({
            url: validUrl,
            collection,
            useJavaScript,
            tags
          }));
        } else {
          throw new Error('No valid URLs found');
        }
      } else {
        // Use converted URL if available, otherwise use the original URL
        const urlToScrape = convertedUrl || url;
        
        await dispatch(scrapeUrl({
          url: urlToScrape,
          collection,
          useJavaScript,
          tags
        }));
      }
      
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
            <Tabs isFitted variant="enclosed" onChange={(index) => setIsBulkMode(index === 1)}>
              <TabList mb="1em">
                <Tab>Single URL</Tab>
                <Tab>Bulk Convert</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <FormControl isRequired isInvalid={!!urlError}>
                    <FormLabel>URL to Scrape</FormLabel>
                    <InputGroup>
                      <Input 
                        placeholder="https://item.taobao.com/item.htm?id=123456789" 
                        value={url} 
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setConvertedUrl('');
                        }}
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
                      <Box mt={2} p={2} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold">Converted URL:</Text>
                        <Text fontSize="sm" wordBreak="break-all">{convertedUrl}</Text>
                      </Box>
                    )}
                  </FormControl>
                </TabPanel>
                <TabPanel p={0}>
                  <FormControl isRequired isInvalid={!!urlError}>
                    <FormLabel>Bulk URLs (one per line)</FormLabel>
                    <Textarea
                      placeholder="https://item.taobao.com/item.htm?id=123456789\nhttps://item.taobao.com/item.htm?id=987654321"
                      value={bulkUrls}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setBulkUrls(e.target.value);
                        setConversionResults([]);
                      }}
                      minHeight="120px"
                    />
                    {urlError && <FormErrorMessage>{urlError}</FormErrorMessage>}
                    <Button
                      mt={2}
                      onClick={handleBulkConvert}
                      isLoading={isConverting}
                      size="sm"
                    >
                      Convert All
                    </Button>
                    
                    {conversionResults.length > 0 && (
                      <Box mt={3} maxHeight="200px" overflowY="auto">
                        <Table size="sm" variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Original URL</Th>
                              <Th>Status</Th>
                              <Th>Converted URL</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {conversionResults.map((result, index) => (
                              <Tr key={index}>
                                <Td fontSize="xs" maxWidth="150px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                  {result.originalUrl}
                                </Td>
                                <Td>
                                  {result.isConvertible ? (
                                    <Badge colorScheme="green">Success</Badge>
                                  ) : (
                                    <Badge colorScheme="red">Failed</Badge>
                                  )}
                                </Td>
                                <Td fontSize="xs" maxWidth="150px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                  {result.convertedUrl || 'N/A'}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>

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