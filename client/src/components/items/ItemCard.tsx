import { Box, Image, Text, Badge, Flex, Stack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { StarIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { Item, toggleFavorite } from '../../store/itemSlice';
import { openDeleteConfirm } from '../../store/uiSlice';
import { useAppDispatch } from '../../store';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const dispatch = useAppDispatch();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(item._id));
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openDeleteConfirm({ type: 'item', id: item._id }));
  };

  return (
    <Box
      as={RouterLink}
      to={`/items/${item._id}`}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'md' }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" paddingTop="75%" width="100%">
        <Image
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          src={item.images[0] || 'https://via.placeholder.com/300?text=No+Image'}
          alt={item.title}
          objectFit="cover"
        />
        <Stack
          position="absolute"
          top="2"
          right="2"
          direction="column"
          spacing={2}
        >
          <IconButton
            aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            icon={<StarIcon />}
            size="sm"
            colorScheme={item.isFavorite ? 'yellow' : 'gray'}
            variant="solid"
            onClick={handleToggleFavorite}
            mb={2}
          />
          <IconButton
            aria-label="Delete item"
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            variant="solid"
            onClick={handleDeleteClick}
          />
        </Stack>
      </Box>

      <Box p="4" flex="1" display="flex" flexDirection="column">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="brand">
            {item.domain}
          </Badge>
        </Box>

        <Text
          mt="2"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={2}
          color={textColor}
        >
          {item.title}
        </Text>

        <Text mt="2" color={textColor} fontSize="lg" fontWeight="bold" mb="2">
          {item.price || 'Price not available'}
        </Text>

        <Flex mt="auto" justify="space-between" align="center">
          <Text fontSize="sm" color="gray.500">
            {new Date(item.scrapedAt).toLocaleDateString()}
          </Text>
          <IconButton
            as="a"
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit source"
            icon={<ExternalLinkIcon />}
            size="sm"
            variant="ghost"
            onClick={(e) => e.stopPropagation()}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ItemCard;