import { Box, Button, Typography } from "@mui/material";
import React from "react";
import type { Task } from "../TaskBoard/types/task.types.ts";
import {
  getTasks,
  moveTask,
  updateTask,
  deleteTask,
} from "../TaskBoard/services/task.service.ts";
import {
  CreateModal,
  type CreateModalHandle,
} from "../Create Modal/CreateModal.tsx";
import {
  type PriorityFilter,
  type SortOption,
  type StatusFilter,
} from "./types/allTasks.types.ts";
import { EditTaskModal } from "../Edit Task Modal/EditTaskModal.tsx";
import DeleteTaskModal from "../Delete Task Modal/DeleteTaskModal.tsx";
import VisibleTasks from "./visibleTask.tsx";
import { Plus } from "lucide-react";
import FilterSearch from "./FilterSearch.tsx";

const AllTasks = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] =
    React.useState<PriorityFilter>("ALL");
  const [sortBy, setSortBy] = React.useState<SortOption>("NEWEST");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [menuTaskId, setMenuTaskId] = React.useState<string | null>(null);
  const createModal = React.useRef<CreateModalHandle>(null);

  const handleOpen = () => {
    createModal.current?.open();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuTaskId(task.id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuTaskId(null);
  };

  const handleEdit = (task: Task) => {
    handleMenuClose();
    setEditTask(task);
  };

  const handleDelete = (task: Task) => {
    handleMenuClose();
    setError(null);
    setDeletingTask(task);
  };

  const fetchTasks = React.useCallback(async () => {
    return getTasks();
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const taskFunc = async () => {
      try {
        const loadedTasks = await fetchTasks();
        if (cancelled) return;
        setTasks(loadedTasks);
        setError(null);
      } catch (loadError) {
        if (cancelled) return;
        console.error("Failed to load the tasks:", loadError);
        setError("Unable to load your task");
      }
    };

    void taskFunc();

    return () => {
      cancelled = true;
    };
  }, [fetchTasks]);

  const visibleTasks = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      const matchSearch = task.title.toLowerCase().includes(query);

      return matchSearch && matchesStatus && matchesPriority;
    });

    const priorityRank: Record<"LOW" | "MEDIUM" | "HIGH", number> = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
    };

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "NEWEST":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "OLDEST":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "TITLE_ASC":
          return a.title.localeCompare(b.title);

        case "DUE_DATE_ASC": {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        case "PRIORITY_HIGH":
          return priorityRank[b.priority] - priorityRank[a.priority];

        case "PRIORITY_LOW":
          return priorityRank[a.priority] - priorityRank[b.priority];

        default:
          return 0;
      }
    });
  }, [tasks, statusFilter, priorityFilter, sortBy, searchQuery]);

  const handleSaveTask = async (editedTask: Task) => {
    const currentTask = tasks.find((task) => task.id === editedTask.id);
    if (!currentTask) {
      setError("Unable to find the task to update. Please refresh the page.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      await updateTask(editedTask.id, {
        title: editedTask.title,
        description: editedTask.description ?? "",
        priority: editedTask.priority,
        dueDate: editedTask.dueDate,
      });

      if (editedTask.status !== currentTask.status) {
        const targetPosition =
          tasks.filter(
            (task) =>
              task.status === editedTask.status && task.id !== editedTask.id,
          ).length + 1;

        await moveTask(editedTask.id, {
          targetStatus: editedTask.status,
          targetPosition,
        });
      }

      setTasks(await fetchTasks());
      setEditTask(null);
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Unable to update the task. Please try again.");

      try {
        setTasks(await fetchTasks());
      } catch (reloadError) {
        console.error("Failed to refresh tasks after update:", reloadError);
        setError("Unable to update or refresh your tasks.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask || isSaving) return;

    try {
      setIsSaving(true);
      setError(null);

      await deleteTask(deletingTask.id);
      setTasks(await fetchTasks());
      setDeletingTask(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Unable to delete the task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box className="flex h-full w-full flex-col px-4 py-3 text-white">
      <Box className="mb-4 flex items-center justify-between gap-4">
        <Box className="flex flex-col gap-1">
          <Typography variant="h4">All Tasks</Typography>

          <Typography>Manage and organize all your tasks</Typography>
        </Box>

        <Button onClick={handleOpen}>
          <Plus />
          <Typography>Create Task</Typography>
        </Button>

        <CreateModal ref={createModal} onSuccess={fetchTasks} />
      </Box>

      <FilterSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <Box
        sx={{
          backgroundColor: "rgba(15, 23, 42, 0.2)",
          // border: "1px solid rgba(148, 163, 184, 0.8)",
          borderRadius: "10px",
          overflow: "hidden",
          width: "100%",
          border: "2px solid black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.4,
            borderBottom: "1px solid rgba(148, 163, 184, 0.7)",
            color: "rgba(226, 232, 240, 0.82)",
            fontSize: "0.95rem",
          }}
        >
          <Typography sx={{ fontWeight: 500, flex: 1 }}>
            {visibleTasks.length} {visibleTasks.length === 1 ? "task" : "tasks"}
          </Typography>
          <Typography sx={{ fontWeight: 500 }}>Priority</Typography>
        </Box>

        {visibleTasks.map((task) => (
          <VisibleTasks
            key={task.id}
            task={task}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            menuTaskId={menuTaskId}
            menuAnchor={menuAnchor}
          />
        ))}

        <EditTaskModal
          key={editTask?.id ?? "closed"}
          task={editTask}
          isSaving={isSaving}
          error={error}
          onClose={() => setEditTask(null)}
          onSave={handleSaveTask}
        />

        <DeleteTaskModal
          task={deletingTask}
          isSaving={isSaving}
          error={error}
          onClose={() => setDeletingTask(null)}
          onSave={handleConfirmDelete}
        />

        {visibleTasks.length === 0 && (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography sx={{ color: "rgba(226, 232, 240, 0.7)" }}>
              No tasks match your selected filters.
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <Typography className="text-red-900">
              Error in loading tasks.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AllTasks;
