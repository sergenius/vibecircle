import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Heart, Users, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit', // Only validate on submit, not on every change
    reValidateMode: 'onChange', // After first submit, validate on change
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
    } catch (error) {
      setError('root', { message: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Video,
      title: 'Authentic Video Introductions',
      description: 'Share who you really are with 15-second video vibes',
    },
    {
      icon: Users,
      title: 'Interest-Based Communities',
      description: 'Join circles of people who share your passions',
    },
    {
      icon: Heart,
      title: 'AI-Powered Friend Matching',
      description: 'Discover meaningful connections through smart compatibility',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl font-bold">VC</span>
            </div>
            <h1 className="text-3xl font-bold">VibeCircle</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Where Authentic Friendships Begin
          </h2>
          
          <p className="text-xl opacity-90 mb-12">
            Connect with like-minded people through video introductions, join communities that match your interests, and build genuine friendships that last.
          </p>

          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="opacity-90">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">VC</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sign in to continue building authentic connections
              </p>
            </div>

            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your VibeCircle account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="Enter your email"
                error={errors.email?.message}
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errors.root && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.root.message}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
                isLoading={isLoading}
              >
                Sign In
              </Button>

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    New to VibeCircle?
                  </span>
                </div>
              </div>

              <Link to="/register" className="block">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </form>
          </div>

          <p className="text-center text-sm text-white lg:text-gray-500 mt-6">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="underline">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}