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
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

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
        distance: 5,
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
    for (const status of Object.keys(tasksByStatus) as TaskStatus[]) {
      const task = tasksByStatus[status].find((task) => task.id === taskId);

      if (task) {
        return status;
      }
    }

    return null;
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
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box className="flex flex-col gap-2">
        <TaskBoardHeader />
        <Box className="flex gap-5 w-full overflow-x-auto p-4">
          <TaskColumn status="TODO" tasks={tasksByStatus.TODO} />

          <TaskColumn status="DOING" tasks={tasksByStatus.DOING} />

          <TaskColumn status="IN_REVIEW" tasks={tasksByStatus.IN_REVIEW} />

          <TaskColumn status="DONE" tasks={tasksByStatus.DONE} />
        </Box>
      </Box>

      <DragOverlay>
        {activeTask ? (
          <Box className="opacity-80">{activeTask.title}</Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
