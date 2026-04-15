import React, { useState,useEffect ,useRef, useMemo} from 'react'
import './Newdash.css'
import { useDispatch } from 'react-redux'
// import { useState } from 'react';
import authService from '../../../appwrite/auth'
import { Client,Storage,ID } from 'appwrite'
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
import { useQuery } from "@tanstack/react-query";  
// import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from "@tanstack/react-query";


//  importing costom hoooks 
import {likesincrease,likesdecrease} from '../Customs/Increase/increaselikes'
import usePosts from '../Customs/Increase/posts' 
import useComments from '../Customs/Increase/comments'
import useQuestions from '../Customs/Increase/questions'
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
                  
function Newdash({network}) {
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
            return listcategory.documents.reverse();
              } catch (error) {
                return error
              }                
            }
            async fetchall(){
              try {
                   const listevery = await database.listdocuments() 
         return listevery.documents.reverse()
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
    console.log(successclosing, "saaaaaaa"),
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({ queryKey: ["documents"]});
  },


}); 


          //   linking the mutation with the posts function and the likes decrease function
   
 const decreaselikeMutation = useMutation({
  mutationFn: likesdecrease, 

  onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({ queryKey: ["documents"]}); 
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
               padding: "6px 2px"
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
  //  async function Addcomments(commentid) {
  //    const client = new Client()
  //     .setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
  //   const databases = new Databases(client);
  //    try {
  //      const getcreator = await authService.getcurrentuser();
  //     let creatorname = getcreator.name
  //     // console.log(getcreator.name);
  //     //  let date = new Date().toString()
  //      setcommentcreator(getcreator.name)
  //      const comments = await databases.createDocument(
  //       conf.appwritedatabaseid,conf.appwritecommentsid,ID.unique(),{
  //         "comments" : addcomments,
  //         "postid": commentid,
  //        "name": creatorname,
  //        "date":new Date().toDateString(),  
  //       }
  //     )
  //     console.log( "these are the comments",comments);
  //      setaddcomments("")
  //      // setgetcomments(comments)
                                                                      
  //   } catch (error) {
  //      console.log("getting error in adding comments", error);
                                                                                       
  //   }
  //  }  


     
    //  fetching post comments 
    // async function fetchcomments(selectedPostId) {
    //   const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    //  const databases = new Databases(client);
    //   try {
    //        const fetchingcomments = await databases.listDocuments(
    //         conf.appwritedatabaseid,conf.appwritecommentsid,[Query.equal("postid",selectedPostId)])
    //         // setgetcomments(fetchingcomments.documents)
    //         return fetchingcomments.documents
    //   } catch (error) {
    //       console.log("error in fetching comments", error);    
    //   }
    //  }
  
    //  fetching with querry 
  // const [selectedPostId, setSelectedPostId] = useState("");
      const {fetchcomments} = useComments()

      const {data :displaycommentss} = useQuery({
         queryKey:["displaycomments"],
         queryFn :()=>fetchcomments(), 
          
         staleTime :  5 * 60 * 1000,
        //  enabled: !!selectedPostId,
      })
     const{ Addcomments} = useComments()
       const commentsmutation = useMutation({
  mutationFn: Addcomments,

  onSuccess: () => {
    // console.log(successclosing, "comment added "),
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({ queryKey: ["displaycomments"]}); 
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
     

      async function sessionend(e) {
        e.preventDefault()
          try {
                    let endingsession = await authService.logout()
                  //  setuser(null)  
                   if (endingsession) {
                    window.location.href = '/login'; 
                   }
                 console.log(endingsession);
                 
          } catch (error) {
             alert("error in logout")
          }
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
           
  return (
    <div>
      {/* { network === true ? <h4>connected</h4>:<h4>notconnected</h4>} */}
      {/* style={submitshown} */}
                                                         {/* for the header section */}
             {/* <div className="successbox" style={submitshown}>
              <i className="fa-solid fa-circle-xmark" onClick={successclosing}  style={{color: "black",position: "absolute", right : "0px", background: "white",zIndex:"4"}}></i>
              <div className="successbox1-h3">
              <h5>{submit}</h5>
              {newpost === true ?<span style={{cursor : "pointer", textDecoration : "underline"}} onClick={()=>navigate('/Userprofile')} >view post</span> : <span></span>}</div>
             

             </div> */}
             {/* <div className="successbox" style={questiondisplay}>
              <i className="fa-solid fa-circle-xmark" onClick={questiondisplayclose}  style={{color: "black",position: "absolute", right : "0px", background: "white",zIndex:"5"}} ></i>
              <h3>{submitquestion}</h3>
             </div> */}
         <div className="dash-section">
         <div className="posting" style ={postdisplay}>
         <div className="fullposting">
         <div className="posting-top">
         <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}} >{firstletter}</h6>
            
            <h6 style={{color : "white"}}>{user}</h6>
            <i className="fa-solid fa-xmark" onClick={postboxclose}  style={{color: "white",position: "absolute", right : "0px", zIndex:"4"}}></i>
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
          {/* <div className="asnswerbutton">
          <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick={savinganswer}>post</button>
          <h6 style={{color : "white", fontWeight: "300", cursor: "pointer"}} onClick={fetchinganswers} >view all replies</h6>
          <div className="gettinganswers">
             {listanswers.length > 0 ? listanswers.map((answer)=>(
                <div className="every-answer" style={{lineHeight: "40px"}} key={answer.$id}>
                  <span style={{backgroundColor : "#0b57d0",padding: "2px 5px",borderRadius: '10px'}}>{answer.creator}</span>
                  <h6 style={{color : "white", fontWeight: "400", padding: "10px 10px",backgroundColor: "#515454",borderRadius: "10px"}}>{answer.answer}</h6>
                </div>
             )) : <h6></h6>}
          </div>
          </div> */}
          </div>
        <div className="header" id='header'>
            <div className="headerleft">

        {/* <i className="fa-solid fa-house" style={{fontSize: "18px"}}></i> */}
        <Link to="/"><i className="fa-solid fa-house" style={{fontSize: "18px", color : "white"}}></i></Link>
        <i className="fa-solid fa-users-line" style={{fontSize: "18px"}}></i> 
        <i className="fa-solid fa-bell" style={{fontSize: "18px"}}></i>
          <Link to="/Questions"><i className="fa-solid fa-book-open-reader" style={{fontSize: "18px", color : "white"}}></i></Link>
        {/* <i className="fa-solid fa-book-open-reader" style={{fontSize: "18px"}}></i> */}
        </div>
        <div className="headermiddle">
        <input type="text" name="" id="" style={{height: "35px, width: 100%"}} className='dashboard-input' placeholder="search your favorite querry"/>
        </div>
        <div className="headerright">
            <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}} >{firstletter}</h6>
            
            <h6 style={{color : "white"}}>{user}</h6>
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick={loginname}>userprofile</button>
              <button style={{backgroundColor :"#d7329a", fontSize : "13.5px"}} onClick={sessionend} >Logout</button>
        </div>  
        </div> 

      <div className="dashboardcontainer" >
        <div className="dashboard-1" style={lowopacity}>
          {/* <div className="dash-1-boxsection">
                      <h5 style={{color : "white", textAlign : "left"}}>Mostly search</h5>
                 <div className="dash-1boxes">
                    <div className="dash-1-boxes">
                      <img  className='dash1-img' src={ai} alt="" />
                      <h5 className='dash1-text' >Artificial intelligence <br /> AI </h5>
                      
                    </div>
                    <div className="dash-1-boxes">
                      <img className='dash1-img' src={stock} alt="" />
                      <h5 className='dash1-text' >Stock market</h5>
                    </div>
                    <div className="dash-1-boxes">
                      <img className='dash1-img' src={business} alt="" />
                      <h5 className='dash1-text' >Business & Finance</h5>
                    </div>
                    <div className="dash-1-boxes">
                      <img className='dash1-img' src={ev} alt="" />
                      <h5 className='dash1-text' >Electric <br />EV</h5>
                    </div>
                    <div className="dash-1-boxes">
                      <img className='dash1-img' src={technology} alt="" />
                      <h5 className='dash1-text' >Science & Technology</h5>
                    </div>
                    <div className="dash-1-boxes">
                      <img className='dash1-img' src={politics} alt="" />
                      <h5 className='dash1-text' >Politics</h5>
                    </div>
                    </div>
                   
                 </div> */}

                  <div className="dashboard-1-top">
                    <div className="dash-1-content">
                      <h6 style={{color : "white", cursor : "pointer"}} onClick={()=> setcontextvalue("")}>All posts</h6>
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left",color : "white",cursor: "pointer"}} onClick={()=> setcontextvalue("AI")} >Artificial intelligence</h6>
                     <img src={ai} alt="" />
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left", color : "white", cursor : "pointer"}} onClick={()=>setcontextvalue("EV")} >Electric vehicle</h6>
                     <img src={ev} alt="" />
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left", color : "white", cursor : 'pointer'}} onClick={()=>setcontextvalue("Stock Market")}>Stock market</h6>
                     <img src={stock} alt="" />
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left", color : "white", cursor :"pointer"}} onClick={()=>setcontextvalue("Business & Startup")}>Business & Startup</h6>
                     <img src={business} alt="" />
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left", color : "white", cursor : "pointer"}} onClick={()=>setcontextvalue("Science & Technology")}> Science & Technology</h6>
                     <img src={technology} alt="" />
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left", color : "white", cursor : "pointer"}} onClick={()=>setcontextvalue("Politics")}>Politics</h6>
                     <img src={politics} alt="" />
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left", color : "white", cursor : 'pointer'}} onClick={()=>setcontextvalue("Culture & Religion")}>Culture & Religion</h6>
                     <img src={culture} alt="" />
                    </div>
                    <div className="dash-1-content">
                    <h6 style={{textAlign : "left", color : "white", cursor : "pointer"}} onClick={()=>setcontextvalue("Fashion & Lifestylet")}>Fashion & Lifestyle</h6>
                     <img src={stock} alt="" />
                    </div>
                    
                    
                   
                  </div>

                 </div>
                 <div className="dashboard-2" style={lowopacity}>           
                    <div className="dash2-up">

                        <div className="dash-2-up-top">
                    <h6 style={{padding : "4px 9px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px", width: '30px'}} >{firstletter}</h6>
                    <input type="text" name="" id="" style={{height: "35px",color : "white", background : "#474545",border : "none", width : "100%", borderRadius : '20px'}} className='dashboard-input' placeholder="what do you want to ask or share "/>                       
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
                      <div className="Posts" style={{marginTop : "8px"}} key={listings.$id} >
                      <div className="every-post">
                      <div className="onlycontent">
                        <div className="post-heading" style={{lineHeight: "10px"}} >
                          <h5 style={{color : "white"}}>{listings.posttitle}</h5> 
                          <div className="incdate" style={{display: "flex", justifyContent: "space-between"}}> 
                          <span style={{fontWeight: "400", fontSize: "14px", color: "white",textDecoration : "underline"}}>{listings.postcategory ? "category - " + listings.postcategory :listings.postcategory} </span>
                          <span style={{fontWeight: "400", fontSize: "14px", color: "white", borderRadius:"20px", padding : "7px 7px"}} >{listings.Date}</span>
                          </div> 
                        </div> 
                         {/* <div className="post-category">
                        
                         <span style={{fontWeight: "500"}} >category : {listings.postcategory}</span>

                         </div> */}
                        <div className="post-user" style={{display : "flex", justifyContent :"space-between", padding: "8px 0px",color : "#626161"}}>
                          <h6 onClick={()=> reduxsend(listings.authid,listings.postcreator)} style={{color :"#626161", textDecoration: "underline",fontSize: "14px", cursor:"pointer"}}>{listings.postcreator}</h6>
                            {/* <img src={listings.featuredimage} alt="" srcset="" /> */}
                          {/* <i class="fa-solid fa-circle-xmark" onClick={()=>postdeletion(listings.$id)} style={deletepost}></i> */}
                        </div>   
                        
                        <div className="post-content"> 
                       {gettingid === listings.$id ?(
                         <h6 style={{color: "white",fontWeight:"400",lineHeight:"24px" }}>{nottrimcontent}</h6>
                        ):( <h6 style={{color: "white",fontWeight:"400",lineHeight:"24px" }}>{listings.postcontent.slice(0,300)}</h6> )}
                        <h6 style={{cursor: "pointer", fontWeight : "300", color: "#0b57d0"}} onClick={()=>nottrim(listings.$id)}>{gettingid === listings.$id ?"" :"(... more⬇️)"}</h6>
                        
                        </div> 
                        </div>
                        <div className="post-image" style={{display: "flex", justifyContent:"center", backgroundColor : ""}}>
                          <img src={listings.featuredimage} alt="image" style={{width:"80%"}} />
                      </div>
                      <div className="like-comment-section">
                         <div className="like-section"> 
                          {/* {listings.Like.includes(authid) ?  <i class="fa-regular fa-heart" style={{color : "red"}} ></i>: <i class="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)}></i>} */}
                           {/* <i className="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)} style={{color:"white"}}></i> */}
                          {listings.Like.includes(authid)?<i class="fa-solid fa-heart" style={{color:"#d7329a", fontSize  : "14px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate({docid : listings.$id, Like : listings.Like})}></i> : <i class="fa-solid fa-heart" style={{color : "white", fontSize : "14px", cursor : "pointer"}} onClick={()=>likeMutation.mutate({ docid :listings.$id, Like : listings.Like})}></i>}  
                          {/* >likeMutation.mutate({ docid : listings.$id, like : listings.Like}) */}  
                                 {/* <i class="fa-solid fa-heart" style={{color : "red"}} ></i> */}
                        <div className="like-right" style={{color : "white"}}>
  {/* {increaselike.includes(listings.$id)
    ? listings.Like.length + 1    
    : listings.Like.length}  */}  
  {/* {listings.Like.includes(authid)
    ? listings.Like.length    
    : listings.Like.length}  */}
    {listings.Like.length}
     
  {/* {increaselike === listings.$id ? listings.Like.length +1 : listings.Like.length} */}    
                        </div>
                        </div> 
                        <div className="right-comment">
                        <i className="fa-regular fa-comment" style={{color : "pink"}} onClick={addcomment}></i>
                      {/* <button style={{background: "none", color :"#414040"}} onClick={()=>fetchcomments(listings.$id)}>list comments</button> */}
                      {/* <h6 style={{background: "none", color :"white", cursor : "pointer", fontWeight : "400"}} onClick={()=>setSelectedPostId(listings.$id)}>list comments</h6>        */}
                      <h6 style={{background: "none", color :"white", cursor : "pointer", fontWeight : "400"}} onClick={()=>fetchcomments({listingsi : listings.$id})}>list comments</h6>       
                             
                         
                      </div>
                      </div>
                      {/* <div className="comments" style={comments}> 
                      <div className="message-section">
              <p className='username'>{firstletter}</p>
              <input type="text" name="" id="" className='dashboard-input' placeholder='Add comments' value={addcomments} onChange={(e)=>setaddcomments(e.target.value)} />
              <div className="comments-right">
              <i class="fa-solid fa-caret-right" style={{fontSize:"25px"}} onClick={()=>Addcomments(listings.$id)}></i>
              </div>
              </div>
                </div> */}
              <div className="comments" style={comments}>
              <div className="dash-2-up-top">
                    <h6 style={{padding : "4px 9px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px", width: '30px'}} >{firstletter}</h6>
                    <input type="text" name="" id="" style={{height: "35px",color: "white", background : "#474545",border : "none", width : "100%", borderRadius : '20px'}} className='dashboard-input' placeholder="Add comments " value={addcomments} onChange={(e)=>setaddcomments(e.target.value)}/>
                    <div className="comments-right">
              <i className="fa-solid fa-caret-right" style={{fontSize:"25px", color : "white"}} onClick={()=>commentsmutation.mutate({listingsid:listings.$id,addcomments,user,authid})}></i>
              </div>
              </div>
                    </div>


                            <div className="showing-comments"style={{transition: "transform 0.9s ease"}} >
                            {displaycommentss?.filter((comment) => comment.postid === listings.$id).map((comment) => ( // Only show comments for this post
         

      <div className="every-comment" style={{padding : "6px 20px",  }} key={comment.$id}>
        <div className="name-date" style={{display: "flex", justifyContent : "space-between"}}>
        <h6 style={{color : "white",fontSize : "15px", color : "#b9b2b2" }}>{comment.name}</h6>
        {/* <h6 style={{fontSize : "12px"}}>{comment.date}</h6> */}
        <span style={{fontWeight: "400", fontSize: "14px", color: "white", borderRadius:"20px", padding : "3px 7px"}} >{comment.date}</span></div>
        <h6 style={{color: "white",fontWeight:"400", fontSize : "15px", letterSpacing : "0.3px", lineHeight : "20px"}}>{comment.comments}</h6><hr style={{color : "#686665", margin : "none"}} />
                    
      </div>
    ))}
    </div>
    </div>
            
            </div>
  
                ))):(  <div className='nocount'><h2 style={{color : 'white'}}>No posts yet</h2> </div> )}

                    </div> 
                        
                     )}
                    
                      
                 </div>
                 <div className="dashboard-3">
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
                  
                 {/* <div class="dot-loader">
  <span></span>
  <span></span>
  <span></span>
</div> */}


                 {/* <div className="dash-3-topnews" style={lowopacity}>
            <div className="topnews-heading">
              <h5>Most popular</h5>
            </div>

         </div> */}
         <div className="dash-board-3-bottom">
         <div className="ai-contentsection" style={aibot}>
          <p style={{fontSize : "14px", textAlign : "center", }}>please make content short <br />😊</p>
          <textarea style={{width: "100%",height: "400px", border: "none",backgroundColor: "#3f3d3d" }} readOnly value={getresult} name="" id="" placeholder=''></textarea>
          <div className="ai-content">
            <p style={{fontSize : "14px", textAlign : "center"}}>What can i help with?</p>
            <div className="ai-input">
              <input type="text" name="" id="" value={typo} onChange={(e)=>settypo(e.target.value)}  style={{height: "30px", width : "80%", height: "37px",
    border: "none",
    borderRadius: "10px"}} placeholder="Type..." />
              <i className="fa-solid fa-caret-right" style={{fontSize : "30px"}} onClick={get}></i>
            </div>
          </div>
         </div>
         <div className="bottomdash">
          <div className="dash-3-bottom">
            <div className="dash-3-section">
              <h6 style={{color : "white", fontWeight : "400"}}>Geneate AI Content</h6>
              
              <div className="dash-3-icons">
              <i className="fa-solid fa-circle-dot"></i>
              <i className="fa-solid fa-caret-up" onClick={chatbotopen}></i>
              <i className="fa-solid fa-caret-down" onClick={chatbotclose}></i>
              </div>
              </div>
              </div>
              </div>
              </div>
                 {/* <div className="dash-3-voting" style={lowopacity}>
                   <h5 style={{color : "#ff6b74"}}>Vote on trending</h5>
                   <div className="dash-3-votingsection">
        {postings.map((listings)=>(
          <>
          <div className="just-2">
             <h6 style={{color : "white", fontWeight: "400"}}>{listings.posttitle} <span style={{color : "#ff6b74"}}>(100 votes)</span> </h6>
             <span style={{cursor: "pointer", textDecoration : "underline", color : "white"}} > vote</span>
             </div>
             </>
        )).slice(0,10)}
       </div>
                 </div> */}
                 {/* <div className="listquestions" style={{padding : "10px 2px"}}>
                    {!questionloading && !questionerror && (
                   <div className="listquestions-content">
                    <h5 style={{color : "#ffade9"}}> Most recent questions</h5>
                  {question.map((question)=>(
                   
                    <div className="questions-asked" key={question.$id}>

                     <h6 style={{color :"white", fontWeight: "400"}}>{question.question}</h6>
                     <div className="question-button" style={{display: "flex", justifyContent :"space-between"}}>
                     <span style={{color :"white", fontSize: '14px'}}> author : {question.creator}</span>
            <button className='question-button' style={questionbutton} onClick={()=>(zoomquestion(question.$id, question.question))}>reply</button>
                                          
                    </div>
                     </div>
                  
                ))}
                <hr style={{margin : "0px", color : "white"}} />
                        
                   </div>
                )}
                 </div> */}
                 </div>
      </div>

        
    </div>
    </div>
  )
}

export default Newdash

