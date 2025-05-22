import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Welcome Back</h2>
        <p className="text-neutral-600 mt-2">Sign in to access your kidney health tracker</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-error-500/10 border border-error-500/30 text-error-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          icon={<Mail className="h-5 w-5 text-neutral-400" />}
          error={errors.email?.message}
          {...register('email')}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5 text-neutral-400" />}
          error={errors.password?.message}
          {...register('password')}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-neutral-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="text-primary-500 hover:text-primary-600">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Sign In
        </Button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-neutral-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </motion.div>
  );
};