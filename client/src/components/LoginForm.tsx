import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('handleSubmit called');
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password,
      });

      // Assuming the backend sends a token on successful login
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name);

      // Redirect to the dashboard or another protected route
      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      // Display error message from backend or a generic one
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-[350px] mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="loginForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit" form="loginForm" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </CardFooter>
      </Card>
      <div className="text-center mt-4">
        <Button variant="link" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
