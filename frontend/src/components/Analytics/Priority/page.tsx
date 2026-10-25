import { Box, Typography } from "@mui/material";
import { priorityColors } from "../constants";
import type { Task } from "../../TaskBoard/types/task.types";

interface PriorityProps {
    rangeTasks: Task[];
};

const Priority = ({ rangeTasks }: PriorityProps) => {
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
  return (
    <Box className="mx-auto flex min-h-60 w-full max-w-72 flex-col rounded-3xl border border-slate-800 bg-slate-900/25 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.28)]">
      <Typography
        component="h2"
        className="mb-4 text-center text-sm font-semibold tracking-[0.12em] text-slate-200 uppercase"
      >
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
  );
};

export default Priority;
