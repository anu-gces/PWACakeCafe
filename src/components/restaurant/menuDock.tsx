import { Link } from "@tanstack/react-router";
import { Beer, Coffee, IceCream, Pizza, Soup, Star } from "lucide-react";
import { Dock, DockIcon } from "../ui/dock";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type MenuDockProps = {
  route: "editMenu" | "orders";
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
    <Dock className="bottom-4 left-1/2 fixed -translate-x-1/2">
      {dockItems.map((item, index) => (
        <DockIcon key={index} className="flex m-0 p-0">
          <TooltipProvider delayDuration={200} skipDelayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="m-0 p-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white w-full h-full">
                <Link
                  to={`/home/${route}`}
                  search={{ category: item.category }}
                  className="flex p-2 rounded-full w-full h-full"
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
