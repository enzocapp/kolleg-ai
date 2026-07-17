// Sedes cubiertas en el MVP. Al agregar una nueva, solo hace falta sumarla acá
// y cargar sus documentos en la tabla kb_documents (ver supabase/schema.sql).
export const SEDES = [
  {
    id: "tu-berlin",
    nombre: "TU Berlin",
    ciudad: "Berlín",
  },
  {
    id: "muenchen",
    nombre: "München",
    ciudad: "Múnich",
  },
  {
    id: "hamburg",
    nombre: "Hamburg",
    ciudad: "Hamburgo",
  },
  {
    id: "sachsen-leipzig",
    nombre: "Sachsen (Leipzig)",
    ciudad: "Leipzig",
  },
  {
    id: "frankfurt",
    nombre: "Frankfurt",
    ciudad: "Frankfurt am Main",
  },
] as const;

export type SedeId = (typeof SEDES)[number]["id"];

// Categorías fijas para clasificar cada pregunta. Se usan tanto para
// etiquetar conversaciones (analytics de contenido) como para acotar
// la búsqueda en la base de conocimiento.
export const CATEGORIAS = [
  "requisitos",
  "examen_acceso",
  "documentacion",
  "costos",
  "nivel_idioma",
  "vida_en_alemania",
  "alojamiento",
  "clases_stk",
  "otro",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

// Preguntas frecuentes que se muestran como chips al iniciar el chat.
// "label" es el texto corto del botón; "pregunta" es lo que se envía
// realmente al tocarlo (puede ser más largo/específico que el label).
export const PREGUNTAS_SUGERIDAS = [
  { label: "¿Qué es el Studienkolleg?", pregunta: "¿Qué es el Studienkolleg y para quién es obligatorio?" },
  { label: "¿Cómo me anoto?", pregunta: "¿Cómo es el proceso para anotarme al Studienkolleg?" },
  { label: "Requisitos y documentos", pregunta: "¿Qué documentos necesito para inscribirme?" },
  { label: "Nivel de alemán", pregunta: "¿Qué nivel de alemán necesito para entrar al Studienkolleg?" },
  { label: "Fechas y plazos", pregunta: "¿Cuáles son las fechas límite de inscripción?" },
  { label: "Prueba de acceso (Aufnahmetest)", pregunta: "¿Cómo es el examen de ingreso (Aufnahmetest) al Studienkolleg?" },
] as const;
