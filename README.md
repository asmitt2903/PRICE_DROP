# 📉 Price Drop

**Price Drop** is a modern, full-stack price tracking web application built with **Next.js 16**, **Supabase**, and **Firecrawl**. It allows users to track product prices from major e-commerce websites (such as Amazon, Flipkart, and more) by simply pasting a product URL, and visualize price trends over time with interactive charts.

---

## ✨ Features

- **⚡ Lightning-Fast Scraping**: Powered by [Firecrawl](https://firecrawl.dev) to extract product details, live pricing, and images even across JavaScript-heavy and bot-protected e-commerce pages.
- **🔐 Google Authentication**: Secure user authentication and session management using Supabase SSR and Google OAuth.
- **📊 Interactive Price History Charts**: Visual price tracking using [Recharts](https://recharts.org) to monitor price fluctuations and spot the best deals.
- **🎯 Personalized Dashboard**: Each authenticated user manages their own list of tracked items with direct store links and one-click removal.
- **🔔 Instant Feedback**: Clean toasts powered by [Sonner](https://sonner.emilkowal.ski) for real-time status updates and notifications.
- **🎨 Modern UI/UX**: Built with Tailwind CSS, Lucide icons, and Shadcn UI design components.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components & Icons**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth SSR)
- **Web Scraping / Extraction**: [Firecrawl SDK](https://github.com/mendableai/firecrawl)

---

## 📁 Project Structure

```text
price-drop/
├── app/
│   ├── actions.js          # Next.js Server Actions (CRUD, scraping, auth)
│   ├── auth/
│   │   └── callback/       # OAuth callback route for Supabase
│   ├── globals.css         # Global styles & Tailwind directives
│   ├── layout.js           # Root layout with font and metadata
│   └── page.jsx            # Main dashboard and landing page
├── components/
│   ├── AddproductForm.jsx  # URL input form to track new products
│   ├── AuthButton.jsx      # Header login / logout button
│   ├── AuthModal.js        # Google OAuth dialog modal
│   ├── PriceChart.jsx      # Historical price line chart (Recharts)
│   ├── productCard.jsx     # Tracked product display card
│   └── ui/                 # Reusable Shadcn UI components
├── lib/
│   └── firecrawl.js        # Firecrawl client configuration & scraper prompt
└── utils/
    └── supabase/           # Supabase SSR client, server, and middleware helpers
```

---

## 🗄️ Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to set up the necessary tables and relationships:

```sql
-- 1. Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  name text not null,
  current_price numeric not null,
  currency text default 'USD',
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_product_url unique (user_id, url)
);

-- 2. Create price_history table
create table public.price_history (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  price numeric not null,
  currency text default 'USD',
  checked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.price_history enable row level security;

-- 4. RLS Policies for products
create policy "Users can view their own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

-- 5. RLS Policies for price_history
create policy "Users can view price history for their products"
  on public.price_history for select
  using (
    exists (
      select 1 from public.products
      where products.id = price_history.product_id
      and products.user_id = auth.uid()
    )
  );

create policy "Users can insert price history for their products"
  on public.price_history for insert
  with check (
    exists (
      select 1 from public.products
      where products.id = price_history.product_id
      and products.user_id = auth.uid()
    )
  );
```

---

## ⚙️ Environment Variables

Create a `.env.local` (or `.env`) file in the root directory and add the following keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_publishable_key

# Firecrawl
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

### Google OAuth Configuration in Supabase
1. Go to your **Supabase Dashboard** > **Authentication** > **Providers** > **Google**.
2. Enable Google OAuth and supply your Google Client ID and Secret from Google Cloud Console.
3. Add `http://localhost:3000/auth/callback` (and your production domain) under **Redirect URLs**.

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 3. Build for Production

```bash
npm run build
npm run start
```

---

