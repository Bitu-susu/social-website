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
async function Addcomments({listingsid,addcomments,user,authid}){

    console.log(listingsid,addcomments,user, authid);
    
   try {
        const comments = await databases.createDocument(
               conf.appwritedatabaseid,conf.appwritecommentsid,ID.unique(),{
                 "comments" : addcomments,
                 "postid": listingsid,  // commentsid
                "name": user,
                 "date":new Date().toDateString(),
                 "authid":authid                                                            
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
            console.log(fetchingcomments.documents);
         return fetchingcomments.documents
            
     } catch (error) {
           console.log(error);
           
     }
    }
   



   return {Addcomments, fetchcomments}
 }
 export default useComments