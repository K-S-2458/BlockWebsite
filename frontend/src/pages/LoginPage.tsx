import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, ArrowRight, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthSplitLayout from '../components/AuthSplitLayout';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await login(values.email, values.password);
      success('Welcome back to The Chronicle.');
      navigate(redirectUrl);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to sign in. Please verify your credentials.';
      setServerError(msg);
      error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeSwitch = (target: 'login' | 'register') => {
    if (target === 'register') {
      navigate(`/register${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`);
    }
  };

  return (
    <AuthSplitLayout mode="login" onModeSwitch={handleModeSwitch}>
      <motion.div
        key="login-panel"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 16 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ink-violet to-ink-magenta text-white flex items-center justify-center mx-auto mb-3 shadow-glow-magenta">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white dark:text-white not-dark:text-ink-lightText">
            Welcome back
          </h1>
          <p className="text-xs text-ink-textMuted dark:text-ink-textMuted not-dark:text-stone-500 mt-1">
            Enter your credentials to manage your publications.
          </p>
        </div>

        {serverError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700 mb-1.5"
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
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
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

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider font-semibold text-stone-300 dark:text-stone-300 not-dark:text-stone-700 mb-1.5"
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
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-white/5 dark:bg-white/5 not-dark:bg-white/70 focus:outline-none focus:ring-2 transition-all ${
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

          {/* Liquid Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="liquid-button w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-white text-sm font-semibold shadow-glow-magenta disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-ink-textMuted">
          <span>Need an account? </span>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className="text-ink-cyan font-semibold hover:underline"
          >
            Create an account
          </button>
        </div>
      </motion.div>
    </AuthSplitLayout>
  );
};

export default LoginPage;
