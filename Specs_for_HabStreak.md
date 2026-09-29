# What to Build?

HabStreak is a habit and daily productivity application built around user accountability, streak tracking, and structured task execution. The product should help users manage personal tasks, focus sessions, and progress insights in a clean, motivating interface.

## Core Functionality

1. User Authentication
   - SignUp
   - Login
   - Logout

2. Task Management System
   - Users can create tasks.
   - Users can view tasks.
   - Users can update tasks.
   - Users can delete tasks.
   - Users can view detailed information about a task.

3. Kanban Task Board
   - Tasks should be organized into four columns:
     1. Todo
     2. Doing
     3. In Review
     4. Done
   - Users should be able to drag and drop tasks between columns.
   - Users should be able to reorder tasks within the same column.
   - Moving a task to another column should update its status.
   - Task changes should persist in the database.
   - The UI should use optimistic updates for a smooth drag-and-drop experience.
   - If the API request fails, the task should return to its previous position.

4. All Tasks Page
   - Users should be able to view all their tasks in a structured format.
   - Each task should display its current status/column.
   - Users should be able to change the task status without drag and drop.
   - Users should be able to search tasks.
   - Users should be able to filter tasks by status.
   - Users should be able to filter tasks by priority.
   - Users should be able to sort tasks.

5. Task Actions
   - Create Task
   - View Task
   - Edit Task
   - Delete Task
   - Change Task Status
   - Change Task Priority
   - Start Focus Timer (Future Work)

6. Task Details
   - Each task should have a detailed view.
   - Users should be able to view and update task information.
   - Users should be able to change the task status.
   - Users should be able to start a Focus Timer (Future Work).
   - Users should be able to view focus time and session history (Future Work).

## Task Status

Every task should belong to exactly one task status.

Available statuses:

1. TODO
2. DOING
3. IN_REVIEW
4. DONE

Status Mapping:

TODO
↓
Todo Column

DOING
↓
Doing Column

IN_REVIEW
↓
In Review Column

DONE
↓
Done Column

The task status should act as the single source of truth for determining which column a task belongs to.

## Task Position

Each task should contain a position value.

The position determines the order of a task inside its current status column.

Example:

TODO Column

Task A → Position 0
Task B → Position 1
Task C → Position 2

Users should be able to:

- Move tasks between different columns.
- Reorder tasks inside the same column.

When a task is moved:

- Its status should be updated if the column changes.
- Its position should be updated.
- Other affected tasks should be reordered accordingly.
- Database updates should be performed safely using a transaction.

## Analytics

1. Line Chart
2. Streak Graph (Like GitHub and LeetCode)
3. Segmented radial progress gauge (Like LeetCode)
4. Other productivity charts
5. Task completion trends by status
6. Focus time analytics and productivity insights (Future Work)

## User Experience

1. Design → Responsive for both Mobile and Desktop
2. Simple and clean interface
3. Grey-based theme with strong readability
4. Support light and dark mode
5. Focus on smooth task movement and real-time visual feedback

### Personalization

1. User can switch between Light Theme and Dark Theme.
2. User can upload a custom background image for the dashboard.
3. User can remove the custom background image and revert to the default background.
4. User can preview the selected background image before saving it.
5. The uploaded background image should persist across sessions.
6. The application should apply a semi-transparent overlay over the background image to maintain readability of text, tables, forms, and analytics components.
7. The application should support common image formats such as PNG, JPG, JPEG, and WebP.
8. The application should validate image size and reject excessively large uploads.

#### Custom Background Behavior

1. When a custom background image is applied, the dashboard background should use the uploaded image.
2. The Navbar should automatically become translucent.
3. The Sidebar should automatically become translucent.
4. The translucency level should maintain readability of text and UI components.
5. A blur (glassmorphism) effect may be applied to the Navbar and Sidebar.
6. Task tables, forms, analytics cards, and modal dialogs should remain clearly readable regardless of the selected background image.
7. The user should be able to reset the appearance settings to the default application theme at any time.

#### Glassmorphism

- Navbar → translucent background with backdrop blur.
- Sidebar → translucent background with backdrop blur.
- Opacity should be configurable between 60% and 90%.
- UI elements should maintain sufficient contrast with the background image.

## Data Management

1. Store the user with their tasks and related productivity data.
2. Data should be consistent and preserved across sessions.
3. Ensure authorization so each user can only access their own data.
4. Store user appearance preferences such as theme and custom dashboard background.
5. Store task status, position, and ordering data required for a reliable Kanban board.

# How it should be Built?

## Tech Stack

### Frontend

1. React TSX
2. React Router
3. TanStack / React Redux
4. Tailwind CSS
5. Material UI / ShadCN / Aceternity UI
6. dnd-kit

Use dnd-kit for:

- Drag and drop
- Sortable task cards
- Multiple task columns
- Task reordering

### Backend

1. Express JS
2. REST APIs
3. JWT
4. PostgreSQL
5. Prisma ORM
6. Nodemon

## Architecture

### Frontend

├── Authentication Pages
│
├── Dashboard
│
├── Task Management
│   │
│   ├── Task Board
│   │   ├── Todo Column
│   │   ├── Doing Column
│   │   ├── In Review Column
│   │   └── Done Column
│   │
│   ├── All Tasks Page
│   │
│   ├── Task Details Page
│   │
│   ├── Create Task
│   │
│   └── Edit Task
│
├── Focus Timer (Future Work)
│
├── Analytics
│
└── User Profile

### Backend

├── Auth Service
│
├── Task Service
│
├── Task Movement Service
│
├── Focus Timer Service (Future Work)
│
└── Analytics Service

## Database

PostgreSQL

Use Prisma ORM for database management.

Models:

├── User
│
├── Task
│
├── FocusSession
│
└── UserAppearance

## Task Data Model

Each task should contain:

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

Status values:

- TODO
- DOING
- IN_REVIEW
- DONE

Priority values:

- LOW
- MEDIUM
- HIGH

Position:

- Determines the order of the task inside its current status column.

## APIs

### Authentication

1. POST /auth/login
   → Login the user

2. POST /auth/signup
   → Register the user

3. POST /auth/logout
   → Logout the user

4. GET /auth/me
   → Get the current authenticated user

### Task APIs

5. POST /tasks
   → Create a new task

6. GET /tasks
   → Get all tasks belonging to the authenticated user

7. GET /tasks/:taskId
   → Get a specific task

8. PATCH /tasks/:taskId
   → Update task information

9. PATCH /tasks/:taskId/status
   → Change the task status

10. PATCH /tasks/:taskId/move
    → Move a task between columns and update its position

11. DELETE /tasks/:taskId
    → Delete a task

### Focus Timer APIs (Future Work)

12. POST /tasks/:taskId/timer/start (Future Work)

13. PATCH /timer/:timerId/pause (Future Work)

14. PATCH /timer/:timerId/resume (Future Work)

15. PATCH /timer/:timerId/stop (Future Work)

16. GET /tasks/:taskId/focus-sessions (Future Work)

## Middleware

The backend should use middleware to handle cross-cutting concerns before requests reach controllers.

### Request Flow

Client
↓
Logger Middleware
↓
Rate Limit Middleware
↓
Authentication Middleware
↓
Authorization Middleware
↓
Validation Middleware
↓
Controller
↓
Service
↓
Database
↓
Response

### auth.middleware.ts

Purpose:

- Verify JWT tokens.
- Authenticate users.
- Extract and attach user information to the request object.
- Block unauthenticated access to protected routes.

Protected Routes:

- GET /auth/me
- POST /tasks
- GET /tasks
- GET /tasks/:taskId
- PATCH /tasks/:taskId
- PATCH /tasks/:taskId/status
- PATCH /tasks/:taskId/move
- DELETE /tasks/:taskId

### authorization.middleware.ts

Purpose:

- Verify that a user has permission to perform the requested action.
- Prevent users from accessing or modifying resources owned by other users.

Examples:

- Editing another user's task.
- Deleting another user's task.
- Viewing another user's analytics.
- Accessing another user's profile.

### validation.middleware.ts

Purpose:

- Validate all incoming request payloads.
- Reject malformed or invalid requests before they reach controllers.

Validate:

- Authentication requests.
- Task creation requests.
- Task update requests.
- Task status update requests.
- Task movement requests.
- Task position values.
- Task priority values.
- Task due dates.

Examples:

- Missing required fields.
- Invalid email format.
- Invalid priority values.
- Empty task titles.

### logger.middleware.ts

Purpose:

- Log incoming requests and system events.
- Assist with debugging and monitoring.

Log Events:

- Login
- Signup
- Logout
- Task Creation
- Task Update
- Task Deletion
- Task Status Change
- Task Movement
- Task Reordering
- Focus Timer Started (Future Work)
- Focus Timer Paused (Future Work)
- Focus Timer Resumed (Future Work)
- Focus Timer Stopped (Future Work)
- System Errors

Do Not Log:

- Passwords
- JWT tokens
- Sensitive user information

Preferred Libraries:

- Winston
- Pino

### error.middleware.ts

Purpose:

- Provide centralized error handling.
- Prevent unhandled exceptions from crashing the application.
- Return standardized error responses.

Example Response:

{
  "success": false,
  "message": "Internal Server Error"
}

### rateLimit.middleware.ts

Purpose:

- Prevent brute-force attacks.
- Prevent API abuse.
- Protect authentication endpoints.

Recommended Usage:

- POST /auth/login
- POST /auth/signup
- POST /auth/logout

Suggested Response:

HTTP 429 Too Many Requests

### notFound.middleware.ts

Purpose:

- Handle requests for routes that do not exist.
- Provide consistent API responses.

Example Response:

{
  "success": false,
  "message": "Route Not Found"
}

## Task Movement Validation

When moving a task:

1. Verify taskId is valid.
2. Verify the task exists.
3. Verify the task belongs to the authenticated user.
4. Validate the target status.
5. Validate the target position.
6. Prevent invalid status values.
7. Update affected task positions.
8. Perform database changes using a transaction.
9. Return the updated task.

## Task Board UI Requirements

The application should provide a Kanban-style task board.

### Columns

The board should contain:

1. Todo
2. Doing
3. In Review
4. Done

### Task Cards

Each task card may display:

- Task title
- Description
- Priority
- Due date
- Focus time
- Number of focus sessions
- Current status
- Actions menu

### Drag and Drop

Users should be able to:

- Drag a task.
- Drop a task into another column.
- Reorder tasks within the same column.
- Move tasks between columns.

### Drag and Drop Behavior

When a task is dropped:

1. Update the UI immediately.
2. Send the update request to the backend.
3. Update task status.
4. Update task position.
5. Persist changes in the database.

If the API request fails:

1. Restore the previous task position.
2. Restore the previous task status.
3. Display an error message.

## All Tasks Page

The application should provide a separate page where users can view all their tasks.

Each task should display:

- Task title
- Description
- Priority
- Due date
- Current status
- Focus time
- Created date
- Updated date

### Features

Users should be able to:

- View all tasks.
- Search tasks.
- Filter tasks by status.
- Filter tasks by priority.
- Sort tasks.
- Open task details.
- Edit tasks.
- Delete tasks.
- Change task status.

### Status Change

Each task should provide a status selector.

Available options:

- TODO
- DOING
- IN_REVIEW
- DONE

When the status is changed:

1. Update the task.
2. Persist the change in the database.
3. Reflect the change on the Task Board.

The Task Board and All Tasks Page must use the same task data.
The task status should act as the single source of truth.

# What should be avoided?

1. Do not use third-party paid services.
2. Do not store passwords in plain text.
3. Avoid complex animations.
4. Do not require user registration for basic usage.
5. Do not keep the old date-based table task system.
6. Do not keep the old checkbox completion model as the main task flow.
7. Do not use MongoDB references in the production architecture.
8. Do not add separate completion endpoints as the normal task completion mechanism.

# Edge Cases

## Authentication

1. Empty name
2. Empty email
3. Empty password
4. Email without @
5. Email already exists
6. Password too short
7. Password too long
8. Special characters in name
9. SQL injection attempts
10. XSS payload

## API Failure

### `POST /auth/login`

- Email missing
- Password missing
- Email is empty string
- Password is empty string
- Invalid email format
- Email does not exist
- Wrong password
- Account disabled
- Account blocked
- Account not verified
- Password too short/too long
- Extremely long email value
- SQL injection attempt
- XSS payload in input
- Multiple failed login attempts (brute force)
- JWT generation failure
- Session creation failure
- Database unavailable during login
- Login from multiple devices simultaneously

---

### `POST /auth/signup`

- Name missing
- Email missing
- Password missing
- Empty fields
- Invalid email format
- Weak password
- Password too short
- Password too long
- Email already registered
- Username already exists
- Duplicate signup requests
- Race condition creating same account twice
- User attempts to assign role directly (`role: "admin"`)
- SQL injection attempt
- XSS payload submission
- Database write failure
- Email verification service failure

---

### `POST /auth/logout`

- Missing token
- Invalid token
- Expired token
- User already logged out
- Token blacklist failure
- Session not found
- Database/cache unavailable
- Logout from multiple devices
- Multiple logout requests simultaneously

---

### `GET /auth/me`

- Missing token
- Invalid token
- Expired token
- User not found
- User deleted after login
- User deactivated after login
- Corrupted user data
- Sensitive fields exposed accidentally
- Database unavailable
- Token user ID doesn't exist

---

### `POST /tasks`

- Missing title
- Empty title
- Empty description
- Invalid priority value
- Invalid status value
- Due date in the past
- Invalid due date format
- Extremely long title
- Extremely long description
- Duplicate task creation
- Missing required fields
- Unauthenticated user
- Unauthorized user
- Very large payload
- Database write failure

---

### `GET /tasks`

- User not authenticated
- No tasks exist
- Empty response
- Invalid page number
- Extremely large limit
- Invalid filters
- Invalid sorting field
- Slow database query
- Large dataset causing timeout
- Database unavailable

---

### `GET /tasks/:taskId`

- Missing taskId
- Invalid UUID
- Task not found
- Task already deleted
- Unauthorized access
- Fetching another user's task
- Database timeout
- Database unavailable
- Corrupted task data

---

### `PATCH /tasks/:taskId`

- Missing taskId
- Invalid taskId
- Task not found
- Empty request body
- Invalid priority
- Invalid due date
- Unauthorized update
- Updating another user's task
- Database update failure
- Concurrent updates from multiple users

This endpoint should focus on:

- Title
- Description
- Priority
- Due Date

---

### `PATCH /tasks/:taskId/status`

- Missing taskId
- Invalid taskId
- Task not found
- Missing status
- Null status
- Invalid status value
- Invalid status transition
- Attempting to move task to an unavailable column
- Task already belongs to the selected column
- Unauthorized status change
- Concurrent status updates

---

### `PATCH /tasks/:taskId/move`

- Missing taskId
- Invalid taskId
- Task not found
- Unauthorized task movement
- Moving another user's task
- Missing status
- Invalid status
- Missing position
- Invalid position
- Negative position
- Position greater than available tasks
- Moving task to same position
- Moving task to same column
- Moving task between columns
- Empty target column
- Concurrent task movement
- Database transaction failure
- Partial reorder failure
- Network failure during drag and drop

---

### `DELETE /tasks/:taskId`

- Missing taskId
- Invalid taskId
- Task not found
- Task already deleted
- Unauthorized delete
- Deleting another user's task
- Database failure
- Database timeout
- Multiple delete requests simultaneously

---

## Global Edge Cases (Applicable to All Endpoints)

### Authentication

- Missing token
- Invalid token
- Expired token
- Tampered JWT
- Revoked token
- User deleted but token still valid

### Authorization

- User accessing another user's data
- User performing admin actions
- Role mismatch
- Permission escalation attempts

### Validation

- Missing required fields
- Null values
- Empty strings
- Invalid data types
- Unexpected fields in payload
- Large payload size

### PostgreSQL / Database

- Invalid UUID
- Foreign key constraint failure
- Unique constraint violation
- Database connection failure
- Database timeout
- Transaction failure
- Partial write failure
- Concurrent transaction conflict
- Database rollback
- Corrupted data

### Security

- SQL injection attempts
- XSS payloads
- CSRF attacks
- Brute force attacks
- Rate limit abuse
- Request flooding
- Mass assignment attacks

### Network

- Request timeout
- Slow network
- Client disconnect during request
- Reverse proxy failure
- API gateway failure

### Concurrency

- Multiple users editing same task
- Multiple users deleting same task
- Multiple requests changing task status
- Multiple requests moving the same task
- Task moved while being deleted
- Task moved while being edited
- Task position conflict
- Concurrent task reordering
- Two requests assigning the same position
- Database transaction rollback

### Performance

- Large data volume
- Large response payload
- Expensive database queries
- Missing indexes
- High traffic spikes
- Pagination not applied

### Task Board Concurrency

- Multiple requests moving the same task.
- Multiple requests changing task status.
- Task moved while being deleted.
- Task moved while being edited.
- Task position conflict.
- Concurrent task reordering.
- Two requests assigning the same position.
- Database transaction rollback.

# Future Requirements

## Focus Timer Module (Future Work)

Create a dedicated Focus Timer module (Future Work) that enables users to stay productive while working on their tasks. The timer should seamlessly integrate with the task management system, allowing users to measure and analyze the time spent on each task.

### Timer Modes (Future Work)

#### 1. Pomodoro Timer

Implement a Pomodoro timer based on the Pomodoro Technique with fully customizable settings.

##### Features

- Customizable focus duration (e.g., 25 minutes).
- Customizable short break duration (e.g., 5 minutes).
- Customizable long break duration (e.g., 15–30 minutes).
- Configure the number of focus sessions before a long break.
- Automatically alternate between focus sessions and breaks.
- Display the current session type:
  - Focus Session
  - Short Break
  - Long Break
- Display:
  - Remaining time
  - Current cycle number
  - Total completed cycles
- Optional auto-start for the next focus session or break.

#### 2. Custom Countdown Timer

Provide a standard countdown timer for users who prefer uninterrupted work sessions.

##### Features

- Allow users to choose any duration.
- No automatic breaks or cycles.
- Suitable for coding, reading, studying, meetings, workouts, or deep work.

---

## Task Integration (Future Work)

The Focus Timer should be tightly integrated with the task management system (Future Work).

### Task Actions (Future Work)

Every task should contain a Start Timer button (Future Work).

The user should be able to choose:

- 🍅 Pomodoro Timer
- ⏳ Custom Countdown Timer

### Timer Association (Future Work)

Once selected:

- The timer becomes associated with the selected task.
- The task status changes to `DOING`.
- If the task is currently in `TODO` and the user starts a Focus Timer (Future Work), the task should automatically move to the `DOING` column.
- The active timer remains visible until completed or stopped.

### When a Timer Ends

Display the following actions:

- ✅ Mark Task as Completed
- 🔁 Start Another Focus Session
- ⏸ Pause Timer
- ⏹ Stop Timer

If another session is started, focus time should continue accumulating for the same task.

---

## Focus Time Tracking (Future Work)

Record productivity statistics for every task (Future Work).

Each task should store:

- Total focus time
- Number of completed sessions
- Average session duration
- Timer type used
- Session history with timestamps

Display this information:

- Inside the task details page.
- On the productivity analytics dashboard.

---

## Timer Controls (Future Work)

Provide intuitive controls (Future Work):

- ▶ Start
- ⏸ Pause
- ▶ Resume
- 🔄 Restart
- ⏹ Stop

The interface should always display:

- Countdown timer
- Current timer mode
- Current session status
- Progress indicator
- Remaining time

---

## Notifications (Future Work)

Notify users when (Future Work):

- A focus session ends.
- A short break begins.
- A long break begins.
- A break ends.
- The timer is completed.

### Notification Types

- Sound notifications
- Desktop/Browser notifications (when permission is granted)

---

## Session Persistence (Future Work)

The timer should continue seamlessly even if (Future Work):

- The page is refreshed.
- The browser is closed and reopened.
- The user navigates to another page within the application.

Persist:

- Remaining time
- Current timer mode
- Linked task
- Current cycle
- Session state:
  - Running
  - Paused
  - Stopped

---

## Focus Session History (Future Work)

Maintain a complete history of all focus sessions (Future Work).

Each session record should include:

- Task name
- Timer type
- Start time
- End time
- Total duration
- Session status:
  - Completed
  - Interrupted
  - Cancelled

This history should power productivity reports and insights.

---

## Focus Timer UI Requirements (Future Work)

The Focus Timer should have a clean, modern, and distraction-free interface (Future Work).

### Requirements

- Responsive design for desktop, tablet, and mobile.
- Full support for Light Theme and Dark Theme.
- Support custom dashboard backgrounds.
- Smooth animations for timer transitions.
- Circular or linear progress indicator.
- Large and readable countdown digits.
- Easily accessible controls.
- Minimalist design focused on productivity.

## Productivity Analytics

- Use recorded timer data to generate advanced productivity insights.
- Correlation between task completion streaks and focus sessions.
- Focus consistency score.
- Weekly productivity score.
- Monthly productivity score.

### Analytics Metrics

- Total focus time:
  - Today
  - Week
  - Month
  - Year
- Number of completed Pomodoro sessions.
- Number of completed Countdown sessions.
- Average daily focus time.
- Most productive day.
- Most productive hour.
- Time spent on each task.
- Time spent on each category/project.
- Longest uninterrupted focus session.
- Daily focus streaks.
- Weekly focus streaks.

These insights should help users understand and improve their productivity over time.

# Recommended Final Task System Architecture

This is what HabStreak should represent:

                         HABSTREAK

                            │
                            ▼

                    TASK MANAGEMENT

                            │

             ┌──────────────┴──────────────┐

             │                             │

             ▼                             ▼

        TASK BOARD                     ALL TASKS

        Kanban View                 Structured View

             │                             │

      Drag and Drop                 Status Dropdown

             │                             │

             └──────────────┬──────────────┘

                            │

                    SAME TASK DATA

                            │

              ┌─────────────┴─────────────┐

              │                           │

              ▼                           ▼

           STATUS                       POSITION

              │                           │

              ▼                           ▼

        Task Column                  Task Order

                            │

                            ▼

                      TASK SERVICE

                            │

                            ▼

                   PRISMA TRANSACTION

                            │

                            ▼

                       POSTGRESQL

## Recommended Frontend Component Structure

src

├── pages
│
│   ├── Dashboard
│   │
│   ├── TaskBoard
│   │
│   ├── AllTasks
│   │
│   ├── TaskDetails
│   │
│   ├── Analytics
│   │
│   └── Profile
│
├── components
│
│   └── Tasks
│       │
│       ├── TaskBoard.tsx
│       ├── TaskColumn.tsx
│       ├── TaskCard.tsx
│       ├── TaskStatusSelector.tsx
│       ├── TaskFilters.tsx
│       ├── TaskSearch.tsx
│       └── TaskActions.tsx
│
├── services
│
│   └── task.service.ts
│
├── types
│
│   └── TaskType.ts
│
└── store
    │
    └── taskStore.ts

## Recommended Backend Structure

src

├── routes
│
│   └── task.routes.ts
│
├── controllers
│
│   └── task.controller.ts
│
├── services
│
│   └── task.service.ts
│
├── validators
│
│   └── task.validator.ts
│
├── middleware
│
│   ├── auth.middleware.ts
│   ├── authorization.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
│
└── prisma
    │
    └── schema.prisma

## Important Recommendation

The specification should be updated before implementing the task board. The previous date-based task table, checkbox completion model, MongoDB references, and the old `In Progress` focus timer status conflict with the new Kanban-based architecture and should be removed from the final product design.
- Daily focus streaks.
- Weekly focus streaks.

These insights should help users understand and improve their productivity over time.