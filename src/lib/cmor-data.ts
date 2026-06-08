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
  image: string;
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
    heroSub: "Creamos sistemas de IA que se conectan a tus herramientas y hacen el trabajo solos: responden clientes, califican prospectos, analizan datos y protegen tu negocio. Tú supervisas, el agente ejecuta.",
    heroCta: "Agendar Consulta Gratis",
    heroSecondary: "Ver servicios",
    sectionServicesTitle: "Servicios",
    sectionServicesSub: "Desde agentes que atienden clientes hasta páginas web y plataformas completas. Todo lo que tu negocio necesita para crecer con tecnología.",
    sectionProcessTitle: "Cómo trabajamos",
    sectionProcessSub: "De tu problema a una solución funcionando en semanas, no meses.",
    processSteps: [
      { num: "01", title: "Escuchamos", desc: "Nos cuentas tu problema. Analizamos tus procesos actuales y encontramos dónde la IA puede hacer la diferencia." },
      { num: "02", title: "Diseñamos", desc: "Creamos el plan: qué hace el agente, qué herramientas necesita, cómo se conecta a lo que ya usas." },
      { num: "03", title: "Construimos", desc: "Desarrollamos, probamos y ponemos en marcha. Tu solución funcionando en 2-4 semanas." },
      { num: "04", title: "Mejoramos", desc: "Monitoreamos, ajustamos y optimizamos. Tu sistema aprende y mejora con el tiempo." },
    ],
    faqTitle: "Preguntas Frecuentes",
    faq: [
      { q: "¿Qué diferencia hay entre un chatbot y un agente de IA?", a: "Un chatbot solo responde preguntas que le programaste. Un agente de IA se conecta a tus sistemas (tu CRM, tu base de datos, tu email), toma decisiones y hace cosas. Por ejemplo: un cliente pregunta por su pedido, el agente busca en el sistema, le dice el estado y si hay retraso le genera un descuento automáticamente." },
      { q: "¿Cuánto tiempo toma tener un agente funcionando?", a: "La primera versión puede estar lista en 7 días. Un proyecto completo suele tomar entre 2 y 4 semanas. No necesitas cambiar toda tu infraestructura." },
      { q: "¿Es seguro conectar un agente a mis sistemas?", a: "Sí. Usamos servidores privados, encriptación de datos y cumplimos las leyes de protección de datos. Cada agente solo accede a lo que necesita, nada más." },
      { q: "¿Qué pasa si el agente se equivoca?", a: "Cada agente tiene reglas de seguridad. Si no está seguro de algo, lo pasa a una persona. Además, todas las acciones quedan registradas para que siempre sepas qué hizo." },
      { q: "¿Necesito alguien técnico en mi equipo?", a: "No. Nosotros nos encargamos de todo: crear, mantener y mejorar el sistema. Tú solo ves los resultados." },
      { q: "¿Cuánto cuesta?", a: "Depende de lo que necesites. Tenemos planes accesibles para pymes y soluciones a medida para empresas más grandes. La primera consulta es gratis." },
      { q: "¿Puedo empezar con algo pequeño y luego crecer?", a: "Exacto. Lo recomendamos: empieza con un agente en un proceso clave y ve agregando más. Todo es modular." },
      { q: "¿También hacen páginas web y tiendas online?", a: "Sí. Diseñamos páginas web, landing pages y tiendas online rápidas y modernas, optimizadas para convertir visitantes en clientes." },
    ],
    services: [
      // --- AGENTES ---
      {
        id: "atencion",
        icon: "Headphones",
        title: "Atención al Cliente con IA",
        desc: "Agentes que resuelven problemas de verdad, no solo responden preguntas.",
        gradient: "from-emerald-600 to-teal-600",
        image: "/services/atencion.png",
        details: [
          {
            id: "crm-agent",
            icon: "Database",
            title: "Agente Conectado a tu Sistema",
            desc: "Un agente que se conecta a tu sistema de clientes y a la información de tu empresa. Cuando alguien pregunta por su pedido, el agente busca, le dice el estado y si hay un retraso le genera un descuento automático. No es un bot que dice \"consulte su número de seguimiento\": es un sistema que actúa.",
            practicalUse: "Una tienda online recibe 200 consultas diarias sobre pedidos. El agente resuelve el 85% sin intervención humana, genera descuentos automáticos cuando hay demoras, y solo pasa los casos complicados al equipo.",
            targetClients: "Tiendas online, clínicas, empresas de logística",
          },
          {
            id: "devoluciones",
            icon: "RefreshCcw",
            title: "Gestión de Devoluciones Automática",
            desc: "El agente recibe la solicitud de devolución, revisa la política de tu empresa, genera la etiqueta de envío, actualiza el inventario y procesa el reembolso. Todo sin intervención humana y en minutos, no días.",
            practicalUse: "Una tienda online reduce el tiempo de procesar devoluciones de 48 horas a 15 minutos, mejorando la satisfacción del cliente y liberando al equipo de soporte.",
            targetClients: "Tiendas online, retail, marketplaces",
          },
        ],
      },
      {
        id: "preventa",
        icon: "Target",
        title: "Agentes de Venta (SDR con IA)",
        desc: "Califican prospectos automáticamente y solo te pasan los que valen la pena.",
        gradient: "from-amber-500 to-orange-600",
        image: "/services/preventa.png",
        details: [
          {
            id: "lead-filter",
            icon: "Filter",
            title: "Filtro Inteligente de Prospectos",
            desc: "El agente atiende las consultas que llegan por tu web, WhatsApp y redes sociales, hace preguntas clave (presupuesto, necesidad, timing) y solo agenda reunión con tu equipo de ventas si el prospecto cumple los criterios. Cada conversación queda registrada en tu sistema.",
            practicalUse: "Una inmobiliaria recibe 50 consultas al día. El agente filtra y solo pasa al vendedor los 8-10 prospectos con presupuesto real y zona compatible. Los vendedores dejan de perder tiempo con personas que no van a comprar.",
            targetClients: "Inmobiliarias, agencias, empresas de software, consultorías",
          },
          {
            id: "auditoria",
            icon: "Search",
            title: "Auditoría Pre-Venta Automática",
            desc: "Antes de la primera llamada, el agente analiza la web del prospecto, revisa su presencia digital y prepara un informe para el vendedor. Llega a la reunión con información real, no con preguntas genéricas.",
            practicalUse: "Una agencia de marketing usa el agente para auditar 30 prospectos al día. Cada vendedor recibe un resumen con: SEO, velocidad de carga, presencia en redes y oportunidades detectadas.",
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
        image: "/services/voz.png",
        details: [
          {
            id: "reservas",
            icon: "CalendarCheck",
            title: "Reservas y Citas por Teléfono",
            desc: "Un agente de voz que contesta llamadas de forma natural, entiende lo que la persona necesita, consulta la disponibilidad en tiempo real, confirma la cita y la registra en el sistema. Funciona 24/7, no se enferma y atiende varias llamadas a la vez.",
            practicalUse: "Un restaurante con 80 llamadas diarias de reserva. El agente las maneja todas, las anota en el sistema, y el personal se concentra en atender a los clientes en persona.",
            targetClients: "Restaurantes, clínicas, despachos de abogados",
          },
          {
            id: "urgencias",
            icon: "Zap",
            title: "Despacho de Servicios de Urgencia",
            desc: "Para empresas de servicios de emergencia (plomeros, cerrajeros, electricistas): el agente contesta la llamada, identifica el tipo de urgencia, verifica la zona de cobertura, asigna al técnico más cercano y confirma al cliente. Todo en menos de 2 minutos.",
            practicalUse: "Un servicio de cerrajería recibe llamadas a las 3 de la mañana. El agente atiende, identifica qué necesita el cliente, asigna al técnico de turno y confirma cuándo va a llegar.",
            targetClients: "Plomeros, cerrajeros, electricistas, servicios de emergencia",
          },
        ],
      },
      {
        id: "conocimiento",
        icon: "BookOpen",
        title: "Gestión del Conocimiento",
        desc: "Toda la información de tu empresa, accesible con preguntas simples.",
        gradient: "from-sky-600 to-blue-700",
        image: "/services/conocimiento.png",
        details: [
          {
            id: "onboarding",
            icon: "GraduationCap",
            title: "Agente de Capacitación",
            desc: "Un agente que lee todos los manuales y documentos de tu empresa (PDFs, Notion, Google Drive) y permite que cualquier persona haga preguntas en lenguaje normal. ¿Cómo pido vacaciones? ¿Cuál es el protocolo para X? Respuestas inmediatas basadas en la documentación real.",
            practicalUse: "Una empresa de 500 empleados reduce el tiempo de capacitación de 3 meses a 3 semanas. Los nuevos empleados resuelven el 90% de sus dudas con el agente sin tener que preguntar a compañeros.",
            targetClients: "Empresas medianas y grandes con mucha documentación o alta rotación de personal",
          },
          {
            id: "soporte-interno",
            icon: "Settings",
            title: "Soporte Técnico Interno con IA",
            desc: "El agente se conecta a los manuales técnicos y registros de problemas. Cuando alguien reporta un problema, el agente diagnostica, sugiere la solución paso a paso y si puede, la ejecuta directamente.",
            practicalUse: "Un equipo de TI recibe 300 tickets semanales. El agente resuelve automáticamente el 60% (reset de contraseñas, configuraciones comunes) y solo pasa los casos complejos a un humano.",
            targetClients: "Empresas con equipos de TI sobrecargados",
          },
        ],
      },
      {
        id: "datos",
        icon: "BarChart3",
        title: "Análisis de Datos",
        desc: "Pregúntale a tus datos en lenguaje normal. El agente analiza y responde.",
        gradient: "from-rose-600 to-pink-700",
        image: "/services/datos.png",
        details: [
          {
            id: "data-agent",
            icon: "LineChart",
            title: "Agente de Análisis",
            desc: "Un agente conectado a tus hojas de cálculo y herramientas de análisis. Le preguntas: \"¿Cuáles son los 3 productos que menos vendimos el mes pasado y por qué?\". El agente cruza datos numéricos con reseñas de clientes y te da una respuesta con contexto, no solo una tabla.",
            practicalUse: "Un gerente pregunta: \"¿Qué campaña tuvo mejor resultado el trimestre pasado?\". El agente analiza el gasto, las conversiones y las ventas, y responde con una comparación detallada en segundos.",
            targetClients: "Departamentos de marketing, directores, equipos de estrategia",
          },
          {
            id: "research",
            icon: "Microscope",
            title: "Agente de Investigación de Mercado",
            desc: "El agente monitorea noticias, redes sociales y reportes de la industria, detecta tendencias y genera informes automáticos con lo más importante. No reemplaza al analista: lo potencia con información que antes tardaba días en recopilar.",
            practicalUse: "Una empresa de consumo recibe un informe semanal automático que detecta cambios en las preferencias de los clientes basándose en redes sociales y datos de ventas.",
            targetClients: "Empresas de consumo, startups, equipos de estrategia",
          },
        ],
      },
      // --- SERVICIOS ADICIONALES ---
      {
        id: "marketing",
        icon: "Megaphone",
        title: "Marketing Digital con IA",
        desc: "Creamos tu contenido, tus campañas y tu presencia digital con herramientas de IA.",
        gradient: "from-orange-500 to-red-600",
        image: "/services/marketing.png",
        details: [
          {
            id: "redes",
            icon: "TrendingUp",
            title: "Automatización de Redes Sociales",
            desc: "Programamos la publicación de contenido en tus redes sociales y configuramos respuestas automáticas inteligentes. El sistema analiza las mejores horas para publicar y el tono adecuado para tu audiencia, manteniendo tu presencia activa sin que tengas que estar pendiente todo el día.",
            practicalUse: "Una tienda programa sus publicaciones de la semana y el sistema responde automáticamente preguntas sobre precios y disponibilidad en los comentarios, aumentando las ventas un 30%.",
            targetClients: "Tiendas, restaurantes, marcas personales, agencias",
          },
          {
            id: "contenido",
            icon: "Sparkles",
            title: "Creación de Contenido con IA",
            desc: "Generamos imágenes, videos, logos y material publicitario profesional usando IA. Sin necesidad de sesiones fotográficas costosas ni semanas de espera. Tú describes lo que necesitas y lo obtenemos en minutos.",
            practicalUse: "Una inmobiliaria genera imágenes realistas de interiores para departamentos en preventa, reduciendo costos de diseño gráfico en un 80%.",
            targetClients: "Inmobiliarias, agencias, startups, marcas de consumo",
          },
        ],
      },
      {
        id: "web",
        icon: "Globe",
        title: "Páginas Web y Landing Pages",
        desc: "Diseñamos sitios rápidos, modernos y optimizados para convertir visitantes en clientes.",
        gradient: "from-teal-600 to-cyan-700",
        image: "/services/web.png",
        details: [
          {
            id: "sitios",
            icon: "Layout",
            title: "Diseño Web que Convierte",
            desc: "Creamos páginas web que no solo se ven bien, sino que están diseñadas para que quien entre haga lo que tú quieres: comprar, agendar, contactar. Optimizamos la velocidad, la experiencia en móvil y el posicionamiento en Google para que tu página trabaje por ti las 24 horas.",
            practicalUse: "Una clínica renueva su web y duplica las citas agendadas online en 2 meses gracias a un diseño más claro y un proceso de reserva más simple.",
            targetClients: "Clínicas, tiendas, restaurantes, profesionales independientes",
          },
          {
            id: "landing",
            icon: "Rocket",
            title: "Landing Pages de Alto Impacto",
            desc: "Páginas de aterrizaje diseñadas para una campaña específica: lanzar un producto, captar leads, promover un evento. Diseño enfocado, sin distracciones, con métricas integradas para que sepas exactamente cuántos visitantes se convirtieron en clientes.",
            practicalUse: "Una empresa lanza un nuevo servicio y su landing page convierte el 12% de los visitantes en prospectos calificados, comparado con el 3% de su web anterior.",
            targetClients: "Empresas lanzando productos, agencias, startups",
          },
        ],
      },
      {
        id: "saas",
        icon: "Layers",
        title: "Desarrollo de Plataformas (SaaS)",
        desc: "Creamos aplicaciones web completas a medida para tu negocio.",
        gradient: "from-indigo-600 to-violet-700",
        image: "/services/saas.png",
        details: [
          {
            id: "apps",
            icon: "Code",
            title: "Aplicaciones Web a Medida",
            desc: "Desarrollamos plataformas web completas: desde un sistema de gestión interna hasta una plataforma que tus clientes usan directamente. Usamos tecnología moderna que permite lanzar rápido, escalar cuando creces y mantener costos razonables.",
            practicalUse: "Una empresa de logística lanza su plataforma de rastreo de envíos en 8 semanas, con panel de control para clientes y gestión interna para el equipo.",
            targetClients: "Empresas que necesitan un sistema propio, startups con producto digital",
          },
          {
            id: "integraciones",
            icon: "Puzzle",
            title: "Integraciones y Automatización",
            desc: "Conectamos las herramientas que ya usas para que trabajen juntas: tu CRM con tu email, tu facturación con tu inventario, tu WhatsApp con tu sistema de ventas. Cuando los datos fluyen solos, tú ahorras horas de trabajo manual.",
            practicalUse: "Al recibir un pedido, el sistema automáticamente: lo registra en el inventario, envía la factura, notifica al equipo de envío y confirma al cliente. Cero intervención manual.",
            targetClients: "Empresas que usan muchas herramientas desconectadas entre sí",
          },
        ],
      },
      {
        id: "ciberseguridad",
        icon: "Shield",
        title: "Ciberseguridad con IA",
        desc: "Protegemos tu negocio de amenazas digitales con sistemas que detectan y responden solos.",
        gradient: "from-red-600 to-rose-700",
        image: "/services/ciberseguridad.png",
        details: [
          {
            id: "proteccion",
            icon: "ShieldCheck",
            title: "Protección Activa 24/7",
            desc: "Un sistema que monitorea tu infraestructura todo el tiempo, detecta patrones de ataque en milisegundos y activa defensas automáticas para neutralizar amenazas antes de que hagan daño. No esperas a que pase algo: el sistema previene.",
            practicalUse: "Un banco bloquea un intento de fraude porque el sistema detectó un patrón de acceso inusual que no correspondía al comportamiento normal del usuario.",
            targetClients: "Empresas que manejan datos sensibles, finanzas, salud, legal",
          },
          {
            id: "ia-local",
            icon: "Server",
            title: "IA en tus Servidores",
            desc: "Si necesitas privacidad total, desplegamos los modelos de IA en tus propios servidores. Ningún dato sale de tu empresa, no dependes de servicios externos, eliminas latencias y reduces costos de suscripción en la nube. Tu información se queda donde debe estar.",
            practicalUse: "Un bufete de abogados procesa documentos confidenciales en su propio servidor sin que ningún dato salga de la oficina, cumpliendo con las normas de confidencialidad.",
            targetClients: "Bufetes, hospitales, empresas con datos sensibles",
          },
        ],
      },
    ],
    footer: "Todos los derechos reservados.",
    footerTagline: "Agentes de IA autónomos para empresas que quieren escalar.",
    privacyTitle: "Política de Privacidad - CMOR Protocol",
    privacyUpdate: "Última actualización: Marzo 2026",
    privacyIntro: "En CMOR Protocol nos tomamos muy en serio la protección de tus datos personales. Esta Política explica cómo recopilamos, usamos y protegemos la información cuando usas nuestros servicios.",
    privacySections: [
      { t: "1. Información que Recopilamos", c: ["Datos personales: Nombre, email, teléfono (cuando te registras)", "Datos de uso: Interacciones con agentes, flujos de automatización", "Datos técnicos: IP, dispositivo, cookies para mejorar el servicio"] },
      { t: "2. Cómo Usamos tus Datos", c: ["Configurar y personalizar tus agentes de IA", "Automatizar flujos de trabajo", "Mejorar nuestros servicios de forma anónima", "Cumplir con las leyes de protección de datos aplicables"] },
      { t: "3. Compartir Datos", c: ["Nunca vendemos datos. Solo compartimos con proveedores necesarios para el servicio bajo acuerdos de confidencialidad."] },
      { t: "4. Seguridad", c: ["Servidores privados con encriptación", "Registro completo de todas las acciones de los agentes", "Permisos definidos por agente y por usuario"] },
      { t: "5. Tus Derechos", c: ["Acceso: Ver tus datos", "Rectificación: Corregir información errónea", "Eliminación: Borrar tus datos", "Oposición: Dejar de usar tus datos para marketing"] },
      { t: "6. Cookies", c: ["Usamos cookies funcionales. Puedes rechazarlas pero algunos servicios pueden no funcionar correctamente."] },
      { t: "7. Menores", c: ["Servicios para mayores de 18 años. No procesamos datos de menores."] },
      { t: "8. Cambios de Política", c: ["Te notificamos por email sobre cambios importantes."] },
    ],
    privacyFooter: "Aceptas esta política al usar CMOR Protocol.",
    privacyContact: "Contacto: privacidad@cmorprotocol.com",
    ctaSection: {
      title: "Tu primer agente puede estar funcionando en 7 días",
      subtitle: "Consulta gratuita. Sin compromiso.",
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
    heroSub: "We build AI systems that connect to your tools and do the work on their own: answer customers, qualify leads, analyze data, and protect your business. You supervise, the agent executes.",
    heroCta: "Book Free Consultation",
    heroSecondary: "See services",
    sectionServicesTitle: "Services",
    sectionServicesSub: "From customer service agents to websites and full platforms. Everything your business needs to grow with technology.",
    sectionProcessTitle: "How we work",
    sectionProcessSub: "From your problem to a working solution in weeks, not months.",
    processSteps: [
      { num: "01", title: "Listen", desc: "Tell us your problem. We analyze your current processes and find where AI can make a difference." },
      { num: "02", title: "Design", desc: "We create the plan: what the agent does, what tools it needs, how it connects to what you already use." },
      { num: "03", title: "Build", desc: "We develop, test, and launch. Your solution running in 2-4 weeks." },
      { num: "04", title: "Improve", desc: "We monitor, adjust, and optimize. Your system learns and gets better over time." },
    ],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "What's the difference between a chatbot and an AI agent?", a: "A chatbot only answers questions you programmed. An AI agent connects to your systems (your CRM, database, email), makes decisions, and takes action. For example: a customer asks about their order, the agent searches the system, gives them the status, and if there's a delay, generates a discount automatically." },
      { q: "How long does it take to have an agent running?", a: "The first version can be ready in 7 days. A complete project usually takes 2-4 weeks. You don't need to change your entire infrastructure." },
      { q: "Is it safe to connect an agent to my systems?", a: "Yes. We use private servers, data encryption, and comply with data protection laws. Each agent only accesses what it needs, nothing more." },
      { q: "What if the agent makes a mistake?", a: "Each agent has safety rules. If it's not sure about something, it hands it to a person. Plus, all actions are logged so you always know what it did." },
      { q: "Do I need someone technical on my team?", a: "No. We handle everything: creating, maintaining, and improving the system. You just see the results." },
      { q: "How much does it cost?", a: "It depends on what you need. We have accessible plans for small businesses and custom solutions for larger companies. The first consultation is free." },
      { q: "Can I start small and then grow?", a: "Exactly. We recommend it: start with one agent in a key process and add more over time. Everything is modular." },
      { q: "Do you also build websites and online stores?", a: "Yes. We design fast, modern websites and landing pages optimized to turn visitors into customers." },
    ],
    services: [
      {
        id: "atencion",
        icon: "Headphones",
        title: "AI Customer Service",
        desc: "Agents that solve real problems, not just answer questions.",
        gradient: "from-emerald-600 to-teal-600",
        image: "/services/atencion.png",
        details: [
          {
            id: "crm-agent",
            icon: "Database",
            title: "Agent Connected to Your System",
            desc: "An agent that connects to your customer system and company information. When someone asks about their order, the agent searches, tells them the status, and if there's a delay, generates an automatic discount. It's not a bot that says \"check your tracking number\": it's a system that acts.",
            practicalUse: "An online store receives 200 daily order inquiries. The agent resolves 85% without human intervention, generates automatic discounts for delays, and only passes complicated cases to the team.",
            targetClients: "Online stores, clinics, logistics companies",
          },
          {
            id: "devoluciones",
            icon: "RefreshCcw",
            title: "Automatic Returns Management",
            desc: "The agent receives the return request, checks your company policy, generates the shipping label, updates inventory, and processes the refund. All without human intervention and in minutes, not days.",
            practicalUse: "An online store reduces return processing time from 48 hours to 15 minutes, improving customer satisfaction and freeing up the support team.",
            targetClients: "Online stores, retail, marketplaces",
          },
        ],
      },
      {
        id: "preventa",
        icon: "Target",
        title: "Sales Agents (AI SDR)",
        desc: "Automatically qualify prospects and only pass you the ones worth your time.",
        gradient: "from-amber-500 to-orange-600",
        image: "/services/preventa.png",
        details: [
          {
            id: "lead-filter",
            icon: "Filter",
            title: "Smart Prospect Filter",
            desc: "The agent handles incoming queries from your website, WhatsApp, and social media, asks key questions (budget, need, timing), and only schedules a meeting with your sales team if the prospect meets the criteria. Every conversation is recorded in your system.",
            practicalUse: "A real estate agency receives 50 daily inquiries. The agent filters and only passes the 8-10 prospects with real budget and compatible zone to the salesperson. Salespeople stop wasting time with people who won't buy.",
            targetClients: "Real estate, agencies, software companies, consultancies",
          },
          {
            id: "auditoria",
            icon: "Search",
            title: "Automated Pre-Sale Audit",
            desc: "Before the first call, the agent analyzes the prospect's website, reviews their digital presence, and prepares a report for the salesperson. Arrive at the meeting with real information, not generic questions.",
            practicalUse: "A marketing agency uses the agent to audit 30 prospects daily. Each salesperson receives a summary with: SEO, load speed, social media presence, and detected opportunities.",
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
        image: "/services/voz.png",
        details: [
          {
            id: "reservas",
            icon: "CalendarCheck",
            title: "Phone Reservations & Appointments",
            desc: "A voice agent that answers calls naturally, understands what the person needs, checks real-time availability, confirms the appointment, and registers it in the system. Works 24/7, never gets sick, and handles multiple calls at once.",
            practicalUse: "A restaurant with 80 daily reservation calls. The voice agent handles them all, logs them in the system, and staff focuses on in-person service.",
            targetClients: "Restaurants, clinics, law firms",
          },
          {
            id: "urgencias",
            icon: "Zap",
            title: "Emergency Service Dispatch",
            desc: "For emergency service companies (plumbers, locksmiths, electricians): the agent answers the call, identifies the type of emergency, verifies coverage area, assigns the nearest technician, and confirms with the customer. All in under 2 minutes.",
            practicalUse: "A locksmith service receives calls at 3 AM. The agent answers, identifies what the customer needs, assigns the on-duty technician, and confirms the estimated arrival time.",
            targetClients: "Plumbers, locksmiths, electricians, emergency services",
          },
        ],
      },
      {
        id: "conocimiento",
        icon: "BookOpen",
        title: "Knowledge Management",
        desc: "All your company's information, accessible with simple questions.",
        gradient: "from-sky-600 to-blue-700",
        image: "/services/conocimiento.png",
        details: [
          {
            id: "onboarding",
            icon: "GraduationCap",
            title: "Training Agent",
            desc: "An agent that reads all your company's manuals and documents (PDFs, Notion, Google Drive) and lets anyone ask questions in normal language. How do I request vacation? What's the protocol for X? Instant answers based on real documentation.",
            practicalUse: "A company of 500 employees reduces training time from 3 months to 3 weeks. New employees resolve 90% of their questions with the agent without having to ask colleagues.",
            targetClients: "Medium and large companies with lots of documentation or high staff turnover",
          },
          {
            id: "soporte-interno",
            icon: "Settings",
            title: "Internal Tech Support with AI",
            desc: "The agent connects to technical manuals and problem records. When someone reports an issue, the agent diagnoses, suggests a step-by-step solution, and if possible, executes the fix directly.",
            practicalUse: "An IT team receives 300 weekly tickets. The agent automatically resolves 60% (password resets, common configurations) and only passes complex cases to a human.",
            targetClients: "Companies with overloaded IT teams",
          },
        ],
      },
      {
        id: "datos",
        icon: "BarChart3",
        title: "Data Analysis",
        desc: "Ask your data in normal language. The agent analyzes and responds.",
        gradient: "from-rose-600 to-pink-700",
        image: "/services/datos.png",
        details: [
          {
            id: "data-agent",
            icon: "LineChart",
            title: "Analysis Agent",
            desc: "An agent connected to your spreadsheets and analysis tools. Ask: \"What are the 3 worst-selling products last month and why?\" The agent cross-references numbers with customer reviews and gives you an answer with context, not just a table.",
            practicalUse: "A manager asks: \"Which campaign had the best results last quarter?\" The agent analyzes spend, conversions, and sales, and responds with a detailed comparison in seconds.",
            targetClients: "Marketing departments, directors, strategy teams",
          },
          {
            id: "research",
            icon: "Microscope",
            title: "Market Research Agent",
            desc: "The agent monitors news, social media, and industry reports, detects trends, and generates automatic reports with the most important findings. It doesn't replace the analyst: it empowers them with information that used to take days to compile.",
            practicalUse: "A consumer goods company receives an automatic weekly report that detects changes in customer preferences based on social media and sales data.",
            targetClients: "Consumer goods companies, startups, strategy teams",
          },
        ],
      },
      {
        id: "marketing",
        icon: "Megaphone",
        title: "AI Digital Marketing",
        desc: "We create your content, campaigns, and digital presence with AI tools.",
        gradient: "from-orange-500 to-red-600",
        image: "/services/marketing.png",
        details: [
          {
            id: "redes",
            icon: "TrendingUp",
            title: "Social Media Automation",
            desc: "We schedule your content across social media and set up smart automatic responses. The system analyzes the best times to post and the right tone for your audience, keeping your presence active without you having to be on top of it all day.",
            practicalUse: "A store schedules its weekly posts and the system automatically answers questions about prices and availability in comments, increasing sales by 30%.",
            targetClients: "Stores, restaurants, personal brands, agencies",
          },
          {
            id: "contenido",
            icon: "Sparkles",
            title: "AI Content Creation",
            desc: "We generate professional images, videos, logos, and advertising materials using AI. No expensive photo shoots or weeks of waiting. You describe what you need and we deliver in minutes.",
            practicalUse: "A real estate agency generates realistic interior images for pre-sale apartments, reducing graphic design costs by 80%.",
            targetClients: "Real estate, agencies, startups, consumer brands",
          },
        ],
      },
      {
        id: "web",
        icon: "Globe",
        title: "Websites & Landing Pages",
        desc: "We design fast, modern sites optimized to turn visitors into customers.",
        gradient: "from-teal-600 to-cyan-700",
        image: "/services/web.png",
        details: [
          {
            id: "sitios",
            icon: "Layout",
            title: "Web Design that Converts",
            desc: "We create websites that not only look good but are designed so visitors do what you want: buy, book, contact. We optimize speed, mobile experience, and Google positioning so your page works for you 24/7.",
            practicalUse: "A clinic redesigns their website and doubles online appointments in 2 months thanks to a clearer design and simpler booking process.",
            targetClients: "Clinics, stores, restaurants, independent professionals",
          },
          {
            id: "landing",
            icon: "Rocket",
            title: "High-Impact Landing Pages",
            desc: "Landing pages designed for a specific campaign: launching a product, capturing leads, promoting an event. Focused design, no distractions, with integrated metrics so you know exactly how many visitors became customers.",
            practicalUse: "A company launches a new service and their landing page converts 12% of visitors into qualified prospects, compared to 3% with their previous website.",
            targetClients: "Companies launching products, agencies, startups",
          },
        ],
      },
      {
        id: "saas",
        icon: "Layers",
        title: "Platform Development (SaaS)",
        desc: "We build complete custom web applications for your business.",
        gradient: "from-indigo-600 to-violet-700",
        image: "/services/saas.png",
        details: [
          {
            id: "apps",
            icon: "Code",
            title: "Custom Web Applications",
            desc: "We develop complete web platforms: from an internal management system to a platform your customers use directly. We use modern technology that allows fast launches, scaling as you grow, and keeping costs reasonable.",
            practicalUse: "A logistics company launches its shipment tracking platform in 8 weeks, with a control panel for customers and internal management for the team.",
            targetClients: "Companies that need their own system, startups with digital products",
          },
          {
            id: "integraciones",
            icon: "Puzzle",
            title: "Integrations & Automation",
            desc: "We connect the tools you already use so they work together: your CRM with your email, your billing with your inventory, your WhatsApp with your sales system. When data flows on its own, you save hours of manual work.",
            practicalUse: "When receiving an order, the system automatically: logs it in inventory, sends the invoice, notifies the shipping team, and confirms to the customer. Zero manual intervention.",
            targetClients: "Companies using many disconnected tools",
          },
        ],
      },
      {
        id: "ciberseguridad",
        icon: "Shield",
        title: "AI Cybersecurity",
        desc: "We protect your business from digital threats with systems that detect and respond on their own.",
        gradient: "from-red-600 to-rose-700",
        image: "/services/ciberseguridad.png",
        details: [
          {
            id: "proteccion",
            icon: "ShieldCheck",
            title: "24/7 Active Protection",
            desc: "A system that monitors your infrastructure around the clock, detects attack patterns in milliseconds, and activates automatic defenses to neutralize threats before they cause damage. You don't wait for something to happen: the system prevents it.",
            practicalUse: "A bank blocks a fraud attempt because the system detected an unusual access pattern that didn't match the user's normal behavior.",
            targetClients: "Companies handling sensitive data, finance, healthcare, legal",
          },
          {
            id: "ia-local",
            icon: "Server",
            title: "AI on Your Servers",
            desc: "If you need total privacy, we deploy AI models on your own servers. No data leaves your company, no dependency on external services, eliminated latency, and reduced cloud subscription costs. Your information stays where it should be.",
            practicalUse: "A law firm processes confidential documents on their own server without any data leaving the office, complying with confidentiality standards.",
            targetClients: "Law firms, hospitals, companies with sensitive data",
          },
        ],
      },
    ],
    footer: "All rights reserved.",
    footerTagline: "Autonomous AI agents for companies that want to scale.",
    privacyTitle: "Privacy Policy - CMOR Protocol",
    privacyUpdate: "Last updated: March 2026",
    privacyIntro: "At CMOR Protocol, we take the protection of your personal data very seriously. This Policy explains how we collect, use, and protect information when you use our services.",
    privacySections: [
      { t: "1. Information We Collect", c: ["Personal data: Name, email, phone (when you register)", "Usage data: Agent interactions, automation flows", "Technical data: IP, device, cookies to improve service"] },
      { t: "2. How We Use Your Data", c: ["Configure and personalize your AI agents", "Automate workflows", "Improve our services anonymously", "Comply with applicable data protection laws"] },
      { t: "3. Sharing Data", c: ["We never sell data. We only share with necessary service providers under confidentiality agreements."] },
      { t: "4. Security", c: ["Private servers with encryption", "Complete log of all agent actions", "Permissions defined per agent and per user"] },
      { t: "5. Your Rights", c: ["Access: See your data", "Rectification: Correct wrong information", "Deletion: Delete your data", "Opposition: Stop using your data for marketing"] },
      { t: "6. Cookies", c: ["We use functional cookies. You can reject them but some services might not work properly."] },
      { t: "7. Minors", c: ["Services for adults 18+. We don't process minors' data."] },
      { t: "8. Policy Changes", c: ["We notify you by email about important changes."] },
    ],
    privacyFooter: "You accept this policy by using CMOR Protocol.",
    privacyContact: "Contact: privacy@cmorprotocol.com",
    ctaSection: {
      title: "Your first agent can be running in 7 days",
      subtitle: "Free consultation. No commitment.",
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
