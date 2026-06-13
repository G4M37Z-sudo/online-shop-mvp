-- Supabase schema for Online Shop MVP
-- Run this in the Supabase SQL editor

-- Enable uuid extension if not already
create extension if not exists "uuid-ossp";

-- Users table (Supabase Auth already provides users table, but we can extend)
-- Actually, we'll use Supabase Auth's built-in users table, so we don't need to create it.
-- We'll create profiles table to extend auth.users
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories table
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Products table
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    price decimal(10,2) not null check (price >= 0),
    image_url text,
    category_id uuid references public.categories on delete set null,
    stock integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Orders table
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users on delete set null,
    status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal decimal(10,2) not null check (subtotal >= 0),
    delivery_cost decimal(10,2) not null check (delivery_cost >= 0),
    tax decimal(10,2) default 0 check (tax >= 0),
    total decimal(10,2) not null check (total >= 0),
    delivery_address text,
    delivery_latitude decimal(10,8),
    delivery_longitude decimal(11,8),
    payment_id text, -- Stripe payment intent ID
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Order items table
create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references public.orders on delete cascade,
    product_id uuid references public.products on delete set null,
    quantity integer not null check (quantity > 0),
    unit_price decimal(10,2) not null check (unit_price >= 0),
    total_price decimal(10,2) not null check (total_price >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert some sample categories
insert into public.categories (name, description) values
    ('Vegetables', 'Fresh vegetables and greens'),
    ('Fruits', 'Seasonal fruits'),
    ('Dairy', 'Milk, cheese, yogurt'),
    ('Bakery', 'Bread, pastries, cakes'),
    ('Meat', 'Fresh meat and poultry'),
    ('Pantry', 'Canned goods, oils, spices')
on conflict (name) do nothing;

-- Insert sample products (matching our mock data)
insert into public.products (name, description, price, image_url, category_id, stock, is_active) values
    ('Fresh Tomatoes', 'Ripe red tomatoes', 2.99, 'https://via.placeholder.com/300x200?text=Tomatoes', 
     (select id from public.categories where name = 'Vegetables'), 50, true),
    ('Organic Apples', 'Crisp organic apples', 4.50, 'https://via.placeholder.com/300x200?text=Apples', 
     (select id from public.categories where name = 'Fruits'), 30, true),
    ('Whole Milk', 'Fresh whole milk 1L', 3.20, 'https://via.placeholder.com/300x200?text=Milk', 
     (select id from public.categories where name = 'Dairy'), 25, true),
    ('Brown Bread', 'Whole grain brown bread', 2.50, 'https://via.placeholder.com/300x200?text=Bread', 
     (select id from public.categories where name = 'Bakery'), 40, true),
    ('Chicken Breast', 'Boneless chicken breast 500g', 8.99, 'https://via.placeholder.com/300x200?text=Chicken', 
     (select id from public.categories where name = 'Meat'), 20, true),
    ('Olive Oil', 'Extra virgin olive oil 500ml', 12.99, 'https://via.placeholder.com/300x200?text=Olive+Oil', 
     (select id from public.categories where name = 'Pantry'), 15, true)
on conflict (name) do nothing;

-- Enable realtime for tables (optional, for future features)
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;