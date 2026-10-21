export type StatusFilter = "ALL" | "TODO" | "DOING" | "IN_REVIEW" | "DONE";
export type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";
export type SortOption =
  | "NEWEST"
  | "OLDEST"
  | "TITLE_ASC"
  | "DUE_DATE_ASC"
  | "PRIORITY_HIGH"
  | "PRIORITY_LOW";
export const sortOptions = [
  { value: "NEWEST", label: "Newest first" },
  { value: "OLDEST", label: "Oldest first" },
  { value: "TITLE_ASC", label: "Title (A–Z)" },
  { value: "DUE_DATE_ASC", label: "Due date (earliest)" },
  { value: "PRIORITY_HIGH", label: "Priority (High to Low)" },
  { value: "PRIORITY_LOW", label: "Priority (Low to High)" },
] as const;