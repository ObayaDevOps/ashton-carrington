import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  useDisclosure,
  useBreakpointValue,
  VStack,
  Image,
  Dialog,
  Text,
  Portal,
} from '@chakra-ui/react';
import { useState } from 'react';
import Form from '@/components/Form'
import MobileDrawer from './MobileDrawer'; // Import the new component
import ContactModal from './ContactModal'; // Import the ContactModal component
import { MIGRATED_SANITY_ASSETS } from '../constants/migratedSanityAssets';

const NavLink = ({ children, href }) => (
  <Link
    px={3}
    py={1}
    rounded={'md'}
    color={'#00DEE3'} // Cyan color from image
    _hover={{
      textDecoration: 'none',
      // Add a subtle hover effect if desired
      // bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}
    fontFamily="Poppins" // Assuming Poppins based on index.js heading
    fontWeight={500} // Match heading weight
  >
    {children}
  </Link>
);

export default function Navbar(props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Use 'lg' breakpoint to switch between desktop and mobile nav
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  const navItems = [
    { label: 'Home', href: '/'},
    { label: 'R&D Tax Credits', href: '/research-and-development-tax-credits' },
    { label: 'Capital Allowances', href: '/capital-allowances' },
    { label: 'Accounts & Filling', href: '/accounts-filing' },
  ];

  return (
    <Box 
    px={{base: '2rem', lg: '5.5rem'}} 
    py={{base: '1rem', lg: '1rem'}} 
    position="sticky" 
    top={0} 
    zIndex="sticky"
    bg={props.bg}
    // bgGradient={{base:"to-b", lg: 'none'}}
    // gradientFrom={{base: props.bg ,lg: 'none'}}
    // gradientTo={{base:'transparent', lg: 'none'}}
    >
      <Flex 
      h={16} 
      alignItems={'center'} 
      justifyContent={'space-between'} 
      maxW="container.xl" 
      mx="auto"
      display={{base: 'none', lg: 'flex'}}
      >
        {/* Logo - Using Image component like in index.js */}
        <Link href="/" _hover={{ textDecoration: 'none' }}>
             <Image
                src={MIGRATED_SANITY_ASSETS.navLogo}
                alt="Ashton & Carrington Logo"
                height={'40px'} // Adjust height as needed
                width={'auto'} // Maintain aspect ratio
                // ml={'64px'}
             />
        </Link>


          <Flex display={{base: 'none', lg: 'flex'}}>
            {/* Desktop Navigation Links */}
            <HStack spacing={'1.5rem'} alignItems={'left'}>
              <HStack as={'nav'} spacing={'1.5rem'}>
                {navItems.map((item) => (
                  <NavLink key={item.label} href={item.href}>{item.label}</NavLink>
                ))}
              </HStack>

              <Box ml={4}>
                <ContactModal />
              </Box>

            </HStack>
          </Flex>

      </Flex>

      {/* Mobile Drawer */}
      <Box>
      <Flex display={{base: 'flex', lg: 'none'}} alignItems="center" justifyContent="flex-start">
          <MobileDrawer
            isOpen={isOpen}
            onClose={onClose}
            navItems={navItems}
            getInTouchText="Get in Touch"
          />

        <Box pl={4} >
          <Link href="/" _hover={{ textDecoration: 'none' }}>
                <Image
                    src={MIGRATED_SANITY_ASSETS.navLogo}
                    alt="Ashton & Carrington Logo"
                    height={'40px'} // Adjust height as needed
                    width={'auto'} // Maintain aspect ratio
                    // ml={'64px'}
                />
            </Link>
          </Box>

      </Flex>
      </Box>
    </Box>
  );
} 
