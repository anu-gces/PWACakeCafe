import { ExpandableTabs } from "./ui/expandable-tabs-vanilla";
import { KanbanBoard } from "./ui/kanbanBoard";
import { Utensils, Coffee, Donut, Monitor, Cake } from "lucide-react"; // Import relevant icons
import { TabItem } from "./ui/expandable-tabs-vanilla";

export type kanbanCategory = "Kitchen" | "Bar" | "DonutStation" | "Counter" | "Bakery";

const tabs: TabItem[] = [
  { title: "Kitchen", icon: Utensils, search: "Kitchen" },
  { title: "Bar", icon: Coffee, search: "Bar" },
  { title: "Donut Station", icon: Donut, search: "DonutStation" },
  { title: "Counter", icon: Monitor, search: "Counter" },
  { title: "Bakery", icon: Cake, search: "Bakery" },
];

export function Stock() {
  return (
    <>
      <div className="flex flex-col gap-2 px-2 w-full h-full">
        {/* Set flex-grow-0 and flex-shrink-0 to prevent stretching */}
        <div className="flex justify-start">
          <ExpandableTabs tabs={tabs} />
        </div>

        <KanbanBoard />
      </div>
    </>
  );
}
