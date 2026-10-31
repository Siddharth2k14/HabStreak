import { useSortable } from "@dnd-kit/sortable";
import type { Task } from "../types/task.types";

import { CSS } from "@dnd-kit/utilities";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";

import { Calendar, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import React from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const formatDueDate = (date: Date | null) => {
    if (!date || Number.isNaN(date.getTime())) {
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(task);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(task);
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
                bg-navbar
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

        <IconButton
          size="small"
          aria-label={`Actions for ${task.title}`}
          aria-haspopup="true"
          aria-expanded={Boolean(menuAnchor)}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onClick={handleMenuOpen}
          className="shrink-0"
          sx={{ color: "#94a3b8" }}
        >
          <MoreHorizontal size={10} />
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          onClick={(event) => event.stopPropagation()}
          slotProps={{
            list: {
              onPointerDown: (event: React.PointerEvent<HTMLElement>) =>
                event.stopPropagation(),
              onKeyDown: (event: React.KeyboardEvent<HTMLElement>) =>
                event.stopPropagation(),
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <Pencil size={16} className="mr-2" />
            Edit Task
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
            <Trash2 size={16} className="mr-2" />
            Delete task
          </MenuItem>
        </Menu>
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