# Design System: ChatFlow

## Vibe & Aesthetic
The design should feel **modern, premium, and highly responsive**. It should utilize subtle glassmorphism (translucency and blurs), soft drop shadows, and vibrant gradients against clean, light or dark surface backgrounds. The application should feel native, snappy, and trustworthy—similar to high-end modern SaaS or communication apps like Discord, Telegram, or Linear.

## Color Palette
The color system relies on a strong, vibrant primary brand color complemented by a neutral surface scale.

*   **Primary:** A vibrant, electric purple/blue gradient (e.g., Violet-600 to Indigo-500). Used for primary buttons, active states, and call-to-actions.
*   **Accent:** A secondary vibrant color (e.g., Pink or Cyan) to provide contrast and visual interest in gradients.
*   **Surface:** A clean grayscale or cool-gray scale. 
    *   `Surface-50` / `Surface-100` for app backgrounds and sidebars.
    *   `Surface-200` for subtle borders.
    *   `Surface-800` / `Surface-900` for dark mode overlays (e.g., video call modal background) and primary text.
*   **Semantic Colors:**
    *   **Success:** Emerald green (used for "Online" status dots and success toasts).
    *   **Danger:** Vibrant red (used for "End Call", "Reject", and error states).
    *   **Warning:** Amber (used for pending states or alerts).

## Typography
Use a clean, modern, geometric sans-serif typeface (e.g., **Inter**, **Outfit**, or **Plus Jakarta Sans**).
*   **Headings:** Bold, tightly tracked.
*   **Body:** Highly readable, adequate line height (1.5).
*   **UI Text:** Medium or Semibold weights for buttons and tabs to ensure legibility.

## Shape & Corners
Embrace a friendly but premium feel by using generous border radii:
*   **Buttons & Inputs:** `rounded-xl` or `rounded-full` (pill shape).
*   **Cards & Chat Bubbles:** `rounded-2xl` with subtle directional variations for chat bubbles (e.g., flat corner on the sender's side).
*   **Modals:** `rounded-3xl` for a soft, elevated look.
*   **Avatars:** Always `rounded-full`, sometimes with a subtle ring border.

## Components

### Buttons
*   **Primary Button:** Solid primary color or gradient background. White text. Subtle hover scale/lift and shadow.
*   **Secondary/Ghost Button:** Transparent background, surface-600 text. On hover, background becomes surface-100.
*   **Action Buttons (Call Controls):** Circular (`rounded-full`), padded. Red for destructive (End Call), Surface-700/800 for inactive/neutral.

### Inputs & Forms
*   Clean inputs with `Surface-50` or white backgrounds.
*   Subtle `Surface-200` borders that transition to a `Primary-500` ring on focus.
*   Use floating labels or clear, muted placeholder text.

### Layout & Navigation
*   **Sidebar Navigation:** Distinct vertical divider. Active items should be highlighted with a primary color background with low opacity (e.g., `Primary-50`).
*   **Modals/Overlays:** Use `backdrop-blur` heavily for the background overlay (e.g., `bg-surface-900/80 backdrop-blur-sm`).
*   **Glassmorphism:** Sticky headers and toolbars should be slightly transparent with a background blur so content scrolling underneath is slightly visible.

### Micro-interactions
*   **Loading States:** Use pulsing animations (e.g., skeleton loaders or a pulsing dot for "ringing").
*   **Hover States:** Cards, buttons, and list items should have a slight visual change (background darkening or shadow expansion) on hover.
