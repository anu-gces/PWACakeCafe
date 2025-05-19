import { LandingPage } from "@/components/landingPage";
import { getCurrentUserDetails, isUserProfileComplete } from "@/firebase/firestore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,

  beforeLoad: async ({}) => {
    const user = await getCurrentUserDetails();

    if (!user) {
      return null;
    }

    try {
      const profileComplete = await isUserProfileComplete();

      if (profileComplete) {
        throw redirect({
          to: "/home/editMenu",
          search: { category: "appetizers" },
        });
      } else {
        throw redirect({
          to: "/profileComplete",
        });
      }
    } catch (error) {
      // If user doc not found or any error, redirect to profile complete
      throw redirect({
        to: "/profileComplete",
      });
    }
  },
});
