
import React from 'react';
import { Book } from 'lucide-react';

const TutorialBanner = () => {
  return (
    <div className="w-full py-16 bg-gradient-to-r from-purple-900 to-purple-700 shadow-lg my-16 animate-fade-in">
      <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <Book size={48} className="mr-6 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Entwickler Tutorial
          </h2>
        </div>
        <div className="max-w-xl">
          <p className="text-xl text-white/90">
            Erfahren Sie in den folgenden Abschnitten, wie Sie die OVHcloud AI Endpoints in Ihre eigenen Anwendungen integrieren können.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorialBanner;
