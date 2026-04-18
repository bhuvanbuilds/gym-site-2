# FitZone Gym — Design System

## Theme
Dark. Aggressive. High-energy. No softness.

## Colors
- Background: #0a0a0a (near-black)
- Surface: #111111 / #1a1a1a
- Primary accent: #FF4500 (electric orange-red)
- Secondary accent: #FF6B35
- Text: #FFFFFF / #E0E0E0
- Muted: #666666
- Success: #22c55e
- Danger: #ef4444
- Border: rgba(255,255,255,0.08)

## Typography
- Display / Headlines: "Bebas Neue" (Google Fonts) — all caps, bold impact
- Body: "DM Sans" (Google Fonts) — clean, readable
- Sizes: responsive, clamp-based

## Spacing
- Generous padding: sections get 80–120px vertical
- Mobile: 24px horizontal padding
- Desktop: max-width 1200px centered

## Animations
- Scroll-reveal: fade-up on enter (IntersectionObserver, CSS transitions)
- Hero: staggered text entrance
- Buttons: scale + glow on hover
- Cards: lift (translateY -4px) on hover
- Number counters: animate on scroll

## Components
- Buttons: pill-shaped, bold, orange gradient background
- Cards: dark surface, subtle border, hover lift
- Forms: dark inputs, orange focus ring
- Nav: transparent → solid on scroll

## Mobile First
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch targets min 48px
- Large readable text on mobile

## Anti-patterns to avoid
- No white backgrounds
- No purple gradients
- No rounded card grids with drop shadows
- No Inter or Roboto fonts
