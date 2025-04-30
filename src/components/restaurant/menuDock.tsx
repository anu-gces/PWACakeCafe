import { Coffee, IceCream, Pizza, Soup, Beer, Star } from "lucide-react";
import { Dock, DockIcon } from "../ui/dock";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { Link } from "@tanstack/react-router";

type MenuDockProps = {
  route: "restaurant" | "orders";
};

export function MenuDock({ route }: MenuDockProps) {
  const dockItems = [
    { category: "appetizers", icon: <Soup size="100%" />, label: "Appetizers" },
    {
      category: "main_courses",
      icon: <Pizza size="100%" />,
      label: "Main Courses",
    },
    { category: "desserts", icon: <IceCream size="100%" />, label: "Desserts" },
    { category: "beverages", icon: <Coffee size="100%" />, label: "Beverages" },
    {
      category: "hard_drinks",
      icon: <Beer size="100%" />,
      label: "Hard Drinks",
    },
    { category: "specials", icon: <Star size="100%" />, label: "Specials" },
  ] as const;

  return (
    <Dock className="fixed bottom-4 left-1/2 -translate-x-1/2">
      {dockItems.map((item, index) => (
        <DockIcon key={index} className="p-0 m-0 flex">
          <TooltipProvider delayDuration={200} skipDelayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="focus:outline-none focus-visible:ring-2 p-0 m-0 focus-visible:ring-white rounded-full h-full w-full ">
                <Link
                  to={`/home/${route}`}
                  search={{ category: item.category }}
                  className=" flex p-2  h-full w-full rounded-full"
                >
                  {item.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DockIcon>
      ))}
    </Dock>
  );
}
