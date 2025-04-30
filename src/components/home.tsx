import {
  Cake,
  CalendarPlus,
  CircleUserRound,
  Info,
  PackageOpen,
  LogOut,
  NotepadText,
  Settings2,
  Users,
  CookingPotIcon,
  WifiOff,
  Wifi,
  BellIcon,
  UtensilsCrossedIcon,
  HammerIcon,
} from "lucide-react";
import FoodClocheIcon from "@/assets/foodClocheIcon";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ui/themeToggle";
import { doSignOut } from "@/firebase/auth";
import { getCurrentUserDocumentDetails } from "@/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Home() {
  const location = useLocation();
  const navigate = useNavigate({ from: "/home" });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const getActiveButton = () => {
    const path = location.pathname.split("/")[2]; // get the second part of the route
    return path || "welcome"; // default to 'welcome' if path is undefined
  };

  const activeButton = getActiveButton();

  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUserDocumentDetails,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const logoutMutation = useMutation({
    mutationFn: doSignOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate({ to: "/" });
      toast("Logged out successfully!");
    },
  });

  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    function updateOnlineStatus() {
      if (!navigator.onLine) {
        setWasOffline(true);
        toast("No internet connection", {
          icon: <WifiOff />,
        });
      } else if (wasOffline) {
        setWasOffline(false);
        toast("You are back online!", {
          icon: <Wifi />,
        });
      }
    }

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Cleanup
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [wasOffline]);

  return (
    <div className="grid pl-[56px] w-full h-screen">
      <aside className="left-0 z-20 fixed inset-y flex flex-col border-r h-full">
        <div className="p-[0.520rem] border-b">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Home"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "welcome",
                  })}
                  onClick={() => {
                    navigate({ to: "/home/welcome" });
                  }}
                >
                  <Cake className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Welcome
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <nav className="gap-1 grid p-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="restaurant"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "restaurant",
                  })}
                  onClick={() => {
                    navigate({
                      to: `/home/restaurant`,
                      search: { category: "appetizers" },
                    });
                  }}
                >
                  <CookingPotIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Edit Menu
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="orders"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "orders",
                  })}
                  onClick={() => {
                    navigate({
                      to: `/home/orders`,
                      search: { category: "appetizers" },
                    });
                  }}
                >
                  <UtensilsCrossedIcon className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Ordering
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {user?.role === "admin" || user?.role === "owner" ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="employee"
                    className={cn("rounded-lg transition-all duration-500", {
                      "border border-primary": activeButton === "employee",
                    })}
                    onClick={() => {
                      navigate({ to: `/home/employee` });
                    }}
                  >
                    <Users className="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={5}>
                  Employees
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="stock"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "stock",
                  })}
                  onClick={() => {
                    navigate({ to: `/home/stock` });
                  }}
                >
                  <PackageOpen className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Inventory Management
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="calendar"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "calendar",
                  })}
                  onClick={() => {
                    navigate({ to: `/home/calendar` });
                  }}
                >
                  <CalendarPlus className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Calendar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="dashboard"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "dashboard",
                  })}
                  onClick={() => {
                    navigate({
                      to: `/home/dashboard`,
                      search: { tab: "overview" },
                    });
                  }}
                >
                  <NotepadText className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Dashboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="settings"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "settings",
                  })}
                  onClick={() => {
                    navigate({ to: `/home/settings` });
                  }}
                >
                  <Settings2 className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="settings"
                  className={cn("rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "settings",
                  })}
                  onClick={() => {
                    navigate({ to: `/testingRoute` });
                  }}
                >
                  <HammerIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Testing Route
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="gap-1 grid mt-auto p-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="help"
                  className={cn("mt-auto rounded-lg transition-all duration-500", {
                    "border border-primary": activeButton === "help",
                  })}
                  onClick={() => {
                    navigate({ to: `/home/help` });
                  }}
                >
                  <Info className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                Help
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isLoading ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="account"
              className={cn("mt-auto rounded-lg transition-all duration-500", {
                "border border-primary": activeButton === "account",
              })}
              onClick={() => {}}
            >
              <Skeleton className="rounded-full w-5 h-5" />
            </Button>
          ) : error ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="account"
              className={cn("mt-auto rounded-lg transition-all duration-500", {
                "border border-primary": activeButton === "account",
              })}
              onClick={() => {
                navigate({ to: `/home/account` });
              }}
            >
              <CircleUserRound className="size-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="account"
              className={cn("mt-auto rounded-lg transition-all duration-500", {
                "border border-primary": activeButton === "account",
              })}
              onClick={() => {
                navigate({ to: `/home/account` });
              }}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={user?.photoURL} alt="Profile" />
                <AvatarFallback>
                  {" "}
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
        </nav>
      </aside>
      <div className="flex flex-col h-full overflow-hidden">
        <header className="top-0 z-10 sticky flex items-center gap-1 bg-background px-4 border-b h-[57px]">
          <h1 className="font-semibold text-xl">
            {isLoading
              ? "Loading..."
              : error
                ? `Error: ${error.message}`
                : activeButton === "welcome"
                  ? `Welcome, ${user?.firstName}!`
                  : activeButton.charAt(0).toUpperCase() + activeButton.slice(1)}
          </h1>
          <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
            <PopoverTrigger asChild className="mr-2 ml-auto border border-input">
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="size-4" />
                <span className="-top-1 -right-1 absolute flex justify-center items-center bg-red-600 p-1 rounded-full w-5 h-5 font-medium text-white text-xs">
                  3
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4 w-[400px]">
              <div className="gap-4 grid">
                <div className="bg-accent p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://picsum.photos/200" alt="Avatar" />

                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-gray-500 text-sm">Mentioned you in a post</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">2h ago</p>
                  </div>
                </div>
                <div className="bg-accent p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://picsum.photos/240" alt="Avatar" />
                        <AvatarFallback>SA</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Sarah Anderson</p>
                        <p className="text-gray-500 text-sm">Sent you a message</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">30m ago</p>
                  </div>
                </div>
                <div className="bg-accent p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://picsum.photos/230" alt="Avatar" />
                        <AvatarFallback>MC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Michael Chen</p>
                        <p className="text-gray-500 text-sm">Liked your post</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">1d ago</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/home/dashboard",
                      search: { tab: "notifications" },
                    })
                  }
                  variant="outline"
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground text-sm"
                >
                  See all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className="gap-1.5 text-sm"
            onClick={() => {
              logoutMutation.mutate();
            }}
          >
            <LogOut className="size-5" />
            Logout
          </Button>
          <ModeToggle />
        </header>
        <main className="flex-grow flex-1 gap-4 p-4 h-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
