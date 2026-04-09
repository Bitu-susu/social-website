import { useState } from 'react'
import './App.css'
import Assamble from './Assamble/Assamble'
import {  BrowserRouter as Router } from 'react-router-dom'
import Navbar from './actions/mainmenu/navbar/Navbar'
import Dashboard from './actions/mainmenu/dashboard/Dashboard'
import Check from './actions/mainmenu/chacking/Check'
import Profile from './actions/mainmenu/profile/profile'
import { useSelector } from 'react-redux';
import Signup from './actions/mainmenu/login/signup/Signup'
import Login from './actions/mainmenu/Logg/Login'
import Questions from './actions/mainmenu/Questions/Questions'

function App() {
  // const state = useSelector((state) => state);
  // console.log("🟢 Redux State in App:", state);

  return (
    <>
    <Router>
      <Navbar/>
     <Assamble/>
     {/* <Questions></Questions> */}
     </Router>
    {/* <div>
    <h1>Main App</h1>
  </div> */}

    </>
  )
}

export default App
