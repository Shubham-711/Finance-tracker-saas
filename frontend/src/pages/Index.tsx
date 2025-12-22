import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { GradientText } from '@/components/GradientText';
import { AnimatedWrapper, StaggerContainer, StaggerItem } from '@/components/AnimatedWrapper';
import { initLenis, destroyLenis } from '@/utils/lenis';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Get detailed insights into your spending patterns and financial health.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and protected with industry-leading security.',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Track transactions and goals in real-time with instant synchronization.',
    },
  ];

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-glow-secondary/15 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">FinanceX</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 rounded-xl gradient-bg text-sm font-semibold"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatedWrapper className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful financial tools</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Take control of your{' '}
              <GradientText>finances</GradientText>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Track expenses, set goals, and visualize your financial journey with our 
              beautifully designed dashboard. Simple, powerful, and secure.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 rounded-xl gradient-bg font-semibold text-lg flex items-center gap-2 group"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 rounded-xl border border-white/10 font-semibold text-lg hover:bg-muted/50 transition-colors"
              >
                View Demo
              </motion.button>
            </div>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <AnimatedWrapper className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to <GradientText>succeed</GradientText>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to help you manage your money smarter and achieve your financial goals.
            </p>
          </AnimatedWrapper>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <GlassCard className="p-8 h-full" glow>
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedWrapper>
            <GlassCard className="p-12 text-center" glow>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who have transformed their financial habits with FinanceX.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 rounded-xl gradient-bg font-semibold text-lg"
              >
                Create Free Account
              </motion.button>
            </GlassCard>
          </AnimatedWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-semibold">FinanceX</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FinanceX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
