import KanbanBoard from "@/components/kanban-board";
import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const getBoard = async (userId: string) => {
	"use cache"; // This directive allows the result of this function to be cached, improving performance by avoiding redundant database queries for the same userId.
	await connectDB();
	const boardDoc = await Board.findOne({
		userId: userId,
		name: "Job Hunt",
	}).populate({ path: "columns", populate: { path: "jobApplications" } });
	if (!boardDoc) return null;
	const board = JSON.parse(JSON.stringify(boardDoc));
	return board;
};

const DashboardPage = async () => {
	const session = await getSession();
	const board = await getBoard(session?.user.id ?? "");
	if (!session?.user) {
		redirect("/sign-in");
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto p-6">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-black">{board.name}</h1>
					<p className="text-gray-600">Track your jop application</p>
				</div>
				<KanbanBoard board={board} userId={session.user.id} />
			</div>
		</div>
	);
};

const Dashboard = async () => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<DashboardPage />
		</Suspense>
		// Suspense is used here to handle the asynchronous data fetching in DashboardPage. The fallback will be shown while the data is being loaded.
	);
};

export default Dashboard;
