import type { TaskStatus } from "../TaskBoard/types/task.types";

export type DateRange = "THIS_MONTH" | "LAST_MONTH" | "THIS_YEAR" | "ALL_TIME";

export const dateRanges: { value: DateRange; label: string }[] = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "THIS_YEAR", label: "This Year" },
  { value: "ALL_TIME", label: "All Time" },
];

export const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "Doing",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

export const statusColors: Record<TaskStatus, string> = {
  TODO: "#34d399",
  DOING: "#fbbf24",
  IN_REVIEW: "#f87171",
  DONE: "#64748b",
};

export const priorityColors = {
  HIGH: "#f87171",
  MEDIUM: "#fbbf24",
  LOW: "#34d399",
} as const;