import { Box, VStack, Text, Link, Icon } from '@chakra-ui/react';
import NextImage from 'next/image';
import { FaLinkedin } from 'react-icons/fa';

// Renders "JA" from "Jane Ashton" — used when a member has no photo.
const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

const PHOTO_SIZE = 200; // px — rendered size of the circular photo

const TeamMemberCard = ({ name, role, bio, imageUrl, linkedinUrl }) => {
  return (
    <VStack gap={0} align="center" textAlign="center" px={2}>
      {/* Circular photo (or initials fallback) */}
      <Box
        width={`${PHOTO_SIZE}px`}
        height={`${PHOTO_SIZE}px`}
        borderRadius="full"
        overflow="hidden"
        position="relative"
        flexShrink={0}
        bg="#000819"
        borderWidth="2px"
        borderStyle="solid"
        borderColor="transparent"
        boxShadow="0px 0px 20px 3px rgba(0,4,14,1)"
        transition="all 0.2s ease-in-out"
        _hover={{ borderColor: '#00DEE3' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb="1.5rem"
      >
        {imageUrl ? (
          <NextImage
            src={imageUrl}
            alt={name}
            width={PHOTO_SIZE}
            height={PHOTO_SIZE}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        ) : (
          <Text
            fontFamily="Poppins"
            fontSize="3rem"
            fontWeight={500}
            color="#00DEE3"
            lineHeight="normal"
          >
            {getInitials(name)}
          </Text>
        )}
      </Box>

      {/* Name */}
      <Text
        as="h3"
        fontFamily="Poppins"
        fontSize="1.25rem"
        fontWeight={500}
        lineHeight="normal"
        letterSpacing="0.025rem"
        color="white"
        textTransform="uppercase"
        mb="0.25rem"
      >
        {name}
      </Text>

      {/* Role */}
      {role && (
        <Text
          fontFamily="Poppins"
          fontSize="0.875rem"
          fontWeight={500}
          lineHeight="1.25rem"
          letterSpacing="0.14rem"
          textTransform="uppercase"
          color="#00DEE3"
          mb="1rem"
        >
          {role}
        </Text>
      )}

      {/* Blurb */}
      {bio && (
        <Text
          fontFamily="Poppins"
          fontSize="1rem"
          fontWeight={400}
          lineHeight="1.875rem"
          color="white"
          maxW="20rem"
          mb="1rem"
        >
          {bio}
        </Text>
      )}

      {/* LinkedIn link */}
      {linkedinUrl && (
        <Link
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn`}
          display="inline-flex"
          alignItems="center"
          gap="0.5rem"
          color="#00DEE3"
          fontFamily="Poppins"
          fontSize="0.875rem"
          fontWeight={500}
          lineHeight="1.25rem"
          transition="all 0.2s ease-in-out"
          _hover={{ textDecoration: 'underline' }}
        >
          <Icon as={FaLinkedin} boxSize={5} />
          LinkedIn
        </Link>
      )}
    </VStack>
  );
};

export default TeamMemberCard;
