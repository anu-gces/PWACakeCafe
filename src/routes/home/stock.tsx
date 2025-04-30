import { Stock } from "@/components/stock";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/stock")({
  component: Stock,
});
