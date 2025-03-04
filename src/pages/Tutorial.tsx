import React from 'react';
import CodeBlock from '@/components/CodeBlock';
import Banner from '@/components/Banner';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

const Tutorial = () => {
  const installCode = `npm install openai`;
  
  const setupCode = `import OpenAI from 'openai';

// API-Endpoint des OVHcloud AI Endpoints
const API_ENDPOINT = 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v';

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
async function chatWithAI(userMessage) {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-r1-distill-llama-70b',
      messages: [
        { role: 'system', content: 'Du bist ein hilfreicher Assistent.' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error);
    throw error;
  }
}

// Beispielaufruf
chatWithAI('Erkläre die Vorteile von KI in einfachen Worten.')
  .then(response => console.log(response))
  .catch(error => console.error(error));`;

  const reactComponentCode = `import React, { useState } from 'react';
import OpenAI from 'openai';

// OpenAI-Client (normalerweise in einem separaten Service)
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OVH_API_KEY,
  baseURL: 'https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v',
  dangerouslyAllowBrowser: true
});

const AIChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const result = await openai.chat.completions.create({
        model: 'deepseek-r1-distill-llama-70b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      setResponse(result.choices[0].message.content);
    } catch (error) {
      console.error('Fehler:', error);
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
    </div>
  );
};

export default AIChat;`;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Banner subline="Das Tutorial zur Integration von OVHcloud AI Endpoints" />
      <main className="flex-1 container mx-auto px-4 py-20 md:py-24">
        <section className="mb-16 max-w-4xl mx-auto animate-fade-up">
          <div className="glass-morphism rounded-xl p-6 md:p-8 mb-12">
            <p className="text-white/80 mb-8 leading-relaxed text-lg">
              In diesem Tutorial erfahren Sie, wie Sie die OVHcloud AI Endpoints in Ihre Anwendungen integrieren können. 
              Die folgende Anleitung zeigt Ihnen Schritt für Schritt, wie Sie das aktuelle Deepseek-R1 Large Language Model (LLM) 
              über die OVHcloud AI Endpoints API anbinden und nutzen können. Mit den bereitgestellten Code-Beispielen 
              können Sie schnell und einfach eigene KI-gestützte Anwendungen entwickeln.
            </p>
            
            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-2">
                <GitHubLogoIcon className="w-5 h-5 mr-2" />
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
                  <GitHubLogoIcon className="w-4 h-4 mr-1" />
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
      
      {/* Remove the duplicate Footer from here */}
    </div>
  );
};

export default Tutorial;
