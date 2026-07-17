# Kolleg AI — MVP

Chat de IA en español que responde preguntas sobre el Studienkolleg en
Alemania, basado en información oficial verificada, y guarda las
conversaciones (clasificadas por tema) como base de datos privada para
ideas de contenido.

## Stack

- **Frontend + backend**: Next.js 14 (App Router), desplegado gratis en Vercel
- **Base de datos**: Supabase (Postgres) — base de conocimiento + conversaciones
- **IA**: Claude Haiku 4.5 (Anthropic API), con prompt caching para bajar costos
- **Alertas de cambios en páginas oficiales**: Telegram Bot (próxima fase)

## 1. Configurar Supabase

1. En tu proyecto de Supabase, andá a **SQL Editor → New query**.
2. Pegá y ejecutá todo el contenido de `supabase/schema.sql`. Esto crea las
   tablas: `kb_documents` (base de conocimiento), `conversations` y
   `messages` (tus conversaciones/analytics), y `scrape_snapshots` (para la
   fase de scraping automático, todavía no se usa).
3. Pegá y ejecutá `supabase/seed.sql`. Esto carga las primeras 4 respuestas
   verificadas sobre TU Berlin.
   ⚠️ Antes de confiar en el dato de nivel de alemán, leé el comentario al
   principio de ese archivo — hay una inconsistencia entre fuentes que
   conviene confirmar directamente con el Studienkolleg.

## 2. Variables de entorno

1. Copiá `.env.example` como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Completá:
   - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: los tenés
     de Settings → API en Supabase (ya me los pasaste).
   - `SUPABASE_SERVICE_ROLE_KEY`: mismo lugar, la key que dice
     "service_role". **Nunca la subas a GitHub ni la compartas.**
   - `ANTHROPIC_API_KEY`: la generás en console.anthropic.com → API Keys.

## 3. Correr en local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000 — ahí ya deberías poder chatear y ver que las
respuestas sobre TU Berlin usan la info cargada en el seed.

## 4. Desplegar en Vercel (gratis)

1. Subí este proyecto a un repositorio de GitHub (privado o público, como
   prefieras).
2. Entrá a vercel.com, conectá tu cuenta de GitHub, e importá el repo.
3. En la configuración del proyecto en Vercel, agregá las mismas variables
   de entorno del paso 2 (Settings → Environment Variables).
4. Deploy. Vercel te da una URL tipo `stkguia.vercel.app` — esa es tu MVP
   en vivo.

## Cómo está organizado el código

```
app/
  page.tsx              → interfaz del chat
  api/chat/route.ts     → endpoint principal: clasifica, busca contexto, responde, guarda todo
  layout.tsx            → tipografías y metadata

lib/
  constants.ts           → las 4 sedes + las categorías fijas de clasificación
  anthropic.ts            → wrapper de la API de Claude
  classify.ts             → detecta sede + categoría de cada pregunta
  retrieval.ts             → busca en la base de conocimiento (texto completo, sin vectores)
  system-prompt.ts         → el "carácter" institucional del asistente
  supabase-admin.ts        → cliente de Supabase para el backend (service_role)
  supabase-browser.ts      → cliente de Supabase para el frontend (público, sin uso todavía)

supabase/
  schema.sql              → estructura de las tablas
  seed.sql                 → datos iniciales de TU Berlin
```

## Cómo agregar más información a la base de conocimiento

Por ahora, manualmente vía SQL Editor de Supabase (scraping semi-manual, tal
como lo planeamos). Ejemplo para agregar un nuevo dato:

```sql
insert into kb_documents (sede_id, categoria, pregunta_ejemplo, contenido, fuente_url, fecha_extraccion)
values (
  'muenchen',
  'costos',
  '¿Cuánto cuesta el Studienkolleg en München?',
  'Texto de la respuesta acá...',
  'https://url-oficial-de-la-fuente.de',
  current_date
);
```

## Próximos pasos (no incluidos en este MVP)

1. **Bot de Telegram** para avisos cuando el scraping detecta cambios en las
   páginas oficiales (tabla `scrape_snapshots` ya está lista para esto).
2. **Script de scraping** periódico (aún no armado).
3. **Panel de analytics** simple para ver qué categorías/sedes se preguntan
   más (hoy los datos ya se guardan en `messages`, falta solo la vista).
4. Completar la base de conocimiento para München, Hamburg y Sachsen (Leipzig)
   — hoy solo tiene 4 entradas de TU Berlin.
