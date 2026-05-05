import { useQuery } from "@tanstack/react-query";
import type { Duration } from "@typeburn/shared";
import { api } from "../../../shared/api/client.js";

export function useLeaderboard(duration?: Duration, language?: string) {
  return useQuery({
    queryKey: ["leaderboard", duration, language],
    queryFn: () => api.getLeaderboard(duration, language),
    staleTime: 5_000,
  });
}
