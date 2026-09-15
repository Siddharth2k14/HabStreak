import { Box } from "@mui/material";
import { TaskColumn } from "./components/TaskColumn";
import { TASK_STATUSES, type Task, type TaskStatus } from "./types/task.types";
import dummyTaskData from "./dummyTasks.json";
import { convertTaskDates } from "./utils/task.utils";
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

import { arrayMove } from "@dnd-kit/sortable";
import TaskCard from "./components/TaskCard";

export const TaskBoard = () => {
  const [tasksByStatus, setTasksByStatus] = React.useState<
    Record<TaskStatus, Task[]>
  >({
    TODO: dummyTaskData.TODO.map(convertTaskDates),
    DOING: dummyTaskData.DOING.map(convertTaskDates),
    IN_REVIEW: dummyTaskData.IN_REVIEW.map(convertTaskDates),
    DONE: dummyTaskData.DONE.map(convertTaskDates),
  });

  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const findTask = (taskId: string) => {
    for (const status of Object.keys(tasksByStatus) as TaskStatus[]) {
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
    const task = findTask(event.active.id.toString());

    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id.toString();

    const overId = over.id.toString();

    const activeStatus = findTaskStatus(activeTaskId);

    if (!activeStatus) return;

    let overStatus: TaskStatus | null = null;

    if (TASK_STATUSES.includes(overId as TaskStatus)) {
      overStatus = overId as TaskStatus;
    } else {
      overStatus = findTaskStatus(overId);
    }

    if (!overStatus) return;

    if (activeStatus === overStatus) {
      return;
    }

    setTasksByStatus((previousTasks) => {
      const activeTask = previousTasks[activeStatus].find(
        (task) => task.id === activeTaskId,
      );

      if (!activeTask) {
        return previousTasks;
      }

      return {
        ...previousTasks,

        [activeStatus]: previousTasks[activeStatus].filter(
          (task) => task.id !== activeTaskId,
        ),

        [overStatus]: [
          ...previousTasks[overStatus],
          {
            ...activeTask,
            status: overStatus,
          },
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer === overContainer) {
      setTasksByStatus((previous) => {
        const tasks = previous[activeContainer];

        const oldIndex = tasks.findIndex((task) => task.id === activeId);
        const newIndex = tasks.findIndex((task) => task.id === overId);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return previous;
        }

        const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);

        return {
          ...previous,
          [activeContainer]: reorderedTasks.map((task, index) => ({
            ...task,
            position: index + 1,
          })),
        };
      });

      return;
    }

    setTasksByStatus((previous) => {
      const updated: Record<TaskStatus, Task[]> = {
        ...previous,
      };

      updated[activeContainer] = updated[activeContainer].map(
        (task, index) => ({
          ...task,
          position: index + 1,
        }),
      );

      updated[overContainer] = updated[overContainer].map((task, index) => ({
        ...task,
        status: overContainer,
        position: index + 1,
      }));

      return updated;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box className="flex flex-col gap-2">
        <TaskBoardHeader />
        <Box className="flex gap-5 w-full overflow-x-auto p-4">
          {TASK_STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
            />
          ))}
        </Box>
      </Box>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
