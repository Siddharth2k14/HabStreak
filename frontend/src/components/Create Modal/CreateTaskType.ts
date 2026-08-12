export type CreateTaskTypes = {
  task_name: string;
  due_date: Date | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  link: string;
  description: string;
};