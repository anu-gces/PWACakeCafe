import Dashboard from "@/components/dashboard_mobile/dashboard";
import { Error404 } from "@/components/error404";
import SplashScreen from "@/components/splashscreen";
import { getOrdersInRange } from "@/firebase/firestore";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { subDays } from "date-fns";

export type Tab = "overview" | "analytics" | "reports" | "notifications";

type Search = {
  tab?: Tab;
  from?: string;
  to?: string;
};

export const Route = createFileRoute("/home/dashboard")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const validTabs: Tab[] = ["overview", "analytics", "reports", "notifications"];
    const tab = validTabs.includes((search.tab as string)?.toLowerCase() as Tab)
      ? ((search.tab as string).toLowerCase() as Tab)
      : "overview";

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const defaultFromDate = subDays(new Date(), 7);
    const defaultToDate = new Date();
    const from =
      typeof search.from === "string" && dateRegex.test(search.from)
        ? search.from
        : defaultFromDate.toISOString().split("T")[0];
    const to =
      typeof search.to === "string" && dateRegex.test(search.to)
        ? search.to
        : defaultToDate.toISOString().split("T")[0];

    return {
      tab: tab,
      from: from,
      to: to,
    };
  },
  component: Dashboard,
  loaderDeps: ({ search: { from, to } }) => ({ from, to }),
  loader: async ({ deps: { from, to }, context: { queryClient } }) => {
    return queryClient.ensureQueryData(dashboardQueryOptions({ from: from!, to: to! }));
  },
  pendingComponent: SplashScreen,
  errorComponent: Error404,
});

export const dashboardQueryOptions = ({ from, to }: { from: string; to: string }) =>
  queryOptions({
    queryKey: ["orderHistory"],
    queryFn: () => getOrdersInRange(from, to),
    placeholderData: [],
    staleTime: Infinity,
    gcTime: Infinity,
  });
