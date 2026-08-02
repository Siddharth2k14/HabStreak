# What to Built?

You need to built a software named as HabStreak. It is basically a Habit & Daily Task Tracking software with the functionality like “Streak”. The user can track their habits & daily tasks with the help of this software. 

## Core Functionality

1. User Authentication → SignUp, LogIn, LogOut
2. There will be a table which should have the following things:
    1. first column → task name
    2. remaining columns → dates
    3. Each date → row → checkbox → to mark the task completed
3. There will be text area where the the user can see the tasks → marked as completed.
4. User should have following functions/options/powers:
    1. Create new task
    2. Update the task
    3. Delete the task
    4. View the created task
5. Each task row → three dot menu → 1. View, 2. Delete

## Analytics

1. Line Chart
2. Streak Graph (Like Github & LeetCode)
3. Segmented Radial Progress Gauge (Like LeetCode)
4. Other productivity charts

## User Experience

1. Design → Responsive for both Mobile & Desktop
2. Simple and Clean interface.
3. Instead of pure dark theme use grey theme

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

1. Store the User with the tasks and all the things related to it.
2. Data should be consistent or preserve across sessions.
3. Ensure the authorization (User can only see their own data).
4. Store user appearance preferences such as theme and custom dashboard background.

# How it should Built?

## Tech Stack

### Frontend

1. React TSX
2. React Router
3. TanStack / React Redux
4. Tailwind CSS
5. Material UI / ShadCN / Aceternity UI

### Backend

1. Express JS
2. Rest APIs
3. JWT
4. SQL
5. Nodemon

## Architecture

Frontend

├── Authentication Pages

├── Dashboard

├── Analytics

├── User Profile

Backend

├── Auth Service

├── Task Service

├── Analytics Service

## Database

MongoDB

├── Users

├── Tasks

├── Task Completions

## APIs

1. /auth/login → post ⇒ Login the user
2. /auth/signup → post ⇒ Signup the user
3. /auth/logout → post ⇒ Logout the user
4. /auth/me → get ⇒ Get the current user
5. /tasks → post ⇒ Create the tasks
6. /tasks → get ⇒ Get all the tasks
7. /tasks/:taskId → get ⇒ Get the tasks by taskId
8. /tasks/:taskId→ patch or put ⇒ Edit the tasks by taskId
9. /tasks/:taskId → delete ⇒ Delete the tasks by taskId
10. /tasks/assigned → post ⇒ To assign the tasks
11. /tasks/assigned → get ⇒ Fetch assigned tasks
12. /tasks/:taskId/completion → patch ⇒ Mark the tasks with specific taskId as completed

# What should be avoided?

1. Do not use third-party paid services.
2. Do not store passwords in plain text.
3. Avoid complex animations.
4. Do not require user registration for basic usage.

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
9. SQL/NoSQL injection attempts
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
- NoSQL injection attempt
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
- NoSQL injection attempt
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
- Invalid MongoDB ObjectId
- Task not found
- Task already deleted
- Unauthorized access
- Fetching another user's task
- Database timeout
- Database unavailable
- Corrupted task data

---

### `PATCH/PUT /tasks/:taskId`

- Missing taskId
- Invalid taskId
- Task not found
- Empty request body
- Invalid status
- Invalid priority
- Invalid due date
- Unauthorized update
- Updating another user's task
- Editing completed task
- Invalid status transition
- Database update failure
- Concurrent updates from multiple users

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
- Related assignment records still exist

---

### `POST /tasks/assigned`

- Missing taskId
- Missing assigneeId
- Invalid taskId
- Invalid assigneeId
- Task does not exist
- User does not exist
- Task already assigned
- Duplicate assignment request
- Assigning deleted task
- Assigning completed task
- Unauthorized assignment
- Assigning task to self when restricted
- Multiple assignments submitted simultaneously
- Database write failure

---

### `GET /tasks/assigned`

- User not authenticated
- No assigned tasks found
- Invalid query parameters
- Invalid pagination values
- Unauthorized access to another user's assignments
- Large number of assigned tasks
- Slow query execution
- Database timeout
- Database unavailable

---

### `PATCH /tasks/:taskId/completion`

- Missing taskId
- Invalid taskId
- Task not found
- Task already completed
- Unauthorized completion update
- User not assigned to task
- Completion status already true
- Task deleted before update
- Database update failure
- Concurrent completion requests
- Marking archived task as completed
- Invalid completion payload

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

### MongoDB / Database

- Invalid ObjectId
- Duplicate key error
- Database connection failure
- Database timeout
- Partial write failure
- Corrupted data

### Security

- NoSQL Injection
- XSS payloads
- CSRF attacks (cookie-based auth)
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
- Multiple users assigning same task
- Multiple completion requests
- Duplicate form submissions

### Performance

- Large data volume
- Large response payload
- Expensive database queries
- Missing indexes
- High traffic spikes
- Pagination not applied

# Future Requirements

## Focus Timer Module

Create a dedicated Focus Timer module that enables users to stay productive while working on their tasks. The timer should seamlessly integrate with the task management system, allowing users to measure and analyze the time spent on each task.

### Timer Modes

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

## Task Integration

The Focus Timer should be tightly integrated with the task management system.

### Task Actions

Every task should contain a Start Timer button.

The user should be able to choose:

- 🍅 Pomodoro Timer
- ⏳ Custom Countdown Timer

### Timer Association

Once selected:

- The timer becomes associated with the selected task.
- The task status changes to `In Progress`.
- The active timer remains visible until completed or stopped.

### When a Timer Ends

Display the following actions:

- ✅ Mark Task as Completed
- 🔁 Start Another Focus Session
- ⏸ Pause Timer
- ⏹ Stop Timer

If another session is started, focus time should continue accumulating for the same task.

---

## Focus Time Tracking

Record productivity statistics for every task.

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

## Timer Controls

Provide intuitive controls:

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

## Notifications

Notify users when:

- A focus session ends.
- A short break begins.
- A long break begins.
- A break ends.
- The timer is completed.

### Notification Types

- Sound notifications
- Desktop/Browser notifications (when permission is granted)

---

## Session Persistence

The timer should continue seamlessly even if:

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

## Focus Session History

Maintain a complete history of all focus sessions.

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

## Focus Timer UI Requirements

The Focus Timer should have a clean, modern, and distraction-free interface.

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