import type { Task } from "../types/task.types";

import { useDraggable } from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";

import { Calendar, MoreHorizontal } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const formatDueDate = (date: Date | null) => {
    if (!date) {
      return "No due date";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const priorityStyles = {
    LOW: "bg-green-500/10 text-green-400 border-green-500/20",

    MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                p-4
                shadow-sm
                transition
                cursor-grab
                active:cursor-grabbing
                ${isDragging ? "opacity-40" : ""}
            `}
    >
      {/* HEADER */}

      <div
        className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
      >
        <h3
          className="
                        text-sm
                        font-semibold
                        text-white
                        leading-5
                    "
        >
          {task.title}
        </h3>

        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="
                        text-slate-400
                        hover:text-white
                        transition
                        shrink-0
                    "
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* DESCRIPTION */}

      {task.description && (
        <p
          className="
                        mt-3
                        text-sm
                        text-slate-400
                        line-clamp-2
                    "
        >
          {task.description}
        </p>
      )}

      {/* FOOTER */}

      <div
        className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-2
                "
      >
        {/* PRIORITY */}

        <span
          className={`
                        px-2.5
                        py-1
                        rounded-md
                        border
                        text-xs
                        font-medium
                        ${priorityStyles[task.priority]}
                    `}
        >
          {task.priority}
        </span>

        {/* DUE DATE */}

        <div
          className="
                        flex
                        items-center
                        gap-1.5
                        text-xs
                        text-slate-400
                    "
        >
          <Calendar size={14} />

          <span>{formatDueDate(task.dueDate)}</span>
        </div>
      </div>
    </Box>
  );
};

export default TaskCard;
