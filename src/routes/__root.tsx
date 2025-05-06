import { AuthProvider } from "@/components/contexts/authProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/contexts/themeProvider";
import { globalError404 } from "@/components/globalError404";
import { Toaster } from "@/components/ui/sonner";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, Info, Loader, TriangleAlert } from "lucide-react";
import SplashScreen from "@/components/splashscreen";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div>
        <AuthProvider>
          <Outlet />

          <Toaster
            closeButton
            icons={{
              success: <CheckCircle />,
              info: <Info />,
              warning: <AlertCircle />,
              error: <TriangleAlert />,
              loading: <Loader />,
            }}
          />
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </div>
    </ThemeProvider>
  ),
  notFoundComponent: globalError404,
  pendingComponent: SplashScreen,
});
