import React, { useState,useRef, useEffect } from 'react'
import './status.css'

import EmojiPicker from "emoji-picker-react"
import conf from '../../../appwrite/conf'
// import { databases } from '../../../Customs/Increase/appwritesdk'
 import authService from '../../../appwrite/auth'
 import { databases } from '../Customs/Increase/appwritesdk'
 import { QueryClient, useQuery,useQueryClient } from '@tanstack/react-query'
 import useProfile from '../Customs/Increase/userprofile'
 import {  Storage, ID } from 'appwrite'
import { useAsyncValue } from 'react-router-dom'
import {Query} from 'appwrite'
import { useContext } from "react";
import { Mycontext } from './Context'
import Chat from '../Customs/Increase/chat/Chat'
import { Link } from 'react-router-dom'
import { client } from '../Customs/Increase/appwritesdk'
import Header from '../Customs/Increase/header/Header'

function Status() {
// let mydisplay = useContext(Mycontext)
const queryClient =  useQueryClient();
  //  for styling nav
  let [nav, setnav] = useState(
                 "none"
           )

           function togglenav(){
              setnav( prev => prev === "none"? "block" : "none")
           }

           let[text, settext] = useState("")
            const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);

  function addEmoji(emojiData) {
    const emoji = emojiData.emoji;
    const input = inputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const newStatus =
      text.slice(0, start) +
      emoji +
      text.slice(end);

    settext(newStatus);
    setShowEmoji(false);

    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(
        start + emoji.length,
        start + emoji.length
      );
    });
  }

  //  add background color functionality

  const [bagcolor,setbagcolor] = useState("blue")

    function backgroundcolor(){
         let arr = [0,1,2,3,4,5,6,7]
               const randomValue = arr[Math.floor(Math.random() * arr.length)];
               console.log(randomValue);
               
               let obj = {
                   0 : "blue",
                   1 : "red",
                   2 : "pink",
                   3 : "green",
                   4 : "orange",
                   5 : "brown",
                   6 : "purple",
                   7 : "black"
               }
               let making = obj[randomValue]
                console.log(making); 
                setbagcolor(making)
    }
     
    const[first, setfirst] = useState("none")
    const[second, setsecond] = useState("block")

    function a(){
       setfirst(prev => prev === "block" ? "none" : "block")
       setsecond(prev => prev === "none" ? "block" : "none")
    }
    function b(){
       setfirst(prev => prev === "none" ? "block" : "none")
      setsecond(prev => prev === "block" ? "none" : "block")
    }

    // add file text

    const fileref = useRef(null)

                                                //  adding every thing into database 
  
  //   Adding images as status into database

   const currentuser = async()=>{
   const getuser = await authService.getcurrentuser();

   return getuser;
   }
        const {data :currentusers} = useQuery({
            queryKey:["currentuser"],
            queryFn : currentuser,
            staleTime :  10 * 60 * 1000,
         })
         
         let user = currentusers?.name;
           let authid = currentusers?.$id;
     
   async function addingtext(){
      try {
        const addstatus = await databases.createDocument(conf.appwritedatabaseid,conf.appwritestatusid,ID.unique(),{
           "authid" :  authid,
           "name" : user,
           "type" : "text",
           "seen" : [],
           "content" : text,
           "color" : bagcolor,
           "url" : profile?.picurl
        }
      ) 
      console.log(addingtext, "status added");
      if (addstatus) {
         settext("");
       setfirst(prev => prev === "block" ? "none" : "block")
       setsecond(prev => prev === "none" ? "block" : "none")
      }
       
      return addstatus

    } catch (error) {
          console.log(error,'error in uploading status');
          return error
      }
     
  }

  //  fetching status giver , 
    
 async function fetchstatusgiver(){
    try {
       const fetchingstatusgiver = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("giver", authid)]
       )
       console.log(fetchingstatusgiver, "fetched");
       
       
       const fetchmystatus = await databases.listDocuments(
               conf.appwritedatabaseid, conf.appwritestatusid,);
               let reversing = fetchmystatus.documents.reverse()

               console.log(reversing, "reversed");
               
        
          let finding = fetchingstatusgiver.documents.map((element)=>{
               let findingstatus = reversing.find((element1)=>{
                 return element1.authid === element.reciever
               })
               console.log(findingstatus, "statusfinded");
               
               return findingstatus
              
          })
          console.log(finding, "finded");
              
            let filtermapping = await finding.filter(Boolean).map((objects)=>{
      let now = new Date();
      let created = new Date(objects.$createdAt)
      let difference = now - created;
      let seconds = Math.floor(difference/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      // if (days>30){
      //   let months = Math.floor(days/30)
      //   return{...objects,actualtime : `${months} month${months>1?"s":""}`}
      // }
      if (hours>24) {
        // return {...objects,actualtime :`${days} day${days>1?"s" :""}`}
        return null
       
      }
      if (hours>0 ) {
        return {...objects,actualtime :`${hours} hour${hours>1?"s" :""}`}
      }
      if (minutes>0) {
        return {...objects,actualtime :`${minutes} minutes${minutes>1?"" :""}`}
      }
      return {...objects, actualtime : "just now"}
    })
          
       return filtermapping
       
    } catch (error) {
      console.log(error);
       return error
    }
  }
       const {data : statusgiver} = useQuery({
       queryKey : ["statusgiver", authid],
        
       queryFn : fetchstatusgiver , 
       
        staleTime :  10 * 60 * 1000,
    })
    



  //  async function fetchingstatus(){
  //   try {
  //      const fetchmystatus = await databases.listDocuments(
  //              conf.appwritedatabaseid, conf.appwritestatusid,)
  //              console.log(fetchmystatus);

  //              let mystatus = fetchmystatus.documents;
  //             //  console.log(mystatus, "mystatus");
  //  let filtermapping = await mystatus.map((objects)=>{
  //     let now = new Date();
  //     let created = new Date(objects.$createdAt)
  //     let difference = now - created;
  //     let seconds = Math.floor(difference/1000);
  //     let minutes = Math.floor(seconds/60);
  //     let hours = Math.floor(minutes/60);
  //     let days = Math.floor(hours/24);
  //     // if (days>30){
  //     //   let months = Math.floor(days/30)
  //     //   return{...objects,actualtime : `${months} month${months>1?"s":""}`}
  //     // }
  //     if (hours>24) {
  //       // return {...objects,actualtime :`${days} day${days>1?"s" :""}`}
  //       return null
       
  //     }
  //     if (hours>0 ) {
  //       return {...objects,actualtime :`${hours} hour${hours>1?"s" :""}`}
  //     }
  //     if (minutes>0) {
  //       return {...objects,actualtime :`${minutes} minutes${minutes>1?"" :""}`}
  //     }
  //     return {...objects, actualtime : "just now"}
  //   })
  //   console.log(filtermapping, "my status");
    
  //              return filtermapping.reverse() ;
               
  //   } catch (error) {
  //        console.log(error, "error in fetching mystatus");
  //        return error
  //   }
  //  }

  //  fetching profile 
   const {fetchprofilecredentials} = useProfile()
   
    const {data : profile} = useQuery({
       queryKey : ["profilepic", authid],
       queryFn :()=> fetchprofilecredentials(authid),
       staleTime :  10 * 60 * 1000,
    })

    //  fetching status 
    const[id,setid] = useState(null)

    //   const {data : mystatus} = useQuery({
    //    queryKey : ["mystatus", authid],
    //    queryFn : fetchingstatus , 
    //     staleTime :  10 * 60 * 1000,
    // })

    
    
    //  fetching selected status
    
    const [current, setcurrent] = useState(0)

   


    async function fetchselected(id){
       try {
            const selectedstatus =await databases.listDocuments(
               conf.appwritedatabaseid, conf.appwritestatusid,[Query.equal("authid", id)])
              //  console.log(selectedstatus, "selectedstatus");

              let for24 = selectedstatus.documents.filter((element) => {
  return new Date(element.$createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
});
console.log(for24, "for23432");

if (selectedstatus.length > 0) {
  setdisplay({display : "flex", backgroundColor : "#ff8a8c"})
}


                    let filtermapping = await for24.map((objects)=>{
      let now = new Date();
      let created = new Date(objects.$createdAt)
      let difference = now - created;
      let seconds = Math.floor(difference/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
   
     if (hours > 2) {
  return {
    ...objects,
    actualtime: new Date(objects.$createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  };
}
      if (hours>0 ) {
        return {...objects,actualtime :`${hours} hour${hours>1?"s" :""}`}
      }
      if (minutes>0) {
        return {...objects,actualtime :`${minutes} minutes${minutes>1?"" :""}`}
      }
      return {...objects, actualtime : "just now"}
    })

                console.log(filtermapping, "selectedstatus");
                
              //  return selectedstatus.documents
              return filtermapping

       } catch (error) {
         console.log(error, "error in selected status");
          return error
       }
    }
      
    let[differentid, setdifferentid] = useState("")
     const {data : selectedstatus} = useQuery({
       queryKey : ["userstatus", differentid],
       queryFn :()=> fetchselected(differentid),
       staleTime :  5 * 60 * 1000,
    })
       let withindex = selectedstatus?.[current]
    console.log(withindex, "indexed");

    useEffect(()=>{
      const  unsubscribe = client.subscribe(
    `databases.${conf.appwritedatabaseid}.collections.${conf.appwritestatusid}.documents`, async (response)=>{
      const data = response.payload ;

        if (data.authid !== differentid) return ;

            queryClient.setQueryData(
              ["userstatus", differentid],
                (oldMessages = []) => {
        const exists = oldMessages.some(
          msg => msg.$id === data.$id
        );

        if (exists) return oldMessages;
        console.log(...oldMessages, data, "finaldata");
         let now = new Date();
      let created = new Date(data.$createdAt)
      let difference = now - created;
      let seconds = Math.floor(difference/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      if (hours >2) {
          let addedtime = {...data,  actualtime: new Date(objects.$createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })} 
    return [...oldMessages,addedtime]
      }
   
       if (hours >0) {
          let addedtime = {...data, actualtime :`${hours} hour${hours>1?"s" :""}` }
          return [...oldMessages, addedtime]
       }
       if (minutes > 0) {
          let addedtime = {...data, actualtime :`${minutes} minutes${minutes>1?"" :""}`}
          return [...oldMessages, addedtime]
       }
        let addedtime = {...data, actualtime : "just now"}
        return [...oldMessages, addedtime]
      }
            )
        }
    )
           return () => unsubscribe();
    },[differentid])
   
 
     useEffect(() => {
  if (!differentid || !selectedstatus?.length) return;
   if (current === selectedstatus.length ) {
      setdisplay({display : "none"})
     
  }
  // if (current === selectedstatus.length) {
  //     setcurrent(0)
      
  // }
  const timer = setTimeout(() => {
  
  // setcurrent((prev) => (prev + 1) % selectedstatus.length);
  if (current < selectedstatus.length) {
    setcurrent((prev) => prev + 1);
  }
  
  
  }, 3000);
  
  return () => clearTimeout(timer);
  }, [current, differentid,selectedstatus]);
    
   



// useEffect(() => {
//   setcurrent(0);
// }, [differentid]);
useEffect(() => {
  if (current === selectedstatus?.length) {
    setcurrent(0)
}
}, [differentid,current]);
 


    
    
  let [display, setdisplay] = useState({display : "none"})
    let[mydisplayy, setmydisplay] = useState("message")

    
  return (
<>
{/* <Header></Header> */}

   <div className="aaf" style={display}>


{/* <div className="aaf-1">
  <div className="seected-status">
      <div className="fetchingstatus">              
                {selectedstatus?.length > 0? ( 
            <>
              


            <div className="liststatus">
                 {selectedstatus.filter(Boolean).map((status)=>(
                  <div className="status-container">
                     <div className="color" >
                      <h6>{status.content.slice(0,8)}..</h6>
                     </div>
                     <div className="both">

                    
                     <div className="time">
                      <span>{status.actualtime}</span>
                     </div>
                     <div className="seen">
                      <i className="fa-solid fa-eye"/>
                      {status.seen.length}
                     </div>
                      </div>
                  </div>
                 ))}
            </div>
            </>
                ):(<>no status yet</>)}
              </div>
  </div>  
</div>
    <div className="aaf-2">

    
 {selectedstatus?.length >0? (<>
   
     

 <div className="aan" >


     <div className="sasa">
         <div className="sasa-top">
            <div className="status-middle" style={{marginTop : "10px"}}>
            <div className="profile">
             
              <img src={selectedstatus[2].url} alt="" className='profileimage' />
               <div className="profile-user">
                 <h6>{selectedstatus[2].name}</h6>

               </div>
            </div>
          </div>
   
           
         </div>
         <div className="sasa-middle">
          <h4>{selectedstatus[2].content}</h4>
         </div>
         <div className="sasa-bottom">
          <i className="fa-solid fa-eye"/>
                       <h5>{selectedstatus[2].seen.length}</h5>
         </div>
     </div>
      </div>
 </>):(<></>)}
 </div> */}


<div className="statusview-container">
      <div className="bar-section">

      

  {selectedstatus?.length > 0 ? (
  selectedstatus.map((_, index) => (
  
    <div
      className="progress-bar"
      key={index}
      onClick={() => setcurrent(index)}
    >
      <div
        className={`progress-fill ${
          index < current
            ? "completed"
            : index === current
            ? "active"
            : ""
        }`}
      ></div>
    </div>
      
   
    
  ))
) : (
  <p>Loading...</p>
)}
    
        
      </div>
      <div className="statusview-profile">
                 {withindex ? (
                 <>
                     <div className="profile">
                
              <img src={withindex?.url} alt="" className='profileimage' />
               
               <div className="profile-user">
                 <h6>{withindex?.name}</h6>
                 {/* {withindex ?<><h6>{withindex?.name}</h6></> : <>loading..</>} */}
                 <span>{withindex?.actualtime}</span>
                 

               </div>
            </div>
                 </>
                 ) :(<></>)}
            
           
             
            <div className="icon-pause">
              {withindex ? (

              <i className="fa-solid fa-pause"></i>
              ):(<></>)}
            </div>
      </div>
      
      <div className="statusview-content">
         {/* <h4>{withindex?.content }</h4> */}
         {withindex? <><h4>{withindex?.content} </h4></>:<> <h4>loading..</h4></> }
      </div>
        <div className="sasa-bottom">
          
                       {/* <h5>{withindex?.seen.length}</h5> */}
                       {withindex?.authid !== authid ?(<></>):(<>
                       <i className="fa-solid fa-eye"/>
                         <h5>{withindex?.seen.length}</h5>
                       </>)}
         </div>
      {/* <p>{withindex?.content}</p> */}
</div>

   </div>

  <div className="dfd" style={{display : first}}>
 <div className="status-page" style={{backgroundColor : bagcolor}}>

  <div className="status-page-top">
      <i className="fa-solid fa-xmark" style={{color : "white", fontSize : "20px"}} onClick={a}/>
      <div className="status-page-top-right">
  
         <button
        className="emoji-button"
        onClick={() => setShowEmoji(!showEmoji)}
      >
        😊
      </button>

       {/* <button onClick={backgroundcolor}>click</button> */}
         <i className="fa-solid fa-palette" style={{color : "white", fontSize : "26px"}} onClick={backgroundcolor}/>
        {showEmoji && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={addEmoji} />
        </div>
      )}
  </div>
  </div>
       <div className="status-page-middle">

      <textarea
       ref={inputRef}
        className="status-input"
        placeholder="Type a status"
        value={text}
        onChange={(e) => settext(e.target.value)}
        autoFocus
        rows={2}/>
</div>
       
  <div className="status-page-bottom">
                  <button style={{backgroundColor :"white", fontSize : "13.5px", color : "black"}} onClick={addingtext}>Add</button>
        
  </div>   
        </div>
       
   </div>
      <div className="gfd" style={{display : second}}>

     
   <div className="statuscontainer" >
    {/* <Header2></Header2>  */}

    <div className="headers" id='headers' >
            <div className="headerrleftt">

        {/* <i className="fa-solid fa-house" style={{fontSize: "18px"}}></i> */}
        <Link to="/"><i className="fa-solid fa-house" style={{fontSize: "20px", color : "#0b57d0"}}></i></Link>
        {/* <i className="fa-solid fa-users-line" style={{fontSize: "20px"}} ></i>  */}
        <i className="fa-solid fa-comment" onClick={()=>setmydisplay("message")}></i>
        <i className="fa-solid fa-circle-dot" onClick={()=>setmydisplay("status")}></i>
          {/* <div className="with-notification" style={{display : "flex", position : "relative"}}>
         <Link to="/notifications"> <i className="fa-solid fa-bell" style={{fontSize: "20px", color : "#0b57d0"}}></i></Link>
        
          </div> */}

        <i className="fa-solid fa-book-open-reader" style={{fontSize: "20px"}}></i>
        </div>
      
        <div className="headerright">
            {/* <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}}>{firstletter}</h6>
            {user?<><h6 style={{color : "black",fontWeight : "400"}}>{user.slice(0,7)}..</h6></> : <>loading..</>} */}
            {/* <h6 style={{color : "black",fontWeight : "400"}}>{user}</h6> */}
           
        </div>  
        </div> 
      <div className="status">

       {mydisplayy === "status"?(
          <div className="status-section">
          <div className="status-top">
             <h5>Status</h5>
             <i className="fa-solid fa-plus"/>
          </div>
          <div className="status-middle">
            <div className="profile">
              {profile?<><img src={profile?.picurl} alt="" className='profileimage' /></>:<></>}
            </div>
            <div className="profile-content" onClick={()=>setdifferentid(authid)}>
            {/* <div className="profile-content" onClick={()=>{setdifferentid(authid),setdisplay({display : "flex", backgroundColor : "#ff8a8c"})}}> */}
            <h5>My Status</h5>
            <h6 style={{fontWeight : "400"}}>Click to add status update</h6>
            </div>
          </div>
          <div className="status-bottom">
            {statusgiver?.length >0 ?(
          
                  statusgiver?.filter(Boolean).map((lists)=>(
                      <div className="recent-section" onClick={()=>{setdifferentid(lists.authid), setcurrent(0), setdisplay({display : "flex", backgroundColor : "#ff8a8c"})}}>
                        <div className="profile">
                        {lists.url ?(
                          <img src={lists.url} alt="" className='profileimage' />
                        ):(
                          <p>{lists.name.slice(0,1)}</p>
                        )}
                        </div>
                        <div className="profile-content">
                        <div key={lists.$id}>{lists.name}</div>
                        <div key={lists.$id}>{lists.actualtime}</div>

                         
                        </div>
                      </div>
                  ))
                
            ) :(<></>)}
          </div>
         </div>
       ):(
         mydisplayy === "message"?(
        
          <div className="messages-section" >
          <Chat></Chat>
          </div>
       

         ) :(<> <p>loading</p></>)
       )}


         {/* <div className="status-section">
          <div className="status-top">
             <h5>Status</h5>
             <i className="fa-solid fa-plus"/>
          </div>
          <div className="status-middle">
            <div className="profile">
              {profile?<><img src={profile?.picurl} alt="" className='profileimage' /></>:<></>}
            </div>
            <div className="profile-content">
            <h5>My Status</h5>
            <h6 style={{fontWeight : "400"}}>Click to add status update</h6>
            </div>
          </div>
          <div className="status-bottom">
            {statusgiver?.length >0 ?(
          
                  statusgiver?.filter(Boolean).map((lists)=>(
                      <div className="recent-section" onClick={()=>{setdifferentid(lists.authid), setdisplay({display : "flex", backgroundColor : "#ff8a8c"})}}>
                        <div className="profile">
                        {lists.url ?(
                          <img src={lists.url} alt="" className='profileimage' />
                        ):(
                          <p>{lists.name.slice(0,1)}</p>
                        )}
                        </div>
                        <div className="profile-content">
                        <div key={lists.$id}>{lists.name}</div>
                        <div key={lists.$id}>{lists.actualtime}</div>

                         
                        </div>
                      </div>
                  ))
                
            ) :(<></>)}
          </div>
         </div> */}

           <div className="status-content-section">
              <div className="status-profile">

            <div className="status-content-top">

            </div>
            <div className="status-content-bottom">
            <div className="status-nav" style={{display : nav, cursor : "pointer"}}>
               
               <h6 onClick={()=>fileref.current.click()}>Photos & Videos</h6>
                <input type="file" name="" id="" accept='image/*' ref={fileref} style={{display : 'none'}}  />
               <h6 onClick={b}>Text</h6>
            </div>
          <p style={{ fontSize : "15.5px", textDecoration : "underline", cursor : "pointer"}} onClick={togglenav}>Add status</p>
            <p> Photos, videos and text that disappear after 24 hours.</p>
               <i className="fa-solid fa-circle-notch" style={{fontSize : "50px"}}/>
                  <h5>My status</h5>
              {/* <div className="fetchingstatus">              
                {mystatus?.length > 0? ( 
            <>
            <div className="liststatus">
                 {mystatus.filter(Boolean).map((status)=>(
                  <div className="status-container">
                     <div className="color" style={{backgroundColor : status.color}}>
                      <h6>{status.content.slice(0,4)}..</h6>
                     </div>
                     <div className="both">

                    
                     <div className="time">
                      <span>{status.actualtime}</span>
                     </div>
                     <div className="seen">
                      <i className="fa-solid fa-eye"/>
                      {status.seen.length}
                     </div>
                      </div>
                  </div>
                 ))}
            </div>
            </>
                ):(<>no status yet</>)}
              </div> */}

            </div>
           </div>
              </div>

            </div>
   </div>
    </div>


            
    </>
    
  )
}

export default Status
