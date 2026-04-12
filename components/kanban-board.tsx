"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
	Calendar,
	CheckCircle2,
	Mic,
	Award,
	XCircle,
	MoreVertical,
	Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoards";
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface KanbanBoardProps {
	board: Board;
	userId: string;
}
interface ColConfig {
	color: string;
	icon: React.ReactNode;
}
const COLUMN_CONFIG: Array<ColConfig> = [
	{
		color: "bg-cyan-500",
		icon: <Calendar className="h-4 w-4" />,
	},
	{
		color: "bg-purple-500",
		icon: <CheckCircle2 className="h-4 w-4" />,
	},
	{
		color: "bg-green-500",
		icon: <Mic className="h-4 w-4" />,
	},
	{
		color: "bg-yellow-500",
		icon: <Award className="h-4 w-4" />,
	},
	{
		color: "bg-red-500",
		icon: <XCircle className="h-4 w-4" />,
	},
];

const DroppableColumn = ({
	column,
	config,
	boardId,
	sortedColumns,
}: {
	column: Column;
	config: ColConfig;
	boardId: string;
	sortedColumns: Column[];
}) => {
	const { setNodeRef, isOver } = useDroppable({
		id: column._id,
		data: {
			type: "column",
			columnId: column._id,
		},
	});
	const sortedJobs =
		column.jobApplications.sort((a, b) => a.order - b.order) || [];
	return (
		<Card className="min-w-[300px] shrink-0 shadow-md p-0">
			<CardHeader
				className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{config.icon}
						<CardTitle className="text-white text-base font-semibold">
							{column.name}
						</CardTitle>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 text-white hover:bg-white/20"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="text-destructive">
								<Trash2 className="mr-2 h-4 w-4" /> Delete Column
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent
				ref={setNodeRef}
				className={`space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg ${
					isOver ? "ring-2 ring-blue-500" : ""
				}`}
			>
				<SortableContext
					items={sortedJobs.map((job) => job._id)}
					strategy={verticalListSortingStrategy}
				>
					{sortedJobs.map((job, key) => (
						<SortableJobCard
							key={key}
							job={{ ...job, columnId: job.columnId || column._id }}
							columns={sortedColumns}
						/>
					))}
				</SortableContext>
				<CreateJobDialog columnId={column._id} boardId={boardId} />
			</CardContent>
		</Card>
	);
};
const SortableJobCard = ({
	job,
	columns,
}: {
	job: JobApplication;
	columns: Column[];
}) => {
	const {
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
		setNodeRef,
	} = useSortable({
		id: job._id,
		data: { type: "job", job },
	});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};
	return (
		<div ref={setNodeRef} style={style}>
			<JobApplicationCard
				job={job}
				columns={columns}
				dragHandleProps={{ ...attributes, ...listeners }}
			/>
		</div>
	);
};
const KanbanBoard = ({ board, userId }: KanbanBoardProps) => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const { columns, moveJob } = useBoard(board);
	const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);
	console.log(columns[0].jobApplications);
	async function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}
	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setActiveId(null);
		if (!over || !board._id) return;
		const activeId = active.id as string;
		const overId = over.id as string;

		let draggedJob: JobApplication | null = null;
		let sourceColumn: Column | null = null;
		let sourceIndex = -1;
		for (const column of sortedColumns) {
			const jobs =
				column.jobApplications.sort((a, b) => a.order - b.order) || [];
			const jobIndex = jobs.findIndex((j) => j._id === activeId);
			if (jobIndex !== -1) {
				draggedJob = jobs[jobIndex];
				sourceColumn = column;
				sourceIndex = jobIndex;
				break;
			}
		}
		if (!draggedJob || !sourceColumn) return;
		// Check if dropped over a column
		const targetColumn = sortedColumns.find((col) => col._id === overId);
		const targetJob = sortedColumns
			.flatMap((col) => col.jobApplications || [])
			.find((j) => j._id === overId);
		let targetColumnId: string;
		let newOrder: number;
		if (targetColumn) {
			targetColumnId = targetColumn._id;
			const jobsInTarget =
				targetColumn.jobApplications
					.filter((j) => j._id !== activeId)
					.sort((a, b) => a.order - b.order) || [];
			newOrder = jobsInTarget.length;
		} else if (targetJob) {
			const targetJobColumn = sortedColumns.find((col) =>
				col.jobApplications.some((j) => j._id === targetJob._id)
			);
			targetColumnId = targetJob.columnId || targetJobColumn?._id || "";
			if (!targetColumnId) return;

			const targetColumnObj = sortedColumns.find(
				(col) => col._id === targetColumnId
			);
			if (!targetColumnObj) return;
			const allJobsInTargetOriginal =
				targetColumnObj.jobApplications.sort((a, b) => a.order - b.order) || [];
			const allJobsInTargetFiltered =
				allJobsInTargetOriginal.filter((j) => j._id !== activeId) || [];
			const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
				(j) => j._id === overId
			);
			const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
				(j) => j._id === overId
			);
			if (targetIndexInFiltered !== -1) {
				if (sourceColumn._id === targetColumnId) {
					if (sourceIndex < targetIndexInOriginal) {
						newOrder = targetIndexInFiltered + 1;
					} else {
						newOrder = targetIndexInFiltered;
					}
				} else {
					newOrder = targetIndexInFiltered;
				}
			} else {
				newOrder = allJobsInTargetFiltered.length;
			}
		} else {
			return;
		}
		if (!targetColumnId) {
			return;
		}
		await moveJob(activeId, targetColumnId, newOrder);
	}
	const activeJob = sortedColumns
		.flatMap((col) => col.jobApplications || [])
		.find((job) => job._id === activeId);
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="space-y-4">
				<div className="flex gap-4 overflow-x-auto pb-4">
					{sortedColumns.map((col, i) => {
						const config: ColConfig = COLUMN_CONFIG[i] || {
							color: "bg-cyan-500",
							icon: <Calendar className="h-4 w-4" />,
						};
						return (
							<DroppableColumn
								key={i}
								column={col}
								config={config}
								boardId={board._id}
								sortedColumns={sortedColumns}
							/>
						);
					})}
				</div>
			</div>
			<DragOverlay>
				{activeJob ? (
					<div className="opacity-50">
						<JobApplicationCard job={activeJob} columns={sortedColumns} />
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
};

export default KanbanBoard;
