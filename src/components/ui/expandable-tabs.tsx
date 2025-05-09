"use client";

import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { listenToKanbanCardDocument } from "@/firebase/firestore";
import { toast } from "sonner";

interface Tab {
  title: string;
  icon: LucideIcon;
  to: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

export type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({ tabs, className, activeColor = "text-primary", onChange }: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const [notificationCount, setNotificationCount] = React.useState(0);

  const navigate = useNavigate({ from: "/home" });
  const currentLocation = useLocation();

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  React.useEffect(() => {
    const currentPath = currentLocation.pathname; // Get the current path from useLocation

    const selectedIndex = tabs.findIndex((tab) => {
      if ("to" in tab && typeof tab.to === "string") {
        const tabPath = new URL(tab.to, window.location.origin).pathname;
        return tabPath === currentPath;
      }
      return false;
    });

    if (selectedIndex !== -1) {
      setSelected(selectedIndex); // Update the selected tab index
    }
  }, [tabs, currentLocation]);

  // React.useEffect(() => {
  //   const unsub = listenToKanbanCardDocument((items) => {
  //     // Filter items for runningLow and outOfStock columns
  //     const count = items.filter((item) => item.column === "runningLow" || item.column === "outOfStock").length;

  //     setNotificationCount(count); // Update the notification count
  //   });

  //   return () => unsub(); // Cleanup on unmount
  // }, []);

  React.useEffect(() => {
    const unsub = listenToKanbanCardDocument((items) => {
      // Filter items for runningLow and outOfStock columns
      const count = items.filter((item) => item.column === "runningLow" || item.column === "outOfStock").length;

      setNotificationCount(count); // Update the notification count

      // Check for the latest updatedAt timestamp
      const THRESHOLD_MS = 5000; // 5 seconds threshold
      const now = new Date().getTime();

      items.forEach((item) => {
        const updatedAt = new Date(item.updatedAt).getTime();
        if (now - updatedAt <= THRESHOLD_MS) {
          toast(
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 mt-auto mb-auto w-2 h-2 rounded-full ${
                  item.column === "outOfStock" ? "bg-red-500" : "bg-yellow-400"
                }`}
              />
              <div>
                <p className="font-semibold text-base">{item.title}</p>
                <p className="text-muted-foreground text-sm">
                  Marked <span className="font-medium">{item.column}</span> by{" "}
                  <span className="font-medium">{item.displayName}</span>
                </p>
                <span className="text-muted-foreground text-xs">Just now</span>
              </div>
            </div>
          );
        }
      });
    });

    return () => unsub(); // Cleanup on unmount
  }, []);

  const Separator = () => <div className="mx-1 bg-border w-[1.2px] h-[24px]" aria-hidden="true" />;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm", className)}>
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => {
              handleSelect(index);
              navigate({ to: tab.to });
            }}
            transition={transition}
            className={cn(
              "relative flex items-center flex-1 rounded-xl px-4 py-2 text-sm font-medium text-center justify-center transition-colors duration-300",
              selected === index
                ? cn("bg-muted", activeColor)
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="relative">
              {tab.title === "Notifications" && notificationCount > 0 && (
                <div className="-top-1 -left-2 absolute flex justify-center items-center bg-red-500 rounded-full w-4 h-4 text-white text-xs">
                  {notificationCount}
                </div>
              )}
              <Icon size={24} />
            </div>
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
