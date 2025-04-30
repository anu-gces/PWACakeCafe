import SplashScreen from "@/components/splashscreen";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/splashscreen")({
  component: SplashScreen,
});
