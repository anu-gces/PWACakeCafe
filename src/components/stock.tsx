import { KanbanBoard } from "./ui/kanbanBoard";

export function Stock() {
	return (
		<>
			<div className="h-full  w-full flex flex-col">
				<KanbanBoard />
			</div>
		</>
	);
}
