"use client";
import { useState } from "react";
import { Board, Column } from "../models/models.types";

export function useBoard(initialBoard?: Board | null) {
	const [board, useBoard] = useState<Board | null>(initialBoard || null);
	const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
	const [error, setError] = useState<string | null>(null);
	async function moveJob(
		jobApplicationId: string,
		newColumnId: string,
		newOrder: number
	) {
		
	}
	return {
		board,
		columns,
		error,
		moveJob
	};
}
