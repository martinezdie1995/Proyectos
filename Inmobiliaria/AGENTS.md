# Instrucciones permanentes del proyecto

## Propósito y forma de trabajo

Construir una plataforma inmobiliaria profesional, confiable y mantenible, enfocada principalmente en alquileres vacacionales en zonas costeras y de playa. Permitir explorar y consultar propiedades, contactar a la inmobiliaria y administrar publicaciones y consultas desde un área privada. Diseñar para una operación pequeña con una base que pueda crecer.

Antes de una modificación importante, leer este archivo y `MEMORY.md`, inspeccionar el código y los archivos relacionados, y respetar las decisiones ya documentadas. Trabajar por etapas aprobadas; no avanzar a otra etapa ni tomar decisiones arquitectónicas importantes sin aprobación. Al cerrar una etapa, verificar lo implementado y actualizar `MEMORY.md` con el estado, decisiones, problemas y siguientes pasos.

No presentar datos de ejemplo como reales. Identificar claramente cualquier dato de prueba; en pantallas de presentación al cliente, usar una formulación profesional como “contenido de referencia” en lugar de llamarlo “ficticio”. No afirmar disponibilidad, ubicación ni características reales sin confirmación. Identificar las fotografías ilustrativas. No dejar controles sin comportamiento ni formularios decorativos. Si falta información que cambie materialmente la arquitectura o el comportamiento, consultar antes de decidir.

## Tecnologías y arquitectura

- Next.js con App Router, React, JavaScript y Tailwind CSS.
- Supabase para PostgreSQL, autenticación y almacenamiento de imágenes.
- Vercel como plataforma prevista de despliegue.
- Preferir Server Components y acceso seguro a Supabase desde Next.js. Usar componentes cliente solo para interacciones que lo necesiten.
- No crear un backend independiente con Express/Node ni una API propia cuando Supabase y Next.js resuelvan la necesidad.
- Usar Server Actions, Route Handlers o funciones de Supabase solo cuando sean apropiados; toda operación privilegiada debe permanecer del lado del servidor.
- No exponer claves privadas, credenciales ni `service_role` en el cliente. Usar variables de entorno y mantener secretos fuera del repositorio.
- Mantener cambios pequeños y coherentes con la etapa aprobada; no agregar dependencias sin necesidad.

## Convenciones de programación y calidad

- JavaScript claro y consistente con los patrones existentes; nombres descriptivos y responsabilidades acotadas.
- Reutilizar componentes, utilidades y estilos existentes antes de crear duplicados. Extraer abstracciones solo cuando reduzcan duplicación real.
- Separar presentación, acceso a datos y lógica de interacción de acuerdo con las convenciones de Next.js.
- Manejar errores de forma explícita; no ocultarlos con valores por defecto engañosos ni dejar fallos silenciosos.
- Evitar estados y efectos redundantes; usar la estrategia de renderizado y obtención de datos adecuada de React/Next.js.
- Mantener formatos, lint, pruebas y estructura existentes. Validar los cambios con las comprobaciones pertinentes a la etapa.
- No modificar archivos ajenos al alcance ni sobrescribir cambios previos del usuario.

## Estructura de carpetas

Respetar la estructura existente y ampliarla gradualmente, sin crear carpetas por anticipado si no son necesarias. La propuesta inicial está registrada en `MEMORY.md`; cualquier cambio de arquitectura debe documentarse allí antes de implementarlo.

## Diseño, UI/UX y responsive

- Crear una identidad propia, moderna, elegante y profesional; tomar referencias del sector solo como inspiración, sin copiar interfaces.
- Priorizar los alquileres de temporada cerca del mar en la jerarquía, los textos y las imágenes. Usar una atmósfera luminosa de verano inspirada en el paisaje costero, con tonos marinos, arena y un acento cálido, sin caer en clichés visuales de turismo.
- Preferir fotografías de casas y departamentos en contextos costeros. Las imágenes ilustrativas deben identificarse como tales; no presentarlas como publicaciones reales ni como ubicaciones confirmadas. No asumir una localidad costera concreta hasta que el usuario la indique.
- Al definir o implementar UI, consultar `.agents/skills/frontend-design/SKILL.md` cuando sus pautas sean pertinentes; el brief del proyecto tiene prioridad. Consultar `.agents/skills/find-skills/SKILL.md` si se solicita descubrir skills adicionales.
- Priorizar jerarquía visual, fotografía de calidad, tipografía legible, espaciado equilibrado, navegación intuitiva y contenido claro.
- Mantener consistencia entre páginas públicas y panel administrativo. Usar componentes compartidos para patrones repetidos.
- Evitar adornos y animaciones que distraigan; las transiciones y microinteracciones deben ser sutiles y respetar preferencias de movimiento reducido.
- Diseñar desde móvil y comprobar los principales anchos de pantalla; evitar desbordamientos y asegurar que formularios, filtros, navegación, galerías y panel sean utilizables táctilmente.
- No sacrificar claridad, rendimiento ni accesibilidad por efectos visuales.

## React y Next.js

- Aprovechar App Router, layouts y rutas por segmento; definir límites claros entre áreas públicas y privadas.
- Mantener la interfaz de servidor como opción predeterminada. Delimitar `"use client"` al componente interactivo más pequeño posible.
- Proteger rutas y acciones administrativas validando sesión y autorización en el servidor; ocultar enlaces en la UI no es una medida de seguridad.
- Usar metadatos de Next.js y optimización de imágenes cuando corresponda. Evitar consultas o trabajo costoso innecesarios en el cliente.

## Supabase, datos y seguridad

- Diseñar relaciones, restricciones, índices y migraciones SQL explícitas. No almacenar binarios de imágenes en tablas: guardar en la base las rutas de Supabase Storage y sus metadatos necesarios.
- Habilitar y configurar RLS para todas las tablas expuestas. La lectura pública se limita a propiedades publicadas; escritura y administración, a usuarios autorizados. No desactivar RLS para resolver errores.
- Las consultas públicas pueden registrarse, pero los visitantes no pueden leer consultas ajenas ni datos privados.
- Validar y normalizar entradas en el límite de confianza; no confiar en validaciones del navegador.
- Configurar políticas de Storage por separado para lectura y escritura, de acuerdo con la visibilidad de las imágenes y los permisos administrativos.
- Evitar registrar información personal o secretos en logs. Recoger solo los datos necesarios y limitar su exposición.
- No ejecutar operaciones privilegiadas con credenciales públicas ni enviar secretos al navegador.

## SEO, rendimiento y accesibilidad

- Usar títulos y descripciones relevantes, metadatos Open Graph, URLs legibles, sitemap, robots y datos estructurados cuando correspondan.
- Optimizar imágenes, carga diferida y contenido inicial; cuidar Core Web Vitals y evitar JavaScript cliente innecesario.
- Usar HTML semántico, etiquetas asociadas a campos, navegación por teclado, foco visible, contraste suficiente y textos alternativos útiles.
- Comunicar errores y estados de carga de forma comprensible; no depender solo del color ni de iconos sin nombre accesible.

## Mantenimiento y crecimiento

- Mantener una fuente única para cada regla o dato compartido; no copiar lógica de consulta, validación o presentación entre páginas.
- Preferir soluciones simples, tipadas conceptualmente y fáciles de probar frente a abstracciones prematuras.
- Actualizar `MEMORY.md` solo con hechos confirmados, decisiones aceptadas y estado vigente; distinguir propuestas de decisiones aprobadas.
