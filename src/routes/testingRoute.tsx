import { ExpandableTabs, TabItem } from "@/components/ui/expandable-tabs";
import { createFileRoute } from "@tanstack/react-router";
import { BellIcon, CalendarIcon, PackageOpenIcon, UserIcon, UtensilsIcon } from "lucide-react";

const tabs: TabItem[] = [
  { title: "Order", icon: UtensilsIcon, to: "/home/welcome" },
  { title: "Notifications", icon: BellIcon, to: "/home/notifications" },
  { type: "separator" },
  { title: "Calendar", icon: CalendarIcon, to: "/home/calendar" },
  { title: "Stocks", icon: PackageOpenIcon, to: "/home/stocks" },
  { title: "Settings", icon: UserIcon, to: "/home/settings" },
];

export const Route = createFileRoute("/testingRoute")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col justify-between h-[100dvh]">
        <div className="flex-grow"></div>
        <ExpandableTabs tabs={tabs} />
      </div>
    </>
  );
}
