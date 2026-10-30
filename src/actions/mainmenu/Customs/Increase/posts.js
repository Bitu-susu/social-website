import conf from "../../../../appwrite/conf";
import { databases, storage } from "./appwritesdk";
import React from "react";
import { Client,Storage,ID,Databases, } from 'appwrite'
import { useState } from "react";

 function usePosts(){
//  let[newpost, setnewpost] = useState(false)
 let[submit, setsubmit] = useState("")
 let[submitshown, setsubmitshown] = useState(false)  
//  const [title, settitle] = useState("")
//  const [category, setcategory] = useState("");
//  const [content, setcontent] = useState("");

async function submitpost({title,category,authid,user,content}){
//    e.preventDefault(); 
    //  setpostdisplay({display : "none"})
    setsubmit("submitting...")
    setsubmitshown(true)
    console.log(title, content);
    
    try {
 const result = await storage.createFile( conf.appwritebucketid,ID.unique(), 
            document.getElementById('uploader').files[0],)
       const tempElement = document.createElement('div');
               tempElement.innerHTML = content;
               const postContent = tempElement.innerText;   
               let url = `https://cloud.appwrite.io/v1/storage/buckets/677eb5a00022f1981a75/files/${result.$id}/view?project=677eb42f003e041a0476`; 
               
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
                  
           if (newdocument) {
                  // alert("your post successfully saved")
                  setsubmit("successfully submitted")
                  setsubmitshown(true)
                //   setnewpost(true)
                  console.log(newdocument);
                  
                  setTimeout(()=>{
                 setsubmitshown(false)
                 setsubmit("")
                  },100)

                 }        
               return newdocument;
    } catch (error) {
             console.log("error in creating post",error);
                  // setsuccess(error)
                  alert(error)
    }
}

async function deletepost(postid){
   try {
      let deletingpost = await databases.deleteDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,postid)

      console.log(deletingpost, "post successfully deleted");
      
   } catch (error) {
     console.log(error);
     
   }
}


return{ submitpost, submit, submitshown, deletepost}
}

export default usePosts;


