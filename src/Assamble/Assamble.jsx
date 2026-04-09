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
// import { Outlet } from 'react-router-dom'


// const currentuser = async()=>{
//     const getuser = await authService.getcurrentuser();
//     return getuser;
// }

//  export default function Assamble() {
//   //  const selector = useSelector((state) => state.sendingname.loginname)
//   //  console.log(selector, "here is the selector");
//     //  let navigate = useNavigate
// //  giving restriction to the urls 
//    const [user, setuser] = useState(()=>{
//       if (navigator.onLine){
       
//       }
//    })
//    const [loading, setLoading] = useState(true); 
//    const [isOnline, setIsOnline] = useState(navigator.onLine);
//   //  const [isServerReachable, setIsServerReachable] = useState(true);
//    async function restrict() {
//      try {
//          if (navigator.onLine) {
//           setIsOnline(true)
//            let gettinguser = await authService.getcurrentuser() 
//            console.log(gettinguser, "getting");
//            if (gettinguser) {
//              setuser(gettinguser)
//          }
         
//         }
//         // else{
//         //   setuser(null)
//         // } 
        
//   } catch (error) {
//     // setuser(null)
//   } 
//       finally{
//         setLoading(false)
//       } 
//     }
//     useEffect(()=>{restrict()},[])   
    


// //  useeffect to detect the internet 

// useEffect(()=>{
//     const netonline = ()=>{ 
//          setIsOnline(true) 

//     }
//     const netoffline = ()=> setIsOnline(false)
//       window.addEventListener("online", netonline);
//     window.addEventListener("offline", netoffline);
    
//     return () => {
//     window.addEventListener("online", netonline); 
//     window.addEventListener("offline", netoffline);
//   };
// },[])

//   console.log(navigator.onLine);
//   console.log(isOnline, "gggg");
  
  

//  if (loading) {
  
//    return (
//      <div style={{ textAlign: "center", display : "flex", justifyContent : 'center', alignItems: "center", height : "100vh", backgroundColor : "white" }}>
//        <h2>Loading...</h2>
//      </div>
//    );
//  }

//    return (
//     <Routes>
//       {/* <Route  path='/' element ={<Newdashtesting/>}/>
//       <Route
//       path = '/testing'
//       element ={<Newdashtesting/>}
//       /> */}
      
//        <Route
//         path="/" 
       
//         element={  user ? <Newdash network ={isOnline} /> : <Home />}

//       />
//       <Route
//         path="/signup"
//         element={!user && isOnline === false ? <Signup /> : <Navigate to="/newdash" replace />}
//       />
//       <Route
//         path="/login"
//         element={user ? <Navigate to="/newdash" replace /> : <Login />}
//       />

// {/*  privacy components  */}

      
//       <Route
//         path="/dashboard"
//         element={user ? <Dashboard /> : <Navigate to="/login" replace />}
//       />
//       <Route
//         path="/profile"
//         element={user ? <Profile /> : <Navigate to="/login" replace />}
//       />
//       <Route
//         path="/newdash"
//         element={user ? <Newdash /> : <Navigate to="/login" replace />}
//       />
//       <Route
//         path="/userprofile/:username"
//         element={user ? <Userprofile /> : <Navigate to="/login" replace />}
//       />
//       <Route
//         path="/profileuser/:username"
//         element={user ? <Profileuser /> : <Navigate to="/login" replace />}
//       />
//       <Route
//         path="/Questions"
//         element={user ? <Questions /> : <Navigate to="/login" replace />}
//       />
//     </Routes>
//   )
//       }



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

  // ✅ run on mount + when internet comes back
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
            user ? <Newdash network={isOnline} /> : <h2>⚠️ Offline</h2>
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
      <Route
        path="/newdash"
        element={
          !isOnline ? (
            <h2>⚠️ Offline</h2>
          ) : user ? (
            <Newdash />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" />}
      />

      <Route
        path="/newdash"
        element={user ? <Newdash /> : <Navigate to="/login" />}
      />

      <Route
        path="/userprofile/:username"
        element={user ? <Userprofile /> : <Navigate to="/login" />}
      />

      <Route
        path="/profileuser/:username"
        element={user ? <Profileuser /> : <Navigate to="/login" />}
      />

      <Route
        path="/Questions"
        element={user ? <Questions /> : <Navigate to="/login" />}
      />

    </Routes>
  );
}
  
 


  //     