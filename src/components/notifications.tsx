import { getKanbanCardDocument } from "@/firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import type { CardType } from "./ui/kanbanBoard";

export function Notifications() {
  const {
    data: items,
    isLoading,
    error,
  } = useQuery<CardType[]>({
    queryKey: ["kanbanCards"],
    queryFn: getKanbanCardDocument,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const alerts = (items || []).filter((item) => item.column === "runningLow" || item.column === "outOfStock");

  if (isLoading) return <p className="p-4 text-muted-foreground">Loading notifications...</p>;
  if (error) return <p className="p-4 text-destructive">Failed to load notifications.</p>;

  return (
    <div className="gap-4 grid p-4">
      {alerts.map(({ id, title, displayName, updatedAt, column }) => (
        <div key={id} className="bg-card shadow-sm p-4 border rounded-2xl">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <span
                className={`flex-shrink-0 mt-auto mb-auto w-2 h-2 rounded-full ${
                  column === "outOfStock" ? "bg-destructive" : "bg-yellow-400"
                }`}
              />
              <div>
                <p className="font-semibold text-base">{title}</p>
                <p className="text-muted-foreground text-sm">
                  Marked <span className="font-medium">{column}</span> by{" "}
                  <span className="font-medium">{displayName}</span>
                </p>
              </div>
            </div>
            <span className="text-muted-foreground text-xs whitespace-nowrap">
              {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
