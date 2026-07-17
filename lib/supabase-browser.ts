import { createClient } from "@supabase/supabase-js";

// Cliente para el navegador — usa la key pública (segura de exponer).
// Solo se usa si en el futuro el frontend necesita leer datos directo de Supabase.
// Por ahora el chat habla con nuestro propio backend (app/api/chat), no con Supabase directamente.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
