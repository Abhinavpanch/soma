# Soma — Glassmorphism UI rewrite

## Current stack (from inspection)
- Express + EJS, no layout system — every view currently includes `partials/head`, `partials/navbar`, `partials/sidebar` manually
- Bootstrap 5.3.3 via CDN in `head.ejs` + `script.ejs`
- Custom SCSS (`sass/main.scss`) imports Bootstrap and defines `$primary: #c29938`, `$light: #fbf5e5`
- Public assets: `public/bg.jpg`, `public/soma.jpg`
- Pages: home, login, signup, addPost, showPost, myPosts, profile, adminDashboard, editProfile, forgot, search, searchPost
- Partials: head, navbar, sidebar, script
- Authenticated vs anonymous: `user` may be set in res.locals (navbar references `user`)

## Design direction
- Glassmorphism system: frosted glass cards/panels over an ambient gradient + decorative blur blobs
- Branded accent from the existing $primary (#c29938 gold) used as a tint on glass edges / buttons, so the app still feels like Soma
- Keep the existing navbar/sidebar structure but restyle as glass panels
- Entrance animations: staggered fade-up on cards/posts, hover lift + glow on interactive glass tiles
- Replace inline style blocks in page templates with the shared design system (don't leave one-off CSS scattered across templates)

## Scope decisions to confirm
1. Keep Bootstrap, or replace with a tiny custom utility set + the glass design tokens?
   - Recommendation: keep Bootstrap for grid/forms but override with glass tokens and not rely on its default components visually.
2. How many pages to rewrite in this pass?
   - Recommendation: do the design system first (partials + shared CSS), then auth pages (login, signup, forgot), then the main app pages (home, showPost, myPosts, profile, addPost), then admin/search if time permits.
3. Animations budget
   - Entrance stagger on post cards only, hover lift on cards/buttons, subtle float on background blobs. Avoid heavy per-element motion that could hurt performance on lower-end devices.
4. Background strategy
   - Use `public/bg.jpg` as an ambient backdrop (darkened + blurred) behind the glass panels, plus CSS gradient blobs for glow.
5. Auth pages treatment
   - Login/signup/forgot should be centered glass cards on the ambient background, not full Bootstrap pages.

## Files to touch
- `views/partials/head.ejs` — replace Bootstrap-first head with design-system head (keep Bootstrap only if decided)
- `views/partials/navbar.ejs` — restyle as glass navbar
- `views/partials/sidebar.ejs` — restyle as glass offcanvas/sidebar
- `views/partials/script.ejs` — keep Bootstrap JS only if Bootstrap kept
- `sass/main.scss` — replace Bootstrap import with custom glass design tokens + utilities + animations
- all page templates — remove inline style blocks, use shared classes, add entrance stagger
- possibly `public/` — add a processed background if needed
