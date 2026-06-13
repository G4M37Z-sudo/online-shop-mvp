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
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/G4M37Z-sudo/online-shop-mvp.git
   cd online-shop-mvp
   ```

2. **Set up Supabase**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key
   - Run the SQL schema in `supabase/schema.sql` (to be created)
   - Add your Supabase credentials to a `.env` file:
     ```
     SUPABASE_URL=your_project_url
     SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Set up Stripe**
   - Create a Stripe account
   - Get your test publishable key and secret key
   - Add to `.env`:
     ```
     STRIPE_PUBLISHABLE_KEY=your_test_publishable_key
     STRIPE_SECRET_KEY=your_test_secret_key
     ```

4. **Open locally**
   - Simply open `index.html` in a browser for frontend-only testing
   - For full functionality, we'll need to serve via a local server (e.g., `python -m http.server`) and connect to Supabase

5. **Deploy**
   - Push to GitHub
   - Enable GitHub Pages on the `main` branch
   - Supabase will handle the backend automatically

## Next Steps

1. [ ] Set up Supabase database schema (users, products, orders, order_items)
2. [ ] Implement Supabase auth (email/password sign up)
3. [ ] Fetch products from Supabase instead of mock data
4. [ ] Implement cart persistence via Supabase or localStorage
5. [ ] Add delivery cost calculation using OpenStreetMap Nominatim
6. [ ] Integrate Stripe test mode for payments
7. [ ] Show order receipt after successful payment
8. [ ] Create basic admin interface for adding products
9. [ ] Add responsive improvements and UI polish
10. [ ] Deploy to GitHub Pages

## Development Log

- **2026-06-13**: Initial project structure created with basic HTML/CSS/JS
  - Home, Catalog, Cart pages
  - Mock product data and cart functionality
  - Basic styling and responsive design