import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { useEffect } from "react";

export function CalendarDateRangePicker({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7), // Set `from` to 7 days prior
    to: new Date(), // Set `to` to today
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (date) {
      const formattedDate = {
        from: date.from ? format(date.from, "yyyy-MM-dd") : undefined,
        to: date.to ? format(date.to, "yyyy-MM-dd") : undefined,
      };

      // Navigate with the from and to parameters
      navigate({
        to: "/home/dashboard",
        search: (prev: { [key: string]: string }) => ({
          ...prev,
          ...formattedDate,
        }),
      });
    } else {
      // Remove the from and to parameters from the URL
      navigate({
        to: "/home/dashboard",
        search: (prev: { [key: string]: string }) => {
          const { from, to, ...rest } = prev;
          return rest;
        },
      });
    }
  }, [date, navigate]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("max-w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 w-4 h-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
