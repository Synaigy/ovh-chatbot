
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ApiConfigProps {
  endpoint: string;
  apiKey: string;
  onChange: (key: 'endpoint' | 'apiKey', value: string) => void;
}

const ApiConfigForm = ({ endpoint, apiKey, onChange }: ApiConfigProps) => {
  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle>API Konfiguration</CardTitle>
        <CardDescription>Ändern Sie die API-Einstellungen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API Endpoint</label>
            <Input 
              value={endpoint} 
              onChange={(e) => onChange('endpoint', e.target.value)}
              className="glass-morphism"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <Input 
              type="password" 
              value={apiKey} 
              onChange={(e) => onChange('apiKey', e.target.value)}
              className="glass-morphism"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfigForm;
