import { Route, Routes, Navigate } from "react-router-dom";
import { Authentication } from "./pages/Authentication/page.tsx";
import HomePage from "./pages/Home Page/page.tsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.tsx";
import EmailVerified from "./components/Email Verified/EmailVerified.tsx";
// import Dashboard from "./components/Dashboard/Dashboard.tsx";
// import ProfilePage from "./components/Profile Page/page.tsx";
// import Settings from "./components/Settings/Settings.tsx";
// import ChangePassword from "./components/Change Password/ChangePassword.tsx";
// import ChangeBackground from "./components/Change Background/ChangeBackground.tsx";

// import { TaskBoard } from "./components/TaskBoard/page";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/*" element={<Authentication />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home-page" element={<HomePage />} />
        </Route>

        {/* Email Verification Success Page */}
        <Route path="/email-verified" element={<EmailVerified />} />

        {/* Protected Application Routes */}
        {/*<Route path="/" element={<ProtectedLayout />}>*/}

        {/*<Route path="/home-page" element={<Dashboard />} />*/}

        {/*<Route path="/dashboard" element={<Dashboard />} />*/}

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
