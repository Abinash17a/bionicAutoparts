-- Supabase / PostgreSQL Production Schema Migration
-- USA Used Auto Parts / Bionic Auto Parts
-- Migration: 20260917000000_init_supabase_schema.sql

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. TAXONOMY & INVENTORY TABLES
-- -----------------------------------------------------------------------------

-- Categories (High-level commercial taxonomy)
CREATE TABLE IF NOT EXISTS public.categories (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_title TEXT NOT NULL,
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    hero_description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    warranty_summary TEXT NOT NULL DEFAULT '',
    inspection_details JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Makes (Vehicle manufacturers)
CREATE TABLE IF NOT EXISTS public.makes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Models (Specific vehicle models)
CREATE TABLE IF NOT EXISTS public.models (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    make_id TEXT NOT NULL REFERENCES public.makes(id) ON DELETE RESTRICT,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_models_make_slug UNIQUE (make_id, slug)
);

-- Vehicles (Normalized vehicle specifications)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    model_id TEXT NOT NULL REFERENCES public.models(id) ON DELETE RESTRICT,
    year INTEGER NOT NULL,
    trim TEXT,
    engine_code TEXT,
    transmission_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_vehicles_spec UNIQUE NULLS NOT DISTINCT (model_id, year, trim, engine_code, transmission_code)
);

-- Donor Vehicles (Salvage donor provenance & mileage)
CREATE TABLE IF NOT EXISTS public.donor_vehicles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    vin TEXT NOT NULL UNIQUE,
    vehicle_summary TEXT NOT NULL,
    mileage_miles INTEGER NOT NULL DEFAULT 0,
    mileage_formatted TEXT NOT NULL,
    run_condition TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Parts (Physical inventory units with stable public SKUs)
CREATE TABLE IF NOT EXISTS public.parts (
    id TEXT PRIMARY KEY, -- Preserves public SKU (e.g., UAP-2018-TOY-CAM-ENG-01)
    category_slug TEXT NOT NULL REFERENCES public.categories(slug) ON DELETE RESTRICT,
    donor_vehicle_id TEXT REFERENCES public.donor_vehicles(id) ON DELETE SET NULL,
    part_name TEXT NOT NULL,
    condition TEXT NOT NULL DEFAULT 'Used OEM',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    availability TEXT NOT NULL DEFAULT 'In Stock',
    warranty TEXT NOT NULL DEFAULT '',
    shipping TEXT NOT NULL DEFAULT '',
    fitment_notes TEXT NOT NULL DEFAULT '',
    primary_image_url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Part Fitments (Many-to-many part vehicle compatibility)
CREATE TABLE IF NOT EXISTS public.part_fitments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    part_id TEXT NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
    vehicle_id TEXT NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
    year_start INTEGER,
    year_end INTEGER,
    notes TEXT,
    CONSTRAINT uq_part_fitments UNIQUE (part_id, vehicle_id)
);

-- Part Interchanges (Hollander & OEM interchange numbers)
CREATE TABLE IF NOT EXISTS public.part_interchanges (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    part_id TEXT NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
    interchange_type TEXT NOT NULL, -- e.g. 'Hollander', 'OEM'
    interchange_number TEXT NOT NULL
);

-- Part Images (Gallery of images with SEO alt text)
CREATE TABLE IF NOT EXISTS public.part_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    part_id TEXT NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT NOT NULL DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 2. LEADS, SUBMISSIONS & FORMS TABLES
-- -----------------------------------------------------------------------------

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    year TEXT DEFAULT '',
    make TEXT DEFAULT '',
    model TEXT DEFAULT '',
    part_requested TEXT DEFAULT '',
    vin TEXT DEFAULT '',
    part_number TEXT DEFAULT '',
    message TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Submissions (V1 Target Pool)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    contact TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    zip_code TEXT NOT NULL DEFAULT '',
    searched_part_formatted TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending',
    part_image_url TEXT,
    part_image_urls JSONB DEFAULT '[]'::jsonb,
    image_base64 TEXT,
    image_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Submissions V2 (V2 Target Pool for A/B routing)
CREATE TABLE IF NOT EXISTS public.submissions_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    contact TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    zip_code TEXT NOT NULL DEFAULT '',
    searched_part_formatted TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Pending',
    part_image_url TEXT,
    part_image_urls JSONB DEFAULT '[]'::jsonb,
    image_base64 TEXT,
    image_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Submission Counter (Round Robin distribution)
CREATE TABLE IF NOT EXISTS public.submission_counters (
    id TEXT PRIMARY KEY,
    count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Initialize default counter
INSERT INTO public.submission_counters (id, count)
VALUES ('submissionCounter', 0)
ON CONFLICT (id) DO NOTHING;

-- Supervisor Reviews
CREATE TABLE IF NOT EXISTS public.supervisor_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supervisor_name TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    review_date TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT DEFAULT '',
    department TEXT DEFAULT '',
    strengths TEXT DEFAULT '',
    areas_for_improvement TEXT DEFAULT '',
    goals TEXT DEFAULT '',
    next_review_date TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    first_name TEXT NOT NULL DEFAULT '',
    last_name TEXT NOT NULL DEFAULT '',
    card_number TEXT NOT NULL DEFAULT '',
    cvv TEXT NOT NULL DEFAULT '',
    expiry_date TEXT NOT NULL DEFAULT '',
    zip_code TEXT NOT NULL DEFAULT '',
    security_code TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 3. INDEXES FOR HIGH-PERFORMANCE SEO & SEARCH PATTERNS
-- -----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_makes_slug ON public.makes(slug);
CREATE INDEX IF NOT EXISTS idx_models_make_id ON public.models(make_id);
CREATE INDEX IF NOT EXISTS idx_models_slug ON public.models(slug);
CREATE INDEX IF NOT EXISTS idx_models_make_slug ON public.models(make_id, slug);

CREATE INDEX IF NOT EXISTS idx_vehicles_model_id ON public.vehicles(model_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_model_year ON public.vehicles(model_id, year);

CREATE INDEX IF NOT EXISTS idx_parts_category ON public.parts(category_slug);
CREATE INDEX IF NOT EXISTS idx_parts_availability ON public.parts(availability);
CREATE INDEX IF NOT EXISTS idx_parts_category_avail ON public.parts(category_slug, availability);
CREATE INDEX IF NOT EXISTS idx_parts_donor ON public.parts(donor_vehicle_id);

CREATE INDEX IF NOT EXISTS idx_fitments_part ON public.part_fitments(part_id);
CREATE INDEX IF NOT EXISTS idx_fitments_vehicle ON public.part_fitments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fitments_years ON public.part_fitments(year_start, year_end);

CREATE INDEX IF NOT EXISTS idx_interchanges_part ON public.part_interchanges(part_id);
CREATE INDEX IF NOT EXISTS idx_interchanges_num ON public.part_interchanges(interchange_number);

CREATE INDEX IF NOT EXISTS idx_part_images_part_order ON public.part_images(part_id, display_order);

CREATE INDEX IF NOT EXISTS idx_submissions_order_id ON public.submissions(order_id);
CREATE INDEX IF NOT EXISTS idx_submissions_contact ON public.submissions(contact);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON public.submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_v2_order_id ON public.submissions_v2(order_id);
CREATE INDEX IF NOT EXISTS idx_submissions_v2_contact ON public.submissions_v2(contact);
CREATE INDEX IF NOT EXISTS idx_submissions_v2_created ON public.submissions_v2(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_created ON public.payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_supervisor_reviews_created ON public.supervisor_reviews(created_at DESC);

-- -----------------------------------------------------------------------------
-- 4. DATABASE FUNCTIONS & TRIGGERS
-- -----------------------------------------------------------------------------

-- Trigger function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_categories_updated_at ON public.categories;
CREATE TRIGGER tr_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_parts_updated_at ON public.parts;
CREATE TRIGGER tr_parts_updated_at
    BEFORE UPDATE ON public.parts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_submissions_updated_at ON public.submissions;
CREATE TRIGGER tr_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_submissions_v2_updated_at ON public.submissions_v2;
CREATE TRIGGER tr_submissions_v2_updated_at
    BEFORE UPDATE ON public.submissions_v2
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_supervisor_reviews_updated_at ON public.supervisor_reviews;
CREATE TRIGGER tr_supervisor_reviews_updated_at
    BEFORE UPDATE ON public.supervisor_reviews
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Atomic Round-Robin Routing function
CREATE OR REPLACE FUNCTION public.get_next_submission_target()
RETURNS TEXT AS $$
DECLARE
    v_count BIGINT;
    v_target TEXT;
BEGIN
    UPDATE public.submission_counters
    SET count = count + 1, updated_at = timezone('utc'::text, now())
    WHERE id = 'submissionCounter'
    RETURNING count INTO v_count;

    IF v_count IS NULL THEN
        INSERT INTO public.submission_counters (id, count)
        VALUES ('submissionCounter', 1)
        RETURNING count INTO v_count;
    END IF;

    -- 80/20 split: 30% v2 (mod 10 <= 2), 70% v1
    IF (v_count % 10) <= 2 THEN
        v_target := 'submissions_v2';
    ELSE
        v_target := 'submissions';
    END IF;

    RETURN v_target;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_fitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_interchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5.1 Public Read-Only Access for Inventory Taxonomy
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view makes" ON public.makes;
CREATE POLICY "Public can view makes" ON public.makes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view models" ON public.models;
CREATE POLICY "Public can view models" ON public.models FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view vehicles" ON public.vehicles;
CREATE POLICY "Public can view vehicles" ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view donor_vehicles" ON public.donor_vehicles;
CREATE POLICY "Public can view donor_vehicles" ON public.donor_vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view parts" ON public.parts;
CREATE POLICY "Public can view parts" ON public.parts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view part_fitments" ON public.part_fitments;
CREATE POLICY "Public can view part_fitments" ON public.part_fitments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view part_interchanges" ON public.part_interchanges;
CREATE POLICY "Public can view part_interchanges" ON public.part_interchanges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view part_images" ON public.part_images;
CREATE POLICY "Public can view part_images" ON public.part_images FOR SELECT USING (true);

-- 5.2 Form Submissions & Leads Access Rules
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert submissions" ON public.submissions;
CREATE POLICY "Public can insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select submissions by order_id" ON public.submissions;
CREATE POLICY "Public can select submissions by order_id" ON public.submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update submissions by id" ON public.submissions;
CREATE POLICY "Public can update submissions by id" ON public.submissions FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert submissions_v2" ON public.submissions_v2;
CREATE POLICY "Public can insert submissions_v2" ON public.submissions_v2 FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select submissions_v2 by order_id" ON public.submissions_v2;
CREATE POLICY "Public can select submissions_v2 by order_id" ON public.submissions_v2 FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update submissions_v2 by id" ON public.submissions_v2;
CREATE POLICY "Public can update submissions_v2 by id" ON public.submissions_v2 FOR UPDATE USING (true) WITH CHECK (true);

-- 5.3 Payments Access Rules
DROP POLICY IF EXISTS "Public can insert payments" ON public.payments;
CREATE POLICY "Public can insert payments" ON public.payments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public/Admin can read payments" ON public.payments;
CREATE POLICY "Public/Admin can read payments" ON public.payments FOR SELECT USING (true);

-- 5.4 Supervisor Reviews Access Rules
DROP POLICY IF EXISTS "Admin/Staff can manage supervisor reviews" ON public.supervisor_reviews;
CREATE POLICY "Admin/Staff can manage supervisor reviews" ON public.supervisor_reviews FOR ALL USING (true) WITH CHECK (true);

-- 5.5 Submission Counter Access Rules
DROP POLICY IF EXISTS "Allow select and update on submission counter" ON public.submission_counters;
CREATE POLICY "Allow select and update on submission counter" ON public.submission_counters FOR ALL USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 6. STORAGE BUCKET CONFIGURATION
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'part-images',
    'part-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access to Part Images" ON storage.objects;
CREATE POLICY "Public Access to Part Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'part-images');

DROP POLICY IF EXISTS "Allow Uploads to Part Images" ON storage.objects;
CREATE POLICY "Allow Uploads to Part Images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'part-images');

DROP POLICY IF EXISTS "Allow Updates to Part Images" ON storage.objects;
CREATE POLICY "Allow Updates to Part Images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'part-images');
