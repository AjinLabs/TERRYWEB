# TERRYWEB — Project Guidelines & Design Foundations

## Design Foundation: Apple Fluid Interface & Motion Principles

All user interfaces, interactions, animations, and typography in this boutique clothing website must follow Apple's fluid interface principles translated for the web:

### 1. Response & Latency
- Respond instantly on pointer-down (`:active` with `transform: scale(0.97)`), not on release.
- Avoid artificial delays, input locks, or unneeded waits.

### 2. Direct Manipulation & Interruptibility
- When dragging (cart drawer, image carousels, sheet modals), content tracks 1:1 with pointer events.
- Never lock out user input during an animation.
- All animations must be interruptible and redirectable mid-flight.

### 3. Spring Physics Over Fixed Easing
- Use critically damped springs (`damping: 1.0`, `response: 0.3–0.4s`) for standard UI transitions to feel natural and calm.
- Use slight bounce (`damping: ~0.8`) only when preceded by physical momentum (flicks, throws).

### 4. Translucent Materials & Depth
- Use floating translucent chrome with `backdrop-filter: blur(20px) saturate(180%)` and subtle white highlight border for headers, navigation, and floating action sheets.
- Ensure high contrast vibrancy for text over blurred backgrounds.

### 5. Typography Hierarchy & Optical Sizing
- Negative tracking (`letter-spacing: -0.02em`) on large display headings.
- Slightly positive tracking on small uppercase badges and labels.
- Tight line-height on headings (`line-height: 1.05 - 1.15`), comfortable leading on body text.

### 6. Accessibility & Reduced Motion
- Honor `@media (prefers-reduced-motion: reduce)` by cross-fading opacities instead of sliding or springing.
- Honor `@media (prefers-reduced-transparency: reduce)` with solid opaque backgrounds.

### 7. Core Store Policies & Identity
- **Brand**: TERRY 7 WOMEN (Emerald green, white, red 7 accent).
- **Products**: Exclusive handcrafted 1-of-1 pieces, each with exactly ONE tailored size (M, L, XL, or XXL).
- **Auto-Delete**: Immediately auto-delete purchased pieces from the catalog upon successful order.
- **No WhatsApp**: Direct online checkout via dedicated `/checkout` page with animated pay button and `/order-confirmed` page.
- **Policy**: "No Replacement & No Return" due to the unique 1-of-1 handcrafted nature of each garment.
