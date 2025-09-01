import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Lock, UserPlus, ArrowLeft } from 'lucide-react';

interface CreateUserFormProps {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onAdminChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  username,
  firstName,
  lastName,
  password,
  confirmPassword,
  isAdmin,
  isLoading,
  onUsernameChange,
  onFirstNameChange,
  onLastNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAdminChange,
  onSubmit,
  onBack,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" />
            Skapa Ny Användare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">Förnamn</Label>
                <Input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => onFirstNameChange(e.target.value)}
                  placeholder="Förnamn"
                  required
                />
              </div>
              <div>
                <Label htmlFor="last-name">Efternamn</Label>
                <Input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => onLastNameChange(e.target.value)}
                  placeholder="Efternamn"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username">Användarnamn</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  placeholder="Ange användarnamn"
                  className="pl-10"
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Lösenord</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Ange lösenord"
                  className="pl-10"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Bekräfta Lösenord</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => onConfirmPasswordChange(e.target.value)}
                  placeholder="Bekräfta lösenord"
                  className="pl-10"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="admin"
                checked={isAdmin}
                onCheckedChange={onAdminChange}
              />
              <Label htmlFor="admin" className="text-sm font-medium">
                Administratör
              </Label>
            </div>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tillbaka
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading || !username || !firstName || !lastName || !password || !confirmPassword}
              >
                {isLoading ? "Skapar..." : "Skapa Användare"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserForm;