import React, { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Banner from '@/components/Banner';
import CodeBlock from '@/components/CodeBlock';
import TutorialBanner from '@/components/TutorialBanner';
import { Github } from 'lucide-react'; 
import { getConfig } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [configError, setConfigError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getConfig();
        if (config && config.API_ENDPOINT && config.API_KEY) {
          setIsConfigLoaded(true);
          setConfigError(false);
          console.log('Configuration successfully loaded in Index component');
        } else {
          setConfigError(true);
          console.error('Failed to load complete configuration in Index component');
        }
      } catch (error) {
        console.error('Error loading configuration in Index component:', error);
        setConfigError(true);
        toast({
          title: "Konfigurationsfehler",
          description: "Die Konfiguration konnte nicht geladen werden. Bitte versuchen Sie es später erneut oder wenden Sie sich an den Administrator.",
          variant: "destructive",
        });
      }
    };

    loadConfig();
  }, [toast]);

  const installCode = `npm install openai`;
  
  const setupCode = `import OpenAI from 'openai';

// API-Endpoint des OVHcloud AI Endpoints
const API_ENDPOINT = 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1';

// API-Schlüssel (in einer echten Anwendung aus Umgebungsvariablen)
const API_KEY = 'Ihr-API-Schlüssel';

// OpenAI-Client initialisieren
const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: API_ENDPOINT,
  // Warnung: Nur für Demo-Zwecke!
  dangerouslyAllowBrowser: true 
});`;

  const usageCode = `// Nachricht an das Modell senden
export const chatWithAI = async (messages: any[]) => {
  try {
  
    
    const response = await openaiClient.chat.completions.create({
      model: 'DeepSeek-R1-Distill-Llama-70B',
      stream: true,
      messages,
    });

    return response;
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
}

// Beispielaufruf
chatWithAI('Erkläre die Vorteile von KI in einfachen Worten.')
  .then(response => console.log(response))
  .catch(error => console.error(error));`;

  const reactComponentCode = `

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    setIsLoading(true);
    setResponse('');
    
    // Neue Nachricht zum Verlauf hinzufügen
    const newMessages = [
      ...messages,
      { role: 'user', content: prompt }
    ];
    setMessages(newMessages);
    
    
      
      // Antwort zum Nachrichtenverlauf hinzufügen
      setMessages([
        ...newMessages,
        { role: 'assistant', content: chatWithAI(newMessages) }
      ]);
      
      setPrompt('');
    } catch (error) {
      console.error('Fehler bei der API-Anfrage:', error);
      setResponse('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Frage stellen..."
          className="w-full p-2 mb-4 border rounded"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isLoading ? 'Wird bearbeitet...' : 'Senden'}
        </button>
      </form>
      
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Antwort:</h3>
          <p>{response}</p>
        </div>
      )}
      
      {/* Nachrichtenverlauf anzeigen */}
      <div className="mt-6">
        <h3 className="font-bold mb-2">Chatverlauf:</h3>
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={\`p-3 rounded \${
                msg.role === 'user' 
                  ? 'bg-blue-100 ml-6' 
                  : 'bg-gray-100 mr-6'
              }\`}
            >
              <div className="font-semibold mb-1">
                {msg.role === 'user' ? 'Sie:' : 'AI:'}
              </div>
              <div>{msg.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatbotForm;`;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Banner />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16">
        {configError && (
          <div className="mb-8 p-4 border border-red-500 bg-red-500/10 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-2">Datenbank-Konfigurationsfehler</h2>
            <p className="text-white/80">
              Es konnte keine Verbindung zur Datenbank hergestellt werden. Einige Funktionen sind möglicherweise eingeschränkt.
            </p>
          </div>
        )}

        <section className="mb-16 max-w-4xl mx-auto text-center animate-fade-up">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 mb-6">
            <span className="text-highlight text-sm font-medium">Jetzt verfügbar</span>
          </div>
          <p className="text-lg md:text-xl text-white/80 mb-6 leading-relaxed">
            Mit den OVHcloud AI Endpoints bietet OVHcloud eine leistungsstarke Möglichkeit, künstliche Intelligenz einfach und skalierbar zu nutzen, ohne dass Nutzer sich um komplexe Infrastruktur kümmern müssen. Diese API-basierten Lösungen ermöglichen es, große Sprachmodelle (LLMs) und andere KI-Dienste direkt in eigene Anwendungen zu integrieren – schnell, sicher und effizient.
          </p>
        </section>

        <section className="mb-16 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-morphism rounded-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Neu verfügbar: <span className="highlight-text">deepseek-r1-distill-llama-70b</span>
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Seit Kurzem ist nun auch das leistungsstarke deepseek-r1-distill-llama-70b über OVHcloud verfügbar!
              Dieses Modell ist ein sogenanntes Reasoning-LLM – spezialisiert auf logisches Denken, Problemlösung und präzise Antworten. Solche Modelle werden häufig in Code-Generierung, komplexen Analysen und Entscheidungsunterstützung eingesetzt.
            </p>
          </div>
        </section>

        <section className="mb-16 max-w-4xl mx-auto text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            Teste Deepseek-R1 jetzt selbst!
          </h2>
          <p className="text-white/80 mb-8">
            Anstatt nur darüber zu lesen, kannst du dir selbst ein Bild machen!
            Unten findest du einen interaktiven Chatbot, der mit Deepseek läuft. Stelle ihm Fragen, teste seine Fähigkeiten und entdecke, wie leistungsstark moderne KI heute ist.
          </p>
          <div className="inline-block mb-8 highlight-text">
            ➡ Probiere es aus! 🖥️💡
          </div>
        </section>
        
        <section className="animate-fade-up mb-16" style={{ animationDelay: "0.3s" }}>
          <ChatInterface />
        </section>

        <TutorialBanner />

        <section className="mb-16 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="glass-morphism rounded-xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Integration von OVHcloud AI Endpoints
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed text-lg">
              In diesem Tutorial erfahren Sie, wie Sie die OVHcloud AI Endpoints in Ihre Anwendungen integrieren können. 
              Die folgende Anleitung zeigt Ihnen Schritt für Schritt, wie Sie das aktuelle Deepseek-R1 Large Language Model (LLM) 
              über die OVHcloud AI Endpoints API anbinden und nutzen können. Mit den bereitgestellten Code-Beispielen 
              können Sie schnell und einfach eigene KI-gestützte Anwendungen entwickeln.
            </p>
            
            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-2">
                <Github className="w-5 h-5 mr-2" /> {/* Changed from GitHubLogoIcon to Github */}
                <h3 className="text-lg font-medium">Open Source Initiative</h3>
              </div>
              <p className="text-white/80 text-sm">
                Im Sinne der OVHcloud Open-Source-Philosophie ist dieses Tutorial und der gesamte Quellcode öffentlich verfügbar. 
                Synaigy legt den vollständigen Code offen, um Transparenz zu fördern und der Community die Möglichkeit zu geben, 
                daran mitzuwirken und ihn weiterzuentwickeln.
              </p>
              <div className="mt-3">
                <a 
                  href="https://github.com/Synaigy/ovh-chatbot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Github className="w-4 h-4 mr-1" /> {/* Changed from GitHubLogoIcon to Github */}
                  GitHub Repository ansehen
                </a>
              </div>
            </div>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Erste Schritte mit OVHcloud AI Endpoints</h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              Die Integration von OVHcloud AI Endpoints in Ihre Anwendung ist unkompliziert. Mit der OpenAI-kompatiblen API können Sie die DeepSeek-Modelle in Ihre Anwendungen einbinden, ohne Ihre bestehende OpenAI-basierte Implementierung grundlegend ändern zu müssen.
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-2 highlight-text">1. Installation der OpenAI-Bibliothek</h3>
                <p className="text-white/80 mb-4">
                  Da die OVHcloud AI Endpoints mit der OpenAI-API kompatibel sind, können wir die offizielle OpenAI-Bibliothek verwenden:
                </p>
                <CodeBlock language="bash" code={installCode} />
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2 highlight-text">2. Einrichtung des Clients</h3>
                <p className="text-white/80 mb-4">
                  Konfigurieren Sie den OpenAI-Client mit dem OVHcloud API-Endpunkt:
                </p>
                <CodeBlock language="javascript" code={setupCode} />
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2 highlight-text">3. Verwendung des Modells</h3>
                <p className="text-white/80 mb-4">
                  Jetzt können Sie Anfragen an das DeepSeek-Modell senden:
                </p>
                <CodeBlock language="javascript" code={usageCode} />
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2 highlight-text">4. Integration in eine React-Anwendung</h3>
                <p className="text-white/80 mb-4">
                  Hier ein Beispiel für eine einfache React-Komponente, die mit dem Modell interagiert:
                </p>
                <CodeBlock language="jsx" code={reactComponentCode} />
              </div>
            </div>
          </div>
          
          <div className="glass-morphism rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Wichtige Hinweise</h2>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start">
                <span className="text-highlight mr-2">•</span>
                <span>Verwenden Sie in produktiven Anwendungen <strong>niemals</strong> API-Schlüssel direkt im Frontend-Code. Nutzen Sie stattdessen einen Backend-Service oder Umgebungsvariablen.</span>
              </li>
              <li className="flex items-start">
                <span className="text-highlight mr-2">•</span>
                <span>Die Option <code>dangerouslyAllowBrowser: true</code> sollte nur für Demonstrations- und Entwicklungszwecke verwendet werden.</span>
              </li>
              <li className="flex items-start">
                <span className="text-highlight mr-2">•</span>
                <span>Implementieren Sie geeignete Fehlerbehandlung und Rate-Limiting in Ihren Anwendungen.</span>
              </li>
              <li className="flex items-start">
                <span className="text-highlight mr-2">•</span>
                <span>Für umfangreiche Anwendungen empfiehlt sich die Implementierung von Caching-Strategien, um API-Aufrufe zu minimieren.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
