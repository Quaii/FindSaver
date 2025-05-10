import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
  Tooltip,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  AddIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import { openScraperModal, openCollectionModal, setSearchQuery } from '../../store/uiSlice';

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { searchQuery } = useSelector((state: RootState) => state.ui);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // location is not used
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const { colorMode, toggleColorMode } = useColorMode();
  
  // WeChat theme colors
  const bgColor = useColorModeValue('wechat.white', 'wechat.black');
  const borderColor = useColorModeValue('wechat.lightGray', 'rgba(255, 255, 255, 0.1)');
  const textColor = useColorModeValue('wechat.black', 'wechat.white');
  const secondaryTextColor = useColorModeValue('wechat.darkGray', 'rgba(255, 255, 255, 0.7)');
  const searchBgColor = useColorModeValue('wechat.ultraLightGray', 'rgba(255, 255, 255, 0.1)');
  
  // Apply blurred effect for the navbar on scroll
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navbar blur effect style
  const navbarStyle = {
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
    transition: 'all 0.3s ease-in-out',
    boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none',
    borderBottom: '1px solid',
    borderColor: borderColor,
    backgroundColor: scrolled ? (colorMode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)') : bgColor,
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearchQuery));
  };

  return (
    <Box position="sticky" top={0} zIndex={100}>
      <Flex
        bg={bgColor}
        color={textColor}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4, md: 6 }}
        align={'center'}
        sx={navbarStyle}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link
            as={RouterLink}
            to="/"
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={textColor}
            fontWeight="bold"
            fontSize="xl"
            _hover={{
              textDecoration: 'none',
              color: 'wechat.primary'
            }}
          >
            FindSaver
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav isAuthenticated={isAuthenticated} />
          </Flex>
        </Flex>

        {isAuthenticated && (
          <Stack
            flex={{ base: 1, md: 2 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            align="center"
          >
            <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '400px' }}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={secondaryTextColor} />
                </InputLeftElement>
                <Input
                  placeholder="Search items..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  borderRadius="full"
                  bg={searchBgColor}
                  _focus={{
                    borderColor: 'wechat.primary',
                    boxShadow: '0 0 0 1px var(--wechat-primary)',
                  }}
                  _hover={{
                    borderColor: 'wechat.primary',
                  }}
                />
              </InputGroup>
            </form>

            <Button
              leftIcon={<AddIcon />}
              onClick={() => dispatch(openScraperModal())}
              size="sm"
              bg="wechat.primary"
              color="white"
              _hover={{ bg: 'wechat.primaryDark' }}
              variant="solid"
              display={{ base: 'none', md: 'flex' }}
            >
              Add Item
            </Button>

            <Button
              onClick={() => dispatch(openCollectionModal())}
              size="sm"
              borderColor="wechat.primary"
              color={useColorModeValue('wechat.primary', 'wechat.primary')}
              _hover={{ bg: useColorModeValue('wechat.primaryLight', 'rgba(7, 193, 96, 0.1)') }}
              variant="outline"
              display={{ base: 'none', md: 'flex' }}
            >
              New Collection
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  name={user?.name}
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/dashboard">
                  Dashboard
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        )}

        {!isAuthenticated && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
            align="center"
          >
            <Tooltip label={colorMode === 'light' ? 'Dark mode' : 'Light mode'}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
                borderRadius="full"
                color={secondaryTextColor}
                _hover={{
                  bg: useColorModeValue('wechat.ultraLightGray', 'rgba(255, 255, 255, 0.1)')
                }}
              />
            </Tooltip>
            <Button
              as={RouterLink}
              to="/login"
              fontSize={'sm'}
              fontWeight={500}
              variant={'ghost'}
              color={textColor}
              _hover={{
                bg: useColorModeValue('wechat.ultraLightGray', 'rgba(255, 255, 255, 0.1)')
              }}
              size="sm"
            >
              Sign In
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={500}
              bg="wechat.primary"
              color="white"
              _hover={{ bg: 'wechat.primaryDark' }}
              size="sm"
            >
              Sign Up
            </Button>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav isAuthenticated={isAuthenticated} />
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const linkColor = useColorModeValue('wechat.darkGray', 'rgba(255, 255, 255, 0.7)');
  const linkHoverColor = useColorModeValue('wechat.primary', 'wechat.primary');
  const popoverContentBgColor = useColorModeValue('wechat.white', 'wechat.black');

  return (
    <Stack direction={'row'} spacing={4}>
      {isAuthenticated && (
        <>
          <Link
            p={2}
            as={RouterLink}
            to="/dashboard"
            fontSize={'sm'}
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}
          >
            Dashboard
          </Link>
        </>
      )}

      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
                {navItem.children && (
                  <Icon
                    as={ChevronDownIcon}
                    transition={'all .25s ease-in-out'}
                    transform={'translateY(1px)'}
                    w={4}
                    h={4}
                  />
                )}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('wechat.ultraLightGray', 'rgba(255, 255, 255, 0.05)') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'wechat.primary' }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'wechat.primary'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const dispatch = useAppDispatch();
  const borderColor = useColorModeValue('wechat.lightGray', 'rgba(255, 255, 255, 0.1)');
  
  return (
    <Stack
      bg={useColorModeValue('wechat.white', 'wechat.black')}
      p={4}
      display={{ md: 'none' }}
      borderBottomWidth="1px"
      borderColor={borderColor}
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.05)"
    >
      {isAuthenticated && (
        <>
          <MobileNavItem label="Dashboard" href="/dashboard" />
          <Stack spacing={4} align="center">
            <Button
              leftIcon={<AddIcon />}
              onClick={() => dispatch(openScraperModal())}
              size="sm"
              bg="wechat.primary"
              color="white"
              _hover={{ bg: 'wechat.primaryDark' }}
              variant="solid"
              width="full"
            >
              Add Item
            </Button>
            <Button
              onClick={() => dispatch(openCollectionModal())}
              size="sm"
              borderColor="wechat.primary"
              color={useColorModeValue('wechat.primary', 'wechat.primary')}
              _hover={{ bg: useColorModeValue('wechat.primaryLight', 'rgba(7, 193, 96, 0.1)') }}
              variant="outline"
              width="full"
            >
              New Collection
            </Button>
          </Stack>
        </>
      )}
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('wechat.darkGray', 'rgba(255, 255, 255, 0.7)')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('wechat.lightGray', 'rgba(255, 255, 255, 0.1)')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'About',
    href: '#',
  },
  {
    label: 'Features',
    href: '#',
  },
];

export default Navbar;