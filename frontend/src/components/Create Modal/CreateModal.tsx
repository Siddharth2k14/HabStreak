import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import toast from "react-hot-toast";

import type {
    Task,
    TaskPriority,
} from "../TaskBoard/types/task.types.ts";
import { createTask as createTaskApi } from "../TaskBoard/services/task.service.ts";

export interface CreateModalHandle {
    open: () => void;
    close: () => void;
}

interface CreateModalProps {
    onSuccess?: (task: Task) => void;
}

type CreateTaskForm = {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: Date | null;
};

const initialForm: CreateTaskForm = {
    title: "",
    description: "",
    priority: "LOW",
    dueDate: null,
};

export const CreateModal = forwardRef<
    CreateModalHandle,
    CreateModalProps
>(({ onSuccess }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [form, setForm] = useState<CreateTaskForm>(initialForm);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
    }));

    const handleClose = () => {
        if (loading) return;
        dialogRef.current?.close();
    };

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDialogElement>
    ) => {
        if (event.target === dialogRef.current) {
            handleClose();
        }
    };

    const resetForm = () => {
        setForm({ ...initialForm });
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!form.title.trim()) {
            toast.error("Task title is required.");
            return;
        }

        setLoading(true);

        try {
            const task = await createTaskApi({
                title: form.title.trim(),
                description: form.description.trim(),
                priority: form.priority,
                dueDate: form.dueDate,
            });

            // Notify the parent only after the API succeeds.
            onSuccess?.(task);

            toast.success("Task created successfully!");
            resetForm();
            dialogRef.current?.close();
        } catch (error: unknown) {
            console.error("Error creating task:", error);

            const message =
                typeof error === "object" &&
                error !== null &&
                "response" in error
                    ? (
                        error as {
                            response?: {
                                data?: { message?: string };
                            };
                        }
                    ).response?.data?.message
                    : undefined;

            toast.error(message || "Failed to create task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={handleBackdropClick}
            className="
                p-0 bg-transparent border-0 rounded-lg shadow-none
                backdrop:bg-black/60 backdrop:backdrop-blur-sm
                max-w-2xl w-full m-auto
                open:flex open:items-center open:justify-center
            "
        >
            <div
                className="
                    border-3 border-slate-600 rounded-lg w-full
                    max-h-[90vh] p-8 bg-slate-900/95 relative
                    overflow-y-auto scrollbar-none
                "
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Close create task dialog"
                    className="
                        absolute top-4 right-4 text-white text-3xl
                        hover:text-gray-300 transition
                        disabled:opacity-50
                    "
                >
                    ×
                </button>

                <h1 className="text-4xl font-bold text-white mb-6 text-center">
                    Create Task
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label htmlFor="title" className="block text-white text-lg mb-1">
                            Task Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            maxLength={100}
                            required
                            value={form.title}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    title: event.target.value,
                                }))
                            }
                            className="
                                w-full px-2 py-2 bg-gray-300 text-black
                                rounded focus:outline-none focus:ring-2
                                focus:ring-blue-400
                            "
                        />
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-white text-lg mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            value={
                                form.dueDate
                                    ? [
                                        form.dueDate.getFullYear(),
                                        String(form.dueDate.getMonth() + 1).padStart(2, "0"),
                                        String(form.dueDate.getDate()).padStart(2, "0"),
                                    ].join("-")
                                    : ""
                            }
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    dueDate: event.target.value
                                        ? new Date(`${event.target.value}T00:00:00`)
                                        : null,
                                }))
                            }
                            className="
                                w-full px-2 py-2 bg-gray-300 text-black
                                rounded focus:outline-none focus:ring-2
                                focus:ring-blue-400
                            "
                        />
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-white text-lg mb-1">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={form.priority}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    priority: event.target.value as TaskPriority,
                                }))
                            }
                            className="
                                w-full px-2 py-2 bg-gray-300 text-black
                                rounded focus:outline-none focus:ring-2
                                focus:ring-blue-400
                            "
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-white text-lg mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            maxLength={500}
                            value={form.description}
                            onChange={(event) =>
                                setForm((previous) => ({
                                    ...previous,
                                    description: event.target.value,
                                }))
                            }
                            className="
                                w-full bg-gray-300 text-black rounded
                                focus:outline-none focus:ring-2
                                focus:ring-blue-400 resize-none p-2
                            "
                        />
                    </div>

                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-12 py-3 bg-gray-400 text-black text-lg
                                font-semibold rounded-full hover:bg-gray-500
                                transition duration-200 disabled:opacity-50
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
});

CreateModal.displayName = "CreateModal";