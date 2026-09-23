import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthSplitLayout from '../components/AuthSplitLayout';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await registerUser(values.username, values.email, values.password);
      success('Account ignited! Welcome to The Chronicle.');
      navigate(redirectUrl);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to create account. Please try again.';
      setServerError(msg);
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeSwitch = (target: 'login' | 'register') => {
    if (target === 'login') {
      navigate(`/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
    }
  };

  return (
    <AuthSplitLayout mode="register" onModeSwitch={handleModeSwitch}>
      <motion.div
        key="register-panel"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ink-magenta to-ink-cyan text-white flex items-center justify-center mx-auto mb-3 shadow-glow-magenta">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white dark:text-white not-dark:text-ink-lightText">
            Join The Chronicle
          </h1>
          <p className="text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500 mt-1">
            Create an account to pour your thoughts onto living parchment.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700 mb-1"
            >
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-ink-cyan transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input
                id="username"
                type="text"
                {...register('username')}
                placeholder="e.g. elena_aurora"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
                  errors.username
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-cyan/40 focus:border-ink-cyan'
                } text-white dark:text-white not-dark:text-stone-900 placeholder-stone-500`}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-rose-400 font-medium">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-ink-cyan transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-cyan/40 focus:border-ink-cyan'
                } text-white dark:text-white not-dark:text-stone-900 placeholder-stone-500`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700 mb-1"
            >
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-ink-magenta transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Minimum 6 characters"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-magenta/40 focus:border-ink-magenta'
                } text-white dark:text-white not-dark:text-stone-900 placeholder-stone-500`}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-ink-magenta transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="Repeat password"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-white/15 dark:border-white/15 not-dark:border-stone-300 focus:ring-ink-magenta/40 focus:border-ink-magenta'
                } text-white dark:text-white not-dark:text-stone-900 placeholder-stone-500`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-400 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Liquid Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="liquid-button w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-white text-sm font-semibold shadow-glow-magenta disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-ink-textMuted">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className="text-ink-cyan font-semibold hover:underline"
          >
            Sign in here
          </button>
        </div>
      </motion.div>
    </AuthSplitLayout>
  );
};

export default RegisterPage;
