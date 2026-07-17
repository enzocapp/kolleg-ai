import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { callClaude, ClaudeMessage } from "@/lib/anthropic";
import { classifyMessage } from "@/lib/classify";
import { searchKnowledge } from "@/lib/retrieval";
import { buildSystemPrompt } from "@/lib/system-prompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationId } = body as {
      message: string;
      conversationId: string | null;
    };

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío." },
        { status: 400 }
      );
    }

    // 1. Obtener o crear la conversación
    let convId = conversationId;
    let sedeActual: string | null = null;

    if (convId) {
      const { data: conv } = await supabaseAdmin
        .from("conversations")
        .select("id, sede_id")
        .eq("id", convId)
        .single();
      sedeActual = conv?.sede_id ?? null;
    } else {
      const { data: newConv, error } = await supabaseAdmin
        .from("conversations")
        .insert({})
        .select("id")
        .single();
      if (error || !newConv) throw error;
      convId = newConv.id;
    }

    // 2. Clasificar el mensaje (sede + categoría)
    const { sedeId, categoria } = await classifyMessage({
      message,
      sedeActual,
    });

    // Si detectamos una sede nueva, la guardamos en la conversación
    if (sedeId && sedeId !== sedeActual) {
      await supabaseAdmin
        .from("conversations")
        .update({ sede_id: sedeId })
        .eq("id", convId);
    }

    // 3. Guardar el mensaje del usuario (con su clasificación → esto alimenta tus analytics)
    await supabaseAdmin.from("messages").insert({
      conversation_id: convId,
      role: "user",
      content: message,
      categoria,
      sede_id: sedeId,
    });

    // 4. Buscar contexto relevante en la base de conocimiento
    const contexto = await searchKnowledge({
      query: message,
      sedeId,
      categoria,
    });

    // 5. Traer el historial de la conversación (memoria completa del hilo)
    const { data: historyRows } = await supabaseAdmin
      .from("messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    const history: ClaudeMessage[] = (historyRows ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // 6. Generar la respuesta
    const system = buildSystemPrompt({ sedeId, contexto });
    const respuesta = await callClaude({
      system,
      messages: history,
      maxTokens: 800,
    });

    // 7. Guardar la respuesta del asistente
    await supabaseAdmin.from("messages").insert({
      conversation_id: convId,
      role: "assistant",
      content: respuesta,
      sede_id: sedeId,
    });

    return NextResponse.json({
      conversationId: convId,
      sedeId,
      categoria,
      respuesta,
    });
  } catch (err: any) {
    console.error("Error en /api/chat:", err);
    return NextResponse.json(
      { error: "Ocurrió un error procesando tu mensaje. Probá de nuevo." },
      { status: 500 }
    );
  }
}
