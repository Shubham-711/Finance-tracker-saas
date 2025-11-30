// src/components/ui/Card.jsx
import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl bg-[#0B0D13] border border-white/8 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] " +
        className
      }
    >
      {children}
    </div>
  );
}
