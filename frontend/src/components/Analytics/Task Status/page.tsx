import { Box, Typography } from "@mui/material";
import { TASK_STATUSES, type Task } from "../../TaskBoard/types/task.types";
import { statusColors, statusLabels } from "../constants";

interface TaskStatusProps {
  rangeTasks: Task[];
}

const TaskStatus = ({ rangeTasks }: TaskStatusProps) => {
  const statusCounts = TASK_STATUSES.map((status) => ({
    status,
    count: rangeTasks.filter((task) => task.status === status).length,
  }));
  const statusTotal = statusCounts.reduce(
    (total, item) => total + item.count,
    0,
  );
  let statusOffset = 0;
  const statusGradient = statusCounts
    .map(({ status, count }) => {
      const start = statusOffset;
      statusOffset += statusTotal ? (count / statusTotal) * 100 : 0;
      return `${statusColors[status]} ${start}% ${statusOffset}%`;
    })
    .join(", ");

  return (
    <Box className="mx-auto flex min-h-60 w-full max-w-72 flex-col items-center rounded-3xl border border-slate-800 bg-slate-900/25 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.28)]">
      <Typography
        component="h2"
        className="mb-3 text-center text-sm font-semibold tracking-[0.12em] text-slate-200 uppercase"
      >
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
            statusTotal > 0 ? `conic-gradient(${statusGradient})` : "#334155",
          maskImage: "radial-gradient(circle, transparent 54%, black 56%)",
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
  );
};

export default TaskStatus;
