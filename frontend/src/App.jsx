import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import UserLogin from "./pages/UserLogin"
import UserSignup from "./pages/UserSignup"
import CaptainLogin from "./pages/CaptainLogin"
import CaptainSignup from "./pages/CaptainSignup"
import { UserDataContext } from './context/UserContext'
import Start from './pages/Start'
import Home from './pages/Home'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

const App = () => {
  const ans = useContext(UserDataContext)

  // console.log(ans)
  return (
    <div className='h-full w-full '>
      <div className='max-w-4xl mx-auto '>
        <Routes>
          <Route path='/' element={<Start />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/riding' element={<Riding />} />
          <Route path='/captain-riding' element={<CaptainRiding />} />
          <Route path='/signup' element={<UserSignup />} />
          <Route path='/captain-login' element={<CaptainLogin />} />
          <Route path='/captain-signup' element={<CaptainSignup />} />
          <Route path='/home' element={<UserProtectedWrapper><Home /></UserProtectedWrapper>} />
          <Route path='/captain-home' element={<CaptainProtectedWrapper><CaptainHome /></CaptainProtectedWrapper>} />
          <Route path='/user/logout' element={<UserProtectedWrapper><UserLogout /></UserProtectedWrapper>} />
          <Route path='/captain/logout' element={<CaptainProtectedWrapper><CaptainLogout /></CaptainProtectedWrapper>} />
        </Routes>
      </div>

    </div>
  )
}

export default App