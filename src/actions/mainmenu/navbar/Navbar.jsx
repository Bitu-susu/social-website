 import React from 'react'
 import newLogo from '../../../images/blogpost_logo-removebg-preview.png';
 import './Navbar.css'
 import { useNavigate } from 'react-router-dom';
 
 
 function Navbar() {
  const navigate = useNavigate()
   return (
     <>
     {/* <div className="navbar">
         <div className="container-nav">
            <div className="navbar__logo">
              <img src={newLogo} height={"65px"} alt="logo"/>
              
            </div>
            <div className="navbar__right">
                <button onClick={()=>navigate("/Signup")} >Signup/Login</button>
            </div>
         </div>
     </div> */}
     </>
   )
 }
 
 export default Navbar
 