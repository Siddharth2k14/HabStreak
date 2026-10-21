import React from "react";
import { TASK_STATUSES, type Task } from "../TaskBoard/types/task.types.ts";

interface EditTaskModalProps {
  task: Task | null;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (task: Task) => Promise<void>;
}

const inputClassName = `
  w-full rounded bg-gray-300 px-2 py-2 text-black
  focus:outline-none focus:ring-2 focus:ring-blue-400
  disabled:cursor-not-allowed disabled:opacity-60
`;

export const EditTaskModal = ({
  task,
  isSaving,
  error,
  onClose,
  onSave,
}: EditTaskModalProps) => {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [editedTask, setEditedTask] = React.useState<Task | null>(task);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (task && !dialog.open) {
      dialog.showModal();
    } else if (!task && dialog.open) {
      dialog.close();
    }
  }, [task]);

  const updateEditedTask = (updates: Partial<Task>) => {
    setEditedTask((current) =>
      current ? { ...current, ...updates } : current,
    );
  };

  const formatDateValue = (date: Date | null) => {
    if (!date || Number.isNaN(date.getTime())) {
      return "";
    }

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const handleClose = () => {
    if (isSaving) return;
    dialogRef.current?.close();
    onClose();
  };

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDialogElement>,
  ) => {
    if (event.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editedTask || !editedTask.title.trim()) return;

    await onSave(editedTask);
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      className="
        m-auto w-full max-w-2xl rounded-lg border-0 bg-transparent p-0
        shadow-none backdrop:bg-black/60 backdrop:backdrop-blur-sm
        open:flex open:items-center open:justify-center
      "
    >
      <div
        className="
          relative max-h-[90vh] w-full overflow-y-auto rounded-lg
          border-3 border-slate-600 bg-slate-900/95 p-8 scrollbar-none
        "
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isSaving}
          aria-label="Close edit task dialog"
          className="
            absolute right-4 top-4 text-3xl text-white transition
            hover:text-gray-300 disabled:opacity-50
          "
        >
          ×
        </button>

        <h1 className="mb-6 text-center text-4xl font-bold text-white">
          Edit Task
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded border border-red-400/50 bg-red-500/10 p-3 text-red-200"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="edit-title" className="mb-1 block text-lg text-white">
              Task Title
            </label>
            <input
              type="text"
              id="edit-title"
              maxLength={100}
              required
              disabled={isSaving}
              value={editedTask?.title ?? ""}
              onChange={(event) =>
                updateEditedTask({ title: event.target.value })
              }
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="edit-due-date"
              className="mb-1 block text-lg text-white"
            >
              Due Date
            </label>
            <input
              type="date"
              id="edit-due-date"
              disabled={isSaving}
              value={formatDateValue(editedTask?.dueDate ?? null)}
              onChange={(event) => {
                const value = event.target.value;
                updateEditedTask({
                  dueDate: value ? new Date(`${value}T12:00:00`) : null,
                });
              }}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="edit-priority"
              className="mb-1 block text-lg text-white"
            >
              Priority
            </label>
            <select
              id="edit-priority"
              disabled={isSaving}
              value={editedTask?.priority ?? "MEDIUM"}
              onChange={(event) =>
                updateEditedTask({
                  priority: event.target.value as Task["priority"],
                })
              }
              className={inputClassName}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="edit-status"
              className="mb-1 block text-lg text-white"
            >
              Status
            </label>
            <select
              id="edit-status"
              disabled={isSaving}
              value={editedTask?.status ?? "TODO"}
              onChange={(event) =>
                updateEditedTask({ status: event.target.value as Task["status"] })
              }
              className={inputClassName}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {{
                    TODO: "To Do",
                    DOING: "Doing",
                    IN_REVIEW: "In Review",
                    DONE: "Done",
                  }[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-1 block text-lg text-white"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              rows={3}
              maxLength={500}
              disabled={isSaving}
              value={editedTask?.description ?? ""}
              onChange={(event) =>
                updateEditedTask({ description: event.target.value })
              }
              className={`
                ${inputClassName}
                resize-none p-2
              `}
            />
          </div>

          <div className="flex justify-end gap-4 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="
                rounded-full px-6 py-3 text-lg font-semibold text-white
                transition hover:bg-slate-700 disabled:opacity-50
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !editedTask?.title.trim()}
              className="
                rounded-full bg-gray-400 px-12 py-3 text-lg font-semibold
                text-black transition duration-200 hover:bg-gray-500
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
