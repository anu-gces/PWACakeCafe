import { createFileRoute } from "@tanstack/react-router";
import { getCurrentUserDetails, isUserProfileComplete } from "@/firebase/firestore";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profileComplete")({
  beforeLoad: async ({}) => {
    const user = await getCurrentUserDetails();

    if (!user) {
      // If no user is authenticated, navigate to the login page
      throw redirect({
        to: "/",
      });
    }

    // Check if the user's profile is complete
    const profileIsComplete = await isUserProfileComplete();

    if (profileIsComplete) {
      // If the profile is complete, navigate to the home page
      throw redirect({
        to: "/home/editMenu",
        search: { category: "appetizers" },
      });
    }
  },
});
