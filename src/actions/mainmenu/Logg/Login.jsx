import React, { useState } from 'react'
import './Login.css'
import { Link } from 'react-router-dom'
 import google from "../../../images/google-removebg-preview.png"
 import authService from '../../../appwrite/auth'
  import { useNavigate } from 'react-router-dom'
 import svg from '../../../images/wired-lineal-12-layers-hover-slide.gif'
function Login() {
    let navigate = useNavigate()
  //  login with google 
    async function googlelogin() {
         try {
           let login = await authService.gogooglelogin();
           return login
          
         } catch (error) {
            console.log(error, "error in logging with google");
            
         }
    }

    //  login with input  
    
    const[email, setemail] = useState("")
    const[password, setpassword] = useState("")

   async function login(e){
     e.preventDefault(); 

    try {
      let logindetails = await authService.accountlogin(email, password);
      if (logindetails) {
           window.location.href = '/Newdash'; 
      }
      console.log(logindetails);
      
      
    } catch (error) {
           console.log(error);
           
    }
    }



  return (
    <div>
      {/* <div className="container-signup">
          <div className="container-left">
            <div className="leftsection">
              <h1 className='innerdepthheading'>Inner Depth</h1>
              <h4> Inner depth helps you connect and share with the people in your life.</h4>
            </div>
          </div>
          <div className="container-right">
            <div className="rightsection">
                <h1>Happening Now</h1>
              <form action="" className='signup-form' >
             
          <div className="mb-3">
            <input
              type="email"
              className="form-control" placeholder='email address' onChange={(e)=>setemail(e.target.value)} required ={true}/>
          </div>
          <div className="mb-3">
            <input
              type="password" 
              className="form-control" placeholder='password' onChange={(e)=>setpassword(e.target.value)} required = {true}
            />
          </div>
          <button className='signup-button' onClick={login}>Submit</button>
         
          <div className="login-section">
                    <span>Create account?</span>
                    <Link to ="/Signup">Signup</Link>
                    </div>
              </form>

         <p style={{textAlign:"center"}}>or</p>
         <button className='google-login' onClick={googlelogin}> <img src={google} alt=""   width={"43px"} height={"29px"}/>Login with google</button>
            </div>
        
          </div>
         </div> */}

         <div className="signuplayouts">
                <div className="layout1"></div>
                <div className="layout2">
                 <div className="formsection">
                       <div className="content-section" style={{paddingBottom : "15px"}}>
                          <h2 style={{fontSize : '2.5rem'}} >Login</h2>
                         <img src={svg} alt="" style={{width : "50px"}} />
                       </div>
                          <p>Login to access your dashboard</p>
         {/* <form action="" className='signup-form'  >
                       <div className="mb-3">
                     <input 
                       type="text" 
                       className="form-control" placeholder='enter name' required ={true}
                     />
                   </div>
                   <div className="mb-3">
                     <input 
                       type="email"
                       className="form-control" placeholder='email address' required ={true}/>
                   </div>
                   <div className="mb-3">
                     <input 
                       type="password"
                       className="form-control" placeholder='password' required = {true}
                     />
                   </div>
                   <div className="bothbutton">
         
                   <button className='signup-button' style={{backgroundColor : "#fc7200"}}> <i class="fa-solid fa-arrow-right"></i> Signup</button>
                       <button className='google-login'> <img src={google} alt=""  width={"43px"} height={"29px"} />Login with google</button>
                   </div>
                   <div className="login-section">
                   <span>Already have an account?</span>
                   <Link to ="/login">Login</Link>
                   </div>
                       </form> */}
                 {/* ////////////////////////////////////////////////////////////////// */}
           <form action="" className='signup-form' >
             
          <div className="mb-3">
            <input
              type="email"
              className="form-control" placeholder='email address'onChange={(e)=>setemail(e.target.value)} required ={true}/>
          </div>
          <div className="mb-3">
            <input
              type="password" 
              className="form-control" placeholder='password' onChange={(e)=>setpassword(e.target.value)} required = {true}
            />
          </div> <div className="bothbutton">
          <button className='signup-button' style={{backgroundColor : "#fc7200"}} onClick={login}><i class="fa-solid fa-arrow-right"></i> Login</button>
            <button className='google-login' onClick={googlelogin}> <img src={google} alt=""   width={"43px"} height={"29px"}/>Login with google</button></div>
          <div className="login-section">
                    <span>Create account?</span>
                    <Link to ="/Signup">Signup</Link>
                    </div>
              </form>             
                       
                       </div>
                </div>
                </div>
    </div>
  )
}

export default Login
