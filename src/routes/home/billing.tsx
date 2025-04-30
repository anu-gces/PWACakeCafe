import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/home/billing"!</div>;
}
