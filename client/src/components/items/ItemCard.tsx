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
  const cardBg = useColorModeValue('white', 'rgba(26, 32, 44, 0.95)');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');
  
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
      borderRadius="xl"
      overflow="hidden"
      bg={cardBg}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      backdropFilter="blur(8px)"
      boxShadow={useColorModeValue(
        '0 4px 12px rgba(0, 0, 0, 0.05)', 
        '0 4px 12px rgba(0, 0, 0, 0.5)'
      )}
      _hover={{
        transform: 'translateY(-4px) scale(1.02)',
        boxShadow: useColorModeValue(
          '0 8px 24px rgba(0, 0, 0, 0.1)',
          '0 8px 24px rgba(0, 0, 0, 0.6)'
        ),
        filter: 'brightness(1.05)'
      }}
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
          transition="transform 0.4s ease-out"
          _hover={{ transform: 'scale(1.05)' }}
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

      <Box p="5" flex="1" display="flex" flexDirection="column" backdropFilter="blur(4px)">
        <Box display="flex" alignItems="baseline">
          <Badge 
            borderRadius="full" 
            px="3" 
            py="1" 
            colorScheme="brand"
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="wider"
            bg="wechat.primary"
            color="white">
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
          <Text fontSize="sm" color={secondaryTextColor}>
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