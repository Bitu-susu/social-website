import React, { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useSelector } from 'react-redux'
import { Client, Storage, ID } from 'appwrite'
import { Account, Databases, Query, } from 'appwrite'
import { Link } from 'react-router-dom';
import { sendusername } from '../../../redux/createslice';
// import authService from '../../../appwrite/auth';
import { useDispatch } from 'react-redux';

import conf from '../../../appwrite/conf';
import birendra from '../../../images/developers-4.png';
import './profile.css'
import authService from '../../../appwrite/auth'
function Profile() {
  // const dispatch = useDispatch();
   const [user, setuser] = useState("")
          const [authid, setauthid] = useState("")
   const[letter, setletter] = useState("")

  useEffect(()=>{                 
    async function fetchdata() {
      try {
        const getuser = await authService.getcurrentuser();
       setuser(getuser.name)
       setauthid(getuser.$id)
       const Firstletter = getuser.name.charAt(0)
       const uppercase = Firstletter.toUpperCase();
       console.log(uppercase, "yes the upper case");
       
       setletter(uppercase)

      }
      catch (error) {
        //  setuser("loading..",error)
        console.log(error)
      }}
      fetchdata()
  },[])   



  const [id, setid] = useState([])

  const name = useSelector((state) => state.sendingname.username);
  console.log(name, "yes the name");
  
  const firstletter = useSelector((state) => state.sendingname.firstletter)
  const username = useSelector((state) => state.sendingname.username)
  // console.log(firstletter);

  useEffect(() => {
    console.log("✅ Updated Name in Profile:", name);   
    // console.log("updated firstletter", firstletter);

    setid(name)
  }, [name, firstletter])



  //   getting the profile of the user  and the listings of documents
  const [posts, setposts] = useState([])
  const [postcreator, setpostcreator] = useState([])
  async function userdocuments() {
    const client = new Client()
      .setEndpoint(conf.appwriteurl)
      .setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
    try {
      const queries = [Query.equal("authid", id)]
      console.log("yes the id is ", id);
      
      

      const listuserdocuments = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritepostcollectionid, queries
      )
      console.log(listuserdocuments, "yes");
      setposts(listuserdocuments.documents)
      setpostcreator(listuserdocuments.documents[0].postcreator)
      //  console.log(postcreator, "here");

    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    if (id) {
      userdocuments()
    }
  }, [id])
  //  Likes increase section

  const [likes, setlikes] = useState(0)

  async function likesincrease(id) {
    const client = new Client()
      .setEndpoint(conf.appwriteurl)
      .setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
    try {
      setlikes(prevLikes =>
        prevLikes + 1
      );
      const result = await databases.updateDocument(
        conf.appwritedatabaseid, conf.appwritecollectionid, id, {
        "likes": likes + 1
      }
      );
      console.log(result.likes);
      setlikes(result.likes)
      // return result.likes
    }
    catch (error) {
      console.log(error);
    }
  }
  //  Adding comments


  const [addcomments, setaddcomments] = useState('')
  const [commentcreator, setcommentcreator] = useState("")
  const [getcomments, setgetcomments] = useState([])
  async function Addcomments(commentid,) {
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
        conf.appwritedatabaseid, conf.appwritecommentsid, ID.unique(), {
        "comments": addcomments,
        "postid": commentid,
        "name": creatorname,
        "date": date,


      }
      )
      setaddcomments("")
      // setgetcomments(comments)
      console.log("these are the comments", comments);
    } catch (error) {
      console.log("getting erro in adding comments", error);
    }
  }

  // adding profile pic
  const[profilepic, setprofilepic] = useState("")

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

  //   adding comment section 

  const [comments, setcomments] = useState({
    display: "none"
  })
  function addcomment() {    
    if (comments) {
      setcomments({
        display: "block"
      })
    }
    else if (!comments) {
      setcomments({
        display: "none"
      })
    }
  }
  //     fetching user comments 

  async function fetchcomments(id) {
    const client = new Client()
      .setEndpoint(conf.appwriteurl)
      .setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
    try {
      const fetchingcomments = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritecommentsid, [
        Query.equal("postid", id)
      ]
      )
      //  let reversingdocuments = fetchingcomments.documents.reverse()
      setgetcomments(fetchingcomments.documents)

      //  console.log("fetching comments", fetchingcomments.documents.length);


    } catch (error) {
      console.log("error in fetching comments", error);

    }
  }
  //   fro the education credentials section

  const [educationopen, seteducationopen] = useState(null)
  function educationcredentialopen() {
    seteducationopen({
      display: "block"
    })
  }
  function educationcredentialclose() {
    seteducationopen({
      display: "none"
    })
  }
  //   sending educational credentials to database 

  const [schoolingname, setschoolingname] = useState("")
  const [highereducation, sethighereducation] = useState("")
  const[schoolpassout, setschoolpassout] = useState("")
  const [gradutionpassout, setgradutionpassout] = useState("")

  async function createeducationcredentials(e) {
    e.preventDefault()
    try {
      const client = new Client()
        .setEndpoint(conf.appwriteurl)
        .setProject(conf.appwriteprojectid);
      const databases = new Databases(client);
      const addeducation = await databases.createDocument(
        conf.appwritedatabaseid, conf.appwriteeucationid, ID.unique(), {
        "schooling": schoolingname,
        "schoolpassout": schoolpassout,
        "highereducation": highereducation,
        "gradutionpassout": gradutionpassout,
        "authid": name
      })
      // console.log("added education", addeducation);

    } catch (error) {
      console.log(error);

    }
  }
  //   fetching the educational credentials of the user
  const [fetchingeducations, setfetchingeducations] = useState("")
  async function fetchingeducation() {
    try {
      const client = new Client()
        .setEndpoint(conf.appwriteurl)
        .setProject(conf.appwriteprojectid);
      const databases = new Databases(client);
      const educationdetails = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwriteeucationid, [
        Query.equal("authid", name)]
      )
      // console.log("education details", educationdetails.documents);
      setfetchingeducations(educationdetails.documents[0])
      // console.log("here is the fetching details", fetchingeducations);


    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    if (name) {
      fetchingeducation()
    }
  }, [])
  //   followings and followers section
    //  get current user
    const [currentusers, setcurrentusers] = useState("")
    const [currentname, setcurrentname] = useState("")
    async function currentuser() {
      try {
        const getuser = await authService.getcurrentuser();
        console.log(getuser);
        setcurrentusers(getuser.$id)
        setcurrentname(getuser.name)

      } catch (error) {
        console.log("error in getting user", error);
        
      }
    }
    useEffect(()=>{
      currentuser()

    },[])

     const[followers, setfollowers] = useState("")
     const [followinglist, setfollowinglist] = useState("")


    //    fetching followings
    async function  fetchingfollowings(id) {
      const client = new Client()
      .setEndpoint(conf.appwriteurl)
      .setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
    try {
      
      const getfollowings = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("giver", id)]    
      )
       console.log(getfollowings.documents);
       let followinglist  = getfollowings.documents
       let listmapping = followinglist.map((list) => list.reciever);
        console.log(listmapping.length);
        setfollowinglist(listmapping.length)
    } catch (error) {
         console.log("error in fetching followings", error);
         
    }
    }
    useEffect(()=>{
 
      fetchingfollowings(id)
      
   },[id])

        
   //   fetching followers 
   async function fetchingfollowers(id) {
    const client = new Client()
    .setEndpoint(conf.appwriteurl)
    .setProject(conf.appwriteprojectid);
  const databases = new Databases(client);
    try {
      const getfollowers = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever", id)]   
      )
      console.log(getfollowers.documents)  
          // setfollowerslist(getfollowers.documents) 
          let followerslist = getfollowers.documents
          let listmapping = followerslist.map((list) => list.giver);  
          console.log(listmapping.length);
          setfollowers(listmapping.length)


    } catch (error) {  
      console.log("fetching the followers", error);  
      
    }
  }
 useEffect(()=>{
 
    fetchingfollowers(id)
    
 },[increasefollowers,id])

          
  async function increasefollowers(data) {
    const client = new Client()
      .setEndpoint(conf.appwriteurl)
      .setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
          try {   
             const getfollowers = await databases.listDocuments(
              conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever", data)] 
            )
            console.log(getfollowers.documents)  
            // setfollowerslist(getfollowers.documents) 
            let followerslist = getfollowers.documents
            let listmapping = followerslist.map((list) => list.giver);
            console.log(listmapping.length); 
            // setfollowers(listmapping.length)
            
            if (listmapping.includes(currentusers)) {
             
              alert("you already follow this profile")  
            } 
            else{
              const addfollowers = await databases.createDocument( 
                conf.appwritedatabaseid, conf.appwritefollowersid,ID.unique(),{
                 "giver": currentusers,
                 "reciever": data,
                 "name":  currentname
                })
                console.log(addfollowers.length);
                // Manually update the state without refetching
                setfollowers((prev) => prev + 1); 
            } 
 
          } catch (error) {
              console.log(error, "error in fetching followers"); 
              
          }
  }



  //   copied from dashboard section
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
                                                                                
                                                                                                                                                                             //  For the comments section
                                                                                
                                                                                // const [comments, setcomments] = useState({
                                                                                //               display : "none"
                                                                                //          })
                                                                                //           function addcomment() {
                                                                                //            if (comments) {
                                                                                //              setcomments({
                                                                                //                display:"block",
                                                                                //                padding: "6px 2px"
                                                                                //               })
                                                                                //            }
                                                                                //            else if (!comments){
                                                                                //            setcomments({
                                                                                //                 display : "none"
                                                                                //              })
                                                                                //            }
                                                                                //            }
                                                                                
                                                                                                                                                                  



  return (
    <div>
      {/* <h5>{name}</h5>
      <h3>hello</h3> */}
      <div className="header" id='header'>
            <div className="headerleft">

        <i class="fa-solid fa-house" style={{fontSize: "18px"}}></i>
        <i class="fa-solid fa-users-line" style={{fontSize: "18px"}}></i>
        <i class="fa-solid fa-bell" style={{fontSize: "18px"}}></i>
        <i class="fa-solid fa-book-open-reader" style={{fontSize: "18px"}}></i>
        </div>
        <div className="headermiddle">
        <input type="text" name="" id="" style={{height: "35px"}} className='dashboard-input' placeholder="search your favorite querry"/>
        </div>
        <div className="headerright">
          {user?<h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}}>{letter}</h6>:<h6>..</h6>}
          {/* <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}} >{firstletter}</h6> */}
            {user?<h6 style={{color : "white"}}>{user}</h6>: <h6 style={{color : "white"}}>loading...</h6>}
            {/* <h6 style={{color : "white"}}>{user}</h6> */}
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}}>userprofile</button>
        </div>
        </div>

      <div className="profile-section">
        <div className="profile-left">
          <div className="profile-left-top">
            <div className="profile-left-top-image" style={{ backgroundImage: `url(${birendra})`}}>
            
            </div>
            <div className="profile-left-topcontent">
              <div className="profile-left-top1">
                <h3>{postcreator}</h3>
                <span onClick={()=>increasefollowers(id)}>Follow</span>
                {/* <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick={increasefollowers(id)}>userprofile</button> */}
              </div>
              <span>Add Profile credentials</span><br />
              <span>{followinglist} Followings</span> <br />
              <span>{followers} followers </span> <br />
              <span> 😊 Front end developer<br />
                Declare variables not wars <br />                                    
                ❤️Love coding, because it kills depression👌</span> 
              
            </div>
          </div>
          <div className="profile-left-posts-about">
            {/* <div className="posts-nav">
              <ul>
                <li>
                  <span>Posts</span>
                </li>
                <li>
                  <span>Questions</span>
                </li>
              </ul>
            </div> */}
          </div>

   
          <div className="everyposts-section">
            
            
 { 
                    posts.map((listings)=> (
                      <div className="Posts" style={{marginTop : "8px"}}>
                      <div className="every-post">
                      <div className="onlycontent">
                        <div className="post-heading" style={{lineHeight: "10px"}} >
                          <h5 style={{color : "white"}}>{listings.posttitle}</h5> 
                          <div className="incdate" style={{display: "flex", justifyContent: "space-between"}}> 
                          <span style={{fontWeight: "400", fontSize: "14px", color: "white",textDecoration : "underline"}}>{listings.postcategory ? "category - " + listings.postcategory :listings.postcategory} </span>
                          <span style={{fontWeight: "400", fontSize: "14px", color: "white",background:"#0b57d0", borderRadius:"20px", padding : "7px 7px"}} >{listings.Date}</span>
                          </div> 
                        </div>
                         {/* <div className="post-category">
                        
                         <span style={{fontWeight: "500"}} >category : {listings.postcategory}</span>

                         </div> */}
                        <div className="post-user" style={{display : "flex", justifyContent :"space-between", padding: "8px 0px",color : "#626161"}}>
                          <Link to="/profile"><h6 onClick={()=> reduxsend(listings.authid)} style={{color :"#626161", textDecoration: "underline",fontSize: "14px"}}>{listings.postcreator}</h6></Link>
                         
                          {/* <i class="fa-solid fa-circle-xmark" onClick={()=>postdeletion(listings.$id)} style={deletepost}></i> */}
                        </div>   
                      
                        <div className="post-content"> 
                       {gettingid === listings.$id ?(
                         <h6 style={{color: "white",fontWeight:"400",lineHeight:"24px" }}>{nottrimcontent}</h6>
                        ):( <h6 style={{color: "white",fontWeight:"400",lineHeight:"24px" }}>{listings.postcontent.slice(0,300)}</h6> )}
                        <h6 style={{cursor: "pointer", fontWeight : "300", color: "#0b57d0"}} onClick={()=>nottrim(listings.$id)}>{gettingid === listings.$id ?"" :"(... more⬇️)"}</h6>
                        
                        </div> 
                        </div>
                        <div className="post-image" style={{display: "flex", justifyContent:"center", backgroundColor : "#626161"}}>
                          <img src={listings.featuredimage} alt="image" style={{width:"80%"}} />
                      </div>
                      <div className="like-comment-section">
                         <div className="like-section">
                          {/* {listings.Like.includes(authid) ?  <i class="fa-regular fa-heart" style={{color : "red"}} ></i>: <i class="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)}></i>} */}
                          <i class="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)} style={{color:"white"}}></i>
                          <h6 style={{color : "white", fontSize : "13px"}}>Upvote</h6>
                        <div className="like-right" style={{color : "white"}}>
                        
  {increaselike.includes(listings.$id)
    ? listings.Like.length + 1 
    : listings.Like.length} 
 
                        </div>
                        </div> 
                        <div className="right-comment">
                        <i class="fa-regular fa-comment" style={{color : "white"}} onClick={addcomment}></i>
                      {/* <button style={{background: "none", color :"#414040"}} onClick={()=>fetchcomments(listings.$id)}>list comments</button> */}
                      <h6 style={{background: "none", color :"white", cursor : "pointer", fontWeight : "400"}} onClick={()=>fetchcomments(listings.$id)}>list comments</h6>     
                      
                         
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
              <i class="fa-solid fa-caret-right" style={{fontSize:"25px", color : "white"}} onClick={()=>Addcomments(listings.$id)}></i>
              </div>
              </div>
                    </div>


                            <div className="showing-comments">
                            {getcomments
    .filter((comment) => comment.postid === listings.$id) // Only show comments for this post
    .map((comment) => (
        //  <h6>{comment.length}</h6> 

      <div className="every-comment" style={{height: "100px",padding : "15px"}} key={comment.$id}>
        <div className="name-date" style={{display: "flex", justifyContent : "space-between"}}>
        <h6 style={{color : "white" }}>{comment.name}</h6>
        {/* <h6 style={{fontSize : "12px"}}>{comment.date}</h6> */}
        <span style={{fontWeight: "400", fontSize: "14px", color: "white",background:"#0b57d0", borderRadius:"20px", padding : "3px 7px"}} >{listings.Date}</span></div>
        <h6 style={{color: "white",fontWeight:"400"}}>{comment.comments}</h6><hr style={{color : "#686665"}} />
                    
      </div>
    ))}
    </div>
    </div>
       
            </div>
  
                ))}


          </div>
        </div>
        <div className="profile-right" style={{ width: "33%" }}>
          <div className="profile-right-top">
            <h5>
              Credentials & Highlights
            </h5>
            <i class="fa-solid fa-pen"></i>
          </div> <hr />
          <div className="profile-right-credentials">
            <div className="education-credentials">
              <h6 onClick={educationcredentialopen}> <i class="fa-solid fa-graduation-cap" style={{ color: "black" }}> </i> Add Education credentials</h6>
              <div className="education-credential-box" style={educationopen}>
                <form action="" className='education-form'>
                  <i class="fa-solid fa-circle-xmark" onClick={educationcredentialclose} style={{ float: "right" }}></i>
                  <div class="mb-3">
                    <label for="formGroupExampleInput" class="form-label">Add schooling name</label>
                    <input type="text" class="form-control" id="formGroupExampleInput" onChange={(e) => setschoolingname(e.target.value)} placeholder="school name" />
                  </div>
                  <div class="mb-3">
                    <label for="formGroupExampleInput2" class="form-label"> Higher education & Name</label>
                    <input type="text" class="form-control" id="formGroupExampleInput2" onChange={(e) => sethighereducation(e.target.value)} placeholder="Another input placeholder" />
                  </div>
                  <button type="submit" onClick={createeducationcredentials} className='btn btn-primary'>Add</button>
                </form>

              </div>
              <div className="education-response">
                {fetchingeducations ? (
                  <><span>{fetchingeducations.schooling}</span><br /><span>{fetchingeducations.highereducation}</span></>

                ) : (<span>no details added</span>)}
              </div>

            </div>
            <div className="employment-credentials">
              <h6> <i class="fa-solid fa-user" style={{ color: "black" }}></i> Add Employment credentials</h6>
              <div className="employment-credential-box" style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
                <form action="" className='employment-form'>
                  <i class="fa-solid fa-circle-xmark" style={{ float: "right" }}></i>
                  <div class="mb-3">
                    <label for="formGroupExampleInput" class="form-label">Add schooling name</label>
                    <input type="text" class="form-control" id="formGroupExampleInput" placeholder="school name" />
                  </div>
                  <div class="mb-3">
                    <label for="formGroupExampleInput2" class="form-label"> Higher education & Name</label>
                    <input type="text" class="form-control" id="formGroupExampleInput2" placeholder="Another input placeholder" />
                  </div>
                </form>
              </div>
            </div>

            <h6> <i class="fa-solid fa-location-dot" style={{ color: "black" }}></i>  Location </h6>

          </div>
        </div>
      


      </div>

    </div>
  );
}

export default Profile;
