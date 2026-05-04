---
name: Heritage Narrative
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#51443c'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#83746b'
  outline-variant: '#d5c3b8'
  surface-tint: '#805533'
  primary: '#6f4627'
  on-primary: '#ffffff'
  primary-container: '#8b5e3c'
  on-primary-container: '#ffe3d1'
  inverse-primary: '#f4bb92'
  secondary: '#7d5800'
  on-secondary: '#ffffff'
  secondary-container: '#fdca6d'
  on-secondary-container: '#775300'
  tertiary: '#67483f'
  on-tertiary: '#ffffff'
  tertiary-container: '#816056'
  on-tertiary-container: '#ffe1d8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc5'
  primary-fixed-dim: '#f4bb92'
  on-primary-fixed: '#301400'
  on-primary-fixed-variant: '#653d1e'
  secondary-fixed: '#ffdea9'
  secondary-fixed-dim: '#f1bf63'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4100'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#e7bdb1'
  on-tertiary-fixed: '#2c160e'
  on-tertiary-fixed-variant: '#5d4037'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  h1:
    fontFamily: Noto Serif
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Noto Serif
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Noto Serif
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Elms Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Elms Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Elms Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-page: 40px
  node-gap-v: 64px
  node-gap-h: 32px
---

## Brand & Style

This design system is anchored in the concept of "Living History." It eschews the cold efficiency of modern technology in favor of a tactile, archival aesthetic that evokes the feeling of leafing through a cherished family ledger or exploring a curated museum exhibit. 

The design style is **Tactile / Skeuomorphic-Lite**, utilizing soft textures, subtle paper grains, and organic forms to create an emotional connection with the user's ancestry. The interface should feel permanent and precious, prioritizing grace and readability over density. Every interaction is designed to feel like a deliberate act of preservation, using soft transitions and natural easing to mimic the physical world.

## Colors

The palette is derived from natural materials: parchment, ink, and gold leaf. 

- **Primary (#8B5E3C):** Used for structural elements and key actions, representing the "trunk" of the family tree.
- **Secondary (#C4963F):** Reserved for highlights, lineage honors, and decorative accents.
- **Background (#FAF7F2):** A warm, parchment-toned base that reduces eye strain and provides a soft canvas for the family narrative.
- **Ink (#3E2723):** A deep, warm brown used for primary text instead of pure black to maintain the heritage feel.

Apply subtle gradients or noise textures to background surfaces to simulate the organic variation of aged paper.

## Typography

The typography balances the ceremonial with the functional. 

**Noto Serif** is the voice of the family. Use it for names, titles, and significant milestones. It provides the "Display" elegance required for a heritage product.

**Elms Sans** (Humanist Sans) provides clarity for data entry, dates, and descriptions. Its open apertures and organic stroke variations ensure it feels compatible with the serif headings without appearing overly clinical. 

Hierarchy should be established through significant size shifts and the use of the Gold accent color for important labels.

## Layout & Spacing

The layout employs a **Fluid Grid** for content pages (biographies, galleries) but transitions to a **Canvas-based** model for the actual family tree view.

1. **Rhythm:** Use an 8px base unit. Generous white space (or "parchment space") is essential to avoid a cluttered, technical feel.
2. **The Tree Canvas:** Nodes should be spaced widely. Connections between nodes must use Bézier curves rather than straight angles to maintain the "organic growth" metaphor.
3. **Information Density:** Low. Content should feel curated, not dumped. Use wide margins (40px+) on desktop to create a centered, focused reading experience.

## Elevation & Depth

In this design system, depth is achieved through **Tonal Layering and Physicality** rather than intense shadows.

- **Surface Tiers:** The base layer is the Parchment (#FAF7F2). Cards and modals should appear slightly "lifted" using a very soft, diffused brown-tinted shadow (e.g., `rgba(62, 39, 35, 0.08)`).
- **Insetting:** For input fields and search bars, use a subtle inner shadow to make them appear pressed into the paper.
- **Linework:** Use thin, 1px borders in #DED0B6 for structural separation. For the primary lineage path, use a 2px Gold stroke to signify importance.

## Shapes

The shape language is dominated by **Ovals and Soft Radii**. 

- **Family Nodes:** Use an oval or highly rounded rectangular shape (min 32px radius) to represent individuals. This breaks the "boxiness" associated with corporate software.
- **Interactive Elements:** Buttons and inputs should feature "Soft" roundedness (8px) to provide a friendly, approachable touchpoint.
- **Decorative Flourishes:** Use curved terminal points on lines and organic, hand-drawn styles for icons to reinforce the "Silsilah" (Lineage) concept.

## Components

### Buttons
Primary buttons should be solid Warm Brown (#8B5E3C) with Gold (#C4963F) text or icons. Secondary buttons use a Gold outline with a slight Parchment fill. Avoid high-gloss effects; use a subtle matte gradient to imply volume.

### Cards (Nodes)
The central component. A node contains an optional circular portrait frame with a Gold border, the name in Noto Serif, and dates in Elms Sans. The background should be a slightly lighter shade of the surface color to distinguish it from the canvas.

### Input Fields
Inputs should feel like entries in a ledger. Use a bottom-border-only style for a "writing on a line" feel, or a fully enclosed box with a very soft inner shadow and a Cream (#FAF7F2) fill.

### Connection Lines
The "veins" of the tree. These must be curved paths. Use a thicker weight (3px) for direct lineage and a thinner, dashed weight (1px) for distant or unverified connections.

### Timeline
A vertical component for biographies. Use a Gold vertical line with small Brown circular markers for life events, creating a "threaded" visual narrative.