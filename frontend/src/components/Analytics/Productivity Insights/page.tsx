import { Box, Typography } from "@mui/material";
import type { Task } from "../../TaskBoard/types/task.types";

interface ProductivityInsightsProps {
    isLoading: boolean;
    completionRate: number;
    completedTasks: Task[];
}

const ProductivityInsights = ({ isLoading, completionRate, completedTasks }: ProductivityInsightsProps) => {
    const weekdays = completedTasks.reduce(
    (counts, task) => {
      const completedAt = task.completedAt ?? task.updatedAt;
      const weekday = completedAt.getDay();
      counts[weekday] += 1;
      return counts;
    },
    Array<number>(7).fill(0),
  );
    const maxWeekdayCount = Math.max(...weekdays);
    const mostProductiveDay = maxWeekdayCount > 0
    ? new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(
        new Date(2024, 0, 7 + weekdays.indexOf(maxWeekdayCount)),
      )
    : "No completed tasks yet";
    
    return (
        <Box className="rounded-3xl border border-slate-800 bg-slate-900/25 p-3 shadow-[0_16px_30px_rgba(15,23,42,0.28)] sm:p-4">
          <Typography component="h2" className="mb-5 text-center text-sm font-semibold tracking-[0.12em] text-slate-200 uppercase">
            Productivity Insights
          </Typography>
          <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <Box className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950/25 to-slate-900/25 p-3">
              <Typography className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                Most Productive Day
              </Typography>
              <Typography className="text-sm font-medium text-white">
                {isLoading ? "—" : mostProductiveDay}
              </Typography>
            </Box>
            <Box className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950/25 to-slate-900/25 p-3">
              <Typography className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                Completion Rate
              </Typography>
              <Typography className="text-sm font-medium text-white">
                {isLoading ? "—" : `${completionRate}%`}
              </Typography>
            </Box>
          </Box>
          <Typography className="mt-3 text-center text-[10px] text-slate-500">
            Completion dates are used when available; older tasks use their last updated date.
          </Typography>
        </Box>
    )
};

export default ProductivityInsights;