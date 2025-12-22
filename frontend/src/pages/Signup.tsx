import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from "@/api/axios";
import { toast } from "sonner";
import { Eye, EyeOff, Wallet, ArrowRight, Check } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { GradientText } from '@/components/GradientText';
import { AnimatedWrapper } from '@/components/AnimatedWrapper';
import { initLenis, destroyLenis } from '@/utils/lenis';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Basic validation
  if (!name || !email || !password) {
    toast.error("All fields are required");
    return;
  }

  try {
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
    });

    toast.success("Signup successful! Please login.");

    // Redirect to login page after creating account
    navigate("/login");

  } catch (error: any) {
    const msg =
      error?.response?.data?.detail ||
      "Signup failed. Try again.";

    toast.error(msg);
  }
};


  const passwordRequirements = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'One uppercase', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-glow-secondary/20 rounded-full blur-[120px]" />
      </div>

      <AnimatedWrapper className="w-full max-w-md relative z-10">
        <GlassCard className="p-8" hover={false} glow>
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center animate-glow">
              <Wallet className="w-8 h-8 text-foreground" />
            </div>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Join <GradientText>FinanceX</GradientText>
            </h1>
            <p className="text-muted-foreground">Create your account to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-white/5 outline-none focus:border-primary/50 focus:bg-muted/70 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-white/5 outline-none focus:border-primary/50 focus:bg-muted/70 transition-all placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-white/5 outline-none focus:border-primary/50 focus:bg-muted/70 transition-all placeholder:text-muted-foreground/50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password requirements */}
              <div className="flex gap-4 pt-2">
                {passwordRequirements.map((req) => (
                  <div key={req.label} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                      {req.met && <Check className="w-3 h-3" />}
                    </div>
                    <span className={req.met ? 'text-emerald-400' : 'text-muted-foreground'}>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 rounded-xl gradient-bg font-semibold flex items-center justify-center gap-2 group mt-6"
            >
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </GlassCard>
      </AnimatedWrapper>
    </div>
  );
};

export default Signup;
