 import React, { useEffect, useState } from 'react'
 import Navbar from '../actions/mainmenu/navbar/Navbar'
 import Signup from '../actions/mainmenu/login/signup/Signup'
 import { Routes, Route, useNavigate, Outlet, replace, Navigate } from 'react-router-dom'
 import Home from '../actions/mainmenu/home/Home'
//  import {  BrowserRouter as Router } from 'react-router-dom'
import Login from '../actions/mainmenu/Logg/Login'
import Dashboard from '../actions/mainmenu/dashboard/Dashboard'
import Profile from '../actions/mainmenu/profile/profile'
import { useSelector } from 'react-redux'
import Newdash from '../actions/mainmenu/dashnew/Newdash'
import Userprofile from '../actions/mainmenu/userprofile/Userprofile'
import Profileuser from '../actions/mainmenu/userprofile/Profileuser'
import Questions from '../actions/mainmenu/Questions/Questions'
import Status from '../actions/mainmenu/status/Status'
import './Assamble.css'
import authService from '../appwrite/auth'
 import Notifications from '../actions/mainmenu/notifications/Notifications'
//  import { Layout1 } from './Asa'
//  import { Layout2 } from './Asa'
//       }
const useOnlineoffline = ()=>{
    const[online, setonline] = useState(navigator.onLine)
        useEffect(() => {   
    window.addEventListener("online", ()=>setonline(true)); 
    window.addEventListener("offline", ()=> setonline(false));
    
    return () => {
      window.removeEventListener("online", ()=> setonline(true)); // ✅ FIX
      window.removeEventListener("offline", ()=>setonline(false)); // ✅ FIX
    };
  }, []);
         
  return {online}
 }

      export default function Assamble() {
        
  const [user, setuser] = useState(null); // ✅ simple
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
   
  
  // 🔥 fetch user
  async function restrict() {
      try {
          if (!navigator.onLine) return; // 🚫 stop if offline
      
          let gettinguser = await authService.getcurrentuser(); 
          console.log(gettinguser, "getting");

          if (gettinguser) {
              setuser(gettinguser);
                 setLoading(false);
            } else {
              setuser(null);
              setLoading(false);
            }
            
          } catch (error) {
            setuser(null);
          } 
    //       finally{
       
    //  }
  }
  
  
  useEffect(() => {
    restrict();
  }, [isOnline]);
    
  // 🌐 network listener (FIXED)
  useEffect(() => {
      const netonline = () => setIsOnline(true);
    const netoffline = () => setIsOnline(false);
    
    window.addEventListener("online", netonline);
    window.addEventListener("offline", netoffline);
   
    return () => {
      window.removeEventListener("online", netonline); // ✅ FIX
      window.removeEventListener("offline", netoffline); // ✅ FIX
    };
  }, []);
  
 
  
  
  
 


  // ⏳ loading state
  if (loading) {
    return (
      // <div style={{ textAlign: "center", display: "flex", justifyContent: 'center', alignItems: "center", height: "100vh"}}>
      //   <h2>Loading...</h2>
      // </div>
      <div className="dot-loader">
        <h3>loading</h3>
         <span></span>
  <span></span>
  <span></span>
  <span></span>
   </div> 
    );
  }
    
  return (
    <Routes>

      {/* <Route   element = {<Layout1/>}> */}

      {/* ✅ HOME (FIXED LOGIC) */} 
      <Route
         path="/"
         element  = {
    !isOnline ? (
      user ? (
        <Newdash />
      ) : (
        <Newdash />
      )
    ) : loading === true ? (
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h2>Loading...</h2>
      </div>
    ) : user ? (
      <Newdash />
    ) : (
      <Home></Home>
    )
  }
       

         
      />

      {/* ✅ AUTH ROUTES */}
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/newdash" />}
      />

      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/newdash" />}
      />
      
      {/* ✅ PROTECTED ROUTES */}
      {/* <Route
        path="/newdash"
        element={
          !isOnline ? (
            <Newdash></Newdash>
          ) : user ? (
            <Newdash />
          ) : (
            <Navigate to="/login" />
          )
        }
      /> */}
  
      <Route
        path="/profile" 
        element={user ? <Profile /> : <Navigate to="/login" />}
      />

      <Route
        path="/newdash"

        element  = {
    !isOnline ? (
      user ? (
        <Newdash />
      ) : (
        <Newdash />
      )
    ) : loading === true ? (
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h2>Loading...</h2>
      </div>
    ) : user ? (
      <Newdash />
    ) : (
      <Navigate to="/login" />
    )
  }
      />

      <Route
        path="/userprofile/:username"
        element={
          user ? <Userprofile /> : <Navigate to="/login" />}
      /> 

      <Route
        path="/profileuser/:username"
        element={user ? <Profileuser /> : <Navigate to="/login" />}
      />

      <Route
        path="/Questions"
        element={user ? <Questions /> : <Navigate to="/login" />}
      />
      <Route
        path="/notifications"
        element={user ? <Notifications /> : <Navigate to="/login" />}
      />

 
{/* </Route> */}

  {/* <Route element = {<Layout2/>} > */}
   <Route
        path="/status"
        element={user ? <Status/> : <Navigate to="/login" />}
      />
  
       
       
  {/* </Route> */}

    </Routes>  

  // <Newdash></Newdash>
  )
}
    export {useOnlineoffline};