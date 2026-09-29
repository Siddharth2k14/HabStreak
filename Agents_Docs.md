# Rules to follow

## Architecture

### Frontend Architecture

- src/
  - components/
    - shared components
    - Tasks/
      - TaskBoard.tsx
      - TaskColumn.tsx
      - TaskCard.tsx
      - TaskStatusSelector.tsx
      - TaskFilters.tsx
      - TaskSearch.tsx
      - TaskActions.tsx
  - pages/
    - Authentication
    - Dashboard
    - TaskBoard
    - AllTasks
    - TaskDetails
    - Analytics
    - Profile
  - services/
    - task.service.ts
  - stores/
    - taskStore.ts
  - types/
    - TaskType.ts
  - styles/
    - global styles and theme styles

- Use React + React Router + Tailwind + dnd-kit
- Use a Kanban task board with 4 columns: Todo, Doing, In Review, Done
- Use optimistic UI updates for drag and drop
- Use the same task data across the Task Board and All Tasks page
- Do not use a date-based table or checkbox completion model
- Do not add focus timer components, APIs, or routes

### Backend Architecture

- src/
  - controllers/
    - task.controller.ts
  - routes/
    - task.routes.ts
  - services/
    - task.service.ts
  - validators/
    - task.validator.ts
  - middleware/
    - auth.middleware.ts
    - authorization.middleware.ts
    - validation.middleware.ts
    - error.middleware.ts
  - prisma/
    - schema.prisma

- Use PostgreSQL with Prisma ORM
- Keep authentication, authorization, validation, and error handling middleware in place
- Task status is the single source of truth for task column placement
- Each task must have a position value for ordering inside its current column
- Use transactions for task moves and reordering
- Remove old MongoDB and completion endpoint patterns
- Do not implement focus timer features or related endpoints

### Task System Rules

- Task status values: TODO, DOING, IN_REVIEW, DONE
- Each task belongs to exactly one status
- Each task contains:
  - id
  - title
  - description
  - status
  - priority
  - position
  - dueDate
  - userId
  - createdAt
  - updatedAt
- Task priority values: LOW, MEDIUM, HIGH
- Task movement rules:
  - move task between columns
  - reorder within the same column
  - update status and position together
  - persist changes in the database
  - return to previous state if backend update fails
- Task APIs:
  - POST /tasks
  - GET /tasks
  - GET /tasks/:taskId
  - PATCH /tasks/:taskId
  - PATCH /tasks/:taskId/status
  - PATCH /tasks/:taskId/move
  - DELETE /tasks/:taskId
- No focus timer endpoints or modules are part of this product scope

### Project Constraints

- Keep the app personal and user-owned, not collaborative task assignment based
- Avoid third-party paid services
- Protect user data and enforce ownership checks
- Keep the product aligned with the HabStreak Kanban task board specification from [Specs_for_HabStreak.md](Specs_for_HabStreak.md)
