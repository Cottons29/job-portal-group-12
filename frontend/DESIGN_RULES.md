# Design System Specification: FirstStep Editorial

## 1. Overview & Creative North Star

**Creative North Star: The Upward Ascent**
This design system moves away from the static, boxy nature of traditional job portals to embrace a "Editorial Modernism" aesthetic. Inspired by the logo's geometric "steps," the system utilizes intentional asymmetry, overlapping elements, and high-contrast typography to symbolize professional growth and youthful momentum. 

By breaking the rigid 12-column grid with floating elements and "surface-on-surface" layering, we create a digital experience that feels like a premium magazine tailored for the next generation of Cambodian talent. We avoid "template-itis" by prioritizing white space as a structural element rather than a void.

---

## 2. Colors & Surface Architecture

The palette balances the authority of `Slate-900` with the high-energy vibration of `Primary Blue` and `Tertiary Yellow`.

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are prohibited for sectioning.** Physical boundaries must be defined through:
*   **Background Shifts:** Transitioning from `surface` (#f8f9ff) to `surface_container_low` (#eff4ff).
*   **Tonal Nesting:** Placing a `surface_container_lowest` (#ffffff) card inside a `surface_container` (#e5eeff) wrapper.

### Glass & Texture
*   **Glassmorphism:** Use for floating navigation bars or filter overlays. Apply `surface` with 70% opacity and a `backdrop-blur` of 12px.
*   **Signature Gradients:** For Hero CTAs, use a linear gradient: `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle. This adds "visual soul" and depth that flat hex codes lack.

| Role | Token | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `primary` | #004ac6 | Main brand actions, active states. |
| **Primary Container** | `primary_container`| #2563eb | High-energy accents and vibrant CTAs. |
| **Tertiary (Accent)** | `tertiary_container`| #cea700 | Tag highlights, "New" labels, and student-focused tips. |
| **Surface (Base)** | `surface` | #f8f9ff | The canvas. Clean, professional, airy. |
| **On-Surface** | `on_surface` | #0b1c30 | Editorial text, massive headings (Slate-900 equivalent). |

---

## 3. Typography: The Editorial Scale

We use a dual-font strategy to balance character with readability. **Plus Jakarta Sans** provides a geometric, energetic feel for headings, while **Inter** ensures high legibility for dense job descriptions.

*   **Display (Massive & Bold):** `display-lg` (3.5rem) and `display-md` (2.75rem). Use these for hero statements. Set with tight letter-spacing (-0.02em) in `on_surface`.
*   **Headlines:** `headline-lg` (2rem). Used for section titles. These should feel authoritative and "uncomfortably large" to command attention.
*   **Body:** `body-lg` (1rem). Set in Inter. Use a generous line-height (1.6) to ensure the student portal feels approachable and easy to scan.
*   **Labels:** `label-md` (0.75rem). Use for metadata (location, salary). Often paired with `tertiary` color backgrounds for high contrast.

---

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are a secondary resort. Depth is primarily achieved through **Tonal Layering**.

*   **The Layering Principle:** Stack `surface_container_low` (#eff4ff) on `surface` (#f8f9ff) to create "soft lift."
*   **Ambient Shadows:** For high-conversion cards, use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(11, 28, 48, 0.06);`. The shadow color must be a tint of `on_surface` to mimic natural light.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., input fields), use `outline_variant` (#c3c6d7) at **15% opacity**. Never use 100% opaque borders.
*   **The Step Motif:** Inspired by the logo, elements should "stagger." A card might overlap the section below it by `spacing-8` (2rem) to create a sense of vertical movement.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background, `on_primary` text. `rounded-xl` (1rem). High-energy blue gradient on hover.
*   **Secondary:** `surface_container_high` background. No border. Text in `primary`.
*   **Tertiary:** Transparent background, `primary` text. Use for "Learn More" or less critical actions.

### Cards (The "Job Step" Card)
*   **Style:** `surface_container_lowest` (#ffffff) background. `rounded-xl` (3rem) for a friendly, ultra-modern look.
*   **Constraint:** **No divider lines.** Use `spacing-4` (1rem) of vertical white space to separate the job title from the company logo.

### Input Fields
*   **Style:** `surface_container_low` background. `rounded-md` (1.5rem) corners. On focus, transition the background to `surface_container_lowest` and add a subtle `primary` ghost border (20% opacity).

### Floating Action Chips
*   **Context:** Selection chips for categories (e.g., "Internship," "Full-time").
*   **Style:** `surface_container_high` with `label-md` text. When selected, switch to `tertiary_fixed` (#ffe083) to provide a "high-conversion" highlight.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use massive, bold `on_surface` (Slate-900) headings to create a clear hierarchy.
*   **Do** use the `rounded-xl` (3rem) and `rounded-lg` (2rem) scales liberally to maintain the youthful, "bubbly" but professional persona.
*   **Do** allow elements to overlap (e.g., an image "stepping" out of its container).
*   **Do** prioritize vertical breathing room using `spacing-16` (4rem) between major sections.

### Don’t
*   **Don't** use 1px solid black or grey borders. They break the premium editorial flow.
*   **Don't** use generic grey shadows. Use the `on_surface` tinted ambient shadow.
*   **Don't** use standard "web safe" blue. Stick to the vibrant `primary_container` (#2563eb) for a SaaS-native feel.
*   **Don't** clutter the screen. If a job list feels tight, increase the `surface` spacing rather than adding lines.