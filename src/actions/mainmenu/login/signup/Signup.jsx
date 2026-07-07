import React, { useEffect, useState } from 'react'
import  './signup.css';
import leftlogo from '../../../../images/blogpost_logo-removebg-preview.png'
import authservice from '../../../../appwrite/auth';
import google from '../../../../images/google-removebg-preview.png'
import { Link } from 'react-router-dom';
import Login from '../../Logg/Login';
import { useNavigate } from 'react-router-dom';
import { createSlice } from '@reduxjs/toolkit';
import { useDispatch} from "react-redux";
// import signupimg from ''
import back from '../../../../images/birendra.png'
import svg from '../../../../images/wired-lineal-12-layers-hover-slide.gif'
import  impu from '../../../../images/full-shot-people-cleaning-together.jpg'

//  importing images for the one by one 
  import img1 from '../../../../images/ChatGPT Image May 21, 2026, 01_31_12 PM.png'
  import img2 from '../../../../images/ChatGPT Image May 21, 2026, 07_24_10 PM.png'
  import img3 from '../../../../images/ChatGPT Image May 21, 2026, 07_31_35 PM.png'
  import img4 from '../../../../images/ChatGPT Image May 21, 2026, 07_35_49 PM.png'


const slice = createSlice({
  name : "loginname",
  initialState : {value : ""},
  reducers :{
    valueplace :(state,action) =>{
      state.value = action.payload;
    }
    
  }
})
export const { valueplace } = slice.actions;
export const sender = slice.reducer;
function Signup() { 
  const navigate = useNavigate()
const dispatch = useDispatch()
const [inputname, setinputname] = useState("")
const [inputemail, setinputemail] = useState("") 
const [inputpassword, setinputpassword] = useState("")
const [loading, setloading] = useState("")
const [redirecting, setredirecting] = useState("")
async function submitsignup(e) {
      setloading("loading.....")  
      e.preventDefault();   
      const containersin = document.getElementsByClassName("container-signup")[0]
      if (containersin) {
        containersin.style.opacity = "0.2"  
      }
     try {
       const newaccount = await authservice.accountcreate(inputemail, inputpassword, inputname);
       console.log(newaccount.name)
       dispatch(valueplace(newaccount.name))
       if (newaccount) {
         try {
           const sessionstart = await authservice.accountlogin(inputemail, inputpassword);
           console.log( "your session start", sessionstart)
           localStorage.setItem("user", JSON.stringify(sessionstart.name));
           setredirecting("redirecting...") 

           setTimeout( ()=>{
            //  navigate("/Newdash")
            window.location.href = '/Newdash'; 
           },2000)
           
         } catch (error) {
               console.log(error)
         }
       }
      
     } catch (error) {
        console.log(error);
        
     }
   }

  //  google authentication


  async function googlelogin() {
     try {
      const Google = await authservice.gogooglelogin()
      console.log(Google)
     } catch (error) {
         console.log("error in logging with google", error);
     }
  }
   
  const[img, setimg] = useState(null)

  function puttingimage(){
       let arr = [0,1,2]
       const randomValue = arr[Math.floor(Math.random() * arr.length)];
       console.log(randomValue);
       
       let obj = {
           0 : img1,
           1 : img2,
           2 : img3,
           3 : img4
       }
       let making = obj[randomValue]
        console.log(making); 
        setimg(making)
  }
  useEffect(()=>{
    puttingimage()
  },[])
  return (
   <>
    {/* <h1 className='loadingstate'>{loading}</h1>
    <h2 className='loadingstate'>{redirecting}</h2>
    
         <div className="container-signup">
          <div className="container-left">
            <div className="leftsection">
              <h1 className='innerdepthheading'>Inner Depth</h1>
              <h4> Inner depth helps you connect and share with the people in your life.</h4>
            </div>
          </div>
          <div className="container-right">
            <div className="rightsection">
                <h1>Happening Now</h1>
              <form action="" className='signup-form' onSubmit={submitsignup}>
              <div className="mb-3">
            <input
              type="text" value={inputname} onChange={(event)=>setinputname(event.target.value)}
              className="form-control" placeholder='enter name' required ={true}
            />
          </div>
          <div className="mb-3">
            <input
              type="email" value={inputemail} onChange={(event)=>setinputemail(event.target.value)}
              className="form-control" placeholder='email address' required ={true}/>
          </div>
          <div className="mb-3">
            <input
              type="password" value={inputpassword} onChange={(event)=>setinputpassword(event.target.value)}
              className="form-control" placeholder='password' required = {true}
            />
          </div>
          <button className='signup-button'>Submit</button>
          <div className="login-section">
          <span>Already have an account?</span>
          <Link to ="/login">Login</Link>
          </div>
              </form>
         <p style={{textAlign:"center"}}>or</p>
         <button className='google-login' onClick={googlelogin}> <img src={google} alt=""  width={"43px"} height={"29px"}/>Login with google</button>
            </div>
          
          </div>
         </div> */}

       <div className="signuplayout">
       <div className="layout1">
       <div className="layout1content">
          <div className="layout1logo">
            <span>ngngngng</span>
          </div>
          <div className="layout1text">
             <h1 style={{
                  color: "#010101",
    fontFamily: 'McAfeePoppins',
    fontWeight: "600",

             }} >Explore the <br /> things <br /> <span style={{color : "blue" }}> you love.</span> </h1>
          </div>
       </div>
        <div className="layout1image">
        <img src={img} alt="" />
        </div>
       </div>
       <div className="layout2">
        <div className="formsection">
              <div className="content-section" style={{paddingBottom : "15px"}}>
                 <h2 style={{fontSize : '2.5rem'}} >Signup</h2>
                <img src={svg} alt="" style={{width : "50px"}} />
              </div>
                 <p>Sign in to access your dashboard</p>
<form action="" className='signup-form' onSubmit={submitsignup}>
              <div className="mb-3">
            <input 
              type="text" value={inputname} onChange={(event)=>setinputname(event.target.value)}
              className="form-control" placeholder='enter name' required ={true}
            />
          </div>
          <div className="mb-3">
            <input value={inputemail} onChange={(event)=>setinputemail(event.target.value)}
              type="email"
              className="form-control" placeholder='email address' required ={true}/>
          </div>
          <div className="mb-3">
            <input value={inputpassword} onChange={(event)=>setinputpassword(event.target.value)}
              type="password"
              className="form-control" placeholder='password' required = {true}
            />
          </div>
          <div className="bothbutton">

          <button className='signup-button' style={{backgroundColor : "#fc7200"}}> <i class="fa-solid fa-arrow-right"></i> Signup</button>
              <button className='google-login'> <img src={google} alt="" onClick={googlelogin} width={"43px"} height={"29px"} />Login with google</button>
          </div>
          <div className="login-section">
          <span>Already have an account?</span>
          <Link to ="/login">Login</Link>
          </div>
              </form>
              
              </div>
       </div>
       </div>
   </>
  )
}

export default Signup 
