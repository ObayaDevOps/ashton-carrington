import { Box } from '@chakra-ui/react';

import { MIGRATED_SANITY_ASSETS } from '../constants/migratedSanityAssets';

// Decorative hero graphic sitting behind the top of a page.
//
// Sized in vh rather than % on purpose: a percentage height resolves against
// the page wrapper, which is as tall as the whole document, so the graphic
// used to render at wildly different sizes on a long page (the landing page)
// versus a short one (about). Viewport units keep it identical everywhere.
const HeroOverlay = () => (
  <Box
    position="absolute"
    top="0"
    left="0"
    width={{ base: '110%', md: '100%', lg: '100%' }}
    height={{ base: '55vh', md: '70vh', lg: '133vh' }}
    backgroundImage={`url('${MIGRATED_SANITY_ASSETS.heroOverlay}')`}
    backgroundSize="cover"
    backgroundPosition="right"
    backgroundRepeat="no-repeat"
    opacity={0.1}
    zIndex={0}
  />
);

export default HeroOverlay;
