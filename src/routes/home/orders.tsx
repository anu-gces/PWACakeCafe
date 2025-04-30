import { createFileRoute } from "@tanstack/react-router";
// import { Orders } from "@/components/restaurant_mobile/orders";
import { Orders } from "@/components/restaurant/orders";
import { MenuCategory } from "./editMenu";

type Search = {
  category: MenuCategory;
};

export const Route = createFileRoute("/home/orders")({
  validateSearch: (search: Record<string, unknown>): Search => {
    return {
      category: (search.category as MenuCategory) || "",
    };
  },
  component: Orders,
});
