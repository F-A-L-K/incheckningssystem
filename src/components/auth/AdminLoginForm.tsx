import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User, Shield } from 'lucide-react';

interface AdminLoginFormProps {
  adminUsername: string;
  adminPassword: string;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  adminUsername,
  adminPassword,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Verifiering
          </CardTitle>
          <p className="text-sm text-gray-600">
            Verifiera din admin-status för att skapa nya användare
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-username">Användarnamn</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-username"
                  type="text"
                  value={adminUsername}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  placeholder="Ange ditt användarnamn"
                  className="pl-10"
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="admin-password">Lösenord</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Ange ditt lösenord"
                  className="pl-10"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !adminUsername || !adminPassword}
            >
              {isLoading ? "Verifierar..." : "Verifiera Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;