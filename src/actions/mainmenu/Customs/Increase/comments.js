import React from "react";
import conf from "../../../../appwrite/conf";
import { useState } from "react";
import { databases, storage } from "./appwritesdk";
// import authService from '../../../appwrite/auth'
import { Client,Storage,ID,Databases,Query } from 'appwrite'
import { useQuery } from "@tanstack/react-query";  
//   custom hook
function useComments(){

    const[newcomment, setnewcomment] = useState(false)
async function Addcomments({listingsid,addcomments,user,authid,postcreator, posttitle}){

    console.log(listingsid,addcomments,user, authid,postcreator);
     let comment = "comment"
     const addingpic = await  databases.listDocuments(
            conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.equal("authid", authid)]
           )
             let afterfilter = addingpic.documents?.reverse()[0].picurl || null
   try {
        const comments = await databases.createDocument(
               conf.appwritedatabaseid,conf.appwritecommentsid,ID.unique(),{
                 "comments" : addcomments,
                 "postid": listingsid,  // commentsid
                 "name": user,
                 "date":new Date().toDateString(),
                 "authid":authid, 
                 "call" : "comment",
                 "postcreator":postcreator,
                 "post" : posttitle,
                 "giverpic" : afterfilter
               }
             )
             if (comments) {
                 console.log(comments, "comments"); 
             }
             return comments
   } catch (error) {
       console.log(error);
        
   }
}

async function fetchcomments({listingsi}){
    console.log(listingsi, "listings");
      
     try {
         const fetchingcomments = await databases.listDocuments(
            conf.appwritedatabaseid,conf.appwritecommentsid,[Query.equal("postid",listingsi)])
            console.log(fetchingcomments.documents, "documentssss");
            //  adding time 
let addingtime = await fetchingcomments.documents.map((objects)=>{
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

         // return fetchingcomments.documents
            
     } catch (error) {
           console.log(error, "error in fetching comments");
           
     }
    }

   

    async function replycomment({commentsid,replycomments,user,authid}){
        console.log(commentsid,replycomments,user,authid, "aoaaoaoaoa");
        
      try {
         const replycomment = await databases.createDocument(
            conf.appwritedatabaseid,conf.appwritereplyid,ID.unique(),{
               "comment" : replycomments,
               "commentid" : commentsid,
               "authid" : authid,
               "user" : user  
            }
         )
         console.log(replycomment, "replycomment");
         
         return replycomment
      } catch (error) {
         console.log(error, "error in replycomments");
         
      }
    }

    async function fetchreplycomment({listingscomment}){
      try {
        
         const fetchingreplycomments = await databases.listDocuments(
            conf.appwritedatabaseid,conf.appwritereplyid,[Query.equal("commentid",listingscomment)])
            console.log(fetchingreplycomments.documents, "documentssss");
            let addingtime = await fetchingreplycomments.documents.map((objects)=>{
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
    return addingtime.reverse();
        //  return fetchingreplycomments.documents
      } catch (error) {
         console.log(error, "error in fetching replies");
         
      }
    }

    async function deletecomment(commentid){
    try {
        let deletecomment = await databases.deleteDocument(
          conf.appwritedatabaseid,conf.appwritecommentsid,commentid 
        )
        console.log(deletecomment,"comment deleted");
      
    } catch (error) {
        console.log(error, "error");
        
    }
    }

    async function replycommentdelete(commentid){
      try {
          let replydelete = await databases.deleteDocument(
            conf.appwritedatabaseid,conf.appwritereplyid,commentid
          )
          console.log(replydelete, "replycommentdeleted");
          
      } catch (error) {
           console.log(error);
           
      }
    }

   return {Addcomments, fetchcomments, replycomment, fetchreplycomment,deletecomment,replycommentdelete}
}
 export default useComments




