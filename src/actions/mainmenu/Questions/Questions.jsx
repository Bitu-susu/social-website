
import React, { useState,useEffect ,useRef, useMemo} from 'react'
import authService from '../../../appwrite/auth'
import './Questions.css'
import { Client,Storage,ID } from 'appwrite'
import database from '../../../appwrite/database'
import {Account,Databases,Query } from 'appwrite'
import conf from '../../../appwrite/conf'
import { useQuery } from "@tanstack/react-query";  
// import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {sendloginname} from '../../../redux/createslice'
//  fetching questions
import { useDispatch } from 'react-redux'
import { isRouteErrorResponse, Link, useNavigate } from 'react-router-dom'
// import Usecurrentuser from './Questionss'

import Header from '../Customs/Increase/header/Header'


//   fetching current user
const currentuser = async()=>{
  const getuser = await authService.getcurrentuser();
  return getuser;
}
//   fetching questions with auth id 


 

function Questions() {
   const navigate = useNavigate()
  const dispatch = useDispatch();
    //  let userss = Usecurrentuser()
     let [questionss, setquestionss] = useState([])
       let [actual , setactual] = useState("all")
        const fetchingquestions = async()=>{
                const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
                      const databases = new Databases(client); 
                            const fetchquestions = await databases.listDocuments(
 conf.appwritedatabaseid,conf.appwritequestionid,[Query.limit(100)] 
                            )    
                           setactual("all")
                           setcount(0)
                            setquestionss(fetchquestions.documents.slice(0,2))
                            console.log(fetchquestions.documents.slice(0,2));
                                                       
                          }
          useEffect(()=>{
           fetchingquestions()
          },[])

         //   fetching current user

   const {data :currentusers} = useQuery({
           queryKey:["currentuser"],
           queryFn : currentuser,
           staleTime :  5 * 60 * 1000,
        })  
            //   declaring variables for the current user 
             let user = currentusers?.name;
             let authid = currentusers?.$id; 
             let firstletter = currentusers?.name.charAt(0).toUpperCase()  

   
const[selectcategory, setselectcategory] = useState("")

//  fetching questions with authid
 let[reply, setreply] = useState("yes")
async function withauthquestions(){
  setcount(0)
 const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
        const databases = new Databases(client);
        try {
              const authquestions = await databases.listDocuments(
                conf.appwritedatabaseid,conf.appwritequestionid,[Query.equal ("authid",authid)]  
              )
              // setquestionss(authquestions.documents)
              console.log(authquestions,"authquestions");
              setreply("yes")
              setactual("myquestions")
              console.log(actual, "actuallll");
              
              setquestionss(authquestions.documents.slice(0,2))

        } catch (error) {
          console.log("error in fetching authquestions", error);
        }
}

   //  for question ask section
      const[selectquestionbox, setselectquestionbox] = useState({display : "none"})   
      const[getquestion, setgetquestion] = useState("")
      const[answer, setanswer] = useState("")
      const[questionid, setquestionid] = useState("")
       const[lowopacity, setlowopacity] = useState({})
       const [listanswers, setlistanswers] = useState([])
       function selectclose() {
          setselectquestionbox({display: 'none'})
      setlowopacity({opacity : "1.0"})
      setlistanswers([]);
      setquestionbutton({display: "block"})
        }
       const[showreply, setshowreply]= useState({display : "none"})
      async  function zoomquestion(id,question){
         setgetquestion(question)
         setshowreply({display : "block"})
         setquestionid(id)
        //  console.log(id, "iiiiiiiiiiiiiiii");
         
        //  setselectquestionbox({display: 'block'})
          const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
        const databases = new Databases(client);
        try {
              const fetchinganswers = await databases.listDocuments(
                conf.appwritedatabaseid,conf.appwriteanswerid,[Query.equal("questionid",id)]
              )
              setlistanswers(fetchinganswers.documents)
              // console.log(fetchinganswers,"these are the answers");
        } catch (error) {
          console.log("error in fetching answers", error);
        }

        }
       
   
  //  saving answers
 async function savinganswer() {
      const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
      const databases = new Databases(client);
      try {
        const saveanswer = await databases.createDocument(
            conf.appwritedatabaseid,conf.appwriteanswerid,ID.unique(),{
            "question": getquestion,
            "answer": answer,
            "authid": authid,
            "creator": user,
            "questionid": questionid
          }
        )
        // console.log(saveanswer,"answer added successfully")
        setanswer('')
        setTimeout(() => {
          setselectquestionbox({display : "none"},
            setlowopacity({opacity : "1"})

          )
         }, 1000);
        //  console.log("successfully saved answer")
      } catch (error) {
        console.log("error in saving answer", error);
        
      }
    }

    //  fetching the answers according the questions selected
      // async function fetchinganswers() {
      //   const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
      //   const databases = new Databases(client);
      //   try {
      //         const fetchinganswers = await databases.listDocuments(
      //           conf.appwritedatabaseid,conf.appwriteanswerid,[Query.equal("questionid",questionid)]
      //         )
      //         setlistanswers(fetchinganswers.documents)
      //         console.log(fetchinganswers,"these are the answers");
      //   } catch (error) {
      //     console.log("error in fetching answers", error);
      //   }
      // }

      //  fetching answered questions

      //   working with more button 
  let[count, setcount] = useState(0)   
  let[arrays,setarrays] = useState(0)
 
  async function morebutton(){
    console.log(actual, "actual123");      
    
       let n = 2 ;
      //  let c = 20
           const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid); 
        const databases = new Databases(client);
        try{ 
           if (actual === "all") {
             const fetchquestions = await databases.listDocuments(
                      conf.appwritedatabaseid,conf.appwritequestionid,[Query.limit(100)]    
                    ) 
                    let totallength = fetchquestions.documents.length 
                  
                    console.log(count, "count");
                    if (count < totallength) {
                        setcount((count)=>count+n)  
                        // setarrays(count+n)
                       }
                        let normal =fetchquestions.documents.slice(0,4 + count)
                          // let slicequestions = fetchquestions.documents.slice(4,arrays +n);
                          // if (slicequestions) {
                          //   setquestionss([...normal,...slicequestions])      
                          // }
                          
                            setquestionss([...normal])      
                          
                          
           }
                
           else if(actual === "myquestions") {
         const authquestions = await databases.listDocuments(
                conf.appwritedatabaseid,conf.appwritequestionid,[Query.equal("authid",authid)]
              )
              console.log(actual, "actualll");
              
              let totallength = authquestions.documents.length 
                  
                    console.log(count, "count");

                    if (count < totallength) {
                        setcount((count)=>count+n)  
                        // setarrays(count+n)
                      }
                        let normal =authquestions.documents.slice(0,4+count)
                        //   let slicequestions = authquestions.documents.slice(4,arrays +n)
                          // if (slicequestions) {
                          //   setquestionss([...normal,...slicequestions])      
                          // }
                          // if (slicequestions) {
                            setquestionss([...normal])      
                          
             }             

        }catch (error) {
           console.log(error);
           
        }

      }
   

      //  questions  ianswered                     
      async function ianswered(){
        setactual("myanswers")
           const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
      const databases = new Databases(client);
      try {
        const myanswers = await databases.listDocuments(
          conf.appwritedatabaseid,conf.appwriteanswerid,[Query.equal("authid",authid)]
        )
        let empty = []; 
         let selectedanswers = []

              // console.log(myanswers.documents);
              let myanswerss = myanswers.documents.map((arr)=>{
              if (!empty.includes(arr.questionid)){
                empty.push(arr.questionid) 
                // console.log(arr,"arr");
                selectedanswers.push(arr)
              }   
            }
          )
          // console.log(myanswerss, "emp");
            setquestionss(selectedanswers)
            setreply("no")
            // console.log(selectedanswers, 'selected');
            
          return empty; 
          
        } 
        
        
        catch (error) {
          console.log(error);    
        }
      }
      // console.log(myanswerss);


      //  deleting session 

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

       function loginname() {
                let loginname = user  
                dispatch(sendloginname(loginname))
                navigate(`/Userprofile/${loginname}`);
              }



  return (   
     <div>

       {/* <div className="selectedquestion-section" style={selectquestionbox}>
          <i className="fa-solid fa-xmark" style={{float :"right", padding: "4px 4px"}} onClick={selectclose}></i>
          <div className="selectquestion-top">
          <h5 style={{fontFamily:"sans-serif",letterSpacing: "0.8px"}}>{getquestion}</h5>
          <textarea type="text"  placeholder='type your answer'rows='2'  value={answer} onChange={(e)=>setanswer(e.target.value)}></textarea>
          </div>  
          <div className="asnswerbutton">
          <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick= {savinganswer}>post</button>
          <div className="gettinganswers">
             {listanswers.length > 0 ? listanswers.map((answer)=>(
                <div className="every-answer" style={{lineHeight: "40px"}} key={answer.$id}>
                  <span style={{backgroundColor : "#0b57d0",padding: "2px 5px",borderRadius: '10px'}}>{answer.creator}</span>
                  <h6 style={{color : "white", fontWeight: "400", padding: "10px 10px",backgroundColor: "#515454",borderRadius: "10px"}}>{answer.answer}</h6>
                </div>
             )):<h6></h6>}
          </div>
          </div>
          </div> */}
       
       {/* <Header></Header> */}
      
      

<div className="contents-section">
    <div className="left" style={{color : "white"}}>
        <div className="list">
        
          {/* <h5 onClick={()=>setselectcategory("")}>Questions</h5> */}
          <h5 onClick={fetchingquestions}>Questions</h5>
          <h5 onClick={withauthquestions}>My Questions</h5>
          <h5 onClick={ianswered}>Answered Questions</h5>
         
        </div>
             </div>
    <div className="middle">
        <div className="questions">
          <div className="questions-top">
            <div className="question-topbox">
            <i className="fa-solid fa-star" id='icon-color' style={{fontSize : "13px",  padding: "4px"}}></i>
            </div>
            <div className="question-topcontent">
               <span style={{color : "black"}} >Questions for you</span>
            </div>
          </div> <hr />
          <div className="questions-content">
                    
                   <div className="listquestions-content">
                    
                  { questionss && questionss.length > 0?(questionss.map((question)=>(
                                
                      <>
                      
                    <div className="questions-asked" key={question.$id}>
                      <div className="question-top" style={{display : "flex",justifyContent : "space-between"}}>
                        {question.authid === authid ?(<h5 style={{color :"black",fontSize : "16.5px" ,fontWeight: "400"}}>{question.question}</h5>):(<h5 style={{color :"black",fontSize : "16.5px" ,fontWeight: "400"}}>{question.question}</h5>)}
                     {/* <h5 style={{color :"white",fontSize : "16.5px" ,fontWeight: "400"}}>{question.question}</h5> */}
                      {reply === "yes" ?( <button className='question-button' style={{border : '1px solid #7d63ed',color : "white", background : "#0b57d0"}} onClick={()=>zoomquestion(question.$id, question.question)} >View</button>):( <button className='question-button' style={{border : '1px solid #7d63ed', color : "white", background : "#0b57d0"}} onClick={()=>zoomquestion(question.questionid, question.question)} >View</button>)}
                     </div>
                     <div className="question-button" style={{display: "flex", justifyContent :"space-between",alignItems : "center"}}>
                        
                     <span style={{color :"#0b57d0", fontSize: '16.0px', fontWeight : "500"}}>  {question.creator}</span>
       {/* {reply === "yes" ?( <button className='question-button' style={{border : '1px solid #7d63ed',color : "white", background : "#0b57d0"}} onClick={()=>zoomquestion(question.$id, question.question)} >View</button>):( <button className='question-button' style={{border : '1px solid #7d63ed', color : "white", background : "#0b57d0"}} onClick={()=>zoomquestion(question.questionid, question.question)} >View</button>)} */}
            {/* <button className='question-button' style={{border : '1px solid #7d63ed'}} onClick={()=>zoomquestion(question.$id, question.question)} >View</button> */}
        
                    </div>
                    </div>  <hr style={ {margin : "0.3rem 0"}} />
                      </>
                ))):(<div><h3>No questions yet</h3></div>)}

                  {/* { questionlist?(questionlist.map((question)=>(
                      <>
                    <div className="questions-asked" key={question.$id}>
                      {question.authid === authid ?(<h5 style={{color :"white",fontSize : "16.5px" ,fontWeight: "400", backgroundColor : "#832222"}}>{question.question}</h5>):(<h5 style={{color :"white",fontSize : "16.5px" ,fontWeight: "400"}}>{question.question}</h5>)}
                   
                     <div className="question-button" style={{display: "flex", justifyContent :"space-between",alignItems : "center"}}>
                     <span style={{color :"white", fontSize: '16.0px', fontWeight : "500"}}> author : {question.creator}</span>
            <button className='question-button' style={{border : '1px solid #7d63ed'}} onClick={()=>zoomquestion(question.$id, question.question)} >View</button>
      
                    </div>
                    </div>  <hr />
                    
                      </>
                     
                ))):
                (<div><h5 style={{display : "flex", justifyContent :"center"}}></h5></div>)
                } */}
               {/* {selectcategory === "" ? (<span>more</span> ):(<></span> ) }   */}
 <span onClick={morebutton} style={{cursor : 'pointer'}} >more</span>        
                   </div>
                {/* )} */}
          </div>
        </div>
    </div>
    <div className="right">
        {/* <h4>Questions</h4> */}
        <h5 style={ {color : "black", fontSize :"17px"}} >{getquestion}</h5>
        
        <div className="gettinganswers">
                
             {listanswers.length > 0 ? listanswers.map((answer)=>(<>

                <div className="every-answer" style={{lineHeight: "25px"}}key={answer.$id} >
                  {/* <h6>{answer.question}</h6> */}
                  <span style={{padding: "2px 5px",borderRadius: '10px',fontSize : "14px", color : "#afffbc"}}>{answer.creator}</span>
                  <h6 style={{color : "white", fontWeight: "400", padding: "9px 8px",borderRadius: "10px", background : "#36373a", borderRadius : "0px 20px 20px 20px", fontSize : "14px"}}>{answer.answer}</h6>
                </div>  
             </>
                
             )) :<h6></h6>}
             <div className="reply-area" style={showreply}>
             <textarea type="text"  placeholder='type your answer'rows='2'  value={answer} onChange={(e)=>setanswer(e.target.value)} style={{marginTop : "5px", width : '100%', borderRadius : "10px", backgroundColor : "white", color : "black"}} ></textarea>
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px", }} onClick={savinganswer}>post</button>
          </div>
            
          </div>


    </div>
</div>
         {/* <button onClick={morebutton}>click</button>
         <p>{count}</p>
         <p>{arrays}</p> */}
    </div>
     
  )
}

export default Questions
