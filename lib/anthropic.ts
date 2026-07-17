// Wrapper mínimo sobre la API de Anthropic (Claude). Usamos Haiku porque es el
// modelo más económico y rinde muy bien para este caso de uso (respuestas
// informativas basadas en contexto que le pasamos nosotros, no en razonamiento
// complejo). Ver el plan de gastos: esto es lo que mantiene el costo en
// centavos por conversación.

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

type ClaudeMessage = { role: "user" | "assistant"; content: string };

async function callClaude(params: {
  system: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
}): Promise<string> {
  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: params.maxTokens ?? 800,
      system: params.system,
      messages: params.messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error de la API de Anthropic (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((b: any) => b.type === "text");
  return textBlock?.text ?? "";
}

export { callClaude };
export type { ClaudeMessage };
