import { Route, Routes, Navigate } from 'react-router-dom'
import { Authentication } from './pages/Authentication/page.tsx'
import HomePage from './pages/Home Page/page.tsx'
import { Toaster } from 'react-hot-toast'
import Dashboard from './components/Dashboard/Dashboard.tsx'
import ProfilePage from './components/Profile Page/page.tsx'
// import ChangePassword from './components/Change Password/ChangePassword.tsx'

function App() {

  return (
    <>
      <Toaster position='top-right' />
      <Routes>
        <Route path='/auth/*' element={<Authentication />} />
        <Route path='/' element={<HomePage />}>
          <Route index element={<Dashboard />} />
          <Route path='home-page' element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='profile-page' element={<ProfilePage />} />
        </Route>
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App

