import { useState, useRef } from 'react';
import Head from "next/head";
import { ChevronDown, ChevronUp } from 'lucide-react';
import client from '../../sanity/lib/client';
import { PortableText } from '@portabletext/react';
import ContactModal from '../components/ContactModal';
import { MIGRATED_SANITY_ASSETS } from '../constants/migratedSanityAssets';


import {
  Box,
  Flex,
  Link as ChakraLink,
  Heading,
  Text,
  Accordion,
  Span,
  Separator,
  Button
  } from '@chakra-ui/react';

  import Navbar from '../components/Navbar';
  import Footer from '../components/Footer';
  import VerticalStepperNav from '../components/VerticalStepperNav';

// GROQ query to fetch R&D Tax Credits page data
export async function getStaticProps() {
  const query = `*[_type == "capitalAllowancePage"][0] {
    title,
    subtitle,
    metaDescription,
    "backgroundImageUrl": backgroundImage.asset->url,
    sections[] {
      id,
      title,
      content[],
      accordionItems[] {
        title,
        text[]
      },
      postContent[]
    }
  }`;

  const pageData = await client.fetch(query);
  
  return {
    props: {
      pageData,
    },
    revalidate: 60, // Revalidate the page every 60 seconds
  };
}

// Define fallback sections data if Sanity data is not available
const fallbackSections = [
  { id: 'introduction', title: 'Empowering Innovation & Maximising Growth' },
  { id: 'qualifies', title: 'What Qualifies as R&D?' },
  { id: 'maximising-claim', title: 'Maximising Your Claim: The R&D Tax Credit Report' },
  { id: 'uk-scheme', title: 'Understanding the UK R&D Tax Credit Scheme' },
  { id: 'loss-making', title: 'Claiming R&D credits when loss making' },
  { id: 'partner', title: 'Why Partner with Ashton & Carrington?' },
  { id: 'get-started', title: 'Get Started Today' },
];

// Portable Text components for rendering rich text content
const BlockTextComponents = {
  block: {
    normal: ({children}) => <Text color="white" lineHeight="tall" mb={4}>{children}</Text>,
    h3: ({children}) => <Heading as="h3" size="md" color="white" mt={6} mb={4}>{children}</Heading>,
    h4: ({children}) => <Heading as="h4" size="sm" color="white" mt={4} mb={3}>{children}</Heading>,
  },
  list: {
    bullet: ({children}) => <Box as="ul" listStyleType="square" color="white" mb={4} pl={6} spacing={2}>{children}</Box>,
    number: ({children}) => <Box as="ol" listStyleType="decimal" color="white" mb={4} pl={6} spacing={2}>{children}</Box>
  },
  listItem: {
    bullet: ({children}) => <Box as="li" color="white" lineHeight="tall" mb={2}>{children}</Box>,
    number: ({children}) => <Box as="li" color="white" lineHeight="tall" mb={2}>{children}</Box>
  },
  marks: {
    strong: ({children}) => <Text as="strong" fontWeight="bold">{children}</Text>,
    em: ({children}) => <Text as="em" fontStyle="italic">{children}</Text>,
  }
};

const AccordionComponent = ({ items = [] }) => {
  const [expandedItem, setExpandedItem] = useState(null); // Track the expanded item

  const handleToggle = (title) => {
    setExpandedItem(expandedItem === title ? null : title); // Toggle the expanded item
  };


  return (
    <Accordion.Root multiple>
      {items.map((item, index) => (
        <Accordion.Item key={index} value={item.title}
          my={'0.75rem'}
          borderRadius={'0.25rem'}
          borderColor={'#1A2130'}
          borderWidth={'1px'}
          bgGradient="to-r"
          gradientFrom='#000819'
          gradientTo='#1A2130'
          boxShadow={`0px 3px 3px 0px rgba(0,8,25,0.4)`}
        >
          <Accordion.ItemTrigger p={'0.5rem'} onClick={() => handleToggle(item.title)}>
          {expandedItem === item.title ? <ChevronUp /> : <ChevronDown />} {/* Conditional rendering */}
          <Span flex="1">
              <Text               
                fontFamily='Poppins'
                fontSize='1rem' // 30px
                lineHeight='1.875rem' // 30px
                fontWeight='500'
                fontStyle='normal'
                color='white'
              >
                {item.title}
              </Text>
            </Span>
          </Accordion.ItemTrigger>

          <Accordion.ItemContent>
          <Separator borderColor={'#1A2130'} mx={'1rem'} />

            <Accordion.ItemBody p={{base:'0.5rem', lg:'1rem'}}>
              {Array.isArray(item.text) ? (
                <Box px={'1.5rem'}>
                  <PortableText
                    value={item.text}
                    components={BlockTextComponents}
                  />
                </Box>
              ) : (
                <Text
                  fontFamily='Poppins'
                  fontSize='1rem' // 16px
                  lineHeight='1.875rem' // 30px
                  fontWeight='400'
                  fontStyle='normal'
                  color='white'
                  mx={'1.5rem'}
                >
                  {item.text}
                </Text>
              )}
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}


export default function RnDTaxCreditsPage({ pageData }) {
  // Use pageData from Sanity or fallback to default values
  const title = pageData?.title || 'Research and Development Tax Credits';
  const subtitle = pageData?.subtitle || 'Strategic Research & Development Tax Solutions for Forward-Thinking Businesses';
  const metaDescription = pageData?.metaDescription || 'Empowering Innovation and Financial Growth Through Expertise';
  const sections = pageData?.sections || fallbackSections;
  
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  // Use Sanity image URL or fallback to default
  const backgroundImageUrl = pageData?.backgroundImageUrl || MIGRATED_SANITY_ASSETS.pageBackgroundWaves;

  const handleLinkClick = (id) => {
    setActiveSection(id);
    // Get the scrollable container
    const mainContent = document.getElementById('main-content-area');
    // Get the target element
    const element = document.getElementById(id);

    if (mainContent && element) {
        // Calculate the target element's position relative to the scrollable container's top
        const offsetTop = element.offsetTop;
        // Get the scroll-margin-top value applied to the element (adjust the default '0' if needed)
        const scrollMarginTop = parseInt(window.getComputedStyle(element).scrollMarginTop, 10) || 0;

        // Scroll the container so the element's top (minus the margin) aligns with the container's top
        mainContent.scrollTo({
            top: offsetTop - scrollMarginTop,
            behavior: 'smooth',
        });
    }
  };


    return (
    // Set height to 100vh and use flex column layout
    <Box
      minH={{base: '100vh', md: "100vh"}} // Exact viewport height
      h={{lg: '100vh'}}
      display="flex"
      flexDirection="column"
      bgImage={{base: 'none', lg: `url('${backgroundImageUrl}')`}}
      bg={{base:'#000819'}}
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed" // Keeps the background fixed
      position="relative" // Needed for the overlay
      _before={{ // Overlay for readability
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,        
        bgGradient:"to-b",
        gradientFrom:'blackAlpha.700',
        gradientTo:'#000819',
        opacity:1,
        zIndex: 1,
      }}
    >

      <Head>
        <title>{title} | Ashton & Carrington</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Vector.svg" />
      </Head>
      
      {/* Keep Navbar above overlay */}
      <Box 
      position="sticky"
      top={0}
      zIndex={3}
      >
        <Navbar bg={{base: '#000819', lg: 'none'}} />
      </Box>

      {/* Container fills space, contains children, uses flex column */}
      <Box
        px={{base: '1rem', lg: '4rem'}}
        py='2rem'
        position={{base: 'relative', lg: "relative"}}
        zIndex={2} /* Content above overlay */
        flex="1" /* Grow vertically */
        overflow={{base: 'none', lg: "hidden"}} /* Prevent container scroll */
        display="flex" /* Use flex for children */
        flexDirection="column" /* Stack title and flex row */
      >

        <Box
          // position={{base:"sticky", lg: 'none'}}
          // top={{base:'6rem', lg: '0'}}
          // bg={{base:'#000819', lg: 'none'}}
        >
          <Text
              fontFamily='Poppins'
              fontSize={{base:'1.5rem', lg: '2.25rem' }} // 36px
              lineHeight='3rem' // 48px
              fontWeight='500'
              fontStyle='normal'
              letterSpacing='0.72px'
              color='white'
              p={2}
            >
              {title}
            </Text>
          </Box>


        {/* Flex row fills remaining space in container */}
        <Flex direction={['column', 'column', 'row']} gap={10} flex="1" overflow="hidden">
          {/* Left Sidebar */}
          <Box
            as="nav" // Use nav for semantic sidebar
            w={['full', 'full', '18.5rem']} // Full width on small screens, fixed width on larger
            display={{base: 'none', lg: 'flex'}}
            position={['relative', 'relative', 'sticky']} // Sticky sidebar on large screens
            top={[0, 0, '2rem']} // Adjust top position as needed
            alignSelf="flex-start" // Prevent stretching vertically
            p={4}
            borderRadius="md"
            fontFamily='Poppins'
            maxH={['auto', 'auto', 'calc(100vh - 10rem)']}
            overflowY="auto"
          >
            {/* Use the new VerticalStepperNav component */}
            <VerticalStepperNav
              sections={sections}
              activeSection={activeSection}
              onLinkClick={handleLinkClick} // Pass the existing handler
            />
          </Box>

          {/* Right Content Area: Scrolls internally */}
          <Box
            id="main-content-area" // ID to target for scrolling
            as="main" // Use main for semantic content area
            flex="1" // Takes remaining space
            borderRadius="md"
            fontFamily='Poppins'
            color='white' // Text color for content within
            h="100%" // Fill height of parent flex container
            overflowY="auto" // Enable vertical scroll ONLY for this box
            scrollBehavior="smooth" // Apply smooth scroll to this container
            p={{base: 2, lg: 6}} // Add padding inside the scrollable area
            pt={{base:'2.5rem', lg: '2.5rem'}}
            sx={{
              '&::-webkit-scrollbar': {
                display: 'none', // Safari and Chrome
              },
              'scrollbarWidth': 'none', // Firefox
              '-ms-overflow-style': 'none', // IE and Edge
            }}
          >
            <Text
              fontFamily='Poppins'
              fontSize={{base:'1.25rem', lg: '1.75rem'}} // 28px
              fontWeight='500'
              lineHeight='normal' 
              letterSpacing='2.24px'
              color='white'
              textTransform='uppercase'
              mb='3.75rem' //60px
            >
              {subtitle}
            </Text>

            {sections.map((section, index) => (
              <Box
                  key={section.id}
                  id={section.id}
                  scrollMarginTop="8rem" // CSS scroll margin anchor positioning
                  mb='3.75rem' //60px // Keep margin between sections
              >
                <Heading size="xl" mb={4} color="white" fontFamily='Poppins'>
                  {section.title}
                </Heading>

                {section.content && section.content.length > 0 && (
                  <Box mt={4}>
                    <PortableText
                      value={section.content}
                      components={BlockTextComponents}
                    />
                  </Box>
                )}

                {section.accordionItems && section.accordionItems.length > 0 && (
                  <AccordionComponent items={section.accordionItems} />
                )}

                {section.postContent && section.postContent.length > 0 && (
                  <Box mt={6}>
                    <PortableText
                      value={section.postContent}
                      components={BlockTextComponents}
                    />
                  </Box>
                )}
                
              </Box>
            ))}
          {/* <Button 
            variant={'outline'}
            bgColor={'#00DEE3'}
            borderColor={'#00DEE3'}
            _hover={{ bg: 'rgba(0, 222, 227, 0.1)', color: '#00DEE3' }}
            fontFamily="Poppins"
            fontWeight={500} 
            
            mb={'1.5rem'}
            mr={'2rem'}
          >
            Speak to an Expert
            </Button> */}
            <Box mb={'1.5rem'} mr={'2rem'}>
              <ContactModal buttonText='Speak to an Expert' inNav={false} />
          </Box>
          </Box>
        </Flex>
      </Box>

      {/* Keep Footer above overlay */}
      <Box position="relative" zIndex={2}>
        <Footer />
      </Box>
      </Box>
  );
}
