import React from "react";
import { motion } from "framer-motion";

// Fade + Slide-Up Animation Wrapper
const Reveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
export { Reveal };