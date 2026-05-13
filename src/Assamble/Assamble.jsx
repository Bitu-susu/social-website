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

import authService from '../appwrite/auth'

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
      } else {
        setuser(null);
      }
       
    } catch (error) {
      setuser(null);
    } finally {
      setLoading(false);
    }
  }
  
  
  useEffect(() => {
    restrict();
  }, []);
    
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
  
 
  
  
  
  // async function restrict(){
  //   try {
  //         if (!navigator.onLine) {
  //        const cached = localStorage.getItem("user");
  //        if (cached) {
  //          setUser(JSON.parse(cached));
  //         }
  //         } 
  //         else{
  //           const  gettinguser = await authService.getcurrentuser(); 
  //           console.log(gettinguser, "getting");
  //           setuser(gettinguser)
  //         }
  //       }
  //      catch (error) {
  //          console.log(error);  
  //          return error   
  //     }
  //     finally {
  //     setLoading(false);
  //     }

  //     //  window.addEventListener("online", restrict);

  // // user returns to tab
  // // document.addEventListener(
  // //   "visibilitychange",
  // //   () => {
  // //     if (
  // //       document.visibilityState === "visible"
  // //     ) {
  // //       restrict();
  // //     }
  // //   }
  // // );

  // // return () => {
  // //   window.removeEventListener(
  // //     "online",
  // //     restrict
  // //   );
  // //   }
  // }
  // useEffect(()=>{        
  // restrict()
  // },[])



  // ⏳ loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", display: "flex", justifyContent: 'center', alignItems: "center", height: "100vh"}}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <Routes>

      {/* ✅ HOME (FIXED LOGIC) */}
      <Route
        path="/"
        element={
          !isOnline ? (
            user ? <Newdash /> : <Newdash></Newdash>
          ) : user ? (
            <Navigate to="/newdash" />
          ) : (
            <Home />
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
        // element= {

        // user ? <Newdash /> : <Navigate to="/login" />}

       
           !isOnline ? (
            user ? <Newdash /> : <Newdash></Newdash>
          ) : user ? (
               <Newdash />
          ) : (
           <Navigate to="/login" />
          )
               }
      />

      <Route
        path="/userprofile/:username"
        element={user ? <Userprofile /> : <Navigate to="/login" />}
      /> for the 

      <Route
        path="/profileuser/:username"
        element={user ? <Profileuser /> : <Navigate to="/login" />}
      />

      <Route
        path="/Questions"
        element={user ? <Questions /> : <Navigate to="/login" />}
      />

    </Routes>  
  )
}
    export {useOnlineoffline} ;