import { LandingPage } from "@/components/landingPage";
import { getCurrentUserDetails, isUserProfileComplete } from "@/firebase/firestore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,

  beforeLoad: async ({}) => {
    const user = await getCurrentUserDetails();

    // If no user is authenticated, do nothing and let them stay
    if (!user) {
      return null;
    }

    // Check if the user's profile is complete
    const profileComplete = await isUserProfileComplete();

    if (profileComplete) {
      // If authenticated and profile is complete, navigate to /home
      throw redirect({
        to: "/home/editMenu",
        search: { category: "appetizers" },
      });
    } else {
      // If authenticated but profile is not complete, navigate to /profileComplete
      throw redirect({
        to: "/profileComplete",
      });
    }
  },
});
