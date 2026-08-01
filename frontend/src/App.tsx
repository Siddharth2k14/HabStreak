import { Route, Routes } from 'react-router-dom'
import { Authentication } from './pages/Authentication/page.tsx'
import { Navbar } from './components/Navbar/page.tsx'

function App() {

  return (
    <Routes>
      <Route path='/auth/*' element={<Authentication />} />
    </Routes>
  )
}

export default App
