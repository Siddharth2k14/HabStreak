// import { Route, Routes, Navigate } from "react-router-dom";
// import { Authentication } from "./pages/Authentication/page.tsx";
// import HomePage from "./pages/Home Page/page.tsx";
// import { Toaster } from "react-hot-toast";
// import Dashboard from "./components/Dashboard/Dashboard.tsx";
// import ProfilePage from "./components/Profile Page/page.tsx";
// import Settings from "./components/Settings/Settings.tsx";
// import ChangePassword from "./components/Change Password/ChangePassword.tsx";
// import ChangeBackground from "./components/Change Background/ChangeBackground.tsx";
// import EmailVerified from "./components/Email Verified/EmailVerified.tsx";

import { TaskBoard } from "./components/TaskBoard/page";

// const ProtectedLayout = () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/auth/login" replace />;
//   }

//   return <HomePage />;
// };

function App() {
  return (
    <>
      <TaskBoard />
    </>
  );
}

export default App;
