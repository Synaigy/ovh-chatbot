
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (password: string) => void;
  authError: string;
}

const LoginForm = ({ onLogin, authError }: LoginFormProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

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
          <form onSubmit={handleSubmit}>
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
};

export default LoginForm;
