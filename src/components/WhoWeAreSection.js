import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  Spacer,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import  { urlForImage } from '../../sanity/lib/image'; 
import { MIGRATED_SANITY_ASSETS } from '../constants/migratedSanityAssets';

const FeatureCard = ({ imageUrl, title, children }) => {
  return (
    <VStack align="start" p={{ base: 4, lg: 6 }}>
      <HStack spacing={4}>
        {imageUrl && (
          <Flex align="center" flexShrink={0}>
            <NextImage
              src={imageUrl}
              alt={`${title} icon`}
              height={60}
              width={60}
            />
          </Flex>
        )}

        <Box>
          <Heading
            fontSize="1.75rem"
            fontFamily="Poppins"
            fontStyle={'normal'}
            fontWeight={500}
            lineHeight="normal"
            letterSpacing={'0.14rem'}
            mb={1}
          >
            {title}
          </Heading>
          <Text
            fontSize="1rem"
            fontFamily="Poppins"
            fontStyle={'normal'}
            fontWeight={400}
            lineHeight="1.875rem"
          >
            {children}
          </Text>
        </Box>
      </HStack>
    </VStack>
  );
};

const WhoWeAreSection = ({ sectionData }) => {
  const { title, ifaAccredited, features } = sectionData || {};

  const bgColor = '#000819';
  const textColor = 'white';

  return (
    <Box bg={bgColor} py={{ base: 20, md: 16 }} px={2} color={textColor}>
      <Container maxW="container.xl">
        <Heading
          fontSize={"1.75rem"}
          fontFamily="Poppins"
          fontStyle='normal'
          fontWeight={500}
          color="white"
          lineHeight={'normal'}
          letterSpacing="0.14rem"
          textAlign={{ base: 'center', md: 'left' }}
          pb={{ base: '2rem', md: '1.5rem' }}
        >
          {title || 'Who We Are'}
        </Heading>

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 10, lg: 24 }}
          align="stretch"
        >
          {ifaAccredited && (
            <Box
              flex={1}
              borderRadius='0.75rem'
              p={{ base: '1.5rem', md: '2rem' }}
              boxShadow={`0px 0px 20px 3px rgba(0,4,14,1)`}
              display="flex"
              flexDirection="column"
              bgGradient="to-r"
              gradientFrom='#00DEE3'
              gradientTo='#5700C4'
              position="relative"
              overflow="hidden"
            >
              {/* Added Second Gradient Overlay */}
              <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                bgGradient="to-b"
                gradientFrom='rgba(0, 8, 25, 0)'
                gradientTo='rgba(0, 8, 25, 0.6717)'
                zIndex={1} // Above image overlay, below content
              />
              {/* Image Overlay */}
              <Box
                position="absolute"
                top="0"
                right="0"
                width="100%"
                height="120%"
                backgroundImage={`url('${MIGRATED_SANITY_ASSETS.whoWeAreOverlay}')`}
                backgroundSize="contain"
                backgroundPosition="right center"
                backgroundRepeat="no-repeat"
                opacity={0.3}
                zIndex={0}
              />
              <Box position="relative" zIndex={2} display="flex" flexDirection="column" flexGrow={1}>
                {ifaAccredited.logo && (
                  <NextImage
                    src={urlForImage(ifaAccredited.logo).width(218).height(132).url()}
                    alt="IFA Logo"
                    width={218}
                    height={131.678}
                    style={{ marginBottom: '20px' }}
                  />
                )}
                <Heading
                  fontSize={'1.25rem'}
                  mb={2}
                  fontFamily="Poppins"
                  fontWeight={500}
                  lineHeight={'normal'}
                  letterSpacing={'0.025rem'}
                >
                  {ifaAccredited.title || 'IFA Accredited'}
                </Heading>
                <Text
                  fontSize={'1rem'}
                  fontFamily="Poppins"
                  fontWeight={400}
                  lineHeight={'1.875rem'}
                  letterSpacing={'0.025rem'}
                  mb={6}
                >
                  {ifaAccredited.description1}
                </Text>
                <Text
                  fontSize={'1rem'}
                  fontFamily="Poppins"
                  fontWeight={400}
                  lineHeight={'1.875rem'}
                  letterSpacing={'0.025rem'}
                >
                  {ifaAccredited.description2}
                </Text>
                <Spacer />
              </Box>
            </Box>
          )}

          {features && features.length > 0 && (
            <Box flex={2} mt={{base:'2.5rem', md: '0'}}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={20} spacingY={16}>
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    imageUrl={feature.image ? urlForImage(feature.image).width(60).height(60).url() : ''}
                    title={feature.title}
                  >
                    {feature.description}
                  </FeatureCard>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default WhoWeAreSection; 
