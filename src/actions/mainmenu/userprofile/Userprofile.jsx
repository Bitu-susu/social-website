import React, { useCallback } from 'react'
import { useEffect, useState, useRef } from 'react'
import authService from '../../../appwrite/auth'
import { Client, Storage, ID } from 'appwrite'
import { Account, Databases, Query, } from 'appwrite'
import { Link } from 'react-router-dom';
import { sendusername } from '../../../redux/createslice';
import { useDispatch } from 'react-redux';
import conf from '../../../appwrite/conf';
import birendra from '../../../images/developers-4.png';
import msd from '../../../images/msd.webp'
import './Userprofile.css'
import database from '../../../appwrite/database'
import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from 'react-router-dom'  
import { useMutation, useQueryClient } from "@tanstack/react-query";
import JoditEditor from 'jodit-react';
//   importing custom hooks
import useProfile from '../Customs/Increase/userprofile'
import { databases } from '../Customs/Increase/appwritesdk'
import { storage } from '../Customs/Increase/appwritesdk'
import {likesincrease,likesdecrease} from '../Customs/Increase/increaselikes'
// import authService from '../../../appwrite/auth'
import useFetchall from '../Customs/Increase/userpostsallfetchs'
import Header from '../Customs/Increase/header/Header'
import useComments from '../Customs/Increase/comments'

import usePosts from '../Customs/Increase/posts' 
 

     
// }
      //   getting current user 

 const currentuser = async()=>{
       const getuser = await authService.getcurrentuser();
       return getuser;
     }

function Userprofile() {
   const queryClient = useQueryClient();
  // open profile credential box

  const[profileopen, setprofileopen] = useState({})
  const [lowopacity, setlowopacity] = useState({})

  const[editboxopen, seteditboxopen] = useState({})
  const [editboxlowopacity, seteditboxlowopacity] = useState({})

  function profileboxopen() {
    setprofileopen({
      display : "block",
    })
    setlowopacity({opacity: "0.2"})   
  }
  function profileboxclose() {
    setprofileopen({
      display : "none",
    })
    setlowopacity({opacity: "1"})
  }
  function Editboxopen() {
   seteditboxopen ({
      display : "block",
    })
   setlowopacity({opacity: "0.2"})
  }
  function Editboxboxclose() {
    seteditboxopen ({
      display : "none",
    })
   setlowopacity({opacity: "1"})
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
 


  //  fetching posts of the authuser , with react query

   const userdocuments =async()=>{

      const queries = [Query.equal("authid", authid)]
      const listuserdocuments = await databases.listDocuments(
      conf.appwritedatabaseid, conf.appwritepostcollectionid, queries 
      );
         return listuserdocuments.documents.reverse()
   }

   const{data : postdocuments, isLoading : postdocumentsloading, error :postdocumentserror} = useQuery({
    queryKey :["documents", authid],
    queryFn : userdocuments,
    staleTime :  5 * 60 * 1000,
   })

    //  delete post
       let {deletepost} = usePosts()
     
        const deleteposts = useMutation({
          mutationFn : deletepost,
          onSuccess : ()=>{
            queryClient.invalidateQueries({ queryKey: ["documents", authid]});
          }
        })

   //  for the post contents 
   const [nottrimcontent, setnottrimcontent] = useState("")
  const[gettingid, setgettingid] = useState("")
 async function nottrim(id) {
  try {
    const nottrimcontent = await databases.listDocuments(
      conf.appwritedatabaseid,conf.appwritepostcollectionid,[Query.equal("$id", id)] 
      )
    //  console.log(nottrimcontent);  
       setnottrimcontent(nottrimcontent.documents[0].postcontent)
       setgettingid(nottrimcontent.documents[0].$id)
      } catch (error) {
      console.log("error in nottrim",  error);
     
  }
    }


//    likes increase section copy from newdash 

    const[likecolor, setlikecolor] = useState()                                                                                    
       
          const [increaselike, setincreaselike] = useState([])
     
              const likeMutation = useMutation({
            mutationFn: likesincrease,
          
            onSuccess: () => {
              // 🔥 THIS triggers posts API again
              queryClient.invalidateQueries({ queryKey: ["documentss", authid] });
            },
          }); 

         
   
 const decreaselikeMutation = useMutation({
  mutationFn: likesdecrease,

  onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["documentss",authid]});
  },
}); 

    //  fetching followings using react querry 
   
      const fetchingfollowings = async(id)=>{
       const getfollowings = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("giver", id)]    
      )
      let followinglist  = getfollowings.documents
       let listmapping = followinglist.map((list) => list.reciever);
       return listmapping.length
      }  

         const {data :fetchfollowings, isLoading :followingsloading, error : followingserror} = useQuery({
               queryKey:["followings", authid],
               queryFn : ()=> fetchingfollowings(authid),
              
               staleTime :  5 * 60 * 1000,
            }) 

 
//  fetching follwers with react query

 const fetchingfollowers =async(authid)=>{
      const getfollowers = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever", authid)])
        let followerslist = getfollowers.documents
          let listmapping = followerslist.map((list) => list.giver);
          return listmapping.length
 }
   
 const {data :fetchfollowers, isLoading :followersloading, error : followerserror} = useQuery({
               queryKey:["followers", authid],
               queryFn : ()=> fetchingfollowers(authid),
               staleTime :  5 * 60 * 1000,
            }) 



//  initially  check whether the current user follow the profile , by which we organize the button 
   

    //      profile credentials section  , importing from profile.js section
  

       const {personal, proffesion, credentials1, credentials2, dp,credentials,yesedit,setproffesion, setpersonal, setcredentials, setcredentials1, setcredentials2, setdp, setyesedit, editcredentials, Profilecredential,fetchprofilecredentials} = useProfile()
         
       const[loading, setloading] = useState(true)
      
      const {data :profilecredentials} = useQuery({
        
            queryKey:["credentials",authid],
            queryFn :()=>fetchprofilecredentials(authid),
            staleTime :  5 * 60 * 1000,
         }) 
         useEffect(() => {
  if (profilecredentials) {
    setcredentials(profilecredentials);
    setcredentials1(profilecredentials?.profession || "");
    setcredentials2(profilecredentials?.personal || "");
    setdp(profilecredentials?.picurl || null);
    setloading(false)

  }
}, [profilecredentials]);
                                         
//  mutating the profile credentials

const editmutation = useMutation({
 mutationFn : editcredentials,
 onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["credentials",authid]});
  },
})
   

  const [addcomments, setaddcomments] = useState('')
  const [commentcreator, setcommentcreator] = useState("")
  const [getcomments, setgetcomments] = useState([])


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
    queryClient.invalidateQueries({ queryKey: ["displaycomments",selectcomment]}); 
      queryClient.invalidateQueries({ queryKey: ["realcommentss"]}); 

    setaddcomments("")
  },
}); 


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


  // async function Addcomments(commentid,) {
  //   const client = new Client()
  //     .setEndpoint(conf.appwriteurl)
  //     .setProject(conf.appwriteprojectid);
  //   const databases = new Databases(client);
  //   try {
  //     const getcreator = await authService.getcurrentuser();   
  //     let creatorname = getcreator.name
  //     // console.log(getcreator.name);
  //     let date = new Date().toString()
  //     setcommentcreator(getcreator.name)
  //     const comments = await databases.createDocument(
  //       conf.appwritedatabaseid, conf.appwritecommentsid, ID.unique(), {
  //       "comments": addcomments,
  //       "postid": commentid,
  //       "name": creatorname,
  //       "date": date

  //     }
  //     )
  //     setaddcomments("")
  //     // setgetcomments(comments)
  //     // console.log("these are the comments", comments);
  //   } catch (error) {
  //     console.log("getting error in adding comments", error);
  //   }
  // }

  //   adding commeent section 

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

  // async function fetchcomments(id) {
  //   const client = new Client()
  //     .setEndpoint(conf.appwriteurl)
  //     .setProject(conf.appwriteprojectid);
  //   const databases = new Databases(client);
  //   try {
  //     const fetchingcomments = await databases.listDocuments(
  //       conf.appwritedatabaseid, conf.appwritecommentsid, [
  //       Query.equal("postid", id)
  //     ]
  //     )
  //     //  let reversingdocuments = fetchingcomments.documents.reverse()
  //     setgetcomments(fetchingcomments.documents)

  //     //  console.log("fetching comments", fetchingcomments.documents.length);


  //   } catch (error) {
  //     console.log("error in fetching comments", error);

  //   }
  // }

  //   profile left 
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

 

  const {schoolingname, setschoolingname, highereducation, sethighereducation,schoolpassout, setschoolpassout,gradutionpassout, setgradutionpassout,createeducationcredentials,fetchingeducation, edit1,edit2,edit3,edit4,
 setedit1, setedit2, setedit3, setedit4,editeducationcredentials} = useFetchall()

    const {data :educationcredentials} = useQuery({
        
            queryKey:["education",authid],
            queryFn :()=>fetchingeducation(authid),
            staleTime :  5 * 60 * 1000,
         })
  useEffect(() => {
  if (educationcredentials) {
   setedit1(educationcredentials?.schooling || "")
   setedit2(educationcredentials?.schoolpassout || "")
   setedit3(educationcredentials?.highereducation || "")
   setedit4(educationcredentials?.gradutionpassout || "")

  }
}, [educationcredentials]);

  // 
    
  const editeducation = useMutation({
 mutationFn : editeducationcredentials,
 onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["education",authid]});
  },
})
   


   //   sending employment credentials to database 

  //  const [employment, setemployment] = useState("")
  //  const [experience, setexperience] = useState("")
   const [employmentclose, setemploymentclose] = useState({})
   
  function Employmentclose() {
    setemploymentclose({
      display: "none"
    })
  }
  function Employmentopen() {
    setemploymentclose({
      display: "block"
    })
  }
  
   //   fetching the employment credentials of the user
  // const [fetchingemployment, setfetchingemployment] = useState({})

 const {Fetchingemployment,createemploymentcredentials,editemploymentcredentials, employment, experience, emp1,emp2,setemployment,setexperience,setemp1,setemp2} = useFetchall()


  const {data :employmentcredentials} = useQuery({
          
            queryKey:["employment",authid],
            queryFn :()=>Fetchingemployment(authid),
            staleTime :  5 * 60 * 1000,
         })

     useEffect(() => {
  if (employmentcredentials) {
   setemp1(employmentcredentials?.employment || "")
   setemp2(employmentcredentials?.experiance || "")
  }
}, [employmentcredentials]);

const createemploy = useMutation({
 mutationFn : createemploymentcredentials, 
 onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["employment",authid]});
  },
})

 const editemploy = useMutation({
 mutationFn :  editemploymentcredentials,
 onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["employment",authid]});
  },
})

    //   sending location credentials to database 

      const{location, setlocation, location1, setlocation1,createlocationcredentials,Fetchinglocation,editlocationcredentials} = useFetchall()   

    // const [location, setlocation] = useState("")
   
    const [locationclose, setlocationclose] = useState({})
    
   function Locationclose() {
     setlocationclose({
       display: "none"
     })
   }

   function Locationopen() {
     setlocationclose({
       display: "block"
     })
   }
  
     const {data :locationcredentials} = useQuery({
          
            queryKey:["location",authid],
            queryFn :()=>Fetchinglocation(authid),
            staleTime :  5 * 60 * 1000,
         })
         useEffect(()=>{
          setlocation1(locationcredentials?.address || "")
         },[locationcredentials])

         const createlocation = useMutation({
 mutationFn : createlocationcredentials, 
 onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["location",authid]});
  },
})

 const editlocation = useMutation({
 mutationFn :  editlocationcredentials,
 onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["location",authid]});
  },
})


             // adding profile pic
 const[profilepic, setprofilepic] = useState("")

//   posting comes from new dash

  const [title, settitle] = useState("")
          const [category, setcategory] = useState("");
          const [content, setcontent] = useState("");
           const[postdisplay, setpostdisplay] = useState({})
           const editor = useRef(null);
function opacitychanger() {
                      setlowopacity({opacity : "0.1"})
                      setpostdisplay({display : "block"})
                 }

                 function postboxclose() {
                    setlowopacity({opacity : "1.0"})
                    setpostdisplay({display : "none"})
                }
 function addingposts(e){
    e.preventDefault(); 
     postMutation.mutate({title, category, authid, user, content})
    }
        const {submitpost, submit, submitshown} = usePosts()
        const postMutation = useMutation({
  mutationFn: submitpost,
        
  onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({ queryKey: ["documents"]});
  },
}); 


//   comments section 


  return (
    <div>

       
      <div className="profilecredential"style={profileopen}>
        <div className="profilebox">
        <i className="fa-solid fa-circle-xmark"   style={{color: "white",position: "absolute", right : "0px",zIndex:"4"}} onClick={profileboxclose}></i>
        <div className="profile-box-content">
              <h5>Add credentials</h5>
              <p style={{fontSize : "15px"}}>Credentials add credibility to your content</p>
              <form action="" onSubmit={Profilecredential}>
              <input type="text" name="" id="" required ={true} placeholder='Add professional bio' style={{width :"100%", height:"40px", border: "2px solid #0b57d0", background : '#363434'}} onChange={(e)=>setproffesion(e.target.value)} value={proffesion}/>
              <textarea name="" id="" style={{width : "100%", height : "154px", border: "1px solid white", background : '#363434', marginTop: "10px"}} placeholder='Add personal bio' onChange={(e)=>setpersonal(e.target.value)}value={personal} ></textarea>
              <p style={{fontSize : "15px"}}>Upload profile image</p>
              <div>
              <input type="file" name="" id="profileupload" placeholder='coverimage' />
              {/* <button  style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick={uploadphoto}>Select</button> */}
              </div>
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} type='submit'>save</button>
              {/* <i class="fa-solid fa-chevron-right" style={{display: "flex", justifyContent: "right"}} ></i> */}
              </form> 
              </div>
        </div>
      </div>
      <div className="profilecredential"style={editboxopen}>
        <div className="profilebox">
        <i className="fa-solid fa-circle-xmark" style={{color: "white",position: "absolute", right : "0px",zIndex:"4"}} onClick={Editboxboxclose}></i>
        <div className="profile-box-content">
              <h5>Edit credentials</h5>
              <p style={{fontSize : "15px"}}>Credentials add credibility to your content</p>
              <form action=""  onSubmit={(e) => { e.preventDefault(); editmutation.mutate(authid)}}>
             
              <input type="text" name="" id="" required ={true}  placeholder='Edit professional bio' style={{width :"100%", height:"40px", border: "2px solid #0b57d0", background : '#363434'}}value={credentials1} onChange={(e)=>setcredentials1(e.target.value)} />

              <textarea name="" id="" style={{width : "100%", height : "154px", border: "1px solid white", background : '#363434', marginTop: "10px"}} placeholder='Edit personal bio' value={credentials2} onChange={(e)=>setcredentials2(e.target.value)} ></textarea>
              <p style={{fontSize : "15px"}}>Edit profile image</p> 
              <div>
              <input type="file" name="" id="editprofileupload" placeholder='coverimage'  onChange={(e)=> setyesedit(e.target.value)} />
              {/* <button  style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick={uploadphoto}>Select</button> */}
              </div>
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}}>save</button>
              {/* <i class="fa-solid fa-chevron-right" style={{display: "flex", justifyContent: "right"}} ></i> */}
              </form> 
              </div>
        </div>
      </div>
      
        <Header></Header>
      {/* <div className="header" id='header'>
           
        </div> */}
       <div className="profile-topimage" style={{height: "50vh",
       background: "linear-gradient(#475aa6, #ccdfff) padding-box, linear-gradient(11deg, #c7a6bb, #0b57d0) border-box"
       }}>

          <div className="profile-content">
          {user?<h3 style={{fontWeight : "500", fontSize : "45px",color: "white"}}>{user}</h3>:<h3></h3>}
           {profilecredentials?<div  onClick={Editboxopen} style={{cursor : "pointer", fontSize : "20px"}} >Edit credentials</div>:<span onClick={profileboxopen}style={{cursor :'pointer', fontSize : '20px'}}>Add Profile credentials</span>}
           <div className="profile-info">

            {profilecredentials?<h6 style={{color : "black", fontSize: "16px,", fontWeight :"400"}}>{credentials1}</h6>:<h6 style={{color : "white"}}></h6>}
                           {profilecredentials?<h6 style={{color : "black", fontSize: "16px",fontWeight : "400"}}>{credentials2}</h6>:<h6 style={{color : "white"}}></h6>}
           </div>
                         </div>
                       <div className="followersandfollowings">
                        {!followingsloading && !followingserror && (  
                          <span style={ { color : "black"}}>{fetchfollowings} followings</span>
                        )}
                        {!followersloading && !followerserror && (
                          <span style={ {color : "black"}}>{fetchfollowers} followers</span>
                        )}
          </div>
       
                      <div className="profile-left-top-image-box">
                       
                      {/* {profilecredentials ?<img  src={dp} alt=""   className="profile-left-top-image" /> :<> 
                        <h5 className='' onClick={profileboxopen}>tap to upload img</h5>
                        </>}  */}
                        {loading ? (
  <div className="dot-loader"> <span></span>
  <span></span>                                     
  <span></span> </div> // or null
) : profilecredentials ? (
  <img src={dp} alt="" className="profile-left-top-image" />
) : (
  <h5 onClick={profileboxopen}>tap to upload img</h5>
)}
                       
                      </div> 
         </div>


<div className="profile-section" style={lowopacity}>
    <div className="profile-left">    
        
   
           {!postdocumentsloading && !postdocumentserror &&(
           postdocuments.length > 0 ? <>

               <div className="everyposts-section">
                    { 
                    postdocuments.map((listings)=> (
                      <div className="Posts" style={{marginTop : "20px"}} key={listings.$id} >
                      <div className="every-post">
                      <div className="onlycontent">
                        <div className="post-heading" style={{lineHeight: "10px"}}>
                          <h5 style={{color : "black"}}>{listings.posttitle}</h5> 
                          <div className="incdate" style={{display: "flex", justifyContent: "space-between"}}> 
                          <span style={{fontWeight: "400", fontSize: "14px", color: "black",textDecoration : "underline"}}>{listings.postcategory ? "category - " + listings.postcategory :listings.postcategory} </span>
                          <span style={{fontWeight: "400", fontSize: "14px", color: "#0b57d0", borderRadius:"20px", padding : "7px 7px"}} >{listings.Date}</span>
                          </div> 
                        </div> 
                        
                        <div className="post-user" style={{display : "flex", justifyContent :"space-between", padding: "8px 0px",color : "#0b57d0"}}>
                          <h6 onClick={()=> reduxsend(listings.authid,listings.postcreator)} style={{color :"#0b57d0", textDecoration: "underline",fontSize: "14px", cursor:"pointer"}}>{listings.postcreator}</h6>
                         
                        {listings.authid ===authid?(<><h6 style={{color :"black", textDecoration: "underline",fontSize: "14px", cursor:"pointer", fontWeight : "400"}} onClick={()=>deleteposts.mutate(listings.$id)} >deletepost</h6></>):(<></>)}
                        </div>   
                      
                        <div className="post-content"> 
                       {gettingid === listings.$id ?(
                         <h6 style={{color: "black",fontWeight:"400",lineHeight:"24px" }}>{nottrimcontent}</h6>
                        ):( <h6 style={{color: "black",fontWeight:"400",lineHeight:"24px" }}>{listings.postcontent.slice(0,300)}</h6> )}
                        <h6 style={{cursor: "pointer", fontWeight : "300", color: "#0b57d0"}} onClick={()=>nottrim(listings.$id)}>{gettingid === listings.$id ?"" :"(... more⬇️)"}</h6>
                        
                        </div> 
                        </div>
                        <div className="post-image" style={{display: "flex", justifyContent:"center",}}>
                          <img src={listings.featuredimage} alt="image" style={{width:"95%", borderRadius : "21px"}} />
                      </div>
                      <div className="like-comment-section">
                         <div className="like-section"> 
                     
                          
   {listings.Like.includes(authid)?<i class="fa-solid fa-heart" style={{color:"#d7329a", fontSize  : "14px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate({docid : listings.$id, Like : listings.Like})}></i> : <i class="fa-solid fa-heart" style={{color : "white", fontSize : "14px", cursor : "pointer"}} onClick={()=>likeMutation.mutate({ docid :listings.$id, Like : listings.Like})}></i>}

                               
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
              <i className="fa-solid fa-caret-right" style={{fontSize:"25px", color : "black"}} onClick={()=>commentsmutation.mutate({listingsid:listings.$id,addcomments,user,authid,postcreator:listings.authid, posttitle : listings.posttitle})}></i>
              </div>
              </div>
                    </div>


                          <div className="showing-comments"style={{transition: "transform 0.9s ease"}} >
                          <h6>

</h6>
                            {displaycommentss?.map((comment) => comment.postid === listings.$id?(
      <div className="every-comment" style={{padding : "6px 20px",}} key={comment.$id}>
        <div className="name-date" style={{display: "flex", justifyContent : "space-between"}}>
        <h6 style={{color : "white",fontSize : "15px", color : "#2d2a2a" }}>{comment.name}</h6>
        {/* <h6 style={{fontSize : "12px"}}>{comment.date}</h6> */}
        <span style={{fontWeight: "400", fontSize: "13.5px", color: "#2d2a2a", borderRadius:"20px", padding : "3px 7px"}} >{comment.date}</span>
        </div>
        <div className="message-icon" style={{display : "flex", gap : "15px"}}>

        <h6 style={{color: "black",fontWeight:"400", fontSize : "13.5px", letterSpacing : "0.3px", lineHeight : "20px"}}>{comment.comments}&nbsp; &nbsp; </h6>
        <h6 style={{color : "blue", textDecoration : "underline", cursor : "pointer",color: "black",fontWeight:"400", fontSize : "13.5px",}}onClick={()=>{setcommentdisplay(comment.$id),setfetchreply(comment.$id)}}>reply</h6>
        
        {comment.authid === authid?( <><h6 style={{color: "black",fontWeight:"400", fontSize : "13.5px", cursor : "pointer"}} onClick={()=>deletemutation.mutate(comment.$id)}>delete</h6></>):(<></>)}

        </div>


    {displayreplycomments?.map((listings)=>(
      <div className="reply-comments" key={comment.$id} style={{
        display: commentdisplay === comment.$id ? "flex " : "none", flexDirection : "column"  
      }}>
        <>
      <span style={{color : "blue",fontSize : "13.9px"}}>{listings.user}</span>
      <div className="reply-box" style={{display : "flex", gap : "8px", cursor : "pointer",}}>
      <span style={{fontSize : "13.9px"}}>{listings.comment}</span>
      {listings.authid === authid?(<><span style={{fontSize : "13.9px", textDecoration : "underline"}} onClick={()=>replydeletemutation.mutate(listings.$id)}>delete</span></>):(<></>)}

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
  
                ))}
                    </div>
            </> : <> <div style={{display : 'flex', alignItems : "center", height :"200px", gap : "10px"}}>
               <h3 style={ {fontWeight : "400"}}>no posts yet</h3>  <h6 style={ {cursor : "pointer", textDecoration : "underline"}} onClick={opacitychanger}>add post</h6>
               </div> </>



                   
                     )} 


    </div>
    
    <div className="profile-right" style={{ width: "36%" }}>
          <div className="profile-right-top">
            <h5 style={{color : "black"}}>
            Credentials & Achievements Highlights
            </h5> 
            <i className="fa-solid fa-pen" style={{color: "black"}}></i>
          </div>
           <hr style={{margin : "0px", color : 'black'}} />
          <div className="profile-right-credentials" style={{color : "black"}}>
            <div className="education-credentials">
              {/* <h6 onClick={educationcredentialopen}  style={{ color: "white" }} > <i class="fa-solid fa-graduation-cap" style={{ color: "#0b57d0" }}> </i> Add Education credentials</h6> */}
              {educationcredentials && Object.keys(educationcredentials).length > 0  ?(
                 <><h6 style={{color : "black", textDecoration: "underline"}}>Eduation credentials</h6><h6 onClick={educationcredentialopen} style={{color : "black", textDecoration: "underline"}}>Edit</h6>
             <div className="education-credential-box" style={educationopen}>
                <form action="" className='education-form'>
                  <i className="fa-solid fa-circle-xmark" onClick={educationcredentialclose} style={{ float: "right", color: "black" }}></i>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "black"}}>Edit schooling credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput"  onChange={(e) => setedit1(e.target.value)} value={edit1} placeholder="school credentialssssss" style={{marginBottom : "7px"}} />
                    <input type="text" className="form-control" id="formGroupExampleInput" value={edit2} onChange={(e) =>setedit2(e.target.value)} placeholder="school passout year" />
                    
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput2" className="form-label" style={{color : "black"}}> Higher education credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2" value={edit3} onChange={(e) => setedit3(e.target.value)} placeholder="Graduation credentials" style={{marginBottom : "7px"}}  />
                    <input type="text" className="form-control" id="formGroupExampleInput" value={edit4} onChange={(e) => setedit4(e.target.value)} placeholder="Graduation passout year" />
                  </div>
                  <button type="submit" onClick={(e)=>{e.preventDefault() ; editeducation.mutate(authid)} } className='btn btn-primary'>Edit</button>
                </form>

              </div> 
              </>
            ):(
            
            <><h6 onClick={educationcredentialopen}  style={{ color: "black" }} > <i className="fa-solid fa-graduation-cap" style={{ color: "#0b57d0" }}> </i> Add Education credentials</h6>
 <div className="education-credential-box" style={educationopen}>
                <form action="" className='education-form'>
                  <i className="fa-solid fa-circle-xmark" onClick={educationcredentialclose} style={{ float: "right", color: "black" }}></i>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "black"}}>Add schooling credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput"  onChange={(e) => setschoolingname(e.target.value)} placeholder="school credentials" style={{marginBottom : "7px"}} />
                    <input type="text" className="form-control" id="formGroupExampleInput" onChange={(e) =>setschoolpassout(e.target.value)} placeholder="school passout year" />
                    
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput2" className="form-label" style={{color : "black"}}> Higher education credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2" onChange={(e) => sethighereducation(e.target.value)} placeholder="Graduation credentials" style={{marginBottom : "7px"}}  />
                    <input type="text" className="form-control" id="formGroupExampleInput" onChange={(e) => setgradutionpassout(e.target.value)} placeholder="Graduation passout year" />
                  </div>
                  <button type="submit" onClick={(e)=>{e.preventDefault() ; createemploymentcredentials(authid)}} className='btn btn-primary'>Add</button>
                </form>
              </div>
                 </>

              )}
             

              <div className="education-response">  
                {
                educationcredentials?(
               <>
               <span>{edit1}</span>  <span>{edit2}</span>
               <br />
                <div className="graduation">
                    <span>{edit3}</span>
                  <span style={{paddingLeft: "5px"}}>{edit4}</span>
                  </div>
               </>):(
                  <>
                  <span>no credentials yet.</span>
                  </>

                 ) }
              </div>

            </div>
            <div className="employment-credentials">
            
              {employmentcredentials && Object.keys(employmentcredentials).length > 0 ? (<><h6 style={{color: "black", textDecoration: "underline"}}>Employment credentials</h6><h6 onClick={Employmentopen} style={{color : "black", textDecoration: "underline"}}>Edit</h6>
              
              <div className="employment-credential-box" style={employmentclose}>
              <form action="" className='education-form'>
                  <i className="fa-solid fa-circle-xmark" onClick={Employmentclose} style={{ float: "right", color: "black" }}></i>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "black"}}>Add Employment credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput" value={emp1} onChange={(e) => setemp1(e.target.value)} placeholder="position and work" style={{marginBottom : "7px"}}/>
                    
                    
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput2" className="form-label" style={{color : "black"}}>Experiance credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2" value={emp2} onChange={(e) => setemp2(e.target.value)} placeholder="Working experiance" style={{marginBottom : "7px"}}  />
        
                  </div>
                  <button type="submit" onClick={(e)=>{e.preventDefault() ; editemploy.mutate(authid)}} className='btn btn-primary'>Edit</button>
                </form>
              </div>
      
              </>)
              :
              (<>
                <h6 onClick={Employmentopen}  style={{ color: "black" }} > <i className="fa-solid fa-graduation-cap" style={{ color: "black" }}> </i> Add Employment credentials</h6>
              <div className="employment-credential-box" style={employmentclose}>
              <form action="" className='education-form'>
                  <i className="fa-solid fa-circle-xmark" onClick={Employmentclose} style={{ float: "right", color: "black" }}></i>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "black"}}>Add Employment credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput" onChange={(e) => setemployment(e.target.value)} placeholder="position and work" style={{marginBottom : "7px"}} />
                    
                    
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput2" className="form-label" style={{color : "black"}}>Experiance credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2" onChange={(e) => setexperience(e.target.value)} placeholder="Working experiance" style={{marginBottom : "7px"}}/>
        
                  </div>
                  <button type="submit" onClick={(e)=>{e.preventDefault() ; createemploy.mutate(authid)}} className='btn btn-primary'>Add</button>
                </form>
              </div>
              </>

)}

              <div className="education-response">  
                {employmentcredentials ? (
                  <><span>{emp1}</span><br /><span>{emp2}</span></>
                    
                ) : (<span>no credentials yet</span>)}
              </div>
            </div>

           <div className="location-credentials">
              {/* <h6 style={{ color: "white" }} onClick={Locationopen}> <i class="fa-solid fa-location-dot" style={{ color: "#0b57d0" }}></i> Add Location credentials</h6> */}
              {locationcredentials && Object.keys(locationcredentials).length > 0 ? (<><h6 style={{color: "black", textDecoration: "underline"}}>Location credentials</h6><h6 onClick={Locationopen} style={{color : "black", textDecoration: "underline"}}>Edit</h6>
               <div className="location-credential-box" style={locationclose}>
                <form action="" className='education-form'>
                    <i className="fa-solid fa-circle-xmark" onClick={Locationclose} style={{ float: "right", color: "black" }}></i>
                    <div className="mb-3">
                      <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "black"}}>Add Location credentials</label>
                      <input type="text" className="form-control" id="formGroupExampleInput"  placeholder="type city & state name" style={{marginBottom : "7px"}} value={location1} onChange={(e)=>setlocation1(e.target.value)}/>
                     
                    </div>
                    <button type="submit" onClick={(e)=>{e.preventDefault() ; editlocation.mutate(authid)}}  className='btn btn-primary'>Edit</button>
                  </form>
                </div></>
            )
              :

              (<>
              <h6 onClick={Locationopen}  style={{ color: "black" }} > <i className="fa-solid fa-location-dot" style={{ color: "black" }}> </i> Add location credentials</h6>
               <div className="location-credential-box" style={locationclose}>
                <form action="" className='education-form'>
                    <i className="fa-solid fa-circle-xmark" onClick={Locationclose} style={{ float: "right", color: "black" }}></i>
                    <div className="mb-3">
                      <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "black"}}>Add Location credentials</label>
                      <input type="text" className="form-control" id="formGroupExampleInput"  placeholder="type city & state name" style={{marginBottom : "7px"}} />

                    </div>
                    <button type="submit" onClick={(e)=>{e.preventDefault() ; createlocation.mutate(authid)}} className='btn btn-primary'>Add</button>
                  </form>
                </div>

</>
              )}
             
                <div className="education-response">  
                {locationcredentials ? (
                  <><span>lives in - </span><span>{location1}</span><br/></>

                ) : (<span>no credentials yet</span>)}
              </div>
           </div>



          </div>
        </div>
        </div> 
// </div>
    
  )
}


export default Userprofile
