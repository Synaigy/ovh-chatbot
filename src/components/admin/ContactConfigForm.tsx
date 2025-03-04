
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ContactConfigProps {
  contact: {
    name: string;
    title: string;
    photoUrl: string;
    meetingUrl: string;
    linkedinUrl: string;
  };
  onChange: (field: string, value: string) => void;
}

const ContactConfigForm = ({ contact, onChange }: ContactConfigProps) => {
  return (
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
              value={contact.name} 
              onChange={(e) => onChange('name', e.target.value)}
              className="glass-morphism"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Titel</label>
            <Input 
              value={contact.title} 
              onChange={(e) => onChange('title', e.target.value)}
              className="glass-morphism"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto URL</label>
            <Input 
              value={contact.photoUrl} 
              onChange={(e) => onChange('photoUrl', e.target.value)}
              className="glass-morphism"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meeting URL</label>
            <Input 
              value={contact.meetingUrl} 
              onChange={(e) => onChange('meetingUrl', e.target.value)}
              className="glass-morphism"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input 
              value={contact.linkedinUrl} 
              onChange={(e) => onChange('linkedinUrl', e.target.value)}
              className="glass-morphism"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactConfigForm;
