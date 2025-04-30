import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/ui/daterangepicker";
import { Overview } from "./overview";
import { Analytics } from "./analytics";
import { Download, Share } from "lucide-react";
import { toast } from "sonner";
import { Tab, Route as dashboardRoute } from "../../routes/home/dashboard";
import { useNavigate } from "@tanstack/react-router";
import { Notifications } from "../notifications";
import { Reports } from "./reports";

export default function Dashboard() {
  const navigate = useNavigate();
  const { tab } = dashboardRoute.useSearch() as { tab: Tab };

  const handleTabChange = (newTabUntyped: string) => {
    const newTab: Tab = newTabUntyped as Tab;

    navigate({
      to: "/home/dashboard",
      search: (prev: { [key: string]: string }) => ({ ...prev, tab: newTab }),
    });
  };
  return (
    <>
      <div className="hidden md:flex flex-col h-full">
        <div className="flex-1 space-y-4 pt-6 h-full">
          <Tabs
            defaultValue="overview"
            className="flex flex-col space-y-4 h-full"
            onValueChange={handleTabChange}
            value={tab}
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <div className="flex items-center space-x-2">
                <CalendarDateRangePicker />
                <Button
                  className="gap-2"
                  onClick={() => {
                    toast.success("bruh");
                  }}
                >
                  <Download color="#ffffff" size={16} /> Download
                </Button>
                <Button className="gap-2">
                  <Share color="#ffffff" size={16} /> Share
                </Button>
              </div>
            </div>
            <TabsContent value="overview" className="space-y-4 h-full">
              <div className="flex flex-col gap-4 h-full">
                <Overview />
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4 h-full">
              <div className="flex flex-col gap-4 h-full">
                <Analytics />
              </div>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4 h-full">
              <div className="flex flex-col h-full">
                <Reports />
              </div>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4 h-full">
              <Notifications />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
