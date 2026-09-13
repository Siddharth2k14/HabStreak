import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

import type {
    TaskPriority,
    TaskStatus,
} from "../TaskBoard/types/task.types.ts";

export interface CreateModalHandle {
    open: () => void;
    close: () => void;
}

interface CreateModalProps {
    onSuccess?: () => void;
}

type CreateTaskForm = {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: Date | null;
    status: TaskStatus;
};

export const CreateModal = forwardRef<
    CreateModalHandle,
    CreateModalProps
>(({ onSuccess }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [createTask, setCreateTask] =
        useState<CreateTaskForm>({
            title: "",
            description: "",
            priority: "LOW",
            dueDate: null,
            status: "TODO",
        });

    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
    }));

    const handleClose = () => {
        dialogRef.current?.close();
    };

    const handleBackdropClick = (
        e: React.MouseEvent<HTMLDialogElement>
    ) => {
        if (e.target === dialogRef.current) {
            handleClose();
        }
    };

    const resetForm = () => {
        setCreateTask({
            title: "",
            description: "",
            priority: "LOW",
            dueDate: null,
            status: "TODO",
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!createTask.title.trim()) {
            toast.error("Task title is required.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error(
                    "You must be logged in to create a task."
                );
                return;
            }

            const backendUrl =
                import.meta.env.VITE_BACKEND_URL ||
                "http://localhost:3000";

            const payload = {
                title: createTask.title.trim(),
                description: createTask.description.trim(),
                priority: createTask.priority,
                dueDate: createTask.dueDate
                    ? createTask.dueDate.toISOString()
                    : null,
                status: createTask.status,
            };

            await axios.post(
                `${backendUrl}/api/tasks`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Task created successfully!");

            resetForm();
            handleClose();

            onSuccess?.();

        } catch (error: unknown) {
            console.error(
                "Error creating task:",
                error
            );

            const errMsg = axios.isAxiosError(error)
                ? error.response?.data?.message ||
                  "Failed to create task."
                : "Failed to create task.";

            toast.error(errMsg);

        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="
                p-0
                bg-transparent
                border-0
                rounded-lg
                shadow-none
                backdrop:bg-black/60
                backdrop:backdrop-blur-sm
                max-w-2xl
                w-full
                m-auto
                open:flex
                open:items-center
                open:justify-center
            "
        >
            <div
                className="
                    border-3
                    border-slate-600
                    rounded-lg
                    w-full
                    max-h-[90vh]
                    p-8
                    bg-slate-900/95
                    relative
                    overflow-y-auto
                    scrollbar-none
                "
            >
                {/* Close Button */}

                <button
                    type="button"
                    onClick={handleClose}
                    className="
                        absolute
                        top-4
                        right-4
                        text-white
                        text-3xl
                        hover:text-gray-300
                        transition
                    "
                >
                    ×
                </button>

                <h1
                    className="
                        text-4xl
                        font-bold
                        text-white
                        mb-6
                        text-center
                    "
                >
                    Create Task
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >

                    {/* Title */}

                    <div>
                        <label
                            htmlFor="title"
                            className="
                                block
                                text-white
                                text-lg
                                mb-1
                            "
                        >
                            Task Title
                        </label>

                        <input
                            type="text"
                            id="title"
                            value={createTask.title}
                            onChange={(e) =>
                                setCreateTask({
                                    ...createTask,
                                    title: e.target.value,
                                })
                            }
                            className="
                                w-full
                                px-2
                                py-2
                                bg-gray-300
                                text-black
                                rounded
                                border-0
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-400
                            "
                        />
                    </div>

                    {/* Due Date */}

                    <div>
                        <label
                            htmlFor="dueDate"
                            className="
                                block
                                text-white
                                text-lg
                                mb-1
                            "
                        >
                            Due Date
                        </label>

                        <input
                            type="date"
                            id="dueDate"
                            value={
                                createTask.dueDate
                                    ? createTask.dueDate
                                        .toISOString()
                                        .slice(0, 10)
                                    : ""
                            }
                            onChange={(e) =>
                                setCreateTask({
                                    ...createTask,
                                    dueDate: e.target.value
                                        ? new Date(e.target.value)
                                        : null,
                                })
                            }
                            className="
                                w-full
                                px-2
                                py-2
                                bg-gray-300
                                text-black
                                rounded
                                border-0
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-400
                            "
                        />
                    </div>

                    {/* Priority */}

                    <div>
                        <label
                            htmlFor="priority"
                            className="
                                block
                                text-white
                                text-lg
                                mb-1
                            "
                        >
                            Priority
                        </label>

                        <select
                            id="priority"
                            value={createTask.priority}
                            onChange={(e) =>
                                setCreateTask({
                                    ...createTask,
                                    priority:
                                        e.target
                                            .value as TaskPriority,
                                })
                            }
                            className="
                                w-full
                                px-2
                                py-2
                                bg-gray-300
                                text-black
                                rounded
                                border-0
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-400
                            "
                        >
                            <option value="LOW">
                                Low
                            </option>

                            <option value="MEDIUM">
                                Medium
                            </option>

                            <option value="HIGH">
                                High
                            </option>
                        </select>
                    </div>

                    {/* Description */}

                    <div>
                        <label
                            htmlFor="description"
                            className="
                                block
                                text-white
                                text-lg
                                mb-1
                            "
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            rows={3}
                            value={createTask.description}
                            onChange={(e) =>
                                setCreateTask({
                                    ...createTask,
                                    description:
                                        e.target.value,
                                })
                            }
                            className="
                                w-full
                                bg-gray-300
                                text-black
                                rounded
                                border-0
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-400
                                resize-none
                                p-2
                            "
                        />
                    </div>

                    {/* Create Button */}

                    <div
                        className="
                            flex
                            justify-end
                            pt-1
                        "
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-12
                                py-3
                                bg-gray-400
                                text-black
                                text-lg
                                font-semibold
                                rounded-full
                                hover:bg-gray-500
                                transition
                                duration-200
                                disabled:opacity-50
                                cursor-pointer
                            "
                        >
                            {loading
                                ? "Creating..."
                                : "Create Task"}
                        </button>
                    </div>

                </form>
            </div>
        </dialog>
    );
});

CreateModal.displayName = "CreateModal";