import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // @ts-ignore - authenticate_user function exists in database
      const result = await supabase.rpc('authenticate_user', {
        p_username: username,
        p_password: password
      });
      const { data, error } = result as { data: any; error: any };

      if (error) {
        console.error('Database error:', error);
        toast({
          title: 'Fel',
          description: 'Ett fel uppstod vid inloggning',
          variant: 'destructive',
        });
        return;
      }

      if (data && data.success) {
        // Store user data in localStorage
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        toast({
          title: 'Framgång',
          description: 'Inloggning lyckades',
        });
        navigate('/admin');
      } else {
        toast({
          title: 'Inloggning misslyckades',
          description: data?.message || 'Felaktiga inloggningsuppgifter',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Fel',
        description: 'Ett oväntat fel uppstod',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Admin Inloggning</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Användarnamn</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  placeholder="Ange användarnamn"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lösenord</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Ange lösenord"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Loggar in...' : 'Logga in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;