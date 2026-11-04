# Memoria técnica del proyecto

> Registro breve del estado y las decisiones. Para las reglas permanentes, consultar `AGENTS.md`.

## Estado actual

- Proyecto inicializado con Next.js App Router, React, JavaScript y Tailwind CSS.
- Etapas 1 (configuración y sistema de diseño) y 2 (navbar, homepage y componentes generales): completadas.
- Etapa 3: catálogo en `/alquileres` y tarjetas en portada; ahora consulta alquileres publicados de Supabase y conserva los tres avisos locales como referencia hasta que haya publicaciones reales.
- Etapa 4: filtros interactivos locales implementados para los avisos de muestra.
- Etapa 5: fichas individuales estáticas por slug para los tres avisos locales.
- Etapa 7 implementada en código: login email/contraseña, validación del perfil administrador antes de conservar la sesión, protección de servidor y dashboard con métricas Supabase; el total del panel incluye contenido de referencia y lo desglosa para distinguirlo de propiedades reales. Falta validar el acceso de extremo a extremo.
- Supabase ya responde con el esquema inicial: están disponibles `properties`, `property_types` e `inquiries`, y existen los tipos Casa, Departamento, Cabaña y Loft. No se muestran filas de prueba a la clave pública por el filtro RLS `is_demo=false`.
- La ruta `/` tiene navegación adaptable, hero fotográfico, secciones de propiedades, presentación y contacto.
- La migración inicial de Supabase está aplicada; el esquema API y los tipos predefinidos responden.
- El usuario autorizó comenzar la implementación; continuar en etapas y no asumir datos de la inmobiliaria.

## Objetivo del producto

Plataforma inmobiliaria profesional y responsive enfocada principalmente en alquileres vacacionales en zonas costeras y de playa. También podrá mostrar propiedades en venta, permitir búsquedas y consultas, contactar a la inmobiliaria y administrar publicaciones desde un panel privado.

## Tecnologías solicitadas

Next.js App Router, React, JavaScript y Tailwind CSS (Next 16.4.5, React 19.3.0, Tailwind 4 y ESLint 10.14.0). Supabase está conectado para desarrollo local; Vercel todavía no está configurado. No se requiere un servidor Express/Node independiente.

## Skills del proyecto

- `find-skills` instalado en `.agents/skills/find-skills`; usar para descubrir skills cuando sea pertinente o se solicite.
- `frontend-design` instalado en `.agents/skills/frontend-design`; consultar al trabajar en diseño o UI si sus pautas aplican, respetando siempre el brief del proyecto.

## Dirección visual investigada

- Referencia preferida por el usuario: https://remax-diagonal2.com.ar/.
- Preferencia nueva del usuario: foco en alquileres de temporada costeros, con estilo veraniego y fotografía de propiedades o departamentos de playa.
- Observaciones de la referencia: encabezado oscuro, navegación clara, Montserrat y acentos de color; la búsqueda de propiedades es central en la experiencia.
- Adaptación visual actualizada: marino `#102a3a`, océano `#176e86`, arena `#f4f1e8`, coral `#a84e35` y neutros de alto contraste. Mantener el estilo profesional, sin copiar marca ni contenidos, y marcar cualquier fotografía de muestra como ilustrativa.
- Zillow y Rightmove también se consultaron como referencias generales; Idealista bloqueó la consulta automatizada. La referencia de RE/MAX indicada por el usuario prevalece.
- La localidad o zona costera exacta sigue pendiente; no se debe inferir de la página de referencia.

## Arquitectura y estructura base

La arquitectura registrada abajo es la base de trabajo; detalles no confirmados (por ejemplo, mapas, identidad comercial y datos de contacto) siguen pendientes.

### Arquitectura propuesta

- Aplicación única Next.js con áreas pública y administrativa en App Router.
- Server Components por defecto; componentes cliente solo para filtros, galerías, formularios u otras interacciones que lo requieran.
- Supabase como BaaS. Acceso público de solo lectura a publicaciones activas; autorización administrativa validada en servidor y protegida mediante RLS.
- Supabase Storage para fotografías; PostgreSQL conserva rutas y metadatos, no archivos binarios.
- Formularios de consultas con inserción controlada y sin lectura pública de datos personales.
- Operaciones privilegiadas solo en servidor. No exponer `service_role` ni otros secretos al navegador.
- Despliegue previsto en Vercel. Proveedor de mapas, canales de contacto y detalles de autenticación todavía por decidir.

### Estructura de carpetas sugerida

```text
app/
  (public)/                 # Inicio, catálogo, propiedad y contacto
  admin/                    # Login y panel protegido
  layout.js
components/
  ui/                       # Primitivas visuales reutilizables
  layout/                   # Navegación, footer y composición
  properties/               # Tarjetas, filtros y galería
lib/
  supabase/                 # Clientes y utilidades de acceso
  validations/              # Validaciones compartidas si se necesitan
public/
supabase/
  migrations/               # Esquema, índices y políticas versionados
```

La estructura es una guía, no una exigencia de crear todos estos directorios antes de necesitarlos.

Archivos de base creados:

- `app/layout.js`: layout raíz, idioma `es-AR`, metadata inicial y Montserrat mediante `next/font`.
- `app/globals.css`: tokens de color, Tailwind CSS, foco visible y preferencia de movimiento reducido.
- `app/page.js`: homepage con hero, resumen de propiedades, presentación de la inmobiliaria y contacto.
- `app/alquileres/page.js`: catálogo de alquileres de temporada con metadata y avisos de muestra.
- `app/alquileres/[slug]/page.js`: fichas con metadata generada, parámetros estáticos y manejo de avisos inexistentes.
- `components/site-header.js`: encabezado responsive con menú móvil accesible.
- `components/site-footer.js`: pie compartido en las páginas públicas.
- `components/rental-card.js`: tarjeta reutilizable para propiedades publicadas o contenido de referencia.
- Las tarjetas enlazan a fichas de referencia; no hay acción de reserva ni contacto de propiedad.
- `components/rental-browser.js`: filtros de texto/zona, tipo, huéspedes, dormitorios, baños, superficie y rango de precios; permite ordenar por recomendación, precio, fechas de muestra y superficie.
- `data/sample-rentals.js`: tres anuncios de demostración en memoria con atributos ficticios; no hace llamadas ni escribe en Supabase.
- `public/images/sample-*.jpg`: fotos ilustrativas locales para las tarjetas; no corresponden a propiedades publicadas.
- `public/images/portada.jpg`: imagen actual elegida por el usuario para el hero; el contraste se refuerza con un degradado oscuro.
- `public/images/home-hero.jpg`: recurso visual anterior, ya no se usa en la portada.
- `lib/supabase/config.js`, `lib/supabase/server.js`: lectura de URL/clave publicable y cliente servidor de acceso público.
- `lib/properties/public-rentals.js`: consultas públicas de alquileres publicados, detalle y slugs; excluyen explícitamente `is_demo` y crean URLs firmadas para imágenes autorizadas.
- `lib/supabase/authenticated-server.js`, `proxy.js`: cliente Supabase SSR con cookies y actualización de sesión para rutas de administración.
- `app/admin/login/page.js`, `components/admin-login-form.js`, `app/admin/actions.js`: login email/contraseña y cierre de sesión mediante Server Actions.
- `app/admin/(panel)/layout.js`, `app/admin/(panel)/page.js`: autorización del rol en servidor y métricas consultadas desde Supabase, sin datos de prueba.
- `app/admin/(panel)/propiedades/`: listado, alta, edición y eliminación de propiedades, gestión de ubicación, publicación y destacados.
- `app/admin/(panel)/propiedades/actions.js`: Server Actions con autorización admin, validación de campos, operaciones de propiedades y carga/gestión de imágenes en Storage.
- `components/admin-property-form.js`, `components/admin-image-upload-form.js`, `components/property-image-controls.js`, `components/delete-property-button.js`: formularios de administración y controles con confirmación de borrado.
- `app/admin/(panel)/error.js`: estado de error y opción de reintento para el panel.
- `app/admin/(panel)/consultas/`: bandeja de consultas con filtros de estado, datos de contacto, propiedad asociada, cambio de estado y eliminación exclusiva para admins.
- `app/contacto/actions.js`, `components/inquiry-form.js`: envío público validado y guardado en Supabase cuando hay configuración, con respuesta de éxito/error y honeypot simple.
- `supabase/seed-test-properties.sql`: carga idempotente de las tres propiedades de referencia como borradores `is_demo=true`; requiere aplicar migración primero.
- `.env.example`: nombres de variables requeridas para conexión; no contiene credenciales.
- `supabase/migrations/20261104000000_initial_schema.sql`: esquema, índices, validaciones, RLS, permisos y bucket privado para imágenes. Pendiente aplicar y validar en Supabase.
- `package.json`, `package-lock.json`, `eslint.config.mjs`, `jsconfig.json`, `next.config.mjs` y `.gitignore`.

### Modelo de datos inicial preparado

Migración inicial aplicada: `profiles`, `property_types`, `locations`, `properties`, `property_images` e `inquiries`; enum de operación, estado, periodo de precio y estado de consulta; relaciones, restricciones e índices. RLS limita la lectura pública a propiedades publicadas que no sean de prueba, permite el alta de consultas pendientes sin su lectura, restringe su gestión a administradores y limita Storage a imágenes publicadas y operaciones administrativas. El bucket `property-images` es privado y acepta imágenes hasta 10 MB.

Las propiedades incluyen `is_demo` para separar registros de prueba; las políticas de lectura pública los excluyen incluso si cambia su estado. El total del dashboard incluye todos los registros y muestra por separado el contenido de referencia; las métricas de publicaciones y operaciones reales excluyen los registros de prueba. La seed crea tres propiedades sin fotografías y en estado borrador; las imágenes se suben desde el panel.

El primer administrador debe crearse manualmente en Auth y registrarse en `profiles` mediante SQL Editor. No existe acceso admin de cliente ni conexión con proyecto todavía. `.env.example` requiere `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; no pedir ni usar claves `service_role` en el navegador.

### Etapas de trabajo

1. Configuración del proyecto y sistema de diseño.
2. Navbar, homepage y componentes generales.
3. Catálogo de propiedades.
4. Buscador y filtros.
5. Detalle individual de propiedades.
6. Integración con Supabase.
7. Panel de administración.
8. Gestión de propiedades y fotografías.
9. Gestión de consultas.
10. SEO, optimización, seguridad y despliegue: SEO técnico inicial implementado; optimización restante y despliegue pendientes.

Estado: etapas 1–5 completadas; la conexión pública al catálogo y fichas de propiedades reales se implementó en código. `.env.local` configurado y migración inicial aplicada: el esquema API responde y lista los tipos predefinidos. La clave pública no puede confirmar las filas demo porque RLS las oculta; queda confirmar desde SQL Editor si se ejecutó la seed. Etapas 7–9 están implementadas en código, pendientes de validar con sesión admin.

## Funcionalidades implementadas

- Sistema de diseño inicial y configuración base del proyecto.
- Encabezado y navegación responsive con enlaces a secciones existentes; menú móvil con estado accesible.
- Homepage con fotografía marcada como ilustrativa y textos de presentación.
- Enfoque visual y copy de portada actualizados para alquileres de temporada en zonas de playa.
- Tres avisos locales de referencia para alquileres vacacionales visibles en homepage y catálogo; se quitaron las etiquetas explícitas de “ficticio” a pedido del usuario y se mantiene la identificación de fotografías de referencia.
- Datos y precios de muestra permanecen en un arreglo local de JavaScript, sin base de datos ni persistencia.
- Fotos de Unsplash incluidas como material ilustrativo y etiquetadas como tales.
- Filtros de catálogo con búsqueda por texto/zona, tipo, huéspedes, dormitorios, baños, superficie mínima, precio mínimo/máximo y ordenamiento.
- Mensaje de resultados y estado vacío cuando una combinación no coincide; limpiar filtros restaura los tres ejemplos.
- Ordenamiento de catálogo por precio, fecha y superficie.
- Fichas de propiedades con descripción, características, precio y navegación de regreso; fotografías identificadas como de referencia.
- Rutas desconocidas de ficha devuelven 404; las tres rutas de muestra se prerenderizan.
- Ruta propia para alquileres; encabezado, CTA principal y CTA móvil navegan a `/alquileres`.
- Pie de página compartido entre inicio y catálogo.
- Sección de contacto muestra un formulario funcional solo cuando Supabase está configurado; si falta conexión, informa que estará disponible próximamente.
- Panel de administración: login por email/contraseña, verificación del perfil administrador, logout y métricas de propiedades/consultas.
- `/admin/propiedades`: listado privado con foto principal, estado, operación, tipo, ubicación y precio; permite crear, editar y eliminar. Incluye búsqueda por título/localidad/tipo y filtros por estado y operación mediante parámetros GET.
- Formularios de alta/edición validan información, guardan localidad/región, estado de publicación y características en Supabase.
- Galería privada: carga de hasta 12 fotos JPG/PNG/WebP/AVIF por operación (máximo 10 MB c/u), texto alternativo, selección de portada y eliminación; se usan URLs firmadas para ver imágenes privadas.
- El proxy lleva a login con aviso de configuración cuando falta Supabase. Las métricas del panel se consultan en Supabase; el total incluye y desglosa el contenido de referencia, mientras que las métricas de publicaciones y operaciones excluyen registros de prueba.
- La migración inicial precarga tipos Casa, Departamento, Cabaña y Loft.
- Gestión de consultas: bandeja admin con filtros por pendientes/respondidas, información de contacto, mensaje, propiedad relacionada, acciones de estado y borrado con confirmación.
- El formulario público se renderiza solo con Supabase configurado; la acción valida y guarda consultas pendientes mediante RLS, con respuesta de éxito/error y honeypot simple.
- Seed SQL de tres propiedades de prueba, protegidas por `is_demo`, borradores no visibles en el catálogo; se muestran como contenido de referencia en el total del panel y se excluyen de las métricas de publicaciones y operaciones reales.
- SEO técnico inicial: metadata base, títulos/descripciones, Open Graph/Twitter, canonicals, `robots.txt` y sitemap. Las fichas locales de referencia son `noindex` y no se incluyen en el sitemap.
- `lib/site-url.js` resuelve la URL pública mediante `NEXT_PUBLIC_SITE_URL`, variables de Vercel o `http://localhost:3000` como fallback local. Configurar el dominio real antes del despliegue.
- Catálogo público consulta propiedades publicadas de alquiler en Supabase con filtros de estado, operación y `is_demo=false`; muestra sus fichas e imágenes de Storage mediante URLs firmadas de corta duración. Sitemap incorpora los slugs publicados.
- Hasta que haya publicaciones reales disponibles (o si Supabase no está configurado), portada, catálogo y fichas mantienen los avisos locales como contenido de referencia, identificados claramente; las fichas de referencia siguen `noindex`.

## Funcionalidades pendientes

- Etapa 6: esquema conectado y lectura pública de alquileres implementada; falta validar la visualización con una propiedad real publicada y su galería de Storage.
- Etapas 7–8: autenticación, dashboard y gestión de propiedades/fotografías implementados en código; falta validar operaciones con un proyecto conectado.
- Etapa 9: bandeja y formulario de consultas implementados en código; falta probar escritura/lectura bajo RLS.
- Etapa 10: SEO técnico inicial implementado y validado; faltan conectar contenido público real para SEO, revisar optimización/seguridad restante y desplegar.

## Decisiones confirmadas

- Tecnologías objetivo: Next.js App Router, React, JavaScript, Tailwind CSS, Supabase y Vercel.
- Evitar un backend tradicional independiente y no exponer credenciales privadas.
- RLS debe proteger datos y operaciones; las propiedades publicadas podrán leerse públicamente. La primera política/migración propuesta no habilita lecturas públicas de consultas.
- El trabajo se realizará por etapas y `MEMORY.md` se actualizará al cerrar cada etapa importante.
- El sitio de RE/MAX Diagonal II es referencia visual, no una fuente para copiar marca o contenido.
- Priorizar alquileres vacacionales en zonas costeras y estilo visual veraniego; conservar venta como oferta secundaria posible.
- No afirmar ubicación concreta hasta recibirla. La portada usa `public/images/portada.jpg`, imagen agregada por el usuario.
- Los avisos actuales son contenido de referencia local y no se guardan en la base. Para la presentación al cliente, el usuario pidió retirar la palabra “ficticio” de la interfaz; no afirmar disponibilidad o datos reales sin confirmación.
- El usuario eligió mantener los avisos locales como contenido de referencia hasta que existan alquileres reales publicados; mostrar una nota explícita mientras se use ese fallback.

## Integraciones, componentes y problemas

- Integración Supabase: variables locales y esquema inicial configurados; `property_types` e `inquiries` responden. Las filas de prueba se consultan desde SQL Editor porque RLS oculta `is_demo=true` a usuarios públicos. Código SSR y operaciones administrativas listo; login exige perfil admin y descarta sesiones de cuentas no autorizadas.
- Supabase local configurado con URL y clave publicable guardadas en `.env.local`; `.env.example` no incluye secretos. El esquema responde desde el proyecto conectado.
- Verificación de Supabase: el API devuelve tablas y tipos esperados; las filas demo no se pueden consultar con la clave pública por RLS.
- Verificación de administración sin credenciales: `/admin` y subrutas llevan al login de configuración sin error; `/admin/login`, homepage e imagen `portada.jpg` responden correctamente. `npm run lint` y `npm run build` pasan.
- La política Storage para lectura admin fue agregada para permitir URL firmadas de imágenes de borrador dentro del panel; la migración requiere aplicación en el proyecto real antes de validar esa operación.
- En la continuación se encontró URL y publishable key en `.env.example`; se copiaron a `.env.local` (ignorado por Git) y se restauró `.env.example` a placeholders. No se imprimieron los valores.
- Tras la confirmación del usuario de que aplicó los SQL, Supabase expone las tablas esperadas y los tipos precargados. La lectura anónima retorna cero propiedades demo, como corresponde a RLS; no es posible verificar desde la clave pública si ejecutó la seed.
- Componentes creados: homepage en `app/page.js`, catálogo en `app/alquileres/page.js`, fichas en `app/alquileres/[slug]/page.js`, tarjeta reutilizable en `components/rental-card.js`, filtros en `components/rental-browser.js`, navegación en `components/site-header.js`, pie compartido en `components/site-footer.js` y formulario de acceso en `components/admin-login-form.js`.
- Esquema Supabase: migración inicial aplicada en `supabase/migrations/20261104000000_initial_schema.sql`.
- Datos de referencia: tres objetos exportados por `data/sample-rentals.js`; sin acceso de red ni escrituras. Los filtros se aplican solo en el navegador.
- Validación de dependencias de producción: `npm audit --omit=dev` reportó cero vulnerabilidades.
- La auditoría completa reportó 15 avisos moderados en dependencias de desarrollo; ESLint se actualizó a 10.14.0 y el lint/build pasan.
- Next.js no permite evaluar el año actual durante el prerenderizado con Cache Components; se quitó el año dinámico del pie de página.
- SEO inicial: `app/layout.js` define metadataBase, títulos, descripciones, Open Graph y Twitter; portada y catálogo declaran canonical; fichas locales se marcan `noindex,nofollow`; `app/robots.js` excluye `/admin`; `app/sitemap.js` publica inicio, catálogo y slugs reales publicados.
- Validación SEO: `npm run lint`, `npm run build` y smoke test de `/robots.txt`, `/sitemap.xml`, canonical/Open Graph de portada y `noindex` de fichas de referencia pasan. El servidor de prueba se inició en `http://localhost:3011` porque el puerto 3000 ya estaba ocupado.
- Catálogo dinámico: `app/page.js`, `app/alquileres/page.js` y `app/alquileres/[slug]/page.js` leen las publicaciones desde `lib/properties/public-rentals.js`; RLS permanece activa y las consultas excluyen demos. `next.config.mjs` solo permite optimizar imágenes del bucket Supabase configurado.
- Los avisos locales se conservan como fallback solicitado y llevan nota “Contenido de referencia”; errores de consulta Supabase no se convierten silenciosamente en fallback. URLs firmadas de Storage duran 7 días.
- Validación de catálogo: `npm run lint`, `npm run build`, `git diff --check` y smoke test de portada, catálogo, ficha de referencia, sitemap y login admin pasan. Todavía no hay una propiedad real publicada que permita verificar end-to-end consulta, fotografías o filtros con datos reales.

## Próximos pasos recomendados

1. Probar el login del usuario administrador creado y validar altas, edición, publicación, fotos y consultas bajo RLS.
2. Crear una propiedad real y publicarla; verificar catálogo, detalle y galería pública sin publicar datos de prueba.
3. Confirmar desde SQL Editor que las tres filas `is_demo=true` existen, ya que RLS las oculta a la clave pública.
4. Definir dominio en `NEXT_PUBLIC_SITE_URL`, completar revisiones SEO/optimización y validar el despliegue.
