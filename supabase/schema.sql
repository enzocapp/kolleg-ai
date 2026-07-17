-- ============================================================
-- STKguía — schema inicial de Supabase
-- Correr esto en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- --------------------------------------------------------------
-- 1. BASE DE CONOCIMIENTO (lo que el chat usa para responder)
-- --------------------------------------------------------------
create table if not exists kb_documents (
  id uuid primary key default gen_random_uuid(),
  sede_id text not null,              -- 'tu-berlin', 'muenchen', 'hamburg', 'sachsen-leipzig'
  categoria text not null,            -- requisitos, examen_acceso, documentacion, costos, nivel_idioma, vida_en_alemania, alojamiento, clases_stk, otro
  pregunta_ejemplo text,              -- la pregunta que este fragmento responde (ej: "¿qué nivel de alemán necesito...?")
  contenido text not null,            -- el texto real que se le pasa a la IA como contexto
  fuente_url text,                    -- link a la página oficial de donde salió el dato
  fecha_extraccion date not null default current_date,
  activo boolean not null default true, -- para desactivar info vieja sin borrarla
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- columna generada para búsqueda de texto completo en español
  search tsvector generated always as (
    setweight(to_tsvector('spanish', coalesce(pregunta_ejemplo, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(contenido, '')), 'B')
  ) stored
);

create index if not exists kb_documents_search_idx on kb_documents using gin (search);
create index if not exists kb_documents_sede_idx on kb_documents (sede_id);
create index if not exists kb_documents_categoria_idx on kb_documents (categoria);

-- --------------------------------------------------------------
-- 2. CONVERSACIONES (tu base de insights de contenido)
-- --------------------------------------------------------------
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  sede_id text,                       -- puede ser null si el usuario todavía no lo especificó
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  categoria text,                     -- solo se completa en mensajes de tipo 'user', clasificado automáticamente
  sede_id text,                       -- sede detectada al momento de este mensaje puntual
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on messages (conversation_id);
create index if not exists messages_categoria_idx on messages (categoria);

-- --------------------------------------------------------------
-- 3. SNAPSHOTS DE SCRAPING (para detectar cambios en páginas oficiales)
--    Se usa más adelante, en la Fase de scraping + alertas a Telegram.
-- --------------------------------------------------------------
create table if not exists scrape_snapshots (
  id uuid primary key default gen_random_uuid(),
  sede_id text not null,
  url text not null,
  content_hash text not null,         -- hash del contenido para detectar cambios rápido
  raw_content text,                   -- último contenido scrapeado, para mostrar el diff
  checked_at timestamptz not null default now(),
  reviewed boolean not null default false  -- true una vez que vos confirmaste el cambio por Telegram
);

create index if not exists scrape_snapshots_sede_idx on scrape_snapshots (sede_id);

-- --------------------------------------------------------------
-- Nota sobre seguridad (RLS):
-- Estas tablas NO tienen Row Level Security activado a propósito.
-- Todo el acceso pasa por nuestro backend (app/api/**) usando la
-- service_role key, que ya tiene acceso total. El frontend nunca
-- consulta estas tablas directamente. Si en el futuro el frontend
-- necesita leer algo directo de Supabase, ahí sí hay que activar RLS
-- y escribir políticas explícitas antes de exponer la tabla.
-- ============================================================
