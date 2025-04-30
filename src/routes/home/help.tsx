import { Help } from "@/components/help";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/help")({
	component: Help,
});
