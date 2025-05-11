import { createFileRoute } from "@tanstack/react-router";
import { kanbanCategory } from "@/components/stock";

export const Route = createFileRoute("/home/stock")({
  validateSearch: (searchParams) => ({
    category: (searchParams.category as kanbanCategory) || "Kitchen", // Default to "Kitchen" if no category is provided
  }),
});
