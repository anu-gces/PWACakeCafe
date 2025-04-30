import { Settings } from "@/components/settings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/settings")({
	component: Settings,
});
