import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Lenis from "@studio-freight/lenis";

const PageWrapper = ({ children }) => {
  useEffect(() => {
    // Smooth scroll (Lovable)
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-6 md:p-8"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
