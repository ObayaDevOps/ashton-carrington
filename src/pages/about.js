import Head from 'next/head';
import { motion } from 'framer-motion';
import { Box, Container, Heading, Text, SimpleGrid, Center } from '@chakra-ui/react';

import client from '../../sanity/lib/client';
import { urlForImage } from '../../sanity/lib/image';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import TeamMemberCard from '../components/TeamMemberCard';
import HeroOverlay from '../components/HeroOverlay';

const aboutPageQuery = `
*[_type == "aboutPage"][0] {
  pageTitle,
  metaDescription,
  heading,
  intro,
  teamMembers[] {
    _key,
    name,
    role,
    bio,
    photo,
    linkedinUrl
  }
}
`;

export default function AboutPage({ aboutPageData }) {
  const { pageTitle, metaDescription, heading, intro, teamMembers } =
    aboutPageData || {};

  const members = teamMembers || [];

  return (
    <Box
      bg="#000819"
      minH="100vh"
      display="flex"
      flexDirection="column"
      position="relative"
      overflow="hidden"
    >
      {/* Decorative overlay, same as the landing page */}
      <HeroOverlay />

      <Head>
        <title>{`${pageTitle || 'About Us'} | Ashton & Carrington`}</title>
        <meta
          name="description"
          content={
            metaDescription ||
            'Meet the team behind Ashton & Carrington — IFA-accredited accountancy and tax advisory.'
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Vector.svg" />
      </Head>

      <Navbar bg={{ base: 'transparent', lg: 'none' }} />

      <Box flex="1" position="relative" zIndex={1}>
        <Container maxW="container.xl" py={{ base: 20, md: 16 }} px={{ base: 4, md: 8 }}>
          {/* Heading + intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Heading
              as="h1"
              fontFamily="Poppins"
              fontSize={{ base: '1.5rem', lg: '2.25rem' }} // 36px
              lineHeight="3rem" // 48px
              fontWeight={500}
              fontStyle="normal"
              letterSpacing="0.72px"
              color="white"
              px={2}
              pt={2}
              pb="1.5rem"
            >
              {heading || 'MEET THE TEAM'}
            </Heading>

            {intro && (
              <Text
                fontFamily="Poppins"
                fontSize="1rem"
                fontWeight={400}
                lineHeight="1.875rem"
                color="white"
                maxW="container.md"
                mb="3.75rem"
              >
                {intro}
              </Text>
            )}
          </motion.div>

          {/* Team grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={{ base: 12, md: 12, lg: 16 }}
              justifyItems="center"
              maxW="56rem"
              mx="auto"
            >
              {members.map((member, index) => (
                <TeamMemberCard
                  key={member._key || index}
                  name={member.name}
                  role={member.role}
                  bio={member.bio}
                  linkedinUrl={member.linkedinUrl}
                  imageUrl={
                    member.photo
                      ? urlForImage(member.photo)
                          .width(400)
                          .height(400)
                          .fit('crop')
                          .auto('format')
                          .url()
                      : ''
                  }
                />
              ))}
            </SimpleGrid>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <Center mt="3.75rem">
              <ContactModal buttonText="Speak to an Expert" inNav={false} />
            </Center>
          </motion.div>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export async function getStaticProps() {
  const aboutPageData = await client.fetch(aboutPageQuery);

  return {
    props: {
      aboutPageData: aboutPageData || null,
    },
    revalidate: 60,
  };
}
