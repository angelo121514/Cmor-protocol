// --- Types ---
export interface ServiceDetail {
  id: string;
  icon: string;
  title: string;
  desc: string;
  practicalUse: string;
  targetClients: string;
}

export interface ServiceCategory {
  id: string;
  icon: string;
  title: string;
  desc: string;
  gradient: string;
  details: ServiceDetail[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface SiteContent {
  brand: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSub: string;
  heroCta: string;
  heroSecondary: string;
  sectionServicesTitle: string;
  sectionServicesSub: string;
  sectionProcessTitle: string;
  sectionProcessSub: string;
  processSteps: { num: string; title: string; desc: string }[];
  faqTitle: string;
  faq: FAQItem[];
  services: ServiceCategory[];
  footer: string;
  footerTagline: string;
  privacyTitle: string;
  privacyUpdate: string;
  privacyIntro: string;
  privacySections: { t: string; c: string[] }[];
  privacyFooter: string;
  privacyContact: string;
  ctaSection: {
    title: string;
    subtitle: string;
    btn: string;
  };
  nav: {
    services: string;
    process: string;
    faq: string;
    contact: string;
  };
}

// --- Translations ---
export const TRANSLATIONS: Record<string, SiteContent> = {
  es: {
    brand: "CMOR",
    heroHeadline: "Agentes de IA que trabajan por ti.",
    heroHighlight: "No chatbots. Agentes autónomos.",
    heroSub: "Conectamos sistemas, automatizamos decisiones y ejecutamos acciones reales en tu negocio. CRM, email, bases de datos, WhatsApp: tus agentes lo hacen todo sin intervención humana.",
    heroCta: "Agendar Consulta",
    heroSecondary: "Ver cómo funciona",
    sectionServicesTitle: "Lo que hacemos",
    sectionServicesSub: "Creamos agentes de IA que no solo responden preguntas, sino que ejecutan tareas completas de forma autónoma, conectados a tus herramientas reales.",
    sectionProcessTitle: "Cómo funciona",
    sectionProcessSub: "De tu problema a un agente operativo en semanas, no meses.",
    processSteps: [
      { num: "01", title: "Diagnóstico", desc: "Analizamos tus procesos, identificamos cuellos de botella y definimos qué puede automatizar un agente." },
      { num: "02", title: "Arquitectura", desc: "Diseñamos el agente: qué herramientas necesita, qué decisiones toma, cómo se conecta a tus sistemas." },
      { num: "03", title: "Despliegue", desc: "Implementamos, probamos y ponemos en producción. Tu agente operativo en 2-4 semanas." },
      { num: "04", title: "Optimización", desc: "Monitoreamos, ajustamos y mejoramos continuamente. Tu agente aprende y evoluciona." },
    ],
    faqTitle: "Preguntas Frecuentes",
    faq: [
      { q: "¿Qué diferencia hay entre un chatbot y un agente de IA?", a: "Un chatbot solo responde preguntas predefinidas. Un agente de IA conecta a tus sistemas (CRM, email, base de datos), toma decisiones y ejecuta acciones de forma autónoma. Por ejemplo: un cliente pregunta por su pedido y el agente busca en la base de datos, le da el estado y, si hay retraso, genera un cupón de descuento automáticamente." },
      { q: "¿Cuánto tiempo toma implementar un agente?", a: "Nuestro roadmap completo va de 2 a 4 semanas. La fase 1 (agente básico operativo) puede estar lista en 7 días. No necesitas cambiar toda tu infraestructura." },
      { q: "¿Es seguro conectar un agente a mis sistemas?", a: "Totalmente. Usamos servidores privados, encriptación AES-256, y cumplimos la Ley 21.096 de Protección de Datos Personales de Chile. Cada agente opera con permisos granulares: solo accede a lo que necesita." },
      { q: "¿CMOR funciona para pymes chilenas?", a: "Estamos diseñados para el mercado chileno. Integramos Webpay, Khipu, SII, y conocemos los procesos locales. Si tienes WhatsApp Business y una web básica, ya puedes empezar." },
      { q: "¿Qué pasa si el agente comete un error?", a: "Cada agente tiene reglas de seguridad y supervisión humana configurables. Puedes definir umbrales de aprobación: si el agente no está seguro, escala a una persona. Además, todas las acciones quedan registradas con audit trail completo." },
      { q: "¿Necesito personal técnico para mantener los agentes?", a: "No. Nosotros nos encargamos del mantenimiento, monitoreo y optimización continua. Tú solo ves los resultados en tu dashboard." },
      { q: "¿Cuánto cuesta implementar un agente de IA?", a: "Depende de la complejidad. Tenemos planes desde UF 5 mensuales para agentes básicos, hasta soluciones enterprise personalizadas. La consulta diagnóstica es gratuita." },
      { q: "¿Puedo empezar con un agente y luego agregar más?", a: "Exacto. Recomendamos empezar con un agente en un proceso clave (ej: atención al cliente) y luego expandir. La arquitectura es modular, así que cada nuevo agente se conecta al ecosistema existente." },
    ],
    services: [
      {
        id: "atencion",
        icon: "Headphones",
        title: "Atención al Cliente Autónoma",
        desc: "Agentes que resuelven problemas reales, no solo responden preguntas.",
        gradient: "from-emerald-600 to-teal-600",
        details: [
          {
            id: "crm-agent",
            icon: "Database",
            title: "Agente CRM Conectado",
            desc: "Un agente que se conecta directamente a tu CRM (HubSpot, Salesforce) y a la base de conocimientos de tu empresa. Cuando un cliente consulta su pedido, el agente busca en la base de datos, entrega el estado en tiempo real y, si detecta un retraso, genera automáticamente un cupón de descuento como compensación. No es un bot que dice \"consulte su tracking\": es un sistema que actúa.",
            practicalUse: "Un e-commerce de ropa recibe 200 consultas diarias de estado de pedido. El agente resuelve el 85% sin intervención humana, genera cupones automáticos para retrasos, y solo escala los casos complejos al equipo.",
            targetClients: "E-commerce, clínicas, empresas de logística",
          },
          {
            id: "devoluciones",
            icon: "RefreshCcw",
            title: "Gestión de Devoluciones",
            desc: "El agente recibe la solicitud de devolución, verifica la política de la empresa, genera la etiqueta de envío por email, actualiza el inventario y procesa el reembolso. Todo sin intervención humana y en minutos, no días.",
            practicalUse: "Una tienda online reduce el tiempo de procesamiento de devoluciones de 48 horas a 15 minutos, mejorando la satisfacción del cliente y liberando al equipo de soporte.",
            targetClients: "E-commerce, retail, marketplaces",
          },
        ],
      },
      {
        id: "preventa",
        icon: "Target",
        title: "Agentes de Pre-Venta (SDR IA)",
        desc: "Califica leads automáticamente y solo pasa los viables a tu equipo humano.",
        gradient: "from-amber-500 to-orange-600",
        details: [
          {
            id: "lead-filter",
            icon: "Filter",
            title: "Filtro Inteligente de Leads",
            desc: "El agente atiende consultas entrantes desde tu web, WhatsApp e Instagram, hace preguntas de calificación (presupuesto, necesidad, timing) y solo agenda reunión con el vendedor humano si el lead cumple los criterios definidos. Cada conversación queda registrada y enriquecida en el CRM.",
            practicalUse: "Una inmobiliaria recibe 50 consultas diarias. El SDR IA filtra y solo pasa al agente humano los 8-10 leads con presupuesto y zona compatible. Los vendedores dejan de perder tiempo con curiosos.",
            targetClients: "Inmobiliarias, agencias de marketing, empresas SaaS, consultorías",
          },
          {
            id: "auditoria",
            icon: "Search",
            title: "Auditoría Pre-Venta Automática",
            desc: "Antes de la primera llamada, el agente analiza la web del prospecto, revisa su presencia digital, identifica oportunidades de mejora y prepara un mini-informe para el vendedor. Llega a la reunión con contexto real, no con preguntas genéricas.",
            practicalUse: "Una agencia de marketing digital usa el agente para auditar 30 prospectos al día. Cada vendedor recibe un resumen con: SEO actual, velocidad de carga, presencia en redes y oportunidades detectadas.",
            targetClients: "Agencias de marketing, consultorías, empresas de software",
          },
        ],
      },
      {
        id: "voz",
        icon: "Phone",
        title: "Agentes de Voz IA",
        desc: "Recepcionistas telefónicos que entienden, deciden y actúan en tiempo real.",
        gradient: "from-violet-600 to-purple-700",
        details: [
          {
            id: "reservas",
            icon: "CalendarCheck",
            title: "Reservas y Citas por Teléfono",
            desc: "Un agente de voz que contesta llamadas con lenguaje natural, entiende solicitudes de reserva, consulta disponibilidad en tiempo real, confirma la cita y la registra en el sistema. Funciona 24/7, no se enferma, no tiene malos días, y atiende llamadas simultáneas sin límite.",
            practicalUse: "Un restaurante con 80 llamadas diarias de reserva. El agente de voz las maneja todas, las anota en el sistema, y el personal solo se concentra en la atención presencial.",
            targetClients: "Restaurantes, clínicas dentales y médicas, despachos de abogados",
          },
          {
            id: "urgencias",
            icon: "Zap",
            title: "Despacho de Servicios de Urgencia",
            desc: "Para empresas de servicios de emergencia (fontaneros, cerrajeros, electricistas), el agente contesta la llamada, identifica el tipo de urgencia, verifica cobertura geográfica, asigna al técnico más cercano y confirma al cliente. Todo en menos de 2 minutos.",
            practicalUse: "Un servicio de cerrajería recibe llamadas a las 3 AM. El agente de voz atiende, identifica el tipo de servicio, asigna al técnico de turno y confirma la llegada estimada al cliente.",
            targetClients: "Fontaneros, cerrajeros, electricistas, servicios de urgencia",
          },
        ],
      },
      {
        id: "conocimiento",
        icon: "BookOpen",
        title: "Gestión del Conocimiento Interno",
        desc: "Toda la información de tu empresa, accesible en lenguaje natural para tu equipo.",
        gradient: "from-sky-600 to-blue-700",
        details: [
          {
            id: "onboarding",
            icon: "GraduationCap",
            title: "Agente de Onboarding",
            desc: "Un agente que procesa todos los manuales internos (PDFs, Notion, Confluence, Google Drive) y permite a cualquier empleado hacer preguntas en lenguaje natural. ¿Cómo pido vacaciones? ¿Cuál es el protocolo de seguridad para X máquina? Respuestas inmediatas basadas en la documentación real de la empresa usando RAG (Retrieval-Augmented Generation).",
            practicalUse: "Una empresa de 500 empleados reduce el tiempo de onboarding de 3 meses a 3 semanas. Los nuevos empleados resuelven el 90% de sus dudas con el agente sin molestar a compañeros.",
            targetClients: "Empresas medianas y grandes con alta rotación o documentación técnica extensa",
          },
          {
            id: "soporte-interno",
            icon: "Settings",
            title: "Soporte Técnico Interno IA",
            desc: "El agente se conecta a los runbooks, wikis técnicos y bases de datos de incidentes. Cuando un empleado reporta un problema, el agente diagnostica, sugiere la solución paso a paso y, si está dentro de sus permisos, ejecuta la corrección directamente.",
            practicalUse: "El equipo de TI de un banco recibe 300 tickets semanales. El agente resuelve automáticamente el 60% (reset de contraseñas, configuraciones comunes) y escala solo los casos complejos.",
            targetClients: "Empresas con equipos de TI sobrecargados, organizaciones con infraestructura compleja",
          },
        ],
      },
      {
        id: "datos",
        icon: "BarChart3",
        title: "Análisis de Datos e Investigación",
        desc: "Pregúntale a tus datos en lenguaje natural. El agente analiza y responde.",
        gradient: "from-rose-600 to-pink-700",
        details: [
          {
            id: "data-agent",
            icon: "LineChart",
            title: "Agente de Análisis de Datos",
            desc: "Un agente conectado a tus hojas de cálculo, bases de datos y herramientas de BI. Le preguntas en español: \"¿Cuáles son los 3 productos que menos vendimos el mes pasado y por qué según las reseñas?\". El agente cruza datos numéricos con reseñas de clientes y entrega una respuesta narrativa con contexto, no solo una tabla.",
            practicalUse: "Un gerente de marketing pregunta: \"¿Qué campaña tuvo mejor ROI el trimestre pasado?\". El agente analiza los datos de gasto, conversiones y revenue, y responde con una comparativa detallada en segundos.",
            targetClients: "Departamentos de marketing, directores generales, equipos de investigación",
          },
          {
            id: "research",
            icon: "Microscope",
            title: "Agente de Investigación de Mercado",
            desc: "El agente monitorea fuentes de datos (noticias, redes sociales, reportes de industria), detecta tendencias emergentes y genera informes automatizados con hallazgos clave. No reemplaza al analista: lo potencia con información procesada que antes tardaba días en recopilar.",
            practicalUse: "Una empresa de consumo masivo recibe un informe semanal automático que detecta cambios en preferencias de clientes basándose en datos de redes sociales y ventas cruzadas.",
            targetClients: "Empresas de consumo, startups, equipos de estrategia",
          },
        ],
      },
    ],
    footer: "Todos los derechos reservados.",
    footerTagline: "Agentes de IA autónomos para empresas que quieren escalar.",
    privacyTitle: "Política de Privacidad - CMOR Protocol",
    privacyUpdate: "Última actualización: Marzo 2026",
    privacyIntro: "En CMOR Protocol nos tomamos muy en serio la protección de tus datos personales. Esta Política explica cómo recopilamos, usamos y protegemos la información cuando usas nuestros servicios de agentes de IA y automatización.",
    privacySections: [
      { t: "1. Información que Recopilamos", c: ["Datos personales: Nombre, email, teléfono, RUT (cuando te registras)", "Datos de uso: Interacciones con agentes, flujos de automatización, generaciones IA", "Datos técnicos: IP, dispositivo, cookies para mejorar servicio"] },
      { t: "2. Cómo Usamos tus Datos", c: ["Configurar y personalizar tus agentes de IA", "Automatizar flujos (WhatsApp → CRM → Acción)", "Mejorar algoritmos de forma anónima", "Cumplir Ley 21.096 Protección Datos Personales"] },
      { t: "3. Compartir Datos", c: ["Nunca vendemos datos. Solo compartimos con proveedores necesarios para el servicio (CRM, hosting) bajo acuerdos de confidencialidad."] },
      { t: "4. Seguridad", c: ["Servidores privados con encriptación AES-256", "Audit trail completo de todas las acciones de agentes", "Permisos granulares por agente y por usuario"] },
      { t: "5. Tus Derechos (Ley 21.096)", c: ["Acceso: Ver tus datos", "Rectificación: Corregir info errónea", "Eliminación: Borrar datos (\"derecho al olvido\")", "Oposición: Dejar de usar para marketing"] },
      { t: "6. Cookies", c: ["Usamos cookies funcionales. Puedes rechazarlas pero algunos servicios pueden fallar."] },
      { t: "7. Menores", c: ["Servicios +18 años. No procesamos datos de niños."] },
      { t: "8. Cambios de Política", c: ["Te notificamos por email cambios importantes."] },
    ],
    privacyFooter: "Aceptas esta política al usar CMOR Protocol.",
    privacyContact: "Contacto: privacidad@cmorprotocol.cl | Dirección: Santiago, Chile",
    ctaSection: {
      title: "Tu primer agente puede estar operativo en 7 días",
      subtitle: "Consulta diagnóstica gratuita. Sin compromiso.",
      btn: "Hablar con un humano",
    },
    nav: {
      services: "Servicios",
      process: "Proceso",
      faq: "FAQ",
      contact: "Contacto",
    },
  },
  en: {
    brand: "CMOR",
    heroHeadline: "AI Agents that work for you.",
    heroHighlight: "Not chatbots. Autonomous agents.",
    heroSub: "We connect systems, automate decisions, and execute real actions in your business. CRM, email, databases, WhatsApp: your agents do it all without human intervention.",
    heroCta: "Book a Consultation",
    heroSecondary: "See how it works",
    sectionServicesTitle: "What we do",
    sectionServicesSub: "We build AI agents that don't just answer questions — they execute complete tasks autonomously, connected to your real tools.",
    sectionProcessTitle: "How it works",
    sectionProcessSub: "From your problem to an operational agent in weeks, not months.",
    processSteps: [
      { num: "01", title: "Diagnosis", desc: "We analyze your processes, identify bottlenecks, and define what an agent can automate." },
      { num: "02", title: "Architecture", desc: "We design the agent: what tools it needs, what decisions it makes, how it connects to your systems." },
      { num: "03", title: "Deployment", desc: "We implement, test, and go live. Your operational agent in 2-4 weeks." },
      { num: "04", title: "Optimization", desc: "We monitor, adjust, and improve continuously. Your agent learns and evolves." },
    ],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "What's the difference between a chatbot and an AI agent?", a: "A chatbot only answers predefined questions. An AI agent connects to your systems (CRM, email, database), makes decisions, and executes actions autonomously. For example: a customer asks about their order and the agent searches the database, gives them the status, and if there's a delay, automatically generates a discount coupon." },
      { q: "How long does it take to implement an agent?", a: "Our full roadmap takes 2-4 weeks. Phase 1 (basic operational agent) can be ready in 7 days. You don't need to change your entire infrastructure." },
      { q: "Is it safe to connect an agent to my systems?", a: "Absolutely. We use private servers, AES-256 encryption, and comply with Chile's Law 21.096 on Personal Data Protection. Each agent operates with granular permissions: it only accesses what it needs." },
      { q: "Does CMOR work for Chilean SMEs?", a: "We're designed for the Chilean market. We integrate Webpay, Khipu, SII, and understand local processes. If you have WhatsApp Business and a basic website, you can start now." },
      { q: "What if the agent makes a mistake?", a: "Each agent has configurable safety rules and human supervision. You can define approval thresholds: if the agent isn't sure, it escalates to a person. Plus, all actions are logged with a complete audit trail." },
      { q: "Do I need technical staff to maintain the agents?", a: "No. We handle maintenance, monitoring, and continuous optimization. You just see the results on your dashboard." },
      { q: "How much does it cost to implement an AI agent?", a: "It depends on complexity. We have plans starting from UF 5 monthly for basic agents, up to custom enterprise solutions. The diagnostic consultation is free." },
      { q: "Can I start with one agent and then add more?", a: "Exactly. We recommend starting with an agent in a key process (e.g., customer service) and then expanding. The architecture is modular, so each new agent connects to the existing ecosystem." },
    ],
    services: [
      {
        id: "atencion",
        icon: "Headphones",
        title: "Autonomous Customer Service",
        desc: "Agents that solve real problems, not just answer questions.",
        gradient: "from-emerald-600 to-teal-600",
        details: [
          {
            id: "crm-agent",
            icon: "Database",
            title: "Connected CRM Agent",
            desc: "An agent that connects directly to your CRM (HubSpot, Salesforce) and your company's knowledge base. When a customer asks about their order, the agent searches the database, delivers real-time status, and if it detects a delay, automatically generates a discount coupon as compensation. It's not a bot that says \"check your tracking\": it's a system that acts.",
            practicalUse: "An e-commerce store receives 200 daily order status inquiries. The agent resolves 85% without human intervention, generates automatic coupons for delays, and only escalates complex cases to the team.",
            targetClients: "E-commerce, clinics, logistics companies",
          },
          {
            id: "devoluciones",
            icon: "RefreshCcw",
            title: "Returns Management",
            desc: "The agent receives the return request, verifies company policy, generates the shipping label by email, updates inventory, and processes the refund. All without human intervention and in minutes, not days.",
            practicalUse: "An online store reduces return processing time from 48 hours to 15 minutes, improving customer satisfaction and freeing up the support team.",
            targetClients: "E-commerce, retail, marketplaces",
          },
        ],
      },
      {
        id: "preventa",
        icon: "Target",
        title: "Pre-Sale Agents (AI SDR)",
        desc: "Automatically qualify leads and only pass viable ones to your human team.",
        gradient: "from-amber-500 to-orange-600",
        details: [
          {
            id: "lead-filter",
            icon: "Filter",
            title: "Intelligent Lead Filter",
            desc: "The agent handles incoming queries from your website, WhatsApp, and Instagram, asks qualifying questions (budget, need, timing), and only schedules a meeting with a human salesperson if the lead meets defined criteria. Every conversation is recorded and enriched in the CRM.",
            practicalUse: "A real estate agency receives 50 daily inquiries. The AI SDR filters and only passes the 8-10 leads with compatible budget and zone to the human agent. Salespeople stop wasting time with browsers.",
            targetClients: "Real estate, marketing agencies, SaaS companies, consultancies",
          },
          {
            id: "auditoria",
            icon: "Search",
            title: "Automated Pre-Sale Audit",
            desc: "Before the first call, the agent analyzes the prospect's website, reviews their digital presence, identifies improvement opportunities, and prepares a mini-report for the salesperson. Arrive at the meeting with real context, not generic questions.",
            practicalUse: "A digital marketing agency uses the agent to audit 30 prospects daily. Each salesperson receives a summary with: current SEO, load speed, social media presence, and detected opportunities.",
            targetClients: "Marketing agencies, consultancies, software companies",
          },
        ],
      },
      {
        id: "voz",
        icon: "Phone",
        title: "AI Voice Agents",
        desc: "Phone receptionists that understand, decide, and act in real time.",
        gradient: "from-violet-600 to-purple-700",
        details: [
          {
            id: "reservas",
            icon: "CalendarCheck",
            title: "Phone Reservations & Appointments",
            desc: "A voice agent that answers calls with natural language, understands reservation requests, checks real-time availability, confirms the appointment, and registers it in the system. Works 24/7, never gets sick, never has bad days, and handles simultaneous calls without limits.",
            practicalUse: "A restaurant with 80 daily reservation calls. The voice agent handles them all, logs them in the system, and staff only focuses on in-person service.",
            targetClients: "Restaurants, dental and medical clinics, law firms",
          },
          {
            id: "urgencias",
            icon: "Zap",
            title: "Emergency Service Dispatch",
            desc: "For emergency service companies (plumbers, locksmiths, electricians), the agent answers the call, identifies the type of emergency, verifies geographic coverage, assigns the nearest technician, and confirms with the customer. All in under 2 minutes.",
            practicalUse: "A locksmith service receives calls at 3 AM. The voice agent answers, identifies the service type, assigns the on-duty technician, and confirms the estimated arrival time to the customer.",
            targetClients: "Plumbers, locksmiths, electricians, emergency services",
          },
        ],
      },
      {
        id: "conocimiento",
        icon: "BookOpen",
        title: "Internal Knowledge Management",
        desc: "All your company's information, accessible in natural language for your team.",
        gradient: "from-sky-600 to-blue-700",
        details: [
          {
            id: "onboarding",
            icon: "GraduationCap",
            title: "Onboarding Agent",
            desc: "An agent that processes all internal manuals (PDFs, Notion, Confluence, Google Drive) and allows any employee to ask questions in natural language. How do I request vacation? What's the safety protocol for X machine? Instant answers based on the company's real documentation using RAG (Retrieval-Augmented Generation).",
            practicalUse: "A company of 500 employees reduces onboarding time from 3 months to 3 weeks. New employees resolve 90% of their questions with the agent without bothering colleagues.",
            targetClients: "Medium and large companies with high turnover or extensive technical documentation",
          },
          {
            id: "soporte-interno",
            icon: "Settings",
            title: "Internal Technical Support AI",
            desc: "The agent connects to runbooks, technical wikis, and incident databases. When an employee reports a problem, the agent diagnoses, suggests step-by-step solutions, and if within its permissions, executes the fix directly.",
            practicalUse: "A bank's IT team receives 300 weekly tickets. The agent automatically resolves 60% (password resets, common configurations) and only escalates complex cases.",
            targetClients: "Companies with overloaded IT teams, organizations with complex infrastructure",
          },
        ],
      },
      {
        id: "datos",
        icon: "BarChart3",
        title: "Data Analysis & Research",
        desc: "Ask your data in natural language. The agent analyzes and responds.",
        gradient: "from-rose-600 to-pink-700",
        details: [
          {
            id: "data-agent",
            icon: "LineChart",
            title: "Data Analysis Agent",
            desc: "An agent connected to your spreadsheets, databases, and BI tools. Ask in plain English: \"What are the 3 worst-selling products last month and why according to reviews?\" The agent cross-references numerical data with customer reviews and delivers a narrative response with context, not just a table.",
            practicalUse: "A marketing manager asks: \"Which campaign had the best ROI last quarter?\" The agent analyzes spend, conversions, and revenue data, and responds with a detailed comparison in seconds.",
            targetClients: "Marketing departments, CEOs, research teams",
          },
          {
            id: "research",
            icon: "Microscope",
            title: "Market Research Agent",
            desc: "The agent monitors data sources (news, social media, industry reports), detects emerging trends, and generates automated reports with key findings. It doesn't replace the analyst: it empowers them with processed information that used to take days to compile.",
            practicalUse: "A consumer goods company receives an automatic weekly report that detects changes in customer preferences based on social media data and cross-referenced sales.",
            targetClients: "Consumer goods companies, startups, strategy teams",
          },
        ],
      },
    ],
    footer: "All rights reserved.",
    footerTagline: "Autonomous AI agents for companies that want to scale.",
    privacyTitle: "Privacy Policy - CMOR Protocol",
    privacyUpdate: "Last updated: March 2026",
    privacyIntro: "At CMOR Protocol, we take the protection of your personal data very seriously. This Policy explains how we collect, use, and protect information when you use our AI agent and automation services.",
    privacySections: [
      { t: "1. Information We Collect", c: ["Personal data: Name, email, phone, RUT (when registering)", "Usage data: Agent interactions, automation flows, AI generations", "Technical data: IP, device, cookies to improve service"] },
      { t: "2. How We Use Your Data", c: ["Configure and personalize your AI agents", "Automate flows (WhatsApp → CRM → Action)", "Improve algorithms anonymously", "Comply with Law 21.096 Personal Data Protection"] },
      { t: "3. Sharing Data", c: ["We never sell data. We only share with necessary service providers (CRM, hosting) under confidentiality agreements."] },
      { t: "4. Security", c: ["Private servers with AES-256 encryption", "Complete audit trail of all agent actions", "Granular permissions per agent and per user"] },
      { t: "5. Your Rights (Law 21.096)", c: ["Access: See your data", "Rectification: Correct wrong info", "Deletion: Delete data (\"right to be forgotten\")", "Opposition: Stop using for marketing"] },
      { t: "6. Cookies", c: ["We use functional cookies. You can reject them but some services might fail."] },
      { t: "7. Minors", c: ["Services for +18 years. We don't process children's data."] },
      { t: "8. Policy Changes", c: ["We notify you by email for important changes."] },
    ],
    privacyFooter: "You accept this policy by using CMOR Protocol.",
    privacyContact: "Contact: privacy@cmorprotocol.cl | Address: Santiago, Chile",
    ctaSection: {
      title: "Your first agent can be operational in 7 days",
      subtitle: "Free diagnostic consultation. No commitment.",
      btn: "Talk to a human",
    },
    nav: {
      services: "Services",
      process: "Process",
      faq: "FAQ",
      contact: "Contact",
    },
  },
};
