# Ashton & Carrington — Design System

A reference for the visual language of [ashtonandcarrington.co.uk](https://www.ashtonandcarrington.co.uk), built so new pages can be created without reverse-engineering existing components. Every value in this document is taken from the live codebase.

**Stack:** Next.js 15 (Pages Router) · Chakra UI v3 · framer-motion · next/font (Google Fonts) · Sanity CMS · lucide-react / react-icons

---

## 1. Brand & Aesthetic

Ashton & Carrington is an IFA-accredited accountancy and tax-advisory firm (Accounts & Filing, R&D Tax Credits, Capital Allowances). The site's visual identity is **dark, modern fintech**: a deep-navy canvas, electric-cyan accents, a signature cyan→purple gradient, neon glow highlights, and glassy cards with layered navy overlays. Professional financial-services tone, but approachable — rounded geometry, soft shadows, friendly Poppins type.

### Design principles

1. **Dark-first.** Everything sits on near-black navy (`#000819`). There is no light mode. White text, cyan accents.
2. **One accent color.** Cyan `#00DEE3` is the only interactive color — links, buttons, borders, focus states. Use it sparingly so it reads as "actionable."
3. **The gradient is the signature.** `#00DEE3 → #5700C4` (cyan → purple, left to right) is reserved for hero moments: the H1 headline and the IFA-accreditation card. Don't dilute it by using it on ordinary UI.
4. **Legibility through layered navy.** White text never sits directly on imagery — always place a `to-b` navy gradient overlay (`rgba(0,8,25, 0.4 → 0.8)`) between image and text.
5. **Generous vertical rhythm.** Sections breathe: `py={16}` (64px) sections, `mb="3.75rem"` (60px) between content blocks, tall body line-height (`1.875rem`).
6. **Motion on entrance only.** Sections fade/slide in once on scroll (framer-motion). Interactive states use quick `0.2s ease-in-out` CSS transitions. Nothing loops or pulses.

---

## 2. Color Palette

There is no central color-token file — values are used inline. These are the canonical values; copy them exactly.

### Core

| Token (suggested name) | Value | Role |
|---|---|---|
| `navy.base` | `#000819` | Primary background — every page root, cards, modals, drawer button fill. The site's canvas. |
| `cyan.accent` | `#00DEE3` | **Primary accent.** Nav links, buttons, borders, focus rings, gradient start. |
| `navy.surface` | `#1A2130` | Secondary surface — mobile drawer background, accordion border, accordion gradient end. |
| `white` | `#FFFFFF` | Primary text color on navy. |
| `purple.gradient` | `#5700C4` | Gradient end only. Never used alone. |

### Supporting

| Value | Role |
|---|---|
| `#D2FAFB` | Pale cyan — active stepper ring + active stepper label text. |
| `#CCCED1` | Light grey — form field labels. |
| `#202020` | Dark grey — footer social-icon chip backgrounds. |
| `#DB3E00` | Error text (form validation banners). |
| `gray.400` / `gray.500` / `gray.600` | Chakra greys — inactive stepper text / dot / connector line; footer button border. |
| `teal.200` / `teal.300` | Stepper hover text / active inner dot. |
| `red.400` / `red.500` | Field error text / error border. |
| `green.400` | Form success message. |
| `blackAlpha.700` | Service-page background overlay gradient start. |

### Recipes (gradients, overlays, hovers, shadows)

| Recipe | Value | Used on |
|---|---|---|
| Signature gradient | `bgGradient="to-r"` `gradientFrom='#00DEE3'` `gradientTo='#5700C4'` | Hero H1 (with `bgClip="text"`), IFA card |
| Interactive hover fill | `rgba(0, 222, 227, 0.1)` (cyan @ 10%) | All button `_hover` backgrounds |
| Card image overlay | `linear-gradient(to bottom, rgba(0, 8, 25, 0.40), rgba(0, 8, 25, 0.80))` | Service cards (`_before` pseudo-element) |
| Card fade overlay | `to-b`, `rgba(0, 8, 25, 0)` → `rgba(0, 8, 25, 0.6717)` | IFA gradient card |
| Page overlay | `to-b`, `blackAlpha.700` → `#000819` | Service pages, over the fixed wave background |
| Signature card shadow | `0px 0px 20px 3px rgba(0,4,14,1)` | Service cards, IFA card |
| Accordion shadow | `0px 3px 3px 0px rgba(0,8,25,0.4)` | Accordion items |
| Accordion surface | `to-r`, `#000819` → `#1A2130`, 1px `#1A2130` border | Accordion items |
| Neon glow (active) | `0px 0px 15px 4px rgba(45,255,196,0.9)` | Active stepper dot container |

> **Rule for new work:** use `#00DEE3` for all cyan. The codebase also contains `#00E2E5` (buttons/borders/drawer text) and `#00C6CB` (hamburger icon) — these are unintentional drift from the same design color, not deliberate variants. Do not propagate them.

---

## 3. Typography

**One typeface: [Poppins](https://fonts.google.com/specimen/Poppins).** Loaded via `next/font/google` in `src/styles/theme.js` with weights 300–700; in practice only **400 (body), 500 (headings, nav, buttons — the workhorse weight), and 600 (hero H1, bold body)** are used.

> `theme.js` also loads Geist, Geist Mono, Space Mono, and Unbounded — none are used in the UI. Don't introduce them.

Components set the font inline (`fontFamily="Poppins"`). The canonical type scale is defined in `src/styles/textStyles.js` and demonstrated in-app at `/visualStyleGuide`:

| Style | Size | Weight | Line height | Notes |
|---|---|---|---|---|
| `h1Hero` | 3rem (48px) | 600 | 4rem | Hero headline |
| `h2Header` | 2rem (32px) | 400 | 3rem | |
| `h3Header` | 2rem (32px) | 400 | 3rem | Uppercase |
| `h4Header` | 1.25rem (20px) | 400 | 1.875rem | |
| `body1` | 1rem (16px) | 400 | 1.5rem | |
| `body1Bold` | 1rem (16px) | 600 | 1.5rem | |
| `body2` | 0.875rem (14px) | 400 | 1.25rem | |
| `body2Bold` | 0.875rem (14px) | 600 | 1.25rem | |
| `button` | 0.875rem (14px) | 500 | 1.25rem | |
| `caption` | 0.75rem (12px) | 400 | 1.125rem | Form labels |
| `tiny` | 0.625rem (10px) | 400 | 0.875rem | |

### In-practice conventions (used everywhere, on top of the scale)

- **Section headings:** `1.75rem`, weight 500, `letterSpacing="0.14rem"`, `lineHeight="normal"`, uppercase or title case, white. (See `ServicesSection.js`, `WhoWeAreSection.js`.)
- **Card titles:** `1.25rem`, weight 500, `letterSpacing="0.025rem"`.
- **Body copy in cards/sections:** `1rem`, weight 400, **`lineHeight="1.875rem"`** (30px — taller than the token scale; this is the dominant body rhythm on the site).
- **Hero H1:** `fontSize={{ base: 'xl', md: '2rem' }}`, weight 500, `letterSpacing="0.72px"`, centered, gradient-clipped.
- **Service-page subtitle:** `{{ base: '1.25rem', lg: '1.75rem' }}`, weight 500, `letterSpacing="2.24px"`, uppercase.
- **Footer / small text:** `0.875rem`, weight 500, white.

---

## 4. Layout, Spacing & Breakpoints

Chakra v3 **default** breakpoints and 4px spacing scale (no custom tokens):

| Breakpoint | Width | Role on this site |
|---|---|---|
| `base` | 0 | Mobile — single column, centered text |
| `md` | 768px | Grid collapses (1→2 cols), footer column→row, text left-aligns |
| `lg` | **992px** | **The primary desktop/mobile switch** — nav links vs hamburger, stepper sidebar visibility, full-height service layout |

### Conventions

| Pattern | Value |
|---|---|
| Content container | `<Container maxW="container.xl">` (1280px); `container.md` for hero headline |
| Navbar / Footer horizontal padding | `px={{ base: '2rem', lg: '5.5rem' }}` |
| Section horizontal padding | `px={{ base: 4, md: 8 }}` |
| Service-page horizontal padding | `px={{ base: '1rem', lg: '4rem' }}` |
| Section vertical rhythm | `py={16}` (64px), or `py={{ base: 20, md: 16 }}` |
| Gap between content blocks | `mb="3.75rem"` (60px) |
| Navbar height | `h={16}` (64px), sticky `top={0}` `zIndex="sticky"` |
| Grid gaps | `spacing={8}` (cards); `spacingX={20} spacingY={16}` (feature grid) |

### Radii

| Radius | Used on |
|---|---|
| `xl` / `0.75rem` | Service cards, IFA gradient card, modal (intended) |
| `md` | Nav link pills, footer icon chips |
| `0.25rem` | Accordion items |
| `2px` | Outline buttons (sharp, technical look) |
| `full` | Stepper dots, glow containers |

---

## 5. Component Patterns

Copy-paste recipes using the exact values from the codebase. All components live in `src/components/`.

### Buttons

**Outline (default CTA)** — `ContactModal.js`, `MobileDrawer.js`:

```jsx
<Button
  variant="outline"
  color="#00DEE3"
  borderColor="#00DEE3"
  borderWidth="2px"
  borderRadius="2px"
  _hover={{ bg: 'rgba(0, 222, 227, 0.1)', color: '#00DEE3' }}
  fontFamily="Poppins"
  fontWeight={500}
>
  Get in Touch
</Button>
```

**Solid (form submit)** — `Form.js`:

```jsx
<Button
  bgColor="#00DEE3"
  borderColor="#00DEE3"
  _hover={{ bg: 'rgba(0, 222, 227, 0.1)', color: '#00DEE3' }}
  fontFamily="Poppins"
  fontWeight={500}
>
  Send Message
</Button>
```

### Overlay card (service card) — `ServicesSection.js`

Background image + navy gradient overlay + signature shadow. Content sits at `zIndex={2}`:

```jsx
<Box
  bgImage={`url(${imageUrl})`}
  bgSize="cover"
  bgPosition="center"
  borderRadius="xl"
  p={{ base: '1.5rem', lg: '2rem' }}
  position="relative"
  overflow="hidden"
  color="white"
  minH={{ base: 'auto', md: '450px' }}
  boxShadow="0px 0px 20px 3px rgba(0,4,14,1)"
  display="flex" flexDirection="column" justifyContent="space-between"
  _before={{
    content: '""',
    position: 'absolute', inset: 0,
    bg: 'linear-gradient(to bottom, rgba(0, 8, 25, 0.40), rgba(0, 8, 25, 0.80))',
    zIndex: 1,
  }}
>
  {/* content: position="relative" zIndex={2} */}
</Box>
```

Card link: cyan, weight 500, `<ArrowRight />` (lucide) icon, `_hover={{ textDecoration: 'underline' }}`.

### Gradient card (hero moments only) — `WhoWeAreSection.js`

```jsx
<Box
  borderRadius="0.75rem"
  p={{ base: '1.5rem', md: '2rem' }}
  boxShadow="0px 0px 20px 3px rgba(0,4,14,1)"
  bgGradient="to-r"
  gradientFrom="#00DEE3"
  gradientTo="#5700C4"
  position="relative"
  overflow="hidden"
>
  {/* to-b navy fade overlay: rgba(0,8,25,0) → rgba(0,8,25,0.6717), zIndex 1 */}
  {/* decorative SVG overlay at opacity 0.3, zIndex 0 */}
  {/* content at zIndex 2 */}
</Box>
```

### Gradient headline — `index.js`

```jsx
<Heading
  as="h1"
  fontFamily="Poppins"
  fontSize={{ base: 'xl', md: '2rem' }}
  lineHeight={{ base: '2rem', md: '3rem' }}
  fontWeight={500}
  letterSpacing="0.72px"
  textAlign="center"
  bgClip="text"
  bgGradient="to-r" gradientFrom="#00DEE3" gradientTo="#5700C4"
  maxW="container.md"
>
  Empowering Innovation and Financial Growth Through Expertise
</Heading>
```

### Section heading — `ServicesSection.js`, `WhoWeAreSection.js`

```jsx
<Heading
  fontSize="1.75rem"
  fontFamily="Poppins"
  fontWeight={500}
  color="white"
  lineHeight="normal"
  letterSpacing="0.14rem"
  textAlign={{ base: 'center', md: 'left' }}
  pb="1.5rem"
>
  OUR SERVICES
</Heading>
```

### Navigation — `Navbar.js` + `MobileDrawer.js`

- Sticky, transparent over the page navy (`position="sticky" top={0} zIndex="sticky"`, `bg` passed per page — `#000819` on mobile service pages so content scrolls behind it cleanly).
- Desktop (`lg+`): logo left (40px tall), `HStack spacing="1.5rem"` of links right, plus `<ContactModal />` trigger. Links: `color="#00DEE3"`, Poppins 500, `px={3} py={1} rounded="md"`, no underline on hover.
- Mobile (< `lg`): lucide `<Menu />` hamburger (cyan, `2rem`) opens a **full-screen drawer** (`Drawer.Root size="full" placement="start"`), `bg="#1A2130"`, links uppercase `1.75rem` Poppins 500 with `letterSpacing="0.14rem"`, lucide `<X />` close top-right (`2.75rem`).
- Nav items are defined in the `navItems` array in `Navbar.js` — **register new pages there.**

### Forms — `Form.js` (react-hook-form + Chakra `Field`)

| Element | Style |
|---|---|
| Label | Poppins `0.75rem` 400, `color="#CCCED1"` |
| Input text | Poppins `0.875rem`, `color="white"` |
| Focus | `_focus={{ borderColor: '#00DEE3' }}` |
| Field error | `borderColor="red.500"`, `<Field.ErrorText color="red.400" fontSize="0.75rem">` |
| Error banner | `color="#DB3E00"`, `0.75rem`, right-aligned |
| Success | `color="green.400"`, `0.75rem`, right-aligned |

Forms post to `/api/contact` (nodemailer).

### Modal — `ContactModal.js` (Chakra `Dialog`)

```jsx
<Dialog.Content bg="#000819" borderWidth="2px" borderColor="#00DEE3" borderRadius="12px" p="0.5rem">
```

Title: Poppins `1.25rem` 500 white. Body: `0.875rem` 400, `lineHeight="1.875rem"`. Embeds `<Form />`.

### Accordion — service pages

```jsx
<Accordion.Item
  my="0.75rem"
  borderRadius="0.25rem"
  borderColor="#1A2130" borderWidth="1px"
  bgGradient="to-r" gradientFrom="#000819" gradientTo="#1A2130"
  boxShadow="0px 3px 3px 0px rgba(0,8,25,0.4)"
>
```

Trigger: lucide `<ChevronDown />`/`<ChevronUp />` + Poppins `1rem` 500 white title.

### Stepper sidebar — `VerticalStepperNav.js` (service pages only)

Vertical timeline: 2px `gray.600` connector, 24px dot containers. **Active:** 20px ring `#D2FAFB` with heavy glow (`0px 0px 183px 45px rgba(210,250,251,0.9)`), container glow `0px 0px 15px 4px rgba(45,255,196,0.9)`, 12px `teal.300` inner dot, label `#D2FAFB` semibold. **Inactive:** 10px `gray.500` dot, `gray.400` label. Hover: `teal.200`. Transitions `0.2s ease-in-out`.

---

## 6. Motion

**framer-motion** for entrance reveals — the only animation vocabulary on the site:

```jsx
// Above the fold (hero)
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

// Scroll-triggered sections — always play once
<motion.div
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
```

Interactive states (stepper, hovers): CSS `transition="all 0.2s ease-in-out"`. Keep durations 0.2s for interaction, 0.6–0.7s for entrances. No loops, no bounces.

---

## 7. Imagery & Assets

- **All assets live on Sanity CDN** (project `y9d33xfx`, `cdn.sanity.io` — allowlisted in `next.config.mjs`). Build URLs with `urlForImage(source).width(w).height(h).url()` from `sanity/lib/image`.
- **Fallback/decorative asset URLs** (wave background, gradient logo, nav logo, hero + who-we-are overlay SVGs) are in `src/constants/migratedSanityAssets.js` (`MIGRATED_SANITY_ASSETS`).
- **Standard sizes:** hero logo 611×250 · service icons 72×72 · feature icons 60×60 · IFA logo 218×132 · nav logo 40px height, auto width.
- **Decorative SVG overlays** sit behind content at `opacity` 0.1 (page-level) to 0.3 (cards).
- **Service pages** use a fixed wave background (`bgAttachment="fixed"`) with the `blackAlpha.700 → #000819` overlay for a subtle parallax.
- Use `next/image` (`NextImage`) for content images; `priority` on above-the-fold hero imagery.

---

## 8. Page Templates

There is **no shared Layout component** — each page composes `Navbar` + content + `Footer` itself.

### Template A: Standard page (`index.js`, `contact.js`, legal pages)

```jsx
import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NewPage() {
  return (
    <Box bg="#000819" minH="100vh" display="flex" flexDirection="column" position="relative" overflow="hidden">
      <Head>
        <title>Page Title | Ashton & Carrington</title>
        <meta name="description" content="..." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Vector.svg" />
      </Head>

      <Navbar bg={{ base: 'transparent', lg: 'none' }} />

      <Box flex="1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Container maxW="container.xl" py={16} px={{ base: 4, md: 8 }}>
            {/* Section heading + content (see §5 recipes) */}
          </Container>
        </motion.div>
      </Box>

      <Footer />
    </Box>
  );
}
```

### Template B: Service detail page (`accounts-filing.js`, `research-and-development-tax-credits.js`, `capital-allowances.js`)

Full-viewport two-pane layout — copy an existing service page as the starting point. Key structure:

```jsx
<Box
  minH="100vh" h={{ lg: '100vh' }}
  display="flex" flexDirection="column"
  bg={{ base: '#000819' }}
  bgImage={{ base: 'none', lg: `url('${backgroundImageUrl}')` }}   // wave SVG
  bgSize="cover" bgPosition="center" bgAttachment="fixed"
  position="relative"
  _before={{  // readability overlay
    content: '""', position: 'absolute', inset: 0,
    bgGradient: 'to-b', gradientFrom: 'blackAlpha.700', gradientTo: '#000819',
    zIndex: 1,
  }}
>
  <Box position="sticky" top={0} zIndex={3}>
    <Navbar bg={{ base: '#000819', lg: 'none' }} />
  </Box>

  <Box px={{ base: '1rem', lg: '4rem' }} py="2rem" zIndex={2} flex="1"
       overflow={{ lg: 'hidden' }} display="flex" flexDirection="column">
    {/* Page title: Poppins {1.5rem → 2.25rem} 500, letterSpacing 0.72px */}
    <Flex direction={['column', 'column', 'row']} gap={10} flex="1" overflow="hidden">
      {/* Left: sticky <VerticalStepperNav /> — w '18.5rem', hidden below lg */}
      {/* Right: id="main-content-area", overflowY="auto", scrollbars hidden,
          Sanity PortableText sections (mb="3.75rem", scrollMarginTop="8rem"),
          Accordion, then <ContactModal buttonText="Speak to an Expert" /> */}
    </Flex>
  </Box>

  <Box position="relative" zIndex={2}><Footer /></Box>
</Box>
```

Content comes from Sanity via `getStaticProps` (GROQ query per page type, `revalidate: 60`), rendered with `PortableText` and the shared `BlockTextComponents` mapping (white text, `lineHeight="tall"`).

### New-page checklist

1. Copy the closest template above (fonts are already loaded globally — nothing to add).
2. Root `Box` must be `bg="#000819" minH="100vh"` flex column; page content in the `flex="1"` middle so the footer stays at the bottom.
3. Import and place `Navbar` (pass `bg={{ base: '#000819', lg: 'none' }}` if the page scrolls content behind it on mobile) and `Footer`.
4. Add the route to `navItems` in `src/components/Navbar.js` if it belongs in the nav.
5. Use only Poppins, only `#00DEE3` cyan, white text, and the §5 recipes.
6. If the page needs CMS content, add a Sanity schema + GROQ query in `getStaticProps` and image URLs via `urlForImage()`.
7. Wrap sections in the standard framer-motion entrance (§6).
8. Check `base`, `md`, and `lg` — `lg` (992px) is where the layout must switch to desktop.

---

## 9. Known Inconsistencies (do not replicate)

Documented so new work doesn't copy them; fixing them is optional future cleanup.

1. **The custom Chakra theme is bypassed.** `src/components/ui/provider.jsx` passes Chakra's `defaultSystem` to `ChakraProvider`, so the custom system in `src/styles/theme.js` — including the `textStyles.js` tokens — is never applied. That's why every component hardcodes `fontFamily="Poppins"` inline. *Fix:* import the system from `theme.js` in `provider.jsx`; then components could use `textStyle="body1"` etc.
2. **Cyan drift.** `#00E2E5` (~8 uses: ContactModal borders, ServiceCard links, drawer text) and `#00C6CB` (hamburger icon) coexist with the canonical `#00DEE3`. Consolidate to `#00DEE3`.
3. **Dead boilerplate.** `src/styles/globals.css` is not imported anywhere; `src/styles/Home.module.css` is create-next-app leftover; Geist/Geist Mono/Space Mono/Unbounded fonts are loaded but unused (each adds font-download weight via next/font registration in `theme.js`).
4. **Typo:** `borderRadiud={'12px'}` in `ContactModal.js` — the modal's intended 12px radius silently doesn't apply.
5. **No color tokens.** All colors are inline strings. If/when the theme gets wired up (item 1), define semantic tokens (`bg.canvas`, `accent`, `surface`, …) from §2 and migrate gradually.
6. **Nav label typo:** "Accounts & Filling" in `navItems` (should be "Filing", matching the route `/accounts-filing`).

---

*Source files of record: `src/styles/theme.js`, `src/styles/textStyles.js`, `src/pages/visualStyleGuide.js` (live type demo), `src/pages/index.js` and `src/pages/accounts-filing.js` (layout exemplars), `src/components/*`.*
