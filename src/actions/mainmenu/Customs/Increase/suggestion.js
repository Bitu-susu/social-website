//  suggestion for the current user 

import conf from "../../../../appwrite/conf";
import { databases, storage } from "./appwritesdk";
import React from "react";
import { Client,Storage,ID,Databases, } from 'appwrite'
import { useState } from "react";
import authService from "../../../../appwrite/auth";
import { Query } from "appwrite";

function usesuggestion(){

    let [asa, setasa] = useState("")



    async function addingsuggestion(){
        try {
             const user = await authService.getcurrentuser();
        const authid = user.$id 
            //  fetching my followers;
            let fetchingfollowers = await databases.listDocuments(
                          conf.appwritedatabaseid,conf.appwritefollowersid,[Query.equal("giver",authid)] 
                        )
                        console.log(fetchingfollowers, "jhgh");
                        
                        let sorting = fetchingfollowers.documents.map((lists)=>  lists.reciever)
            const connections = await databases.listDocuments(
                conf.appwritedatabaseid,conf.appwritefollowersid,
  [
    Query.equal("giver", sorting),
    Query.limit(100)
]
);
console.log(connections, "connections");

let finalmapping = connections.documents.filter((data) =>  data.reciever !== authid )
console.log(finalmapping, "finall");

         
         let array = [];
          
         let arraysorting = finalmapping.map((arr)=>{
              let count = 0
              if (!array.includes(arr.reciever) ) {
                    array.push(arr.reciever)
                 finalmapping.forEach((newarr)=>{
                    if (arr.reciever === newarr.reciever) {
                         count ++ 
                    }
                })
 
                return {id : arr.reciever, mutual : count, dp : arr.recpic, name :arr.
recievername}
                
              }
              
              return null
            })
            console.log(arraysorting , "sorting");
            return arraysorting
        } 
        catch (error) {
            console.log(error, "error");
             return error ;
        }
  
}
   
   return {addingsuggestion, asa}
}
export default usesuggestion