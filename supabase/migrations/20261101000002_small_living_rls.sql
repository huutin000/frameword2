-- =============================================================================
-- SMALL LIVING 2026 — ROW LEVEL SECURITY (RLS) POLICIES
-- Migration ID: 20261101000002_small_living_rls
-- Security Standard: Defense-in-depth, Principle of Least Privilege
-- =============================================================================

-- Enable RLS on all exposed tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scene_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile (non-role fields)"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND (
        -- Non-admins cannot escalate their own role
        public.is_admin() OR role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    )
);

CREATE POLICY "Admins have full access to profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. CATALOG POLICIES (CATEGORIES, PRODUCTS, VARIANTS, TAGS)
-- -----------------------------------------------------------------------------
-- Public Read
CREATE POLICY "Public can view published categories"
ON public.categories FOR SELECT
TO public
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public can view published products"
ON public.products FOR SELECT
TO public
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public can view variants of published products"
ON public.product_variants FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_variants.product_id
        AND (p.is_published = true OR public.is_admin())
    )
);

CREATE POLICY "Public can view product tags of published products"
ON public.product_tags FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        WHERE p.id = product_tags.product_id
        AND (p.is_published = true OR public.is_admin())
    )
);

-- Admin Full Write
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage products"
ON public.products FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage product variants"
ON public.product_variants FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage product tags"
ON public.product_tags FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. SPATIAL PLANNING POLICIES (ROOMS & SCENES)
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view own room profiles or templates"
ON public.room_profiles FOR SELECT
TO public
USING (
    is_template = true
    OR (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR public.is_admin()
);

CREATE POLICY "Users can manage their own room profiles"
ON public.room_profiles FOR ALL
TO authenticated
USING (user_id = auth.uid() OR public.is_admin())
WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can view own room scenes or template scenes"
ON public.room_scenes FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.room_profiles rp
        WHERE rp.id = room_scenes.room_profile_id
        AND (rp.is_template = true OR rp.user_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Users can manage scenes of their own rooms"
ON public.room_scenes FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.room_profiles rp
        WHERE rp.id = room_scenes.room_profile_id
        AND (rp.user_id = auth.uid() OR public.is_admin())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.room_profiles rp
        WHERE rp.id = room_scenes.room_profile_id
        AND (rp.user_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Users can view scene objects in accessible scenes"
ON public.scene_objects FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.room_scenes rs
        JOIN public.room_profiles rp ON rp.id = rs.room_profile_id
        WHERE rs.id = scene_objects.scene_id
        AND (rp.is_template = true OR rp.user_id = auth.uid() OR public.is_admin())
    )
);

CREATE POLICY "Users can manage objects in their own scenes"
ON public.scene_objects FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.room_scenes rs
        JOIN public.room_profiles rp ON rp.id = rs.room_profile_id
        WHERE rs.id = scene_objects.scene_id
        AND (rp.user_id = auth.uid() OR public.is_admin())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.room_scenes rs
        JOIN public.room_profiles rp ON rp.id = rs.room_profile_id
        WHERE rs.id = scene_objects.scene_id
        AND (rp.user_id = auth.uid() OR public.is_admin())
    )
);

-- -----------------------------------------------------------------------------
-- 4. ORDERS & COMMERCE POLICIES
-- -----------------------------------------------------------------------------
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
TO public
USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR public.is_admin()
);

CREATE POLICY "Users can view items of their own orders"
ON public.order_items FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
        AND ((auth.uid() IS NOT NULL AND o.user_id = auth.uid()) OR public.is_admin())
    )
);

CREATE POLICY "Users can view events of their own orders"
ON public.order_events FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_events.order_id
        AND ((auth.uid() IS NOT NULL AND o.user_id = auth.uid()) OR public.is_admin())
    )
);

CREATE POLICY "Admins have full management on orders"
ON public.orders FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full management on order items"
ON public.order_items FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full management on order events"
ON public.order_events FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. PROMOTIONS & AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view active promotions"
ON public.promotions FOR SELECT
TO public
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage promotions"
ON public.promotions FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can view and insert audit logs"
ON public.admin_audit_logs FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can view inventory movements"
ON public.inventory_movements FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

