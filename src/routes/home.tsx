import { Error404 } from "@/components/error404";
import { Home } from "@/components/home_mobile";
import {
	getCurrentUserDetails,
	isUserProfileComplete,
} from "@/firebase/firestore";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
	component: Home,
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
		const profileComplete = await isUserProfileComplete();

		if (!profileComplete) {
			// If the profile is not complete, navigate to the profile completion page
			throw redirect({
				to: "/profileComplete",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	notFoundComponent: Error404,
});
