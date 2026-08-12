import { Route, Routes } from 'react-router-dom'
import { Authentication } from './pages/Authentication/page.tsx'
import HomePage from './pages/Home Page/page.tsx'
import { Toaster } from 'react-hot-toast'
import NavBar from './components/NavBar/page.tsx'

import SideBar from "./components/SideBar/page.tsx"
import { CreateModal } from './components/Create Modal/CreateModal.tsx'
import { CurrentStreak, LongestStreak } from "./components/Analytics/AnalyticsHeader.tsx"
import AnalyticsFooter from './components/Analytics/AnalyticsFooter.tsx'
import Dashboard from './components/Dashboard/Dashboard.tsx'
import ProfilePage from './components/Profile Page/page.tsx'

function App() {

  return (
    <>
      <Toaster position='top-right' />
      <Routes>
        <Route path='/auth/*' element={<Authentication />} />
        <Route path='/home-page' element={<HomePage />} />
        <Route path='/profile-page' element={<ProfilePage />} />
      </Routes>
      {/* {/* <NavBar />
      <SideBar /> */} */}
      {/* <CreateModal /> */}
        {/* <CurrentStreak /> */}
        {/* <LongestStreak /> */}
        {/* <AnalyticsFooter /> */}
        {/* <Dashboard /> */}
        <HomePage />
      {/* <ProfilePage /> */}
    </>
  )
}

export default App
