# All Tasks Edit Task Modal Integration

This document describes the changes made in `page.tsx` to connect the
All Tasks page to the shared `EditTaskModal` component.

## Changes and reasons

- **Added the shared modal to the page.** `EditTaskModal` is imported and
  rendered with the selected task, saving state, error message, close handler,
  and save handler. This makes the existing edit form available from All Tasks
  without duplicating its UI.
- **Connected each row's Edit Task action to its task.** The action menu now
  tracks the ID of the row that opened it, and its Edit Task item passes that
  row's task to the edit handler. This ensures the modal is populated with the
  task the user selected.
- **Reset modal form state when switching tasks.** The modal receives a key
  based on the selected task ID, so opening it for another task initializes
  the form with that task's values rather than retaining the previous draft.
- **Used the All Tasks list as the task source of truth.** Removed the
  redundant task-by-status state and its lookup helper. The list is already
  loaded into `tasks`, so locating the selected task there avoids looking in
  an empty or stale board-only state.
- **Implemented saving and status changes.** Saving calls `updateTask` for
  title, description, priority, and due date. When the status changes, it also
  calls `moveTask`, placing the task at the end of the destination status by
  counting the other tasks currently in that status.
- **Refreshes data and reports failures.** After a successful save, the page
  reloads the task list so its display, filters, and sorting use server data.
  On save failure it reports an error and attempts to reload the list to
  recover from a potentially partial update.

## Scope

The changes cover editing tasks from All Tasks. The Delete task menu item is
not connected to a delete operation by this integration.
