
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/itavla_use-toast';
import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import CreateUserForm from '@/components/auth/CreateUserForm';

type SignupStep = 'admin-login' | 'create-user';

const Signup = () => {
  const [step, setStep] = useState<SignupStep>('admin-login');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Admin login form state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // User creation form state
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!adminUsername || !adminPassword) {
        toast({
          title: "Fel",
          description: "Vänligen fyll i alla fält.",
          variant: "destructive"
        });
        return;
      }

      // Hash the password with SHA-256
      const hashedPassword = CryptoJS.SHA256(adminPassword).toString();
      
      // Query the users table to verify admin credentials
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', adminUsername)
        .eq('password_hash', hashedPassword)
        .eq('admin', true)
        .single();

      if (error || !data) {
        toast({
          title: "Inloggning misslyckades",
          description: "Felaktigt användarnamn eller lösenord, eller så har du inte administratörsbehörighet.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Admin verifierad",
        description: "Du kan nu skapa en ny användare.",
      });

      setStep('create-user');
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Fel",
        description: "Ett oväntat fel uppstod vid verifiering.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate all fields
      if (!username || !firstName || !lastName || !password || !confirmPassword) {
        toast({
          title: "Fel",
          description: "Vänligen fyll i alla fält.",
          variant: "destructive"
        });
        return;
      }

      // Validate password confirmation
      if (password !== confirmPassword) {
        toast({
          title: "Fel",
          description: "Lösenorden matchar inte.",
          variant: "destructive"
        });
        return;
      }

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        toast({
          title: "Fel",
          description: "Användarnamnet finns redan.",
          variant: "destructive"
        });
        return;
      }

      // Hash the password
      const hashedPassword = CryptoJS.SHA256(password).toString();
      
      // Combine first name and last name for full_name
      const fullName = `${firstName} ${lastName}`;

      // Create the new user
      const { error } = await supabase
        .from('users')
        .insert({
          username,
          full_name: fullName,
          password_hash: hashedPassword,
          admin: isAdmin,
          Access_informationboard: true
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Användare skapad",
        description: `Användaren ${username} har skapats framgångsrikt.`,
      });

      // Reset form and redirect to login
      setUsername('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setConfirmPassword('');
      setIsAdmin(false);
      setAdminUsername('');
      setAdminPassword('');
      
      navigate('/login');
    } catch (error) {
      console.error('User creation error:', error);
      toast({
        title: "Fel",
        description: "Ett fel uppstod vid skapande av användaren.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'admin-login') {
    return (
      <AdminLoginForm
        adminUsername={adminUsername}
        adminPassword={adminPassword}
        isLoading={isLoading}
        onUsernameChange={setAdminUsername}
        onPasswordChange={setAdminPassword}
        onSubmit={handleAdminLogin}
      />
    );
  }

  return (
    <CreateUserForm
      username={username}
      firstName={firstName}
      lastName={lastName}
      password={password}
      confirmPassword={confirmPassword}
      isAdmin={isAdmin}
      isLoading={isLoading}
      onUsernameChange={setUsername}
      onFirstNameChange={setFirstName}
      onLastNameChange={setLastName}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onAdminChange={setIsAdmin}
      onSubmit={handleCreateUser}
      onBack={() => setStep('admin-login')}
    />
  );
};

export default Signup;
