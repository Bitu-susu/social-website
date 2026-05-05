
import React from "react"
import { Client,Storage,ID,Databases,Query, } from 'appwrite'
import authService from "../../../../appwrite/auth";
import conf from "../../../../appwrite/conf";
import { databases, storage } from "./appwritesdk";
import { useState } from "react";



const useFetchall  = ()=>{
                              //   for the education section

  const [schoolingname, setschoolingname] = useState("")
  const [highereducation, sethighereducation] = useState("")
  const[schoolpassout, setschoolpassout] = useState("")
  const [gradutionpassout, setgradutionpassout] = useState("")
  const [fetchingeducations, setfetchingeducations] = useState(null)

  // for edit education section

   const [edit1, setedit1] = useState("")
   const [edit2, setedit2] = useState("")
   const [edit3, setedit3] = useState("")
   const [edit4, setedit4] = useState("")

 async function createeducationcredentials(authid) {
   
    try {
      const addeducation = await databases.createDocument(
        conf.appwritedatabaseid,conf.appwriteeducationid, ID.unique(), {
       "schooling": schoolingname,
        "schoolpassout": schoolpassout,
        "highereducation": highereducation,
        "gradutionpassout": gradutionpassout,
        "authid": authid
      })
      // console.log("added education", addeducation);
   return ;
    } catch (error) {
      console.log(error);

    }
  }

  async function fetchingeducation(authid) {
    try {
    
      const educationdetails = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwriteeducationid,[
        Query.equal("authid", authid)]
      )

      let reverseeducation = educationdetails.documents.reverse()
      // setfetchingeducations(reverseeducation[0])
      return reverseeducation[0] 

    } catch (error) {
      console.log(error);

    }
  }

 
 async function editeducationcredentials(authid) {
    
    try {

      const getdocument =  await  databases.listDocuments(
                          conf.appwritedatabaseid,conf.appwriteeducationid,[Query.equal("authid",authid)] 
                        )
         let newdoc = getdocument.documents[0].$id
      const editeducation = await databases.updateDocument(
        conf.appwritedatabaseid,conf.appwriteeducationid, newdoc,{
       "schooling": edit1,
        "schoolpassout": edit2,
        "highereducation": edit3,
        "gradutionpassout": edit4,
        "authid": authid
      })
      console.log("editeducation", editeducation);
      return ;
    } catch (error) {
      console.log(error);

    }
  }

  //    for the employment section 

     const [employment, setemployment] = useState("")
     const [experience, setexperience] = useState("")
     const[emp1, setemp1]= useState("")
     const[emp2, setemp2] = useState("")

  async function createemploymentcredentials(authid) {
   
     try {
       const addemployment = await databases.createDocument(
         conf.appwritedatabaseid, conf.appwriteemploymentid, ID.unique(), {
        "employment": employment,
         "experiance": experience,
         "authid": authid
       })
       // console.log("added education", addeducation);
 
     } catch (error) {
       console.log(error);
 
     }
   }

   async function Fetchingemployment(authid) {
    try {
   
      const employmentdetails = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwriteemploymentid,[
        Query.equal("authid", authid)]
      )
      let reverseemployment = employmentdetails.documents.reverse()
      console.log(reverseemployment, "sddddddddddddddd");
      
      return reverseemployment[0];
    } catch (error) {
      console.log(error);
    }
  }

  async function editemploymentcredentials(authid) {
   
     try {
            const getdocument =  await  databases.listDocuments(
                          conf.appwritedatabaseid,conf.appwriteemploymentid,[Query.equal("authid",authid)] 
                        )
                         let newdoc = getdocument.documents[0].$id
       const addemployment = await databases.updateDocument(
         conf.appwritedatabaseid, conf.appwriteemploymentid, newdoc, {
        "employment": emp1,
         "experiance": emp2,
         "authid": authid
       })
       // console.log("added education", addeducation);
 
     } catch (error) {
       console.log(error);
 
     }
   }

  //   for location section

  const [location, setlocation] = useState("")
  const [location1, setlocation1] = useState("")

   async function createlocationcredentials(authid) {
   
    try {
      const addemployment = await databases.createDocument(
        conf.appwritedatabaseid, conf.appwritelocationid, ID.unique(),{
       "address": location,
        "authid": authid
      })
      // console.log("added education", addeducation);

    } catch (error) {
      console.log(error);

    }
  }

  async function Fetchinglocation(authid) {
    try {
      const locationdetails = await databases.listDocuments(
        conf.appwritedatabaseid, conf.appwritelocationid, [
        Query.equal("authid", authid)]
      )
      let reverselocation = locationdetails.documents.reverse()
      return reverselocation[0]

    } catch (error) {
      console.log(error);

    }
  }

   async function editlocationcredentials(authid) {
   
    try {
      const getdocument =  await  databases.listDocuments(
                          conf.appwritedatabaseid,conf.appwriteemploymentid,[Query.equal("authid",authid)] 
                        )
                         let newdoc = getdocument.documents[0].$id
      const addemployment = await databases.createDocument(
        conf.appwritedatabaseid, conf.appwritelocationid, newdoc,{
       "address": location1,
        "authid": authid
      })
      // console.log("added education", addeducation);

    } catch (error) {
      console.log(error);

    }
  }

  return {schoolingname, setschoolingname, highereducation, sethighereducation,schoolpassout, setschoolpassout,gradutionpassout, setgradutionpassout,createeducationcredentials,fetchingeducation , edit1,edit2,edit3,edit4,
 setedit1, setedit2, setedit3, setedit4,editeducationcredentials,
//   fetching employment and creating employment
Fetchingemployment,createemploymentcredentials,editemploymentcredentials, employment, experience, emp1,emp2,setemployment,setexperience,setemp1,setemp2,
//  fetching location 
location, setlocation,location1, setlocation1,createlocationcredentials,Fetchinglocation,editlocationcredentials

  }
}
export default useFetchall ;