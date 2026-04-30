import { useLocation, useNavigate, type NavigateFunction } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import routes from "./config";

let navigateResolver: (navigate: ReturnType<typeof useNavigate>) => void;

declare global {
  interface Window {
    REACT_APP_NAVIGATE: ReturnType<typeof useNavigate>;
  }
}

export const navigatePromise = new Promise<NavigateFunction>((resolve) => {
  navigateResolver = resolve;
});

export function AppRoutes() {
  const element = useRoutes(routes);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.REACT_APP_NAVIGATE = navigate;
    navigateResolver(window.REACT_APP_NAVIGATE);
  });

  // Reset scroll to the top of every page on route change.
  // SPA navigation doesn't reset the window scroll by default, which left
  // users landing mid-page (often near the footer) after clicking links.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return element;
}
