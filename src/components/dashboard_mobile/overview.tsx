import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { DollarSign } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import AnimatedCounter from "../ui/animatedCounter";
import { RecentSales } from "./recentsales";

const data = [
	{
		name: "Jan",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Feb",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Mar",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Apr",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "May",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Jun",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Jul",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Aug",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Sep",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Oct",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Nov",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Dec",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
];

export function OverviewBarChart() {
	return (
		<ResponsiveContainer width="100%" height={400}>
			<BarChart data={data}>
				<XAxis
					dataKey="name"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `Rs.${value}`}
				/>
				<Bar
					dataKey="total"
					fill="currentColor"
					radius={[4, 4, 0, 0]}
					className="fill-primary"
					animationDuration={1000}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}

export function Overview() {
	const navigate = useNavigate();
	return (
		<>
			{/* Summary Cards - 2x2 on mobile */}
			<div className="gap-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
				<Card className="w-full">
					<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Total Revenue</CardTitle>
						<DollarSign color="green" size={16} />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							Rs.
							<AnimatedCounter from={0} to={45231.89} />
						</div>
						<p className="text-muted-foreground text-xs">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Expenditure</CardTitle>
						<DollarSign color="red" size={16} />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							Rs.
							<AnimatedCounter from={0} to={2350} />
						</div>
						<p className="text-muted-foreground text-xs">
							+180.1% from last month
						</p>
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Sales</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="w-4 h-4 text-muted-foreground"
						>
							<rect width="20" height="14" x="2" y="5" rx="2" />
							<path d="M2 10h20" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							<AnimatedCounter from={0} to={12234} />
						</div>
						<p className="text-muted-foreground text-xs">
							+19% from last month
						</p>
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Top Selling Items
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="w-4 h-4 text-muted-foreground"
						>
							<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">Pizza, Pasta</div>
						<p className="text-muted-foreground text-xs">Based on last month</p>
					</CardContent>
				</Card>
			</div>

			{/* Content Cards */}
			<div className="gap-4 grid md:grid-cols-2 lg:grid-cols-7 mt-4 pb-4">
				<Card className="order-1 lg:order-1 col-span-full lg:col-span-4 h-full">
					<CardHeader>
						<CardTitle>Monthly Revenue</CardTitle>
						<CardDescription>Bar chart of monthly revenue.</CardDescription>
					</CardHeader>
					<CardContent className="pl-2">
						<OverviewBarChart />
					</CardContent>
				</Card>
				<Card
					className="order-2 lg:order-2 col-span-full lg:col-span-3 h-full active:scale-[0.995] transition-transform cursor-pointer"
					onClick={() =>
						navigate({
							to: "/home/dashboard",
							search: { tab: "reports" },
						})
					}
				>
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
						<CardDescription>You made 265 sales this month.</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentSales />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
