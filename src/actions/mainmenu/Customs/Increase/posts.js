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
    return{ submitpost, submit, submitshown}
}

export default usePosts;


//  async function submitpost(e) {
      //   e.preventDefault(); 
      //   setpostdisplay({display : "none"})
      //   setsubmit("Your post is submitting.........")
      //     setsubmitshown({display : "block"})
      //   const client = new Client().setEndpoint(conf.appwriteurl).setProject(conf.appwriteprojectid);                                                   
      //     //   first uploading image in the post
      //     const storage = new Storage(client);
      //     const databases = new Databases(client);
      //     try {
      //       const result = await storage.createFile( conf.appwritebucketid,ID.unique(), 
      //       document.getElementById('uploader').files[0], // file
      //          ); 
      //         //  await new Promise(resolve => setTimeout(resolve, 0));
      //          const tempElement = document.createElement('div');
      //          tempElement.innerHTML = content;
      //          const postContent = tempElement.innerText;   
      //          let url = `https://cloud.appwrite.io/v1/storage/buckets/677eb5a00022f1981a75/files/${result.$id}/view?project=677eb42f003e041a0476`;
      //           //  then uploading the post title, content, category etc in the database 
      //             const newdocument =  await databases.createDocument(conf.appwritedatabaseid,conf.appwritepostcollectionid,ID.unique(),{
      //               "posttitle" :title,
      //               "postcontent" :postContent,
      //               "featuredimage" :url,
      //               "postcategory":category,
      //               "Date" :  new Date().toDateString(),
      //               "authid" : authid,
      //               "postcreator" :user,
      //               'Like':[],
      //             })
      //            if (newdocument) {
      //             // alert("your post successfully saved")
      //             setsubmit("Your post successfully added")
      //             setnewpost(true)
                 
      //            }
                 
      //     } catch (error) {  
      //        console.log("error in creating post",error);
      //             // setsuccess(error)
      //             alert(error)
            
      //     }
           
      // }