import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "@/api/axios"; 
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { Eye, EyeOff, Wallet, ArrowRight, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { GradientText } from '@/components/GradientText';
import { CinematicBackground } from '@/components/SpotlightBackground';
import { initLenis, destroyLenis } from '@/utils/lenis';

const Login = () => {
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

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.access_token;

      if (!token) {
        toast.error("Login failed: Invalid response from server");
        return;
      }

      // 1. Save token
      localStorage.setItem("token", token);

      // 2. SAVE EMAIL (This is the new line!)
      localStorage.setItem("email", email);

      toast.success("Login successful!");

      navigate("/reports"); // Or "/dashboard" depending on your route

    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Invalid email or password";
      toast.error(msg);
    }
  };


  return (
    <CinematicBackground>
      <div className="w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <GlassCard className="p-8 glow-border-always" hover={false}>
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center relative overflow-hidden">
                  <Wallet className="w-8 h-8 text-white relative z-10" />
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                {/* Glow effect */}
                <div 
                  className="absolute -inset-4 rounded-3xl -z-10"
                  style={{
                    background: 'radial-gradient(circle, hsl(var(--glow-primary) / 0.3) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                />
              </div>
            </motion.div>

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-3 font-display">
                Welcome to <GradientText>FinanceX</GradientText>
              </h1>
              <p className="text-muted-foreground">Sign in to manage your finances</p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="input-glass"
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-glass pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-primary" 
                  />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline hover:text-glow-secondary transition-colors">
                  Forgot password?
                </a>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 rounded-xl gradient-bg font-semibold flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10">Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                <motion.div 
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.button>
            </form>

            {/* Footer */}
            <motion.p 
              className="text-center text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium hover:text-glow-secondary transition-colors">
                Sign up
              </Link>
            </motion.p>
          </GlassCard>
        </motion.div>

        {/* Trust badge */}
        <motion.div 
          className="flex items-center justify-center gap-2 mt-6 text-muted-foreground/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Trusted by 10,000+ users worldwide</span>
        </motion.div>
      </div>
    </CinematicBackground>
  );
};

export default Login;