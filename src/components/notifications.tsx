const notifications = [
	{
		id: 1,
		title: "Daily Sales Report",
		message: "Your daily sales report is ready to export.",
	},
	{
		id: 2,
		title: "Inventory Alert",
		message: "You're running low on some ingredients.",
	},
	{
		id: 3,
		title: "Reservation Update",
		message: "You have a new reservation for tonight.",
	},
	// add more notifications as needed
];

export function Notifications() {
	return (
		<div className="gap-4 grid">
			{notifications.map(({ id, title, message }) => (
				<div key={id} className="bg-background p-4 border rounded-lg">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<span className="flex bg-primary rounded-full w-2 h-2" />

							<div>
								<p className="font-medium">{title}</p>
								<p className="text-gray-500 text-sm">{message}</p>
							</div>
						</div>
						<p className="text-gray-500 text-sm">2h ago</p>
					</div>
				</div>
			))}
		</div>
	);
}
