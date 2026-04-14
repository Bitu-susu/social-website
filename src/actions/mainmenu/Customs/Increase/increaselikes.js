import React from "react";
import { Client,Storage,ID,Databases, } from 'appwrite'
 import authService from "../../../../appwrite/auth";
 import conf from "../../../../appwrite/conf";
  import { databases, storage } from "./appwritesdk";
   export async function likesincrease({docid, Like}){
      
      try {
        const user = await authService.getcurrentuser();
        const authid = user.$id 
                
            let updateone = [...Like,authid]
                // console.log(updateone);
                
     const updateddocument = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,docid,{  
                      Like : updateone
                      }   
                     )  
                    //  console.log(updateddocument, "update");  
                     return updateddocument      
                      
            } catch (error) {
                  // console.log("error in updating likes", error);                                                             
            }
   }
    
   export async function likesdecrease({docid, Like}){
               try{
                  const user = await authService.getcurrentuser();
        const authid = user.$id
             let newgetdata = await Like.filter((element)=> {
                return  element!==authid
                }
                )
                // console.log(newgetdata); 
                
                 const updateddocument = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,docid,{  
                        Like: newgetdata  
                       }   
                     ) 
                     return updateddocument
            } catch (error) {
                //  console.log(error);
                 return error
                 
            }
          }




 // onMutate :async({docid})=> {
  //  await queryClient.cancelQueries(["documents", seletorid])
  //   const previousPosts = queryClient.getQueryData(["documents", selectorid])

  //    queryClient.setQueryData(["documents", selectorid], (oldPosts) =>
  //   oldPosts.map((post) => {
  //     if (post.$id === docid && !post.Like.includes(authid)) {
  //       return { ...post, Like: [...post.Like, authid] }
  //     }
  //     return post
  //   })
  // )
  //    return { previousPosts}
  // },