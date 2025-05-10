import { useEffect, useState } from "react";
import { listenToKanbanCardDocument } from "@/firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Clock } from "lucide-react";
import type { CardType } from "./ui/kanbanBoard";

export function Notifications() {
  const [items, setItems] = useState<CardType[] | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = listenToKanbanCardDocument((items) => {
      setItems(items);
      setError(false); // reset error if data is valid
    });

    return () => unsubscribe();
  }, []);

  const alerts = (items || []).filter((item) => item.column === "runningLow" || item.column === "outOfStock");

  if (items === null)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="flex flex-col items-center animate-pulse">
          <div className="bg-muted mb-2 rounded-full w-12 h-12"></div>
          <div className="bg-muted rounded w-32 h-4"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center">
        <AlertCircle className="mx-auto mb-2 w-10 h-10 text-destructive" />
        <p className="font-medium text-destructive">Failed to load notifications</p>
      </div>
    );

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex bg-muted/30 mb-3 p-4 rounded-full">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No active alerts at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {alerts.map(({ id, title, displayName, updatedAt, column }) => (
        <div
          key={id}
          className="group relative bg-gradient-to-br from-card to-card/80 shadow-md hover:shadow-lg p-4 border rounded-xl overflow-hidden transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:to-accent/10 transition-all duration-500"></div>

          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-1 self-stretch rounded-full ${
                column === "outOfStock" ? "bg-destructive" : "bg-yellow-400"
              }`}
            />

            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold group-hover:text-primary text-base transition-colors">{title}</h3>
                <span className="flex items-center gap-1 bg-muted/50 ml-2 px-2 py-0.5 rounded-full text-muted-foreground text-xs">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                </span>
              </div>

              <div className="flex items-center text-muted-foreground text-sm">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
                    column === "outOfStock" ? "bg-destructive/10 text-destructive" : "bg-yellow-400/10 text-yellow-600"
                  }`}
                >
                  {column === "outOfStock" ? "Out of Stock" : "Running Low"}
                </span>

                <div className="flex items-center gap-1">
                  <span className="font-medium">marked by {displayName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-0 left-0 absolute bg-gradient-to-r from-transparent via-muted/50 group-hover:via-primary/30 to-transparent w-full h-0.5 transition-all duration-300"></div>
        </div>
      ))}
    </div>
  );
}
