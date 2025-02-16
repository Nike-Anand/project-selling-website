import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  Button  from '../components/button';
import Input from '../components/input';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import Alert from '../components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Add your authentication logic here
      console.log('Form submitted:', formData);
      // On success, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Add your Google authentication logic here
      console.log('Google sign in clicked');
      // On success, navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred with Google sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-300  flex items-center justify-center p-4">
        <div className="bg-blue-300 shadow-md rounded-md p-8 w-96 shadow-lg">
      <Card className="w-full max-w-md ">
        <CardHeader className="bg-white">
          <h1 className="text-2xl font-bold text-center ">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-center text-gray-600">
            {isSignUp 
              ? 'Sign up to get started' 
              : 'Sign in to continue to your account'}
          </p>
        </CardHeader>
        
        <CardContent>
          <Button
            variant="outline"
            className="w-full mb-4 flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img 
              src="src\components\google.png" 
              alt="Google" 
              className="w-5 h-5"
            />
            Continue with Google 
          </Button>

          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-gray-300 w-full" />
            <span className="bg-white px-2 text-sm text-gray-500 absolute">
              Or continue with email  
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-mg">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            

            {isSignUp && (
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: ''
                });
              }}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
    </div>
   
  );
};

export default SignInPage;