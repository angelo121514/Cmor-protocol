"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, RefreshCw, MessageSquare, Check, X, Shield, Lock, Wifi, Smartphone } from 'lucide-react';

const WhatsAppPanel = ({ lang, isDarkMode }: { lang: string; isDarkMode: boolean }) => {
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCount, setQrCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSimulated, setIsSimulated] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [testMessage, setTestMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<Array<{ sender: 'client' | 'bot'; text: string; time: string }>>([]);

  const apiKey = 'cmor_evolution_secret_key';
  const apiBase = 'http://localhost:8082';

  const checkConnection = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setIsSimulated(false);
    try {
      const response = await fetch(`${apiBase}/instance/connectionState/cmor-agent`, {
        headers: { 'apikey': apiKey }
      });
      if (response.ok) {
        const data = await response.json();
        const state = data?.instance?.state;
        if (state === 'open') {
          setConnectionState('connected');
          setQrCode(null);
        } else if (state === 'connecting') {
          setConnectionState('connecting');
          getQrCode();
        } else {
          setConnectionState('disconnected');
          setQrCode(null);
        }
      } else {
        setConnectionState('error');
        setErrorMessage('OFFLINE');
      }
    } catch (err: any) {
      setConnectionState('error');
      setErrorMessage('OFFLINE');
    } finally {
      setIsLoading(false);
    }
  };

  const getQrCode = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${apiBase}/instance/connect/cmor-agent`, {
        headers: { 'apikey': apiKey }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.base64) {
          setQrCode(data.base64);
          setQrCount(data.count || 1);
          setConnectionState('connecting');
          startPolling();
        } else if (data.count === 0) {
          setErrorMessage('QR_NOT_READY');
          setConnectionState('connecting');
          setTimeout(getQrCode, 3000);
        } else {
          setErrorMessage(lang === 'es' ? 'No se pudo generar el código QR. Inténtalo de nuevo.' : 'Failed to generate QR code. Try again.');
          setConnectionState('error');
        }
      } else {
        setConnectionState('error');
        setErrorMessage(lang === 'es' ? 'Error al contactar con Evolution API.' : 'Error contacting Evolution API.');
      }
    } catch (err: any) {
      setConnectionState('error');
      setErrorMessage('OFFLINE');
    } finally {
      setIsLoading(false);
    }
  };

  let pollInterval: any = useRef<any>(null);

  const startPolling = () => {
    if (pollInterval.current) clearInterval(pollInterval.current);
    pollInterval.current = setInterval(async () => {
      try {
        const response = await fetch(`${apiBase}/instance/connectionState/cmor-agent`, {
          headers: { 'apikey': apiKey }
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.instance?.state === 'open') {
            setConnectionState('connected');
            setQrCode(null);
            clearInterval(pollInterval.current);
          }
        }
      } catch (e) {
        // Ignorar errores en segundo plano
      }
    }, 4000);
  };

  useEffect(() => {
    checkConnection();
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  const handleSimulateConnection = () => {
    setIsSimulated(true);
    setConnectionState('connecting');
    setSimulationStep(1);
    setErrorMessage('');
    
    setTimeout(() => {
      setSimulationStep(2);
      // Simulado: Un código QR de marcador de posición (placeholder)
      setQrCode("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAYAAACKAxD9AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYIDwkSDX70YAAAABB7VFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkZEguAAAEEklEQVR42u3cQWoUQRSG4V9XjWjQhS5yB9x5BO8geATPELyDdyB4By8g4so1uNEggtFNwUWMq0mISfVMd1X1q6c/p96pqu/7VXV196Pj8egCgG0uAUBgAIABAIYBAGAAgAEAIDAAwAAAwwAEAoA/1W219efn7t3d1YnL/v6+vn1/rWfn7t2p8f2rAgKAP9a22no/r96f6v0W86v322oCAgSBAYDAAIABAIAvLpvdVrt59n1/6P22mptn31fT7Gf5+oEAIEDQ7zW9wEAIEDQ7yq/H82qWvV+Vf/17QECgAEAIGDQ7zF+P/b95tdqP4/n1Z6/HhAgCAwABAICAgSBAYCAQECgAEAIGDQ7ym/q/Tya/d2fRzPLrx8IEAQGAAICAgIEgQGAgEBAoABACBg0O8qv6/08mrV9v239+oEAQWAAICAQECBAEBgACAQECgAEgQGAwABAgCBAYACAgECgAEAIGDQ79v2h9+tq1vZ9NU2/fiBAEBgACAgECBAEBgACAQGCwgDgn+lWrV/v3t1dnfr8P47P7w+3n+XrBwKEAECv13QCAyFA0O8ovx/Pq1n2flX+9e0BAcDfVNs29fO21aTevykgAABAYACAAQAGAAAEBgAYAGAAAEBgAIABAAZAgCAwABAYEBAgCAwABAYEBAgCQ4C22naV7/vT698PBAgCg3+s2x/h4/8PZpbj+z/C/Gf5+oEAIEDQ7zV9P0/q/Rbr+3lS77fVBAQIAsPfT7eTav7w++1W0zT9+oEAQGAAICAQIEAQGAAICAQICgOAf5/bL9U9fPfn7t3d1bHL8vX39fO21STe/6ICAgAEBgAYAGAAAAgMADAAsNqF2nb/P3/aVpM6vr8qIADA72xbbf35uXt3d3Xisv+/r2/fX+vZ7y9gAIBvLwAYAGAAAIC21dafn7t3d1cnLvv7+vr2/bWe/f4CBgD49gKAwAAAAwAEAoAAQWAAAAgMADAAsNoF2/27u6sTl/39/fH9/wL+jQIGABgGAID2E0pT7ebZ931tq6221d6/HwgQ/vXaVs0sn1ezen+o/X4gQBAg/H21bVPP8nUCAYLA8O+nbTVP6v3Y90MEgQABAQLDfz+3W03K8fsj+68qIAAAQGAAgAEABgAABAYAGABgAABAYACAAQAGQIAgMAAQGBAQIAgMAAQGBAQIAkOAh0m/v4gPDkCA8A+k31+/T+p4gP//L2CAIDC+vXbT//8BAQLDX6/Z//8BAQLDf0f+f//bBAwAAAMAwAAAAAAAYACAAQAGAAAEBgAYAGAABAgCAwCBAQEBAgSBAYDAgIAAHyQAMADAAAAQGABgAIABAAACAwAMADAAYAEAAPwFvI29dYq1N2QAAAAASUVORK5CYII=");
    }, 1000);
  };

  const handleSimulateScan = () => {
    setSimulationStep(3);
    setTimeout(() => {
      setConnectionState('connected');
      setQrCode(null);
      setSimulationStep(4);
      setSentMessages([
        { sender: 'client', text: lang === 'es' ? 'Hola, me gustaría agendar una reunión para el Roadmap IA.' : 'Hello, I would like to schedule a meeting for the AI Roadmap.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) },
        { sender: 'bot', text: lang === 'es' ? '¡Hola! Claro que sí. Analizando tu solicitud... Detectamos interés en Consultoría de Procesos. ¿Te acomoda este jueves a las 15:00 hrs?' : 'Hello! Sure. Analyzing your request... We detect interest in Process Consulting. Does this Thursday at 3:00 PM work for you?', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
      ]);
    }, 2000);
  };

  const sendTestMessage = () => {
    if (!testMessage.trim()) return;
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    setSentMessages(prev => [...prev, { sender: 'client', text: testMessage, time }]);
    const messageText = testMessage;
    setTestMessage('');
    
    setTimeout(() => {
      setSentMessages(prev => [...prev, {
        sender: 'bot',
        text: lang === 'es' 
          ? `[Simulación IA] Recibido: "${messageText}". Registro y propuesta creados en la base de datos local PostgreSQL (cmor_crm).`
          : `[AI Simulation] Received: "${messageText}". Record and proposal created in the local PostgreSQL database (cmor_crm).`,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1200);
  };

  return (
    <div className={`mt-8 p-6 md:p-8 rounded-[2rem] border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/40 border-slate-800 text-white' 
        : 'bg-slate-50/80 border-slate-200 text-slate-900'
    }`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h4 className="text-xl font-black flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-emerald-500" />
            {lang === 'es' ? 'Vincular WhatsApp (Evolution API)' : 'Link WhatsApp (Evolution API)'}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">
            {lang === 'es' 
              ? 'Conecta tu cuenta de WhatsApp escaneando el código QR generado localmente por Evolution API.' 
              : 'Connect your WhatsApp account by scanning the QR code generated locally by Evolution API.'}
          </p>
        </div>
        
        {/* INDICADOR DE ESTADO */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <span className={`w-3 h-3 rounded-full animate-pulse ${
            connectionState === 'connected' ? 'bg-emerald-500' :
            connectionState === 'connecting' ? 'bg-amber-500' :
            connectionState === 'error' ? 'bg-red-500' : 'bg-gray-400'
          }`} />
          <span className="text-xs font-black uppercase tracking-wider">
            {connectionState === 'connected' && (lang === 'es' ? 'Conectado' : 'Connected')}
            {connectionState === 'connecting' && (lang === 'es' ? 'Esperando Escaneo' : 'Waiting for Scan')}
            {connectionState === 'error' && (lang === 'es' ? 'Desconectado / Offline' : 'Disconnected / Offline')}
            {connectionState === 'disconnected' && (lang === 'es' ? 'Sin Vincular' : 'Unlinked')}
            {isSimulated && ' (Simulado)'}
          </span>
        </div>
      </div>

      {/* DISCONNECTED STATE */}
      {connectionState === 'disconnected' && !isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <MessageCircle className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold max-w-md">
            {lang === 'es'
              ? 'Evolution API está activa. Genera un código QR para vincular tu WhatsApp de forma 100% local.'
              : 'Evolution API is active. Generate a QR code to link your WhatsApp 100% locally.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={getQrCode}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {lang === 'es' ? 'Generar Código QR Real' : 'Generate Real QR Code'}
            </button>
            <button
              onClick={handleSimulateConnection}
              className={`px-6 py-3 border font-black rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-gray-200 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <Play className="w-4 h-4 text-blue-500" />
              {lang === 'es' ? 'Ejecutar Simulación' : 'Run Simulation'}
            </button>
          </div>
        </div>
      )}

      {/* CONNECTING / QR GENERATED STATE */}
      {connectionState === 'connecting' && (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-5">
          {simulationStep === 1 && (
            <div className="flex flex-col items-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm font-bold text-gray-500">
                {lang === 'es' ? 'Iniciando sesión de WhatsApp...' : 'Initializing WhatsApp session...'}
              </p>
            </div>
          )}
          
          {qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-3xl shadow-xl border border-gray-100">
                <img 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  className={`w-48 h-48 ${simulationStep === 2 ? 'opacity-80 blur-[2px]' : ''}`} 
                />
              </div>
              
              <div className="max-w-md text-xs font-bold text-gray-500 dark:text-slate-400 space-y-2">
                <p>
                  {lang === 'es'
                    ? '1. Abre WhatsApp en tu teléfono.'
                    : '1. Open WhatsApp on your phone.'}
                </p>
                <p>
                  {lang === 'es'
                    ? '2. Ve a Configuración / Dispositivos vinculados y escanea el código.'
                    : '2. Go to Settings / Linked Devices and scan the code.'}
                </p>
              </div>

              {simulationStep === 2 && (
                <button
                  onClick={handleSimulateScan}
                  className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  {lang === 'es' ? 'Simular Escaneo del QR' : 'Simulate Scanning QR'}
                </button>
              )}

              {simulationStep === 3 && (
                <div className="flex items-center gap-2 text-blue-500 text-sm font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {lang === 'es' ? 'Vinculando dispositivo...' : 'Linking device...'}
                </div>
              )}

              {!isSimulated && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {lang === 'es' 
                    ? `Intentos de QR: ${qrCount} (Consultando estado en vivo...)` 
                    : `QR Attempts: ${qrCount} (Checking status live...)`}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CONNECTED STATE (CHAT SIMULATOR) */}
      {connectionState === 'connected' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              {lang === 'es' 
                ? '¡WhatsApp vinculado correctamente! El agente de IA ahora escucha los mensajes.' 
                : 'WhatsApp linked successfully! The AI agent is now listening to messages.'}
            </div>
          </div>

          {/* CHAT VIEW */}
          <div className={`rounded-2xl border overflow-hidden flex flex-col h-[300px] ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-gray-200'
          }`}>
            <div className="p-3 bg-emerald-600 text-white text-xs font-black tracking-wider flex justify-between items-center">
              <span>CMOR AGENT - CHAT LOGGER</span>
              <span className="px-2 py-0.5 rounded bg-emerald-700 text-[10px] uppercase">POSTGRES DB LIVE</span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-normal">
              {sentMessages.length === 0 ? (
                <div className="text-gray-400 dark:text-gray-500 text-center py-12 font-bold">
                  {lang === 'es' 
                    ? 'No hay mensajes registrados. Escribe abajo para probar.' 
                    : 'No messages logged yet. Type below to test.'}
                </div>
              ) : (
                sentMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl font-semibold shadow-sm ${
                      msg.sender === 'client'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : (isDarkMode ? 'bg-slate-850 border border-slate-850 text-slate-100 rounded-bl-none' : 'bg-white text-slate-800 rounded-bl-none')
                    }`}>
                      <p className="font-bold">{msg.text}</p>
                      <span className="text-[9px] opacity-75 mt-1 block text-right font-bold">{msg.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={`p-3 border-t flex gap-2 ${isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-gray-200 bg-white'}`}>
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendTestMessage()}
                placeholder={lang === 'es' ? 'Simular mensaje de cliente...' : 'Simulate customer message...'}
                className={`flex-1 p-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-gray-300 text-slate-900'
                }`}
              />
              <button
                onClick={sendTestMessage}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                if (isSimulated) {
                  setConnectionState('disconnected');
                  setIsSimulated(false);
                } else {
                  // Desvincular real
                  fetch(`${apiBase}/instance/delete/cmor-agent`, {
                    method: 'DELETE',
                    headers: { 'apikey': apiKey }
                  }).then(() => checkConnection());
                }
              }}
              className="px-4 py-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-xs rounded-lg transition-colors"
            >
              {lang === 'es' ? 'Desvincular WhatsApp' : 'Unlink WhatsApp'}
            </button>
          </div>
        </div>
      )}

      {/* ERROR / OFFLINE STATE */}
      {connectionState === 'error' && (
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <span className="text-sm font-black">
                {lang === 'es' ? 'Servidor de WhatsApp Desconectado' : 'WhatsApp Server Offline'}
              </span>
              <p className="text-xs font-bold mt-1 opacity-90">
                {errorMessage === 'OFFLINE'
                  ? (lang === 'es' ? 'No se pudo conectar con Evolution API en http://localhost:8082' : 'Could not connect to Evolution API at http://localhost:8082')
                  : errorMessage}
              </p>
            </div>
          </div>

          {errorMessage === 'OFFLINE' ? (
            <div className={`p-5 rounded-2xl border text-xs leading-relaxed space-y-3 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-gray-200 text-gray-700 shadow-sm'
            }`}>
              <h5 className="font-black text-red-500 uppercase tracking-wider text-xs">
                {lang === 'es' ? '¿Cómo iniciar Evolution API en tu máquina?' : 'How to start Evolution API on your machine?'}
              </h5>
              <p className="font-bold">
                {lang === 'es'
                  ? 'Asegúrate de tener Docker Desktop iniciado y ejecuta el stack desde la terminal del proyecto:'
                  : 'Make sure you have Docker Desktop running and start the stack from the project terminal:'}
              </p>
              <div className="p-3 rounded bg-black/40 text-emerald-400 font-mono text-[10px] break-all select-all font-bold">
                docker compose up -d
              </div>
              <div className={`mt-4 pt-3 border-t font-semibold ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                {lang === 'es'
                  ? '💡 Sugerencia: Si solo deseas explorar la interfaz sin arrancar Docker, haz clic en "Ejecutar Simulación" abajo.'
                  : '💡 Tip: If you just want to explore the interface without running Docker, click "Run Simulation" below.'}
              </div>
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              onClick={checkConnection}
              className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              {lang === 'es' ? 'Reintentar Conexión' : 'Retry Connection'}
            </button>
            <button
              onClick={handleSimulateConnection}
              className="px-5 py-2.5 border border-blue-500/20 text-blue-500 hover:bg-blue-500/10 font-bold rounded-xl text-xs transition-all active:scale-95"
            >
              {lang === 'es' ? 'Ejecutar Simulación' : 'Run Simulation'}
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-2">
          <RefreshCw className="w-5 h-5 text-emerald-500 animate-spin" />
        </div>
      )}
    </div>
  );
};



export default WhatsAppPanel;
