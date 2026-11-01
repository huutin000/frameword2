-- =============================================================================
-- SMALL LIVING 2026 — DATABASE SCHEMA MIGRATION
-- Migration ID: 20261101000001_small_living_schema
-- Engine: PostgreSQL 15+ / Supabase
-- Currency Standard: Integer VND (Bigint, no floating point)
-- Spatial Units Standard: Millimeters (Integer mm)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for role lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function to check if current actor has admin privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- -----------------------------------------------------------------------------
-- 2. CATEGORIES (ROOMS & SPATIAL PROBLEMS TAXONOMY)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('room', 'problem', 'product_type')),
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    icon_name TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_type ON public.categories(type);

-- -----------------------------------------------------------------------------
-- 3. PRODUCTS & VARIANTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    price_vnd BIGINT NOT NULL CHECK (price_vnd >= 0),
    compare_at_price_vnd BIGINT CHECK (compare_at_price_vnd >= 0),
    -- Spatial dimensions in mm
    width_mm INT NOT NULL CHECK (width_mm > 0),
    depth_mm INT NOT NULL CHECK (depth_mm > 0),
    height_mm INT NOT NULL CHECK (height_mm > 0),
    weight_kg NUMERIC(6, 2) CHECK (weight_kg >= 0),
    max_load_kg NUMERIC(6, 2) CHECK (max_load_kg >= 0),
    -- Rental & installation constraints
    no_drill_flag BOOLEAN NOT NULL DEFAULT true,
    material TEXT NOT NULL,
    color TEXT NOT NULL,
    -- Inventory
    stock_available INT NOT NULL DEFAULT 0 CHECK (stock_available >= 0),
    stock_reserved INT NOT NULL DEFAULT 0 CHECK (stock_reserved >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    -- Media & 3D asset provenance
    image_url TEXT NOT NULL,
    model_3d_url TEXT,
    fit_score_explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_dimensions ON public.product_variants(width_mm, depth_mm, height_mm);

-- Product room/problem tagging
CREATE TABLE IF NOT EXISTS public.product_tags (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    tag_type TEXT NOT NULL CHECK (tag_type IN ('room', 'problem', 'style')),
    PRIMARY KEY (product_id, tag)
);

CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON public.product_tags(tag);

-- -----------------------------------------------------------------------------
-- 4. SPATIAL PLANNING (ROOM PROFILES & SCENES)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.room_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    width_mm INT NOT NULL CHECK (width_mm >= 500 AND width_mm <= 30000),
    depth_mm INT NOT NULL CHECK (depth_mm >= 500 AND depth_mm <= 30000),
    height_mm INT NOT NULL CHECK (height_mm >= 1500 AND height_mm <= 10000),
    no_drill_required BOOLEAN NOT NULL DEFAULT true,
    budget_vnd BIGINT CHECK (budget_vnd >= 0),
    is_template BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_room_profiles_user ON public.room_profiles(user_id);

CREATE TABLE IF NOT EXISTS public.room_scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_profile_id UUID NOT NULL REFERENCES public.room_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Mặt bằng bố trí chính',
    camera_state JSONB NOT NULL DEFAULT '{"view": "top", "zoom": 1}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.scene_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id UUID NOT NULL REFERENCES public.room_scenes(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    x_mm INT NOT NULL,
    y_mm INT NOT NULL,
    z_mm INT NOT NULL DEFAULT 0,
    rotation_deg INT NOT NULL DEFAULT 0 CHECK (rotation_deg IN (0, 90, 180, 270)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_scene_objects_scene ON public.scene_objects(scene_id);

-- -----------------------------------------------------------------------------
-- 5. INVENTORY MOVEMENTS LEDGER
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('restock', 'order_placed', 'order_cancelled', 'damage', 'adjustment')),
    delta_quantity INT NOT NULL,
    balance_after INT NOT NULL CHECK (balance_after >= 0),
    reference_id TEXT,
    reason TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_variant ON public.inventory_movements(variant_id);

-- -----------------------------------------------------------------------------
-- 6. PROMOTIONS & DISCOUNT CODES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_percent INT NOT NULL CHECK (discount_percent >= 1 AND discount_percent <= 100),
    max_discount_vnd BIGINT CHECK (max_discount_vnd >= 0),
    min_order_amount_vnd BIGINT NOT NULL DEFAULT 0 CHECK (min_order_amount_vnd >= 0),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ,
    usage_limit INT CHECK (usage_limit > 0),
    times_used INT NOT NULL DEFAULT 0 CHECK (times_used >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions(code);

-- -----------------------------------------------------------------------------
-- 7. ORDERS, ORDER ITEMS & TIMELINE EVENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- Formatted: ORD-2026-XXXXX
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('draft', 'placed', 'processing', 'shipped', 'delivered', 'cancelled')),
    -- Financial snapshots
    subtotal_vnd BIGINT NOT NULL CHECK (subtotal_vnd >= 0),
    discount_vnd BIGINT NOT NULL DEFAULT 0 CHECK (discount_vnd >= 0),
    shipping_vnd BIGINT NOT NULL DEFAULT 0 CHECK (shipping_vnd >= 0),
    total_amount_vnd BIGINT NOT NULL CHECK (total_amount_vnd >= 0),
    applied_promotion_code TEXT REFERENCES public.promotions(code) ON DELETE SET NULL,
    -- Concurrency & Idempotency
    idempotency_key TEXT NOT NULL UNIQUE,
    notes TEXT,
    is_demo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    sku TEXT NOT NULL,
    title_snapshot TEXT NOT NULL,
    dimensions_snapshot TEXT NOT NULL,
    unit_price_vnd BIGINT NOT NULL CHECK (unit_price_vnd >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total_vnd BIGINT NOT NULL CHECK (line_total_vnd >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

CREATE TABLE IF NOT EXISTS public.order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('placed', 'payment_simulated', 'processing_started', 'shipped', 'delivered', 'cancellation_requested', 'cancelled', 'refund_simulated')),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_role TEXT NOT NULL DEFAULT 'customer',
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_events_order ON public.order_events(order_id);

-- -----------------------------------------------------------------------------
-- 8. ADMIN AUDIT LEDGER
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT NOT NULL,
    action TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON public.admin_audit_logs(created_at DESC);

