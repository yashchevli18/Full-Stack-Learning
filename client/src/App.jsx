import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import UserFormPage from './pages/UserFormPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/create' element={<UserFormPage />} />
          <Route path='/edit/:id' element={<UserFormPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
