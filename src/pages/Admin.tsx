
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ADMIN_PASSWORD, API_CONFIG, FOOTER_CONFIG } from '@/config/env';
import { getCounter } from '@/services/aiService';
import { Lock } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [counter, setCounter] = useState<number | null>(null);
  const [config, setConfig] = useState({
    api: {
      endpoint: API_CONFIG.ENDPOINT,
      apiKey: API_CONFIG.API_KEY,
    },
    contact: {
      name: FOOTER_CONFIG.CONTACT_PERSON.NAME,
      title: FOOTER_CONFIG.CONTACT_PERSON.TITLE,
      photoUrl: FOOTER_CONFIG.CONTACT_PERSON.PHOTO_URL,
      meetingUrl: FOOTER_CONFIG.CONTACT_PERSON.MEETING_URL,
      linkedinUrl: FOOTER_CONFIG.CONTACT_PERSON.LINKEDIN_URL,
    },
    company: {
      name: FOOTER_CONFIG.COMPANY.NAME,
    },
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const loadCounter = async () => {
      if (isAuthenticated) {
        const count = await getCounter();
        setCounter(count);
      }
    };
    
    loadCounter();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Falsches Passwort');
    }
  };

  const handleSave = () => {
    // In a real app, this would save to a database or API
    // For demo purposes, we'll just show a success message
    toast({
      title: "Konfiguration gespeichert",
      description: "Die Änderungen wurden erfolgreich gespeichert.",
      variant: "default",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md glass-morphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} /> Admin Login
            </CardTitle>
            <CardDescription>
              Bitte geben Sie das Admin-Passwort ein, um fortzufahren.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-morphism"
                  />
                  {authError && (
                    <p className="text-red-500 text-sm">{authError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-highlight hover:bg-highlight/90">
                  Anmelden
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 highlight-text">Admin Bereich</h1>
      
      <div className="mb-8">
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Chat Statistik</CardTitle>
            <CardDescription>Gesamtanzahl der Chat-Anfragen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold highlight-text">{counter !== null ? counter : '...'}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-8">
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
                  value={config.api.endpoint} 
                  onChange={(e) => setConfig({...config, api: {...config.api, endpoint: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input 
                  type="password" 
                  value={config.api.apiKey} 
                  onChange={(e) => setConfig({...config, api: {...config.api, apiKey: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Kontakt Konfiguration</CardTitle>
            <CardDescription>Ändern Sie die Kontaktinformationen im Footer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={config.contact.name} 
                  onChange={(e) => setConfig({...config, contact: {...config.contact, name: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Titel</label>
                <Input 
                  value={config.contact.title} 
                  onChange={(e) => setConfig({...config, contact: {...config.contact, title: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Foto URL</label>
                <Input 
                  value={config.contact.photoUrl} 
                  onChange={(e) => setConfig({...config, contact: {...config.contact, photoUrl: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meeting URL</label>
                <Input 
                  value={config.contact.meetingUrl} 
                  onChange={(e) => setConfig({...config, contact: {...config.contact, meetingUrl: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn URL</label>
                <Input 
                  value={config.contact.linkedinUrl} 
                  onChange={(e) => setConfig({...config, contact: {...config.contact, linkedinUrl: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle>Firmen Konfiguration</CardTitle>
            <CardDescription>Ändern Sie die Firmeninformationen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Firmenname</label>
                <Input 
                  value={config.company.name} 
                  onChange={(e) => setConfig({...config, company: {...config.company, name: e.target.value}})}
                  className="glass-morphism"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} className="ml-auto bg-highlight hover:bg-highlight/90">
              Konfiguration speichern
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
