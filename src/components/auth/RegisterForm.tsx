import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  username: z.string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z.string().min(1, 'Display name is required').min(2, 'Display name must be at least 2 characters'),
  age: z.coerce.number().min(13, 'You must be at least 13 years old').max(120, 'Please enter a valid age'),
  interests: z.array(z.string()).min(3, 'Please select at least 3 interests'),
  agreeTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const availableInterests = [
  'Photography', 'Travel', 'Cooking', 'Music', 'Art', 'Reading', 'Fitness',
  'Gaming', 'Technology', 'Writing', 'Dancing', 'Hiking', 'Movies', 'Fashion',
  'Gardening', 'Yoga', 'Coffee', 'Animals', 'Sports', 'Learning', 'Meditation',
  'Board Games', 'Crafts', 'Volunteering', 'Food', 'Nature', 'Design', 'Business',
];

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      displayName: '',
      age: undefined,
      interests: [],
      agreeTerms: false,
    },
  });

  const watchedFields = watch();

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    setSelectedInterests(newInterests);
    setValue('interests', newInterests);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['email', 'password', 'confirmPassword'];
    } else if (step === 2) {
      fieldsToValidate = ['username', 'displayName', 'age'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser({
        email: data.email,
        password: data.password,
        username: data.username,
        displayName: data.displayName,
        age: data.age,
        interests: data.interests,
      });
    } catch (error) {
      setError('root', { message: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(watchedFields.password || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-purple-600"
              initial={{ width: '33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">VC</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Join VibeCircle
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Step {step} of 3 - {
                  step === 1 ? 'Create your account' :
                  step === 2 ? 'Tell us about yourself' :
                  'Choose your interests'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Account Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Input
                    {...register('email')}
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    error={errors.email?.message}
                    autoComplete="email"
                  />

                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      placeholder="Create a strong password"
                      error={errors.password?.message}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {watchedFields.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded ${
                              i < passwordStrength
                                ? passwordStrength <= 2 ? 'bg-red-500' :
                                  passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Password strength: {
                          passwordStrength <= 2 ? 'Weak' :
                          passwordStrength <= 3 ? 'Medium' :
                          passwordStrength <= 4 ? 'Strong' : 'Very Strong'
                        }
                      </p>
                    </div>
                  )}

                  <Input
                    {...register('confirmPassword')}
                    type="password"
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    error={errors.confirmPassword?.message}
                    autoComplete="new-password"
                  />
                </motion.div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <Input
                    {...register('username')}
                    type="text"
                    label="Username"
                    placeholder="Choose a unique username"
                    error={errors.username?.message}
                    helperText="This is how others will find you. Only letters, numbers, and underscores."
                  />

                  <Input
                    {...register('displayName')}
                    type="text"
                    label="Display Name"
                    placeholder="Your full name or preferred name"
                    error={errors.displayName?.message}
                    helperText="This is what others will see on your profile."
                  />

                  <Input
                    {...register('age', { valueAsNumber: true })}
                    type="number"
                    label="Age"
                    placeholder="Your age"
                    error={errors.age?.message}
                    min="13"
                    max="120"
                  />
                </motion.div>
              )}

              {/* Step 3: Interests */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      What are you interested in?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Select at least 3 interests to help us connect you with like-minded people.
                    </p>
                    
                    {errors.interests && (
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                        {errors.interests.message}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {availableInterests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedInterests.includes(interest)
                              ? 'bg-teal-500 text-white shadow-md transform scale-105'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {selectedInterests.includes(interest) && (
                            <Check className="w-3 h-3 inline mr-1" />
                          )}
                          {interest}
                        </button>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Selected: {selectedInterests.length} / 3 minimum
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      {...register('agreeTerms')}
                      type="checkbox"
                      id="agreeTerms"
                      className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link to="/terms" className="text-teal-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-teal-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.agreeTerms.message}
                    </p>
                  )}
                </motion.div>
              )}

              {errors.root && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.root.message}
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="ghost">
                      Already have an account?
                    </Button>
                  </Link>
                )}

                {step < 3 ? (
                  <Button type="button" variant="primary" onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700"
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}