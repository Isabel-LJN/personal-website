"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/locale-context";
import {
  filterSearchIndex,
  type SearchIndexItem,
} from "@/lib/search";

interface SiteSearchProps {
  className?: string;
}

function isMacPlatform() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

export function SiteSearch({ className }: SiteSearchProps) {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();
  const dialogId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchIndexItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(0);
  const [isMac, setIsMac] = useState(false);

  const results = filterSearchIndex(items, query);

  const loadIndex = useCallback(async () => {
    if (loaded || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?locale=${locale}`);
      const data = (await res.json()) as { items: SearchIndexItem[] };
      setItems(data.items ?? []);
      setLoaded(true);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [locale, loaded, loading]);

  const openSearch = useCallback(() => {
    setOpen(true);
    void loadIndex();
  }, [loadIndex]);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const navigateTo = useCallback(
    (item: SearchIndexItem) => {
      closeSearch();
      router.push(item.href);
    },
    [closeSearch, router]
  );

  useEffect(() => {
    setIsMac(isMacPlatform());
    setMounted(true);
  }, []);

  useEffect(() => {
    setLoaded(false);
    setItems([]);
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) {
            setQuery("");
            setSelected(0);
            return false;
          }
          void loadIndex();
          return true;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loadIndex]);

  useEffect(() => {
    if (!open) return;

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, closeSearch]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${selected}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      e.preventDefault();
      navigateTo(results[selected]);
    }
  };

  const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="site-search-overlay"
          role="presentation"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-label`}
            className="site-search-dialog"
            initial={reduce ? false : { opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce ? undefined : { opacity: 0, y: -8, scale: 0.985 }
            }
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <label id={`${dialogId}-label`} className="sr-only">
              {dict.common.searchPlaceholder}
            </label>

            <div className="site-search-input-wrap">
              <span className="site-search-input-icon" aria-hidden>
                ⌕
              </span>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={dict.common.searchPlaceholder}
                className="site-search-input"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="site-search-kbd">{shortcutLabel}</kbd>
            </div>

            <div ref={listRef} className="site-search-results" role="listbox">
              {loading && (
                <p className="site-search-empty">{dict.common.searchLoading}</p>
              )}

              {!loading && results.length === 0 && (
                <p className="site-search-empty">
                  {query.trim()
                    ? dict.common.searchNoResults
                    : dict.common.searchEmpty}
                </p>
              )}

              {!loading &&
                results.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    data-index={index}
                    aria-selected={index === selected}
                    className={cn(
                      "site-search-result",
                      index === selected && "site-search-result--active"
                    )}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => navigateTo(item)}
                  >
                    <span
                      className={cn(
                        "site-search-badge",
                        item.kind === "blog"
                          ? "site-search-badge--blog"
                          : "site-search-badge--work"
                      )}
                    >
                      {item.kind === "blog"
                        ? dict.common.searchBlog
                        : dict.common.searchWork}
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-medium text-[var(--color-foreground)]">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-relaxed text-[var(--color-text-dim)]">
                        {item.excerpt}
                      </span>
                    </span>
                    {item.categoryLabel && (
                      <span className="site-search-category hidden sm:inline">
                        {item.categoryLabel}
                      </span>
                    )}
                  </button>
                ))}
            </div>

            <div className="site-search-footer">
              <span>{dict.common.searchHint}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className={cn("aw-search site-search-trigger", className)}
        aria-label={dict.common.searchPlaceholder}
      >
        <span className="site-search-input-icon" aria-hidden>
          ⌕
        </span>
        <span className="min-w-0 flex-1 truncate text-left">
          {dict.common.searchPlaceholder}
        </span>
        <kbd className="site-search-kbd hidden shrink-0 sm:inline-flex">
          {shortcutLabel}
        </kbd>
      </button>

      {mounted ? createPortal(modal, document.body) : null}
    </>
  );
}
