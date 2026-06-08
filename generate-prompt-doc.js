const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, LevelFormat,
} = require("docx");
const fs = require("fs");

// ── Palette: DM-1 Deep Cyan (AI / Tech) ──
const P = {
  primary: "162235",
  body: "1A2B40",
  secondary: "5B6B7D",
  accent: "37DCF2",
  surface: "F4F8FC",
  coverBg: "162235",
  coverTitle: "FFFFFF",
  coverSub: "B0B8C0",
  coverMeta: "90989F",
  tableHeaderBg: "1B6B7A",
  tableHeaderText: "FFFFFF",
  tableAccentLine: "1B6B7A",
  tableInnerLine: "C8DDE2",
  tableSurface: "EDF3F5",
};
const c = (hex) => hex.replace("#", "");

// ── Borders ──
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };

// ── Helpers ──
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120 },
    children: [new TextRun({ text, bold: true, color: P.primary, font: { ascii: "Calibri", eastAsia: "SimHei" } })],
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 22, color: P.body, ...opts })],
  });
}

function bodyBold(text) {
  return body(text, { bold: true });
}

function codeBlock(text) {
  return new Paragraph({
    spacing: { line: 276, after: 60 },
    indent: { left: 360 },
    shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
    children: [new TextRun({ text, size: 18, font: { ascii: "Consolas", eastAsia: "Consolas" }, color: "1A2B40" })],
  });
}

function bulletItem(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { line: 312, after: 40 },
    children: [new TextRun({ text, size: 22, color: P.body })],
  });
}

function accentLine() {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: P.accent.replace("#", ""), space: 10 } },
    children: [],
  });
}

function makeTable(headers, rows) {
  const tP = P;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: tP.tableAccentLine },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: tP.tableAccentLine },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: tP.tableInnerLine },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        cantSplit: true,
        children: headers.map(h =>
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: tP.tableHeaderText })] })],
            shading: { type: ShadingType.CLEAR, fill: tP.tableHeaderBg },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
          })
        ),
      }),
      ...rows.map((row, idx) =>
        new TableRow({
          cantSplit: true,
          children: row.map(cell =>
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, color: tP.body })] })],
              shading: idx % 2 === 0
                ? { type: ShadingType.CLEAR, fill: tP.tableSurface }
                : { type: ShadingType.CLEAR, fill: "FFFFFF" },
              margins: { top: 50, bottom: 50, left: 120, right: 120 },
            })
          ),
        })
      ),
    ],
  });
}

// ── Cover (R4 Top Color Block) ──
function buildCover() {
  const bg = P.coverBg;
  const wrapperHeight = 16838;
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: allNoBorders,
      rows: [
        // Top color block
        new TableRow({
          height: { value: 5200, rule: "exact" },
          children: [
            new TableCell({
              borders: allNoBorders,
              shading: { type: ShadingType.CLEAR, fill: bg },
              verticalAlign: "top",
              children: [
                new Paragraph({ spacing: { before: 1800 }, children: [] }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 400, after: 200 },
                  children: [
                    new TextRun({ text: "CMOR PROTOCOL", size: 52, bold: true, color: P.accent.replace("#", ""), font: { ascii: "Calibri", eastAsia: "SimHei" } }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 100 },
                  children: [
                    new TextRun({ text: "Arquitectura de Agentes de IA", size: 36, color: P.coverTitle, font: { ascii: "Calibri", eastAsia: "SimHei" } }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // Body area
        new TableRow({
          height: { value: wrapperHeight - 5200, rule: "exact" },
          children: [
            new TableCell({
              borders: allNoBorders,
              verticalAlign: "top",
              children: [
                new Paragraph({ spacing: { before: 800 }, children: [] }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 200 },
                  children: [
                    new TextRun({ text: "Especificaci\u00f3n T\u00e9cnica Completa", size: 40, bold: true, color: P.primary, font: { ascii: "Calibri", eastAsia: "SimHei" } }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 120 },
                  children: [
                    new TextRun({ text: "Agente WhatsApp CRM + Agente Prospector Google Maps", size: 24, color: P.secondary, font: { ascii: "Calibri", eastAsia: "SimHei" } }),
                  ],
                }),
                accentLine(),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 400, after: 80 },
                  children: [
                    new TextRun({ text: "Versi\u00f3n 1.0 \u2014 Junio 2026", size: 22, color: P.secondary }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Servicios 100% gratuitos \u2014 Sin dependencias de pago", size: 20, color: P.secondary }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];
}

// ── Numbering Config ──
const numberingConfig = [];
const listNames = [
  "agent1-flow", "agent1-tools", "agent1-llm", "agent1-whatsapp",
  "agent2-flow", "agent2-tools", "agent2-places", "agent2-scrape", "agent2-outreach",
  "stack-list", "roadmap-w1", "roadmap-w2", "roadmap-w3", "roadmap-w4",
  "security-list", "general-steps",
];
listNames.forEach(name => {
  numberingConfig.push({
    reference: name,
    levels: [{
      level: 0,
      format: LevelFormat.DECIMAL,
      text: "%1.",
      alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } },
    }],
  });
});

function numberedItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { line: 312, after: 60 },
    children: [new TextRun({ text, size: 22, color: P.body })],
  });
}

// ── Body Content ──
function buildBody() {
  const children = [];

  // TOC
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: "Contenido" })],
    }),
    new TableOfContents("TOC", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
    new Paragraph({
      children: [new TextRun({ text: "Haz clic derecho en esta tabla de contenido y selecciona \u201cActualizar campo\u201d para refrescar los n\u00fameros de p\u00e1gina.", size: 18, italics: true, color: P.secondary })],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  );

  // ===== SECTION 1: VISI\u00d3N GENERAL =====
  children.push(
    heading("1. Visi\u00f3n General del Sistema"),
    body("Este documento describe la arquitectura completa para construir dos agentes de IA aut\u00f3nomos que trabajan juntos para generar leads, calificar prospectos y cerrar ventas de forma autom\u00e1tica. El sistema est\u00e1 dise\u00f1ado para funcionar exclusivamente con servicios gratuitos, sin dependencias de pago, lo que lo hace accesible para cualquier persona o empresa que quiera empezar a automatizar sus ventas con inteligencia artificial."),
    body("El primer agente es un sistema de atenci\u00f3n al cliente por WhatsApp que se conecta a un CRM, califica prospectos autom\u00e1ticamente y programa seguimientos. El segundo agente busca negocios en Google Maps, analiza sus sitios web, genera propuestas personalizadas con im\u00e1genes de c\u00f3mo mejorar\u00eda su presencia digital, y env\u00eda correos y mensajes de forma aut\u00f3noma. Ambos agentes comparten la misma base de datos de leads, creando un sistema completo de ventas automatizado."),
    accentLine(),
  );

  // ===== SECTION 2: STACK DE HERRAMIENTAS GRATUITAS =====
  children.push(
    heading("2. Stack de Herramientas (100% Gratuitas)"),
    body("Todas las herramientas seleccionadas tienen planes gratuitos funcionales que permiten operar el sistema completo sin costo inicial. Algunas son de c\u00f3digo abierto (self-hosted), otras tienen tiers gratuitos generosos en la nube. A continuaci\u00f3n se detalla cada herramienta, su funci\u00f3n y los l\u00edmites del plan gratuito."),
    makeTable(
      ["Herramienta", "Funci\u00f3n", "Plan Gratis"],
      [
        ["Evolution API", "Conexi\u00f3n WhatsApp Business", "Ilimitado (self-hosted, c\u00f3digo abierto)"],
        ["n8n", "Orquestador de flujos / automatizaci\u00f3n", "Ilimitado (self-hosted, c\u00f3digo abierto)"],
        ["Supabase", "Base de datos CRM + API REST", "500 MB, 50K filas, API ilimitada"],
        ["OpenRouter", "Acceso a LLMs (GPT-4, Claude, Gemini)", "Cr\u00e9ditos gratis iniciales + modelos free"],
        ["Google Places API", "B\u00fasqueda de negocios por ciudad/tipo", "$200 USD cr\u00e9dito/mes (~5,000 b\u00fasquedas)"],
        ["Resend", "Env\u00edo de correos electr\u00f3nicos", "100 correos/d\u00eda, 3,000/mes"],
        ["Cloudflare Workers", "Scraping de p\u00e1ginas web", "100K requests/d\u00eda"],
        ["Vercel", "Dashboard web + hosting", "Ilimitado (hobby tier)"],
        ["Docker", "Contenedores para self-hosting", "Gratuito (Docker Desktop / CLI)"],
        ["MongoDB Community", "Base de datos para Evolution API", "Ilimitado (self-hosted)"],
      ]
    ),
    body(""),
    bodyBold("Nota sobre costos:"),
    body("El \u00fanico servicio con costo potencial es Google Places API una vez que se excedan los $200 USD/mes de cr\u00e9dito gratuito. Para la mayor\u00eda de negocios, esto equivale a aproximadamente 5,000 b\u00fasquedas mensuales, lo cual es m\u00e1s que suficiente para prospecci\u00f3n normal. Si se necesita m\u00e1s volumen, se puede usar un scraper de Google Maps como alternativa gratuita."),
  );

  // ===== SECTION 3: AGENTE 1 - WHATSAPP CRM =====
  children.push(
    heading("3. Agente 1: WhatsApp CRM"),
    heading("3.1 Descripci\u00f3n Funcional", HeadingLevel.HEADING_2),
    body("El Agente WhatsApp CRM es un asistente inteligente que atiende a los clientes y prospectos que escriben por WhatsApp. No es un chatbot tradicional que solo responde preguntas frecuentes: es un agente aut\u00f3nomo que se conecta a la base de datos de la empresa, puede consultar informaci\u00f3n de servicios, calificar prospectos seg\u00fan criterios definidos, registrar leads autom\u00e1ticamente en el CRM, y programar seguimientos peri\u00f3dicos sin intervenci\u00f3n humana."),
    body("El agente est\u00e1 entrenado en los servicios de CMOR Protocol: Agentes de IA para atenci\u00f3n al cliente, agentes de venta (SDR), agentes de voz, gesti\u00f3n del conocimiento, an\u00e1lisis de datos, marketing digital, p\u00e1ginas web, landing pages, desarrollo SaaS y ciberseguridad. Conoce los casos de uso, los clientes objetivo y los precios de cada servicio, y puede responder preguntas detalladas sobre cualquiera de ellos."),
    heading("3.2 Flujo del Agente", HeadingLevel.HEADING_2),
    body("El flujo completo de interacci\u00f3n del agente es el siguiente:"),
    numberedItem("Un cliente o prospecto env\u00eda un mensaje por WhatsApp al n\u00famero de negocio.", "agent1-flow"),
    numberedItem("Evolution API recibe el mensaje y dispara un webhook hacia n8n.", "agent1-flow"),
    numberedItem("n8n extrae el n\u00famero de tel\u00e9fono y el texto del mensaje.", "agent1-flow"),
    numberedItem("Se busca el n\u00famero en la tabla leads de Supabase. Si no existe, se crea un nuevo lead con estado 'nuevo'.", "agent1-flow"),
    numberedItem("Se carga el historial de conversaciones previas del lead desde Supabase.", "agent1-flow"),
    numberedItem("Se env\u00eda el mensaje + historial + contexto de servicios al LLM (v\u00eda OpenRouter).", "agent1-flow"),
    numberedItem("El LLM genera una respuesta personalizada, decidiendo si el prospecto califica.", "agent1-flow"),
    numberedItem("La respuesta se env\u00eda de vuelta por WhatsApp v\u00eda Evolution API.", "agent1-flow"),
    numberedItem("Se guarda la conversaci\u00f3n en la tabla conversations de Supabase.", "agent1-flow"),
    numberedItem("Si el LLM indica que el prospecto califica, se actualiza el lead a estado 'calificado' y se programa un seguimiento autom\u00e1tico.", "agent1-flow"),
    numberedItem("Si el prospecto no califica, se mantiene en estado 'nuevo' con nota del motivo.", "agent1-flow"),
    body(""),
    heading("3.3 Criterios de Calificaci\u00f3n de Leads", HeadingLevel.HEADING_2),
    body("El agente califica autom\u00e1ticamente a los prospectos bas\u00e1ndose en tres criterios clave. Un prospecto se considera calificado cuando cumple al menos dos de los tres:"),
    bulletItem("Necesidad real: El prospecto tiene un problema que los servicios de CMOR pueden resolver (atenci\u00f3n al cliente deficiente, proceso manual repetitivo, falta de presencia digital, necesidad de automatizar)."),
    bulletItem("Presupuesto: El prospecto indica que tiene presupuesto para implementar una soluci\u00f3n, o al menos no descarta la inversi\u00f3n. No se exige un monto espec\u00edfico, solo disposici\u00f3n a pagar por un servicio profesional."),
    bulletItem("Timing: El prospecto quiere implementar algo en las pr\u00f3ximas semanas o meses, no est\u00e1 solo explorando sin intenci\u00f3n de acci\u00f3n inmediata."),
    body(""),
    heading("3.4 System Prompt del Agente", HeadingLevel.HEADING_2),
    body("A continuaci\u00f3n se presenta el system prompt completo que se debe configurar en el LLM para el Agente WhatsApp CRM. Este prompt define la personalidad, el conocimiento y las reglas de comportamiento del agente:"),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "Eres un agente de ventas de CMOR Protocol. Tu nombre es CMOR Assistant. Tu \u00fanico objetivo es atender consultas, informar sobre los servicios y calificar prospectos.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "SERVICIOS QUE OFRECES:\n1. Agentes de IA para Atenci\u00f3n al Cliente: Agentes que se conectan al sistema del cliente, resuelven consultas, procesan devoluciones y generan descuentos autom\u00e1ticos. No son chatbots: toman decisiones y ejecutan acciones.\n2. Agentes de Venta (SDR con IA): Filtran prospectos autom\u00e1ticamente, hacen preguntas de calificaci\u00f3n y solo pasan al vendedor los que valen la pena. Tambi\u00e9n auditan la web del prospecto antes de la primera reuni\u00f3n.\n3. Agentes de Voz IA: Recepcionistas telef\u00f3nicos que entienden, reservan citas y despachan servicios de urgencia en tiempo real, 24/7.\n4. Gesti\u00f3n del Conocimiento: Agentes que leen toda la documentaci\u00f3n de la empresa y responden preguntas de empleados en lenguaje natural. Reducen tiempos de capacitaci\u00f3n y soporte interno.\n5. An\u00e1lisis de Datos: Agentes que permiten preguntar sobre los datos del negocio en lenguaje normal y obtienen respuestas con contexto, no solo tablas.\n6. Marketing Digital con IA: Automatizaci\u00f3n de redes sociales, creaci\u00f3n de contenido profesional con IA (im\u00e1genes, videos, logos).\n7. P\u00e1ginas Web y Landing Pages: Sitios r\u00e1pidos, modernos y optimizados para convertir visitantes en clientes.\n8. Desarrollo de Plataformas (SaaS): Aplicaciones web completas a medida, integraciones entre herramientas.\n9. Ciberseguridad con IA: Protecci\u00f3n activa 24/7, IA en servidores propios para m\u00e1xima privacidad.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "REGLAS DE COMPORTAMIENTO:\n- Responde SIEMPRE en espa\u00f1ol, de forma cercana y profesional.\n- Usa t\u00e9rminos simples. Explica la tecnolog\u00eda como si hablaras con alguien que no es t\u00e9cnico.\n- NUNCA mientas sobre capacidades. Si no sabes algo, di que un asesor humano lo confirmar\u00e1.\n- NUNCA des precios exactos. Di 'La primera consulta es gratis' y ofrece agendar una llamada.\n- Si el prospecto pregunta por precio, responde con rangos amplios y enf\u00e1zate en el valor.\n- Califica al prospecto haciendo preguntas naturales: \u00bfQu\u00e9 necesita? \u00bfQu\u00e9 tan urgente es? \u00bfYa tiene algo funcionando?\n- Si el prospecto califica (necesidad real + presupuesto + timing), dile que un asesor lo contactar\u00e1 pronto y pregunta cu\u00e1ndo le viene bien hablar.\n- Si no califica, s\u00e9 amable, ofrece informaci\u00f3n \u00fatil y deja la puerta abierta.\n- NUNCA menciones que eres una IA. Eres 'CMOR Assistant'.\n- Si el prospecto pregunta algo fuera de tema, redirige con amabilidad a los servicios.\n- M\u00e1ximo 3 mensajes seguidos sin respuesta del prospecto. Luego espera 24 horas.\n- Cada respuesta debe ser de m\u00e1ximo 3 p\u00e1rrafos cortos. WhatsApp es conversacional, no escribas ensayos.\n- Usa emojis con moderaci\u00f3n (m\u00e1ximo 2 por mensaje).\n- Siempre termina con una pregunta abierta para mantener la conversaci\u00f3n.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "FORMATO DE RESPUESTA INTERNA (para que n8n procese):\nAl final de cada respuesta, incluye una l\u00ednea invisible para el sistema (no la muestres al usuario):\n[LEAD_STATUS: nuevo|calificado|no_calificado]\n[NOTES: resumen breve de la conversaci\u00f3n y motivo de calificaci\u00f3n]",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    body(""),
    heading("3.5 Configuraci\u00f3n T\u00e9cnica", HeadingLevel.HEADING_2),
    bodyBold("Evolution API (WhatsApp)"),
    body("Instalar con Docker:"),
    codeBlock("docker run -d --name evolution-api -p 8080:8080 \\"),
    codeBlock("  -e AUTHENTICATION_API_KEY=tu_clave_secreta \\"),
    codeBlock("  -e DATABASE_ENABLED=true \\"),
    codeBlock("  -e DATABASE_CONNECTION_URI=mongodb://localhost:27017/evolution \\"),
    codeBlock("  atendai/evolution-api:latest"),
    body("Crear instancia y obtener QR para escanear:"),
    codeBlock("curl -X POST http://localhost:8080/instance/create \\"),
    codeBlock("  -H 'apikey: tu_clave_secreta' -H 'Content-Type: application/json' \\"),
    codeBlock("  -d '{\"instanceName\":\"cmor-agent\",\"qrcode\":true,\"integration\":\"WHATSAPP-BAILEYS\"}'"),
    body(""),
    bodyBold("Configurar Webhook hacia n8n:"),
    codeBlock("curl -X POST http://localhost:8080/webhook/set/cmor-agent \\"),
    codeBlock("  -H 'apikey: tu_clave_secreta' -H 'Content-Type: application/json' \\"),
    codeBlock("  -d '{\"enabled\":true,\"url\":\"http://TU_SERVIDOR:5678/webhook/whatsapp-in\",\"webhookByEvents\":true,\"events\":[\"MESSAGES_UPSERT\"]}'"),
    body(""),
    bodyBold("Enviar mensaje desde n8n:"),
    codeBlock("POST http://localhost:8080/message/sendText/cmor-agent"),
    codeBlock("Headers: apikey: tu_clave_secreta"),
    codeBlock('Body: {"number":"56912345678","text":"Hola, respuesta del agente"}'),
  );

  // ===== SECTION 4: AGENTE 2 - PROSPECTOR =====
  children.push(
    heading("4. Agente 2: Prospector Google Maps"),
    heading("4.1 Descripci\u00f3n Funcional", HeadingLevel.HEADING_2),
    body("El Agente Prospector es un sistema aut\u00f3nomo que busca negocios potenciales en Google Maps, analiza su presencia digital, genera propuestas personalizadas y las env\u00eda autom\u00e1ticamente por correo electr\u00f3nico y WhatsApp. El agente funciona como un vendedor digital que nunca duerme: busca prospectos, los eval\u00faa, les prepara una propuesta a medida con una imagen de c\u00f3mo mejorar\u00eda su presencia digital, y se los env\u00eda sin intervenci\u00f3n humana."),
    body("La diferencia clave con un correo masivo es que cada propuesta es \u00fanica. El agente analiza la web real del negocio, detecta problemas espec\u00edficos (velocidad lenta, dise\u00f1o obsoleto, sin bot\u00f3n de contacto, mala experiencia en m\u00f3vil) y genera un correo que menciona esos problemas concretos con una imagen generada por IA que muestra c\u00f3mo se ver\u00eda su negocio con una presencia digital mejorada."),
    heading("4.2 Flujo del Agente", HeadingLevel.HEADING_2),
    numberedItem("El usuario define los par\u00e1metros de b\u00fasqueda: ciudad, tipo de negocio (ej: 'dentistas en Santiago', 'restaurantes en Buenos Aires').", "agent2-flow"),
    numberedItem("El agente consulta Google Places API y obtiene una lista de negocios con nombre, direcci\u00f3n, tel\u00e9fono, sitio web y calificaci\u00f3n.", "agent2-flow"),
    numberedItem("Se filtran los resultados: solo negocios que tengan sitio web (para poder analizarlo) o que NO tengan sitio web (oportunidad directa de crearles uno).", "agent2-flow"),
    numberedItem("Se verifica que el negocio no est\u00e9 ya en la base de datos (evitar duplicados).", "agent2-flow"),
    numberedItem("Se guardan los datos en la tabla prospects de Supabase.", "agent2-flow"),
    numberedItem("Para cada negocio con sitio web: se hace scraping del contenido (servicios, dise\u00f1o, problemas evidentes).", "agent2-flow"),
    numberedItem("Se env\u00eda el contenido scrapeado al LLM para an\u00e1lisis. El LLM detecta problemas y oportunidades.", "agent2-flow"),
    numberedItem("El LLM genera: (a) un correo personalizado, (b) un prompt para generar imagen de propuesta, (c) un resumen del an\u00e1lisis.", "agent2-flow"),
    numberedItem("Se genera la imagen de propuesta usando IA de generaci\u00f3n de im\u00e1genes (DALL-E v\u00eda OpenRouter o Stability AI).", "agent2-flow"),
    numberedItem("Se env\u00eda el correo con la propuesta y la imagen adjunta v\u00eda Resend.", "agent2-flow"),
    numberedItem("Si tiene tel\u00e9fono de WhatsApp, tambi\u00e9n se env\u00eda un mensaje de introducci\u00f3n breve.", "agent2-flow"),
    numberedItem("Se actualiza el prospect en la base de datos: proposal_sent = true, lead_id = nuevo lead creado.", "agent2-flow"),
    body(""),
    heading("4.3 System Prompt del Agente Prospector", HeadingLevel.HEADING_2),
    body("El LLM del agente prospector tiene un system prompt diferente al del agente WhatsApp:"),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "Eres un analista de negocios digital y redactor de propuestas comerciales para CMOR Protocol. Recibir\u00e1s informaci\u00f3n sobre un negocio (nombre, tipo, sitio web, contenido scrapeado) y debes generar:\n\n1. AN\u00c1LISIS: Identifica 3-5 problemas concretos en su presencia digital (velocidad, dise\u00f1o, SEO, experiencia m\u00f3vil, falta de automatizaci\u00f3n, ausencia de chat, sin formulario de contacto, etc.). S\u00e9 espec\u00edfico: no digas 'mejorar dise\u00f1o', di 'el sitio no tiene bot\u00f3n de WhatsApp visible en m\u00f3vil'.\n\n2. OPORTUNIDADES: Para cada problema, indica qu\u00e9 servicio de CMOR lo resuelve y qu\u00e9 impacto tendr\u00eda en el negocio (m\u00e1s clientes, menos tiempo perdido, mejor atenci\u00f3n).\n\n3. CORREO: Redacta un correo personalizado de m\u00e1ximo 200 palabras. Debe ser directo, profesional y c\u00e1lido. Mencionar problemas espec\u00edficos de SU negocio. No usar lenguaje de marketing gen\u00e9rico. El asunto debe llamar la atenci\u00f3n sin ser clickbait. Incluir un CTA claro: 'Agenda una consulta gratis de 15 minutos'.\n\n4. IMAGEN PROMPT: Genera un prompt en ingl\u00e9s para crear una imagen que muestre c\u00f3mo se ver\u00eda el negocio con una presencia digital mejorada. El prompt debe ser espec\u00edfico al tipo de negocio y los problemas detectados. Ejemplo: 'Modern dental clinic website mockup on iPhone, clean white design with blue accents, prominent book appointment button, WhatsApp chat widget, professional dental imagery, responsive mobile layout'.\n\nResponde SIEMPRE en formato JSON con las claves: analysis, opportunities, email (con subject y body), image_prompt.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    body(""),
    heading("4.4 Configuraci\u00f3n T\u00e9cnica", HeadingLevel.HEADING_2),
    bodyBold("Google Places API"),
    body("1. Ir a console.cloud.google.com y crear un proyecto nuevo."),
    body("2. Habilitar 'Places API (New)' en la secci\u00f3n de APIs."),
    body("3. Crear credenciales de API Key. Restringir a Places API."),
    body("4. El plan gratuito otorga $200 USD/mes, equivalentes a ~5,000 b\u00fasquedas."),
    body(""),
    bodyBold("B\u00fasqueda de negocios:"),
    codeBlock("GET https://maps.googleapis.com/maps/api/place/textsearch/json"),
    codeBlock("  ?query=dentistas+en+Santiago"),
    codeBlock("  &key=TU_GOOGLE_API_KEY"),
    body(""),
    bodyBold("Detalles de cada negocio:"),
    codeBlock("GET https://maps.googleapis.com/maps/api/place/details/json"),
    codeBlock("  ?place_id=ChIJ..."),
    codeBlock("  &fields=name,formatted_phone_number,website,url,rating,formatted_address"),
    codeBlock("  &key=TU_GOOGLE_API_KEY"),
    body(""),
    bodyBold("Env\u00edo de correos con Resend:"),
    codeBlock("POST https://api.resend.com/emails"),
    codeBlock("Headers: Authorization: Bearer TU_RESEND_KEY"),
    codeBlock('Body: {"from":"propuestas@cmorprotocol.com","to":"negocio@email.com",'),
    codeBlock('  "subject":"Propuesta: C\u00f3mo mejorar tu presencia digital",'),
    codeBlock('  "html":"<h2>Correo personalizado</h2><img src=\'imagen-url\'>"}'),
  );

  // ===== SECTION 5: BASE DE DATOS =====
  children.push(
    heading("5. Base de Datos (Supabase)"),
    body("Supabase proporciona una base de datos PostgreSQL con API REST autom\u00e1tica, autenticaci\u00f3n y dashboard visual. A continuaci\u00f3n se presenta el esquema SQL completo que debe ejecutarse en el SQL Editor de Supabase para crear todas las tablas necesarias."),
    heading("5.1 Tabla: leads", HeadingLevel.HEADING_2),
    body("Almacena los prospectos calificados y clientes. Cada lead puede provenir de WhatsApp (atenci\u00f3n reactiva) o de Google Maps (prospecci\u00f3n activa). El estado fluye de 'nuevo' a 'calificado' a 'propuesta_enviada' a 'en_negociacion' a 'cliente' o 'perdido'."),
    codeBlock("CREATE TABLE leads ("),
    codeBlock("  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,"),
    codeBlock("  phone TEXT UNIQUE NOT NULL,"),
    codeBlock("  name TEXT,"),
    codeBlock("  business_name TEXT,"),
    codeBlock("  business_type TEXT,"),
    codeBlock("  city TEXT,"),
    codeBlock("  status TEXT DEFAULT 'nuevo' CHECK (status IN"),
    codeBlock("    ('nuevo','calificado','propuesta_enviada','en_negociacion','cliente','perdido')),"),
    codeBlock("  source TEXT DEFAULT 'whatsapp' CHECK (source IN"),
    codeBlock("    ('whatsapp','google_maps','manual')),"),
    codeBlock("  website_url TEXT,"),
    codeBlock("  social_links JSONB DEFAULT '[]',"),
    codeBlock("  notes TEXT,"),
    codeBlock("  last_contact_at TIMESTAMPTZ,"),
    codeBlock("  created_at TIMESTAMPTZ DEFAULT NOW(),"),
    codeBlock("  updated_at TIMESTAMPTZ DEFAULT NOW()"),
    codeBlock(");"),
    heading("5.2 Tabla: conversations", HeadingLevel.HEADING_2),
    body("Registra cada mensaje enviado y recibido. Permite al LLM tener contexto del historial completo de conversaciones con cada lead."),
    codeBlock("CREATE TABLE conversations ("),
    codeBlock("  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,"),
    codeBlock("  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,"),
    codeBlock("  channel TEXT DEFAULT 'whatsapp',"),
    codeBlock("  direction TEXT CHECK (direction IN ('inbound','outbound')),"),
    codeBlock("  message TEXT NOT NULL,"),
    codeBlock("  ai_generated BOOLEAN DEFAULT false,"),
    codeBlock("  created_at TIMESTAMPTZ DEFAULT NOW()"),
    codeBlock(");"),
    heading("5.3 Tabla: proposals", HeadingLevel.HEADING_2),
    body("Almacena las propuestas enviadas por el Agente Prospector, incluyendo la URL de la imagen generada y el estado de seguimiento."),
    codeBlock("CREATE TABLE proposals ("),
    codeBlock("  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,"),
    codeBlock("  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,"),
    codeBlock("  type TEXT CHECK (type IN ('email','whatsapp')),"),
    codeBlock("  content TEXT NOT NULL,"),
    codeBlock("  image_url TEXT,"),
    codeBlock("  status TEXT DEFAULT 'enviada' CHECK (status IN"),
    codeBlock("    ('enviada','vista','respondida','aceptada','rechazada')),"),
    codeBlock("  sent_at TIMESTAMPTZ DEFAULT NOW()"),
    codeBlock(");"),
    heading("5.4 Tabla: prospects", HeadingLevel.HEADING_2),
    body("Almacena los negocios encontrados en Google Maps antes de convertirse en leads. Un prospect se convierte en lead cuando se le env\u00eda una propuesta."),
    codeBlock("CREATE TABLE prospects ("),
    codeBlock("  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,"),
    codeBlock("  google_place_id TEXT UNIQUE,"),
    codeBlock("  name TEXT NOT NULL,"),
    codeBlock("  address TEXT,"),
    codeBlock("  phone TEXT,"),
    codeBlock("  website TEXT,"),
    codeBlock("  rating NUMERIC(2,1),"),
    codeBlock("  business_type TEXT,"),
    codeBlock("  city TEXT,"),
    codeBlock("  social_links JSONB DEFAULT '[]',"),
    codeBlock("  website_analysis JSONB,"),
    codeBlock("  proposal_sent BOOLEAN DEFAULT false,"),
    codeBlock("  lead_id UUID REFERENCES leads(id),"),
    codeBlock("  created_at TIMESTAMPTZ DEFAULT NOW()"),
    codeBlock(");"),
    heading("5.5 \u00cdndices Recomendados", HeadingLevel.HEADING_2),
    codeBlock("CREATE INDEX idx_leads_phone ON leads(phone);"),
    codeBlock("CREATE INDEX idx_leads_status ON leads(status);"),
    codeBlock("CREATE INDEX idx_prospects_city_type ON prospects(city, business_type);"),
    codeBlock("CREATE INDEX idx_conversations_lead ON conversations(lead_id);"),
    codeBlock("CREATE INDEX idx_proposals_lead ON proposals(lead_id);"),
  );

  // ===== SECTION 6: WORKFLOWS N8N =====
  children.push(
    heading("6. Workflows n8n"),
    body("Los workflows de n8n son el cerebro central del sistema. Orquestan toda la l\u00f3gica: recibir mensajes, consultar el LLM, guardar datos, enviar respuestas, hacer seguimientos y generar propuestas. A continuaci\u00f3n se describe la estructura de cada workflow."),
    heading("6.1 Workflow: Agente WhatsApp CRM", HeadingLevel.HEADING_2),
    body("Este workflow se activa cada vez que llega un mensaje de WhatsApp. La secuencia de nodos es la siguiente:"),
    makeTable(
      ["Nodo", "Tipo", "Descripci\u00f3n"],
      [
        ["1. Webhook WhatsApp", "Webhook (POST)", "Recibe el mensaje de Evolution API en /webhook/whatsapp-in"],
        ["2. Extraer Datos", "Code", "Extrae tel\u00e9fono, texto del mensaje, timestamp"],
        ["3. Buscar Lead", "HTTP Request", "GET a Supabase: leads?phone=eq.XXX"],
        ["4. Crear Lead (si no existe)", "HTTP Request", "POST a Supabase: insertar lead con status 'nuevo'"],
        ["5. Cargar Historial", "HTTP Request", "GET a Supabase: conversations?lead_id=eq.XXX&order=created_at.desc&limit=10"],
        ["6. Consultar LLM", "HTTP Request", "POST a OpenRouter con system prompt + historial + mensaje"],
        ["7. Parsear Respuesta", "Code", "Extraer LEAD_STATUS y NOTES del formato interno del LLM"],
        ["8. Enviar WhatsApp", "HTTP Request", "POST a Evolution API: enviar texto al n\u00famero"],
        ["9. Guardar Conversaci\u00f3n", "HTTP Request", "POST a Supabase: insertar en conversations (inbound + outbound)"],
        ["10. Actualizar Lead", "HTTP Request", "PATCH a Supabase: actualizar status y notes seg\u00fan calificaci\u00f3n"],
      ]
    ),
    body(""),
    heading("6.2 Workflow: Follow-up Autom\u00e1tico", HeadingLevel.HEADING_2),
    body("Se ejecuta cada 24 horas v\u00eda Schedule Trigger. Busca leads calificados sin contacto reciente y env\u00eda un seguimiento."),
    makeTable(
      ["Nodo", "Tipo", "Descripci\u00f3n"],
      [
        ["1. Schedule Trigger", "Schedule", "Se ejecuta cada 24 horas"],
        ["2. Buscar Leads", "HTTP Request", "GET leads?status=eq.calificado&last_contact_at=lt.hace_3_dias"],
        ["3. Generar Follow-up", "HTTP Request", "POST a OpenRouter: generar mensaje de seguimiento personalizado"],
        ["4. Enviar WhatsApp", "HTTP Request", "POST a Evolution API: enviar follow-up"],
        ["5. Guardar Conversaci\u00f3n", "HTTP Request", "POST a Supabase: registrar follow-up en conversations"],
        ["6. Actualizar Lead", "HTTP Request", "PATCH leads: actualizar last_contact_at"],
      ]
    ),
    body(""),
    heading("6.3 Workflow: Agente Prospector", HeadingLevel.HEADING_2),
    body("Se activa manualmente con par\u00e1metros de ciudad y tipo de negocio, o v\u00eda Schedule para prospecci\u00f3n peri\u00f3dica."),
    makeTable(
      ["Nodo", "Tipo", "Descripci\u00f3n"],
      [
        ["1. Trigger", "Manual / Schedule", "Par\u00e1metros: ciudad, tipo_negocio, filtro_web"],
        ["2. Buscar Google Maps", "HTTP Request", "GET Google Places API: textsearch con query"],
        ["3. Obtener Detalles", "HTTP Request (Loop)", "GET Google Places API: details por cada place_id"],
        ["4. Filtrar Duplicados", "Code", "Verificar contra tabla prospects en Supabase"],
        ["5. Guardar Prospects", "HTTP Request", "POST a Supabase: insertar en prospects"],
        ["6. Scrapear Web", "HTTP Request", "Cloudflare Worker o Puppeteer para extraer contenido"],
        ["7. Analizar con LLM", "HTTP Request", "POST a OpenRouter: an\u00e1lisis + correo + prompt imagen"],
        ["8. Generar Imagen", "HTTP Request", "POST a OpenRouter/DALL-E: generar imagen de propuesta"],
        ["9. Enviar Correo", "HTTP Request", "POST a Resend: enviar propuesta con imagen"],
        ["10. Enviar WhatsApp", "HTTP Request", "POST a Evolution API: mensaje breve de introducci\u00f3n"],
        ["11. Crear Lead", "HTTP Request", "POST a Supabase: crear lead con status 'propuesta_enviada'"],
        ["12. Actualizar Prospect", "HTTP Request", "PATCH prospects: proposal_sent=true, lead_id=nuevo"],
      ]
    ),
  );

  // ===== SECTION 7: CONFIGURACI\u00d3N LLM =====
  children.push(
    heading("7. Configuraci\u00f3n del LLM"),
    body("El LLM es el componente central de inteligencia del sistema. Se accede v\u00eda OpenRouter, que act\u00faa como gateway unificado para m\u00faltiples modelos. A continuaci\u00f3n se detalla la configuraci\u00f3n y los modelos recomendados."),
    heading("7.1 Endpoint y Autenticaci\u00f3n", HeadingLevel.HEADING_2),
    codeBlock("URL: https://openrouter.ai/api/v1/chat/completions"),
    codeBlock("Header: Authorization: Bearer TU_OPENROUTER_KEY"),
    codeBlock("Header: Content-Type: application/json"),
    heading("7.2 Modelos Recomendados", HeadingLevel.HEADING_2),
    makeTable(
      ["Modelo", "Precio", "Uso Recomendado"],
      [
        ["google/gemini-2.0-flash-001", "Gratis / muy barato", "Agente WhatsApp (alta frecuencia, respuestas r\u00e1pidas)"],
        ["anthropic/claude-3.5-haiku", "Barato", "An\u00e1lisis de prospecci\u00f3n (mayor precisi\u00f3n)"],
        ["openai/gpt-4o-mini", "Barato", "Generaci\u00f3n de correos y propuestas"],
        ["openai/dall-e-3", "Pago por imagen", "Generaci\u00f3n de im\u00e1genes de propuesta"],
      ]
    ),
    body(""),
    heading("7.3 Formato de Request", HeadingLevel.HEADING_2),
    codeBlock("{"),
    codeBlock('  "model": "google/gemini-2.0-flash-001",'),
    codeBlock('  "messages": ['),
    codeBlock('    {"role": "system", "content": "SYSTEM_PROMPT_AQUI"},'),
    codeBlock('    {"role": "user", "content": "Mensaje del prospecto + historial"}'),
    codeBlock('  ],'),
    codeBlock('  "temperature": 0.7,'),
    codeBlock('  "max_tokens": 500'),
    codeBlock("}"),
  );

  // ===== SECTION 8: ROADMAP =====
  children.push(
    heading("8. Roadmap de Implementaci\u00f3n"),
    body("El plan de implementaci\u00f3n se divide en 4 semanas, priorizando primero el agente de WhatsApp (valor inmediato) y luego el agente prospector (crecimiento escalable)."),
    makeTable(
      ["Semana", "Objetivo", "Tareas", "Horas Est."],
      [
        ["Semana 1", "Infraestructura + WhatsApp b\u00e1sico", "Instalar n8n + Evolution API + conectar WhatsApp + Supabase + tablas + flujo b\u00e1sico de respuesta", "8-10h"],
        ["Semana 2", "Agente WhatsApp completo", "System prompt optimizado + calificaci\u00f3n + CRM + follow-up autom\u00e1tico + pruebas", "8-10h"],
        ["Semana 3", "Agente Prospector", "Google Places API + scraping + an\u00e1lisis con LLM + generaci\u00f3n de propuestas + im\u00e1genes", "10-12h"],
        ["Semana 4", "Dashboard + integraci\u00f3n", "Dashboard Next.js + m\u00e9tricas + conectar ambos agentes + pruebas end-to-end + deploy", "8-10h"],
      ]
    ),
    body(""),
  );

  // ===== SECTION 9: PROMPT MAESTRO =====
  children.push(
    heading("9. Prompt Maestro para Construir el Sistema"),
    body("A continuaci\u00f3n se presenta el prompt maestro que puedes usar para pedirle a cualquier IA (Claude, GPT, Gemini, Cursor, etc.) que construya partes espec\u00edficas del sistema. Copia y pega seg\u00fan lo que necesites construir."),
    accentLine(),
    heading("9.1 Prompt: Configurar Infraestructura Base", HeadingLevel.HEADING_2),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "Necesito configurar la infraestructura base para un sistema de agentes de IA de ventas. Crea un docker-compose.yml que incluya: (1) n8n en puerto 5678 con volumen persistente, (2) Evolution API en puerto 8080 con MongoDB, (3) configuraci\u00f3n de red entre contenedores. Tambi\u00e9n necesito los comandos curl para: crear una instancia de WhatsApp en Evolution API, obtener el QR de vinculaci\u00f3n, y configurar el webhook hacia n8n. Todo debe funcionar en un servidor Ubuntu con Docker.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    body(""),
    heading("9.2 Prompt: Crear Workflow WhatsApp CRM en n8n", HeadingLevel.HEADING_2),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "Crea un workflow de n8n (formato JSON exportable) para un agente de WhatsApp CRM con estos nodos: (1) Webhook que recibe mensajes de Evolution API (POST, path /whatsapp-in), (2) Code node que extrae tel\u00e9fono y mensaje del JSON de Evolution API (formato Baileys: key.remoteJid, message.conversation), (3) HTTP Request que busca el lead en Supabase (GET /rest/v1/leads?phone=eq.XXX con apikey y Authorization), (4) IF node: si no existe el lead, crea uno nuevo con POST, (5) HTTP Request que carga las \u00faltimas 10 conversaciones del lead, (6) HTTP Request que consulta OpenRouter API (model: google/gemini-2.0-flash-001) con el system prompt del agente + historial + mensaje nuevo, (7) Code node que parsea la respuesta del LLM y extrae el texto visible y el LEAD_STATUS interno, (8) HTTP Request que env\u00eda la respuesta por WhatsApp v\u00eda Evolution API (POST /message/sendText/instance-name con number y text), (9) HTTP Request que guarda la conversaci\u00f3n en Supabase, (10) HTTP Request que actualiza el estado del lead. Variables de entorno: SUPABASE_URL, SUPABASE_KEY, OPENROUTER_KEY, EVOLUTION_API_KEY, EVOLUTION_URL.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    body(""),
    heading("9.3 Prompt: Crear Workflow Prospector en n8n", HeadingLevel.HEADING_2),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "Crea un workflow de n8n (formato JSON exportable) para un agente prospector que busca negocios en Google Maps y les env\u00eda propuestas autom\u00e1ticas. Nodos: (1) Manual Trigger con campos: ciudad (text), tipo_negocio (text), solo_sin_web (boolean), (2) HTTP Request a Google Places Text Search API, (3) SplitInBatches para procesar cada resultado, (4) HTTP Request a Google Places Details API para cada place_id, (5) Code node que filtra duplicados comparando con Supabase prospects table, (6) HTTP Request que guarda nuevos prospects en Supabase, (7) IF node: si tiene website, proceder a scraping, (8) HTTP Request a Cloudflare Worker para scraping (POST con URL del sitio), (9) HTTP Request a OpenRouter con system prompt de an\u00e1lisis (model: anthropic/claude-3.5-haiku) que devuelve JSON con: analysis, opportunities, email (subject + body), image_prompt, (10) HTTP Request a OpenRouter Images API para generar imagen con el prompt, (11) HTTP Request a Resend API para enviar correo con la propuesta, (12) HTTP Request a Evolution API para enviar mensaje WhatsApp de introducci\u00f3n, (13) HTTP Request que crea un lead en Supabase con status 'propuesta_enviada', (14) HTTP Request que actualiza el prospect con proposal_sent=true. Variables: GOOGLE_API_KEY, SUPABASE_URL, SUPABASE_KEY, OPENROUTER_KEY, RESEND_KEY, EVOLUTION_API_KEY, EVOLUTION_URL, SCRAPER_WORKER_URL.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    body(""),
    heading("9.4 Prompt: Dashboard Next.js", HeadingLevel.HEADING_2),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "Crea una p\u00e1gina de dashboard en Next.js (App Router, TypeScript, Tailwind CSS) que muestre m\u00e9tricas del CRM de agentes de IA. La p\u00e1gina debe conectarse a Supabase usando @supabase/supabase-js y mostrar: (1) Tarjetas de resumen: total leads, leads por estado (nuevo, calificado, propuesta_enviada, en_negociacion, cliente, perdido), propuestas enviadas este mes, tasa de conversi\u00f3n, (2) Tabla de leads recientes con nombre, tel\u00e9fono, negocio, estado, fuente, \u00faltimo contacto, (3) Tabla de \u00faltimas conversaciones con canal, direcci\u00f3n, preview del mensaje, si fue generado por IA, (4) Gr\u00e1fico simple de leads creados por d\u00eda (7 d\u00edas), (5) Bot\u00f3n para disparar manualmente el agente prospector (abrir modal con campos ciudad y tipo_negocio, que haga POST a un endpoint /api/prospect). Usa el cliente de Supabase del lado del servidor. Dise\u00f1o: tema oscuro con acentos esmeralda, similar al dise\u00f1o de CMOR Protocol.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
    body(""),
    heading("9.5 Prompt: Scraper Cloudflare Worker", HeadingLevel.HEADING_2),
    new Paragraph({
      spacing: { line: 312 },
      shading: { type: ShadingType.CLEAR, fill: "F1F5F9" },
      indent: { left: 360, right: 360 },
      children: [
        new TextRun({
          text: "Crea un Cloudflare Worker en TypeScript que reciba una URL por POST (JSON con campo 'url'), haga fetch de la p\u00e1gina, extraiga el contenido \u00fatil (t\u00edtulo, meta description, headings h1-h3, texto de p\u00e1rrafos principales, links, si tiene WhatsApp button, si tiene formulario de contacto, velocidad de carga aproximada), y devuelva un JSON con el contenido estructurado. Maneja errores (timeout, URLs inv\u00e1lidas, sitios que bloquean bots). L\u00edmite: m\u00e1ximo 10 segundos de espera. El worker debe incluir un User-Agent que se identifique como 'CMOR-Bot/1.0'. Agrega tambi\u00e9n el wrangler.toml de configuraci\u00f3n.",
          size: 20, font: { ascii: "Consolas" }, color: P.body,
        }),
      ],
    }),
  );

  // ===== SECTION 10: SEGURIDAD =====
  children.push(
    heading("10. Consideraciones de Seguridad"),
    body("La seguridad es fundamental cuando se conectan agentes de IA a sistemas de negocio. A continuaci\u00f3n se detallan las medidas de seguridad que deben implementarse en cada capa del sistema."),
    bulletItem("API Keys: Nunca exponer API keys en el c\u00f3digo frontend. Usar variables de entorno en n8n y en el servidor. Para el dashboard Next.js, usar Supabase con RLS (Row Level Security) y service_role solo en el backend."),
    bulletItem("Rate Limiting: Implementar l\u00edmites de mensajes por lead (m\u00e1ximo 5 mensajes/d\u00eda sin respuesta). Evitar spam. Evolution API permite configurar delays entre mensajes."),
    bulletItem("Datos Sensibles: El agente nunca debe compartir datos de un lead con otro. Las conversaciones est\u00e1n aisladas por lead_id en Supabase."),
    bulletItem("Consentimiento: El primer mensaje del agente debe incluir opci\u00f3n de opt-out ('Responde STOP para dejar de recibir mensajes'). Evolution API permite bloquear n\u00fameros."),
    bulletItem("Logging: Todas las acciones del agente quedan registradas en conversations con ai_generated=true. Se puede auditar cualquier interacci\u00f3n."),
    bulletItem("Supabase RLS: Configurar Row Level Security en todas las tablas. El dashboard solo debe acceder v\u00eda service_role en rutas de API (backend), nunca exponer la key de servicio al cliente."),
    bulletItem("WhatsApp Business: Usar un n\u00famero dedicado para el agente, nunca el personal. Respetar las pol\u00edticas de WhatsApp Business sobre mensajes automatizados."),
  );

  return children;
}

// ── Document Assembly ──
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: P.body },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32, bold: true, color: P.primary },
        paragraph: { spacing: { before: 360, after: 160, line: 312 } },
      },
      heading2: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28, bold: true, color: P.primary },
        paragraph: { spacing: { before: 240, after: 120, line: 312 } },
      },
      heading3: {
        run: { font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 24, bold: true, color: P.primary },
        paragraph: { spacing: { before: 200, after: 100, line: 312 } },
      },
    },
  },
  numbering: { config: numberingConfig },
  sections: [
    // Cover section
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(),
    },
    // Body section
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ text: "CMOR Protocol \u2014 Especificaci\u00f3n de Agentes de IA", size: 16, color: P.secondary, italics: true }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: P.secondary }),
              ],
            }),
          ],
        }),
      },
      children: buildBody(),
    },
  ],
});

// ── Generate ──
const OUTPUT = "/home/z/my-project/download/CMOR_Protocol_Agentes_IA_Prompt_Maestro.docx";
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  console.log("Document generated:", OUTPUT);
});
