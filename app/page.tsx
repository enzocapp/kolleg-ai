"use client";

import { useState, useRef, useEffect } from "react";
import { SEDES, PREGUNTAS_SUGERIDAS } from "@/lib/constants";

type Message = { role: "user" | "assistant"; content: string };

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M12 3L2 8l10 5 8-4.2V16h1.5V8L12 3z"
        fill="currentColor"
      />
      <path
        d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5l-6 3.15-6-3.15z"
        fill="currentColor"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
      <path
        d="M12 19V5M12 5l-6 6M12 5l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 inline -mt-0.5 mr-1">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sedeId, setSedeId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Error desconocido");

      setConversationId(data.conversationId);
      if (data.sedeId) setSedeId(data.sedeId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.respuesta },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hubo un problema procesando tu consulta. Por favor, intentá de nuevo en unos segundos.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const sedeActual = SEDES.find((s) => s.id === sedeId);
  const isEmpty = messages.length === 0;

  return (
    <main className="min-h-screen bg-ink-deep paper-texture flex flex-col">
      {/* Header */}
      <header className="border-b border-line-dark bg-ink-deep/95 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-surface flex items-center justify-center text-ochre-light">
              <CapIcon />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-paper leading-none">
                Kolleg AI
              </h1>
              <p className="text-[13px] text-sage mt-1">
                Tu guía para el Studienkolleg
              </p>
            </div>
          </div>
          {sedeActual && (
            <div className="stamp px-2.5 py-1 rounded-card text-[11px] uppercase border-ochre text-ochre-light">
              {sedeActual.nombre}
            </div>
          )}
        </div>
      </header>

      {/* Estado vacío */}
      {isEmpty && (
        <div className="max-w-2xl mx-auto w-full px-6 pt-14 pb-4">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-paper mb-5 leading-[1.1]">
            Tu guía para el<br />
            Studienkolleg
          </h2>
          <p className="text-sage text-[16px] mb-10 max-w-lg leading-relaxed">
            Anotarte al Studienkolleg puede sentirse abrumador, pero no tenés
            que hacerlo solo. Contame en qué estás y lo resolvemos juntos,
            paso a paso y sin estrés.
          </p>

          <p className="text-[13px] text-sage mb-3">Elegí una sede (opcional)</p>
          <div className="flex flex-wrap gap-2 mb-9">
            {SEDES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSedeId(s.id)}
                className={`px-3.5 py-1.5 rounded-full border text-sm transition-all ${
                  sedeId === s.id
                    ? "border-ochre bg-ochre/15 text-ochre-light"
                    : "border-line-dark text-sage hover:border-sage hover:text-paper"
                }`}
              >
                {s.nombre}
              </button>
            ))}
          </div>

          <p className="text-[13px] text-sage mb-3">O preguntame lo que necesites</p>
          <div className="flex flex-wrap gap-2.5 mb-4">
            {PREGUNTAS_SUGERIDAS.map((q) => (
              <button
                key={q.label}
                onClick={() => sendMessage(q.pregunta)}
                className="px-4 py-3 rounded-full border border-line-dark bg-surface hover:bg-surface-2 hover:border-sage transition-all text-[14px] text-paper"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg-appear flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 text-ochre-light">
                <span className="scale-75"><CapIcon /></span>
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-card px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-prussian text-paper"
                  : "bg-surface border border-line-dark text-paper"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start msg-appear">
            <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center mr-2 flex-shrink-0 text-ochre-light">
              <span className="scale-75"><CapIcon /></span>
            </div>
            <div className="bg-surface border border-line-dark rounded-card px-4 py-3">
              <span className="font-mono text-xs text-sage">
                consultando fuentes verificadas…
              </span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input + aviso fijo */}
      <div className="border-t border-line-dark bg-ink-deep sticky bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <div className="max-w-2xl mx-auto my-4 px-6">
            <div className="flex items-center gap-2 bg-surface rounded-full pl-2 pr-2 border border-line-dark focus-within:border-sage transition-colors">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu consulta sobre el Studienkolleg…"
              className="flex-1 bg-transparent px-4 py-3 text-[15px] text-paper placeholder:text-sage/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Enviar"
              className="w-9 h-9 rounded-full bg-ochre text-ink-deep flex items-center justify-center disabled:opacity-30 hover:bg-ochre-light transition-colors flex-shrink-0"
            >
              <SendIcon />
            </button>
            </div>
          </div>
        </form>
        <p className="max-w-2xl mx-auto px-6 pb-4 text-center text-[12px] text-sage/80 leading-snug">
          <InfoIcon />
          Ante cualquier duda, consultá siempre la página oficial de tu Studienkolleg.
        </p>
      </div>
    </main>
  );
}
