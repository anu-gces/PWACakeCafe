import { profileComplete } from "@/components/profileComplete";
import {
	getCurrentUserDetails,
	isUserProfileComplete,
} from "@/firebase/firestore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profileComplete")({
	component: profileComplete,
	beforeLoad: async ({ location }) => {
		const user = await getCurrentUserDetails();

		if (!user) {
			// If no user is authenticated, navigate to the login page
			throw redirect({
				to: "/",
				search: {
					redirect: location.href,
				},
			});
		}

		// Check if the user's profile is complete
		const profileIsComplete = await isUserProfileComplete();

		if (profileIsComplete) {
			// If the profile is complete, navigate to the home page
			throw redirect({
				to: "/home/welcome",
				search: {
					redirect: location.href,
				},
			});
		}
	},
});
