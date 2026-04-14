import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useState,useEffect,useRef } from 'react'
import authService from '../../../appwrite/auth'
import { Client, Storage, ID } from 'appwrite'
import { Account, Databases, Query, } from 'appwrite'
import conf from '../../../appwrite/conf';
import {sendloginname} from '../../../redux/createslice'

import { useNavigate } from 'react-router-dom'
 import { Link } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from 'react-router-dom'  
import { useMutation, useQueryClient } from "@tanstack/react-query";
import './Userprofile.css'
 import InputEmoji from 'react-input-emoji'
//   fetching current user from the react query 
import '../../mainmenu/dashnew/Newdash.css'

//  importing custom hooks
import {likesincrease,likesdecrease} from '../Customs/Increase/increaselikes'
import { databases } from '../Customs/Increase/appwritesdk'

const currentuser = async()=>{
    const getuser = await authService.getcurrentuser();
    return getuser;
}
function Profileuser() {
  const queryClient = useQueryClient();
       const navigate = useNavigate()
    const selectorid = useSelector((state) => state.sendingname.username)
    const creatorid = useSelector((state) => state.sendingname.creatorname)


   const {data :currentusers} = useQuery({
         queryKey:["currentuser"],
         queryFn : currentuser,
         staleTime :  5 * 60 * 1000,
      })       
          //   declaring variables for the current user 
           let user = currentusers?.name;
           let authid = currentusers?.$id;
           let firstletter = currentusers?.name.charAt(0).toUpperCase() 
          
let userdocuments = async()=>{
     const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
      const queries = [Query.equal("authid", selectorid)]
       const listuserdocuments = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritepostcollectionid, queries 
      );
         return listuserdocuments.documents.reverse()
}

   const{data : postdocuments, isLoading : postdocumentsloading, error :postdocumentserror} = useQuery({
    queryKey :["documentss", selectorid],
    queryFn : userdocuments,
    staleTime :  5 * 60 * 1000,
   })




const [nottrimcontent, setnottrimcontent] = useState("")
const[gettingid, setgettingid] = useState("")
async function nottrim(id) {
 const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
const databases = new Databases(client);
try { 
  const nottrimcontent = await databases.listDocuments(
    conf.appwritedatabaseid,conf.appwritepostcollectionid,[Query.equal("$id", id)]
    )
   console.log(nottrimcontent);
     setnottrimcontent(nottrimcontent.documents[0].postcontent)
     setgettingid(nottrimcontent.documents[0].$id)
    } catch (error) {
    // console.log("error in nottrim",  error);
   
}
}

// const [increaselike, setincreaselike] = useState([])

// async function likesincrease(id) {
//   const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);                                             

//   // const storage = new Storage(client);
//   const databases = new Databases(client);
//   try {

//         const getdocuments = await databases.getDocument(
//           conf.appwritedatabaseid,conf.appwritepostcollectionid,id
//         )
//           let getdata = getdocuments.Like
//           console.log(getdata);
          
//     if (getdata.includes(authid)) {
//          alert("you already like the post")
//     }
//     else{
//       const updateddocument = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,id,{  
//               "Like" :[...getdata, authid]  
//             }  
//            ) 
//            console.log(updateddocument, "yes updated");
//             // setincreaselike(updateddocument.Like.length +1)
//             setincreaselike(prev => [...prev, id]);   
           
//     }
            
//   } catch (error) {
//         console.log("error in updating likes", error);
//   }
// } 


//  increasing likes using react query 

    const [increaselike, setincreaselike] = useState([])
const[likecolor, setlikecolor] = useState() 
          // async function likesincrease(id) {
          // const likesincrease = async (id)=>{

          //   const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);                                             
      
          //   // const storage = new Storage(client);
          //   const databases = new Databases(client); 
          //   try {
    
          //         const getdocuments = await databases.getDocument(
          //           conf.appwritedatabaseid,conf.appwritepostcollectionid,id
          //         )
          //           let getdata = getdocuments.Like
          //         console.log(getdata); 
          //         setlikecolor(true) 
          //     if (getdata.includes(authid)) {
          //          alert("you already like the post")          
          //     }
          //     else{
          //       const updateddocument = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,id,{  
          //               "Like" :[...getdata, authid]  
          //             }   
          //            ) 
          //            console.log(updateddocument, "yes updated");
          //             // setincreaselike(updateddocument.Like.length +1)

          //             //  for state purpose only 
          //             setincreaselike(prev => [...prev, id]);         
          //     }
                      
          //   } catch (error) {
          //         console.log("error in updating likes", error);                                                             
          //   }
          // }

             const likeMutation = useMutation({
                      mutationFn: likesincrease,
                    
                      onSuccess: () => {
                        // 🔥 THIS triggers posts API again
                        queryClient.invalidateQueries({ queryKey: ["documentss",selectorid] });
                      },
                    }); 

        //   decrease likes using react query

//         async function likesdecrease(id){
// const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);                                             
      
//             // const storage = new Storage(client);
//             const databases = new Databases(client); 
//                 const getdocuments = await databases.getDocument(
//                     conf.appwritedatabaseid,conf.appwritepostcollectionid,id
//                   )
//                     let getdata = getdocuments.Like

//             try {
//                setlikecolor(false) 
//                if(getdata.includes(authid)) {
//              let newgetdata = await getdata.filter((element)=> {
//                 return  element!==authid
//                 }
//                 )
//                 console.log(newgetdata); 
                
//                  const updateddocument = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,id,{  
//                         "Like":newgetdata  
//                        }   
//                      ) 
//                      console.log(updateddocument);  
//                     //   for state purpose only 
//                     let removelikes = increaselike.filter((element)=> {return element!==id})
//                       setincreaselike(removelikes)
//                }
//             } catch (error) {
//                  console.log(error);
                 
//             }
//           }

          //   linking the mutation with the posts function and the likes decrease function
   
 const decreaselikeMutation = useMutation({
  mutationFn: likesdecrease,

  onSuccess: () => {
    // 🔥 THIS triggers posts API again
    queryClient.invalidateQueries({queryKey: ["documentss", selectorid]});
  },
}); 


const[followers, setfollowers] = useState("")
const [followinglist, setfollowinglist] = useState("")
const[checks, setchecks] = useState([])
 
  //    fetching followings using react query
    let fetchingfollowings = async(id)=>{
     const getfollowings = await databases.listDocuments(
   conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("giver", id)])
   let followinglist  = getfollowings.documents.map((list) => list.reciever);
  // followinglist(followinglist.length)
  return followinglist.length
    } 
      const {data :fetchfollowings, isLoading :followingsloading, error : followingserror} = useQuery({
                    queryKey:["followings", selectorid],
                    queryFn : ()=> fetchingfollowings(selectorid),
                      
                    staleTime :  5 * 60 * 1000,
                 }) 
        //  let followinglist = fetchfollowings

        //   fetching followers by react query 
  
  let fetchingfollowers = async(id)=>{
const getfollowers = await databases.listDocuments(
   conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever",id)]   
 )
  // let followerslist = getfollowers.documents
  //    let listmapping = followerslist.map((list) => list.giver);
  let followerslist = getfollowers.documents.map((list) => list.giver);
      setchecks(followerslist)
     return followerslist.length
    
  }

   const {data :fetchfollowers, isLoading :followersloading, error : followerserror} = useQuery({
                 queryKey:["followers", selectorid],
                 queryFn : ()=> fetchingfollowers(selectorid),
                 staleTime :  5 * 60 * 1000,
              }) 
      //  let followers = fetchfollowers
             
  


//   followings and followers section
    //  get current user
    // const [currentuserss, setcurrentusers] = useState("")
    // const [currentname, setcurrentname] = useState("")
    // const [followbutton, setfollowbutton] = useState("")
    // const[firstletter, setfirstletter] = useState()
    // async function currentuser() {
    //   try {
    //     const getuser = await authService.getcurrentuser();
    //     console.log(getuser, "geting user");
    //     setcurrentusers(getuser.$id)
    //     setcurrentname(getuser.name)
    //     setfirstletter(getuser?.name.charAt(0).toUpperCase())
    //   } catch (error) {
    //     console.log("error in getting user", error);
        
    //   }
    // }
    // useEffect(()=>{
    //   currentuser()
    // },[])


    //  initially  check whether the current user follow the profile , or not 

//       const [checkfollow, setcheckfollow] = useState(false) 
//       // const [deleteid, setdeleteid] = useState("")
      // const [senddelete, setsenddelete] = useState("")
//    const  checkfollowings = useCallback(async()=> {
//        const client = new Client()
//       .setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
//     const databases = new Databases(client);
    
//     try {  
//       const check = await databases.listDocuments(
//       conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever", selectorid)]

//     )
//     console.log(check, "ccccccc");
//       let givenusers = check.documents.find((list)=> list.giver === currentuserss)
//       // let givenusers = check.documents.find((list)=> list.giver === authid)
//     console.log(givenusers, "given");
    

    
//     // setsenddelete(givenusers ? givenusers.$id : "");   
//     // setsenddelete(newgiver ? newgiver.$id : ""); 
  
    
//     if (givenusers) {
//       setcheckfollow(true)}
//       console.log(senddelete, "deleted id");
//     // }    else{ 
//     //   setcheckfollow(false)
//     // }
//               }
//     catch (error) {
//        console.log(error, "error in filtering the giver");
//     }
// },[selectorid,currentuserss,increasefollowers,decreasefollowers])

//  useEffect(()=>{ 
//     checkfollowings()
//  },[checkfollowings])

// async function increasefollowers(data) {
//     const client = new Client()
//       .setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
//     const databases = new Databases(client);
//           try {   
//              const getfollowers = await databases.listDocuments(
//               conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever", data)] 
//             )
//             console.log(getfollowers.documents)  
//             // setfollowerslist(getfollowers.documents) 
//             let followerslist = getfollowers.documents   
//             let listmapping = followerslist.map((list) => list.giver);
//             console.log(listmapping.length); 
//             // setfollowers(listmapping.length)
            
//             // if (listmapping.includes(authid)) {
//             if (listmapping.includes(currentuserss)) {
             
//               alert("you already follow this profile")  
//             } 
//             else{
//               const addfollowers = await databases.createDocument( 
//                 conf.appwritedatabaseid, conf.appwritefollowersid,ID.unique(),{
//                 //  "giver": authid,
//                  "giver": currentuserss,
//                  "reciever": data,
//                  "name":  currentname
//                 })
//                 console.log(addfollowers.length);
//                 // Manually update the state without refetching
//                 setfollowers((prev) => prev + 1); 
//                 setcheckfollow(true)
//                 //  followers = followers + 1
                
//             } 
 
//           } catch (error) {
//               console.log(error, "error in fetching followers"); 
              
//           }
//   }
 

  //  decrease followers  or unfollow the current user

//  async function decreasefollowers(data) {
//     const client = new Client()
//       .setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
//     const databases = new Databases(client);
//     console.log(data, 'ddddddd');
    
//     try {
//            let deleteid =  await databases.deleteDocument(conf.appwritedatabaseid, conf.appwritefollowersid,data)
//            console.log(data, 'the data');
           
//              console.log(deleteid, "you unfollow this id");
//          setfollowers((prev)=> prev-1)
//          setcheckfollow(false)
//         // followers = followers -1     
//     } catch (error) { 
//       console.log(error, "error in unfollowing user");
      
//     }
//  }  

//   increasing followers and followings using react query 
// const checkfollowing = async()=>{
//  const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
//     const databases = new Databases(client);

//     try {
//     const check = await databases.listDocuments(
//       conf.appwritedatabaseid, conf.appwritefollowersid,[ 
//   Query.equal("reciever", selectorid),
//   Query.equal("giver", authid)
// ]
//     )
//     // let givenusers =  check.documents.some((list)=> list.giver === currentuserss)
//     return check.documents.length > 0;

        
//    } catch (error) {
//          console.log(error);
         
//     }
// }
// // let[ischecking ,setischecking] = useState()
// const {data :checking, isLoading :checkingloading, error : checkingerror} = useQuery({
//                  queryKey:["checking", selectorid, authid],
//                  queryFn : ()=> checkfollowing(),
              //   staleTime :  5 * 60 * 1000,
              // }) 

const[ischange, setischange] = useState("")

  async function increasefollowers(data){
    try {
              setischange("yes")
      const getfollowers = await databases.listDocuments(
              conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever", data)] 
            )
            console.log(getfollowers.documents)  
            let followerslist = getfollowers.documents   
            let listmapping = followerslist.map((list) => list.giver);
            console.log(listmapping.length); 
            // setfollowers(listmapping.length)
            if (!listmapping.includes(authid)) {
            
              const addfollowers = await databases.createDocument(conf.appwritedatabaseid, conf.appwritefollowersid,ID.unique(),{
                       //  "giver": authid,
                        "giver": authid,
                        "reciever": data,
                        // "name":  currentname
                        "name" : user
               

                      })
                       return addfollowers;          
            }


    } catch (error) {
       console.log(error);
       
    }
    }

        const followmutation = useMutation({
        mutationFn : increasefollowers,

        onMutate: async () => {
    await queryClient.cancelQueries(["followers", selectorid]);
    await queryClient.cancelQueries(["followings",selectorid]);

    const prevFollowers = queryClient.getQueryData(["followers", selectorid]);
    const prevFollowings = queryClient.getQueryData(["followings", selectorid]);

  if (!ischange =="yes") {
    queryClient.setQueryData(["followers", selectorid], (old) => (old ?? 0) + 1);
  }
   
    // queryClient.setQueryData(["followings", selectorid], (old) => (old ?? 0) + 1);

    return { prevFollowers, prevFollowings};  
  },
  
  onSettled : ()=>{
  queryClient.invalidateQueries(["followers", selectorid]);
  // queryClient.invalidateQueries(["followings", selectorid]);
  queryClient.invalidateQueries(["checking", selectorid, authid])
  },
}
)

async function decreasefollowers(){
    try {
        const check = await databases.listDocuments(
      conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever",selectorid)]
    )
    let givenusers = check.documents.find((list)=> list.giver === authid)
         let deleteid =  await databases.deleteDocument(conf.appwritedatabaseid, conf.appwritefollowersid,givenusers.$id)
         return deleteid
    } 

    catch (error) {
         return error
    }
}

const unfollowmutation = useMutation({
       mutationFn : decreasefollowers,
           onMutate: async () => {
    await queryClient.cancelQueries(["followers", selectorid]); 
    await queryClient.cancelQueries(["followings",selectorid]);

    const prevFollowers = queryClient.getQueryData(["followers", selectorid]);
    const prevFollowings = queryClient.getQueryData(["followings", selectorid]);

    queryClient.setQueryData(["followers", selectorid], (old) => Math.max((old ?? 1) - 1, 0));
    // queryClient.setQueryData(["followings", currentuserss], (old) => Math.max((old ?? 1) - 1, 0));

    return {prevFollowers, prevFollowings};
  },
  onSettled: () => {
    queryClient.invalidateQueries(["followers", selectorid]);
    // queryClient.invalidateQueries(["followings", currentuserss]);
    queryClient.invalidateQueries(["checking", selectorid, authid])
  },
})
            


//  fetching profile credentials using react query

let fetchprofilecredentials =async()=>{
     const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
  const databases = new Databases(client);
  const getcredentials = await databases.listDocuments(
      conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.equal("authid",selectorid )] 
    )
    let reversecredentials = getcredentials.documents.reverse()
    return reversecredentials[0];
}
//  using react query
    const {data :profilecredentials, isLoading :profilecredentialsloading, error : profilecredentialserror} = useQuery({
                 queryKey:["biocollection", selectorid],
                 queryFn :fetchprofilecredentials,
                 staleTime :  5 * 60 * 1000,
              }) 
              let passion = profilecredentials?.personal;
              let profession = profilecredentials?.profession

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
      "date": date

    }
    )
    setaddcomments("")
    // setgetcomments(comments)
    console.log("these are the comments", comments);
  } catch (error) {
    console.log("getting erro in adding comments", error);
  }
}

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

async function fetchcomments(id) {
  const client = new Client()
    .setEndpoint(conf.appwriteurl)
    .setProject(conf.appwriteprojectid);
  const databases = new Databases(client);
  try {
    const fetchingcomments = await databases.listDocuments(conf.appwritedatabaseid, conf.appwritecommentsid, [
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
     //   fetching the educational credentials of the user
  // const [fetchingeducations, setfetchingeducations] = useState(null)
  // async function fetchingeducation() {
  //   try {
  //     const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
  //     const databases = new Databases(client);
  //     const educationdetails = await databases.listDocuments( conf.appwritedatabaseid, conf.appwriteeducationid,[
  //       Query.equal("authid", selectorid)]
  //     )
  //     let reverseeducation = educationdetails.documents.reverse()
  //     console.log("education details", reverseeducation[0]);
  //     setfetchingeducations(reverseeducation[0])
  //     // console.log("here is the fetching details", fetchingeducations);


  //   } catch (error) {
  //     console.log(error);

  //   }
  // }
  // useEffect(() => {
  //   if (selectorid) {
  //     fetchingeducation()
  //   }
  // }, [selectorid]) 

  //  fetching education using react query

  const fetchingeducation = async()=>{
    const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
      const databases = new Databases(client);
      const educationdetails = await databases.listDocuments( conf.appwritedatabaseid, conf.appwriteeducationid,[
        Query.equal("authid", selectorid)])
         let reverseeducation = educationdetails.documents.reverse();
         return reverseeducation[0]
  }

  //  using react query 

   const {data :educationcredentials} = useQuery({
                 queryKey:["education", selectorid],
                 queryFn :fetchingeducation,
                 staleTime :  5 * 60 * 1000,
              }) 
              let schooling = educationcredentials?.schooling;
              let highereducation = educationcredentials?.highereducation
                 let  schoolpassout= educationcredentials?.schoolpassout;
               let   gradutionpassout = educationcredentials?.gradutionpassout


 //   fetching the employment credentials of the user
//  const [fetchingemployment, setfetchingemployment] = useState({})
//  async function Fetchingemployment() {
//    try {
//      const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
//      const databases = new Databases(client);
//      const employmentdetails = await databases.listDocuments(conf.appwritedatabaseid, conf.appwriteemploymentid,[
//        Query.equal("authid", selectorid)]
//      )
//      let reverseemployment = employmentdetails.documents.reverse()
//      console.log("employment details", reverseemployment);
//      setfetchingemployment(reverseemployment[0])
//      // console.log("here is the fetching details", fetchingeducations);


//    } catch (error) {
//      console.log(error);

//    }
//  }
//  useEffect(() => {
//    if (selectorid) {
//      Fetchingemployment()
//    }
//  }, [selectorid])

//   fetching employment with the react query 




   let fetchingemployment = async()=>{
     const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
     const databases = new Databases(client);
     const employmentdetails = await databases.listDocuments(conf.appwritedatabaseid, conf.appwriteemploymentid,[
       Query.equal("authid", selectorid)]
     )
      let reverseemployment = employmentdetails.documents.reverse()
      return reverseemployment[0]
   }

  //   with react query 
   const {data :employmentcredentials} = useQuery({
                 queryKey:["employment", selectorid],
                 queryFn :fetchingemployment,
                 staleTime :  5 * 60 * 1000,
              }) 
                                                                                                                                     
              let employment = employmentcredentials?.employment
              let experiance = employmentcredentials?.experiance

 // fetching location credentials
//  const [fetchinglocation, setfetchinglocation] = useState({})

//  async function Fetchinglocation() {
//    try {
//      const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
//      const databases = new Databases(client);
//      const locationdetails = await databases.listDocuments(conf.appwritedatabaseid, conf.appwritelocationid, [
//        Query.equal("authid", selectorid)]
//      )
//      let reverselocation = locationdetails.documents.reverse()
//      console.log("employment details", reverselocation);
//      setfetchinglocation(reverselocation[0])
//      // console.log("here is the fetching details", fetchingeducations);


//    } catch (error) {
//      console.log(error);

//    }
//  }
//  useEffect(() => {
//    if (selectorid) {
//      Fetchinglocation()
//    }
//  }, [selectorid])

//  fetching location with react query

 
  let fetchinglocation = async()=>{
       const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
     const databases = new Databases(client);
      const locationdetails = await databases.listDocuments(conf.appwritedatabaseid, conf.appwritelocationid, [
       Query.equal("authid", selectorid)]
     )
     let reverselocation = locationdetails.documents.reverse()
     return reverselocation[0]
  }

  //  with react query
  const {data :locationcredentials} = useQuery({
                 queryKey:["location", selectorid],
                 queryFn :fetchinglocation,
                 staleTime :  5 * 60 * 1000,
              }) 

              let address = locationcredentials?.address


//   fetching profile pic 
// const[profilepic, setprofilepic] = useState(null)
 async function getprofilepic() {
    const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
       const storage = new Storage(client);
       const databases = new Databases(client);
      
              const getprofilepic = await databases.listDocuments( conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.equal("authid", selectorid)
             ])
             console.log(getprofilepic, "getprofilepic");
             
             return getprofilepic.documents.reverse()
             
          // return  profileurl[0].picurl
     
            }
//   with react quey 

const {data :gettingprofilepic} = useQuery({
                 queryKey:["profilepic", selectorid],
                 queryFn :getprofilepic, 
                 staleTime :  5 * 60 * 1000,
              }) 
            let profilepic = gettingprofilepic?.[0].picurl || null
   


  const dispatch = useDispatch();
  function loginname() {
    let loginname = user;
    dispatch(sendloginname(loginname));
    navigate(`/Userprofile/${loginname}`);
  }

  //  ending session
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

      //   chat connection  with roomid

    let [chatrun, setchatrun] = useState (false)
         let[rooms, setrooms] = useState("")
         let [messages, setmessages] = useState([])
         let[idarray, setidarray] = useState([])
         let[chatmessage, setchatmessage] = useState("")
         let reference = useRef(null)
         let[opacity, setopacity] = useState({ padding:" 20px 180px",
    display:" flex",
    justifyContent: "space-between",
    minHeight:" 100vh"})
    const[chatcontainer , setchatcontainer] = useState({
    display : "none"
    })
    async function chatconnection(authid,id) {
           try {
                let roomId = [authid ,id].sort().join("_");
                 setrooms(roomId)
                 setchatrun(true)
                 console.log(roomId, "roomid");
                 setopacity({...opacity, opacity : "0.1"})
                 setchatcontainer({display :"block" })
           } catch (error) {
              return error;
           }
      }

    useEffect(() => {
   reference.current.scrollTop = reference.current.scrollHeight;
  //  console.log(reference.current, "reffffffffoo")
},[messages]);

//  useeffect with the chat for websocket connection 
    
useEffect(() => {
     const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
  if (chatrun === true && rooms.length > 0) {
//  reference.current?.scrollIntoView({ behavior: "smooth" });
    const unsubscribe = client.subscribe(
      `databases.${conf.appwritedatabaseid}.collections.${conf.appwritechatid}.documents`,
      (response) => {

        if (response.payload.roomid === rooms) {

          setmessages(prev => {

            const exists = prev.some(msg => msg.$id === response.payload.$id);

            if (exists) return prev;

            return [...prev, response.payload];

          });

        }

      }
    );

    return () => unsubscribe();

  }

}, [rooms, chatrun]); 

//  create messages 

async function createmessage() {
  const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
     try {
  const createmessages = await databases.createDocument(
      conf.appwritedatabaseid, conf.appwritechatid, ID.unique(), {   
      "sender" : authid,
      "sendername" :user,
      "reciever" : selectorid,
      // "recievername" : ,
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
  //   fetching chats according to the roomid

  async function fetchingchats() {
      const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);
    const databases = new Databases(client);
     try {
               if (chatrun === true && rooms.length > 0) {
                 const listingchats =  await databases.listDocuments( conf.appwritedatabaseid, conf.appwritechatid,[Query.equal("roomid", rooms)
                 ])
                 console.log(listingchats.documents);
                 setmessages(listingchats.documents)
                 setidarray(listingchats.documents.$id)
               }
               
     } catch (error) {
        console.log(error);
        
     }
  }
  useEffect(()=>{
          fetchingchats()
},[rooms, chatrun])


//  chat box input css setting 
 let[inputstyle, setinputstyle] = useState({
  display : "flex", padding : "10px", borderTop: "1px solid #eee",alignItems: "center",background: "white", color :"black"
 })
let[clickstyle, setclickstyle] = useState({
   borderRadius : "100px", color : "black", display : "block",  opacity: "1",
  transform: "scale(1)",
  transition: "all 0.3s ease",fontSize: "18px"

})

   function chatboxicon(){
setopacity({padding:" 20px 180px",
    display:" flex",
    justifyContent: "space-between",
    minHeight:" 100vh"})
  setchatcontainer({display : "none"})
   }

 
  return (
    <div>

         <div className="chat-container" style={chatcontainer}>
          <div className="chat-container-in" >
        <div className="chat-header">
        <div className="avatar">
           {gettingprofilepic ?<img  src={profilepic} alt=""   className="profile-left-top-img" /> :<></>}
        </div>
         <div className="chatheader-display" style={{display : "flex", justifyContent : "space-between", width : '90%'}}>
        <span>{creatorid}</span>
        <div className="chatheader-icons">
        <i className="fa-solid fa-circle-xmark" onClick={chatboxicon} ></i>
        </div>

         </div>
      </div>

    <div className="chat-body" ref={reference} >
  {messages.map((msg) => (
    <div
  key={msg.$id}
      className={`message ${msg.sender === authid ? "sent" : "received"}`}
    >
      <span style={{fontSize : "16px"}}> {msg.message} </span>
      <span style={{ fontSize : "13px"}} >{new Date(msg.time).toLocaleTimeString()}</span>  
      
    </div>
  ))}

 {/* <div ref={reference}></div> */}
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

    </div>  </div>
  
          <div className="header" id='header'>
            <div className="headerleft">

       <Link to="/"><i className="fa-solid fa-house" style={{fontSize: "18px", color : "white"}}></i></Link>
        <i className="fa-solid fa-users-line" style={{fontSize: "18px"}}></i>
        <i className="fa-solid fa-bell" style={{fontSize: "18px"}}></i>
<Link to="/Questions"><i className="fa-solid fa-book-open-reader" style={{fontSize: "18px", color : "white"}}></i></Link>
        </div>
        <div className="headermiddle">
        <input type="text" name="" id="" style={{height: "35px"}} className='dashboard-input' placeholder="search your favorite querry"/>
        </div>
        <div className="headerright">
          {currentusers?<h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}}>{firstletter}</h6>:<h6>..</h6>}
          {/* <h6 style={{padding : "4px 8px", backgroundColor :"#0b57d0",color : "white", borderRadius : "20px"}} >{firstletter}</h6> */}
            {currentusers?<h6 style={{color : "white"}}>{user}</h6>: <h6 style={{color : "white"}}>loading...</h6>}
            {/* <h6 style={{color : "white"}}>{user}</h6> */}
              <button style={{backgroundColor :"#0b57d0", fontSize : "13.5px"}} onClick={loginname}>userprofile</button>
              <button style={{backgroundColor :"#d7329a", fontSize : "13.5px"}} onClick={sessionend} >Logout</button>
        </div>
        </div>
        <div className="profile-section" style={opacity}>
    <div className="profile-left">
          <div className="profile-left-top">
                     {/* <div className="profile-left-top-image">
                      {gettingprofilepic?<img src={profilepic} alt="" />:<></>}
                            
                     </div>  */}
                     {/* <img  src={profilepic} alt=""   className="profile-left-top-image" /> :<></> */}

                     {gettingprofilepic ?
                      <div className="profile-left-top-image">
                          <img src={profilepic} alt="" />
                      </div> :<></>
                     }
                     <div className="profile-left-topcontent">
                       <div className="profile-left-top1">
                        {/* {user?<h3>{user}</h3>:<h3>loading..</h3>} */}
                        <h3>{creatorid}</h3>
                   <div className="follow-chat"  style={{
                      display: "flex",
    justifyContent: "center",
    alignItems : "center",
    gap: "10px"}}>
                
             <div className="followbox">
{selectorid !== authid && (
   checks.includes(authid) ? ( <button onClick={() => unfollowmutation.mutate()}
      style={{ backgroundColor :"#0b57d0", fontSize : "13.5px" }}>Unfollow</button>) : (<button onClick={() => followmutation.mutate(selectorid)} style={{ backgroundColor :"white", color : "black", fontSize : "13.5px" }}>follow
    </button>
    
  )
)}
              </div>     
     {selectorid !== authid ? <div className="messagebox">
     <button style={{backgroundColor :"#d7329a", fontSize : "13.5px"}}  onClick={() =>chatconnection(authid,selectorid)}>chat</button>                  
                       </div> :<></>}          

 </div>  

                        {/* {checking?(<span onClick={()=> unfollowmutation.mutate()} style={{backgroundColor : "white", color : "black"}}>unfollow</span>):(<span onClick={()=>followmutation.mutate(selectorid)}>Follow</span>)} */}

                       </div>
                       {/* {credentials?<div></div>:<span onClick={profileboxopen}>Add Profile credentials</span>} */}
                       {/* <span onClick={()=>setprofileopen({display : "block"})}>Add Profile credentials</span> */}
                         {/* <div className="getcredentials">
                          {profilecredentials? <div> <div className="credentialsline"> <h5 className='credentialshover' style={{fontSize: "1.1rem"}}>{profession}</h5></div> </div> :<span></span>}     
                         </div> */}
                          {/* <div className="messagebox">
                        <button onClick={()=>chatconnection(authid,selectorid)} >Chat</button>
                       </div> */}
                         <div className="getcredentials">
                           <div> <div className="credentialsline"> <h5 className='credentialshover' style={{fontSize: "1.1rem"}}>{profession}</h5></div> </div> 
                           {/* {profession}    */}
                          {/* {!profilecredentialsloading && !profilecredentialserror&&({profession})} */}
                         </div>
                       <div className="followersandfollowings">
                       <span>{fetchfollowings} Followings</span> 
                       <span>{fetchfollowers} followers </span> <br /></div>
                      
                     </div>
                   </div>

                <div className="profile-des" style={{padding:" 2px 24px 16px 29px"}}>
                  {profilecredentials?<h6 style={{color : "white", fontSize: "16px"}}>{passion}</h6>:<h6 style={{color : "white"}}></h6>}
                  {/* <h6  style={{color : "white", fontSize: "16px"}}>love coding it kills depression,</h6> */}
                </div>

                <div className="everyposts-section">


     {!postdocumentsloading && !postdocumentserror &&(
                      <div className="everyposts-section">
                    { 
                    postdocuments.map((listings)=> (
                      <div className="Posts" style={{marginTop : "8px"}} key={listings.$id} >
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
                          <h6 onClick={()=> reduxsend(listings.authid,listings.postcreator)} style={{color :"#626161", textDecoration: "underline",fontSize: "14px", cursor:"pointer"}}>{listings.postcreator}</h6>
                         
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
                           {/* <i className="fa-regular fa-heart"onClick={()=>likesincrease(listings.$id)} style={{color:"white"}}></i> */}
                          {/* {listings.Like.includes(authid)?<h6 style={{color : "blue", fontSize : "13px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate(listings.$id)}>Like</h6> : <h6 style={{color : "white", fontSize : "13px", cursor : "pointer"}} onClick={()=>likeMutation.mutate(listings.$id)}>Like</h6>}  */}
                          

                           {/* {listings.Like.includes(authid)?<i class="fa-solid fa-heart" style={{color:"#d7329a", fontSize  : "14px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate(listings.$id)}></i> : <i class="fa-solid fa-heart" style={{color : "white", fontSize : "14px", cursor : "pointer"}} onClick={()=>likeMutation.mutate(listings.$id)}></i>} */}

                            {listings.Like.includes(authid)?<i class="fa-solid fa-heart" style={{color:"#d7329a", fontSize  : "14px", cursor : "pointer"}} onClick={()=>decreaselikeMutation.mutate({docid : listings.$id, Like : listings.Like})}></i> : <i class="fa-solid fa-heart" style={{color : "white", fontSize : "14px", cursor : "pointer"}} onClick={()=>likeMutation.mutate({ docid :listings.$id, Like : listings.Like})}></i>}
                               
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
                        <i className="fa-regular fa-comment" style={{color : "white"}} onClick={addcomment}></i>
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
              <i className="fa-solid fa-caret-right" style={{fontSize:"25px", color : "white"}} onClick={()=>Addcomments(listings.$id)}></i>
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
        <h6 style={{color : "white",fontSize : "14px" }}>{comment.name}</h6>
        {/* <h6 style={{fontSize : "12px"}}>{comment.date}</h6> */}
        <span style={{fontWeight: "400", fontSize: "12px", color: "white",background:"#0b57d0", borderRadius:"20px", padding : "3px 7px"}} >{listings.Date}</span></div>
        <h6 style={{color: "white",fontWeight:"400", fontSize : "13px"}}>{comment.comments}</h6><hr style={{color : "#686665"}} />
                    
      </div>
    ))}
    </div>
    </div>
       
            </div>
  
                ))}
                    </div>
                     )} 
               
               
                         </div>    
    </div>
    <div className="profile-right" style={{ width: "36%" }}>
          <div className="profile-right-top">
            <h5 style={{color : "white"}}>
            Credentials & Achievements Highlights
            </h5>
            <i className="fa-solid fa-pen" style={{color: "white"}}></i>
          </div> <hr style={{margin : "0px", color : 'white'}} />
          <div className="profile-right-credentials" style={{color : "white"}}>
            <div className="education-credentials">
              {/* <h6 onClick={educationcredentialopen}  style={{ color: "white" }} > <i class="fa-solid fa-graduation-cap" style={{ color: "#0b57d0" }}> </i> Add Education credentials</h6> */}
              {educationcredentials && Object.keys(educationcredentials).length > 0 ?( <><h6 style={{color : "white", textDecoration: "underline"}}>Eduation credentials</h6></>):(<h6 style={{ color: "white" }} > <i className="fa-solid fa-graduation-cap" style={{ color: "#0b57d0" }}> </i> Education credentials</h6>)}
              <div className="education-credential-box">
                <form action="" className='education-form'>
                  <i className="fa-solid fa-circle-xmark" style={{ float: "right", color: "black" }}></i>
                  <div classname="mb-3">
                    <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "black"}}>Add schooling credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput" onChange={(e) => setschoolingname(e.target.value)} placeholder="school credentials" style={{marginBottom : "7px"}} />
                    <input type="text" className="form-control" id="formGroupExampleInput" onChange={(e) =>setschoolpassout(e.target.value)} placeholder="school passout year" />
                    
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formGroupExampleInput2" className="form-label" style={{color : "black"}}> Higher education credentials</label>
                    <input type="text" className="form-control" id="formGroupExampleInput2" onChange={(e) => sethighereducation(e.target.value)} placeholder="Graduation credentials" style={{marginBottom : "7px"}}  />
                    <input type="text" className="form-control" id="formGroupExampleInput" onChange={(e) => setgradutionpassout(e.target.value)} placeholder="Graduation passout year" />
                  </div>
                  <button type="submit" className='btn btn-primary'>Add</button>
                </form>

              </div>
              <div className="education-response">  
                {/* {fetchingeducations ? (
                  <><span>{fetchingeducations.schooling}</span><span style={{paddingLeft: "5px"}}>{fetchingeducations.schoolpassout}</span><br /><div className="graduation"><span>{fetchingeducations.highereducation}</span><span style={{paddingLeft: "5px"}}>{fetchingeducations.gradutionpassout}</span></div></>

                ) : (<span>no credentials yet</span>)} */}
                {educationcredentials ? (
                  <><span>{schooling} -</span><span style={{paddingLeft: "5px"}}>{schoolpassout}</span><br /><div className="graduation"><span>{highereducation} -</span><span style={{paddingLeft: "5px"}}>{gradutionpassout}</span></div></>

                ) : (<span>no credentials yet</span>)}
              </div>

            </div>
            <div className="employment-credentials">
              {/* <h6 style={{ color: "white" }} onClick={Employmentopen}> <i class="fa-solid fa-user" style={{ color: "#0b57d0" }}></i> Add Employment credentials</h6> */}
              {employmentcredentials && Object.keys(employmentcredentials).length > 0 ? (<><h6 style={{color: "white", textDecoration: "underline"}}>Employment credentials</h6><h6  style={{color : "white", textDecoration: "underline"}}></h6></>):(<h6   style={{ color: "white" }} > <i className="fa-solid fa-graduation-cap" style={{ color: "#0b57d0" }}> </i>  Employment credentials</h6>)}
              {/* {Object.keys(fetchingeducations).length > 0 ? (
  <h6 onClick={educationcredentialopen} style={{ color: "white", textDecoration: "underline" }}>
    Edit credentials
  </h6>
) : (
  <h6 onClick={educationcredentialopen} style={{ color: "white" }}>
    <i className="fa-solid fa-graduation-cap" style={{ color: "#0b57d0" }}></i>
    Add Education credentials
  </h6>
)} */}
              {/* <div className="employment-credential-box">
              <form action="" className='education-form'>
                  <i class="fa-solid fa-circle-xmark"  style={{ float: "right", color: "black" }}></i>
                  <div class="mb-3">
                    <label for="formGroupExampleInput" class="form-label" style={{color : "black"}}>Add Employment credentials</label>
                    <input type="text" class="form-control" id="formGroupExampleInput" onChange={(e) => setemployment(e.target.value)} placeholder="position and work" style={{marginBottom : "7px"}} />
                    
                    
                  </div>
                  <div class="mb-3">
                    <label for="formGroupExampleInput2" class="form-label" style={{color : "black"}}>Experiance credentials</label>
                    <input type="text" class="form-control" id="formGroupExampleInput2" onChange={(e) => setexperience(e.target.value)} placeholder="Working experiance" style={{marginBottom : "7px"}}  />
        
                  </div>
                  <button type="submit"  className='btn btn-primary'>Add</button>
                </form>
              </div> */}
              <div className="education-response">  
                {employmentcredentials ? (
                  <><span>{employment}</span><br /><span>{experiance}</span></>

                ) : (<span>no credentials yet</span>)}
              </div>
            </div>

           <div className="location-credentials">
              {/* <h6 style={{ color: "white" }} onClick={Locationopen}> <i class="fa-solid fa-location-dot" style={{ color: "#0b57d0" }}></i> Add Location credentials</h6> */}
              {locationcredentials && Object.keys(locationcredentials).length > 0 ? (<><h6 style={{color: "white", textDecoration: "underline"}}>Location credentials</h6><h6  style={{color : "white", textDecoration: "underline"}}></h6></>):(<h6 style={{ color: "white" }} > <i className="fa-solid fa-location-dot" style={{ color: "#0b57d0" }}> </i> Add location credentials</h6>)}
              <div className="location-credential-box">
                <form action="" className='education-form'>
                    <i className="fa-solid fa-circle-xmark" style={{ float: "right", color: "white" }}></i>
                    <div className="mb-3">
                      <label htmlFor="formGroupExampleInput" className="form-label" style={{color : "white"}}>Location credentials</label>
                      <input type="text" className="form-control" id="formGroupExampleInput" onChange={(e) => setlocation(e.target.value)} placeholder="type city & state name" style={{marginBottom : "7px"}} />
                      
                      
                    </div>
                    <button type="submit" className='btn btn-primary'>Add</button>
                  </form>
                </div>
                <div className="education-response">  
                {locationcredentials ? (
                  <><span>lives in - </span><span>{address}</span><br/></>

                ) : (<span>no credentials yet</span>)}
              </div>
           </div>

          </div>
   
        </div>
</div>
    </div>
  )
}

export default Profileuser
