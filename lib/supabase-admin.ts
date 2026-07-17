import { createClient } from "@supabase/supabase-js";

// Cliente para el servidor (solo se usa dentro de app/api/**, nunca en componentes de cliente).
// Usa la service_role key: tiene acceso total a la base de datos, salteando cualquier
// restricción. Por eso vive únicamente en variables de entorno del lado del servidor
// (SUPABASE_SERVICE_ROLE_KEY, sin el prefijo NEXT_PUBLIC_) y nunca debe llegar al navegador.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { persistSession: false },
  }
);
