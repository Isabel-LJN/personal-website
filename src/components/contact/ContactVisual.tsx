"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Looping paper-envelope illustration — fits the tactile site theme */
export function ContactVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="contact-visual relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[320px]">
      <motion.div
        className="absolute inset-[8%] rounded-sm border border-black/10 bg-[var(--color-surface)] shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-accent)]" />

        <svg
          viewBox="0 0 240 200"
          className="h-full w-full p-6"
          aria-hidden
        >
          <rect
            x="40"
            y="48"
            width="160"
            height="100"
            rx="4"
            fill="#faf8f4"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="1.5"
          />
          <path
            d="M40 52 L120 108 L200 52"
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <motion.g
            animate={reduce ? undefined : { y: [0, -3, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="176" cy="56" r="18" fill="#f1e500" />
            <text
              x="176"
              y="61"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="#000"
            >
              ✉
            </text>
          </motion.g>

          <motion.line
            x1="56"
            y1="130"
            x2="120"
            y2="130"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="2"
            strokeLinecap="round"
            animate={reduce ? undefined : { pathLength: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.line
            x1="56"
            y1="148"
            x2="168"
            y2="148"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2"
            strokeLinecap="round"
            animate={reduce ? undefined : { pathLength: [0.2, 0.85, 0.2] }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />

          <motion.rect
            x="56"
            y="162"
            width="10"
            height="18"
            fill="#f1e500"
            animate={reduce ? undefined : { opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
