import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateModal,
  type CreateModalHandle,
} from "../Create Modal/CreateModal.tsx";
import { getTasks } from "../TaskBoard/services/task.service.ts";
import { getUser } from "../../services/auth.service.ts";
import {
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from "../TaskBoard/types/task.types.ts";
import { Plus } from "lucide-react";

const statusLabels: Record<TaskStatus, string> = {
  TODO: "TO-DO",
  DOING: "DOING",
  IN_REVIEW: "IN REVIEW",
  DONE: "DONE",
};

const Dashboard = () => {
  const [user, setUser] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const createModal = React.useRef<CreateModalHandle>(null);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const loadTasks = async () => {
      try {
        const loadedTasks = await getTasks();
        if (!cancelled) {
          setTasks(loadedTasks);
          setError(null);
        }
      } catch (loadError) {
        console.error("Failed to load dashboard tasks:", loadError);
        if (!cancelled) {
          setError("Unable to load your task overview.");
        }
      }
    };

    const loadUser = async () => {
      try {
        const findUser = await getUser();
        if (!cancelled && findUser) {
          setUser(findUser.username);
          setError(null);
        }
      } catch (loadError) {
        console.error("Failed to load dashboard user:", loadError);
        if (!cancelled) {
          setError("Unable to load your profile.");
        }
      }
    };

    void loadTasks();
    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const recentTasks = [...tasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  const getActivityLabel = (task: Task) => {
    if (task.createdAt.getTime() === task.updatedAt.getTime()) {
      return `Task "${task.title}" was created`;
    }

    if (task.status === "DONE") {
      return `Task "${task.title}" was completed`;
    }

    return `Task "${task.title}" is in ${statusLabels[task.status]}`;
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((currentTasks) => [task, ...currentTasks]);
  };

  return (
    <Box className="m-1 flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-3 text-white sm:p-4">
      <Box className="flex shrink-0 flex-col items-center gap-1 text-center">
        <Typography
        variant="h4"
          className="text-lg font-medium tracking-wide text-white sm:text-xl"
        >
          WELCOME, {user?.toUpperCase() ?? "BACK"}
        </Typography>
        <Typography className="text-sm text-slate-300">
          {new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </Typography>
      </Box>

      <Box className="flex shrink-0 items-center justify-between px-1 sm:px-6">
        <Button
          onClick={() => createModal.current?.open()}
          className="min-w-0 rounded-full bg-slate-200 px-5 py-1 text-xs normal-case text-slate-950 hover:bg-white"
        >
        <Plus />
          Create Task
        </Button>
        <Button
          onClick={() => navigate("/home-page/task-board")}
          className="min-w-0 rounded-full bg-slate-200 px-5 py-1 text-xs normal-case text-slate-950 hover:bg-white"
        >
          Go to Task Board
        </Button>
      </Box>

      <Box className="flex min-h-0 flex-1 flex-col gap-3 p-2 sm:p-3">
        <Typography
          variant="h5"
          className="shrink-0 text-center text-sm font-medium text-white"
        >
          QUICK OVERVIEW
        </Typography>

        <Box className="grid shrink-0 grid-cols-4 gap-1 text-center sm:gap-3">
          {TASK_STATUSES.map((status) => (
            <Box key={status} className="flex flex-col gap-2">
              <Typography className="text-xs text-slate-200 sm:text-sm">
                {statusLabels[status]}
              </Typography>
              <Typography className="text-sm text-white">
                {tasks.filter((task) => task.status === status).length}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box className="flex min-h-0 flex-1 flex-col p-2 sm:p-3">
          <Typography
            variant="h5"
            className="mb-3 shrink-0 text-center text-sm font-medium text-white"
          >
            RECENT ACTIVITY
          </Typography>
          {error ? (
            <Typography role="alert" className="text-sm text-red-300">
              {error}
            </Typography>
          ) : recentTasks.length > 0 ? (
            <ul className="list-inside list-disc space-y-1 overflow-y-auto text-lg text-slate-200">
              {recentTasks.map((task) => (
                <li key={task.id}>{getActivityLabel(task)}</li>
              ))}
            </ul>
          ) : (
            <Typography className="text-sm text-slate-400">
              No recent activity yet.
            </Typography>
          )}
        </Box>
      </Box>

      <CreateModal ref={createModal} onSuccess={handleTaskCreated} />
    </Box>
  );
};

export default Dashboard;
