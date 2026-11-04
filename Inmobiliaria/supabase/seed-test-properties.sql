-- Datos de prueba para validar el panel de administración.
-- Requiere aplicar primero las migraciones. Se guardan como borrador y con
-- is_demo=true, por lo que nunca se muestran en el catálogo público.

begin;

insert into public.locations (name, region, country, slug)
values (
  'Zona costera de prueba',
  'Región de prueba',
  'Argentina',
  'zona-costera-de-prueba-region-de-prueba-argentina'
)
on conflict (slug) do update
set name = excluded.name,
    region = excluded.region,
    country = excluded.country;

insert into public.properties (
  slug,
  title,
  description,
  operation,
  status,
  property_type_id,
  location_id,
  price,
  currency,
  price_period,
  bedrooms,
  bathrooms,
  guests,
  area_m2,
  amenities,
  is_featured,
  is_demo
)
values
(
  'prueba-departamento-brisa',
  'Departamento Brisa',
  'Departamento luminoso para descansar después de un día de playa y disfrutar de una estadía cómoda junto al mar.',
  'seasonal_rent',
  'draft',
  (select id from public.property_types where slug = 'departamento'),
  (select id from public.locations where slug = 'zona-costera-de-prueba-region-de-prueba-argentina'),
  95000,
  'ARS',
  'night',
  2,
  1,
  4,
  68,
  array['Terraza'],
  false,
  true
),
(
  'prueba-casa-orilla',
  'Casa Orilla',
  'Casa amplia para compartir las vacaciones en familia, con espacios cómodos para reunirse y descansar.',
  'seasonal_rent',
  'draft',
  (select id from public.property_types where slug = 'casa'),
  (select id from public.locations where slug = 'zona-costera-de-prueba-region-de-prueba-argentina'),
  145000,
  'ARS',
  'night',
  3,
  2,
  6,
  112,
  array['Patio privado'],
  false,
  true
),
(
  'prueba-loft-marea',
  'Loft Marea',
  'Loft luminoso y funcional para disfrutar una escapada en pareja cerca del mar.',
  'seasonal_rent',
  'draft',
  (select id from public.property_types where slug = 'loft'),
  (select id from public.locations where slug = 'zona-costera-de-prueba-region-de-prueba-argentina'),
  78000,
  'ARS',
  'night',
  1,
  1,
  2,
  42,
  array['Balcón'],
  false,
  true
)
on conflict (slug) do update
set title = excluded.title,
    description = excluded.description,
    operation = excluded.operation,
    status = excluded.status,
    property_type_id = excluded.property_type_id,
    location_id = excluded.location_id,
    price = excluded.price,
    currency = excluded.currency,
    price_period = excluded.price_period,
    bedrooms = excluded.bedrooms,
    bathrooms = excluded.bathrooms,
    guests = excluded.guests,
    area_m2 = excluded.area_m2,
    amenities = excluded.amenities,
    is_featured = excluded.is_featured,
    is_demo = excluded.is_demo,
    published_at = null;

commit;
