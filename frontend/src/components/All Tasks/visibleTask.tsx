import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../TaskBoard/types/task.types";

interface VisibleTasksProps {
    task: Task;
    handleMenuOpen: (event: React.MouseEvent<HTMLButtonElement>, task: Task) => void;
    handleMenuClose: () => void;
    handleEdit: (task: Task) => void;
    handleDelete: (task: Task) => void;
    menuTaskId: string | null;
    menuAnchor: HTMLElement | null;
};

const VisibleTasks = ({ task, handleMenuOpen, handleMenuClose, handleEdit, handleDelete, menuTaskId, menuAnchor }: VisibleTasksProps) => {
  return (
    <Box
      key={task.id}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: 2,
        py: 1.5,
        borderBottom: "1px solid rgba(148, 163, 184, 0.55)",
        color: "rgba(226, 232, 240, 0.8)",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box className="flex flex-row gap-5">
          <Typography sx={{ fontSize: "1rem", color: "#e2e8f0" }}>
            {task.title}
          </Typography>
          <IconButton
            size="small"
            aria-label={`Actions for ${task.title}`}
            aria-haspopup="true"
            aria-expanded={menuTaskId === task.id}
            onPointerDown={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
            onClick={(event) => handleMenuOpen(event, task)}
            className="shrink-0"
            sx={{ color: "#94a3b8" }}
          >
            <MoreHorizontal size={20} />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={menuTaskId === task.id}
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
            <MenuItem onClick={() => handleEdit(task)}>
              <Pencil size={16} className="mr-2" />
              Edit Task
            </MenuItem>

            <MenuItem
              onClick={() => handleDelete(task)}
              sx={{ color: "error.main" }}
            >
              <Trash2 size={16} className="mr-2" />
              Delete task
            </MenuItem>
          </Menu>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            mt: 0.4,
            color: "rgba(148, 163, 184, 0.9)",
          }}
        >
          <Typography sx={{ fontSize: "0.84rem" }}>
            {task.dueDate ? task.dueDate.toLocaleDateString() : "No due date"}
          </Typography>
          <Typography sx={{ fontSize: "0.84rem" }}>{task.status}</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: "1rem", color: "#e2e8f0" }}>
        {task.priority}
      </Typography>
    </Box>
  );
};

export default VisibleTasks;
