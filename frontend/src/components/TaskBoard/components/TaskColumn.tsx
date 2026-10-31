import { Box, Typography } from "@mui/material";

import type { Task, TaskStatus } from "../types/task.types";

import TaskCard from "./TaskCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskColumn = ({ status, tasks, onEdit, onDelete }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

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
                flex-1
                flex-col
                justify-around
                min-w-56
                shrink-0
                bg-navbar
                rounded-xl
                p-4
                h-[500px]
                overflow-hidden
            "
    >
      {/* COLUMN HEADER */}

      <Box
        className="
                    flex
                    justify-between
                    items-center
                    shrink-0
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
        ref={setNodeRef}
          className={`
                        flex
                        flex-1
                        flex-col
                        gap-3
                        min-h-0
                        overflow-y-auto
                        ${isOver ? "bg-slate-900/60": ""}
                    `}
        >
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />)
          ) : (
            <Box
              className="
                                flex-1
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