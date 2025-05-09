import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { closeDeleteConfirm } from '../../store/uiSlice';
import { deleteItem, deleteCollection } from '../../store/itemSlice';

const DeleteConfirmModal = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { isDeleteConfirmOpen, itemToDelete, collectionToDelete } = useSelector(
    (state: RootState) => state.ui
  );
  const { loading } = useSelector((state: RootState) => state.items);

  const handleClose = () => {
    dispatch(closeDeleteConfirm());
  };

  const handleDelete = async () => {
    try {
      if (itemToDelete) {
        await dispatch(deleteItem(itemToDelete));
        toast({
          title: 'Item deleted',
          description: 'The item has been successfully deleted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else if (collectionToDelete) {
        await dispatch(deleteCollection(collectionToDelete));
        toast({
          title: 'Collection deleted',
          description: 'The collection has been successfully deleted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      handleClose();
    } catch (err) {
      toast({
        title: 'Deletion failed',
        description: 'An error occurred while deleting. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getTitle = () => {
    if (itemToDelete) return 'Delete Item';
    if (collectionToDelete) return 'Delete Collection';
    return 'Delete Confirmation';
  };

  const getMessage = () => {
    if (itemToDelete) {
      return 'Are you sure you want to delete this item? This action cannot be undone.';
    }
    if (collectionToDelete) {
      return 'Are you sure you want to delete this collection? All items in this collection will be deleted. This action cannot be undone.';
    }
    return 'Are you sure you want to delete this? This action cannot be undone.';
  };

  return (
    <Modal isOpen={isDeleteConfirmOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{getTitle()}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{getMessage()}</Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleDelete}
            isLoading={loading}
            loadingText="Deleting"
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;