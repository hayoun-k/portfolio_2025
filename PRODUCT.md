# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two audiences, equally weighted: hiring managers and recruiters evaluating Hayoun for web development roles, and prospective clients (small businesses, founders) who need web design, landing pages, technical SEO or a custom CMS. Both arrive to judge the work and decide whether to get in touch.

## Product Purpose
Hayoun K.'s personal portfolio, based in Los Angeles. It shows real work and services so a visitor can decide to hire or commission Hayoun, and reach out through the contact form. Success is an inquiry or interview request.

## Positioning
One person who both designs and builds: web design, implementation, technical SEO and performance optimization come from the same hands, so the site itself is evidence of the craft.

## Operating Context
Single-page site with a hero, a project bento grid whose items open detail popups, and a services list (Technical SEO, Web design, Performance Optimization, Custom CMS). Visitors may be on desktop or phone. A contact form backed by a Cloudflare Worker (`contact-form-worker/`) exists but is currently commented out in `src/pages/index.astro`.

## Capabilities and Constraints
- Stack is Astro with GSAP (Flip, ScrollTrigger) for motion; keep it.
- Hero wording is final: "Hello I'm Hayoun" and "I like to bring ideas into web."
- Tech shown in the hero: HTML, CSS, JavaScript, React, Astro, Tailwind.
- Undecided: when the contact form returns to the page; whether light and dark themes are both permanent.

## Brand Commitments
Name: Hayoun K. Hero line above is binding. No other brand assets, colors or typography were declared as binding.

## Evidence on Hand
Project entries in `src/components/Project.astro` with screenshots in `src/assets/image/works/`: Network Setup Page, Landing Page Development, Maplestory Simulator (Starforce simulator for the Oreo Guild, Plotly.js), Responsive Email Signature, ScoutPicFinder (Next.js, Unsplash API), Discord Bot Development (JavaScript, Cloudflare Workers). No testimonials, client names or metrics were provided; do not invent them.

## Product Principles
- The portfolio is itself a sample of the work: what it does must be as well built as what it claims.
- Show projects, not promises; real screenshots and honest descriptions over claims.
- Contacting Hayoun should be easy for both an employer and a client.
- Performance and accessibility are part of the pitch, so the site must not undercut them.
