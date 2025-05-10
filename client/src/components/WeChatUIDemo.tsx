import React from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { FaHome, FaUser, FaComments, FaCog } from 'react-icons/fa';

const WeChatUIDemo: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const blurredFooterStyle = useColorModeValue('blurredFooter', 'blurredFooterDark');

  return (
    <Container maxW="container.md" py={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">WeChat UI Theme</Heading>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="secondary"
          size="sm"
        />
      </Flex>

      {/* Color Palette Demo */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Color Palette</Heading>
        <Flex wrap="wrap" gap={4}>
          <Box bg="wechat.primary" p={4} borderRadius="md" color="white" w="100px" textAlign="center">
            Primary
          </Box>
          <Box bg="wechat.darkGray" p={4} borderRadius="md" color="white" w="100px" textAlign="center">
            Dark Gray
          </Box>
          <Box bg="wechat.lightGray" p={4} borderRadius="md" color="black" w="100px" textAlign="center">
            Light Gray
          </Box>
          <Box bg="wechat.ultraLightGray" p={4} borderRadius="md" color="black" w="100px" textAlign="center">
            Ultra Light
          </Box>
          <Box bg="wechat.black" p={4} borderRadius="md" color="white" w="100px" textAlign="center">
            Black
          </Box>
          <Box bg="wechat.white" p={4} borderRadius="md" color="black" border="1px solid" borderColor="wechat.lightGray" w="100px" textAlign="center">
            White
          </Box>
        </Flex>
      </Box>

      {/* Typography Demo */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Typography</Heading>
        <Stack spacing={2}>
          <Text>Regular text (16px)</Text>
          <Text variant="small">Small label text (14px)</Text>
        </Stack>
      </Box>

      {/* Button Demo */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Buttons</Heading>
        <Flex gap={4} flexWrap="wrap">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </Flex>
      </Box>

      {/* Input Demo */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Inputs</Heading>
        <Stack spacing={4}>
          <Input placeholder="Regular input" />
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="wechat.darkGray" />
            </InputLeftElement>
            <Input placeholder="Search..." />
          </InputGroup>
        </Stack>
      </Box>

      {/* Card Demo */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Cards</Heading>
        <Stack spacing={4}>
          <Card>
            <CardBody>
              <Heading size="sm" mb={2}>Card Title</Heading>
              <Text>This is a simple card component styled according to WeChat's design language.</Text>
            </CardBody>
          </Card>
        </Stack>
      </Box>

      {/* Navigation Demo */}
      <Box mb={8}>
        <Heading size="md" mb={4}>Navigation</Heading>
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Messages</Tab>
            <Tab>Contacts</Tab>
            <Tab>Discover</Tab>
            <Tab>Me</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Text>Messages content</Text>
            </TabPanel>
            <TabPanel>
              <Text>Contacts content</Text>
            </TabPanel>
            <TabPanel>
              <Text>Discover content</Text>
            </TabPanel>
            <TabPanel>
              <Text>Me content</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Bottom Navigation */}
      <Box layerStyle="bottomNav" position="fixed" bottom={0} left={0} right={0}>
        <Flex direction="column" align="center">
          <FaHome size={24} color={colorMode === 'dark' ? '#FFFFFF' : '#7F7F7F'} />
          <Text fontSize="12px" mt={1}>Home</Text>
        </Flex>
        <Flex direction="column" align="center">
          <FaComments size={24} color="#07C160" />
          <Text fontSize="12px" mt={1} color="wechat.primary">Chat</Text>
        </Flex>
        <Flex direction="column" align="center">
          <FaUser size={24} color={colorMode === 'dark' ? '#FFFFFF' : '#7F7F7F'} />
          <Text fontSize="12px" mt={1}>Contacts</Text>
        </Flex>
        <Flex direction="column" align="center">
          <FaCog size={24} color={colorMode === 'dark' ? '#FFFFFF' : '#7F7F7F'} />
          <Text fontSize="12px" mt={1}>Settings</Text>
        </Flex>
      </Box>

      {/* Blurred Footer/Control Bar */}
      <Box layerStyle={blurredFooterStyle} bottom="60px">
        <Flex justifyContent="space-between" alignItems="center">
          <Text>Now Playing: WeChat UI Demo</Text>
          <Flex gap={2}>
            <Button size="sm" variant="secondary">Prev</Button>
            <Button size="sm" variant="primary">Play</Button>
            <Button size="sm" variant="secondary">Next</Button>
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default WeChatUIDemo;