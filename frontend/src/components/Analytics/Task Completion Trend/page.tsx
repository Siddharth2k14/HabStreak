import { Box, Typography } from "@mui/material";
import type { DateRange } from "../constants";
import type { Task } from "../../TaskBoard/types/task.types";

interface TaskCompletionTrendProps {
    dateRange: DateRange;
    completedTasks: Task[];
};

const getTrendBuckets = (range: DateRange, now: Date) => {
  if (range === "THIS_YEAR" || range === "ALL_TIME") {
    const firstMonth = range === "THIS_YEAR" ? 0 : now.getMonth() - 11;
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), firstMonth + index, 1);
      return {
        start: date,
        end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
        label: date.toLocaleDateString(undefined, { month: "short" }),
      };
    });
  }

  const month = range === "THIS_MONTH" ? now.getMonth() : now.getMonth() - 1;
  const year = now.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month, index + 1);
    return {
      start: date,
      end: new Date(year, month, index + 2),
      label: String(index + 1),
    };
  });
};

const TaskCompletionTrend = ({ dateRange, completedTasks }: TaskCompletionTrendProps) => {
  const now = new Date();
  const trendBuckets = getTrendBuckets(dateRange, now);
  const trendValues = trendBuckets.map(
    (bucket) =>
      completedTasks.filter((task) => {
        const completedAt = task.completedAt ?? task.updatedAt;
        return completedAt >= bucket.start && completedAt < bucket.end;
      }).length,
  );
  const maxTrendValue = Math.max(...trendValues, 1);
  const chartWidth = 600;
  const chartHeight = 150;
  const trendPoints = trendValues
    .map((value, index) => {
      const x =
        trendValues.length === 1
          ? chartWidth / 2
          : (index / (trendValues.length - 1)) * chartWidth;
      const y = chartHeight - (value / maxTrendValue) * (chartHeight - 12);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Box className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/25 via-slate-900/25 to-slate-800/25 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.35)] sm:p-4">
      <Typography
        component="h2"
        className="mb-3 text-center text-sm font-semibold tracking-[0.12em] text-slate-200 uppercase"
      >
        Task Completion Trend
      </Typography>
      <Box className="w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/25 p-2 sm:p-3">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 16}`}
          role="img"
          aria-label={`Task completion trend: ${trendValues.join(", ")} completed tasks per ${dateRange === "THIS_YEAR" || dateRange === "ALL_TIME" ? "month" : "day"}`}
          className="h-40 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#334155"
            strokeWidth="2"
          />
          <polyline
            points={trendPoints}
            fill="none"
            stroke="url(#trendGradient)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Box className="mt-1 flex justify-between text-[10px] text-slate-400">
          {trendBuckets
            .filter((_, index) => {
              const lastIndex = trendBuckets.length - 1;
              const step = Math.max(1, Math.floor(lastIndex / 4));
              return index % step === 0 || index === lastIndex;
            })
            .map((bucket, index) => (
              <span key={`${bucket.label}-${index}`}>{bucket.label}</span>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskCompletionTrend;
