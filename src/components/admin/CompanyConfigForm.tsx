
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CompanyConfigProps {
  name: string;
  onChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

const CompanyConfigForm = ({ name, onChange, onSave, isSaving }: CompanyConfigProps) => {
  return (
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
              value={name} 
              onChange={(e) => onChange(e.target.value)}
              className="glass-morphism"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="ml-auto bg-highlight hover:bg-highlight/90"
        >
          {isSaving ? 'Wird gespeichert...' : 'Konfiguration speichern'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanyConfigForm;
