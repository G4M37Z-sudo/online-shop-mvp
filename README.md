# Online Shop MVP

A minimal viable product for an online shopping store built with HTML/CSS/Vanilla JS and Supabase backend.

## Features (MVP)

- User authentication (Sign up / Log in)
- Product catalog browsing
- Shopping cart with add/remove/update quantity
- Checkout with delivery cost calculation (using maps)
- Mock payment processing (Stripe test mode)
- Digital order receipt
- Basic admin product management

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Maps:** OpenStreetMap Nominatim (geocoding)
- **Payments:** Stripe Test Mode
- **Deployment:** GitHub Pages + Supabase

## Project Structure

```
online-shop-mvp/
├── index.html
├── style.css
├── script.js
├── supabase/
│   └── schema.sql
└── README.md
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/G4M37Z-sudo/online-shop-mvp.git
cd online-shop-mvp
```

### 2. Set up Supabase
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your **Project URL** and **anon public key** from Settings → API
4. Run the SQL schema:
   - Go to your Supabase project dashboard → SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Click "Run"
5. Create a `.env` file in the project root:
   ```
   SUPABASE_URL=your_project_url_here
   SUPABASE_ANON_KEY=your_anon_public_key_here
   ```

### 3. Set up Stripe (for payments)
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your **test publishable key** and **test secret key** from Developers → API keys
3. Add to your `.env` file:
   ```
   STRIPE_PUBLISHABLE_KEY=your_test_publishable_key_here
   STRIPE_SECRET_KEY=your_test_secret_key_here
   ```

### 4. Run locally
For frontend-only testing (mock data):
- Simply open `index.html` in a browser

For full functionality with Supabase:
- We'll need to serve the files via a local server (to avoid CORS issues) and connect to Supabase
- Example: `python -m http.server 8000` then visit `http://localhost:8000`
- We'll update `script.js` to read from `.env` and connect to Supabase in later steps

### 5. Deploy
1. Push to GitHub (already done)
2. Enable GitHub Pages on the `main` branch (Settings → Pages)
3. Supabase backend will work automatically with the deployed frontend

## Next Steps

1. [ ] Update `script.js` to fetch products from Supabase instead of mock data
2. [ ] Implement Supabase auth (email/password sign up/login)
3. [ ] Add cart persistence (localStorage or Supabase)
4. [ ] Implement delivery cost calculation using OpenStreetMap Nominatim
5. [ ] Integrate Stripe test mode for payments
6. [ ] Show order receipt after successful payment
7. [ ] Create basic admin interface for adding products (protected route)
8. [ ] Add responsive improvements and UI polish
9. [ ] Add order history page for users
10. [ ] Deploy to GitHub Pages

## Development Log

- **2026-06-13**: Initial project structure created with basic HTML/CSS/JS
  - Home, Catalog, Cart pages
  - Mock product data and cart functionality
  - Basic styling and responsive design
- **2026-06-13**: Added Supabase schema with tables for categories, products, orders, order_items, and profiles