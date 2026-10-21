import { Route, Routes, Navigate } from "react-router-dom";
import { Authentication } from "./pages/Authentication/page.tsx";
import HomePage from "./pages/Home Page/page.tsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import EmailVerified from "./components/Email Verified/EmailVerified.tsx";
import TaskBoard from "./components/TaskDash/Dashboard.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";
import AllTasks from "./components/All Tasks/page.tsx";
// import { TaskBoard } from "./components/TaskBoard/page";
// import ProfilePage from "./components/Profile Page/page.tsx";
// import Settings from "./components/Settings/Settings.tsx";
// import ChangePassword from "./components/Change Password/ChangePassword.tsx";
// import ChangeBackground from "./components/Change Background/ChangeBackground.tsx";


function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<Authentication />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home-page" element={<HomePage />}>
            <Route index element={<TaskBoard />} />
            <Route path="task-board" element={<TaskBoard />} />
            <Route path="dashboard" element={<Dashboard />}/>
            <Route path="all-tasks" element={<AllTasks />}/>
            <Route path="analytics" element={<h1>Coming Soon</h1>}/>
          </Route>
          <Route
            path="/task-board"
            element={<Navigate to="/home-page/task-board" replace />}
          />
        </Route>

        {/* Email Verification Success Page */}
        <Route path="/email-verified" element={<EmailVerified />} />

        {/* Protected Application Routes */}
        {/*<Route path="/" element={<ProtectedLayout />}>*/}

        {/*<Route path="/home-page" element={<Dashboard />} />*/}


        {/*<Route path="/profile-page" element={<ProfilePage />} />*/}

        {/*<Route path="/settings" element={<Settings />} />*/}

        {/*<Route path="/change-password" element={<ChangePassword />} />*/}

        {/*<Route path="/change-background" element={<ChangeBackground />} />*/}
        {/*</Route>*/}

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
