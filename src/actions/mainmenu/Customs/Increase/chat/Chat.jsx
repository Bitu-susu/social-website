import React from 'react'
import { useState,useEffect,useRef } from "react";
import './chat.css'
import conf from '../../../../../appwrite/conf'
import {  Storage, ID } from 'appwrite'
import { Account, Databases, Query, } from 'appwrite'
import { databases } from '../../../Customs/Increase/appwritesdk'
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query"; 
import authService from '../../../../../appwrite/auth'
import InputEmoji from 'react-input-emoji'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { client } from '../../../Customs/Increase/appwritesdk'

import useProfile from '../../../Customs/Increase/userprofile';
 import ReactMarkdown from "react-markdown";
//  import { Query } from '@tanstack/react-query';
 
export default function Chat() {

  const{fetchprofilecredentials} = useProfile()
  const queryClient =  useQueryClient();

   const currentuser = async()=>{
   const getuser = await authService.getcurrentuser();

   return getuser;
   }
        const {data :currentusers} = useQuery({
            queryKey:["currentuser"],
            queryFn : currentuser,
            staleTime :  5 * 60 * 1000,
         })
         
         let user = currentusers?.name;
           let authid = currentusers?.$id;
 


  //  let [authid,setauthid] = useState("")
  //  let [user, setuser] = useState("")
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
  

  //  sending roomid for lastseen

  let [lastseenid, setlastseenid] = useState("")

  let [messagearray, setmessagearray] = useState([])

  //  adding lastseen to the data base 
  async function addinglastseen(roomid){
      try {

        let fetchingroomid = await databases.listDocuments(
          conf.appwritedatabaseid, conf.appwritechatlastseenid,[Query.equal("roomid",roomid)]
        )
        // console.log(fetchingroomid, 'jnjsnd');

        
        if (fetchingroomid.documents.length === 0) {
          
          let addinglastseen = await databases.createDocument(
           conf.appwritedatabaseid, conf.appwritechatlastseenid,ID.unique(),{
            "roomid" : roomid,
            "myauthid": authid,
            "lastseen": new Date().toISOString()
          })
          console.log(addinglastseen, "lastseen");                  
        }
       else if (fetchingroomid.documents.length !== 0 && !fetchingroomid.documents.some((elements)=>elements.myauthid === authid)){
           let addinglastseen = await databases.createDocument(
           conf.appwritedatabaseid, conf.appwritechatlastseenid,ID.unique(),{
            "roomid" : roomid,
            "myauthid": authid,
            "lastseen": new Date().toISOString()
          })
          // console.log(addinglastseen, "lastseennnnn");
        }
        
         else{
          // console.log(roomid.$id, "myidd");
          let myid = fetchingroomid.documents.filter((element)=>{return element.myauthid === authid})
          
          console.log(myid, "itsmy id");
          
           let updatelastseen = await databases.updateDocument(
            conf.appwritedatabaseid, conf.appwritechatlastseenid,myid[0].$id,{
            "roomid" : roomid,
           "myauthid": authid,
            "lastseen": new Date().toISOString()
            }
           )
          //  console.log(updatelastseen, 'update lastseen');
           
        }

      } catch (error) {
        console.log(error, "error in adding last seen for chats");
        
      }
   }

   
async function fetchingchat() { 

      try {
const fetchingchats = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritechatid,[Query.limit(1000)]
           )

// const senderChats = await databases.listDocuments(
//   conf.appwritedatabaseid,
//   conf.appwritechatid,
//   [
//     Query.equal("sender", authid),
//     Query.limit(1000)
//   ]
// );

// const receiverChats = await databases.listDocuments(
//   conf.appwritedatabaseid,
//   conf.appwritechatid,
//   [
//     Query.equal("reciever", authid),
//     Query.limit(1000)
//   ]
// );

const fetchingprofile =  await databases.listDocuments(conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.limit(1000)]
         )
         let mychats = fetchingchats.documents.filter((element)=>
           (element.sender === authid || element.reciever === authid)
         )

        // let mychats = [...senderChats.documents, ...receiverChats.documents]
        //  console.log(mychats, "mychats");
        //  console.log(authid, "myauth");
          
          
         //  console.log(mychats);  
         
         let lastseen = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritechatlastseenid,[Query.equal("myauthid", authid)])
        //  console.log(lastseen, "lastseen");
         
      
const uniqueRooms = mychats.filter(
(doc, index, self) =>
index === self.findLastIndex((d) => d.roomid === doc.roomid)
);        
 console.log(uniqueRooms, "hhhh");

  
 let allloopings = uniqueRooms.map((msgroom) => {

  let seenid = lastseen.documents.find(
    (seen) => seen.roomid === msgroom.roomid
  );
  // console.log(seenid, "seeeee");
  
  let myrecieving = mychats.filter((elements)=>
          elements.roomid === msgroom.roomid
         )
        //  console.log(myrecieving, "recieved");

  let messages = myrecieving.filter(
    (msg) => msg.roomid === msgroom.roomid && msg.reciever === authid

  );
  // console.log(messages, "mia");
  

  if (!seenid) {
     return {
    roomid: msgroom.roomid,
    id: myrecieving.length
  };
  }
  let messagefilter = messages.filter(
    (msg) => new Date(msg.$createdAt) > new Date(seenid.lastseen) 
  );
    return {
      roomid: msgroom.roomid,
      id: messagefilter.length
    };

  // No lastseen record for this room

});

// console.log(allloopings);



const finalfetching = uniqueRooms.map((element)=>{
let   checking = element.sender === authid ? element.reciever : element.sender
const profile = fetchingprofile.documents.find((element1)=>element1.authid === checking)
// const addinglastseen = allfilter?.find((element2)=>element2.roomid == element.roomid)

let addlastseen = allloopings?.find((match)=> match.roomid === element.roomid)

     let now = new Date();
      let created = new Date(element.$createdAt)
      let difference = now - created;
      let seconds = Math.floor(difference/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      if (days>0){
        return {...element, img : profile?.picurl, unreadmessages : addlastseen?.id,actualtime :new Date(element.$createdAt).toLocaleDateString("en-GB")}
      }
      if (hours>0) {
        return {...element, img : profile?.picurl, unreadmessages : addlastseen?.id,actualtime :new Date(element.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
      })}
      }
      if (minutes>0) {
        return {...element, img : profile?.picurl, unreadmessages : addlastseen?.id,actualtime :`${minutes} min${minutes>1?"" :""}`}
      }

return {...element, img : profile?.picurl, unreadmessages : addlastseen?.id,actualtime : "just now"}
})

console.log(finalfetching, "final");
// setfetching(finalfetching.reverse())  
return finalfetching.reverse()
  } catch (error) {
         console.log( error, "error in fetching chats");
         return error
      }
}

 const {data :outerchats,isLoading :outerchatsloading, error :outerchatserror} = useQuery({
            queryKey:["mychats",authid],
            queryFn : fetchingchat,
            // staleTime :  5 * 60 * 1000,
             enabled: !!authid,
         })

        //  const updatelastseen = useMutation({
        //    mutationFn :()=> addinglastseen(lastseenid),
        //    onSuccess : ()=>{
        //       queryClient.invalidateQueries({ queryKey: ["mychats", authid]});
        //       // setmessages("")
        //    }
        //  })

const backbutton = () => {
  queryClient.invalidateQueries({
    queryKey: ["mychats", authid],
  });
};


    // useEffect(()=>{
    //   if (authid) {
        
    //     fetchingchat()
    //   }
    // },[authid,lastseenid])
    // useEffect(()=>{
    //   if (lastseenid) {
        
    //     fetchingchat()
    //   }
    // },[addinglastseen])
              
       let [selectedroom, setselectedroom] = useState(null)

  async function fetchingchats(element){
     const listingchats =  await databases.listDocuments( conf.appwritedatabaseid, conf.appwritechatid,[Query.equal("roomid", element.roomid), Query.limit(100)
                 ])
                 console.log(element, "elelelele");
                // console.log(listingchats, "llllll");
                setrooms(element.roomid)
                //       setmessages(listingchats.documents)
                setselectedpic(element.img)
                setrecid(element.sender === authid ? element.reciever : element.sender)
                setrecname(element.sender === authid ? element.recievername : element.sendername)
                return listingchats.documents
          // const filtername = element.sender === authid ?  element.reciever : element.sender;
          // console.log(filtername, "filtername");
          
          // setreciever(listingschats.documents[0].reciever)
          //        console.log(listingchats, "listings");
                 
    }

    
    async function createmessage() {
     try {
  const createmessages = await databases.createDocument(
      conf.appwritedatabaseid, conf.appwritechatid, ID.unique(),{   
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
       return createmessages;
     } catch (error) {
        console.log(error);
     }
    }
    const {data :innerchats} = useQuery({
       queryKey:["myinnerchats", selectedroom?.roomid],
       queryFn : ()=>fetchingchats(selectedroom),
      //  staleTime :  5 * 60 * 1000,
       enabled: !!selectedroom?.roomid
          })

     const innermutation = useMutation({
           mutationFn :()=> createmessage(),
  //          onSuccess : ()=>{
  //                 queryClient.invalidateQueries({
  //   queryKey: ["mychats", authid]
  // });
  //          }
         })
  //    const outermutation = useMutation({
  //          mutationFn :()=> createmessage(),
  //          onSuccess : ()=>{
  //                 queryClient.invalidateQueries({
  //   queryKey: ["mychats", authid]
  // });
  //          }
  //        })



useEffect(() => {
  if (!authid) return;

  const  unsubscribe = client.subscribe(
    `databases.${conf.appwritedatabaseid}.collections.${conf.appwritechatid}.documents`,
   async (response) => {

      const data = response.payload;
      console.log(response, "response");
      console.log(data, "msgdata");
      
      let lastseen = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritechatlastseenid,[Query.equal("myauthid", authid)])

      const mymessages = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritechatid,[Query.equal("reciever",authid),Query.equal("roomid", data.roomid)])

      let myunread = [];

if (lastseen.documents.length > 0) {
  myunread = mymessages.documents.filter(
    (msg) =>
      new Date(msg.$createdAt) >
      new Date(lastseen.documents[0].lastseen)
  );
} else {       
  myunread = mymessages.documents;
}
      // If message belongs to me
      if (
        data.sender === authid ||
        data.reciever === authid
      ) {
        // fetchingchat();
        console.log("message belongs to me");

            
         if (data.roomid === selectedroom?.roomid) {
    queryClient.setQueryData(
      ["myinnerchats", selectedroom?.roomid],
      (oldMessages = []) => {
        const exists = oldMessages.some(
          msg => msg.$id === data.$id
        );

        if (exists) return oldMessages;
        console.log(...oldMessages, data, "finaldata");
        

        return [...oldMessages, data];
      }
    );
  }
  queryClient.setQueryData(
    ["mychats", authid],
     (
      outerchats = [])=>{
        const finding = outerchats.find((element)=> element.roomid === data.roomid)
        //  if new message comes with new roomid and the reciever is authid then ..
        if (!finding && data.reciever === authid) {
            let newmessage = {
                "sender" : data.sender,
      "sendername" : data.sendername,
      "reciever" : data.reciever,
     "recievername": data.recievername, 
      "roomid" : data.roomid, 
      "message" : data.message,
     "time": data.time
            }
            return [newmessage,...outerchats]
        }
        //  if new message comes with the existing roomid then ..

        let updatedchat ={
          ...finding,
            "message" : data.message,
     "time": data.time,
      "unreadmessages" : myunread.length
        }
       return [
        updatedchat,
        ...outerchats.filter(
          (element) => element.roomid !== data.roomid
        )
      ];
      }
  )
      }
      return outerchats
    }
  );

    

  return () => unsubscribe();

}, [authid, selectedroom?.roomid,queryClient]);

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
                      {dp ? <> <img src={dp} alt="" /></> : <><p>{user?.slice(0,1)}</p></>}
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
         {tabs.map((tab) => (
          activeTab === tab.id && (
            <div key={tab.id}>
            
            {/* <p>{tab.content}</p> */}
            </div>
            )
            ))} 
         {/* {activeTab === "Chats"?
        (
          outerchats?.map((element)=>(
           <div className="chatcontainer" style={{cursor : "pointer"}} key={element.roomid}onClick={()=>{setselectedroom(element);
             setactivechat(false); 
             setlastseenid(element.roomid);
          

           }
           }>
            <div className="chatimage">
            
              {element.img ? <img src={element.img} alt="" /> : <p>{element.sender=== authid?element.recievername.slice(0,1):element.sendername.slice(0,1)}</p>}
            </div>
            <div className="chatcontent">
              <div className="chatcontentleft">

              <h6 style={{fontSize : "17px", color : "black"}}>{element.sender=== authid?element.recievername:element.sendername}</h6>
              
                {element.message.length > 28 ?<span style={{fontSize : "13.5px"}}>{element.message.slice(0,28)}...</span> :<span style={{fontSize : "13.5px"}}>{element.message}</span>
 }
              </div>
              <div className="chatcontentright">

              <h6 style={{fontSize : "12px", color : "black", textAlign: "right"}}>{new Date(element.time).toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})}</h6>
           {element.unreadmessages > 0 && element.reciever === authid ?( <div className='unread'><h6 style={{fontSize :"13px", color : "white"}}>{element.unreadmessages}</h6> </div>):(<></>)}
         
              </div>
            </div>
               
            </div>
          ))   

        ):(<>
        
       
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
        
          placeholder="Chat with our intelligence....."
        />

        {aimessage.length >=1 ?(<i class="fa-solid fa-angle-right" style={clickstyle} onClick={()=>askai(aimessage)}></i>):(<></>)}

      </div>
        </div>
          </>)}  */}

          {activeTab === "Chats" ? (
  <>
    {outerchatsloading ? (
      <p>Loading chats...</p>
    ) : outerchatserror ? (
      <p>Error loading chats</p>
    ) : outerchats?.length > 0 ? (
      outerchats.map((element) => (
        <div
          className="chatcontainer"
          style={{ cursor: "pointer" }}
          key={element.roomid}
          onClick={() => {
            setselectedroom(element);
            setactivechat(false);
            // setlastseenid(element.roomid);
            addinglastseen(element.roomid)
          }}
        >
          <div className="chatimage">
            {element.img ? (
              <img src={element.img} alt="" />
            ) : (
              <p>
                {element.sender === authid
                  ? element.recievername.slice(0, 1)
                  : element.sendername.slice(0, 1)}
              </p>
            )}
          </div>

          <div className="chatcontent">
            <div className="chatcontentleft">
              <h6 style={{ fontSize: "17px", color: "black" }}>
                {element.sender === authid
                  ? element.recievername
                  : element.sendername}
              </h6>

              {element.message.length > 28 ? (
                <span style={{ fontSize: "13.5px" }}>
                  {element.message.slice(0, 28)}...
                </span>
              ) : (
                <span style={{ fontSize: "13.5px" }}>
                  {element.message}
                </span>
              )}
            </div>

            <div className="chatcontentright">
              {/* <h6
                style={{
                  fontSize: "12px",
                  color: "black",
                  textAlign: "right",
                }}
              >
                {new Date(element.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </h6> */}

              <span style={{fontSize : "14px"}}>{element.actualtime}</span>

              {element.unreadmessages > 0 &&
                element.reciever === authid && (
                  <div className="unread">
                    <h6 style={{ fontSize: "13px", color: "white" }}>
                      {element.unreadmessages}
                    </h6>
                  </div>
                )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No chats found</p>
    )}
  </>
) : (
  <>
    <div className="ai-section">
      <div className="ai-content">
        {apiresponse ? (
          <ReactMarkdown style={{ fontSize: "16px" }}>
            {apiresponse}
          </ReactMarkdown>
        ) : (
          <p style={{ fontSize: "16px" }}>{ailoading}</p>
        )}
      </div>

      <div className="chat-input">
        <InputEmoji
          value={aimessage}
          onChange={setaimessage}
          cleanOnEnter
          onEnter={askai}
          placeholder="Chat with our intelligence....."
        />

        {aimessage.length >= 1 && (
          <i
            className="fa-solid fa-angle-right"
            style={clickstyle}
            onClick={() => askai(aimessage)}
          ></i>
        )}
      </div>
    </div>
  </>
)}
        

      </div>
          </div>         
    </div>):(
      <div className="tabchat2" style={{overflow : "hidden", height : '100vh'}}>
         <div className="chat-header">
          <div className="backarrow">
      <i className="fa-solid fa-arrow-left" style={{color : "black"}} onClick={()=>{
        setactivechat(true);
        //  setmessages([]);
        //  setselectedpic(null);
        //  setrecname("")
        //  updatelastseen.mutate(lastseenid)
         backbutton()

      }}>

      </i>
          </div>
        <div className="avatar">
          { selectedpic?(
             <img  src={selectedpic} alt=""   className="profile-left-top-img" style={{border: "none"}} /> 
          ):( <><h6>loading</h6></>)
          }
        </div>
         <div className="chatheader-display" style={{display : "flex", justifyContent : "space-between", width : '90%'}}>
        {/* <span>{creatorid}</span> */}
        { recname ?(
          <span style={{color : "#0b57d0", fontWeight : "500"}}>{recname}</span>
        ):(
          <>
          <div className="ss" style={{width : "100%"}}></div>
          </>
        )}
        <div className="chatheader-icons">
        <i className="fa-solid fa-user"  style={{color  :"black"}}></i>
        <i className="fa-solid fa-ellipsis-vertical" style={{color : "black"}}></i>
        </div>

         </div>
      </div>
      <div className="chat-body" ref={reference}>
  {innerchats?.map((msg) => (
    <div
  key={msg.$id}
      className={`message ${msg.sender === authid ? "sent" : "received"}`}
    >
      <span style={{fontSize : "16px"}}> {msg.message}</span>
      <span style={{ fontSize : "13px"}} >{new Date(msg.time).toLocaleTimeString()}</span> 
       {/* <span>{msg.actualtime}</span> */}

    </div>
  ))}

 
</div>
  <div className="chat-input">

        
         <InputEmoji
          value={chatmessage}
          onChange={setchatmessage}
          cleanOnEnter
          onEnter={createmessage}
          //  style={inputstyle}
          placeholder="Type a message....."
        />

        {chatmessage.length >=1 ?(<i class="fa-solid fa-angle-right" style={clickstyle} onClick={innermutation.mutate}></i>):(<></>)}

      </div>
    </div>

  )}

          </div>
    </div>
  )
}

//  if (lastseen.documents.length > 0) {
//             allfilter = lastseen.documents.map((last)=>{
//                let chats = myrecieving.filter((msg)=>{
//                    return last.roomid === msg.roomid && (new Date(last.lastseen) < new Date(msg.$updatedAt))
//                })
//             return  {
//         roomid: last.roomid,
//         messages: chats.length
//     };
//            })
//            console.log(allfilter, "allfilter");
//            } 

//    let allloopings = lastseen.documents.map((seenid) => {

//   let messagefilter = myrecieving.filter((msgs) => {
//     return (
//       msgs.roomid === seenid.roomid &&
//       new Date(msgs.$createdAt) > new Date(seenid.$createdAt)
//     );
//   });

//   return {
//     roomid: seenid.roomid,
//     id: messagefilter.length
//   };
// });

// console.log(allloopings);


// export default function Chat() {

//   const{fetchprofilecredentials} = useProfile()

//    const currentuser = async()=>{
//    const getuser = await authService.getcurrentuser();

//    return getuser;
//    }
//         const {data :currentusers} = useQuery({
//             queryKey:["currentuser"],
//             queryFn : currentuser,
//             staleTime :  5 * 60 * 1000,
//          })
         
//          let user = currentusers?.name;
//            let authid = currentusers?.$id;
 


//   //  let [authid,setauthid] = useState("")
//   //  let [user, setuser] = useState("")
//    let [fetching, setfetching] = useState([])
//    let[activeTab, setActiveTab] = useState("Chats")
//    let[rooms, setrooms] = useState("")
//    let[reciever, setreciever] = useState("")
//   let [activechat, setactivechat] = useState(true)
//   let [selectedpic, setselectedpic] = useState(null)
//   let [messages, setmessages] = useState([])
//   let[chatmessage, setchatmessage] = useState("")
//   let[recid,setrecid] = useState("")
//   let[recname, setrecname] = useState("")
//   let reference = useRef(null)
  

//   //  sending roomid for lastseen

//   let [lastseenid, setlastseenid] = useState("")

//   //  adding lastseen to the data base 
//   async function addinglastseen(roomid){
//       try {

//         let fetchingroomid = await databases.listDocuments(
//           conf.appwritedatabaseid, conf.appwritechatlastseenid,[Query.equal("roomid",roomid)]
//         )
//         console.log(fetchingroomid, 'jnjsnd');

        
//         if (fetchingroomid.documents.length === 0) {
          
//           let addinglastseen = await databases.createDocument(
//            conf.appwritedatabaseid, conf.appwritechatlastseenid,ID.unique(),{
//             "roomid" : roomid,
//             "myauthid": authid,
//             "lastseen": new Date().toISOString()
//           })
//           console.log(addinglastseen, "lastseen");                  
//         }
//        else if (fetchingroomid.documents.length !== 0 && !fetchingroomid.documents.some((elements)=>elements.myauthid === authid)){
//            let addinglastseen = await databases.createDocument(
//            conf.appwritedatabaseid, conf.appwritechatlastseenid,ID.unique(),{
//             "roomid" : roomid,
//             "myauthid": authid,
//             "lastseen": new Date().toISOString()
//           })
//           console.log(addinglastseen, "lastseennnnn");
//         }
        
//          else{
//           // console.log(roomid.$id, "myidd");
//           let myid = fetchingroomid.documents.filter((element)=>{return element.myauthid === authid})
          
//           console.log(myid, "itsmy id");
          
//            let updatelastseen = await databases.updateDocument(
//             conf.appwritedatabaseid, conf.appwritechatlastseenid,myid[0].$id,{
//             "roomid" : roomid,
//            "myauthid": authid,
//             "lastseen": new Date().toISOString()
//             }
//            )
//            console.log(updatelastseen, 'update lastseen');
           
//         }

//       } catch (error) {
//         console.log(error, "error in adding last seen for chats");
        
//       }
//    }

   
// async function fetchingchat() { 

//       try {
// // const fetchingchats = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritechatid,[Query.limit(1000)]
// //            )

// const senderChats = await databases.listDocuments(
//   conf.appwritedatabaseid,
//   conf.appwritechatid,
//   [
//     Query.equal("sender", authid),
//     Query.limit(1000)
//   ]
// );

// const receiverChats = await databases.listDocuments(
//   conf.appwritedatabaseid,
//   conf.appwritechatid,
//   [
//     Query.equal("reciever", authid),
//     Query.limit(1000)
//   ]
// );

// const fetchingprofile =  await databases.listDocuments(conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.limit(1000)]
//          )
//         //  let mychats = fetchingchats.documents.filter((element)=>
//         //    (element.sender === authid || element.reciever === authid)
//         //  )

//         let mychats = [...senderChats, ...receiverChats]
//          console.log(mychats, "mychats");
//          console.log(authid, "myauth");
          
          
//          //  console.log(mychats);  
         
//          let lastseen = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritechatlastseenid,[Query.equal("myauthid", authid)])
//          console.log(lastseen, "lastseen");
         
      
// const uniqueRooms = mychats.filter(
// (doc, index, self) =>
// index === self.findLastIndex((d) => d.roomid === doc.roomid)
// );        
//  console.log(uniqueRooms, "hhhh");

  
//  let allloopings = uniqueRooms.map((msgroom) => {

//   let seenid = lastseen.documents.find(
//     (seen) => seen.roomid === msgroom.roomid
//   );
//   console.log(seenid, "seeeee");
  
//   let myrecieving = mychats.filter((elements)=>
//           elements.roomid === msgroom.roomid
//          )
//          console.log(myrecieving, "recieved");

//   let messages = myrecieving.filter(
//     (msg) => msg.roomid === msgroom.roomid && msg.reciever === authid
//   );
//   console.log(messages, "mia");
  

//   if (!seenid) {
//      return {
//     roomid: msgroom.roomid,
//     id: myrecieving.length
//   };
//   }
//   let messagefilter = messages.filter(
//     (msg) => new Date(msg.$createdAt) > new Date(seenid.lastseen) 
//   );
//     return {
//       roomid: msgroom.roomid,
//       id: messagefilter.length
//     };

//   // No lastseen record for this room

// });

// console.log(allloopings);



// const finalfetching = uniqueRooms.map((element)=>{
// let   checking = element.sender === authid ? element.reciever : element.sender
// const profile = fetchingprofile.documents.find((element1)=>element1.authid === checking)
// // const addinglastseen = allfilter?.find((element2)=>element2.roomid == element.roomid)

// let addlastseen = allloopings?.find((match)=> match.roomid === element.roomid)

// return {...element, img : profile?.picurl, unreadmessages : addlastseen?.id}
// })

// console.log(finalfetching, "final");
// // setfetching(finalfetching.reverse())  
// return finalfetching.reverse()
//   } catch (error) {
//          console.log( error, "error in fetching chats");
         
//       }
// }

//  const {data :outerchats} = useQuery({
//             queryKey:["mychats", authid],
//             queryFn : fetchingchat,
//             staleTime :  5 * 60 * 1000,
//          })

//          const updatelastseen = useMutation({
//            mutationFn : addinglastseen,
//            onsuccess : ()=>{
//               queryClient.invalidateQueries({ queryKey: ["mychats", authid]});
//            }
//          })


//     useEffect(()=>{
//       if (authid) {
        
//         fetchingchat()
//       }
//     },[authid,lastseenid])
//     useEffect(()=>{
//       if (lastseenid) {
        
//         fetchingchat()
//       }
//     },[addinglastseen])
              


//   async function fetchingchats(element){
//      const listingchats =  await databases.listDocuments( conf.appwritedatabaseid, conf.appwritechatid,[Query.equal("roomid", element.roomid), Query.limit(1000)
//                  ])
//                 //  console.log(img);
//                 console.log(listingchats);
//                 setmessages(listingchats.documents)
//           setrooms(element.roomid)
//           setselectedpic(element.img)
//           setrecid(element.sender === authid ? element.reciever : element.sender)
//           setrecname(element.sender === authid ? element.recievername : element.sendername)
//           const filtername = element.sender === authid ?  element.reciever : element.sender;
//           console.log(filtername, "filtername");
          
//           // setreciever(listingschats.documents[0].reciever)
//           //        console.log(listingchats, "listings");
                 
//     }
//   async function createmessage() {
 
//      try {
//   const createmessages = await databases.createDocument(
//       conf.appwritedatabaseid, conf.appwritechatid, ID.unique(), {   
//       "sender" : authid,
//       "sendername" :user,
//       "reciever" : recid,
//      "recievername": recname, 
//       "roomid" : rooms, 
//       "message" : chatmessage,
//      "time": Date.now()
//     }
//     )
//     console.log(createmessages, "dddddd");
//        setchatmessage("")
//      } catch (error) {
//         console.log(error);
//      }
// }



// useEffect(() => {
//   if (!authid) return;

//   const unsubscribe = client.subscribe(
//     `databases.${conf.appwritedatabaseid}.collections.${conf.appwritechatid}.documents`,
//     (response) => {

//       const data = response.payload;

//       // If message belongs to me
//       if (
//         data.sender === authid ||
//         data.reciever === authid
//       ) {
//         fetchingchat();

//         // If current room open → append instantly
//         if (data.roomid === rooms) {
//           setmessages(prev => {
//             const exists = prev.some(
//               msg => msg.$id === data.$id
//             );

//             if (exists) return prev;

//             return [...prev, data];
//           });
//         }
//       }
//     }
//   );

//   return () => unsubscribe();

// }, [authid, rooms]);

//  const {data :profilecredentials} = useQuery({
        
//             queryKey:["credentials",authid],
//             queryFn :()=>fetchprofilecredentials(authid),
//             staleTime :  5 * 60 * 1000,
//          }) 
//           let dp = profilecredentials?.picurl || null


// let[clickstyle, setclickstyle] = useState({
//    borderRadius : "100px", color : "black", display : "block",  opacity: "1",
//   transform: "scale(1)",
//   transition: "all 0.3s ease",fontSize: "18px"

// })

//  let tabs = [
//    { content : "Chats",
//     id : "Chats",
//   },
//   {content : "Ask",
//     id : "Ask"
//   }
// ]


// let[apiresponse, setapiresponse] = useState("")
// let[aimessage,setaimessage] = useState("")
// let[ailoading, setailoading] = useState("")
//   async function askai(ask) {
//     setailoading("responding..")
//     try {
//        let apikey = conf.geminiapi
//        if (!apikey) {
//         throw new Error("API key is not defined. Check your .env file.");
//     }    
//         const genAI = new GoogleGenerativeAI(apikey);
//         const model = genAI.getGenerativeModel({ model:  "gemini-2.5-flash" });

//         const result = await model.generateContent(ask);
//         if (result) {
//           setapiresponse((result.response.text()))
//             setailoading("")
//         }
//         // console.log((result.response.text()));

//     } catch (error) {
//         console.error("Error:", error);
//     }
// }
 
//   return (
//     <div>
//       <div className="tabs-container">

//         {activechat === true? (<div className="tabchat1">
//         <div className="dash3-2-top">

//                   <h5>Chat</h5>
//                     <div className="dash3-2-top-right">
//                       {user? <p style={{fontSize : "15px", marginBottom : "0rem"}}> {user.slice(0,6)}...</p> : <p></p>}
//                      <div className="profileimage">
//                       {/* <img src={dp} alt="" /> */}
//                       {dp ? <> <img src={dp} alt="" /></> : <><p>{user.slice(0,1)}</p></>}
//                      </div>
//                      {/* <span>Ask</span> */}
//                      {/* <img src={} alt="" /> */}
//                              <i className="fa-solid fa-ellipsis-vertical" style={{color : "black"}}></i>

//                     </div>
//                  </div>
//          <div className="dash3-2-middle">
//                              <input type="text" name="" id="" style={{height: "35px, width: 100%"}} className='dashboard-input' placeholder="Ask your favorite query"/>
 
//                  </div>

//          <div className="dash3-2-bottom">
//                         {/* <Chat></Chat> */}
        
//       <div className="tabs-header">
//         {tabs.map((tab) => (
//           <button
//           key={tab.id}
//           className={`tab-btn ${
//             activeTab === tab.id ? "active" : ""
//           }`}
//           onClick={() => setActiveTab(tab.id)}
//           >
//             {tab.content}
//           </button>
//         ))}
//         </div>

//       <div className="tabs-content">
//         {/* {tabs.map((tab) => (
//           activeTab === tab.id && (
//             <div key={tab.id}>
            
//             <p>{tab.content}</p>
//             </div>
//             )
//             ))} */}
//         {activeTab === "Chats"?
//         (
//           outerchats.map((element)=>(
//            <div className="chatcontainer" style={{cursor : "pointer"}} key={element.roomid}onClick={()=>{fetchingchats(element);
//              setactivechat(false); 
//              setlastseenid(element.roomid);
//            }
//            }>
//             <div className="chatimage">
//               {/* <img src={element.img} alt="" /> */}
//               {element.img ? <img src={element.img} alt="" /> : <p>{element.sender=== authid?element.recievername.slice(0,1):element.sendername.slice(0,1)}</p>}
//             </div>
//             <div className="chatcontent">
//               <div className="chatcontentleft">

//               <h6 style={{fontSize : "17px", color : "black"}}>{element.sender=== authid?element.recievername:element.sendername}</h6>
//               {/* <span style={{fontSize : "14px"}}>{element.message.length >20 ?element.message.slice(0,25)}</span> */}
//                 {element.message.length > 28 ?<span style={{fontSize : "13.5px"}}>{element.message.slice(0,28)}...</span> :<span style={{fontSize : "13.5px"}}>{element.message}</span>
//  }
//               </div>
//               <div className="chatcontentright">

//               <h6 style={{fontSize : "12px", color : "black", textAlign: "right"}}>{new Date(element.time).toLocaleTimeString([], {
//   hour: "2-digit",
//   minute: "2-digit",
//   hour12: false,
// })}</h6>
//            {element.unreadmessages > 0 && element.reciever === authid ?( <div className='unread'><h6 style={{fontSize :"13px", color : "white"}}>{element.unreadmessages}</h6> </div>):(<></>)}
         
//               </div>
//             </div>
               
//             </div>
//           ))
//         ):(<>
        
//         {/* <p style={{fontSize : "17px"}}>Ask ai</p> */}
//         <div className="ai-section">
// <div className="ai-content">
//    {apiresponse ? <> <ReactMarkdown style={{fontSize : '16px'}}>{apiresponse}</ReactMarkdown></> : <><p style={{fontSize: "16px"}}>{ailoading}</p></>}
    
// </div>
//          <div className="chat-input">
//          <InputEmoji
//           value={aimessage}
//           onChange={setaimessage}
//           cleanOnEnter
//           onEnter={askai}
//           //  style={inputstyle}
//           placeholder="Chat with our intelligence....."
//         />

//         {aimessage.length >=1 ?(<i class="fa-solid fa-angle-right" style={clickstyle} onClick={()=>askai(aimessage)}></i>):(<></>)}

//       </div>
//         </div>
//           </>)}
//          {/* <p>f</p> */}
        
       
      
//       </div>
//           </div>         
//     </div>):(
//       <div className="tabchat2" style={{overflow : "hidden"}}>
//          <div className="chat-header">
//           <div className="backarrow">
//       <i className="fa-solid fa-arrow-left" style={{color : "black"}} onClick={()=>{
//         setactivechat(true);
//          setmessages([]);
//          setselectedpic(null);
//          setrecname("")
//          addinglastseen(lastseenid)

//       }}>

//       </i>
//           </div>
//         <div className="avatar">
//            {fetchingchats ?<img  src={selectedpic} alt=""   className="profile-left-top-img" style={{border: "none"}} /> :<></>}
//         </div>
//          <div className="chatheader-display" style={{display : "flex", justifyContent : "space-between", width : '90%'}}>
//         {/* <span>{creatorid}</span> */}
//         <span style={{color : "#0b57d0", fontWeight : "500"}}>{recname}</span>
//         <div className="chatheader-icons">
//         <i className="fa-solid fa-user"  style={{color  :"black"}}></i>
//         <i className="fa-solid fa-ellipsis-vertical" style={{color : "black"}}></i>
//         </div>

//          </div>
//       </div>
//       <div className="chat-body" ref={reference}>
//   {messages.map((msg) => (
//     <div
//   key={msg.$id}
//       className={`message ${msg.sender === authid ? "sent" : "received"}`}
//     >
//       <span style={{fontSize : "16px"}}> {msg.message}</span>
//       <span style={{ fontSize : "13px"}} >{new Date(msg.time).toLocaleTimeString()}</span>  
      
//     </div>
//   ))}

 
// </div>
//   <div className="chat-input">

//         {/* <input value={chatmessage} style={inputstyle}
//           onChange={(e)=> setchatmessage(e.target.value)}
//           placeholder="Type a message..."
//         /> */}
//          <InputEmoji
//           value={chatmessage}
//           onChange={setchatmessage}
//           cleanOnEnter
//           onEnter={createmessage}
//           //  style={inputstyle}
//           placeholder="Type a message....."
//         />

//         {chatmessage.length >=1 ?(<i class="fa-solid fa-angle-right" style={clickstyle} onClick={createmessage}></i>):(<></>)}

//       </div>
//     </div>

//   )}

//           </div>
//     </div>
//   )
// }