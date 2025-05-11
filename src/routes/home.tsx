import { Error404 } from "@/components/error404";
import { Home } from "@/components/home_mobile";
import { getCurrentUserDetails, isUserProfileComplete } from "@/firebase/firestore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: Home,
  beforeLoad: async ({}) => {
    const user = await getCurrentUserDetails();

    if (!user) {
      throw redirect({
        to: "/",
      });
    }

    const profileComplete = await isUserProfileComplete();

    if (!profileComplete) {
      throw redirect({
        to: "/profileComplete",
      });
    }
  },
  notFoundComponent: Error404,
});
