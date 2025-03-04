
import React from 'react';
import { Database, AlertTriangle } from 'lucide-react';

interface ConfigErrorProps {
  show: boolean;
}

export const ConfigError: React.FC<ConfigErrorProps> = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <Database className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Konfigurationsfehler</h3>
      <p className="text-white/70 mb-4">
        Die Konfiguration konnte nicht von der Datenbank geladen werden. 
        Bitte wenden Sie sich an den Administrator.
      </p>
    </div>
  );
};

interface LimitReachedProps {
  show: boolean;
  messageLimit: number;
  isEmpty: boolean;
}

export const LimitReached: React.FC<LimitReachedProps> = ({ show, messageLimit, isEmpty }) => {
  if (!show || !isEmpty) return null;
  
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Tageslimit erreicht</h3>
      <p className="text-white/70 mb-4">
        Sie haben das tägliche Limit von {messageLimit} Nachrichten erreicht. 
        Bitte versuchen Sie es morgen wieder.
      </p>
    </div>
  );
};
