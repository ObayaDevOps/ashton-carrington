# Implementation Plan — `/about` "Meet the Team" Page

**Read this whole document before writing any code. Follow the steps in order. Do not improvise — every file's full contents are given below; copy them exactly.**

Companion reference: `DESIGN-SYSTEM.md` (in this repo root). All colours, fonts and spacing below are taken from it. Do **not** introduce any colour, font or radius that is not already in that document.

---

## 0. What we are building

A new page at `/about` titled "Meet the Team". It shows a responsive grid of team-member cards. Each card is:

```
        ( circular photo )        <- circular, cropped square, subtle cyan ring
             JANE ASHTON          <- name
        Managing Director         <- role, in cyan
   Two to three lines of blurb    <- bio
   text about this person here.
        [in] LinkedIn             <- icon + text link, opens in new tab
```

Content is managed in **Sanity CMS** (new `aboutPage` document type), fetched with `getStaticProps`, exactly like the other pages in this repo.

### Files you will CREATE (3)

| Path | Purpose |
|---|---|
| `sanity/schemas/aboutPageSchema.js` | New Sanity document schema |
| `src/components/TeamMemberCard.js` | Presentational card component |
| `src/pages/about.js` | The page itself (route `/about`) |

### Files you will MODIFY (2)

| Path | Change |
|---|---|
| `sanity/schemaTypes.js` | Register the new schema (2 lines) |
| `src/components/Navbar.js` | Add `About` to the `navItems` array (1 line) |

**Do not modify any other file.** Do not touch `next.config.mjs` (`cdn.sanity.io` is already allowlisted), `theme.js`, `provider.jsx`, or any existing component.

---

## 1. Critical repo conventions you MUST follow

Read these carefully — getting them wrong is the most likely way this task fails.

1. **Chakra UI v3 is installed, not v2.** In v3 the prop for grid/stack gaps is **`gap`**, not `spacing`. Existing files in this repo still use `spacing` — that is a leftover from v2 and it silently does nothing. **In your new files use `gap`.**
2. **`isExternal` does not exist in Chakra v3.** For external links use `target="_blank" rel="noopener noreferrer"`. (`Footer.js` uses `isExternal`; that is a bug, do not copy it.)
3. **There is no working theme.** `provider.jsx` passes Chakra's `defaultSystem`, so `textStyle="body1"` and custom tokens **will not work**. Every font/colour must be set as an inline prop, e.g. `fontFamily="Poppins"` `color="white"`. This is why the code below looks verbose. Keep it verbose.
4. **Only one cyan: `#00DEE3`.** The repo also contains `#00E2E5` and `#00C6CB` — these are mistakes. Do not use them.
5. **Only one font: `Poppins`**, set inline as `fontFamily="Poppins"`. Weights 400, 500, 600 only.
6. **Background is always `#000819`.** White text. No light mode.
7. **There is no shared Layout component.** Each page imports and renders `<Navbar />` and `<Footer />` itself.
8. **Import paths from `src/pages/`:** Sanity client is `'../../sanity/lib/client'` (default export, named `client`), image helper is `'../../sanity/lib/image'` (named export `urlForImage`). From `src/components/` the paths are the same (`'../../sanity/lib/image'`).

---

## 2. STEP 1 — Create the Sanity schema

Create the file **`sanity/schemas/aboutPageSchema.js`** with exactly this content:

```js
import { UsersIcon } from '@sanity/icons'

export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: UsersIcon,
  // Limit to a single instance (same pattern as landingPageSchema)
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      name: 'pageTitle',
      title: 'Page Title (Browser Tab)',
      type: 'string',
      initialValue: 'About Us',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (for SEO)',
      type: 'text',
      rows: 3,
      initialValue:
        'Meet the team behind Ashton & Carrington — IFA-accredited accountancy and tax advisory.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'Displayed as the main heading, e.g. "MEET THE TEAM"',
      initialValue: 'MEET THE TEAM',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'intro',
      title: 'Intro Paragraph',
      type: 'text',
      rows: 3,
      description: 'Short paragraph shown under the heading (optional)',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'teamMember',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'role',
              title: 'Role / Job Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'bio',
              title: 'Blurb',
              type: 'text',
              rows: 3,
              description: 'Two to three lines about this person.',
              validation: (Rule) => Rule.max(280),
            },
            {
              name: 'photo',
              title: 'Photo',
              type: 'image',
              description:
                'Square or portrait headshot. It is cropped to a circle — use the hotspot to centre the face.',
              options: { hotspot: true },
            },
            {
              name: 'linkedinUrl',
              title: 'LinkedIn URL',
              type: 'url',
              description: 'Full URL, e.g. https://www.linkedin.com/in/jane-ashton/',
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'photo' },
          },
        },
      ],
    },
  ],
  preview: {
    select: { title: 'pageTitle' },
    prepare({ title }) {
      return { title: title || 'About Page' }
    },
  },
}
```

---

## 3. STEP 2 — Register the schema

Open **`sanity/schemaTypes.js`**. It currently looks like this:

```js
// Import document schemas
import LandingPageSchema from './schemas/landingPageSchema'
import RnDTaxCreditsPageSchema from './schemas/rndTaxCreditsPageSchema'
import CapitalAllowancePageSchema from './schemas/capitalAllowancePageSchema'
import AccountsnFilingPageSchema from './schemas/accountsFilingPageSchema'
import TermsPageSchema from './schemas/termsPageSchema'
import PrivacyPageSchema from './schemas/privacyPolicyPageSchema'



export const schema = {
  types: [
    LandingPageSchema, 
    RnDTaxCreditsPageSchema,
    CapitalAllowancePageSchema,
    AccountsnFilingPageSchema,
    TermsPageSchema,
    PrivacyPageSchema
  ],
}
```

Make exactly two changes:

**2a.** Add this import line directly after the `PrivacyPageSchema` import line:

```js
import AboutPageSchema from './schemas/aboutPageSchema'
```

**2b.** Add `AboutPageSchema` to the `types` array, after `PrivacyPageSchema` (add a comma after `PrivacyPageSchema`):

```js
    PrivacyPageSchema,
    AboutPageSchema
```

> Note: the Studio is embedded at `/studio` and reads `sanity.config.js` at runtime. There is **no separate schema deploy step** — restarting `npm run dev` is enough.

---

## 4. STEP 3 — Create the `TeamMemberCard` component

Create **`src/components/TeamMemberCard.js`** with exactly this content:

```jsx
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
        borderColor="rgba(0, 222, 227, 0.3)"
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
```

**Why it looks like this (do not "improve" it):**
- `borderRadius="full"` + `overflow="hidden"` on the wrapper is what makes the photo circular. `NextImage` with `objectFit: 'cover'` fills the circle without distortion.
- Name/role/blurb sizes come from `DESIGN-SYSTEM.md` §3 ("Card titles" `1.25rem`/500/`0.025rem`; body `1rem`/400/`1.875rem`).
- The ring is cyan at 30% opacity so a grid of 8 faces doesn't turn the page into a wall of cyan; it goes full `#00DEE3` on hover. This respects design principle #2 ("use cyan sparingly").
- `react-icons/fa` `FaLinkedin` is already used in `Footer.js`, so the dependency exists.

---

## 5. STEP 4 — Create the page

Create **`src/pages/about.js`** with exactly this content:

```jsx
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Box, Container, Heading, Text, SimpleGrid, Center } from '@chakra-ui/react';

import client from '../../sanity/lib/client';
import { urlForImage } from '../../sanity/lib/image';
import { MIGRATED_SANITY_ASSETS } from '../constants/migratedSanityAssets';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import TeamMemberCard from '../components/TeamMemberCard';

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
      <Box
        position="absolute"
        top="0"
        left="0"
        width={{ base: '110%', md: '100%', lg: '100%' }}
        height={{ base: '10%', md: '20%', lg: '45%' }}
        backgroundImage={`url('${MIGRATED_SANITY_ASSETS.heroOverlay}')`}
        backgroundSize="cover"
        backgroundPosition="right"
        backgroundRepeat="no-repeat"
        opacity={0.1}
        zIndex={0}
      />

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

      <Navbar bg={{ base: '#000819', lg: 'none' }} />

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
              fontSize="1.75rem"
              fontFamily="Poppins"
              fontStyle="normal"
              fontWeight={500}
              color="white"
              lineHeight="normal"
              letterSpacing="0.14rem"
              textAlign={{ base: 'center', md: 'left' }}
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
                textAlign={{ base: 'center', md: 'left' }}
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
              columns={{ base: 1, md: 2, lg: 3 }}
              gap={{ base: 12, md: 12, lg: 16 }}
              justifyItems="center"
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
```

**Notes:**
- `aboutPageData: aboutPageData || null` matters — Next.js throws a build error if a prop is `undefined`, which is what a GROQ query returns when no document exists yet. Keep the `|| null`.
- The page must render without crashing when there is no Sanity document. `members` defaults to `[]`, so the grid is simply empty. **This is expected before you add content in Step 5.**
- `revalidate: 60` matches the other content pages (`privacy-policy.js`).
- `ContactModal` accepts `buttonText` and `inNav` props — this exact call is copied from `privacy-policy.js`, so it is known to work.

---

## 6. STEP 5 — Add `About` to the navbar

Open **`src/components/Navbar.js`**. Find the `navItems` array around line 45:

```js
  const navItems = [
    { label: 'Home', href: '/'},
    { label: 'Accounts & Filling', href: '/accounts-filing' },
    { label: 'R&D Tax Credits', href: '/research-and-development-tax-credits' },
    { label: 'Capital Allowances', href: '/capital-allowances' },
  ];
```

Add one line so it becomes:

```js
  const navItems = [
    { label: 'Home', href: '/'},
    { label: 'About', href: '/about' },
    { label: 'Accounts & Filling', href: '/accounts-filing' },
    { label: 'R&D Tax Credits', href: '/research-and-development-tax-credits' },
    { label: 'Capital Allowances', href: '/capital-allowances' },
  ];
```

**Do not change anything else in this file.** Do not fix the "Filling" typo — that is a separate, tracked issue and changing it here would confuse the review of this change.

This single array feeds **both** the desktop nav and the mobile drawer, so no other change is needed for mobile.

---

## 7. STEP 6 — Add the content in Sanity Studio

The code is now complete but the page will be empty until a document exists.

1. Run `npm run dev`.
2. Open `http://localhost:3000/studio` and log in.
3. In the left-hand document-type list, find **About Page** and open it.
4. Fill in:
   - **Page Title (Browser Tab):** `About Us`
   - **Meta Description:** one sentence about the firm and its team.
   - **Section Heading:** `MEET THE TEAM`
   - **Intro Paragraph:** optional, 1–2 sentences.
5. Under **Team Members**, click **Add item** for each person and fill in Name, Role, Blurb (2–3 lines, keep under 280 characters), Photo (upload a headshot and drag the hotspot onto the face — the image is cropped to a circle), and LinkedIn URL (full `https://…` URL).
6. Click **Publish**.
7. Reload `http://localhost:3000/about`.

> If you do not have Studio access, stop after Step 5 and report that the code is complete but content entry is blocked. **Do not** hardcode placeholder team members into the page as a workaround.

---

## 8. Verification checklist

Run `npm run dev`, then check every item:

- [ ] `npm run build` completes with no errors.
- [ ] `http://localhost:3000/about` loads and does **not** 404 or throw.
- [ ] The page renders without crashing **even when no Sanity `aboutPage` document exists** (test this before Step 6 — you should see the heading fallback "MEET THE TEAM", an empty grid, and the CTA button).
- [ ] Page background is `#000819`; all text is white or `#00DEE3`; nothing is black-on-white.
- [ ] Photos are perfect circles (not ovals, not squares with rounded corners) and faces are not distorted or cut off.
- [ ] Hovering a photo brightens its ring from faint to solid cyan, over ~0.2s.
- [ ] Each LinkedIn link opens the correct profile **in a new tab**.
- [ ] `About` appears in the desktop navbar and links to `/about`.
- [ ] `About` appears in the mobile hamburger drawer (uppercase, cyan) and links to `/about`.
- [ ] The footer sits at the bottom of the page, below the content, on both a short and a tall page.
- [ ] Responsive check at three widths — this is the most commonly missed step:
  - **375px (mobile):** 1 column, cards centred.
  - **768px (`md`):** 2 columns; heading left-aligned.
  - **1200px (`lg`):** 3 columns; desktop navbar (links, not hamburger) is showing.
- [ ] **992px specifically** — this is the nav breakpoint. Confirm the now-5-item desktop nav plus the "Get in Touch" button still fits on one line and does not wrap or overlap the logo. If it wraps, report it; do **not** unilaterally restyle the navbar.
- [ ] Sections fade/slide in once on scroll and never re-animate or loop.
- [ ] No new colour, font family, or npm dependency has been introduced.

---

## 9. Things that will go wrong (and what to do)

| Symptom | Cause | Fix |
|---|---|---|
| `Error: Invalid src prop … hostname "cdn.sanity.io" is not configured` | Dev server started before you looked at `next.config.mjs` | It *is* already configured. Restart `npm run dev`. Do not edit the config. |
| Photos are ovals | You put `borderRadius="full"` on `NextImage` instead of the wrapper `Box`, or dropped `overflow="hidden"` | Re-copy the `TeamMemberCard` code exactly. |
| Grid items are jammed together | You used `spacing` instead of `gap` | Chakra v3 uses `gap`. |
| `undefined` prop build error from `getStaticProps` | You removed the `|| null` | Put it back. |
| **About Page** doesn't appear in Studio | Step 2 not done, or dev server not restarted | Re-check `sanity/schemaTypes.js`, restart the dev server. |
| `urlForImage(...).url is not a function` | You passed something that isn't a Sanity image object | Only call it when `member.photo` is truthy — the ternary in the page code already handles this. |

## 10. Out of scope — do NOT do these

- Do not fix the "Accounts & Filling" typo, the `borderRadiud` typo in `ContactModal.js`, or the cyan drift (`#00E2E5`/`#00C6CB`) elsewhere in the codebase.
- Do not wire up `theme.js` in `provider.jsx`.
- Do not add a filter/category bar (the "Leadership / Client Services / Creative" tabs visible in the reference screenshot are **not** part of this task).
- Do not add hover-zoom, card flip, carousel, or any animation beyond the entrance fades specified above.
- Do not commit or push unless explicitly asked.
