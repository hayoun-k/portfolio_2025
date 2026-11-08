---
name: Hayoun K. Portfolio
description: A playful, friendly developer portfolio built like a tidy workbench of bright project tiles, Audiowide headings and a phone-frame hero, hard-edged in light mode and soft in dark.
colors:
  paper-cream: "#fdf9e6"
  ink: "#151418"
  outline-black: "#000000"
  night: "#212121"
  night-text: "#ebebeb"
  night-muted: "#c3c3c3"
  tile-cyan: "#01fffe"
  tile-green: "#00ff01"
  tile-orange: "#ff6500"
  tile-yellow: "#f7fe01"
  tile-pink: "#ffb4e6"
  night-blue: "#5078f3"
  night-mint: "#b4ffda"
  night-violet: "#b398ff"
  night-yellow: "#ffe552"
typography:
  display:
    fontFamily: "Audiowide, sans-serif"
    fontSize: "5rem"
    fontWeight: 400
    lineHeight: 1.1
  headline:
    fontFamily: "Audiowide, sans-serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "Audiowide, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.2
  lead:
    fontFamily: "Manrope, sans-serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
  sm: "3px"
  md: "12px"
  lg: "15px"
  phone: "44px"
spacing:
  gap: "24px"
  container: "32px"
  tile: "40px"
  popup-x: "3rem"
components:
  project-tile-dark:
    backgroundColor: "{colors.night-blue}"
    rounded: "{rounded.lg}"
    padding: "{spacing.tile}"
  project-tile-light:
    backgroundColor: "{colors.tile-cyan}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile}"
  project-popup:
    backgroundColor: "{colors.night}"
    textColor: "{colors.night-text}"
    rounded: "{rounded.lg}"
    padding: "2rem 3rem 3rem"
  close-button:
    textColor: "{colors.night-text}"
    rounded: "50%"
    size: "44px"
---

# Design System: Hayoun K. Portfolio

## Overview

**Creative North Star: "The Pocket Workbench"**

A developer's desk laid out in front of you: a phone mockup showing the work, a row of tool icons, and project tiles arranged like parts on a bench. Each tile is a bright block of color that opens into a dark detail card. It is practical, with personality, and the site is itself a sample of the craft.

The mood is playful and bold in color and headline type, held in check by polished, restrained details: one authored motion at a time, a quiet dark mode, a faint film-grain overlay so flat color doesn't feel sterile. Components feel tactile and friendly: chunky shapes, bright fills, a clear response to hover. The site must not read as a generic template portfolio: no dark hero with gradient text over an identical grid of cards.

**Key Characteristics:**
- Saturated tile colors on warm cream (light) or charcoal (dark).
- Two physical languages: light mode is hard-edged (squared, black outlines, offset shadows), dark mode is soft (rounded, diffuse shadow).
- Audiowide for every heading and control, Manrope for everything read.
- Motion is GSAP: staggered scroll-in for tiles, Flip transitions between tile and popup.

## Colors

A cream or charcoal base carrying four to five saturated tile colors; the color lives in the project tiles, not in text or chrome.

### Primary
- **Tile Cyan** (#01fffe), **Tile Green** (#00ff01), **Tile Orange** (#ff6500), **Tile Yellow** (#f7fe01): the light-theme tile fills, rotated across the bento grid so neighbors differ. Not used for text.
- **Tile Pink** (#ffb4e6): a fifth tile fill used in both themes.

### Secondary
- **Night Blue** (#5078f3), **Night Mint** (#b4ffda), **Night Violet** (#b398ff), **Night Yellow** (#ffe552): the dark-theme tile fills, the same rotation as the light set but softer.

### Neutral
- **Paper Cream** (#fdf9e6): light page background.
- **Ink** (#151418): light text.
- **Outline Black** (#000000): the 3px borders and offset shadows in light mode.
- **Night** (#212121): dark page background and the project popup surface in both themes.
- **Night Text** (#ebebeb): body text on dark and popup text.
- **Night Muted** (#c3c3c3): secondary text on dark (hero tagline).

### Named Rules
**The Color Lives in Tiles Rule.** Saturated hues fill project tiles. Text stays Ink or Night Text, never a tile color.
**The Dark Popup Rule.** The project popup is Night with Night Text in both themes, so screenshots sit on a calm ground.

## Typography

**Display Font:** Audiowide (with sans-serif fallback)
**Body Font:** Manrope (with sans-serif fallback)

**Character:** Audiowide is a rounded retro-futurist display face that gives headings, buttons and the services list their personality; Manrope keeps reading text clean and friendly.

### Hierarchy
- **Display** (400, 5rem, 1.1; 3.5rem under 720px): hero greeting.
- **Headline** (400, 3rem italic, 1.2; 2.3rem under 900px): services list items.
- **Title** (400, 2rem; 1.5rem under 720px, balanced wrap): popup project titles.
- **Lead** (Manrope 400, 2rem): hero tagline.
- **Body** (Manrope 400, 1.2rem, 1.6; 1rem under 720px): popup descriptions, in a column of roughly 40 to 60 characters.

### Named Rules
**The Two Voices Rule.** Audiowide for anything the visitor scans or presses, Manrope for anything they read.

## Layout

A centered `.wrapper` (max 1440px, inline padding min(40px, 10%)). The hero places the greeting card beside a 350px phone frame. Projects sit in a bento grid inside a 1200px container with 32px padding and 24px gaps, defined with named grid areas (3 columns on desktop, 2 below 960px, a stacked 2-column list with 1:1.33 tiles below 720px, 1 column below 540px). Tiles have 40px inner padding and a 250px minimum image height. The services section uses full-width ruled rows that slide in from alternating sides.

The project popup is a modal dialog, 75vw wide (92vw under 720px), with a 2.5fr / 1.5fr image-and-text grid that stacks to one column under 720px; its height is capped to the viewport.

## Elevation & Depth

Two systems, one per theme. **Light** is hard: offset black shadows and thick outlines, no blur. **Dark** is soft: tonal contrast between bright tiles and the dark popup, with a diffuse drop shadow under project images.

### Shadow Vocabulary
- **Light hard offset** (`box-shadow: 5px 5px black`, plus `3px solid black` border): hero card, project tiles, phone frame. Light mode only.
- **Dark image lift** (`filter: drop-shadow(0 0 20px rgba(0,0,0,0.25))`): the screenshot on each tile. Dark mode only; light mode sets `filter: none`.

### Named Rules
**The One Language Per Theme Rule.** A theme uses one depth language throughout. Never put a soft blurred shadow on a light-mode tile, or a hard black outline on a dark-mode one.

## Shapes

**Light:** squared. Tiles, images and the hero card lose their radius (0px) and gain 3px black borders. The phone frame is the exception: it keeps its 44px radius so it still reads as a smartphone, with the 3px black border and hard shadow following the curve. **Dark:** rounded: 15px on tiles and popup, 12px on tile images, 44px on the phone frame, 3px on tooltips. The project popup keeps its 15px radius and has no border in both themes. The close button is fully round. A full-viewport grain canvas sits over everything at 10% opacity.

## Components

### Project Tile
Light: squared, 3px black border, 5px offset shadow, bright tile fill. Dark: 15px radius, no border, softer fill. Both: 40px padding around a screenshot that is also squared and outlined in light, 12px-radius with a diffuse shadow in dark. Siblings fade to 70% while one is hovered. Clicking opens the popup via a Flip transition from the tile.

### Project Popup
Night surface, Night Text, 15px radius, padding 2rem 3rem 3rem. Left: scrollable screenshot; right: Audiowide title and Manrope description. The grid expands from 1fr/0 to 2.5fr/1.5fr as it opens. Closes with the close button, a click outside, or Escape.

### Close Button
44px round button, transparent, Night Text icon, 15% light fill on hover, 2px currentColor focus ring.

### Hero Card and Phone Frame
A greeting card with the tech icon row and location, beside a 350x760px phone frame with typed text and screenshots. Light mode: the card is squared with a 3px black border and hard shadow; the phone frame keeps its 44px radius with the same border and shadow. Dark mode: rounded (phone frame 44px).

## Do's and Don'ts

### Do:
- **Do** put color in the tiles and keep text Ink or Night Text.
- **Do** use Audiowide for headings and controls, Manrope for reading text.
- **Do** keep each theme to its own depth language (hard in light, soft in dark).
- **Do** animate with GSAP: staggered tile entrance, Flip for tile to popup, about 0.2 to 0.4s with power2 easing.
- **Do** keep the popup dark in both themes.

### Don't:
- **Don't** let the site become a generic template portfolio: a dark hero with gradient text over an identical card grid.
- **Don't** mix hard and soft depth within one theme.
- **Don't** set body copy in Audiowide.
- **Don't** put tile colors behind long text.
- **Don't** use `--clr-lightpurple` or `--border-sm`: they are referenced in `Work.astro` and `Project.astro` but defined nowhere, so the bento container currently renders with no background or border.
- **Don't** treat the temporary theme button and the duplicated light-mode blocks (`:root[data-theme="light"]`) in Hero, Panel and Project as part of the system; they are debug scaffolding to remove.
