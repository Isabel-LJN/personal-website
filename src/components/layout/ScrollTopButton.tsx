"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/i18n/locale-context";

const SCROLL_THRESHOLD = 800;

export function ScrollTopButton() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 10 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleClick}
          aria-label={dict.common.scrollToTop}
          className="group fixed bottom-5 left-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-[#D55559]/72 text-white shadow-[0_4px_16px_rgba(213,85,89,0.32),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl transition-[background-color,box-shadow,border-color,transform] duration-200 hover:border-white/45 hover:bg-[#D55559]/88 hover:shadow-[0_6px_22px_rgba(213,85,89,0.4),inset_0_1px_0_rgba(255,255,255,0.35)] sm:bottom-6 sm:left-6"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
          >
            <path
              d="M8 3.5V12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M4.5 7 8 3.5 11.5 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
