import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { Task } from "../TaskBoard/types/task.types";

interface DeleteTaskModalProps {
  task: Task | null;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (task: Task) => Promise<void>;
}

const DeleteTaskModal = ({
  task,
  isSaving,
  error,
  onClose,
  onSave,
}: DeleteTaskModalProps) => {
  const handleConfirmDelete = async () => {
    if (!task || isSaving) return;
    await onSave(task);
  };

  return (
    <Dialog
      open={Boolean(task)}
      onClose={() => {
        if (!isSaving) onClose();
      }}
      fullWidth
      maxWidth="xs"
      aria-labelledby="delete-task-dialog-title"
    >
      <DialogTitle id="delete-task-dialog-title">Delete task?</DialogTitle>

      <DialogContent>
        Are you sure you want to delete <strong>{task?.title}</strong>? This
        action cannot be undone.
        {error && (
          <Alert severity="error" role="alert" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={() => void handleConfirmDelete()}
          disabled={!task || isSaving}
        >
          {isSaving ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskModal;