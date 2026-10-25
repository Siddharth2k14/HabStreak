import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import { getTasks } from "../TaskBoard/services/task.service.ts";
import {
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from "../TaskBoard/types/task.types.ts";

type DateRange = "THIS_MONTH" | "LAST_MONTH" | "THIS_YEAR" | "ALL_TIME";

const dateRanges: { value: DateRange; label: string }[] = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "THIS_YEAR", label: "This Year" },
  { value: "ALL_TIME", label: "All Time" },
];

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  DOING: "Doing",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

const statusColors: Record<TaskStatus, string> = {
  TODO: "#34d399",
  DOING: "#fbbf24",
  IN_REVIEW: "#f87171",
  DONE: "#64748b",
};

const priorityColors = {
  HIGH: "#f87171",
  MEDIUM: "#fbbf24",
  LOW: "#34d399",
} as const;

const isWithinRange = (date: Date, range: DateRange, now: Date) => {
  if (range === "ALL_TIME") return true;

  const year = now.getFullYear();
  const month = now.getMonth();
  let start: Date;
  let end: Date;

  if (range === "THIS_MONTH") {
    start = new Date(year, month, 1);
    end = new Date(year, month + 1, 1);
  } else if (range === "LAST_MONTH") {
    start = new Date(year, month - 1, 1);
    end = new Date(year, month, 1);
  } else {
    start = new Date(year, 0, 1);
    end = new Date(year + 1, 0, 1);
  }

  return date >= start && date < end;
};

const getTrendBuckets = (range: DateRange, now: Date) => {
  if (range === "THIS_YEAR" || range === "ALL_TIME") {
    const firstMonth =
      range === "THIS_YEAR" ? 0 : now.getMonth() - 11;
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

const Analytics = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange>("THIS_MONTH");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      try {
        const loadedTasks = await getTasks();
        if (cancelled) return;
        setTasks(loadedTasks);
        setError(null);
      } catch (loadError) {
        console.error("Failed to load analytics tasks:", loadError);
        if (!cancelled) {
          setError("Unable to load analytics. Please try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadTasks();
    return () => {
      cancelled = true;
    };
  }, []);

  const now = new Date();
  const rangeTasks = tasks.filter((task) =>
    isWithinRange(task.createdAt, dateRange, now),
  );
  const completedTasks = rangeTasks.filter((task) => task.status === "DONE");
  const completionRate = rangeTasks.length
    ? Math.round((completedTasks.length / rangeTasks.length) * 100)
    : 0;
  const trendBuckets = getTrendBuckets(dateRange, now);
  const trendValues = trendBuckets.map(
    (bucket) =>
      completedTasks.filter(
        (task) => {
          const completedAt = task.completedAt ?? task.updatedAt;
          return completedAt >= bucket.start && completedAt < bucket.end;
        },
      ).length,
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
  const statusCounts = TASK_STATUSES.map((status) => ({
    status,
    count: rangeTasks.filter((task) => task.status === status).length,
  }));
  const statusTotal = statusCounts.reduce((total, item) => total + item.count, 0);
  let statusOffset = 0;
  const statusGradient = statusCounts
    .map(({ status, count }) => {
      const start = statusOffset;
      statusOffset += statusTotal ? (count / statusTotal) * 100 : 0;
      return `${statusColors[status]} ${start}% ${statusOffset}%`;
    })
    .join(", ");
  const priorityCounts = (["HIGH", "MEDIUM", "LOW"] as const).map(
    (priority) => ({
      priority,
      count: rangeTasks.filter((task) => task.priority === priority).length,
    }),
  );
  const maxPriorityCount = Math.max(
    ...priorityCounts.map((item) => item.count),
    1,
  );
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
    <Box className="h-full min-w-0 flex-1 overflow-y-auto p-3 text-slate-100 sm:p-5">
      <Box className="flex min-h-full flex-col gap-4 p-1 sm:p-2">
        <Box className="flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/25 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <Typography variant="h4" className="text-lg font-semibold tracking-wide text-white">
            Analytics
          </Typography>
          <FormControl size="small" className="min-w-36">
            <Select
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value as DateRange)
              }
              aria-label="Analytics date range"
              className="rounded-full border border-slate-700 bg-slate-800 text-xs font-medium text-slate-100 shadow-sm"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
                "& .MuiSelect-select": { py: 1, px: 1.5, color: "#e2e8f0" },
                "& .MuiSvgIcon-root": { color: "#cbd5e1" },
                "& .MuiPaper-root": { backgroundColor: "#0f172a" },
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      bgcolor: "#0f172a",
                      color: "#e2e8f0",
                      border: "1px solid rgba(148, 163, 184, 0.2)",
                      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.4)",
                      mt: 1,
                    },
                  },
                },
              }}
            >
              {dateRanges.map((range) => (
                <MenuItem
                  key={range.value}
                  value={range.value}
                  sx={{
                    fontSize: "0.75rem",
                    py: 1,
                    color: "#e2e8f0",
                    "&.Mui-selected": { backgroundColor: "rgba(148, 163, 184, 0.14)" },
                    "&.Mui-selected:hover": { backgroundColor: "rgba(148, 163, 184, 0.2)" },
                  }}
                >
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Box
            role="alert"
            className="rounded-2xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200 shadow-[0_0_0_1px_rgba(248,113,113,0.1)]"
          >
            {error}
          </Box>
        )}

        <Box className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {[
            { label: "Total Tasks", value: isLoading ? "—" : rangeTasks.length },
            {
              label: "Completed",
              value: isLoading ? "—" : completedTasks.length,
            },
            {
              label: "Completion",
              value: isLoading ? "—" : `${completionRate}%`,
            },
          ].map((metric) => (
            <Box
              key={metric.label}
              className="mx-auto flex min-h-28 w-full max-w-40 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/25 via-slate-900/25 to-slate-800/25 p-3 shadow-[0_12px_24px_rgba(15,23,42,0.28)]"
            >
              <Typography className="text-center text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                {metric.label}
              </Typography>
              <Typography className="text-2xl font-semibold text-white">
                {metric.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/25 via-slate-900/25 to-slate-800/25 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.35)] sm:p-4">
          <Typography component="h2" className="mb-3 text-center text-sm font-semibold tracking-[0.12em] text-slate-200 uppercase">
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

        <Box className="grid grid-cols-1 gap-4 py-1 sm:grid-cols-2 sm:gap-5">
          <Box className="mx-auto flex min-h-60 w-full max-w-72 flex-col items-center rounded-3xl border border-slate-800 bg-slate-900/25 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.28)]">
            <Typography component="h2" className="mb-3 text-center text-sm font-semibold tracking-[0.12em] text-slate-200 uppercase">
              Task Status
            </Typography>
            <Box
              role="img"
              aria-label={statusCounts
                .map(({ status, count }) => `${statusLabels[status]}: ${count}`)
                .join(", ")}
              className="my-2 size-28 rounded-full shadow-[inset_0_0_18px_rgba(15,23,42,0.8)]"
              sx={{
                background:
                  statusTotal > 0
                    ? `conic-gradient(${statusGradient})`
                    : "#334155",
                maskImage:
                  "radial-gradient(circle, transparent 54%, black 56%)",
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 54%, black 56%)",
              }}
            />
            <Box className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {statusCounts.map(({ status, count }) => (
                <Box
                  key={status}
                  className="flex items-center gap-1.5 text-[10px] leading-tight text-slate-200"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: statusColors[status] }}
                  />
                  <span>{statusLabels[status]}</span>
                  <span className="text-slate-400">({count})</span>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="mx-auto flex min-h-60 w-full max-w-72 flex-col rounded-3xl border border-slate-800 bg-slate-900/25 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.28)]">
            <Typography component="h2" className="mb-4 text-center text-sm font-semibold tracking-[0.12em] text-slate-200 uppercase">
              Priority
            </Typography>
            <Box className="flex flex-col gap-3 px-1 pt-1">
              {priorityCounts.map(({ priority, count }) => (
                <Box key={priority} className="flex items-center gap-3">
                  <Typography className="w-12 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-300">
                    {priority[0] + priority.slice(1).toLowerCase()}
                  </Typography>
                  <Box className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <Box
                      className="h-full rounded-full"
                      sx={{
                        width: `${(count / maxPriorityCount) * 100}%`,
                        backgroundColor: priorityColors[priority],
                        boxShadow: `0 0 10px ${priorityColors[priority]}`,
                      }}
                    />
                  </Box>
                  <Typography className="w-4 text-right text-[10px] text-slate-300">
                    {count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

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
      </Box>
    </Box>
  );
};

export default Analytics;
