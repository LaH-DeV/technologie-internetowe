import { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useNickname } from "./shared/hooks/use-nickname.js";
import { TypingPage } from "./pages/TypingPage.js";

const NicknamePage = lazy(() =>
  import("./pages/NicknamePage.js").then((m) => ({ default: m.NicknamePage })),
);
const Leaderboard = lazy(() =>
  import("./features/leaderboard/components/Leaderboard.js").then((m) => ({
    default: m.Leaderboard,
  })),
);

export function App() {
  const nick = useNickname();

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-bg-card">
        <Link
          to="/"
          className="text-xl font-bold font-mono fire-glow transition-colors"
        >
          <span className="fire-text">Type</span>
          <span className="text-text">Burn</span>
          <span className="ml-1 text-base" aria-hidden="true">
            🔥
          </span>
        </Link>
        <Link
          to="/leaderboard"
          className="text-sm text-text-muted hover:text-text transition-colors font-medium"
        >
          Leaderboard
        </Link>
      </header>

      <main
        className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-4 sm:py-6"
        aria-label="Main content"
      >
        <div className="w-full max-w-3xl">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20 text-text-muted">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<TypingPage nick={nick} />} />
              <Route path="/nickname" element={<NicknamePage nick={nick} />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center gap-4 py-20">
                    <p className="text-2xl font-bold">404</p>
                    <p className="text-text-muted">Page not found</p>
                    <Link
                      to="/"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                      Back to typing
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
