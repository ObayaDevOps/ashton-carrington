import {
  Box,
  Container,
  Flex,
  Text,
  Image,
  Link,
  VStack,
  HStack,
  Stack,
  Icon,
  Button,
  Spacer,
} from '@chakra-ui/react';
import { FaLinkedin } from 'react-icons/fa'; // Example LinkedIn Icon
import { FiCode } from 'react-icons/fi'; // Example Code Icon
import { poppins } from '@/styles/theme'; // Assuming poppins is exported from theme

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box  color="white" pt={{ base: 8, md: 20 }}  px={0} fontFamily={poppins.style.fontFamily}>
       <Box px={'5.5rem'} py={'1rem'}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
          gap={{ base: 8, md: 4 }} // Add gap between columns/rows
        >
          {/* Left Section */}
          <HStack align={{ base: 'center', md: 'flex-start' }} spacing={4}>
            <Stack direction={{ base: 'column', md: 'row' }}>
            <Box>
              <Image
                src={'https://res.cloudinary.com/medoptics-image-cloud/image/upload/v1744125894/Type_Default_Colour_Gradient_on_Blue_lgi2ha.svg'} // Replace with your actual logo URL if different
                alt="Ashton & Carrington Logo"
                height={{ base: '80px', md: '80px' }} // Adjust size as needed
                objectFit="contain"
              />
            </Box>
            <Box>
            <HStack spacing={3}>
              <Link href="https://linkedin.com" isExternal aria-label="LinkedIn">
                <Icon as={FaLinkedin} boxSize={6} color="white" bg="#202020" p={1} borderRadius="md" />
              </Link>
              {/* Replace with actual link and consider a more specific icon if needed */}
              <Link href="#" isExternal aria-label="Developer Portfolio/Website">
                <Icon as={FiCode} boxSize={6} color="white" bg="#202020" p={1} borderRadius="md" />
              </Link>
              <Button
                size="sm"
                href='https://www.dralegawebops.com/'
                variant="outline"
                colorScheme="whiteAlpha"
                borderColor="gray.600"
                color="white"
                _hover={{ bg: 'gray.700' }}
                ml={2} // Add margin to space it from icons
              >
                Built by DWO
              </Button>
            </HStack>
            <Text 
            fontSize="0.875rem"
            fontFamily="Poppins"
            fontStyle='normal'
            fontWeight={500}
            color="white"
            lineHeight={'1.5rem'}
            pt={2}
            >
              © {currentYear} Ashton & Carrington. All rights reserved
            </Text>
            </Box>
            </Stack>
          </HStack>

          {/* Spacer for Medium+ screens */}
          <Spacer display={{ base: 'none', md: 'block' }} />

          {/* Right Section */}
          <VStack align={{ base: 'center', md: 'flex-end' }} spacing={1} textAlign={{ base: 'center', md: 'right' }}>
            <Link color={'white'} 
              href="mailto:contact@ashtonandcarrington.co.uk" 
              fontSize="0.875rem"
              fontFamily="Poppins"
              fontStyle='normal'
              fontWeight={500}
              lineHeight={'1.5rem'}
          
              _hover={{ textDecoration: 'underline' }}>
              contact@ashtonandcarrington.co.uk
            </Link>
            <Text
              fontSize="0.875rem"
              fontFamily="Poppins"
              fontStyle='normal'
              fontWeight={500}
              color="white"
              lineHeight={'1.5rem'}
            >
              Trinity Offices, 114 Northenden Rd, Sale, M33 3HD
            </Text>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer; 