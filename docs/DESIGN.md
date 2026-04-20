# Design System Strategy: The Scholarly Archive
 
## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**
 
This design system moves away from the rigid, sterile grids of modern SaaS and toward the storied layouts of high-end editorial broadsheets. The objective is to evoke the feeling of a prestigious academic institution—one that respects heritage but embraces the speed of modern information.
 
We achieve this through **Intentional Asymmetry**. Rather than perfectly centered blocks, we use "weighted" layouts where text heavy-sections are balanced by expansive negative space and overlapping media. This creates a rhythmic, pacing-driven experience that mimics the physical act of unfolding a newspaper. We avoid "template-itis" by treating every page as a curated canvas where typography is the primary architecture.
 
---
 
## 2. Colors & Surface Philosophy
The palette is rooted in organic, earth-toned depth. It is designed to reduce eye strain while maintaining a high-contrast, premium "Dark Academia" aesthetic.
 
### The Color Palette
*   **Primary (The Ink):** `primary` (#592100) and `primary_container` (#78350f). Used for authoritative headers and deep accents.
*   **Secondary (The Call to Action):** `secondary` (#9b4500). Reserved for high-priority interaction points and moments of emphasis.
*   **Background (The Parchment):** `surface` (#fff9ec). A soft, warm cream that serves as our canvas.
 
### The "No-Line" Rule
To ensure a high-end feel, designers are **prohibited from using 1px solid borders for general sectioning.** Structural boundaries must be defined through:
*   **Tonal Shifts:** Transitioning from `surface` to `surface-container-low` to define a sidebar.
*   **Whitespace:** Utilizing the spacing scale to create distinct content "islands."
 
### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper.
*   **Base:** `surface` (The desk).
*   **Sectioning:** `surface-container-low` (The document folder).
*   **Floating Elements:** `surface-container-lowest` (The active sheet).
Always nest containers to create depth. A card (`surface-container-lowest`) should sit on a section (`surface-container-low`) to create a natural, "shadowless" lift.
 
### The "Glass & Gradient" Rule
To avoid a "flat" or "web 1.0" look, use **Signature Textures**:
*   **Editorial Gradients:** Main CTAs should use a subtle linear gradient from `secondary` (#9b4500) to `secondary_container` (#fd8a42) at a 15-degree angle.
*   **Glassmorphism:** For floating navigation or search overlays, use `surface_container_low` at 80% opacity with a `24px` backdrop blur.
 
---
 
## 3. Typography
The typographic pairing is a conversation between tradition and utility.
 
*   **Display & Headlines (Newsreader/Crimson Pro):** This is our "Voice of Authority." Use `display-lg` and `display-md` with tight letter spacing (-2%) to create a dense, editorial impact. For long-form headlines, use `headline-lg` with increased line height (1.3) to mimic historical mastheads.
*   **Body & Labels (Inter):** This is our "Utility." Use `body-lg` for article leads and `body-md` for standard reading. Labels (`label-md`) should be set in All-Caps with +5% letter spacing to provide a modern, "tagged" metadata look.
 
---
 
## 4. Elevation & Depth
In this design system, depth is a result of light and layering, not structural boxes.
 
*   **The Layering Principle:** Avoid shadows for static elements. Instead, use the **Surface Tier Scale**. A "High" tier container against a "Low" tier background provides enough visual separation to denote hierarchy without the clutter of a stroke.
*   **Ambient Shadows:** For interactive floating elements (modals, dropdowns), use "Academic Shadows." These are brown-tinted: `box-shadow: 0 12px 32px rgba(89, 33, 0, 0.08)`. The use of the primary brown tint in the shadow makes the element feel like it is physically part of the environment rather than a digital overlay.
*   **The "Ghost Border" Fallback:** If a container requires a border for accessibility (e.g., input fields), use the `outline_variant` at 20% opacity. This creates a "whisper" of a line that guides the eye without breaking the editorial flow.
*   **Signature Gold Accents:** The gold token (#FDE68A) should be used sparingly as a **1px highlight**—perhaps only on the left side of a blockquote or as a top-border for the "Featured" section—to denote premium status.
 
---
 
## 5. Components
 
### Buttons
*   **Primary:** `secondary` (#9b4500) background with `on_secondary` (#ffffff) text. Use `0.25rem` (sm) rounding to maintain a sharp, scholarly edge.
*   **Tertiary (Editorial Link):** No background. Use `primary` text with a 1px gold underline that appears on hover.
 
### Cards & News Items
*   **Style:** No borders, no dividers. Use `surface-container-lowest` background.
*   **Layout:** Use "Overhanging Media"—images should bleed to the edge of the card, while text is padded heavily (2rem) to create an expensive, airy feel.
 
### Input Fields
*   **Style:** Minimalist. A bottom-only border using `outline` (#87736a).
*   **State:** On focus, the bottom border transitions to the Warm Gold `secondary` color with a subtle 2px glow.
 
### The "Masthead" (Header)
*   The header should be oversized, utilizing `display-lg`. Unlike standard apps, the Masthead should feel like the front page of a newspaper, incorporating the date and weather in `label-sm` Inter typography.
 
---
 
## 6. Do's and Don'ts
 
### Do:
*   **Embrace White Space:** If a section feels crowded, double the padding. Premium design "breathes."
*   **Use Intentional Asymmetry:** Align a headline to the left and the body text to a narrower, offset column to create visual interest.
*   **Mix Weights:** Pair a Bold `display-sm` headline with a Regular `body-md` caption for high contrast.
 
### Don't:
*   **Don't use pure black:** Use `on_surface` (#201c02) for all text. Pure black (#000) kills the "Heritage" warmth.
*   **Don't use standard dividers:** Never use a `
` or a grey 1px line to separate news stories. Use 48px of vertical space or a change in background tone instead.

*   **Don't over-round:** Avoid the "pill" shape for everything except labels. Roundedness `xl` (0.75rem) is the maximum; `sm` (0.125rem) is the standard for a more "printed" feel.