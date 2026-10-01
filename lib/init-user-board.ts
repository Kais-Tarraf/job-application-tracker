import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
	{
		name: "Wish List",
		order: 0,
	},
	{
		name: "Applied",
		order: 1,
	},
	{
		name: "Interviewing",
		order: 2,
	},
	{
		name: "Offer",
		order: 3,
	},
	{
		name: "Rejecting",
		order: 4,
	},
];

export const initializeUserBoard = async (userId: string) => {
	try {
		await connectDB();
		// check if board already exists
		const existingBoard = await Board.findOne({ userId, name: "Job Hunt" });
		if (existingBoard) {
			return existingBoard;
		}
		// Create Board
		const board = await Board.create({
			name: "Job Hunt",
			userId,
			columns: [],
		});
		// create columns
		const columns = await Promise.all(
			DEFAULT_COLUMNS.map((col) =>
				Column.create({
					name: col.name,
					order: col.order,
					boardId: board._id,
					jobApplication: [],
				}),
			),
		);
		// Update the board with the new columns IDs
		board.columns = columns.map((col) => col._id);
		await board.save();
		return board;
	} catch (err) {
		throw err;
	}
};
