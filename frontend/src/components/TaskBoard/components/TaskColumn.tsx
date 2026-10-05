import { Box, Typography } from "@mui/material";

import type { Task, TaskStatus } from "../types/task.types";

import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface TaskColumnProps {
  status: TaskStatus;

  tasks: Task[];
}

export const TaskColumn = ({ status, tasks }: TaskColumnProps) => {
  const columnTitle = {
    TODO: "TODO",

    DOING: "DOING",

    IN_REVIEW: "IN REVIEW",

    DONE: "DONE",
  };

  return (
    <Box
      className="
                flex
                flex-col
                min-w-75
                w-full
                bg-slate-950
                rounded-xl
                p-4
                h-fit
            "
    >
      {/* COLUMN HEADER */}

      <Box
        className="
                    flex
                    justify-between
                    items-center
                    mb-4
                "
      >
        <Typography
          className="
                        text-white
                        font-semibold
                    "
        >
          {columnTitle[status]}
        </Typography>

        <Typography
          className="
                        text-slate-400
                    "
        >
          {tasks.length}
        </Typography>
      </Box>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <Box
          className="
                        flex
                        flex-col
                        gap-3
                        min-h-[500px]
                    "
        >
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <Box
              className="
                                min-h-[150px]
                                border
                                border-dashed
                                border-slate-700
                                rounded-lg
                                flex
                                items-center
                                justify-center
                            "
            >
              <Typography
                className="
                                    text-slate-500
                                "
              >
                Drop task here
              </Typography>
            </Box>
          )}
        </Box>
      </SortableContext>
    </Box>
  );
};
