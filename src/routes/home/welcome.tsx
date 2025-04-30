import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { createFileRoute, useRouter } from "@tanstack/react-router";

const CustomCard = ({
	title,
	description,
	content,
	footer,
}: {
	title: string;
	description: string;
	content: string;
	footer: string;
}) => (
	<Card className="w-full">
		<CardHeader>
			<CardTitle>{title}</CardTitle>
			<CardDescription>{description}</CardDescription>
		</CardHeader>
		<CardContent>
			<p>{content}</p>
		</CardContent>
		<CardFooter>
			<p>{footer}</p>
		</CardFooter>
	</Card>
);

const Welcome = () => {
	const router = useRouter();
	return (
		<div className="flex flex-col items-center gap-2 h-full">
			<div className="flex flex-row justify-center gap-2 w-full">
				<CustomCard
					title="Welcome to Our POS System"
					description="Streamlining Your Restaurant Management"
					content="Our POS system is designed to help you manage your restaurant operations efficiently. From order tracking to inventory management, we've got you covered. Explore the various features using the navigation menu."
					footer="Need help? Visit our Help section."
				/>
				<CustomCard
					title="Title 2"
					description="Description 2"
					content="Content 2"
					footer="Footer 2"
				/>
				<CustomCard
					title="Title 3"
					description="Description 3"
					content="Content 3"
					footer="Footer 3"
				/>
				<CustomCard
					title="Title 4"
					description="Description 4"
					content="Content 4"
					footer="Footer 4"
				/>
			</div>

			<div className="flex flex-col flex-grow w-full h-full">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Recent</CardTitle>
						<CardDescription>Get back to where you were</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-2">
							<a
								href="/previous-location-1"
								className="bg-card shadow-sm p-4 border rounded-lg text-card-foreground"
								onClick={(e) => {
									e.preventDefault();
									router.history.back();
								}}
							>
								<div>Previous Location 1</div>
							</a>
							<a
								href="/previous-location-2"
								className="bg-card shadow-sm p-4 border rounded-lg text-card-foreground"
								onClick={(e) => {
									e.preventDefault();
									router.history.go(-2);
								}}
							>
								<div>Previous Location 2</div>
							</a>
							<a
								href="/previous-location-3"
								className="bg-card shadow-sm p-4 border rounded-lg text-card-foreground"
								onClick={(e) => {
									e.preventDefault();
									router.history.go(-3);
								}}
							>
								<div>Previous Location 3</div>
							</a>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export const Route = createFileRoute("/home/welcome")({
	component: Welcome,
});
