import React from "react";
import conf from "../../../../appwrite/conf";
import { useState } from "react";
import { databases, storage } from "./appwritesdk";
// import authService from '../../../appwrite/auth'
import { Client,Storage,ID,Databases,Query } from 'appwrite'
import { useQuery } from "@tanstack/react-query"; 

function useQuestions(){
    //  const[submitquestion, setsubmitquestion] = useState("")
      // const[questiondisplay, setquestiondisplay] = useState({display : "none"})

      let[submitquestion, setsubmitquestion] = useState("")
 let[questiondisplay, setquestiondisplay] = useState(false)
   async function creatingasksection(questiontitle, authid, user){
    console.log(questiontitle, authid, user);
         
    //   setsubmitquestion("Submitting.......")
    //  setquestiondisplay({display: " block"})
         setsubmitquestion("submitting...")
    setquestiondisplay(true)
     try {
         const askquestion = await databases.createDocument(
             conf.appwritedatabaseid,conf.appwritequestionid,ID.unique(),{
            "question":  questiontitle,
             "authid": authid,
             "creator": user
            }
          )
          if (askquestion) {
              // setsubmitquestion("question added successfully")
              console.log(askquestion);
                 setsubmitquestion("successfully submitted")
                 setquestiondisplay(true)
                       setTimeout(()=>{
                setquestiondisplay(false)
                 setsubmitquestion("")
                  },1500)
          }
          return
        } catch (error) {
        console.log(error);
        
   }
}
return {creatingasksection,submitquestion,questiondisplay}
} 
export default useQuestions