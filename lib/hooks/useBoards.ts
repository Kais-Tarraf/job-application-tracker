"use client";
import { useEffect, useState } from "react";
import { Board, Column } from "../models/models.types";

export function useBoard(initialBoard?: Board | null) {
	const [board, setBoard] = useState<Board | null>(initialBoard || null);
	const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		if (initialBoard) {
			setBoard(initialBoard);
			setColumns(initialBoard.columns || []);
		}
	}, [initialBoard]);
	async function moveJob(
		jobApplicationId: string,
		newColumnId: string,
		newOrder: number
	) {}
	return {
		board,
		columns,
		error,
		moveJob,
	};
}
