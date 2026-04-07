import KanbanBoard from "@/components/kanban-board";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";

const Dashboard = async () => {
	const session = await getSession();
	if (!session?.user) {
		redirect("/sign-in");
	}
	await connectDB();
	const board = await Board.findOne({
		userId: session.user.id,
		name: "Job Hunt",
	}).populate({ path: "columns", populate: { path: "jobApplications" } });
	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto p-6">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-black">{board.name}</h1>
					<p className="text-gray-600">Track your jop application</p>
				</div>
				<KanbanBoard
					board={JSON.parse(JSON.stringify(board))}
					userId={session.user.id}
				/>
			</div>
		</div>
	);
};

export default Dashboard;
