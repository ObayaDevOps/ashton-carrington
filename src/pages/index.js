import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { geistSans, geistMono, spaceMono, poppins } from "@/styles/theme";
import { motion } from "framer-motion";

import 'focus-visible/dist/focus-visible';

// 1. Import Sanity client (adjust path if needed)
import sanityClient  from '../../sanity/lib/client'; 
// 2. Import urlFor helper (adjust path if needed)
import { urlForImage } from '../../sanity/lib/image'; 
import { MIGRATED_SANITY_ASSETS } from "../constants/migratedSanityAssets";

import {
  Box,
  Center,
  Text,
  Heading,
  VStack,
  Button,
  Container,
} from '@chakra-ui/react';

// Removed unused cloudinary imports
import ServicesSection from '../components/ServicesSection';
import WhoWeAreSection from '../components/WhoWeAreSection';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 3. Define the GROQ query
const landingPageQuery = `
*[_type == "landingPage"][0] {
  pageTitle,
  metaDescription,
  hero {
    heading,
    logo
  },
  servicesSection {
    title,
    services[] {
      title,
      description,
      iconImage,
      backgroundImage,
      linkText,
      linkUrl
    }
  },
  whoWeAreSection {
    title,
    ifaAccredited {
      title,
      description1,
      description2,
      logo
    },
    features[] {
      title,
      description,
      image
    }
  }
}
`;

// 4. Update Home component to receive props
export default function Home({ landingPageData }) {
  // Destructure props for easier access
  const { 
    pageTitle, 
    metaDescription, 
    hero, 
    servicesSection, 
    whoWeAreSection 
  } = landingPageData || {};
  const heroLogoUrl = hero?.logo
    ? urlForImage(hero.logo).width(611).height(250).url()
    : MIGRATED_SANITY_ASSETS.logoGradient;

  return (
    <Box
    // className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${poppins.variable}`}
      bg={'#000819'}
      minH={'100vh'}
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width={{base:"110%", md: "100%", lg: "100%"}}
        height={{base:"10%", md: "20%", lg: "45%"}}
        backgroundImage={`url('${MIGRATED_SANITY_ASSETS.heroOverlay}')`}
        backgroundSize="cover"
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        opacity={0.1}
        zIndex={0}
      />

      <Head>
        {/* Use data from Sanity */}
        <title>{'Ashton & Carrington'}</title>
        <meta name="description" content={metaDescription || 'Empowering Innovation and Financial Growth Through Expertise'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Vector.svg" />
      </Head>

      <Navbar bg={{base: 'transparent', lg: 'none'}} />

      <Box flex="1">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
        <Box py={{base: 10, lg: 16}}>

            {heroLogoUrl && (
              <Center>
                    <Image
                      src={heroLogoUrl}
                      alt={'Ashton & Carrington Logo'}
                      width={611}
                      height={250}
                      priority
                    />
              </Center>
            )}

            <Center px={{base: 6, lg: 8}} pt={8}> {/* Added padding top */}
              <Heading
                as="h1"
                fontFamily="Poppins"
                fontSize={{ base: 'xl', md: '2rem' }}
                lineHeight={{ base: '2rem', md: '3rem' }}
                fontWeight={500}
                letterSpacing={'0.72px'}
                textAlign={'center'}
                bgClip="text"
                bgGradient="to-r"
                gradientFrom='#00DEE3' // Replaced with full definition for clarity
                gradientTo='#5700C4'

                maxW="container.md"
              >
                {/* Use heading from Sanity */}
                {hero?.heading || 'Empowering Innovation and Financial Growth Through Expertise'}
              </Heading>
            </Center>
        </Box>
          {/* Pass Sanity data as props */}
          {servicesSection && <ServicesSection sectionData={servicesSection} />}
          </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {/* Pass Sanity data as props */}
          {whoWeAreSection && <WhoWeAreSection sectionData={whoWeAreSection} />}
        </motion.div>
      </Box>

      <Footer />

    </Box>
  );
}

// 5. Add getStaticProps function
export async function getStaticProps() {
  const landingPageData = await sanityClient.fetch(landingPageQuery);
  return {
    props: {
      landingPageData,
    },
    // Optional: Revalidate the page content periodically
    // revalidate: 60, // In seconds (e.g., every minute)
  };
}
