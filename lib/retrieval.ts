import { supabaseAdmin } from "./supabase-admin";

export type KbResult = {
  contenido: string;
  fuente_url: string | null;
  categoria: string;
  fecha_extraccion: string;
};

// Busca los fragmentos más relevantes en la base de conocimiento usando
// búsqueda de texto completo de Postgres (gratis, sin necesidad de un
// servicio de embeddings). Filtra por sede y categoría cuando se conocen,
// lo que reduce muchísimo el ruido incluso con una búsqueda simple.
export async function searchKnowledge(params: {
  query: string;
  sedeId: string | null;
  categoria: string | null;
  limit?: number;
}): Promise<KbResult[]> {
  let q = supabaseAdmin
    .from("kb_documents")
    .select("contenido, fuente_url, categoria, fecha_extraccion")
    .eq("activo", true)
    .textSearch("search", params.query, {
      type: "websearch",
      config: "spanish",
    })
    .limit(params.limit ?? 4);

  if (params.sedeId) q = q.eq("sede_id", params.sedeId);
  if (params.categoria && params.categoria !== "otro") {
    q = q.eq("categoria", params.categoria);
  }

  const { data, error } = await q;

  if (error) {
    console.error("Error buscando en kb_documents:", error);
    return [];
  }

  // Si el filtro combinado (sede + categoría) no devolvió nada, reintentamos
  // solo con la sede, por si la categoría detectada fue incorrecta.
  if ((!data || data.length === 0) && params.sedeId) {
    const { data: fallback } = await supabaseAdmin
      .from("kb_documents")
      .select("contenido, fuente_url, categoria, fecha_extraccion")
      .eq("activo", true)
      .eq("sede_id", params.sedeId)
      .textSearch("search", params.query, {
        type: "websearch",
        config: "spanish",
      })
      .limit(params.limit ?? 4);
    return fallback ?? [];
  }

  return data ?? [];
}
