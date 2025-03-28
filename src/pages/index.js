import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { geistSans, geistMono, spaceMono, poppins } from "@/styles/theme";

import {
  Box,
  Text,
  Heading,
  VStack,
  Button,
  Container,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Box className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${poppins.variable}`}>
      <Head>
        <title>Ashton & Carrington</title>
        <meta name="description" content="Ashton & Carrington" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.lg" py={10}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={6}>TYPOGRAPHY</Heading>
            <Text mb={6}>
              We use Poppins as our primary typeface. It is a contemporary, sans serif font
              chosen for its friendly and approachable feel. Its readability and modern
              aesthetic make it perfect for representing Ashton & Carrington's tone of voice.
            </Text>
          </Box>


          {/* H1 Hero */}
          <Box>
            <Heading as="h1" textStyle="h1Hero">H1 Hero</Heading>
            <Text fontSize="sm" color="gray.600">
              Font: Poppins | Weight: Semi-bold 600 | Font Size: 2rem (32px) | Line Height: 4rem (64px)
            </Text>
          </Box>

          {/* H2 Header */}
          <Box>
            <Heading as="h2" textStyle="h2Header">H2 Header</Heading>
            <Text fontSize="sm" color="gray.600">
              Font Size: 2rem (32px) | Line Height: 3rem (48px)
            </Text>
          </Box>

          {/* H3 Header */}
          <Box>
            <Heading as="h3" textStyle="h3Header">H3 Header</Heading>
            <Text fontSize="sm" color="gray.600">
              Font Size: 2rem (32px) | Line Height: 3rem (48px)
            </Text>
          </Box>

          {/* H4 Header */}
          <Box>
            <Heading as="h4" textStyle="h4Header">H4 Header</Heading>
            <Text fontSize="sm" color="gray.600">
              Font Size: 1.25rem (20px) | Line Height: 1.875rem (30px)
            </Text>
          </Box>

          {/* Body 1 */}
          <Box>
            <Text textStyle="body1">Body 1</Text>
            <Text fontSize="sm" color="gray.600">
              Font: Poppins | Weight: Regular 400 | Font Size: 1rem (16px) | Line Height: 1.5rem (24px)
            </Text>
          </Box>

          {/* Body 1 Bold */}
          <Box>
            <Text textStyle="body1Bold">Body 1 bold</Text>
            <Text fontSize="sm" color="gray.600">
              Font: Poppins | Weight: Semi-bold 600 | Font Size: 1rem (16px) | Line Height: 1.5rem (24px)
            </Text>
          </Box>

          {/* Body 2 */}
          <Box>
            <Text textStyle="body2">Body 2</Text>
            <Text fontSize="sm" color="gray.600">
              Font: Poppins | Weight: Regular 400 | Font Size: 0.875rem (14px) | Line Height: 1.25rem (20px)
            </Text>
          </Box>

          {/* Body 2 Bold */}
          <Box>
            <Text textStyle="body2Bold">Body 2 bold</Text>
            <Text fontSize="sm" color="gray.600">
              Font: Poppins | Weight: Semi-bold 600 | Font Size: 0.875rem (14px) | Line Height: 1.25rem (20px)
            </Text>
          </Box>

          {/* Button */}
          <Box>
            <Button>Button Example</Button>
            <Text fontSize="sm" color="gray.600" mt={2}>
              Font: Poppins | Weight: Medium 500 | Font Size: 0.875rem (14px) | Line Height: 1.25rem (20px)
            </Text>
          </Box>

          {/* Caption & Label */}
          <Box>
            <Text textStyle="caption">Caption & Label</Text>
            <Text fontSize="sm" color="gray.600">
              Font: Poppins | Weight: Regular 400 | Font Size: 0.75rem (12px) | Line Height: 1.125rem (18px)
            </Text>
          </Box>

          {/* Tiny */}
          <Box>
            <Text textStyle="tiny">Tiny</Text>
            <Text fontSize="sm" color="gray.600">
              Font: Poppins | Weight: Regular 400 | Font Size: 0.625rem (10px) | Line Height: 0.875rem (14px)
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
