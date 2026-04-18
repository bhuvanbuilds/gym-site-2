# Gym App Build Task

## Status: IN PROGRESS

## Done
- [x] website_init
- [x] DB schema (leads, members, attendance, admins)
- [x] DB migrations
- [x] shadcn components
- [x] Full API backend (auth, leads, members, attendance, stats)
- [x] styles.css (dark theme, Bebas Neue, animations)
- [x] useScrollReveal hook
- [x] Navbar
- [x] Hero section
- [x] Programs section
- [x] Transformations section
- [x] Pricing section

## Todo
- [ ] Testimonials component
- [ ] Contact component
- [ ] CTA component
- [ ] LeadForm component
- [ ] Landing page (index.tsx) assembling all sections
- [ ] Admin login page
- [ ] Admin dashboard
- [ ] Admin members page
- [ ] Admin attendance page
- [ ] Admin leads page
- [ ] Member self-service page
- [ ] App router (app.tsx)
- [ ] Seed admin
- [ ] Build check
- [ ] Browser test

## Architecture
- Landing: / (public)
- Admin login: /admin/login
- Admin dashboard: /admin (protected)
- Admin members: /admin/members
- Admin attendance: /admin/attendance
- Admin leads: /admin/leads
- Member page: /member (phone lookup)
