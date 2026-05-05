import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";

const STORAGE_KEY = "typeburn-language";

function getBrowserLanguage(): string {
  const lang = navigator.language;
  return lang.split("-")[0] ?? "en";
}

function resolveInitialLanguage(searchParams: URLSearchParams): string {
  const param = searchParams.get("lang");
  if (param) return param;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  } catch {
    /* noop */
  }

  return getBrowserLanguage();
}

export function useLanguage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => api.getLanguages(),
    staleTime: Infinity,
  });

  const [language, setLanguageState] = useState<string>(() =>
    resolveInitialLanguage(searchParams),
  );

  // Re-validate once languages are loaded
  useEffect(() => {
    if (!languages || languages.length === 0) return;
    const validCodes = new Set(languages.map((l) => l.code));
    if (!validCodes.has(language)) {
      setLanguageState("en");
    }
  }, [languages, language]);

  const setLanguage = (code: string) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* noop */
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("lang", code);
        return next;
      },
      { replace: true },
    );
  };

  return [language, setLanguage] as const;
}
