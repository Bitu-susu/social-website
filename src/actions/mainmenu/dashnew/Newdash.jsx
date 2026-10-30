import React, { useState,useEffect ,useRef, useMemo} from 'react'
import './Newdash.css'
import { useDispatch } from 'react-redux'
// import { useState } from 'react';
import authService from '../../../appwrite/auth'
import { Client,Storage,ID } from 'appwrite'
import { client } from '../../mainmenu/Customs/Increase/appwritesdk'

import conf from '../../../appwrite/conf'
import { isRouteErrorResponse, Link, useNavigate } from 'react-router-dom'    
import JoditEditor from 'jodit-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import database from '../../../appwrite/database'
import {Account,Databases,Query } from 'appwrite'
import {sendletter} from '../../../redux/createslice'
import { sendusername } from '../../../redux/createslice'
import {sendcreatorname} from '../../../redux/createslice'
//  importing images for the dashboard -1 section 
import stock from '../../../images/stockmarket.jpg'
import business from '../../../images/businessplan.jpg' 
import ev from '../../../images/ev.jpg'                  
import ai from '../../../images/ai.jpg'
import technology from '../../../images/technology.webp'
import politics from '../../../images/politics.jpg'
import culture from '../../../images/culture.jpg'
import {sendloginname} from '../../../redux/createslice'
import { sendquestion } from '../../../redux/createslice' 
import { useSelector } from 'react-redux'
import { QueryClient, useQuery } from "@tanstack/react-query";  
// import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from "@tanstack/react-query";


//  importing custom hoooks 
import {likesincrease,likesdecrease} from '../Customs/Increase/increaselikes'
import usePosts from '../Customs/Increase/posts' 
import useComments from '../Customs/Increase/comments'
import useQuestions from '../Customs/Increase/questions'
import { useOnlineoffline } from '../../../Assamble/Assamble'

import Header from '../Customs/Increase/header/Header'


import Chat from '../Customs/Increase/chat/Chat'

  const fetchingquestions = async()=>{
        const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);        
              const databases = new Databases(client); 
     const fetchquestions = await databases.listDocuments(
     conf.appwritedatabaseid,conf.appwritequestionid,[Query.limit(100)]     
                    )
                    return fetchquestions.documents
                    // console.log(fetchquestions);                
 

     //   fetching current user
       
    }
     const currentuser = async()=>{
       const getuser = await authService.getcurrentuser();
       return getuser;
     }
                  
function Newdash() {

   const {online} = useOnlineoffline()
  
  
  const queryClient = useQueryClient();
  const navigate = useNavigate()
     const dispatch = useDispatch();

          //  post section open   //  adding post section input

          const [title, settitle] = useState("")
          const [category, setcategory] = useState("");
          const [content, setcontent] = useState("");
          const [fileurl, setfileurl] = useState("")
          const editor = useRef(null); 
          const[newcontent, setnewcontent] = useState("")
          
          const[lowopacity, setlowopacity] = useState({})
          const[postdisplay, setpostdisplay] = useState({})
                 function opacitychanger() {
                      setlowopacity({opacity : "0.1"})
                      setpostdisplay({display : "block"})
                 }

                 function postboxclose() {
                    setlowopacity({opacity : "1.0"})
                    setpostdisplay({display : "none"})
                }

           let[newpost, setnewpost] = useState(false)
        //  let[submit, setsubmit] = useState("")
          // let[submitshown, setsubmitshown] = useState({display : "none"}) 
     
          
        const {submitpost, submit, submitshown} = usePosts()
        const postMutation = useMutation({
  mutationFn: submitpost,
        
  onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({ queryKey: ["documents"]});
  },
}); 

   

        // current user

      const {data :currentusers} = useQuery({
         queryKey:["currentuser"],
         queryFn : currentuser,
         staleTime :  5 * 60 * 1000,
      })  
          //   declaring variables for the current user 
           let user = currentusers?.name;
           let authid = currentusers?.$id;
           let firstletter = currentusers?.name.charAt(0).toUpperCase()  
   
      //  here we are fetching the posts according to the selected categoy , with objects we can manage all in one place.
     
    class Collects {
       client = new Client()
    account;
    databases
    constructor()
    {
        this.client .setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

       async selectcategory(category){

        try {  
            const listcategory = await this.databases.listDocuments( conf.appwritedatabaseid, conf.appwritepostcollectionid,[Query.equal("postcategory", category)]);
            let addingtime = await listcategory.documents.map((objects)=>{
               let now = new Date();
      let created = new Date(objects.$createdAt)
      let difference = now - created;
      let seconds = Math.floor(difference/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      if (days>30){
        let months = Math.floor(days/30)
        return{...objects,actualtime : `${months} month${months>1?"s":""}`}
      }
      if (days>1) {
        return {...objects,actualtime :`${days} day${days>1?"s" :""}`}
      }
      if (hours>0) {
        return {...objects,actualtime :`${hours} hour${hours>1?"s" :""}`}
      }
      if (minutes>0) {
        return {...objects,actualtime :`${minutes} minutes${minutes>1?"" :""}`}
      }
      return {...objects, actualtime : "just now"}
    })
    console.log(addingtime, "added time");
    
            return addingtime.reverse();
              } catch (error) {
                return error
              }                
            }
            async fetchall(){
              try {
                   const listevery = await database.listdocuments() 
   let addingtime = await listevery.documents.map((objects)=>{
               let now = new Date();
      let created = new Date(objects.$createdAt)
      let difference = now - created;
      let seconds = Math.floor(difference/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      if (days>30){
        let months = Math.floor(days/30)
        return{...objects,actualtime : `${months} month${months>1?"s":""}`}
      }
      if (days>1) {
        return {...objects,actualtime :`${days} day${days>1?"s" :""}`}
      }
      if (hours>0) {
        return {...objects,actualtime :`${hours} hour${hours>1?"s" :""}`}
      }
      if (minutes>0) {
        return {...objects,actualtime :`${minutes} minutes${minutes>1?"" :""}`}
      }
      return {...objects, actualtime : "just now"}
    })
    console.log(addingtime, "added time");
    
            return addingtime.reverse();

         
              } catch (error) {
                  return error
              }
            }
          }
          let latestcollects = new Collects()   
          
         
          let [contextvalue, setcontextvalue] = useState("")
        const {data : postdocuments, isLoading :postdocumentsloading, error :postdocumentserror} = useQuery({
          queryKey: ["documents",contextvalue || "ALL"],
           queryFn : async()=> {
             if (!contextvalue || contextvalue === ""){
               return latestcollects.fetchall() 
              }
              return latestcollects.selectcategory(contextvalue)
        },
           staleTime: 5 * 60 * 1000, 
            
        })

         

          
                                                                                                 //  for likes section
              const[likecolor, setlikecolor] = useState()                                                                         
           
          const [increaselike, setincreaselike] = useState([])

         

     //  linking the mutation with the post function and the likes increase function 

    const likeMutation = useMutation({
  mutationFn: likesincrease,
  
  onSuccess: () => {
    // console.log(successclosing, "saaaaaaa"),
    //  🔥 THIS triggers posts API again
    // queryClient.invalidateQueries({ queryKey: ["documents"]});
  }
}); 


    useEffect(()=>{
       if (!authid)  return
       
       let unsubscribe = client.subscribe(
    `databases.${conf.appwritedatabaseid}.collections.${conf.appwritelikesid}.documents`,
    (response) => {
    const data = response.payload;

    const event = response.events
    console.log(data, "dddddddddddasa");
     console.log(event, 'event');
     


     if (event.some(data => data.endsWith("create"))) {
        queryClient.setQueryData(
      ["documents", contextvalue || "ALL"],
      (
oldposts = [])=>{
  let updateone = oldposts.map((post)=>{
      if (post.$id !== data.documentid) {
        return post
      }
      else{
        return {
           ...post,
              Like: [...(post.Like || []), data.authid]
        }
      }
    })
    return updateone
}   
    )
     }
     else{ 
    queryClient.setQueryData(
      ["documents", contextvalue || "ALL"],

       (
          oldposts = []) =>{
             let updatedone = oldposts.map((post)=>{
                if (post.$id !== data.documentid) {
        return post
      }
      else{
              let updateone = post.Like.filter((element)=> element !== authid)
              console.log(updateone, "ehfwbbbbbbbb");
              
               return {
                ...post,Like : updateone
               }
      }
             })
             return updatedone
          }
       
       )
      }

    })
     return () => unsubscribe();

    },[queryClient, contextvalue, authid])



          //   linking the mutation with the posts function and the likes decrease function
   
 const decreaselikeMutation = useMutation({
  mutationFn: likesdecrease, 

  onSuccess: () => {
    // 🔥 THIS triggers posts API again
    // queryClient.invalidateQueries({ queryKey: ["documents"]}); 
  },
}); 

                                                                                                //  for the post contents 
        const [nottrimcontent, setnottrimcontent] = useState("")
        const[gettingid, setgettingid] = useState("")
      async function nottrim(id) {
        const client = new Client()
        .setEndpoint(conf.appwriteurl)
        .setProject(conf.appwriteprojectid);
        const databases = new Databases(client);
        try {
          
          const nottrimcontent = await databases.listDocuments(
          conf.appwritedatabaseid,conf.appwritepostcollectionid,[Query.equal("$id", id)]
         )
           console.log(nottrimcontent);
            setnottrimcontent(nottrimcontent.documents[0].postcontent)
             setgettingid(nottrimcontent.documents[0].$id)
           
        } catch (error) {
           console.log("error in nottrim",  error);
           
        }
      }

                                                                                             //  For the comments section

const [comments, setcomments] = useState({
              display : "none"
         })
          function addcomment() {
           if (comments) {
             setcomments({
               display:"block",
               padding: "6px 11px"
              })
           }
           else if (!comments){
           setcomments({
                display : "none"
             })
           }
           }

                                                                                      //   adding comments
   const[addcomments, setaddcomments] = useState('')
   const[commentcreator, setcommentcreator]= useState("")
   const[getcomments, setgetcomments] = useState([])
 


    //  fetching with querry 
  // const [selectedPostId, setSelectedPostId] = useState("");
      const {fetchcomments} = useComments()

      const[selectcomment, setselectcomment] = useState("")

      const {data :displaycommentss} = useQuery({
         queryKey:["displaycomments",selectcomment],
          queryFn: ()=>fetchcomments({listingsi: selectcomment}),
         staleTime :  5 * 60 * 1000,
        //  enabled: !!selectedPostId,
      })
     const{ Addcomments} = useComments()
       const commentsmutation = useMutation({
  mutationFn: Addcomments,
onSuccess: () => {
    // console.log(successclosing, "comment added "),
    // 🔥 THIS triggers posts API again
    // queryClient.invalidateQueries({ queryKey: ["displaycomments",selectcomment]}); 
      queryClient.invalidateQueries({ queryKey: ["realcommentss"]}); 

    setaddcomments("")
  },
}); 


                                                                                                  //  for dashboard -3 section 
 const[aibot, setaibot] = useState({display : "none"})
   function chatbotopen() {
if (aibot) {setaibot({ display  :"block"})}}
  function chatbotclose() {
    setaibot({
      display  :"none"
   })
   }
             
    //  for google chat bot

        const[typo,settypo] = useState("")
              const[getresult, setresult] = useState("")
              async function get() {
                try {
                  //  let apikey = "AIzaSyDLwhf_f1chzoIqW-LtUiMGEl8CAWILI7U";
                   let apikey = "AIzaSyAxozeTf8WUXCvjEim_a8wJbxa6obx3AKg";
                   if (!apikey) {
                    throw new Error("API key is not defined.");
                }
                const genAI = new GoogleGenerativeAI(apikey);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            
                    const result = await model.generateContent(typo);
                    setresult(result.response.text())
                    // console.log((result.response.text()));
                  } catch (error) {
                    // console.error("Error:", error);
                    setresult("error in generating response", error)
                    console.log(error, "this is the error ");
                       
                  }
                }


//    user-name sending using redux
    function reduxsend(data,postcreator) {
                        let selectname = data
                      let  creator = postcreator
                        dispatch(sendusername(selectname));
                        dispatch(sendcreatorname(creator));
                      //  dispatch(sendletter(firstletter)) 
                        //  navigate(`/Userprofile/${selectname}`);
                        navigate(`/Profileuser/${postcreator}`);
                       }
        function loginname() {
          let loginname = user  
          dispatch(sendloginname(loginname))
          navigate(`/Userprofile/${loginname}`);
        }


         //                                for question ask section

         const[askdisplay, setaskdisplay] = useState({})
         const[questionbutton, setquestionbutton]= useState({})
         function asksection(){
           setlowopacity({opacity : "0.1"})
             setaskdisplay({display: "block"})
             
         }

         function asksectionclose() {
           setlowopacity({opacity : "1"})
           setaskdisplay({display : "none"})
           setlistanswers([])
          

         }
        
          //  creating attributes for the ask section 
            // const[submitquestion, setsubmitquestion] = useState("")
   const [questiontitle, setquestiontitle] = useState("")


     const { data :question, isLoading :questionloading, error : questionerror } = useQuery({
          queryKey: ["question"],
          queryFn: fetchingquestions,
           staleTime: 5 * 60 * 1000,
        });
      
  


    //  onclick question section 
               const[selectquestionbox, setselectquestionbox] = useState({})
                const[passingquestion, setpassingquestion] = useState("")
                const[questionid, setquestionid] = useState("")
                const[answer, setanswer] = useState("")
                const [listanswers, setlistanswers] = useState([])
        function selectclose() {
          setselectquestionbox({display: 'none'})
      setlowopacity({opacity : "1.0"})
      setlistanswers([]);
      setquestionbutton({display: "block"})
        }
        
         const getquestion = useSelector((state) => state.sendingname.question)
        function zoomquestion(data, question) {
          let questioncontent = question
          setpassingquestion(questioncontent)
          setquestionid(data)
      setselectquestionbox({display: 'block'})
      setlowopacity({opacity : "0.1"})
      dispatch(sendquestion(questioncontent))
      // fetchinganswers()
      // setquestionbutton({display: "none"})
    }  

   
        
  //   for the success box closing 
      function successclosing(){
        //  setsubmitshown({display : "none"})
          setlowopacity({opacity : "1.0"})

      }
      function questiondisplayclose(){
        setquestiondisplay({display : 'none'})
      }
     

     
    //  adding post function
    function addingposts(e){
    e.preventDefault(); 
     postMutation.mutate({title, category, authid, user, content})
    }
 
    //  adding ask question function
 
   const {creatingasksection, submitquestion,questiondisplay} = useQuestions()

    function askanything(e){
    e.preventDefault();
    creatingasksection(questiontitle,authid,user)
    }


    const [value, setValue] = React.useState('one');
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  //   styling the usercomments section

  const[commentdisplay, setcommentdisplay] = useState(null)

  //  replying comments 

  const [replycomments, setreplycomments] = useState("");
  const[fetchreply, setfetchreply] = useState("")
     
   const{replycomment,fetchreplycomment} = useComments()
     
  
   const {data :displayreplycomments} = useQuery({
         queryKey:["replycommentss",fetchreply],
          queryFn: ()=>fetchreplycomment({listingscomment:fetchreply}),
         staleTime :  5 * 60 * 1000,
        //  enabled: !!selectedPostId,
      })

       const replymutation = useMutation({
  mutationFn: replycomment,
  onSuccess: () => {
    // console.log(successclosing, "comment added "),
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({ queryKey: ["replycommentss",fetchreply]}); 
  

     setreplycomments("");
  },

})

      //  to display comment length in post 


       async function fetchingcomments(){
         const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);        
              const databases = new Databases(client);
     try {
         const fetchingcommentslength = await databases.listDocuments(
            conf.appwritedatabaseid,conf.appwritecommentsid,[Query.limit(100)] )
            console.log(fetchingcommentslength.documents, "documentssss");
         return fetchingcommentslength.documents
            
     } catch (error) {
           console.log(error, "error in fetching comments");  
     }
    }
       const{data : realcomments}= useQuery({
        queryKey :["realcommentss"],
        queryFn : fetchingcomments,
         staleTime :  5 * 60 * 1000,
       })

  //   delete comment 

     let {deletecomment,replycommentdelete} = useComments()
     
     const deletemutation = useMutation({
      mutationFn : deletecomment,
      onSuccess : ()=>{
        queryClient.invalidateQueries({ queryKey: ["displaycomments"]}); 
      }
     })

     const replydeletemutation = useMutation({
       mutationFn : replycommentdelete,
       onSuccess : ()=>{
       queryClient.invalidateQueries({ queryKey: ["replycommentss",fetchreply]}); 
       }
     })
     
     

  return (   
    <div>
      
         <div className="dash-section">
         <div className="posting" style ={postdisplay}>
         <div className="fullposting">
         <div className="posting-top">
         {/* <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}} >{firstletter}</h6> */}
         
            {/* <h6 style={{color : "white"}}>{user}</h6> */}
            <i className="fa-solid fa-xmark" onClick={postboxclose}  style={{color: "white",position: "absolute", right : "3px", zIndex:"4", top : "2px" }}></i>
            </div>
            <div className="posting-bottom">
            <form action="" className='postform' onSubmit={addingposts}>
          <div className="post-form-top">
  <input type="text" name="" id="" required  value={title} onChange={(e)=>settitle(e.target.value)} placeholder='post content' style={{width :"70%", height:"40px", bordedr : "none"}}/>
  <select name="" id="" required  value={category} style={{border : "none"}} onChange={(e)=>setcategory(e.target.value)}>
    <option value="">Select post category</option>
    <option value="AI">AI</option>                       
    <option value="Science">Science & Technology</option>
    <option value="EV">EV</option>
    <option value="Business & Startup">Business & Startup</option>
    <option value="Politics">Politics</option>
    <option value="Stock Market">Stock Market</option>
    <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
    <option value="Culture">Culture</option>
    <option value="Others">Others</option>
  </select>
  </div>
  <JoditEditor 
        ref={editor}
        value={content}
        onChange={setcontent}
   
         />
         <div className="with-submit">
         <div className="post-form-image" style={{marginTop : "10px"}}>
         <label htmlFor="" style={{color : "white"}}>Cover image</label>
         <input type="file" name="" id="uploader" style={{color : "white"}}  required />
         </div>
         <div className="popularreadings">
          <button className='post-submit' style={{backgroundColor : "#0b57d0"}}>Submit</button>
         </div>
         </div>
            <div className="post-form-result">

              {/* <h6>{success}</h6> */}
            </div>
         </form>
         
              </div>
              </div>
          </div>
          <div className="asking-section" style={askdisplay}>
            <i className="fa-solid fa-xmark" style={{float :"right", padding: "4px 4px"}} onClick={asksectionclose}></i>
            <div className="asking-top">
            <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}} >{firstletter}</h6>
            
            <h6 style={{color : "white"}}>{user}</h6>
            </div>
            <div className="asking-content" onSubmit={askanything} style={{padding : "25px"}}>
               <form action="" style={{width : "100%"}}>
              <textarea type="text"  placeholder='Start your question with "what","How", "why" etc'rows='2'  value={questiontitle} onChange={(e)=>setquestiontitle(e.target.value)} required style={{width : "100%"}}></textarea>
           {/* <hr /> */}
           <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} >Add question</button>
             </form>
            </div>
            <div className="asking-button">
            </div>
          </div>

          <div className="selectedquestion-section" style={selectquestionbox}>
          <i className="fa-solid fa-xmark" style={{float :"right", padding: "4px 4px"}} onClick={selectclose}></i>
          <div className="selectquestion-top">
          <h5 style={{fontFamily:"sans-serif",letterSpacing: "0.8px"}}>{getquestion}</h5>
          <textarea type="text"  placeholder='type your answer'rows='2'  value={answer} onChange={(e)=>setanswer(e.target.value)} ></textarea>
          </div>  
          
          </div>
      
   <Header></Header>
      <div className="dashboardcontainer" >
        <div className="dashboard-1" style={lowopacity}>
         

                  
                  <div className="left" style={{color : "white", width : "100%"}}>
        <div className="lists">
             
             <h5 style={{fontSize : "19px"}}  onClick={()=> setcontextvalue("")}> All posts</h5><hr />
         
               <div className="dash-1-boxes">
                      <h5  onClick={()=> setcontextvalue("AI")}>Artificial intelligence AI</h5> 
                      <img className='dash1-img' src={ai} alt=""  onClick={()=> setcontextvalue("AI")} />
                      {/* <h5 className='dash1-text' >Politics</h5> */}
                    </div> <hr />
               <div className="dash-1-boxes">
                      <h5 onClick={()=>setcontextvalue("Stock Market")}>Stock market</h5> 
                      <img className='dash1-img' src={stock} alt="" onClick={()=>setcontextvalue("Stock Market")} />
                      {/* <h5 className='dash1-text' >Politics</h5> */}
                    </div> <hr />
               <div className="dash-1-boxes">
                      <h5 onClick={()=>setcontextvalue("Business & Startup")}>Business & Finance</h5> 
                      <img className='dash1-img' src={business} alt="" onClick={()=>setcontextvalue("Business & Startup")} />
                      {/* <h5 className='dash1-text' >Politics</h5> */}
                    </div> <hr />
               <div className="dash-1-boxes">
                      <h5  onClick={()=>setcontextvalue("EV")}>Electric <br />EV</h5> 
                      <img className='dash1-img' src={ev} alt=""  onClick={()=>setcontextvalue("EV")} />
                      {/* <h5 className='dash1-text' >Politics</h5> */}
                    </div> <hr />
               <div className="dash-1-boxes">
                      <h5 onClick={()=>setcontextvalue("Science & Technology")}>Science & Technology</h5> 
                      <img className='dash1-img' src={technology} alt=""  onClick={()=>setcontextvalue("Science & Technology")}/>
                      {/* <h5 className='dash1-text' >Politics</h5> */}
                    </div> <hr />
               <div className="dash-1-boxes">
                      <h5>Politics</h5> 
                      <img className='dash1-img' src={politics} alt="" />
                      {/* <h5 className='dash1-text' >Politics</h5> */}
                    </div>
        </div>
             </div>

                 </div>
                 <div className="dashboard-2" style={lowopacity}>           
                    <div className="dash2-up">

                        <div className="dash-2-up-top">
                    {/* <h6 style={{padding : "4px 9px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px", width: '30px'}} >{firstletter}</h6> */}
                    <input type="text" name="" id="" style={{height: "35px",color : "black", background : "white",border : "none", width : "100%", borderRadius : '20px'}} className='dashboard-input' placeholder="what do you want to ask or share "/>                       
                    </div>
                    <div className="dash-2-down">
                         <button className='dash-2-buttons' style={{borderRight : '1px solid white'}} onClick={opacitychanger}>Post</button>
                         <button className='dash-2-buttons' onClick={asksection}>Ask</button>
                         {/* <button className='dash-2-buttons' style={{borderLeft : '1px solid white'}}>Ask</button> */}
                    </div>

                    </div>

                      
                     {!postdocumentsloading && !postdocumentserror &&(
                      <div className="everyposts-section">
                         
                         {postdocuments.length > 0? ( postdocuments.map((listings)=> (
                      <div className="Posts" style={{marginTop : "8px"}} key={listings.$id}>
                      <div className="every-post">
                      <div className="onlycontent">
                        <div className="post-heading" style={{lineHeight: "10px"}} >
                          <h5 style={{color : "black"}}>{listings.posttitle}</h5> 
                          <div className="incdate" style={{display: "flex", justifyContent: "space-between"}}> 
                          <span style={{fontWeight: "400", fontSize: "14px", color: "black",textDecoration : "underline"}}>{listings.postcategory ? "category - " + listings.postcategory :listings.postcategory} </span>
                          <span style={{fontWeight: "400", fontSize: "13.5px", color: "#0b57d0", borderRadius:"20px", padding : "7px 7px"}} >{listings.actualtime}</span>
                          </div> 
                        </div> 
                         
                        <div className="post-user" style={{display : "flex", justifyContent :"space-between", padding: "8px 0px",color : "#626161"}}>
                          <h6 onClick={()=> reduxsend(listings.authid,listings.postcreator)} style={{color :"#0b57d0", textDecoration: "underline",fontSize: "14px", cursor:"pointer"}}>{listings.postcreator}</h6>

                            
                           
                        </div>   
                        
                        <div className="post-content"> 
                       {gettingid === listings.$id ?(
                         <h6 style={{color: "black",fontWeight:"400",lineHeight:"24px" }}>{nottrimcontent}</h6>
                        ):( <h6 style={{color: "black",fontWeight:"400",lineHeight:"24px" }}>{listings.postcontent.slice(0,300)}</h6> )}
                        <h6 style={{cursor: "pointer", fontWeight : "300", color: "#0b57d0"}} onClick={()=>nottrim(listings.$id)}>{gettingid === listings.$id ?"" :"(... more⬇️)"}</h6>
                        
                        </div> 
                        </div>
                        <div className="post-image" style={{display: "flex", justifyContent:"center", backgroundColor : ""}}>
                          <img src={listings.featuredimage} alt="image" style={{width:"95%", borderRadius : "21px"}} />
                      </div>
                      <div className="like-comment-section">
                         <div className="like-section"> 
                          
                          {listings.Like.includes(authid)?<i class="fa-solid fa-heart" style={{color:"#e51b7b", fontSize  : "14px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate({docid : listings.$id, Like : listings.Like})}></i> : <i class="fa-solid fa-heart" style={{color : "white", fontSize : "14px", cursor : "pointer"}} onClick={()=>likeMutation.mutate({ docid :listings.$id, Like : listings.Like, creator : listings.authid,postname :listings.posttitle})}></i>}  
                         
                        <div className="like-right" style={{color : "white"}}>
 
    {listings.Like.length}
     
  {/* {increaselike === listings.$id ? listings.Like.length +1 : listings.Like.length} */}    
                        </div>
                        </div> 
                        <div className="right-comment">
                        <i className="fa-regular fa-comment" style={{color : "#514d4d"}} onClick={addcomment}></i>
                     
                      <h6 style={{background: "none", color :"#0b57d0", cursor : "pointer", fontWeight : "500", fontSize : "14px"}} onClick={()=>setselectcomment(listings.$id)}>list comments</h6>       

                        <h6 style={{background: "none", color :"#0b57d0", cursor : "pointer", fontWeight : "500", fontSize : "14px"}}>{realcomments?.filter((display)=>display.postid === listings.$id).length} comments </h6>            
                         
                      </div>
                      </div>
                     
              <div className="comments" style={comments}>
              <div className="dash-2-up-top">
                    <h6 style={{padding : "4px 9px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px", width: '30px'}} >{firstletter}</h6>
                    <input type="text" name="" id="" style={{height: "35px",color: "black", background : "#ffffff",border : "1px solid #dfdada", width : "100%", borderRadius : '20px'}} className='dashboard-input' placeholder="Add comments " value={addcomments} onChange={(e)=>setaddcomments(e.target.value)}/>
                    <div className="comments-right">
              <i className="fa-solid fa-caret-right" style={{fontSize:"25px", color : "black"}} onClick={()=>commentsmutation.mutate({listingsid:listings.$id,addcomments,user,authid,postcreator:listings.authid,posttitle :listings.posttitle})}></i>
              </div>
              </div>
                    </div>

                            
                          <div className="showing-comments"style={{transition: "transform 0.9s ease"}}>
                          <h6>

</h6>
                            {displaycommentss?.map((comment) => comment.postid === listings.$id?(
      <div className="every-comment" style={{padding : "6px 20px",}} key={comment.$id}>
        <div className="name-date" style={{display: "flex", justifyContent : "space-between"}}>
        <h6 style={{color : "white",fontSize : "15px", color : "#2d2a2a" }}>{comment.name}</h6>
        {/* <h6 style={{fontSize : "12px"}}>{comment.date}</h6> */}
        <span style={{fontWeight: "400", fontSize: "13.5px", color: "#2d2a2a", borderRadius:"20px", padding : "3px 7px"}} >{comment.actualtime}</span>
        </div>
        <div className="message-icon" style={{display : "flex", gap : "15px"}}>

        <h6 style={{color: "black",fontWeight:"400", fontSize : "13.5px", letterSpacing : "0.3px", lineHeight : "20px"}}>{comment.comments}&nbsp; &nbsp; </h6>
        <h6 style={{color : "blue", textDecoration : "underline", cursor : "pointer",color: "black",fontWeight:"400", fontSize : "13.5px",}}onClick={()=>{setcommentdisplay(comment.$id),setfetchreply(comment.$id)}}>reply</h6>
        
        {comment.authid === authid?( <><h6 style={{color: "black",fontWeight:"400", fontSize : "13.5px", cursor : "pointer"}} onClick={()=>deletemutation.mutate(comment.$id)}>delete</h6></>):(<></>)}


        </div>


    {displayreplycomments?.map((listings)=>(
      <div className="reply-comments" key={comment.$id} style={{
        display: commentdisplay === comment.$id ? "flex " : "none", flexDirection : "column", marginBottom : "10px"  
      }}>
        <>
      <span style={{color : "blue",fontSize : "13.9px"}}>{listings.user}</span>
      <div className="reply-box" style={{display : "flex", gap : "8px", cursor : "pointer",}}>
    
    
  <div className="ggh" style={{width : "72%"}}>
      <span style={{fontSize : "13.9px"}}>{listings.comment}</span>
  </div>
  {listings.authid === authid ?(
    <>
    <div className="ggg" style={{display : "flex", justifyContent : "space-between", padding : "0px 10px", width : "28%"}}>
      <span style={{fontSize : "13.9px"}}>{listings.actualtime}</span>

      {listings.authid === authid?(<><span style={{fontSize : "13.9px", textDecoration : "underline"}} onClick={()=>replydeletemutation.mutate(listings.$id)}>delete</span>
      </>
    ):(<>
    
    </>)}

    </div>
    </>
  ) : (
    <>
    <div className="ggg" style={{textAlign : "right" , padding : "0px 10px", width : "28%"}}>
      <span style={{fontSize : "13.9px"}}>{listings.actualtime}</span>

      {listings.authid === authid?(<><span style={{fontSize : "13.9px", textDecoration : "underline"}} onClick={()=>replydeletemutation.mutate(listings.$id)}>delete</span>
      </>
    ):(<>
    
    </>)}

    </div>
    </>
  )}


      </div>
        </>
      </div>
    ))}
        
  
      
      <div className="dash-2-up-top" key={comment.$id} style={{
    display: commentdisplay === comment.$id ? "flex " : "none", padding :"20px"
  }}>
                    <input type="text" name="" id="" style={{height: "35px",color: "black", background : "#ffffff",border : "1px solid #dfdada", width : "100%", borderRadius : '20px'}} className='dashboard-input' placeholder="reply" value={replycomments} onChange={(e)=>setreplycomments(e.target.value)}/>
                    <div className="comments-right">
              <i className="fa-solid fa-caret-right" style={{fontSize:"25px", color : "black"}} onClick={()=>replymutation.mutate({commentsid:comment.$id,replycomments,user,authid})}></i>
              </div>
              </div>
        

        <hr style={{color : "#686665", margin : "2px"}} /> 
      </div>
    ):(<></>))
    }
    </div>
   
    </div>
            
            </div>
  
                ))):(  <div className='nocount'><h2 style={{color : 'white'}}>No posts yet</h2> </div> )}

                    </div> 
                        
                     )}
                    
                      
                 </div>
                 <div className="dashboard-3">
                    <div className="dash3-1">
                 <div className="top-upbox"  style={{display :submitshown === true ? " block" : 'none'}}>
                   <div className="top-upbox-content">
                 <p>{submit}</p>
 <div class="dot-loader">
  <span></span>
  <span></span>
  <span></span>
</div>
                   </div>



</div>
                 <div className="top-upbox"  style={{display :questiondisplay === true ? " block" : 'none'}}>
                   <div className="top-upbox-content">
                 <p>{submitquestion}</p>
 <div class="dot-loader">
  <span></span>
  <span></span>
  <span></span>
</div>
                   </div>



</div>

         {/* {online === true ? <h5>yes</h5> : <h5>no</h5>} */}
            </div>      

              <div className="dash3-2">
                 
                 {/* <div className="dash3-2-top">

                  <h5>Chat</h5>
                    <div className="dash3-2-top-right">
                     <div className="dash-3-2top-right-img"></div>
                     <span>Ask</span>
                   
                     <span>...</span>
                    </div>
                 </div> */}
                 {/* <div className="dash3-2-middle">
                             <input type="text" name="" id="" style={{height: "35px, width: 100%"}} className='dashboard-input' placeholder="Ask your favorite query"/>
 
                 </div> */}
                 {/* <Chat></Chat> */}
                 {/* <div className="dash3-2-bottom">

                 </div> */}
              </div>
              <div className="dash3-3">
              </div>


                 </div>
      </div>

        
    </div>
    </div>
  )
}

export default Newdash


  