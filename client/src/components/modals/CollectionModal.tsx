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
  Textarea,
  Switch,
  VStack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { closeCollectionModal } from '../../store/uiSlice';
import { createCollection } from '../../store/itemSlice';

const CollectionModal = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { isCollectionModalOpen } = useSelector((state: RootState) => state.ui);
  const { loading, error } = useSelector((state: RootState) => state.items);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [nameError, setNameError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isCollectionModalOpen) {
      setName('');
      setDescription('');
      setIsPublic(false);
      setNameError('');
    }
  }, [isCollectionModalOpen]);

  const handleClose = () => {
    dispatch(closeCollectionModal());
  };

  const validateForm = () => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Collection name is required');
      isValid = false;
    } else if (name.length < 3) {
      setNameError('Collection name must be at least 3 characters');
      isValid = false;
    } else {
      setNameError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(createCollection({
        name,
        description,
        isPublic
      }));
      
      toast({
        title: 'Collection created',
        description: `Collection "${name}" has been created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      handleClose();
    } catch (err) {
      toast({
        title: 'Failed to create collection',
        description: error || 'An error occurred while creating the collection.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isCollectionModalOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Collection</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!nameError}>
              <FormLabel>Collection Name</FormLabel>
              <Input 
                placeholder="My Collection" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea 
                placeholder="Describe your collection" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="is-public" mb="0">
                Make collection public
              </FormLabel>
              <Switch
                id="is-public"
                isChecked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </FormControl>
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
            loadingText="Creating"
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CollectionModal;