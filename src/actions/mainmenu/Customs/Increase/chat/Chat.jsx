import React from 'react'
import { useState,useEffect,useRef } from "react";
import './chat.css'
import conf from '../../../../../appwrite/conf'
import {  Storage, ID } from 'appwrite'
import { Account, Databases, Query, } from 'appwrite'
import { databases } from '../../../Customs/Increase/appwritesdk'
import { useQuery } from "@tanstack/react-query"; 
import authService from '../../../../../appwrite/auth'
import InputEmoji from 'react-input-emoji'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { client } from '../../../Customs/Increase/appwritesdk'

import useProfile from '../../../Customs/Increase/userprofile';
 import ReactMarkdown from "react-markdown";
 
export default function Chat() {

  const{fetchprofilecredentials} = useProfile()


   let [authid,setauthid] = useState("")
   let [user, setuser] = useState("")
   let [fetching, setfetching] = useState([])
   let[activeTab, setActiveTab] = useState("Chats")
   let[rooms, setrooms] = useState("")
   let[reciever, setreciever] = useState("")
  let [activechat, setactivechat] = useState(true)
  let [selectedpic, setselectedpic] = useState(null)
  let [messages, setmessages] = useState([])
  let[chatmessage, setchatmessage] = useState("")
  let[recid,setrecid] = useState("")
  let[recname, setrecname] = useState("")
  let reference = useRef(null)
   const currentuser = async()=>{
   const getuser = await authService.getcurrentuser();
  //  console.log(getuser, "getted");
   
    setauthid(getuser.$id)
    setuser(getuser.name)
   // return getuser;
   }
  useEffect(()=>{
    currentuser()
  },[])

   
async function fetchingchat() { 

  //  console.log("hello bitu");
   
   
   const fetchingchats = await databases.listDocuments(conf.appwritedatabaseid, conf.appwritechatid,[Query.limit(1000)]
           )

const fetchingprofile =  await databases.listDocuments(conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.limit(1000)]
          )
         let mychats = fetchingchats.documents.filter((element)=>
           (element.sender === authid || element.reciever === authid)
         )
        //  console.log(mychats);  
         
const uniqueRooms = mychats.filter(
(doc, index, self) =>
index === self.findLastIndex((d) => d.roomid === doc.roomid)
);        
 console.log(uniqueRooms, "hhhh");

const finalfetching = uniqueRooms.map((element)=>{
let checking = element.sender === authid ? element.reciever : element.sender
const profile = fetchingprofile.documents.find((element1)=>element1.authid === checking)
return {...element, img : profile?.picurl}
})

console.log(finalfetching, "final");
setfetching(finalfetching.reverse())  

}
    useEffect(()=>{
      if (authid) {
        
        fetchingchat()
      }
    },[authid])


  async function fetchingchats(element){
     const listingchats =  await databases.listDocuments( conf.appwritedatabaseid, conf.appwritechatid,[Query.equal("roomid", element.roomid), Query.limit(1000)
                 ])
                //  console.log(img);
                console.log(listingchats);
                setmessages(listingchats.documents)
          setrooms(element.roomid)
          setselectedpic(element.img)
          setrecid(element.sender === authid ? element.reciever : element.sender)
          setrecname(element.sender === authid ? element.recievername : element.sendername)
          const filtername = element.sender === authid ?  element.reciever : element.sender;
          console.log(filtername, "filtername");
          
          // setreciever(listingschats.documents[0].reciever)
          //        console.log(listingchats, "listings");
                 
    }
  async function createmessage() {
 
     try {
  const createmessages = await databases.createDocument(
      conf.appwritedatabaseid, conf.appwritechatid, ID.unique(), {   
      "sender" : authid,
      "sendername" :user,
      "reciever" : recid,
     "recievername": recname, 
      "roomid" : rooms, 
      "message" : chatmessage,
     "time": Date.now()
    }
    )
    console.log(createmessages, "dddddd");
       setchatmessage("")
     } catch (error) {
        console.log(error);
     }
}



useEffect(() => {
  if (!authid) return;

  const unsubscribe = client.subscribe(
    `databases.${conf.appwritedatabaseid}.collections.${conf.appwritechatid}.documents`,
    (response) => {

      const data = response.payload;

      // If message belongs to me
      if (
        data.sender === authid ||
        data.reciever === authid
      ) {
        fetchingchat();

        // If current room open → append instantly
        if (data.roomid === rooms) {
          setmessages(prev => {
            const exists = prev.some(
              msg => msg.$id === data.$id
            );

            if (exists) return prev;

            return [...prev, data];
          });
        }
      }
    }
  );

  return () => unsubscribe();

}, [authid, rooms]);

 const {data :profilecredentials} = useQuery({
        
            queryKey:["credentials",authid],
            queryFn :()=>fetchprofilecredentials(authid),
            staleTime :  5 * 60 * 1000,
         }) 
          let dp = profilecredentials?.picurl || null


let[clickstyle, setclickstyle] = useState({
   borderRadius : "100px", color : "black", display : "block",  opacity: "1",
  transform: "scale(1)",
  transition: "all 0.3s ease",fontSize: "18px"

})

 let tabs = [
   { content : "Chats",
    id : "Chats",
  },
  {content : "Ask",
    id : "Ask"
  }
]


let[apiresponse, setapiresponse] = useState("")
let[aimessage,setaimessage] = useState("")
let[ailoading, setailoading] = useState("")
  async function askai(ask) {
    setailoading("responding..")
    try {
       let apikey = conf.geminiapi
       if (!apikey) {
        throw new Error("API key is not defined. Check your .env file.");
    }    
        const genAI = new GoogleGenerativeAI(apikey);
        const model = genAI.getGenerativeModel({ model:  "gemini-2.5-flash" });

        const result = await model.generateContent(ask);
        if (result) {
          setapiresponse((result.response.text()))
            setailoading("")
        }
        // console.log((result.response.text()));

    } catch (error) {
        console.error("Error:", error);
    }
}
 
  return (
    <div>
      <div className="tabs-container">

        {activechat === true? (<div className="tabchat1">
        <div className="dash3-2-top">

                  <h5>Chat</h5>
                    <div className="dash3-2-top-right">
                      {user? <p style={{fontSize : "15px", marginBottom : "0rem"}}> {user.slice(0,6)}...</p> : <p></p>}
                     <div className="profileimage">
                      {/* <img src={dp} alt="" /> */}
                      {dp ? <> <img src={dp} alt="" /></> : <><p>{user.slice(0,1)}</p></>}
                     </div>
                     {/* <span>Ask</span> */}
                     {/* <img src={} alt="" /> */}
                             <i className="fa-solid fa-ellipsis-vertical" style={{color : "black"}}></i>

                    </div>
                 </div>
         <div className="dash3-2-middle">
                             <input type="text" name="" id="" style={{height: "35px, width: 100%"}} className='dashboard-input' placeholder="Ask your favorite query"/>
 
                 </div>

         <div className="dash3-2-bottom">
                        {/* <Chat></Chat> */}
        
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
          key={tab.id}
          className={`tab-btn ${
            activeTab === tab.id ? "active" : ""
          }`}
          onClick={() => setActiveTab(tab.id)}
          >
            {tab.content}
          </button>
        ))}
        </div>

      <div className="tabs-content">
        {/* {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id}>
            
            <p>{tab.content}</p>
            </div>
            )
            ))} */}
        {activeTab === "Chats"?
        (
          fetching.map((element)=>(
           <div className="chatcontainer" style={{cursor : "pointer"}} key={element.roomid}onClick={()=>{fetchingchats(element);
             setactivechat(false)
           }
           }>
            <div className="chatimage">
              {/* <img src={element.img} alt="" /> */}
              {element.img ? <img src={element.img} alt="" /> : <p>{element.sender=== authid?element.recievername.slice(0,1):element.sendername.slice(0,1)}</p>}
            </div>
            <div className="chatcontent">
              <div className="chatcontentleft">

              <h6 style={{fontSize : "17px", color : "black"}}>{element.sender=== authid?element.recievername:element.sendername}</h6>
              {/* <span style={{fontSize : "14px"}}>{element.message.length >20 ?element.message.slice(0,25)}</span> */}
                {element.message.length > 28 ?<span style={{fontSize : "13.5px"}}>{element.message.slice(0,28)}...</span> :<span style={{fontSize : "13.5px"}}>{element.message}</span>
 }
              </div>
              <div className="chatcontentright">

              <h6 style={{fontSize : "12px", color : "black", textAlign: "right"}}>{new Date(element.time).toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})}</h6>
              </div>
            </div>
               
            </div>
          ))
        ):(<>
        
        {/* <p style={{fontSize : "17px"}}>Ask ai</p> */}
        <div className="ai-section">
<div className="ai-content">
   {apiresponse ? <> <ReactMarkdown style={{fontSize : '16px'}}>{apiresponse}</ReactMarkdown></> : <><p style={{fontSize: "16px"}}>{ailoading}</p></>}
    
</div>
         <div className="chat-input">
         <InputEmoji
          value={aimessage}
          onChange={setaimessage}
          cleanOnEnter
          onEnter={askai}
          //  style={inputstyle}
          placeholder="Chat with our intelligence....."
        />

        {aimessage.length >=1 ?(<i class="fa-solid fa-angle-right" style={clickstyle} onClick={()=>askai(aimessage)}></i>):(<></>)}

      </div>
        </div>
          </>)}
         {/* <p>f</p> */}
        
       
      
      </div>
          </div>         
    </div>):(
      <div className="tabchat2" style={{overflow : "hidden"}}>
         <div className="chat-header">
          <div className="backarrow">
      <i className="fa-solid fa-arrow-left" style={{color : "black"}} onClick={()=>{
        setactivechat(true);
         setmessages([]);
         setselectedpic(null);
         setrecname("")
      }}>

      </i>
          </div>
        <div className="avatar">
           {fetchingchats ?<img  src={selectedpic} alt=""   className="profile-left-top-img" style={{border: "none"}} /> :<></>}
        </div>
         <div className="chatheader-display" style={{display : "flex", justifyContent : "space-between", width : '90%'}}>
        {/* <span>{creatorid}</span> */}
        <span style={{color : "#0b57d0", fontWeight : "500"}}>{recname}</span>
        <div className="chatheader-icons">
        <i className="fa-solid fa-user"  style={{color  :"black"}}></i>
        <i className="fa-solid fa-ellipsis-vertical" style={{color : "black"}}></i>
        </div>

         </div>
      </div>
      <div className="chat-body" ref={reference}>
  {messages.map((msg) => (
    <div
  key={msg.$id}
      className={`message ${msg.sender === authid ? "sent" : "received"}`}
    >
      <span style={{fontSize : "16px"}}> {msg.message}</span>
      <span style={{ fontSize : "13px"}} >{new Date(msg.time).toLocaleTimeString()}</span>  
      
    </div>
  ))}

 
</div>
  <div className="chat-input">

        {/* <input value={chatmessage} style={inputstyle}
          onChange={(e)=> setchatmessage(e.target.value)}
          placeholder="Type a message..."
        /> */}
         <InputEmoji
          value={chatmessage}
          onChange={setchatmessage}
          cleanOnEnter
          onEnter={createmessage}
          //  style={inputstyle}
          placeholder="Type a message....."
        />

        {chatmessage.length >=1 ?(<i class="fa-solid fa-angle-right" style={clickstyle} onClick={createmessage}></i>):(<></>)}

      </div>
    </div>

  )}

          </div>
    </div>
  )
}

