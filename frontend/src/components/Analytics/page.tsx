import { Box, Typography } from "@mui/material";
import React from "react";
import { getTasks } from "../TaskBoard/services/task.service.ts";
import {
  type Task,
} from "../TaskBoard/types/task.types.ts";
import Header from "./Analytics Header/page.tsx";
import TaskCompletionTrend from "./Task Completion Trend/page.tsx";
import TaskStatus from "./Task Status/page.tsx";
import Priority from "./Priority/page.tsx";
import ProductivityInsights from "./Productivity Insights/page.tsx";
import type { DateRange } from "./constants.ts";

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
  
  return (
    <Box className="h-full min-w-0 flex-1 overflow-y-auto p-3 text-slate-100 sm:p-5">
      <Box className="flex min-h-full flex-col gap-4 p-1 sm:p-2">
        <Header dateRange={dateRange} setDateRange={setDateRange} />

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

        {/* Task Completion Trend */}
        <TaskCompletionTrend dateRange={dateRange} completedTasks={completedTasks} />

        <Box className="grid grid-cols-1 gap-4 py-1 sm:grid-cols-2 sm:gap-5">
          {/* Task Status */}
          <TaskStatus rangeTasks={rangeTasks} />

          {/* Priority */}
          <Priority rangeTasks={rangeTasks}/>
        </Box>

        {/* Productivity Insights */}
        <ProductivityInsights isLoading={isLoading} completionRate={completionRate} completedTasks={completedTasks} />
      </Box>
    </Box>
  );
};

export default Analytics;
