  import React, { useEffect, useState, useRef,useMemo } from 'react'
  import Signup from '../login/signup/Signup'  
  import store from '../../../redux/Store'
  import { useSelector } from 'react-redux'
  import './Dashboard.css'
  import authService from '../../../appwrite/auth'
  import StorageService from '../../../appwrite/storage'
  import { Client,Storage,ID } from 'appwrite'
  import conf from '../../../appwrite/conf'
import { isRouteErrorResponse, Link, useNavigate } from 'react-router-dom'
import JoditEditor from 'jodit-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
// import database from '../../../appwrite/database'
import database from '../../../appwrite/database'
import {Account,Databases,Query } from 'appwrite'

import Home from '../home/Home'
import { useDispatch } from 'react-redux'
import { sendname } from '../../../redux/createslice'
// import { useSelector } from 'react-redux'
import {sendletter} from '../../../redux/createslice'
import { sendusername } from '../../../redux/createslice'
// import { Navigate } from 'react-router-dom'
import first from '../../../images/ai.jpg'
import second from '../../../images/ev.jpg'
import third from '../../../images/businessplan.jpg'

//  for the dashboard -1 section images 
import stock from '../../../images/stockmarket.jpg'
import business from '../../../images/businessplan.jpg'
import ev from '../../../images/ev.jpg'
import ai from '../../../images/ai.jpg'
import technology from '../../../images/technology.webp'
import politics from '../../../images/politics.jpg'


  function Dashboard() {
    const dispatch = useDispatch();
    
    const [user, setuser] = useState("")
    const[firstletter, setfirstletter] = useState("")
const navigate = useNavigate()
                                                              // for profile box section

    const[coverimage, setcoverimage] = useState("")

                                                           // for dashboard profile section
     
    const[profilebox, setprofilebox] = useState({
        display : "none"
    })

                                                                                                    //  for dashboard-1  postbox section
        const[postbox, setpostbox] = useState({
          display : "none"
        })

      function postboxopen() {
            if (postbox) {
               setpostbox({
                display :"block"
               })
            }
      }
      function postboxclose() {
        if (postbox) {
            setpostbox({
              display : "none"
            })
        }
      }

    // jodit react for text editor
    // const [contents, setcontents] = useState("")  
    
    function profilechange(e) {
      e.preventDefault()
      if (profilebox) {
              setprofilebox({
                display : "block"
              })
          }
      }
      function profileclose() {
         if (profilebox) {
             setprofilebox({
              display:" none"
            })
          }
        }
         const [authid, setauthid] = useState("")
      useEffect(()=>{
        async function fetchdata() {
          try {
            const getuser = await authService.getcurrentuser();
            // console.log(getuser)

           setuser(getuser.name)
           
         
           setauthid(getuser.$id)
           const firstletter = getuser.name.charAt(0)
           const uppercase = firstletter.toUpperCase();
           setfirstletter(uppercase)

          }
          catch (error) {
             setuser("error in getting user",error)
            // console.log(error)
          }}
          fetchdata()
      },[dispatch])
      
  
          async function logout() {
            try {
                 const userlogout = await authService.logout()
                 if (userlogout) {
                    navigate("/Signup")
                    console.log("your session deleted successfully",userlogout)
                  }
                  
                } catch (error) {
               console.log("error in deleting session", error);
               
            }
          }


          
                                           //  google chatbot api
          const[typo,settypo] = useState("")
          const[getresult, setresult] = useState("")
          async function get() {
            try {
               let apikey = "AIzaSyDLwhf_f1chzoIqW-LtUiMGEl8CAWILI7U";
               if (!apikey) {
                throw new Error("API key is not defined.");
            }
            const genAI = new GoogleGenerativeAI(apikey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
                const result = await model.generateContent(typo);
                setresult(result.response.text())
                // console.log((result.response.text()));
              } catch (error) {
                // console.error("Error:", error);
                setresult("error in generating response", error)
              }
            }
          
            
                                                                                        //  for database and document creation section 

       const [title, settitle] = useState("")
      const [category, setcategory] = useState("");
      const [content, setcontent] = useState("");
      const [fileurl, setfileurl] = useState("")
      const editor = useRef(null); 
      const[newcontent, setnewcontent] = useState("")
     
     

      // useEffect(()=>{createfile()},[])
                                                     //   create file
    
//  async function createfile() {
//   const client = new Client().setEndpoint(conf.appwriteurl)
//   .setProject(conf.appwriteprojectid);
 

// const storage = new Storage(client);
// try{
//          const result = await storage.createFile(
//         conf.appwritebucketid,ID.unique(),
//         document.getElementById('uploader').files[0], // file

//          );
                                                          
//          let fileid = result.$id;
//          console.log(result.$id);
         
//          let url = `https://cloud.appwrite.io/v1/storage/buckets/677eb5a00022f1981a75/files/${fileid}/view?project=677eb42f003e041a0476`;
//          setfileurl(url)
//          return url;
                                              
//         } catch (error) {
//           console.log(error);
          
//         }
//       }
    
                                                                                                       //  for likes and comments section 
      
const [likes, setlikes] = useState([])


      // async function submitpost(e) {
      //   e.preventDefault(); 
      //   try {
      //     const creatorname = await authService.getcurrentuser();
      //     let getcreator = creatorname.name
      //     // setcreator(getcreator)
      //     await new Promise(resolve => setTimeout(resolve, 0));
      //     const url = await createfile();
      //     console.log(url, "the url is here");
          
      //     const tempElement = document.createElement('div');
      // tempElement.innerHTML = content;
      // const postContent = tempElement.innerText;
    
      //     const client = new Client()
      //     .setEndpoint(conf.appwriteurl)
      //     .setProject(conf.appwriteprojectid);
      //     const databases = new Databases(client);
      //     const newdocument = await databases.createDocument(
      //       conf.appwritedatabaseid,conf.appwritecollectionid,ID.unique(),{ 
      //          "posttitle": title,
      //           "postcategory": category,
      //           "postcontent": postContent,
      //           "featuredimage": url,
      //           "creator":getcreator,
      //           "LIKE" : [],
      //           // "comments" : addcomments,
      //           "date": new Date().toDateString(),  
      //           "authid": authid,
      //           "test": "",
      //       }
      //     )
      //     console.log(newdocument);
          
      //   } catch (error) {
      //       console.log(error);
            
      //   }
      // }

//   for the uploading of the posts with less code 
   
async function submitpost(e) {
  e.preventDefault(); 
  const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);                                                   
    //   first with  uploading the image in the post
    const storage = new Storage(client);
    const databases = new Databases(client);
    try {
      const result = await storage.createFile( conf.appwritebucketid,ID.unique(),
        document.getElementById('uploader').files[0], // file
         );
        //  await new Promise(resolve => setTimeout(resolve, 0));
         const tempElement = document.createElement('div');
         tempElement.innerHTML = content;
         const postContent = tempElement.innerText;
         let url = `https://cloud.appwrite.io/v1/storage/buckets/677eb5a00022f1981a75/files/${result.$id}/view?project=677eb42f003e041a0476`;
          //  then uploading the post title, content, category etc in the database 
            const newdocument =  await databases.createDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,ID.unique(),{
              "posttitle" :title,
              "postcontent" :postContent,
              "featuredimage" :url,
              "postcategory":category,
              "Date" :  new Date().toDateString(),
              "authid" : authid,
              "postcreator" :user,
              'Like':[],

            })
           console.log(newdocument);
           
    } catch (error) {  
       console.log("error in creating post",error);
      
    }
    
}

                                                 //  for database list 
     const  [postings,setpostings] = useState([]) 
      // const [cuttinglist, setcuttinglist] = useState([])
      const [changecolor, setchangecolor] = useState("")
               
       useEffect(()=>{
         async function listdocument() {
            try {
               const listevery = await database.listdocuments()
               console.log(listevery);  

               let reversinglists = listevery.documents.reverse()
              setpostings(reversinglists)
              setchangecolor(reversinglists.Like)
               
               
            } catch(error) {
                 console.log("error in getting the documents", error); 
                 
            }
         }
         listdocument()    
       },[])

      //  for likes section
       
         const [increaselike, setincreaselike] = useState([])

      async function likesincrease(id) {
        const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);                                             
  
        // const storage = new Storage(client);
        const databases = new Databases(client);
        try {

              const getdocuments = await databases.getDocument(
                conf.appwritedatabaseid,conf.appwritepostcollectionid,id
              )
                let getdata = getdocuments.Like
                console.log(getdata);
                
          if (getdata.includes(authid)) {
               alert("you already like the post")
          }
          else{
            const updateddocument = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,id,{  
                    "Like" :[...getdata, authid]  
                  }  
                 ) 
                 console.log(updateddocument, "yes updated");
                  // setincreaselike(updateddocument.Like.length +1)
                  setincreaselike(prev => [...prev, id]);   
                 
          }
                  
        } catch (error) {
              console.log("error in updating likes", error);
              
        }
  
      }




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


        //   for the collection of user documents
                                                                                           //   for deleting posts 
          const[deletepost, setdeletepost]= useState({
            display : "none"
          })

      async function userdocument() {
        const client = new Client()
        .setEndpoint(conf.appwriteurl)
        .setProject(conf.appwriteprojectid);
        const databases = new Databases(client);
        try {
          const userdocuments = await databases.listDocuments(
            conf.appwritedatabaseid,conf.appwritepostcollectionid,[Query.equal("authid",authid)]
          )
          // console.log(userdocuments);
          let reversingdocuments = userdocuments.documents.reverse()
            setpostings(reversingdocuments)
            setdeletepost({
              display : "block"
            })
        } catch (error) {
            console.log(error);
        }
      }
                                                                                             //   for the deletion of user posts
              async function postdeletion(id) {
                const client = new Client()
                .setEndpoint(conf.appwriteurl)
                .setProject(conf.appwriteprojectid);
                const databases = new Databases(client);
                try {
                  if (confirm("are you sure to delete post")) {
                    const deletion = await databases.deleteDocument(
                      conf.appwritedatabaseid,conf.appwritecollectionid,id
                    )
                    console.log(deletion);
                    
                  }

                  
                }catch(error){
                   console.log(error);
                   
                  }
              }

                            //  for database ai lists
           async function AI() {
            try {
              const ai = await database.aidocuments()
              setpostings(ai.documents)
            } catch (error) {
               console.log(error);
               
            }
           }
           async function Business() {
            try {
              const business = await database.businessdocuments()
              setpostings(business.documents)
              console.log(business.documents)
            } catch (error) {
               console.log(error);
               
            }
           }

                                                                                                                //   for the comments section
            const [comments, setcomments] = useState({
                display : "none"
            })
             function addcomment() {
              if (comments) {
                setcomments({
                  display:"block"
                })
              }
              else if (!comments){
                setcomments({
                  display : "none"
                })
              }
             }
                                                           //  add comments
            //        const[addcomments, setaddcomments] = useState([])
            // async function addcomment(commentid) {
            //   const client = new Client()
            //  .setEndpoint(conf.appwriteurl)
            //  .setProject(conf.appwriteprojectid);
            //  const databases = new Databases(client);
            //  try {
            //        const result = await databases.updateDocument(
            //           conf.appwritedatabaseid, conf.appwritecollectionid,commentid, {
            //             "comments": [addcomments]})
            //              console.log(result)
                         
                        
                        
                   
            //   } catch (error) {
            //         console.log(error);
                    
            //   }
              
            // }

            const[addcomments, setaddcomments] = useState('')
            const[commentcreator, setcommentcreator]= useState("")
            const[getcomments, setgetcomments] = useState([])
             async function Addcomments(commentid, ) {
              const client = new Client()
               .setEndpoint(conf.appwriteurl)
               .setProject(conf.appwriteprojectid);
               const databases = new Databases(client);
              try {
                const getcreator = await authService.getcurrentuser();
               let creatorname = getcreator.name
                // console.log(getcreator.name);
                 let date = new Date().toString()
                setcommentcreator(getcreator.name)
                const comments = await databases.createDocument(
                  conf.appwritedatabaseid,conf.appwritecommentsid,ID.unique(),{
                   "comments" : addcomments,
                   "postid": commentid,
                   "name": creatorname,
                   "date": new Date().toDateString(),
                   
                  }
                )
                 setaddcomments("")
                // setgetcomments(comments)
                console.log( "these are the comments",comments);

              } catch (error) {
                 console.log("getting erro in adding comments", error);
                 
              }
             }     
                //  fetching post comments 
               async function fetchcomments(id) {
                const client = new Client()
               .setEndpoint(conf.appwriteurl)
               .setProject(conf.appwriteprojectid);
               const databases = new Databases(client);
                try {
                     const fetchingcomments = await databases.listDocuments(
                      conf.appwritedatabaseid,conf.appwritecommentsid,[
                        Query.equal("postid",id)
                      ]
                     )
                    //  let reversingdocuments = fetchingcomments.documents.reverse()
                     setgetcomments(fetchingcomments.documents)

                    //  console.log("fetching comments", fetchingcomments.documents.length);
                        
                     
                } catch (error) {
                    console.log("error in fetching comments", error);
                    
                }
               }
                                                                                                              //       profile pic section    
                    

            const[profilepic, setprofilepic] = useState("")
                //   upload profile pic
             async function uploadphoto() {
              const client = new Client().setEndpoint(conf.appwriteurl)
              .setProject(conf.appwriteprojectid);
              const storage = new Storage(client);
              const databases = new Databases(client);
              try {
                const fileInput = document.getElementById('profileupload');
                const profile = await storage.createFile(conf.appwriteprofileid,ID.unique(),fileInput.files[0]
                            );
                            console.log(profile.$id)
                            let profileid = profile.$id
                            let picurl =`https://cloud.appwrite.io/v1/storage/buckets/67af2d5d0023c5596848/files/${profileid}/view?project=677eb42f003e041a0476`
                  const createfiledb = await databases.createDocument(
                    conf.appwritedatabaseid,conf.appwriteprofiledb,ID.unique(),{
                    "profilepic" : profileid,
                    "authid" : authid,
                    "picurl": picurl
                    }
                  )
                  console.log(createfiledb);
              } catch (error) {
                  console.log(error);
                  
              }
             }
             async function getprofilepic() {
               const client = new Client().setEndpoint(conf.appwriteurl)
                  .setProject(conf.appwriteprojectid);
                  const storage = new Storage(client);
                  const databases = new Databases(client);
                  try {
                         const getprofilepic = await databases.listDocuments(
                            conf.appwritedatabaseid,conf.appwriteprofiledb,[
                             Query.equal("authid", authid)
                        ] )
                        
                        let profileurl = getprofilepic.documents.reverse()
                           
                         setprofilepic(profileurl[0].picurl)
                  } catch (error) {
                    console.log(error);
                    
                  }
                }
                useEffect(()=>{
                  getprofilepic()
               },[uploadphoto, getprofilepic])
                  
                                                                                                  //  for the section of ai bot
                  
                     const[aibot, setaibot] = useState({
                         display : "none"
                     })
                   function chatbotopen() {
                    if (aibot) {
                      setaibot({
                         display  :"block"
                      })
                    }
                   
                   }
                   function chatbotclose() {
                    setaibot({
                      display  :"none"
                   })
                   }
                                                                                               // username sending using redux
                   function reduxsend(data) {
                     dispatch(sendusername(data));
                    dispatch(sendletter(firstletter)) 
                  }
                  useEffect(()=>{
                    reduxsend()
                  },[])

                  const [trim,settrim] = useState("")
                   return ( 
             <>
    <div className="createpost-section" style={{padding : "10px 67px", background: "#f4f2ee"}}>
    <div className="posting" style={postbox}> 
    <i className="fa-solid fa-circle-xmark" onClick={postboxclose}  style={{color: "black",
    position: "absolute", right : "0px",  
    background: "white",zIndex:"4"}} ></i>
    <div className="postingsections">
      <div className="posting-left" > 
    <div className="posting-top">
    <i className="fa-solid fa-globe" style={{color:"wheat"}}></i>
    <h6 style={{color:"white"}}>Everyone</h6>
    <i className="fa-solid fa-angle-down" style={{color:"white"}}></i>
    </div>
    <div className="postuserdetails">
         <p className='username'>{firstletter}</p>
         <h6>{user}</h6>
         </div>
         
         <form action="" className='postform'>
          <div className="post-form-top">
  <input type="text" name="" id="" required ="true" value={title} onChange={(e)=>settitle(e.target.value)} placeholder='post content' style={{width :"70%", height:"40px"}}/>
  <select name="" id="" required = "true" value={category} onChange={(e)=>setcategory(e.target.value)}>
    <option value="">Select post category</option>
    <option value="AI">AI</option>
    <option value="Finance">Finance</option>                        
    <option value="Science">Science</option>
    <option value="EV">EV</option>
    <option value="Technology">Technology</option>
    <option value="Politics">Politics</option>
    <option value="Stock Market">Stock market</option>
    <option value="Business">Business</option>
    <option value="Others">Others</option>
  </select>
  
  </div>
  <JoditEditor 
        ref={editor}
        value={content}
        onChange={setcontent}
   
         />
         <div className="post-form-image" style={{marginTop : "10px"}}>
         <label htmlFor="" style={{color : "white"}}>Cover image</label>
         <input type="file" name="" id="uploader" style={{color : "white"}}  required = "true"/>
         </div>
         <div className="popularreadings">
          <button className='post-submit' style={{backgroundColor : "#65539e"}} onClick={submitpost}>Submit</button>
         </div>
         </form>
    </div>
    
 </div>
 </div>
        <div className="dashboardcontainer">
          <div className="dashboard-1">
            {/* <div className="dashboard-1-section">
           
         <div className="popularreadings">
          <h5> Trending popular readings</h5> <hr style={{zIndex:"1", position:"relative"}} />
          <button className='createprofile' onClick={AI}>AI & ML</button>
         </div>
         <div className="popularreadings">
          
          <button className='createprofile' onClick={Business}>Business</button>
         </div>
         <div className="popularreadings">
          
          <button className='createprofile'>science</button>
         </div>
         <div className="popularreadings">
          
          <button className='createprofile'>Technology</button>
         </div>
         <div className="popularreadings">
         
          <button className='createprofile'>Culture</button>
         </div>
         <div className="popularreadings">
          
          <button className='createprofile'>EV</button>
         </div>
         <div className="popularreadings">
          
          <button className='createprofile'>Politics</button>
         </div>
         <div className="popularreadings">
          
          <button className='createprofile'>Stock market</button>
         </div>
         <div className="popularreadings">
          <h5> Access All</h5> <hr style={{zIndex:"1", position:"relative"}} />
          
         </div>
         </div> */}
          <div className="dash-1-boxsection">
              <h4>Mostly search</h4>
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
         </div>
         
        <div className="dash-1-votingsection">
          <div className="dash-1-voting-heading">
            <h6 style={{marginLeft : "7px", color: "white"}}>Vote on trending topics</h6>
            {/* <span>vote</span> */}
          </div>
       <div className="dash-1-voting">
        {postings.map((listings)=>(
          <>
          <div className="just-2">
             <h6 style={{color : "black", fontWeight: "400"}}>{listings.posttitle} <span>(100 votes)</span> </h6>
             <span style={{cursor: "pointer", textDecoration : "underline"}} > vote</span>
             </div>
             </>
        )).slice(0,10)}
       </div>
        </div>


          </div>
          <div className="dashboard-2">
             <div className="dashboard-2-imagesection">
                <img src={profilepic} alt="Cover" width={"100%"} height={"100%"} />
             </div>
            <div className="dashboard-2-top">
              <div className="message-section">
              <p className='username'>{firstletter}</p>
              <input type="text" name="" id="" className='dashboard-input' placeholder="search your favorite querry"/>
              </div>
              <div className="dashboard-2-buttonsection">
                <button className='postbutton' onClick={postboxopen}>Post</button>
                <button className='postbutton'>Ask</button>
              </div>
              </div>
              <div className="everyposts-section">
                    { postings ? 
                       (postings.map((listings)=> (
                      <div className="Posts">
                      <div className="every-post">
                      <div className="onlycontent">
                        <div className="post-heading" style={{lineHeight: "10px"}} >
                          <h5>{listings.posttitle}</h5> 
                          <div className="incdate" style={{display: "flex", justifyContent: "space-between"}}> 
                          <span style={{fontWeight: "400", fontSize: "14px"}}>{listings.postcategory ? "category - " + listings.postcategory :listings.postcategory} </span>
                          <span style={{fontWeight: "400", fontSize: "14px", color: "blue"}} >{listings.Date}</span>
                          </div> 
                        </div>
                         {/* <div className="post-category">
                        
                         <span style={{fontWeight: "500"}} >category : {listings.postcategory}</span>

                         </div> */}
                        <div className="post-user" style={{display : "flex", justifyContent :"space-between", padding: "8px 0px"}}>
                          <Link to="/profile"><h6 onClick={()=> reduxsend(listings.authid)}>{listings.creator}</h6></Link>
                         
                          <i class="fa-solid fa-circle-xmark" onClick={()=>postdeletion(listings.$id)} style={deletepost}></i>
                        </div>   
                      
                        <div className="post-content">   

                       {/* <h6>{trim ? listings.postcontent: listings.postcontent.slice(0,300)} <span onClick={()=>settrim({zIndex: "4"})} >{trim? "": "....more ⬇️"}</span> </h6> */}
                       {gettingid === listings.$id ?(
                         <h6 style={{color: "#66666a",fontWeight:"400",lineHeight:"24px" }}>{nottrimcontent}</h6>
                        ):( <h6 style={{color: "#66666a",fontWeight:"400",lineHeight:"24px" }}>{listings.postcontent.slice(0,300)}</h6> )}
                        <h6 style={{cursor: "pointer"}} onClick={()=>nottrim(listings.$id)}>{gettingid === listings.$id ?"" :"... more⬇️"}</h6>
                         
                        </div> 
                        </div>
                        <div className="post-image" style={{display: "flex", justifyContent:"center"}}>
                          <img src={listings.featuredimage} alt="image" style={{width:"80%"}} />
                      </div>
                      <div className="like-comment-section">
                         <div className="like-section">
                          {/* {listings.Like.includes(authid) ?  <i class="fa-regular fa-heart" style={{color : "red"}} ></i>: <i class="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)}></i>} */}
                          <i class="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)}></i>
                        <div className="like-right">
                        
  {increaselike.includes(listings.$id)
    ? listings.Like.length + 1 
    : listings.Like.length} 

                        </div>
                        </div> 
                        <div className="right-comment">
                        <i class="fa-regular fa-comment" onClick={addcomment}></i>
                      {/* <button style={{background: "none", color :"#414040"}} onClick={()=>fetchcomments(listings.$id)}>list comments</button> */}
                      <p style={{background: "none", color :"#414040"}} onClick={()=>fetchcomments(listings.$id)}>list comments</p>     
                      
                         
                        </div>
                      </div>
                      <div className="comments" style={comments}>
                      <div className="message-section">
              <p className='username'>{firstletter}</p>
              <input type="text" name="" id="" className='dashboard-input' placeholder='Add comments' value={addcomments} onChange={(e)=>setaddcomments(e.target.value)} />
              <div className="comments-right">
              <i class="fa-solid fa-caret-right" style={{fontSize:"25px"}} onClick={()=>Addcomments(listings.$id)}></i>
              </div>
              </div>
                </div>
                            <div className="showing-comments">
                            {getcomments
    .filter((comment) => comment.postid === listings.$id) // Only show comments for this post
    .map((comment) => (
        //  <h6>{comment.length}</h6> 

      <div className="every-comment" style={{height: "100px",padding : "15px"}} key={comment.$id}>
        <h6 style={{color : "white" }}>{comment.name}</h6>
        <h6 style={{fontSize : "12px"}}>{comment.date}</h6>
        <h6 style={{color: "white"}}>{comment.comments}</h6><hr style={{color : "#686665"}} />
                    
      </div>
    ))}
    </div>
    </div>
       
            </div>
  
                ))) : (<h1> Loading....</h1>)}
                    </div>
              </div>
             
          
          <div className="dashboard-3">
              
            <div className="dashboard-3-section">
              <div className="dash-board-3-top">
            <div className="userdetails-top">
          <div className="userdetails">
         <p className='username'>{firstletter}</p>
         <p>{user}</p>
         <div className="addprofile">
          <button className='createprofile' onClick={profilechange}>Profile &nbsp; +</button>
          </div>
         </div>
         {/* <div className="addprofile">
          <button className='createprofile' onClick={logout}>Logout</button>
        
          </div> */}
         
         </div>
         <div className="uploadprofile">
          <div className="profile-box" style={profilebox}>

          <i class="fa-solid fa-circle-xmark" onClick={profileclose} style={{color: "#000000",
    position: "absolute", right : "0px",
    background: "#ffffff",zIndex:"4"}} ></i>
    <div className="upload-dp">
      <p>Upload the cover photo</p>
      <div className="dp-image" style={{display : "flex"}}>
      <input type="file" style={{width : "70%"}} name="" id="profileupload"/>
      <button  onClick={uploadphoto}>Select</button></div>
    </div>
    <div className="after-dp">
       <h6  onClick={userdocument} className='dp-text'> <i class="fa-regular fa-user"></i> Access your profile</h6>
       <h6 className='dp-text'> <i class="fa-regular fa-message"></i> send message</h6>
       <h6  className='dp-text' > <i class="fa-regular fa-bookmark"></i> Bookmarks</h6>
       <h6 className='dp-text'> <i class="fa-regular fa-file-lines"></i> Drafts</h6>
       <h6 className='dp-text' onClick={logout}>Logout</h6>
    </div>
          </div>
         </div>
         <div className="dash-3-topnews">
            <div className="topnews-heading">
              <h4>Most popular</h4>
            </div>
 <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
  <div className="carousel-inner">
  {postings.length > 0 && (
    <>
    <div className="carousel-item active">
      <img src={postings[0].featuredimage}  className="d-block w-100" alt="first"/> 
      <div className="contents" style={{padding: "14px 0px 0px 0px"}}>
        <h6 style={{color : "black"}}>{postings[0].posttitle}</h6>
        <span>{postings[0].date}</span>
        <h6>{postings[0].creator}</h6>
      </div>
    </div>
    <div className="carousel-item">
    <img src={postings[1].featuredimage}  className="d-block w-100" alt="first"/> 
      <div className="contents" style={{padding: "14px 0px 0px 0px"}}>
        <h6 style={{color : "black"}}>{postings[1].posttitle}</h6>
        <span>{postings[1].date}</span>
        <h6>{postings[1].creator}</h6>
      </div>
    </div>
    <div className="carousel-item">
    <img src={postings[2].featuredimage}  className="d-block w-100" alt="first"/> 
      <div className="contents" style={{padding: "14px 0px 0px 0px"}}>
        <h6 style={{color : "black"}}>{postings[2].posttitle}</h6>
        <span>{postings[2].date}</span>
        <h6>{postings[2].creator}</h6>
      </div>
    </div>
    <div className="carousel-item">
    <img src={postings[3].featuredimage}  className="d-block w-100" alt="first"/> 
      <div className="contents" style={{padding: "14px 0px 0px 0px"}}>
        <h6 style={{color : "black"}}>{postings[3].posttitle}</h6>
        <span>{postings[3].date}</span>
        <h6>{postings[3].creator}</h6>
      </div>
    </div>
    </>
    )}
  </div>
</div> 




         </div>
         </div>
           <div className="dash-board-3-bottom">
         <div className="ai-contentsection" style={aibot}>
          <p style={{fontSize : "14px", textAlign : "center", }}>please make content short <br />😊</p>
          <textarea style={{width: "100%",height: "400px", border: "none",backgroundColor: "#3f3d3d" }} value={getresult} name="" id="" placeholder=''></textarea>
          <div className="ai-content">
            <p style={{fontSize : "14px", textAlign : "center"}}>What can i help with?</p>
            <div className="ai-input">
              <input type="text" name="" id="" value={typo} onChange={(e)=>settypo(e.target.value)}  style={{height: "30px", width : "80%", height: "37px",
    border: "none",
    borderRadius: "10px"}} placeholder="Type..." />
              <i class="fa-solid fa-caret-right" style={{fontSize : "30px"}} onClick={get}></i>
            </div>
          </div>
         </div>
         <div className="bottomdash">
          <div className="dash-3-bottom">
            <div className="dash-3-section">
              <h6 style={{color : "white", fontWeight : "400"}}>Geneate AI Content</h6>
              
              <div className="dash-3-icons">
              <i class="fa-solid fa-circle-dot"></i>
              <i class="fa-solid fa-caret-up" onClick={chatbotopen}></i>
              <i class="fa-solid fa-caret-down" onClick={chatbotclose}></i>
              </div>
              </div>
              </div>
              </div>
              </div>
          </div>
          
        </div>
          </div>
              </div>
       
      </>
    )
  }
  
  export default Dashboard
  