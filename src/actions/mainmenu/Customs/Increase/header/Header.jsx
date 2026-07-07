import React from 'react'
 import './header.css'
 import { Link,useNavigate } from 'react-router-dom'
 import { useQuery } from '@tanstack/react-query'
 import {sendloginname} from '../../../../../redux/createslice'
 import { useDispatch } from 'react-redux'
function Header() {


     const navigate = useNavigate()
     const dispatch = useDispatch();
       const currentuser = async()=>{
       const getuser = await authService.getcurrentuser();
       return getuser;
     }
       const {data :currentusers} = useQuery({
         queryKey:["currentuser"],
         queryFn : currentuser,
         staleTime :  5 * 60 * 1000,
      })  
          //   declaring variables for the current user 
           let user = currentusers?.name;
           let authid = currentusers?.$id;
           let firstletter = currentusers?.name.charAt(0).toUpperCase() 


              function loginname() {
                     let loginname = user  
                     dispatch(sendloginname(loginname))
                     navigate(`/Userprofile/${loginname}`);
                   }
  return (
    
       <div className="headerr" id='header'>
            <div className="headerrleft">

        {/* <i className="fa-solid fa-house" style={{fontSize: "18px"}}></i> */}
        <Link to="/"><i className="fa-solid fa-house" style={{fontSize: "18px", color : "#0b57d0"}}></i></Link>
        <i className="fa-solid fa-users-line" style={{fontSize: "18px"}}></i> 
        <i className="fa-solid fa-bell" style={{fontSize: "18px"}}></i>
          <Link to="/Questions"><i className="fa-solid fa-book-open-reader" style={{fontSize: "18px", color : "#0b57d0"}}></i></Link>
        {/* <i className="fa-solid fa-book-open-reader" style={{fontSize: "18px"}}></i> */}
        </div>
        <div className="headermiddle">
        <input type="text" name="" id="" style={{height: "35px, width: 100%"}} className='dashboard-input' placeholder="search your favorite querry"/>
        </div>
        <div className="headerright">
            <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}}>{firstletter}</h6>
            {user?<><h6 style={{color : "black",fontWeight : "400"}}>{user.slice(0,7)}..</h6></> : <>loading..</>}
            {/* <h6 style={{color : "black",fontWeight : "400"}}>{user}</h6> */}
              <button style={{backgroundColor :"white", fontSize : "13.5px",color : "black", border : "1px solid #dcd5d5"} }onClick={loginname} >userprofile</button>
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}}   >Logout</button>
        </div>  
        </div> 
    
  )
}

export default Header
