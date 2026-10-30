import React, { useEffect } from "react";
import { Client,Storage,ID,Databases, } from 'appwrite'
import authService from "../../../../appwrite/auth";
import conf from "../../../../appwrite/conf";
import { databases, storage } from "./appwritesdk";
import { Query } from "appwrite"
export async function likesincrease({docid, Like, creator,postname}){
      
      try {
        const user = await authService.getcurrentuser();
        const authid = user.$id 
        const username = user?.name;    
            let updateone = [...Like, authid]
                console.log(updateone, "hjsfdhbhjsd");
            const increase = "increaselikes"    
     const updateddocument = await databases.updateDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,docid,{  
                      Like : updateone
                      }   
                     )  
                     console.log(updateddocument, "update"); 
       const addingpic = await  databases.listDocuments(
            conf.appwritedatabaseid, conf.appwritebiocollectionid,[Query.equal("authid", authid)]
           )

             let afterfilter
           if (addingpic.documents.length > 0) {
               afterfilter = fetchdp?.documents.reverse()[0].picurl 
          console.log(afterfilter, "afterfilter");
          }
         
            else{
              afterfilter = null
            }

            //  let afterfilter = addingpic.documents?.reverse()[0].picurl || null    
     const addinglikes = await databases.createDocument(conf.appwritedatabaseid,conf.appwritelikesid,ID.unique(),{
        "documentid" : docid,
        "authid" : authid,
         "name" : username,
         "postcreator" : creator,
         "date" : new Date().toDateString(),
         "postname" : postname,
         "call" : "increase",
         "giverpic" : afterfilter
     })
     console.log( addinglikes, "addinglikes");
     
                    //  return updateddocument      
                     
            } catch (error) {
                  console.log("error in updating likes", error);                                                             
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
                     
                    //  first fetch the document 

                  let fetching = await databases.listDocuments(conf.appwritedatabaseid,conf.appwritelikesid,
                    [
                      Query.equal("documentid", docid),Query.equal("authid", authid)
                    ]
                    
                    )
                  console.log(fetching, "fettttt");
                  const deleteid = fetching.documents[0].$id;
                  
                //  then delete the document 
                    let deletinglikes = await databases.deleteDocument(conf.appwritedatabaseid,conf.appwritelikesid,deleteid)
                    console.log(deletinglikes, "deleted");
                    
            } catch (error) {
                 console.log(error);
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