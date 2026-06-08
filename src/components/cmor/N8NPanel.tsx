"use client";
import React, { useState, useEffect } from 'react';
import { Settings, Play, Check, AlertCircle, Copy, FileText, Send, ChevronRight } from 'lucide-react';

const N8NPanel = ({ lang, isDarkMode }: { lang: string; isDarkMode: boolean }) => {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    const env = (import.meta as any).env;
    return localStorage.getItem('n8n_webhook_url') || (env?.VITE_N8N_URL ? `${env.VITE_N8N_URL}/webhook/cmor-lead` : '');
  });
  const [token, setToken] = useState(() => {
    const env = (import.meta as any).env;
    return localStorage.getItem('n8n_token') || env?.VITE_N8N_TOKEN || '';
  });
  const [payloadType, setPayloadType] = useState<'lead' | 'alert' | 'order'>('lead');
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [responseData, setResponseData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeNode, setActiveNode] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('n8n_webhook_url', webhookUrl);
  }, [webhookUrl]);

  useEffect(() => {
    localStorage.setItem('n8n_token', token);
  }, [token]);

  const PAYLOADS: Record<string, any> = {
    lead: {
      event: "new_lead",
      timestamp: new Date().toISOString(),
      source: "CMOR Landing Page",
      data: {
        name: "Sofía Martínez",
        email: "sofia.m@example.com",
        phone: "+56 9 8765 4321",
        company: "Innovación Retail SpA",
        service_requested: "Automatización de Tareas con n8n",
        message: "Hola, me interesa implementar flujos de trabajo inteligentes para conectar nuestro CRM con WhatsApp."
      }
    },
    alert: {
      event: "system_alert",
      timestamp: new Date().toISOString(),
      source: "CMOR Sentinel",
      data: {
        alert_id: "ALT-9082",
        service: "Database Sync Node",
        urgency: "HIGH",
        details: "Sincronización demorada por más de 120 segundos. Se requiere reintento automático.",
        recommended_action: "Trigger fallback AI scheduler node"
      }
    },
    order: {
      event: "new_order",
      timestamp: new Date().toISOString(),
      source: "E-Commerce Integrator",
      data: {
        order_id: "ORD-2026-904",
        customer: "Alejandro Silva",
        email: "a.silva@example.com",
        items: [
          { product: "Plan Consultoría IA Completo", quantity: 1, price: 1200000 }
        ],
        total: 1200000,
        payment_method: "Webpay Plus",
        status: "paid"
      }
    }
  };

  const handleRealTest = async () => {
    if (!webhookUrl) return;
    setTestStatus('sending');
    setErrorMessage('');
    setResponseData(null);
    
    // Animación de flujo
    let stage = 1;
    setActiveNode(1);
    const animInterval = setInterval(() => {
      stage += 1;
      if (stage <= 4) {
        setActiveNode(stage);
      } else {
        clearInterval(animInterval);
      }
    }, 800);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(PAYLOADS[payloadType])
      });

      clearInterval(animInterval);
      setActiveNode(0);
      
      if (response.ok) {
        const data = await response.json().catch(() => ({ status: 'success', message: 'Workflow triggered successfully' }));
        setResponseData(data);
        setTestStatus('success');
      } else {
        const text = await response.text();
        setErrorMessage(text || `Error status ${response.status}`);
        setTestStatus('error');
      }
    } catch (err: any) {
      clearInterval(animInterval);
      setActiveNode(0);
      setTestStatus('error');
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMessage('CORS_ERROR');
      } else {
        setErrorMessage(err.message || 'Unknown network error');
      }
    }
  };

  const handleSimulate = () => {
    setTestStatus('sending');
    setErrorMessage('');
    setResponseData(null);
    
    let stage = 1;
    setActiveNode(1);
    const animInterval = setInterval(() => {
      stage += 1;
      if (stage <= 4) {
        setActiveNode(stage);
      } else {
        clearInterval(animInterval);
        setActiveNode(0);
        setTestStatus('success');
        setResponseData({
          status: "success",
          workflow_id: "cmor_auto_sim_01",
          execution_id: `exec_${Math.floor(Math.random()*100000)}`,
          data: {
            client: PAYLOADS[payloadType].data.name || "Cliente de Prueba",
            ai_analysis: {
              qualified: true,
              score: 95,
              sentiment: "Positive / Highly Interested",
              extracted_keywords: ["CRM Sync", "WhatsApp Automation", "n8n"],
              auto_reply_sent: `Hola ${PAYLOADS[payloadType].data.name || "Cliente"}, gracias por escribirnos. Nuestro agente se contactará contigo para iniciar el Roadmap IA.`
            },
            integrations: {
              crm_registered: "HubSpot - Lead Created",
              slack_notified: "#sales-alerts - New qualified lead notified",
              whatsapp_scheduled: "Follow-up message queued"
            }
          }
        });
      }
    }, 850);
  };

  return (
    <div className={`mt-8 p-6 md:p-8 rounded-[2rem] border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/40 border-slate-800 text-white' 
        : 'bg-slate-50/80 border-slate-200 text-slate-900'
    }`}>
      <style>{`
        @keyframes n8n-shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .n8n-shimmer-bar {
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
          animation: n8n-shimmer 1.5s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
          <Workflow className="w-7 h-7 text-indigo-500 animate-pulse" />
          <h4 className="text-xl font-black tracking-tight">
            {lang === 'es' ? 'Probador de Integración n8n (En Vivo)' : 'Live n8n Integration Tester'}
          </h4>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-xl transition-all duration-300 ${
            showSettings 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
              : (isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
          }`}
          title={lang === 'es' ? 'Configurar Webhook' : 'Configure Webhook'}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed font-semibold`}>
        {lang === 'es' 
          ? 'Conecta esta interfaz con tu propia instancia local o en la nube de n8n para enviar payloads reales. Si no tienes una configurada, ejecuta una simulación animada.'
          : 'Connect this interface with your own local or cloud n8n instance to send real payloads. If you do not have one configured, run an animated simulation.'
        }
      </p>

      {/* Settings / Webhook Config */}
      {(showSettings || !webhookUrl) && (
        <div className="space-y-4 mb-6 p-4 rounded-2xl bg-gray-100/50 dark:bg-black/20 border border-gray-200/50 dark:border-slate-800/60 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-500">
              {lang === 'es' ? 'URL del Webhook de n8n' : 'n8n Webhook URL'}
            </label>
            <input 
              type="text" 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="http://localhost:5678/webhook/cmor-lead"
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' 
                  : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 border'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-500">
              {lang === 'es' ? 'Token de Autorización (Bearer Token - Opcional)' : 'Authorization Token (Bearer Token - Optional)'}
            </label>
            <input 
              type="password" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX..."
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' 
                  : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 border'
              }`}
            />
          </div>
        </div>
      )}

      {/* Current Connection Status Info */}
      {!showSettings && webhookUrl && (
        <div className={`flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl text-xs font-black tracking-tight ${
          isDarkMode ? 'bg-slate-800/40 text-slate-300' : 'bg-gray-200/50 text-gray-700'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{lang === 'es' ? 'Destino Activo:' : 'Active Target:'}</span>
          <span className="font-mono text-indigo-500 truncate max-w-[250px] md:max-w-md">{webhookUrl}</span>
        </div>
      )}

      {/* Payload Selector & Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-500">
            {lang === 'es' ? '1. Seleccionar Payload de Prueba' : '1. Select Test Payload'}
          </label>
          <select 
            value={payloadType}
            onChange={(e) => setPayloadType(e.target.value as any)}
            className={`w-full px-4 py-3.5 rounded-xl text-sm font-black outline-none transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' 
                : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 border shadow-sm'
            }`}
          >
            <option value="lead">{lang === 'es' ? 'Formulario de Contacto (Lead)' : 'Contact Form (Lead)'}</option>
            <option value="alert">{lang === 'es' ? 'Alerta de Monitoreo' : 'Monitoring Alert'}</option>
            <option value="order">{lang === 'es' ? 'Nueva Venta (Pedido)' : 'New Order (Sale)'}</option>
          </select>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleRealTest}
              disabled={testStatus === 'sending' || !webhookUrl}
              className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                !webhookUrl 
                  ? 'bg-gray-300/50 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
              }`}
            >
              {testStatus === 'sending' && activeNode > 0 ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {lang === 'es' ? 'Probar Webhook Real' : 'Test Real Webhook'}
            </button>

            <button
              onClick={handleSimulate}
              disabled={testStatus === 'sending'}
              className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 border ${
                isDarkMode 
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              } active:scale-95`}
            >
              <Play className="w-4 h-4 fill-current" />
              {lang === 'es' ? 'Ejecutar Simulación' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Payload Preview */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-500">
            {lang === 'es' ? 'Datos a Enviar (JSON)' : 'Payload Data (JSON)'}
          </label>
          <div className={`p-4 rounded-xl font-mono text-xs overflow-y-auto max-h-[190px] border ${
            isDarkMode 
              ? 'bg-black/60 border-slate-800 text-slate-300' 
              : 'bg-slate-100 border-slate-200 text-slate-800 shadow-inner'
          }`}>
            <pre>{JSON.stringify(PAYLOADS[payloadType], null, 2)}</pre>
          </div>
        </div>
      </div>

      {/* Interactive Visual Simulator Node Map */}
      <div className="mb-8">
        <label className="block text-xs font-bold uppercase tracking-wider mb-4 text-indigo-500">
          {lang === 'es' ? '2. Flujo de Trabajo en n8n' : '2. n8n Workflow Visualization'}
        </label>
        
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl border relative overflow-hidden ${
          isDarkMode ? 'bg-black/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {/* Node 1: Web Client */}
          <div className={`flex flex-col items-center p-3 w-28 rounded-2xl border-2 transition-all duration-500 ${
            activeNode === 1 
              ? 'bg-blue-500/10 border-blue-500 scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
              : (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200')
          }`}>
            <Terminal className={`w-7 h-7 ${activeNode === 1 ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[10px] font-black mt-2 uppercase tracking-wide">
              {lang === 'es' ? 'Web Cliente' : 'Web Client'}
            </span>
          </div>

          {/* Connection 1 */}
          <div className="flex flex-col md:flex-row items-center justify-center flex-1 w-full">
            <div className={`w-0.5 h-6 md:w-full md:h-0.5 relative overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              {activeNode === 1 && <div className="n8n-shimmer-bar bg-gradient-to-r from-blue-500 to-indigo-500" />}
            </div>
          </div>

          {/* Node 2: n8n Webhook */}
          <div className={`flex flex-col items-center p-3 w-28 rounded-2xl border-2 transition-all duration-500 ${
            activeNode === 2 
              ? 'bg-indigo-500/10 border-indigo-500 scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
              : (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200')
          }`}>
            <Workflow className={`w-7 h-7 ${activeNode === 2 ? 'text-indigo-500 animate-spin-slow' : 'text-slate-400'}`} />
            <span className="text-[10px] font-black mt-2 uppercase tracking-wide">
              {lang === 'es' ? 'n8n Webhook' : 'n8n Webhook'}
            </span>
          </div>

          {/* Connection 2 */}
          <div className="flex flex-col md:flex-row items-center justify-center flex-1 w-full">
            <div className={`w-0.5 h-6 md:w-full md:h-0.5 relative overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              {activeNode === 2 && <div className="n8n-shimmer-bar bg-gradient-to-r from-indigo-500 to-purple-500" />}
            </div>
          </div>

          {/* Node 3: Gemini AI */}
          <div className={`flex flex-col items-center p-3 w-28 rounded-2xl border-2 transition-all duration-500 ${
            activeNode === 3 
              ? 'bg-purple-500/10 border-purple-500 scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
              : (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200')
          }`}>
            <Bot className={`w-7 h-7 ${activeNode === 3 ? 'text-purple-500 animate-bounce' : 'text-slate-400'}`} />
            <span className="text-[10px] font-black mt-2 uppercase tracking-wide">
              {lang === 'es' ? 'IA Gemini' : 'Gemini AI'}
            </span>
          </div>

          {/* Connection 3 */}
          <div className="flex flex-col md:flex-row items-center justify-center flex-1 w-full">
            <div className={`w-0.5 h-6 md:w-full md:h-0.5 relative overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              {activeNode === 3 && <div className="n8n-shimmer-bar bg-gradient-to-r from-purple-500 to-emerald-500" />}
            </div>
          </div>

          {/* Node 4: Destinations */}
          <div className={`flex flex-col items-center p-3 w-28 rounded-2xl border-2 transition-all duration-500 ${
            activeNode === 4 
              ? 'bg-emerald-500/10 border-emerald-500 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
              : (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200')
          }`}>
            <Database className={`w-7 h-7 ${activeNode === 4 ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[10px] font-black mt-2 uppercase tracking-wide">
              {lang === 'es' ? 'CRM / Slack' : 'CRM / Slack'}
            </span>
          </div>
        </div>
      </div>

      {/* Result Messages */}
      {testStatus === 'sending' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm font-bold">
            {lang === 'es' ? 'Procesando flujo de trabajo...' : 'Processing workflow...'}
          </span>
        </div>
      )}

      {testStatus === 'success' && responseData && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <span className="text-sm font-black">
                {lang === 'es' ? '¡Prueba Completada con Éxito!' : 'Test Completed Successfully!'}
              </span>
              <p className="text-xs font-bold mt-1 opacity-90">
                {lang === 'es' ? 'Los datos fueron procesados de manera óptima por el workflow.' : 'Data was successfully processed by the workflow.'}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border font-mono text-xs overflow-y-auto max-h-[220px] ${
            isDarkMode ? 'bg-black/60 border-slate-800 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-700 shadow-inner'
          }`}>
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/50 dark:border-gray-800/50 text-xs font-bold">
              <span>RESPONSE PAYLOAD</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[9px]">200 OK</span>
            </div>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        </div>
      )}

      {testStatus === 'error' && errorMessage && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <span className="text-sm font-black">
                {lang === 'es' ? 'Fallo de Conexión' : 'Connection Failed'}
              </span>
              <p className="text-xs font-bold mt-1 opacity-90">
                {errorMessage === 'CORS_ERROR' 
                  ? (lang === 'es' ? 'Error de CORS o Red Detectado' : 'CORS or Network Error Detected')
                  : (lang === 'es' ? 'No se pudo recibir respuesta del servidor.' : 'Could not receive response from server.')
                }
              </p>
            </div>
          </div>

          {errorMessage === 'CORS_ERROR' ? (
            <div className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-3 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-gray-200 text-gray-700 shadow-sm'
            }`}>
              <h5 className="font-black text-red-500 uppercase tracking-wider text-xs">
                {lang === 'es' ? '¿Cómo solucionar el error de CORS en tu n8n?' : 'How to resolve the CORS error in n8n?'}
              </h5>
              <p className="font-bold">
                {lang === 'es' 
                  ? 'Los navegadores bloquean las llamadas directas desde un sitio local (localhost:3000) a tu n8n por seguridad de Origen Cruzado.' 
                  : 'Browsers block direct requests from a local site (localhost:3000) to your n8n due to Cross-Origin Resource Sharing security.'
                }
              </p>
              <ol className="list-decimal list-inside space-y-2 font-medium">
                <li>
                  {lang === 'es' 
                    ? 'Habilita CORS en tu servidor de n8n configurando la variable de entorno:' 
                    : 'Enable CORS on your n8n server by setting the environment variable:'
                  }
                  <div className="mt-1 p-2 rounded bg-black/40 text-indigo-400 font-mono text-[10px] break-all select-all font-bold">
                    N8N_ENFORCE_SETTINGS_FILE_FOR_ALLOWED_ORIGINS=false
                  </div>
                </li>
                <li>
                  {lang === 'es' 
                    ? 'Asegúrate de que tu flujo en n8n esté en modo ACTIVO (esquina superior derecha en n8n).' 
                    : 'Make sure your n8n workflow is in ACTIVE mode (top right corner in n8n).'
                  }
                </li>
                <li>
                  {lang === 'es' 
                    ? 'Si levantas n8n con Docker, incluye la variable de esta forma:' 
                    : 'If starting n8n with Docker, run it with the variable like this:'
                  }
                  <div className="mt-1 p-2 rounded bg-black/40 text-slate-400 font-mono text-[10px] break-all select-all font-bold">
                    docker run -it --rm --name n8n -p 5678:5678 -e N8N_ENFORCE_SETTINGS_FILE_FOR_ALLOWED_ORIGINS=false n8nio/n8n
                  </div>
                </li>
              </ol>
              <div className={`mt-4 pt-3 border-t font-semibold ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                {lang === 'es' 
                  ? '💡 Sugerencia: Puedes usar el botón "Ejecutar Simulación" para probar toda la lógica del flujo de datos en esta interfaz sin realizar peticiones de red.' 
                  : '💡 Tip: You can use the "Run Simulation" button to test the visual data flow logic directly in this UI without making network requests.'
                }
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl border font-mono text-xs overflow-y-auto max-h-[180px] ${
              isDarkMode ? 'bg-black/60 border-slate-800 text-red-400' : 'bg-slate-100 border-slate-200 text-red-700 shadow-inner'
            }`}>
              <pre>{errorMessage}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE DE INTEGRACIÓN WHATSAPP (CONEXIÓN A EVOLUTION API Y SIMULACIÓN) ---


export default N8NPanel;
