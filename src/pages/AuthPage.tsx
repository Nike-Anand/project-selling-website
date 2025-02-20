import { useState, ChangeEvent, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Use effect to control the animation class
  useEffect(() => {
    // Small delay to ensure the animation starts after state change
    const timer = setTimeout(() => {
      setIsActive(isSignUp);
    }, 50);
    return () => clearTimeout(timer);
  }, [isSignUp]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between Sign In and Sign Up views
  const toggleView = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-[#c9d6ff] font-sans">
      <div className={`container bg-white rounded-[30px] shadow-lg overflow-hidden w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl relative min-h-[480px] ${isActive ? 'active' : ''}`}>
        
        {/* Sign Up Form Container */}
        <div className="form-container sign-up absolute top-0 h-full w-1/2 opacity-0 z-[1] transition-all duration-600 ease-in-out">
          <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center p-10 h-full">
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>
            
            <div className="social-icons flex mb-5 mt-4">
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-[#DB4437]">G</a>
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-[#4267B2]">f</a>
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-[#FF0000]">Y</a>
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-black">𝕏</a>
            </div>
            
            <span className="text-xs text-gray-500 mb-5">or use your email for register</span>
            
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="bg-gray-100 w-full p-3 rounded-md text-sm my-2 focus:outline-none"
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-100 w-full p-3 rounded-md text-sm my-2 focus:outline-none"
            />
            
            <div className="relative w-full my-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-100 w-full p-3 rounded-md text-sm pr-10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <div className="relative w-full my-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="bg-gray-100 w-full p-3 rounded-md text-sm pr-10 focus:outline-none"
              />
            </div>
            
            {error && (
              <div className="mt-4 text-red-500 text-sm w-full">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#512da8] text-white py-2 px-10 rounded-lg mt-6 text-xs font-semibold uppercase hover:bg-[#4527a0] transition duration-300 disabled:opacity-70"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
        
        {/* Sign In Form Container */}
        <div className="form-container sign-in absolute top-0 left-0 w-1/2 h-full z-[2] transition-all duration-600 ease-in-out">
          <form onSubmit={handleSubmit} className="bg-white flex flex-col items-center justify-center p-10 h-full">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            
            <div className="social-icons flex mb-5 mt-4">
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-[#DB4437]">G</a>
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-[#4267B2]">f</a>
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-[#FF0000]">Y</a>
              <a href="#" className="icon w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center mx-1 text-black">𝕏</a>
            </div>
            
            <span className="text-xs text-gray-500 mb-5">or use your email and password</span>
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-100 w-full p-3 rounded-md text-sm my-2 focus:outline-none"
            />
            
            <div className="relative w-full my-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-100 w-full p-3 rounded-md text-sm pr-10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <a href="#" className="text-xs text-gray-600 hover:text-[#512da8] self-end mt-2">
              Forgot Password?
            </a>
            
            {error && (
              <div className="mt-4 text-red-500 text-sm w-full">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#512da8] text-white py-2 px-10 rounded-lg mt-6 text-xs font-semibold uppercase hover:bg-[#4527a0] transition duration-300 disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        {/* Toggle Container */}
        <div className="toggle-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-[1000] rounded-l-[150px]">
          <div className="toggle bg-gradient-to-r from-[#5c6bc0] to-[#512da8] h-full w-[200%] relative left-[-100%] transition-all duration-600 ease-in-out">
            
            {/* Toggle Left Panel */}
            <div className="toggle-panel toggle-left absolute w-1/2 h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-600 ease-in-out transform -translate-x-[200%]">
              <h1 className="text-3xl font-bold text-white mb-4">Welcome Back!</h1>
              <p className="text-white text-sm mb-8">
                Enter your personal details to use all of site features.
              </p>
              <button 
                type="button"
                onClick={toggleView}
                className="bg-transparent text-white py-2 px-10 rounded-lg border border-white text-xs font-semibold uppercase hover:bg-white hover:bg-opacity-10 transition duration-300"
              >
                Sign In
              </button>
            </div>
            
            {/* Toggle Right Panel */}
            <div className="toggle-panel toggle-right absolute right-0 w-1/2 h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-600 ease-in-out">
              <h1 className="text-3xl font-bold text-white mb-4">Hello, Subscriber!</h1>
              <p className="text-white text-sm mb-8">
                Register with your personal details to use all of site features.
              </p>
              <button 
                type="button"
                onClick={toggleView}
                className="bg-transparent text-white py-2 px-10 rounded-lg border border-white text-xs font-semibold uppercase hover:bg-white hover:bg-opacity-10 transition duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        .container.active .sign-in {
          transform: translateX(100%);
        }
        
        .container.active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: move 0.6s;
        }
        
        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
        
        .container.active .toggle-container {
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }
        
        .container.active .toggle {
          transform: translateX(50%);
        }
        
        .container.active .toggle-left {
          transform: translateX(0);
        }
        
        .container.active .toggle-right {
          transform: translateX(200%);
        }
        
        .form-container,
        .toggle-container,
        .toggle,
        .toggle-panel {
          transition: all 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;