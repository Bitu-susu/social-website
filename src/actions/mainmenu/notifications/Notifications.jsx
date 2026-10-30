import React, { useEffect, useState } from 'react'
import Header from '../Customs/Increase/header/Header'
// import { Databases } from 'appwrite'
import {Query} from 'appwrite'
import './Notifications.css'
import authService from '../../../appwrite/auth'
import database from '../../../appwrite/database'
import conf from '../../../appwrite/conf'
import { databases } from '../Customs/Increase/appwritesdk'
import { useQuery } from "@tanstack/react-query";  
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Chat from '../Customs/Increase/chat/Chat'
import useProfile from '../Customs/Increase/userprofile'
import useFetchall from '../Customs/Increase/userpostsallfetchs'


function Loading() {
  return (
    <div className="loading-box">
      <div className="loading-spinner"></div>
    </div>
  );
}

function Notifications() {

 //  for the like section here we fetch the documents first then filter the likes  array.
      const currentuser = async()=>{
       const getuser = await authService.getcurrentuser();
       return getuser;
     }
      const {data :currentusers} = useQuery({
         queryKey:["currentuser"],
         queryFn : currentuser,
         staleTime :  5 * 60 * 1000,
      })  
          //   declaring variables for the current user 
           let user = currentusers?.name;
           let authid = currentusers?.$id;
        

// fetching likes

 const [select, setselect] = useState("all")

//  fetching likes

 async function fetchinglikes(){
  try {
    const fetchlikes = await databases.listDocuments( conf.appwritedatabaseid,conf.appwritelikesid,[Query.equal("postcreator", authid)])
  let objectsnewobj = fetchlikes.documents.map((objects)=>{
      let now = new Date();
      let created = new Date(objects.$createdAt)
      let difference = now - created;
      let seconds = Math.floor(difference/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      if (days>0) {
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
    // console.log(objectsnewobj,"aaa");
    return objectsnewobj.reverse();
  } catch (error) {
     console.log(error, "errror");
     
  }
     
 }
  
  //  fetchingfolllowers

  async function fetchingfollowers(){ 
   try {
       let fetchfollowers = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritefollowersid,[Query.equal("reciever", authid)])
       console.log(fetchfollowers, "followings");

      let newobj = fetchfollowers.documents.map((objects)=>{
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
    
    return newobj.reverse();
       
   } catch (error) {
      console.log(error,"error in fetching followings");
   }
}

// fetching comments 

async function fetchcomments(){
   try {
      
    const fetchingcomments =  await databases.listDocuments(
    conf.appwritedatabaseid, conf.appwritecommentsid,[Query.equal("postcreator",authid)]
    )
       console.log(fetchingcomments.documents, "comments");
       
    let filterfetching = await fetchingcomments.documents.filter((listings)=>{
       if (listings.authid !== authid) {
          return listings
       }
      })
      console.log(filterfetching, "filtercomments");
      let filtermapping = await filterfetching.map((objects)=>{
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
       console.log(filtermapping, "mapo");
       
      return filtermapping.reverse();
          
   } catch (error) {
     console.log(error, "error");
   }

}

 async function fetchall(){

 try {
  //  fetching likes
   const fetchinglikes =  await databases.listDocuments( conf.appwritedatabaseid,conf.appwritelikesid,[Query.equal("postcreator", authid)]);

  //   fetching followers
   const fetchingfollowers =   await databases.listDocuments(conf.appwritedatabaseid,conf.appwritefollowersid,[Query.equal("reciever", authid)])

  //  fetching comments
   const fetchingcomments =  await databases.listDocuments(
    conf.appwritedatabaseid, conf.appwritecommentsid,[Query.equal("postcreator",authid)])
 
   const combine = [...fetchinglikes.documents,...fetchingfollowers.documents,...fetchingcomments.documents]

   console.log(combine, "fetching all notifications");
   
   let sorting  = [...combine].sort((a,b) => new Date(a.$createdAt) - new Date(b.$createdAt))
   console.log(sorting, "sorted");

   let looping = sorting.map((objects)=>{
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
    
    return looping.reverse();
   
   
 } catch (error) {
   console.log( error, "error in fetching all notifications");
   
 }

 }

 const {fetchprofilecredentials} = useProfile()
 const {fetchingeducation} = useFetchall()
 const{Fetchingemployment} = useFetchall()

      const fetchingfollowings = async(id)=>{
             const getfollowings = await databases.listDocuments(
              conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("giver", id)]    
            )
            let followinglist  = getfollowings.documents
             let listmapping = followinglist.map((list) => list.reciever);
             return listmapping.length
            }  

            const fetchingfollowerss =async(authid)=>{
                  const getfollowers = await databases.listDocuments(
                    conf.appwritedatabaseid, conf.appwritefollowersid,[Query.equal("reciever", authid)])
                    let followerslist = getfollowers.documents
                      let listmapping = followerslist.map((list) => list.giver);
                      return listmapping.length
             }


  
 const{data : likes,isLoading} = useQuery({
    queryKey : ["likess", authid, select],
    queryFn : async ()=>{
      if(select === "likes"){
        return fetchinglikes()
      } 
      if (select === "followers") {
        return fetchingfollowers()
      }
      if (select === "comments") {
        return fetchcomments()
      }
      if (select === "profile") {
         const[profile, school, followerss, followings,employment] = await Promise.all([
           fetchprofilecredentials(authid),
           fetchingeducation(authid),
           fetchingfollowerss(authid),
           fetchingfollowings(authid),
           Fetchingemployment(authid),
           

         ])
             return {
              profile,school,followerss,followings,employment
             }
          } 
      if (select === "all") {
         return fetchall()
      }
    },
    staleTime : 5 * 60 * 1000,
 })


  return (
    <div>
       <Header></Header>
        <div className="contents-section">
            <div className="left">
            <div className="list">
          <h5 onClick={()=>setselect("all")}>All Notifications</h5>
          <h5 onClick={()=>setselect("comments")}>Comments & Mentions</h5>
          <h5>Answers</h5>
          <h5 onClick={()=>setselect("likes")}>Likes & Tags</h5>
          <h5 onClick={()=> setselect("profile")}>Your profile</h5>
          <h5 onClick={()=>setselect("followers")}>Followers</h5>
          <h5 >Subscription</h5>
          <h5 >Announcement</h5>
          <h5 >Questions</h5>
          <h5 >My chats</h5>
        </div>
            </div>
            <div className="middle">
            
            <h5>Notifications</h5> <hr />

      

       

{
  isLoading ? (
    <Loading />
  ) : (
    <>
      {select === "likes" ? (
        likes?.length ? (
          likes.map((listings) => (
            listings.authid !== authid ? (
              <div
                className="notification-box"
                key={listings.$id}
                style={{ padding: "9px 9px", marginBottom: "8px" }}
              >
                <div className="dp" style={{ width: "55px", height: "53px" }}>
                  {listings.giverpic !== null ? (
                    <img
                      src={listings.giverpic}
                      alt=""
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    <div className="content-dp" style={{ width: "47px", height: "40px", textAlign: "center" }}>
                      <p style={{ width: "95%", height: "100%", borderRadius: "50%", border: "3px solid rgb(245 245 245)", boxShadow: "4px 12px 27px 0px #e4e4e8" }}>
                        {listings.name.slice(0, 1)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="notification-bottom" style={{ width: "100%" }}>
                  <h5 style={{ fontSize: "16px" }}>
                    {listings.name} likes your post..&nbsp;&nbsp;&nbsp;
                    <span style={{ fontSize: "14px", color: "blue", textDecoration: "underline" }}>
                      view
                    </span>
                  </h5>

                  <div className="follow-content" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h6 style={{ marginBottom: "7px", fontWeight: "400" }}>
                      {listings.postname.slice(0, 56)}.....
                    </h6>
                    <span style={{ fontSize: "14px" }}>{listings.actualtime}</span>
                  </div>
                </div>
              </div>
            ) : null
          ))
        ) : (
          <p>No likes yet.</p>
        )
      ) : select === "followers" ? (
        likes?.length ? (
          likes.map((listings) => (
            listings.authid !== authid ? (
              <div
                className="notification-box"
                key={listings.$id}
                style={{
                  background: "aliceblue",
                  padding: "9px 9px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div className="dp" style={{ width: "55px", height: "53px" }}>
                  <img
                    src={listings.giverpic}
                    alt=""
                    style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                  />
                </div>

                <div className="follow-content">
                  <h5 style={{ fontSize: "15px" }}>
                    {listings.name} starts following you
                  </h5>
                  <span style={{ fontSize: "14px" }}>{listings.actualtime}</span>
                </div>
              </div>
            ) : null
          ))
        ) : (
          <p>No followers yet.</p>
        )
      ) : select === "comments" ? (
        likes?.length ? (
          likes.map((listings) => (
            listings.authid !== authid ? (
              <div
                className="notification-box"
                key={listings.$id}
                style={{ padding: "9px 9px", marginBottom: "8px" }}
              >
                <div className="dp" style={{ width: "55px", height: "53px" }}>
                  {listings.giverpic !== null ? (
                    <img
                      src={listings.giverpic}
                      alt=""
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    <div className="content-dp" style={{ width: "47px", height: "40px", textAlign: "center" }}>
                      <p style={{ width: "95%", height: "100%", borderRadius: "50%", border: "3px solid rgb(245 245 245)", boxShadow: "4px 12px 27px 0px #e4e4e8" }}>
                        {listings.name.slice(0, 1)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="notification-bottom" style={{ width: "100%" }}>
                  <h5 style={{ fontSize: "16px" }}>
                    {listings.name} commented on your post..&nbsp;&nbsp;&nbsp;
                    <span style={{ fontSize: "14px", color: "blue", textDecoration: "underline" }}>
                      view
                    </span>
                  </h5>

                  <div className="follow-content" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h6 style={{ marginBottom: "7px", fontWeight: "400" }}>
                      {listings.post}.....
                    </h6>
                    <span style={{ fontSize: "14px" }}>{listings.actualtime}</span>
                  </div>
                </div>
              </div>
            ) : null
          ))
        ) : (
          <p>No comments yet.</p>
        )
      ) : select === "all" ? (
        likes?.length ? (
          likes.map((listings) => (
            listings.authid !== authid && listings.call === "increase" ? (
              <div
                className="notification-box"
                key={listings.$id}
                style={{ padding: "9px 9px", marginBottom: "8px" }}
              >
                <div className="dp" style={{ width: "55px", height: "53px" }}>
                  {listings.giverpic !== null ? (
                    <img
                      src={listings.giverpic}
                      alt=""
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    <div className="content-dp" style={{ width: "47px", height: "40px", textAlign: "center" }}>
                      <p style={{ width: "95%", height: "100%", borderRadius: "50%", border: "3px solid rgb(245 245 245)", boxShadow: "4px 12px 27px 0px #e4e4e8" }}>
                        {listings.name.slice(0, 1)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="notification-bottom" style={{ width: "100%" }}>
                  <h5 style={{ fontSize: "16px" }}>
                    {listings.name} likes on your post..&nbsp;&nbsp;&nbsp;
                    <span style={{ fontSize: "14px", color: "blue", textDecoration: "underline" }}>
                      view
                    </span>
                  </h5>

                  <div className="follow-content" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h6 style={{ marginBottom: "7px", fontWeight: "400" }}>
                      {listings.postname.slice(0, 56)}.....
                    </h6>
                    <span style={{ fontSize: "14px" }}>{listings.actualtime}</span>
                  </div>
                </div>
              </div>
            ) : listings.authid !== authid && listings.call === "follows" ? (
              <div
                className="notification-box"
                key={listings.$id}
                style={{
                  background: "aliceblue",
                  padding: "9px 9px",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <div className="dp" style={{ width: "55px", height: "53px" }}>
                  <img
                    src={listings.giverpic}
                    alt=""
                    style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                  />
                </div>

                <div className="follow-content">
                  <h5 style={{ fontSize: "15px" }}>
                    {listings.name} starts following you
                  </h5>
                  <span style={{ fontSize: "14px" }}>{listings.actualtime}</span>
                </div>
              </div>
            ) : listings.authid !== authid && listings.call === "comment" ? (
              <div
                className="notification-box"
                key={listings.$id}
                style={{ padding: "9px 9px", marginBottom: "8px" }}
              >
                <div className="dp" style={{ width: "55px", height: "53px" }}>
                  {listings.giverpic !== null ? (
                    <img
                      src={listings.giverpic}
                      alt=""
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    <div className="content-dp" style={{ width: "47px", height: "40px", textAlign: "center" }}>
                      <p style={{ width: "95%", height: "100%", borderRadius: "50%", border: "3px solid rgb(245 245 245)", boxShadow: "4px 12px 27px 0px #e4e4e8" }}>
                        {listings.name.slice(0, 1)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="notification-bottom" style={{ width: "100%" }}>
                  <h5 style={{ fontSize: "16px" }}>
                    {listings.name} commented on your post..&nbsp;&nbsp;&nbsp;
                    <span style={{ fontSize: "14px", color: "blue", textDecoration: "underline" }}>
                      view
                    </span>
                  </h5>

                  <div className="follow-content" style={{ display: "flex", justifyContent: "space-between" }}>
                    <h6 style={{ marginBottom: "7px", fontWeight: "400" }}>
                      {listings.post.slice(0, 56)}.....
                    </h6>
                    <span style={{ fontSize: "14px" }}>{listings.actualtime}</span>
                  </div>
                </div>
              </div>
            ) : null
          ))
        ) : (
          <p>No notifications yet.</p>
        )
      ) : select === "profile" ? (
        <div className="profile-container">
          <div className="profile-user">
            {user ? (
              <h3 style={{ fontWeight: "350", fontSize: "45px", color: "#312f2f" }}>
                {user}
              </h3>
            ) : null}
          </div>

          <div className="profile-credentials">
            {likes?.profile ? (
              <>
                <h6 style={{ color: "black", fontSize: "16px", fontWeight: "400" }}>
                  {likes.profile.profession}
                </h6>
                <h6 style={{ color: "black", fontSize: "16px", fontWeight: "400" }}>
                  {likes.profile.personal}
                </h6>
              </>
            ) : (
              <>Nothing yet</>
            )}
          </div>

          <div className="profile-followers">
            {likes?.followerss ? (
              <>
                <h6 style={{ color: "#1f47ff", fontSize: "16px", fontWeight: "400" }}>
                  {likes.followerss} followers
                </h6>
                <h6 style={{ color: "#1f47ff", fontSize: "16px", fontWeight: "400" }}>
                  {likes.followings} followings
                </h6>
              </>
            ) : null}
          </div>

          <div className="profile-image">
            <img
              src={likes?.profile?.picurl}
              alt=""
              className="profile-left-top-image-box"
            />
          </div>

          <div className="education-credentials">
            <h5>Education Credentials</h5>
            {likes?.school ? (
              <>
                <h6 style={{ color: "black", fontSize: "16px", fontWeight: "400" }}>
                  Schooling at - {likes.school.schooling}
                </h6>
                <h6 style={{ color: "#1f47ff", fontSize: "16px", fontWeight: "400" }}>
                  Higher education at - {likes.school.highereducation}
                </h6>
              </>
            ) : null}
          </div>

          <div className="professional-credentials">
            <h6 style={{ color: "black", fontSize: "16px", fontWeight: "400" }}>
              Profession - {likes?.employment?.employment}
            </h6>
          </div>
        </div>
      ) : null}
    </>
  )
}

  
           
            </div>
            <div className="right"> 
            {/* <Chat></Chat> */}
            </div>
        </div>
    </div>
  )
}

export default Notifications
