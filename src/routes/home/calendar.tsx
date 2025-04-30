import { Calendar } from "@/components/calendar_mobile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/calendar")({
	component: Calendar,
});
