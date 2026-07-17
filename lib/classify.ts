import { callClaude } from "./anthropic";
import { SEDES, CATEGORIAS } from "./constants";

// Clasifica el mensaje del usuario: detecta a qué sede se refiere (si lo dijo)
// y a qué categoría pertenece la pregunta. Es una llamada aparte, corta y
// barata (poco input, poco output), separada de la respuesta principal para
// mantener cada llamada simple y fácil de cachear.
export async function classifyMessage(params: {
  message: string;
  sedeActual: string | null; // sede ya detectada en la conversación, si hay
}): Promise<{ sedeId: string | null; categoria: string }> {
  const sedesLista = SEDES.map((s) => `${s.id} (${s.nombre})`).join(", ");
  const categoriasLista = CATEGORIAS.join(", ");

  const system = `Sos un clasificador. Dado un mensaje de un usuario sobre el Studienkolleg en Alemania, respondé SOLO con un JSON válido, sin texto adicional, con este formato exacto:
{"sede_id": "<uno de: ${sedesLista}, o null si no se menciona o no se puede inferir>", "categoria": "<una de: ${categoriasLista}>"}

Sede actual conocida en esta conversación (usar si el mensaje no aclara otra): ${params.sedeActual ?? "ninguna"}`;

  const raw = await callClaude({
    system,
    messages: [{ role: "user", content: params.message }],
    maxTokens: 150,
  });

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      sedeId: parsed.sede_id ?? params.sedeActual ?? null,
      categoria: parsed.categoria ?? "otro",
    };
  } catch {
    // Si el clasificador falla, no rompemos el chat: seguimos sin clasificar.
    return { sedeId: params.sedeActual ?? null, categoria: "otro" };
  }
}
