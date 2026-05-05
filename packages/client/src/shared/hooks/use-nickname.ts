import { useState, useCallback } from "react";
import { NICKNAME_INVALID_CHARS } from "@typeburn/shared";

export function useNickname() {
  const [nickname, setNickname] = useState(() => {
    try {
      return localStorage.getItem("typeburn-nickname") ?? "";
    } catch {
      return "";
    }
  });
  const [draft, setDraft] = useState("");

  const updateDraft = useCallback((value: string) => {
    setDraft(value.replace(NICKNAME_INVALID_CHARS, "").slice(0, 20));
  }, []);

  const submit = useCallback(() => {
    const trimmed = draft.trim();
    if (!trimmed) return false;
    setNickname(trimmed);
    try {
      localStorage.setItem("typeburn-nickname", trimmed);
    } catch {
      // ignore
    }
    return true;
  }, [draft]);

  const startEditing = useCallback(() => {
    setDraft(nickname);
  }, [nickname]);

  return {
    nickname,
    draft,
    updateDraft,
    submit,
    startEditing,
  };
}
