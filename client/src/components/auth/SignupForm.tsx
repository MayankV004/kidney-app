import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { motion } from 'framer-motion';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signup(data.email, data.password, data.name);
    } catch (err) {
      setError('Could not create your account. Please try again.');
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
        <h2 className="text-2xl font-bold text-neutral-900">Create Your Account</h2>
        <p className="text-neutral-600 mt-2">Sign up to start tracking your kidney health</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-error-500/10 border border-error-500/30 text-error-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User className="h-5 w-5 text-neutral-400" />}
          error={errors.name?.message}
          {...register('name')}
        />
        
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
        
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-5 w-5 text-neutral-400" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        
        <div className="flex items-start mt-4">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-neutral-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-neutral-700">
              I agree to the <a href="#" className="text-primary-500 hover:underline">Terms of Service</a>{' '}
              and <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
            </label>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
        >
          Create Account
        </Button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-sm text-neutral-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </motion.div>
  );
};