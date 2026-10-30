import React, { useState } from 'react'
 import './header.css'
 import { Link,useNavigate } from 'react-router-dom'
 import { useQuery } from '@tanstack/react-query'
 import {sendloginname} from '../../../../../redux/createslice'
 import { useDispatch } from 'react-redux'
 import authService from '../../../../../appwrite/auth'
 import conf from '../../../../../appwrite/conf'
 import { databases } from '../appwritesdk'
 import { ID,Query } from 'appwrite'
import { useEffect } from 'react'

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

        async function sessionend(e) {
        e.preventDefault()
          try {
                    let endingsession = await authService.logout()
                  //  setuser(null)  
                   if (endingsession) {
                  //  navigate('/login')
                    window.location.href = '/login'; 
                   }
                 console.log(endingsession, "ending");
                 
          } catch (error) {
             alert("error in logout")
          }
      }


          //   declaring variables for the current user 
           let user = currentusers?.name;
           let authid = currentusers?.$id;
           let firstletter = currentusers?.name.charAt(0).toUpperCase() 


              function loginname() {
                     let loginname = user  
                     dispatch(sendloginname(loginname))
                     navigate(`/Userprofile/${loginname}`);
                   }

          //  working with notification last seen 
          let [notifications, setnotifications] = useState("")
          //  fetching all the notifications
          async function fetchingallnotifications(){
            try {
                    
                //  first fetching user last seen 
                 let fetchlastseen = await databases.listDocuments(
                     
                   conf.appwritedatabaseid,conf.appwritelastseenid,[Query.equal("authid", authid)]
                 )
                 let lastseen = fetchlastseen.documents[0]

                //  fetching followers 
                
                    
                    const fetchfollowers = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritefollowersid,[Query.equal("reciever", authid)])
                    // console.log(fetchfollowers, "followings");
                    //   fetching comments
                     const fetchingcomments =  await databases.listDocuments(conf.appwritedatabaseid, conf.appwritecommentsid,[Query.equal("postcreator", authid)]
        )
                    //   fetching likes
                     const fetchlikes = await databases.listDocuments( conf.appwritedatabaseid,conf.appwritelikesid,[Query.equal("postcreator", authid)])     
                     
                     let mixall = [...fetchfollowers.documents,...fetchingcomments.documents,...fetchlikes.documents]
                        //  console.log(mixall, "mixed");
                  
                     
              let finalarray =  mixall.filter((listings)=>{
                        if (new Date(listings.$createdAt) >new Date(lastseen.lastseen)) {
                           return listings
                        }
                 } )
                 if (finalarray.length > 0) {
                   setnotifications(finalarray.length)
                 }
                  else {
                    setnotifications("")
                  }
               
            } catch (error) {
                console.log(error, "error in filtering the new notifications");   
            }
}

      useEffect(() => {
    if (!authid) return;

    fetchingallnotifications();
}, [authid,]);




         async  function lastseen(){
            try {
                 let fetchlastseen = await databases.listDocuments(
                   conf.appwritedatabaseid,conf.appwritelastseenid,[Query.equal("authid", authid)]
                 )
                 console.log(fetchlastseen.documents[0]);
                  let document = fetchlastseen.documents[0]
       
                 if (fetchlastseen.documents.length === 0) {
                   let lastseen = await databases.createDocument(
                     conf.appwritedatabaseid,conf.appwritelastseenid,ID.unique(),{
                      "authid" : authid,
                      "lastseen" : new Date().toISOString()
                     } 
                   )
                  //  console.log(lastseen, "lastseen");
                   
                 }
                 else{
                    let updatelastseen = await databases.updateDocument(
                   conf.appwritedatabaseid,conf.appwritelastseenid,document.$id,{
                       "authid" : authid,
                      "lastseen" : new Date().toISOString()
                   }
                    )
                    console.log(updatelastseen, "last seen update successfully");
                    
                 }
                 
                  setnotifications("")

            } catch (error) {
               console.log(error, "error in last seen");
               
            }
           }
  return (
    
       <div className="headerr" id='header' >
            <div className="headerrleft">

        {/* <i className="fa-solid fa-house" style={{fontSize: "18px"}}></i> */}
        <Link to="/"><i className="fa-solid fa-house" style={{fontSize: "18px", color : "#0b57d0"}}></i></Link>
        <Link to="/status"> <i className="fa-solid fa-users-line" style={{fontSize: "18px"}} ></i></Link>
         
          <div className="with-notification" style={{display : "flex", position : "relative"}}>
         <Link to="/notifications"> <i className="fa-solid fa-bell" style={{fontSize: "18px", color : "#0b57d0"}}onClick={lastseen} ></i></Link>
         <div className="notification-no" style={{padding : "3px"}}>
           <h6 style={{color : "black",position : "absolute", right :'-1px', top :"-5px",fontWeight : "600", fontSize : '16px' }}>{notifications}</h6>
         </div>
          </div>

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
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick={sessionend}>Logout</button>
        </div>  
        </div> 
    
  )
}

export default Header
