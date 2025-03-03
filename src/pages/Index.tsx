
import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-20 md:py-24">
        <section className="mb-16 max-w-4xl mx-auto text-center animate-fade-up">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 mb-6">
            <span className="text-highlight text-sm font-medium">Jetzt verfügbar</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            OVHcloud AI Endpoints: <span className="highlight-text">Leistungsstarke KI ohne Infrastrukturaufwand</span>
          </h1>
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
            Teste Deepseek jetzt selbst!
          </h2>
          <p className="text-white/80 mb-8">
            Anstatt nur darüber zu lesen, kannst du dir selbst ein Bild machen!
            Unten findest du einen interaktiven Chatbot, der mit Deepseek läuft. Stelle ihm Fragen, teste seine Fähigkeiten und entdecke, wie leistungsstark moderne KI heute ist.
          </p>
          <div className="inline-block mb-8 highlight-text">
            ➡ Probiere es aus! 🖥️💡 (Limit: 50 Fragen pro Browsersitzung)
          </div>
        </section>
        
        <section className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <ChatInterface />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
