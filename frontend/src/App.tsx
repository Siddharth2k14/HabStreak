import { Route, Routes, Navigate } from 'react-router-dom'
import { Authentication } from './pages/Authentication/page.tsx'
import HomePage from './pages/Home Page/page.tsx'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard/Dashboard.tsx'
import ProfilePage from './components/Profile Page/page.tsx'
import Settings from './components/Settings/Settings.tsx'
import ChangePassword from './components/Change Password/ChangePassword.tsx'
import ChangeBackground from './components/Change Background/ChangeBackground.tsx'
// import ChangePassword from './components/Change Password/ChangePassword.tsx'

const ProtectedLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return <HomePage />;
}

function App() {

  return (
    <>
      <Toaster position='top-right' />
      <Routes>
        <Route path='/auth/*' element={<Authentication />} />
        <Route path='/' element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/home-page" replace />} />
          <Route path='home-page' element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='profile-page' element={<ProfilePage />} />
          <Route path='settings' element={<Settings />} />
          <Route path='change-password' element={<ChangePassword />} />
          <Route path='change-background' element={<ChangeBackground />} />
        </Route>
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App

