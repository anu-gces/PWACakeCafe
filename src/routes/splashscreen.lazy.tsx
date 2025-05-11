import SplashScreen from "@/components/splashscreen";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/splashscreen")({
	component: SplashScreen,
});
