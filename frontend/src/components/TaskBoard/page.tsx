import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { TaskColumn } from "./components/TaskColumn";
import { TASK_STATUSES, type Task, type TaskStatus } from "./types/task.types";
import {
  getTasks,
  moveTask,
  updateTask,
  deleteTask,
} from "./services/task.service.ts";
import { TaskBoardHeader } from "./components/TaskBoardHeader";
import React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import TaskCard from "./components/TaskCard";
import { arrayMove } from "@dnd-kit/sortable";

const createEmptyTaskColumns = (): Record<TaskStatus, Task[]> => ({
  TODO: [],
  DOING: [],
  IN_REVIEW: [],
  DONE: [],
});

const groupTasksByStatus = (tasks: Task[]) => {
  const grouped = createEmptyTaskColumns();

  for (const task of tasks) {
    grouped[task.status].push(task);
  }

  for (const status of TASK_STATUSES) {
    grouped[status].sort((a, b) => a.position - b.position);
  }

  return grouped;
};

export const TaskBoard = () => {
  const [tasksByStatus, setTasksByStatus] = React.useState<
    Record<TaskStatus, Task[]>
  >(createEmptyTaskColumns());
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<Task | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const dragOriginRef = React.useRef<{
    taskId: string;
    status: TaskStatus;
    position: number;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const loadTasks = React.useCallback(async () => {
    const tasks = await getTasks();
    return groupTasksByStatus(tasks);
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    const initialzeBoard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const groupedTasks = await loadTasks();

        if (!cancelled) {
          setTasksByStatus(groupedTasks);
        }
      } catch (err) {
        console.error("Failed to load tasks:", err);

        if (!cancelled) {
          setError("Unable to load your tasks. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void initialzeBoard();

    return () => {
      cancelled = true;
    };
  }, [loadTasks]);

  const handleTaskCreated = (task: Task) => {
    setTasksByStatus((previous) => {
      const todoTasks = [...previous.TODO, task];

      return {
        ...previous,
        TODO: todoTasks.map((item, index) => ({
          ...item,
          position: index + 1,
        })),
      };
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
  };

  const handleSaveTask = async () => {
    if (!editingTask) return;

    try {
      setIsSaving(true);
      setError(null);

      await updateTask(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description ?? "",
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
      });

      const loadedTask = await loadTasks();
      setTasksByStatus(loadedTask);
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Unable to update the task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;

    try {
      setIsSaving(true);
      setError(null);

      await deleteTask(deletingTask.id);

      setTasksByStatus(await loadTasks());
      setDeletingTask(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Unable to delete the task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const findTask = (taskId: string) => {
    for (const status of TASK_STATUSES) {
      const task = tasksByStatus[status].find((task) => task.id === taskId);

      if (task) {
        return task;
      }
    }

    return null;
  };

  const findTaskStatus = (taskId: string): TaskStatus | null => {
    for (const status of TASK_STATUSES) {
      const exists = tasksByStatus[status].some((task) => task.id === taskId);

      if (exists) {
        return status;
      }
    }

    return null;
  };

  const findContainer = (id: string): TaskStatus | null => {
    if (TASK_STATUSES.includes(id as TaskStatus)) {
      return id as TaskStatus;
    }

    return findTaskStatus(id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id.toString();
    const task = findTask(taskId);

    if (!task) return;

    dragOriginRef.current = {
      taskId: task.id,
      status: task.status,
      position: task.position,
    };

    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id.toString();
    const overId = over.id.toString();

    if (activeTaskId === overId) return;

    const activeStatus = findTaskStatus(activeTaskId);
    const overStatus = findContainer(overId);

    if (!activeStatus || !overStatus) return;
    if (activeStatus === overStatus) return;

    setTasksByStatus((previousTasks) => {
      const activeTask = previousTasks[activeStatus].find(
        (task) => task.id === activeTaskId,
      );

      if (!activeTask) {
        return previousTasks;
      }

      const sourceTasks = previousTasks[activeStatus].filter(
        (task) => task.id !== activeTaskId,
      );
      const destinationTasks = [...previousTasks[overStatus]].filter(
        (task) => task.id !== activeTaskId,
      );
      const overIndex = destinationTasks.findIndex(
        (task) => task.id === overId,
      );
      const insertionIndex =
        overIndex === -1 ? destinationTasks.length : overIndex;

      destinationTasks.splice(insertionIndex, 0, {
        ...activeTask,
        status: overStatus,
      });

      return {
        ...previousTasks,
        [activeStatus]: sourceTasks.map((task, index) => ({
          ...task,
          position: index + 1,
        })),
        [overStatus]: destinationTasks.map((task, index) => ({
          ...task,
          status: overStatus,
          position: index + 1,
        })),
      };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    const activeId = active.id.toString();
    const origin = dragOriginRef.current;

    // Clear the drag origin when this operation finishes.
    const clearDragOrigin = () => {
      dragOriginRef.current = null;
    };

    if (!over) {
      clearDragOrigin();

      try {
        const loadedTask = await loadTasks();
        setTasksByStatus(loadedTask);
      } catch (error) {
        console.error("Failed to restore task board:", error);
        setError("Unable to refresh your tasks.");
      }

      return;
    }

    const overId = over.id.toString();

    // Resolve the source from the status captured at drag start.
    const sourceStatus =
      origin?.taskId === activeId ? origin.status : findContainer(activeId);

    // Resolve the final destination from the drop target.
    const targetStatus = findContainer(overId);

    if (!sourceStatus || !targetStatus) {
      clearDragOrigin();
      return;
    }

    // Use the latest available board state for calculations.
    const currentTasks = tasksByStatus;
    const task =
      currentTasks[sourceStatus].find((item) => item.id === activeId) ??
      findTask(activeId);

    if (!task) {
      clearDragOrigin();

      try {
        const loadedTask = await loadTasks();
        setTasksByStatus(loadedTask);
      } catch (error) {
        console.error("Failed to reload tasks:", error);
        setError("Unable to refresh your tasks.");
      }

      return;
    }

    // Remove only the dragged task from every column.
    const nextState: Record<TaskStatus, Task[]> = {
      TODO: currentTasks.TODO.filter((item) => item.id !== activeId),
      DOING: currentTasks.DOING.filter((item) => item.id !== activeId),
      IN_REVIEW: currentTasks.IN_REVIEW.filter((item) => item.id !== activeId),
      DONE: currentTasks.DONE.filter((item) => item.id !== activeId),
    };

    const destinationTasks = [...nextState[targetStatus]];

    // Same-column reordering uses the original column's task order.
    let targetIndex: number;

    if (sourceStatus === targetStatus) {
      const sourceTasks = currentTasks[sourceStatus];
      const oldIndex = sourceTasks.findIndex((item) => item.id === activeId);

      const overIndex = sourceTasks.findIndex((item) => item.id === overId);

      if (oldIndex === -1) {
        clearDragOrigin();
        return;
      }

      targetIndex =
        overId === targetStatus ? sourceTasks.length - 1 : overIndex;

      if (targetIndex < 0) {
        targetIndex = sourceTasks.length - 1;
      }

      if (oldIndex === targetIndex) {
        clearDragOrigin();
        return;
      }

      const reordered = arrayMove(sourceTasks, oldIndex, targetIndex).map(
        (item, index) => ({
          ...item,
          position: index + 1,
        }),
      );

      nextState[targetStatus] = reordered;
    } else {
      // Cross-column movement inserts into the destination column.
      const overIndex = destinationTasks.findIndex(
        (item) => item.id === overId,
      );

      targetIndex =
        overId === targetStatus || overIndex === -1
          ? destinationTasks.length
          : overIndex;

      destinationTasks.splice(targetIndex, 0, {
        ...task,
        status: targetStatus,
      });

      nextState[targetStatus] = destinationTasks;
    }

    // Normalize positions and statuses in all columns.
    for (const status of TASK_STATUSES) {
      nextState[status] = nextState[status].map((item, index) => ({
        ...item,
        status,
        position: index + 1,
      }));
    }

    // Update the UI optimistically.
    setTasksByStatus(nextState);
    setError(null);

    try {
      // Persist both same-column and cross-column moves.
      await moveTask(activeId, {
        targetStatus,
        targetPosition: targetIndex + 1,
      });

      // Refresh from the server to confirm authoritative positions.
      const loadedTask = await loadTasks();
      setTasksByStatus(loadedTask);
    } catch (error) {
      console.error("Failed to persist task movement:", error);

      try {
        const loadedTask = await loadTasks();
        setTasksByStatus(loadedTask);
        setError(
          "The task move could not be saved. The board has been refreshed.",
        );
      } catch (reloadError) {
        console.error("Failed to reload tasks:", reloadError);
        setError("Unable to save or refresh the task board.");
      }
    } finally {
      clearDragOrigin();
    }
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center p-8">
        <Typography className="text-slate-400">Loading tasks...</Typography>
      </Box>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box className="flex flex-col gap-2">
        <TaskBoardHeader onTaskCreated={handleTaskCreated} />
        {error && (
          <Box
            role="alert"
            className="mx-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3"
          >
            <Typography className="text-sm text-red-400">{error}</Typography>
          </Box>
        )}

        <Box className="flex gap-5 w-full overflow-x-auto p-4">
          {TASK_STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </Box>
        <Dialog
          open={Boolean(editingTask)}
          onClose={() => {
            if (!isSaving) setEditingTask(null);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit task</DialogTitle>

          <DialogContent className="flex flex-col gap-4 pt-4">
            <TextField
              label="Title"
              fullWidth
              required
              value={editingTask?.title ?? ""}
              onChange={(event) => {
                const title = event.target.value;
                setEditingTask((previous) =>
                  previous ? { ...previous, title } : null,
                );
              }}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              value={editingTask?.description ?? ""}
              onChange={(event) => {
                const description = event.target.value;
                setEditingTask((previous) =>
                  previous ? { ...previous, description } : null,
                );
              }}
            />

            <TextField
              select
              label="Priority"
              fullWidth
              value={editingTask?.priority ?? "MEDIUM"}
              onChange={(event) => {
                const priority = event.target.value as Task["priority"];
                setEditingTask((previous) =>
                  previous ? { ...previous, priority } : null,
                );
              }}
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>

            <TextField
              label="Due date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={
                editingTask?.dueDate &&
                !Number.isNaN(editingTask.dueDate.getTime())
                  ? [
                      editingTask.dueDate.getFullYear(),
                      String(editingTask.dueDate.getMonth() + 1).padStart(
                        2,
                        "0",
                      ),
                      String(editingTask.dueDate.getDate()).padStart(2, "0"),
                    ].join("-")
                  : ""
              }
              onChange={(event) => {
                const value = event.target.value;
                const dueDate = value ? new Date(`${value}T12:00:00`) : null;

                setEditingTask((previous) =>
                  previous ? { ...previous, dueDate } : null,
                );
              }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setEditingTask(null)} disabled={isSaving}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSaveTask}
              disabled={isSaving || !editingTask?.title.trim()}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Boolean(deletingTask)}
          onClose={() => {
            if (!isSaving) setDeletingTask(null);
          }}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Delete task?</DialogTitle>

          <DialogContent>
            Are you sure you want to delete{" "}
            <strong>{deletingTask?.title}</strong>? This action cannot be
            undone.
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDeletingTask(null)} disabled={isSaving}>
              Cancel
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
              disabled={isSaving}
            >
              {isSaving ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
