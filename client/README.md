# Productr Client

Frontend for the Productr UI built with React, TypeScript, Vite, Tailwind CSS, and React Router.

## What We Built

- Added routing for `/`, `/login`, `/home`, and `/products`
- Built the login page UI
- Built the home dashboard shell with:
  - sidebar
  - top bar
  - empty states
- Added conditional rendering for:
  - Home vs Products section
  - Published vs Unpublished tabs in the home section
- Built the products page empty state
- Added the Add Product modal UI with:
  - open/close state
  - product type dropdown
  - exchange/return eligibility dropdown

## Main Files

- `src/pages/Login.jsx`: login page UI
- `src/pages/Home.tsx`: dashboard shell page
- `src/components/home/`: home and products UI components
- `src/router.tsx`: app routes

## Run The Project

```bash
pnpm dev
```

## Check The Project

```bash
pnpm lint
pnpm build
```
