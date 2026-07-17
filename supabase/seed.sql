-- ============================================================
-- STKguía — datos de ejemplo (seed) para TU Berlin
-- Correr DESPUÉS de schema.sql, en el mismo SQL Editor de Supabase.
--
-- Fuente principal: páginas oficiales tu.berlin (verificadas el 2026-07-02).
--
-- ⚠️ OJO — Néstor, revisar esto antes de confiar 100%:
-- Encontré una inconsistencia entre fuentes sobre el nivel de alemán:
--   - tu.berlin (oficial) pide C1 para la Bewerbungsgruppe A.
--   - un agregador (studienkolleg.org) lista B2 como nivel aceptado.
-- Cargué la versión oficial (C1), pero antes de publicarlo te recomiendo
-- escribirle un mail al Studienkolleg (studienkolleg@tu-berlin.de) para
-- confirmar cuál es el requisito real vigente, porque es un dato que si
-- está mal, le puede arruinar la planificación a alguien.
-- ============================================================

insert into kb_documents (sede_id, categoria, pregunta_ejemplo, contenido, fuente_url, fecha_extraccion) values

(
  'tu-berlin',
  'nivel_idioma',
  '¿Qué nivel de alemán necesito para entrar al Studienkolleg de la TU Berlin?',
  'Para postular al Studienkolleg de la TU Berlin (Bewerbungsgruppe A, con título extranjero) se exige un nivel de alemán mínimo de C1 del Marco Común Europeo de Referencia (GER). Si además elegís el curso W (economía/ciencias sociales), se recomienda inglés nivel B2, ya que el examen de inglés se toma a ese nivel. IMPORTANTE: hay fuentes secundarias que mencionan B2 como nivel aceptado — este dato está pendiente de confirmación directa con el Studienkolleg antes de darlo por definitivo.',
  'https://www.tu.berlin/studierendensekretariat/bewerbung-einschreibung-bachelor/studieninteressierte-mit-auslaendischen-bildungsnachweisen/bewerbung/bewerbungsgruppe-a',
  current_date
),

(
  'tu-berlin',
  'clases_stk',
  '¿Cuánto dura el Studienkolleg en la TU Berlin?',
  'La formación en el Studienkolleg de la TU Berlin dura generalmente 2 semestres y termina con la Feststellungsprüfung (FSP), el examen que certifica que estás en condiciones de comenzar una carrera universitaria en Alemania. También existe la opción de rendir la FSP de forma externa, sin cursar las clases. El Studienkolleg de la TU Berlin ofrece los cursos T (técnico/científico) y W (económico/social) — la elección depende de qué título tenés y a qué carrera querés acceder.',
  'https://www.tu.berlin/international/studierende/studienkolleg',
  current_date
),

(
  'tu-berlin',
  'documentacion',
  '¿Qué documentos necesito para inscribirme al Studienkolleg de la TU Berlin?',
  'La postulación se hace a través de uni-assist, no directo a la universidad. Los pasos y documentos principales son: 1) Solicitar cuanto antes una VPD (Vorprüfungsdokumentation) para la TU Berlin en uni-assist — el trámite puede tardar de 4 a 6 semanas. 2) Una vez que tenés la VPD, inscribirte en el portal de solicitudes de la TU Berlin (Bewerbungsportal), de forma online. 3) Presentar el comprobante de nivel de alemán exigido (ver categoría nivel_idioma). Toda la documentación se sube digitalmente al portal, no es necesario enviar nada por correo postal para este trámite en particular.',
  'https://www.tu.berlin/studierendensekretariat/bewerbung-einschreibung-bachelor/studieninteressierte-mit-auslaendischen-bildungsnachweisen/bewerbung/bewerbungsgruppe-a',
  current_date
),

(
  'tu-berlin',
  'alojamiento',
  '¿Cuánto cuesta un alojamiento en Berlín para estudiantes cerca de la TU Berlin?',
  'PENDIENTE DE VERIFICAR — este dato todavía no fue cargado con una fuente confiable y actualizada. El costo de alquiler en Berlín varía mucho según la zona y el tipo de vivienda (WG/piso compartido vs. residencia estudiantil vs. departamento propio), y cambia con frecuencia. Antes de responder esta pregunta con cifras concretas, hay que buscar una fuente actualizada (ej. el Studierendenwerk Berlin, que gestiona las residencias estudiantiles oficiales) y cargarla acá.',
  null,
  current_date
);

-- Nota: la última fila (alojamiento) queda marcada como pendiente a propósito.
-- El chat debería evitar inventar un número si consulta esta fila — el
-- system prompt le va a indicar que si un documento dice "PENDIENTE DE
-- VERIFICAR", debe avisarle al usuario que ese dato todavía no está
-- confirmado, en vez de inventarlo.
