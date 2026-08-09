import { Route, Routes } from 'react-router-dom'
import { Authentication } from './pages/Authentication/page.tsx'
import HomePage from './pages/Home Page/page.tsx'
import { Toaster } from 'react-hot-toast'
import NavBar from './components/NavBar/page.tsx'

function App() {

  return (
    <>
      {/* <Toaster position='top-right' />
    <Routes>
      <Route path='/auth/*' element={<Authentication />} />
      <Route path='/home-page' element={<HomePage />} />
    </Routes> */}
      <NavBar />
    </>
  )
}

export default App
