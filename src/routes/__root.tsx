import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/contexts/themeProvider";
import { AuthProvider } from "@/components/contexts/authProvider";
import { Toaster } from "@/components/ui/sonner";
import { globalError404 } from "@/components/globalError404";
import { CheckCircle, Info, AlertCircle, Loader, TriangleAlert } from "lucide-react";

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
          {/* <TanStackRouterDevtools position="top-right" /> */}
          {/* <ReactQueryDevtools  initialIsOpen={false} /> */}
        </AuthProvider>
      </div>
    </ThemeProvider>
  ),
  notFoundComponent: globalError404,
});
