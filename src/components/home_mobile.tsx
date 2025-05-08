import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { doSignOut } from "@/firebase/auth";
import { getCurrentUserDocumentDetails } from "@/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  BellIcon,
  CalendarIcon,
  DollarSignIcon,
  HelpCircleIcon,
  HistoryIcon,
  MenuIcon,
  PackageOpenIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  UtensilsIcon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ExpandableTabs, type TabItem } from "./ui/expandable-tabs";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./ui/themeToggle";
import fallbackAvatar from "@/assets/fallbackAvatar.png";

const tabs: TabItem[] = [
  {
    title: "Order",
    icon: UtensilsIcon,
    to: '/home/editMenu?category="appetizers"',
  },
  {
    title: "History",
    icon: HistoryIcon,
    to: "/home/billing",
  },
  { title: "Notifications", icon: BellIcon, to: "/home/notifications" },
  { title: "Stocks", icon: PackageOpenIcon, to: "/home/stock" },
  { type: "separator" },
  { title: "Calendar", icon: CalendarIcon, to: "/home/calendar" },
  {
    title: "Dashboard",
    icon: DollarSignIcon,
    to: "/home/dashboard?tab=overview",
  },
];

export function Home() {
  const navigate = useNavigate({ from: "/home" });

  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUserDocumentDetails,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
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
          icon: <WifiOffIcon />,
        });
      } else if (wasOffline) {
        setWasOffline(false);
        toast("You are back online!", {
          icon: <WifiIcon />,
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

  const splash = document.querySelector(".splash-container");
  if (splash) splash.remove();

  return (
    <div className="flex flex-col justify-between h-[100dvh]">
      <div className="flex justify-between items-center bg-background shadow-md dark:shadow-2xl p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="bg-muted rounded-full w-8 h-8 animate-pulse" />
          ) : error ? (
            <div className="text-red-500">Error loading user</div>
          ) : (
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer">
                  <AvatarImage src={user?.profilePicture || user?.photoURL || fallbackAvatar} alt="User Avatar" />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0).toUpperCase() || "U"}
                    {user?.lastName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DrawerTrigger>
              <DrawerContent className="flex flex-col justify-between h-full">
                <DrawerHeader>
                  <DrawerTitle>Settings</DrawerTitle>
                  <DrawerDescription className="text-xs text-nowrap">
                    Manage your profile and account settings here.
                  </DrawerDescription>
                </DrawerHeader>
                <Separator />
                <div className="flex flex-col flex-grow justify-center items-start space-y-2">
                  <Link
                    to="/home/account"
                    className="flex items-center space-x-3 p-3 rounded-md text-muted-foreground hover:text-foreground text-sm transition-all duration-300"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </Link>

                  <Link
                    to="/home/employee"
                    className="flex items-center space-x-3 p-3 rounded-md text-muted-foreground hover:text-foreground text-sm transition-all duration-300"
                  >
                    <UsersIcon className="w-5 h-5" />
                    <span>Employee Management</span>
                  </Link>

                  <Link
                    to="/home/dashboard"
                    className="flex items-center space-x-3 p-3 rounded-md text-muted-foreground hover:text-foreground text-sm transition-all duration-300"
                  >
                    <BellIcon className="w-5 h-5" />
                    <span>Notifications</span>
                  </Link>

                  <Link
                    to="/home/settings"
                    className="flex items-center space-x-3 p-3 rounded-md text-muted-foreground hover:text-foreground text-sm transition-all duration-300"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span>Account Settings</span>
                  </Link>

                  <Link
                    to="/home/help"
                    className="flex items-center space-x-3 p-3 rounded-md text-muted-foreground hover:text-foreground text-sm transition-all duration-300"
                  >
                    <HelpCircleIcon className="w-5 h-5" />
                    <span>Help</span>
                  </Link>
                </div>
                <Separator />

                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button onClick={() => logoutMutation.mutate()}>Logout</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </div>

        <Drawer direction="right">
          <DrawerTrigger>
            <MenuIcon />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Quick Access Menu</DrawerTitle>
              <DrawerDescription className="text-xs text-nowrap">Visit Frequently Used Pages</DrawerDescription>
            </DrawerHeader>
            <Separator />
            <div className="flex flex-col flex-grow justify-center items-start space-y-2">
              <div className="flex items-center space-x-3 p-3 rounded-md text-muted-foreground hover:text-foreground text-sm transition-all duration-300">
                <ModeToggle />
                <span>Toggle Light/Dark Mode</span>
              </div>
            </div>
            <Separator />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="relative flex-grow pt-2 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </div>
      <ExpandableTabs tabs={tabs} />
    </div>
  );
}
