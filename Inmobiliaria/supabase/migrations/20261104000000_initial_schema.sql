-- Esquema inicial de propiedades, ubicaciones, consultas y almacenamiento.
-- Para habilitar el primer administrador: crear el usuario en Supabase Auth y
-- luego insertar su UUID en public.profiles desde el SQL Editor con role='admin'.

create type public.property_operation as enum ('sale', 'rent', 'seasonal_rent');
create type public.property_status as enum (
  'draft',
  'published',
  'reserved',
  'sold',
  'rented',
  'unavailable'
);
create type public.rental_price_period as enum ('night', 'week', 'month', 'total');
create type public.inquiry_status as enum ('pending', 'responded');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  region text check (region is null or char_length(region) <= 120),
  country text not null default 'Argentina' check (char_length(country) <= 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

insert into public.property_types (name, slug)
values
  ('Casa', 'casa'),
  ('Departamento', 'departamento'),
  ('Cabaña', 'cabana'),
  ('Loft', 'loft')
on conflict (slug) do nothing;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 5 and 180),
  description text not null default '' check (char_length(description) <= 10000),
  operation public.property_operation not null default 'seasonal_rent',
  status public.property_status not null default 'draft',
  property_type_id uuid not null references public.property_types (id) on delete restrict,
  location_id uuid not null references public.locations (id) on delete restrict,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'ARS' check (currency ~ '^[A-Z]{3}$'),
  price_period public.rental_price_period not null default 'night',
  bedrooms smallint not null default 0 check (bedrooms between 0 and 100),
  bathrooms smallint not null default 0 check (bathrooms between 0 and 100),
  guests smallint check (guests is null or guests between 1 and 200),
  area_m2 numeric(10, 2) check (area_m2 is null or area_m2 > 0),
  amenities text[] not null default '{}',
  is_featured boolean not null default false,
  is_demo boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or published_at is not null)
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  storage_path text not null unique check (char_length(storage_path) <= 500),
  alt_text text not null default '' check (char_length(alt_text) <= 300),
  sort_order smallint not null default 0 check (sort_order >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index property_images_one_cover_per_property
  on public.property_images (property_id)
  where is_cover;

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references public.properties (id) on delete set null,
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  phone text check (phone is null or char_length(phone) <= 40),
  message text not null check (char_length(message) between 10 and 5000),
  status public.inquiry_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_public_listing
  on public.properties (operation, published_at desc)
  where status = 'published';
create index properties_type_location
  on public.properties (property_type_id, location_id);
create index property_images_gallery
  on public.property_images (property_id, sort_order);
create index inquiries_recent
  on public.inquiries (created_at desc);
create index inquiries_property
  on public.inquiries (property_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.property_types enable row level security;
alter table public.locations enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.inquiries enable row level security;

grant select on public.property_types, public.locations to anon, authenticated;
grant select on public.properties, public.property_images to anon, authenticated;
grant select, insert, update, delete on
  public.profiles,
  public.property_types,
  public.locations,
  public.properties,
  public.property_images,
  public.inquiries
to authenticated;
revoke insert on public.inquiries from anon, authenticated;
grant insert (property_id, name, email, phone, message)
  on public.inquiries to anon, authenticated;

create policy "Public can read property types"
  on public.property_types for select
  to anon, authenticated
  using (true);
create policy "Admins can manage property types"
  on public.property_types for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Public can read locations"
  on public.locations for select
  to anon, authenticated
  using (true);
create policy "Admins can manage locations"
  on public.locations for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Public can read published properties"
  on public.properties for select
  to anon, authenticated
  using (status = 'published' and not is_demo);
create policy "Admins can manage properties"
  on public.properties for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Public can read images of published properties"
  on public.property_images for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.properties
      where properties.id = property_images.property_id
        and properties.status = 'published'
        and not properties.is_demo
    )
  );
create policy "Admins can manage property images"
  on public.property_images for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Visitors can submit pending inquiries"
  on public.inquiries for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and (
      property_id is null
      or exists (
        select 1
        from public.properties
        where properties.id = inquiries.property_id
          and properties.status = 'published'
      )
    )
  );
create policy "Admins can read inquiries"
  on public.inquiries for select
  to authenticated
  using ((select public.is_admin()));
create policy "Admins can update inquiries"
  on public.inquiries for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete inquiries"
  on public.inquiries for delete
  to authenticated
  using ((select public.is_admin()));

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "Admins can manage profiles"
  on public.profiles for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "Public can read images for published properties"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'property-images'
    and exists (
      select 1
      from public.property_images
      join public.properties on properties.id = property_images.property_id
      where property_images.storage_path = storage.objects.name
        and properties.status = 'published'
        and not properties.is_demo
    )
  );
create policy "Admins can read property images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'property-images'
    and (select public.is_admin())
  );
create policy "Admins can upload property images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and (select public.is_admin())
  );
create policy "Admins can update property images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and (select public.is_admin())
  )
  with check (
    bucket_id = 'property-images'
    and (select public.is_admin())
  );
create policy "Admins can delete property images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and (select public.is_admin())
  );
