import KanbanBoard from "@/components/kanban-baord";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";
async function getBoard(userId: string) {
	"use cache";
	await connectDB();
	const board = await Board.findOne({
		userId: userId,
		name: "Job Hunt",
	})

		.populate({
			path: "columns",
			populate: {
				path: "jobApplications",
			},
		});
	if (!board) return null;
	return JSON.parse(JSON.stringify(board));
	// console.log(board);
}
async function DashboardPage() {
	const session = await getSession();
	const board = await getBoard(session?.user.id ?? "");
	if (!session?.user) {
		redirect("/sign-in");
	}
	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto p-6">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-black">Job Hunt</h1>
					<p className="text-gray-600">Track your job applications</p>
				</div>
				<KanbanBoard
					board={JSON.parse(JSON.stringify(board))}
					userId={session.user.id}
				/>
			</div>
		</div>
	);
}
const page = async () => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DashboardPage />
		</Suspense>
	);
};
export default page;
